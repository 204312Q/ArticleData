'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Deliberately importing only this tiny constants-only module, not the
// product/giftbox checkout view components themselves — pulling in either of
// those full 'use client' component files would drag their entire MUI form
// bundle into this page's First Load JS just to read a storage key name.
import {
  GIFT_SET_CART_KEY,
  GIFT_SET_CHECKOUT_KEY,
  GIFTBOX_ORDER_DRAFT_KEY,
  ORDER_DRAFT_STORAGE_KEY,
} from 'src/lib/checkout/storage-keys';

// ----------------------------------------------------------------------

type PaymentConfirmResponse = {
  data?: { paymentStatus: string } | null;
  message?: string;
  status?: number;
};

type CheckoutCompleteResponse = {
  data?: { orderNo?: string | null } | null;
  message?: string;
  status?: number;
};

type DraftKind = 'product' | 'giftbox';

const FLOW_CONFIG = {
  product: {
    draftStorageKey: ORDER_DRAFT_STORAGE_KEY,
    completeEndpoint: '/api/checkout/complete',
    backHref: '/product',
    extraStorageKeys: [] as string[],
  },
  giftbox: {
    draftStorageKey: GIFTBOX_ORDER_DRAFT_KEY,
    completeEndpoint: '/api/checkout/giftbox/complete',
    backHref: '/baby-full-month-gift-set/checkout',
    extraStorageKeys: [GIFT_SET_CHECKOUT_KEY, GIFT_SET_CART_KEY],
  },
} as const;

type ViewState =
  | { status: 'display'; orderNo?: string; ref?: string; draftKind?: DraftKind }
  | { status: 'verifying' }
  | { status: 'pending'; ref: string }
  | { status: 'error'; message: string; backHref: string; ref?: string };

type PendingRetry = {
  stripeSessionId: string;
  orderRef: string;
  draftKind: DraftKind;
};

export function OrderSuccessView() {
  const router = useRouter();
  const [state, setState] = useState<ViewState>({ status: 'verifying' });
  // Kept around only so the error screen's Retry button can re-run
  // verifyAndCompleteOrder with the same identifiers — cleared once an
  // order-success 'display' state is reached, since there's nothing left to retry.
  const [pendingRetry, setPendingRetry] = useState<PendingRetry | null>(null);
  const launchedStripeSessionRef = useRef<string | null>(null);

  // /api/payments/confirm's Stripe branch only re-reads an already-paid
  // Checkout Session by id — it never charges anything. So unlike CyberSource
  // (a fresh in-page authorization per attempt), calling this again after a
  // failure — from the mount effect below, or from the Retry button — can't
  // create a second charge; it just retries the same confirm+complete steps.
  const verifyAndCompleteOrder = useCallback(
    async ({ stripeSessionId, orderRef, draftKind }: PendingRetry): Promise<void> => {
      const config = FLOW_CONFIG[draftKind];
      setState({ status: 'verifying' });

      try {
        const storedDraftRaw = sessionStorage.getItem(config.draftStorageKey);

        const confirmResponse = await fetch('/api/payments/confirm', {
          body: JSON.stringify({ orderReference: orderRef, stripeSessionId }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        const confirmData = (await confirmResponse.json()) as PaymentConfirmResponse;

        if (!confirmResponse.ok || confirmData.status !== 200 || !confirmData.data) {
          throw new Error(confirmData.message || 'Payment verification failed.');
        }

        if (confirmData.data.paymentStatus !== 'AUTHORIZED') {
          throw new Error(
            confirmData.message || `Payment ${confirmData.data.paymentStatus.toLowerCase()}.`
          );
        }

        if (!storedDraftRaw) {
          // Payment is genuinely confirmed above, but this browser lost its
          // local draft — e.g. the Stripe redirect landed back in a
          // different tab/context (new-tab checkout, an in-app browser
          // handing off to the system browser, or a backgrounded mobile tab
          // reloading fresh during a bank OTP/3DS step). There's no draft
          // left to submit here, and no way from the browser alone to know
          // whether the webhook backstop (payments/webhook/route.ts) has
          // already turned this into a real order — so this deliberately
          // does NOT claim "Order Confirmed". It shows a distinct pending
          // state: payment is real, order creation is unconfirmed.
          setPendingRetry(null);
          const cleanParams = new URLSearchParams();
          cleanParams.set('ref', orderRef);
          cleanParams.set('pending', '1');
          router.replace(`/order-success?${cleanParams.toString()}`);
          setState({ status: 'pending', ref: orderRef });
          return;
        }

        // The exact draft shape isn't needed here — it's just forwarded as-is
        // to the complete-order endpoint below, which validates it server-side.
        const storedDraft: unknown = JSON.parse(storedDraftRaw);

        const completeResponse = await fetch(config.completeEndpoint, {
          body: JSON.stringify({ draft: storedDraft, orderReference: orderRef }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        const completeData = (await completeResponse.json()) as CheckoutCompleteResponse;

        if (!completeResponse.ok || completeData.status !== 201 || !completeData.data) {
          throw new Error(
            completeData.message || 'Payment was authorized, but the order was not created.'
          );
        }

        sessionStorage.removeItem(config.draftStorageKey);
        for (const key of config.extraStorageKeys) sessionStorage.removeItem(key);

        const cleanParams = new URLSearchParams();
        if (completeData.data.orderNo) cleanParams.set('orderNo', completeData.data.orderNo);
        cleanParams.set('ref', orderRef);
        cleanParams.set('draftKind', draftKind);
        router.replace(`/order-success?${cleanParams.toString()}`);
        setPendingRetry(null);
        setState({
          status: 'display',
          orderNo: completeData.data.orderNo ?? undefined,
          ref: orderRef,
          draftKind,
        });
      } catch (error) {
        console.error('Order success verification failed.', error);
        setPendingRetry({ stripeSessionId, orderRef, draftKind });
        setState({
          status: 'error',
          message:
            error instanceof Error ? error.message : 'The payment could not be verified.',
          backHref: config.backHref,
          ref: orderRef,
        });
      }
    },
    [router]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stripeSessionId = params.get('stripeSessionId');

    // Already-completed case: the CyberSource in-page flow (and this same
    // effect, once it finishes below) push here with a real orderNo/ref
    // already in hand — nothing left to verify, just display it.
    if (!stripeSessionId) {
      const ref = params.get('ref') ?? undefined;

      // Set by the no-draft branch below on first load — kept in the URL so
      // a page refresh doesn't re-run verification and doesn't flip this
      // back into a false "Order Confirmed" display state either.
      if (params.get('pending') === '1' && ref) {
        setState({ status: 'pending', ref });
        return;
      }

      const orderNo = params.get('orderNo') ?? undefined;
      const draftKind = (params.get('draftKind') as DraftKind | null) ?? undefined;
      setState({ status: 'display', orderNo, ref, draftKind });
      return;
    }

    // Guards against a duplicate confirm+complete round trip if this effect
    // fires twice for the same session (e.g. React Strict Mode's dev-only
    // double-invoke) — the server side is idempotent per orderReference
    // regardless, this just avoids the wasted extra network round trip.
    if (launchedStripeSessionRef.current === stripeSessionId) {
      return;
    }
    launchedStripeSessionRef.current = stripeSessionId;

    const orderRef = params.get('orderRef');
    const draftKind = params.get('draftKind') as DraftKind | null;
    const config = draftKind ? FLOW_CONFIG[draftKind] : null;

    if (!orderRef || !draftKind || !config) {
      setState({
        status: 'error',
        message: 'This payment link is missing information and could not be verified.',
        backHref: '/',
      });
      return;
    }

    verifyAndCompleteOrder({ stripeSessionId, orderRef, draftKind });
    // Runs once on mount to check the return query params — window.location is
    // read directly instead of Next.js's useSearchParams() so this doesn't
    // require wrapping the page in a Suspense boundary.
  }, [verifyAndCompleteOrder]);

  const handleRetry = () => {
    if (pendingRetry) verifyAndCompleteOrder(pendingRetry);
  };

  if (state.status === 'verifying') {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 3,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="h5" fontWeight={700}>
            Verifying your payment…
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will only take a moment. Please don&apos;t close this page.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (state.status === 'pending') {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'success.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
            }}
          >
            ✓
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              Payment Received
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Thank you for your payment. We&apos;re finishing setting up your order — you&apos;ll
              receive a confirmation email shortly.
            </Typography>
          </Box>

          <Box
            sx={{
              width: '100%',
              bgcolor: 'background.neutral',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              px: 3,
              py: 2.5,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Reference
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {state.ref}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            If you don&apos;t receive a confirmation email within a few hours, please contact us
            with this reference and we&apos;ll sort it out.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button component={Link} href="/" variant="contained" size="large">
              Back to Home
            </Button>
            <Button component={Link} href="/product" variant="outlined" size="large">
              View Products
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (state.status === 'error') {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'error.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
            }}
          >
            !
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              We couldn&apos;t confirm your order
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {state.message}
            </Typography>
          </Box>

          {state.ref && (
            <Box
              sx={{
                width: '100%',
                bgcolor: 'background.neutral',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                px: 3,
                py: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Reference
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {state.ref}
              </Typography>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary">
            If you were charged, this reference lets us find your payment — please contact us and
            we&apos;ll sort it out.
          </Typography>

          {pendingRetry && (
            <Typography variant="body2" color="text.secondary">
              Try Retry first — Back to checkout starts a brand new order and a new payment.
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            {pendingRetry && (
              <Button variant="contained" size="large" onClick={handleRetry}>
                Retry
              </Button>
            )}
            <Button
              component={Link}
              href={state.backHref}
              variant={pendingRetry ? 'outlined' : 'contained'}
              size="large"
            >
              Back to checkout
            </Button>
            <Button component={Link} href="/" variant="outlined" size="large">
              Back to Home
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: 'success.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
          }}
        >
          ✓
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h4" fontWeight={700}>
            Order Confirmed!
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Thank you for your order. We have received your payment and your order is being
            processed.
          </Typography>
        </Box>

        {(state.orderNo || state.ref) && (
          <Box
            sx={{
              width: '100%',
              bgcolor: 'background.neutral',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              px: 3,
              py: 2.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {state.orderNo && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Order Number
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {state.orderNo}
                </Typography>
              </Box>
            )}
            {state.ref && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Reference
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {state.ref}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Typography variant="body2" color="text.secondary">
          A confirmation will be sent to you shortly. If you have any questions, please contact us.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button component={Link} href="/" variant="contained" size="large">
            Back to Home
          </Button>
          {state.draftKind === 'giftbox' ? (
            <Button
              component={Link}
              href="/baby-full-month-gift-set"
              variant="outlined"
              size="large"
            >
              View Gift Sets
            </Button>
          ) : (
            <Button component={Link} href="/product" variant="outlined" size="large">
              View Products
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
