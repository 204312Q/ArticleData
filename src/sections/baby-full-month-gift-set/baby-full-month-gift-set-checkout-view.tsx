'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useBlockedDates } from 'src/hooks/use-blocked-dates';

import {
  shouldDisableDate,
  type BlockedDates,
  validateSelectedDate,
  getMinimumSelectableDate,
} from 'src/utils/date-validation';

import { SHIPPING_METHOD_LABEL, computeGiftboxShippingFee } from 'src/lib/checkout/shipping-fee';
import {
  GIFT_SET_CHECKOUT_KEY,
  GIFTBOX_ORDER_DRAFT_KEY,
} from 'src/lib/checkout/storage-keys';
import {
  type PromoCartLine,
  fetchPromoValidation,
  computePromoDiscount,
  type AppliedPromoMeta,
} from 'src/lib/checkout/promo-validation';

import { Iconify } from 'src/components/iconify';

import { GiftSetImportantNotesContent } from './baby-full-month-gift-set-notes';

// ----------------------------------------------------------------------

export { GIFT_SET_CHECKOUT_KEY, GIFTBOX_ORDER_DRAFT_KEY };

// Giftbox orders always need a flat 5 days' lead time from today, regardless
// of weekday/weekend, public holidays, or time of day.
const GIFTBOX_DATE_OPTIONS = { flatLeadDays: 5 };

export type GiftSetCheckoutItem = {
  productId: string;
  productName: string;
  productImage: string;
  productImagePosition: string;
  variantName?: string;
  choiceLabels?: string[];
  selections?: Record<string, string>;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  // The resolved BC item number for this line (product- or variant-level
  // bcNumber) — required to actually create the order; absent only if the
  // catalog never resolved one for this item.
  itemNo?: string;
};

// Promo code, GST, and total are deliberately not carried in this handoff
// state — applying a promo requires a phone number (per-customer redemption
// limits), which is only collected here on the checkout page. This view owns
// and recomputes all of that from `subtotal`; see the promo state below.
export type GiftSetCheckoutState = {
  items: GiftSetCheckoutItem[];
  subtotal: number;
};

type CheckoutFormData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  floor: string;
  unit: string;
  postalCode: string;
  deliveryDate: string;
};

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;

// ----------------------------------------------------------------------

const money = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' });

function safeText(v: string, max = 180) {
  return v.replace(/[<>]/g, '').slice(0, max);
}

function safePhone(v: string) {
  return v.replace(/[^\d+\s\-()]/g, '').slice(0, 20);
}

function safePostalCode(v: string) {
  return v.replace(/\D/g, '').slice(0, 6);
}

function validateForm(form: CheckoutFormData, blockedDates?: BlockedDates): FormErrors {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!form.phone.trim()) errors.phone = 'Phone number is required.';

  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!form.postalCode.trim()) {
    errors.postalCode = 'Postal code is required.';
  } else if (form.postalCode.length !== 6) {
    errors.postalCode = 'Postal code must be exactly 6 digits.';
  }

  if (!form.address.trim()) errors.address = 'Delivery address is required.';
  if (!form.unit.trim()) errors.unit = 'Unit is required.';

  const dateValidation = validateSelectedDate(form.deliveryDate, GIFTBOX_DATE_OPTIONS, blockedDates);
  if (!dateValidation.isValid) errors.deliveryDate = dateValidation.message;

  return errors;
}

// The draft persisted to sessionStorage across the Stripe redirect round
// trip, and sent to /api/payments/giftbox/session + /api/checkout/giftbox/complete.
// Shape mirrors giftboxDraftSchema on the server (src/lib/checkout/adapt-giftbox-draft.ts).
export type GiftboxOrderDraft = {
  draftId: string;
  items: Array<{
    productId: string;
    productName: string;
    itemNo: string;
    variantName?: string;
    choiceLabels?: string[];
    selections?: Record<string, string>;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  delivery: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    floor: string;
    unit: string;
    postalCode: string;
    deliveryDate: string;
  };
  pricing: {
    subtotal: number;
    promoCode: string | null;
    promoDiscount: number;
    gstAmount: number;
    total: number;
    shippingMethod: 'FREE' | 'STANDARD';
    shippingAmount: number;
  };
};

type PaymentSessionResponse = {
  data?: {
    captureContext?: string;
    gateway?: 'cybersource' | 'stripe';
    orderReference?: string;
    sessionId?: string;
    url?: string;
  } | null;
  message?: string;
  status?: number;
};

function createGiftboxDraftId(): string {
  const randomSuffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8).toUpperCase()
      : Math.random().toString(36).slice(2, 10).toUpperCase();

  return `GIFT-${dayjs().format('YYYYMMDD-HHmmss')}-${randomSuffix}`;
}

type GiftboxPricing = {
  promoCode: string | null;
  promoDiscount: number;
  gstAmount: number;
  total: number;
};

function buildGiftboxOrderDraft(
  state: GiftSetCheckoutState,
  form: CheckoutFormData,
  pricing: GiftboxPricing
): GiftboxOrderDraft {
  const shippingFee = computeGiftboxShippingFee(pricing.total);

  return {
    draftId: createGiftboxDraftId(),
    delivery: {
      address: form.address,
      deliveryDate: form.deliveryDate,
      email: form.email,
      floor: form.floor,
      fullName: form.fullName,
      phone: form.phone,
      postalCode: form.postalCode,
      unit: form.unit,
    },
    items: state.items.map((item) => ({
      choiceLabels: item.choiceLabels,
      selections: item.selections,
      itemNo: item.itemNo!,
      lineTotal: item.lineTotal,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      variantName: item.variantName,
    })),
    pricing: {
      gstAmount: pricing.gstAmount,
      promoCode: pricing.promoCode,
      promoDiscount: pricing.promoDiscount,
      subtotal: state.subtotal,
      total: pricing.total,
      shippingMethod: shippingFee.method,
      shippingAmount: shippingFee.amount,
    },
  };
}

// ----------------------------------------------------------------------

function ConfigCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card sx={{ borderTop: '5px solid', borderColor: 'primary.main', borderRadius: '4px 4px 0 0' }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ mt: 2 }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

function PaymentOptionCard({
  title,
  subtitle,
  icon,
  selected,
  disabled = false,
  onClick,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
      sx={{
        px: 2,
        py: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? (theme) => alpha(theme.palette.primary.main, 0.06) : 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        outline: 'none',
        '&:focus-visible': { boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}` },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: selected ? 'primary.main' : 'grey.400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            mt: 0.3,
          }}
        >
          {selected && (
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
          )}
        </Box>

        {icon && (
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: selected ? (theme) => alpha(theme.palette.primary.main, 0.12) : 'grey.100',
              color: selected ? 'primary.main' : 'text.secondary',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2">{title}</Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
  color,
}: {
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="body2" color={color ?? 'text.secondary'}>
        {label}
      </Typography>
      <Typography variant={bold ? 'subtitle1' : 'body2'} fontWeight={bold ? 700 : 600} color={color ?? 'text.primary'}>
        {value}
      </Typography>
    </Stack>
  );
}

function GiftSetPromoSection({
  promoInput,
  onPromoInputChange,
  promoMessage,
  appliedPromoCode,
  promoLoading,
  onApply,
  onRemove,
}: {
  promoInput: string;
  onPromoInputChange: (value: string) => void;
  promoMessage: string | null;
  appliedPromoCode: string | null;
  promoLoading: boolean;
  onApply: () => void;
  onRemove: () => void;
}) {
  if (!appliedPromoCode) {
    return (
      <Stack spacing={0.75}>
        <TextField
          size="small"
          fullWidth
          value={promoInput}
          placeholder="Promo code"
          onChange={(e) => onPromoInputChange(e.target.value)}
          error={!!promoMessage}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="text"
                    size="small"
                    onClick={onApply}
                    disabled={!promoInput.trim() || promoLoading}
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 600,
                      textTransform: 'none',
                      minWidth: 'auto',
                      px: 1,
                    }}
                  >
                    {promoLoading ? 'Applying…' : 'Apply'}
                  </Button>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              '& fieldset': { borderColor: 'grey.300' },
              '&:hover fieldset': { borderColor: 'grey.400' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
          }}
        />
        {!!promoMessage && (
          <Typography variant="caption" color="error.main">
            {promoMessage}
          </Typography>
        )}
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        px: 1.75,
        py: 1.5,
        borderRadius: 2,
        bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
        border: '1px solid',
        borderColor: (theme) => alpha(theme.palette.success.main, 0.18),
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
            Promo code applied!
          </Typography>
          <Typography variant="subtitle2" color="success.dark" fontWeight={700}>
            {appliedPromoCode}
          </Typography>
          {promoMessage && (
            <Typography variant="caption" color="text.secondary">
              {promoMessage}
            </Typography>
          )}
        </Box>
        <Button
          variant="text"
          size="small"
          sx={{ color: 'text.secondary', minWidth: 'auto', px: 0 }}
          onClick={onRemove}
        >
          Remove
        </Button>
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

const EMPTY_FORM: CheckoutFormData = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  floor: '',
  unit: '',
  postalCode: '',
  deliveryDate: '',
};

export function GiftSetCheckoutView() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:899px)');
  const [state, setState] = useState<GiftSetCheckoutState | null>(null);
  const [form, setForm] = useState<CheckoutFormData>(() => ({
    ...EMPTY_FORM,
    deliveryDate: getMinimumSelectableDate(undefined, GIFTBOX_DATE_OPTIONS).format('YYYY-MM-DD'),
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentBusy, setPaymentBusy] = useState(false);
  // Success redirects straight to /order-success (same shared page the
  // product checkout uses) — this only ever needs to represent an error.
  const [paymentResult, setPaymentResult] = useState<'idle' | 'error'>('idle');
  const [paymentResultMessage, setPaymentResultMessage] = useState('');
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false);
  const blockedDates = useBlockedDates();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [appliedPromoMeta, setAppliedPromoMeta] = useState<AppliedPromoMeta | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const promoCustomerKeyRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(GIFT_SET_CHECKOUT_KEY);
      if (!raw) {
        router.replace('/baby-full-month-gift-set');
        return;
      }
      setState(JSON.parse(raw) as GiftSetCheckoutState);
    } catch {
      router.replace('/baby-full-month-gift-set');
    }
  }, [router]);

  // Stripe's cancel_url still points back here (its success_url now goes
  // straight to /order-success, which does its own verification — see
  // OrderSuccessView). This just strips the query param on a cancelled return.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('stripeCancelled')) {
      router.replace('/baby-full-month-gift-set/checkout');
    }
  }, [router]);

  const setField = <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // Cart lines sent with promo validation — mirrors the subtotal composition
  // so item-scoped promos are checked against the actual selected products.
  const subtotal = state?.subtotal ?? 0;
  const promoCartLines: PromoCartLine[] = (state?.items ?? []).map((item) => ({
    lineAmount: item.lineTotal,
    productNo: item.itemNo,
  }));
  // Some promo codes are limited per phone/email — editing either after a
  // successful apply must invalidate the stale result, same as the package
  // checkout does.
  const promoCustomerKey = `${form.email.trim().toLowerCase()}|${form.phone.trim()}`;

  const promoDiscount = appliedPromoCode ? computePromoDiscount(appliedPromoMeta, subtotal) : 0;
  const total = Math.max(0, subtotal - promoDiscount);
  const gstAmount = (total * 9) / 109;

  useEffect(() => {
    const customerChanged =
      promoCustomerKeyRef.current !== null && promoCustomerKeyRef.current !== promoCustomerKey;
    promoCustomerKeyRef.current = promoCustomerKey;

    if (customerChanged && appliedPromoCode && appliedPromoMeta) {
      setAppliedPromoMeta(null);
      setPromoMessage('Promo code was removed because your contact details changed. Please re-apply it.');
    }
    // appliedPromoCode/appliedPromoMeta are intentionally read at effect-run
    // time only — this is keyed on promoCustomerKey so it only fires when the
    // email/phone actually changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promoCustomerKey]);

  const applyPromo = async () => {
    // Required up front, not just at the "Place Order" gate — some promo
    // codes are tracked per phone number (one redemption per customer), and
    // that check can only run once we actually have a phone to check against.
    if (!form.phone.trim()) {
      setPromoMessage('Please enter your phone number above before applying a promo code.');
      setAppliedPromoCode(null);
      setAppliedPromoMeta(null);
      return;
    }

    // Sent exactly as typed: CT Backend matches promo codes case-sensitively,
    // and some codes are mixed case (MummiesClub10).
    const code = promoInput.trim();
    if (!code) {
      return;
    }

    setPromoLoading(true);
    setPromoMessage(null);

    const result = await fetchPromoValidation(
      code,
      subtotal,
      promoCartLines,
      form.email.trim() || undefined,
      form.phone.trim() || undefined
    );

    setPromoLoading(false);

    if (!result.ok) {
      setPromoMessage(result.reason);
      setAppliedPromoCode(null);
      setAppliedPromoMeta(null);
      return;
    }

    setAppliedPromoMeta(result.meta);
    setAppliedPromoCode(code);
    setPromoMessage(result.description ?? 'Promo code applied!');
  };

  const removePromo = () => {
    setAppliedPromoCode(null);
    setAppliedPromoMeta(null);
    setPromoMessage(null);
    setPromoInput('');
  };

  const handleSubmit = async () => {
    const validation = validateForm(form, blockedDates);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    if (!state) return;

    if (state.items.some((item) => !item.itemNo)) {
      setPaymentResult('error');
      setPaymentResultMessage(
        'One or more items in your cart could not be matched to our catalog. Please remove and re-add them, or contact us for help.'
      );
      return;
    }

    setPaymentBusy(true);

    // Final promo re-check, phone-aware. The Apply-click validation may be
    // stale by the time the customer actually pays (code disabled, per-phone
    // limit reached in the meantime) — re-verify right before charging, same
    // as the package checkout does.
    let finalPromoCode: string | null = null;
    let finalPromoMeta: AppliedPromoMeta | null = null;

    if (appliedPromoCode) {
      const recheck = await fetchPromoValidation(
        appliedPromoCode,
        state.subtotal,
        promoCartLines,
        form.email.trim() || undefined,
        form.phone.trim() || undefined
      );

      if (!recheck.ok) {
        setPaymentBusy(false);
        setAppliedPromoCode(null);
        setAppliedPromoMeta(null);
        setPaymentResult('error');
        setPaymentResultMessage(
          `Your promo code is no longer valid: ${recheck.reason}. Please review your order summary and try again.`
        );
        return;
      }

      finalPromoCode = appliedPromoCode;
      finalPromoMeta = recheck.meta;
    }

    const finalPromoDiscount = computePromoDiscount(finalPromoMeta, state.subtotal);
    const finalTotal = Math.max(0, state.subtotal - finalPromoDiscount);
    const finalGstAmount = (finalTotal * 9) / 109;

    try {
      const draft = buildGiftboxOrderDraft(state, form, {
        promoCode: finalPromoCode,
        promoDiscount: finalPromoDiscount,
        gstAmount: finalGstAmount,
        total: finalTotal,
      });
      sessionStorage.setItem(GIFTBOX_ORDER_DRAFT_KEY, JSON.stringify(draft));

      // The real gateway charge is items total + the tiered shipping fee —
      // draft.pricing.total itself stays items-only (see shipping-fee.ts).
      const chargeAmount = draft.pricing.total + draft.pricing.shippingAmount;

      const response = await fetch('/api/payments/giftbox/session', {
        body: JSON.stringify({
          amount: chargeAmount.toFixed(2),
          currency: 'SGD',
          customer: { email: form.email, phoneNumber: form.phone },
          draft,
          orderReference: draft.draftId,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const data = (await response.json()) as PaymentSessionResponse;

      if (!response.ok || data.status !== 200 || !data.data) {
        throw new Error(data.message || 'Unable to start the payment checkout.');
      }

      if (data.data.gateway !== 'stripe' || !data.data.url) {
        throw new Error('This payment method is not yet supported for gift set orders.');
      }

      window.location.href = data.data.url;
    } catch (error) {
      setPaymentBusy(false);
      setPaymentResult('error');
      setPaymentResultMessage(
        error instanceof Error ? error.message : 'Unable to start the payment checkout.'
      );
    }
  };

  if (!state) return null;

  const shippingFee = computeGiftboxShippingFee(total);
  const grandTotal = total + shippingFee.amount;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 5, md: 8 }, pb: { xs: 'calc(140px + env(safe-area-inset-bottom))', md: 8 } }}
    >
      {/* Back link */}
      <Button
        variant="text"
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        onClick={() => router.back()}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back to gift sets
      </Button>

      <Typography variant="h4" sx={{ mb: 4 }}>
        Checkout
      </Typography>

      <Grid container spacing={3} alignItems="flex-start">
        {/* Left column — forms */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Delivery details */}
            <ConfigCard title="Delivery Details">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    required
                    value={form.fullName}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    onChange={(e) => setField('fullName', safeText(e.target.value, 80))}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    required
                    value={form.phone}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    onChange={(e) => setField('phone', safePhone(e.target.value))}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <DatePicker
                    label="Delivery Date"
                    value={form.deliveryDate ? dayjs(form.deliveryDate) : null}
                    minDate={getMinimumSelectableDate(undefined, GIFTBOX_DATE_OPTIONS)}
                    format="DD/MM/YYYY"
                    shouldDisableDate={(date) =>
                      shouldDisableDate(date, GIFTBOX_DATE_OPTIONS, blockedDates)
                    }
                    onChange={(newValue) =>
                      setField(
                        'deliveryDate',
                        newValue && newValue.isValid() ? newValue.format('YYYY-MM-DD') : ''
                      )
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.deliveryDate,
                        helperText: errors.deliveryDate,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    required
                    type="email"
                    value={form.email}
                    error={!!errors.email}
                    helperText={errors.email}
                    onChange={(e) => setField('email', safeText(e.target.value, 80))}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    required
                    value={form.postalCode}
                    error={!!errors.postalCode}
                    helperText={errors.postalCode}
                    onChange={(e) => setField('postalCode', safePostalCode(e.target.value))}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Delivery Address"
                    required
                    value={form.address}
                    error={!!errors.address}
                    helperText={errors.address}
                    onChange={(e) => setField('address', safeText(e.target.value))}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Floor (optional)"
                    value={form.floor}
                    onChange={(e) => setField('floor', safeText(e.target.value, 80))}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Unit"
                    required
                    value={form.unit}
                    error={!!errors.unit}
                    helperText={errors.unit}
                    onChange={(e) => setField('unit', safeText(e.target.value, 80))}
                  />
                </Grid>
              </Grid>
            </ConfigCard>

            {/* Payment preference */}
            <ConfigCard title="Payment Preference">
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                    Payment Method
                  </Typography>
                  <Stack spacing={1.5}>
                    <PaymentOptionCard
                      title="Full Payment"
                      subtitle="Pay the full amount upfront."
                      selected
                      onClick={() => {}}
                    />
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                    Payment Type
                  </Typography>
                  <PaymentOptionCard
                    title="Online Payment"
                    icon={<Iconify icon="solar:bill-list-bold" width={22} />}
                    selected
                    onClick={() => {}}
                  />
                </Box>
              </Stack>
            </ConfigCard>

            {/* Important notes */}
            <ConfigCard title="Important Notes">
              <GiftSetImportantNotesContent />
            </ConfigCard>
          </Stack>
        </Grid>

        {/* Right column — order summary (desktop only) */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
            <ConfigCard title="Order Summary">
              <Stack spacing={2}>
                {/* Items */}
                <Stack spacing={1.75} divider={<Divider />}>
                  {state.items.map((item) => (
                    <Stack key={item.productId} direction="row" spacing={1.5} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          flexShrink: 0,
                          borderRadius: 1.5,
                          overflow: 'hidden',
                          position: 'relative',
                          bgcolor: 'grey.100',
                        }}
                      >
                        <Image
                          fill
                          alt={item.productName}
                          src={item.productImage}
                          sizes="56px"
                          style={{ objectFit: 'cover', objectPosition: item.productImagePosition }}
                        />
                      </Box>

                      <Stack spacing={0.25} sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ lineHeight: 1.3 }}>
                          {item.productName}
                        </Typography>
                        {item.variantName && (
                          <Typography variant="caption" color="primary.main">
                            {item.variantName}
                          </Typography>
                        )}
                        {item.choiceLabels?.map((label) => (
                          <Typography key={label} variant="caption" color="text.secondary">
                            {label}
                          </Typography>
                        ))}
                        <Typography variant="caption" color="text.secondary">
                          {item.quantity} × {money.format(item.unitPrice)}
                        </Typography>
                      </Stack>

                      <Typography variant="subtitle2" sx={{ flexShrink: 0 }}>
                        {money.format(item.lineTotal)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Divider />

                {/* Promo code */}
                <GiftSetPromoSection
                  promoInput={promoInput}
                  onPromoInputChange={setPromoInput}
                  promoMessage={promoMessage}
                  appliedPromoCode={appliedPromoCode}
                  promoLoading={promoLoading}
                  onApply={applyPromo}
                  onRemove={removePromo}
                />

                {/* Pricing breakdown */}
                <Stack spacing={1}>
                  <SummaryRow label="Subtotal" value={money.format(subtotal)} />
                  {!!appliedPromoCode && (
                    <SummaryRow
                      label={`Discount (${appliedPromoCode})`}
                      value={`- ${money.format(promoDiscount)}`}
                      color="success.main"
                    />
                  )}
                  <SummaryRow label="GST (9% incl.)" value={money.format(gstAmount)} />
                  <SummaryRow label="Total" value={money.format(total)} />
                  <SummaryRow
                    label={`Shipping (${SHIPPING_METHOD_LABEL[shippingFee.method]})`}
                    value={shippingFee.amount === 0 ? 'Free' : money.format(shippingFee.amount)}
                  />
                  <Divider />
                  <SummaryRow label="Grand Total" value={money.format(grandTotal)} bold />
                </Stack>

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  disabled={paymentBusy}
                  onClick={handleSubmit}
                  startIcon={<Iconify icon="solar:cart-3-bold" />}
                >
                  {paymentBusy ? 'Redirecting to payment...' : 'Place Order'}
                </Button>
              </Stack>
            </ConfigCard>
          </Box>
        </Grid>
      </Grid>

      {/* Mobile fixed bottom bar */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            px: 2,
            pt: 1.5,
            pb: 'calc(16px + env(safe-area-inset-bottom))',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 24%, rgba(255,255,255,1) 100%)',
          }}
        >
          <Card sx={{ borderRadius: 4, boxShadow: 10 }}>
            <Stack spacing={1.5} sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Order summary
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {money.format(grandTotal)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setSummaryDrawerOpen(true)}
                  sx={{ flexShrink: 0 }}
                >
                  View details
                </Button>
              </Stack>
              <Button
                fullWidth
                size="large"
                variant="contained"
                disabled={paymentBusy}
                onClick={handleSubmit}
                startIcon={<Iconify icon="solar:cart-3-bold" />}
              >
                {paymentBusy ? 'Redirecting to payment...' : 'Place Order'}
              </Button>
            </Stack>
          </Card>
        </Box>
      )}

      {/* Mobile order summary drawer */}
      <Drawer
        anchor="bottom"
        open={summaryDrawerOpen}
        onClose={() => setSummaryDrawerOpen(false)}
        slotProps={{
          paper: { sx: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '88vh' } },
        }}
      >
        <Box
          sx={{
            px: 2,
            pt: 1.5,
            pb: 'calc(24px + env(safe-area-inset-bottom))',
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 5,
              borderRadius: 999,
              bgcolor: 'grey.300',
              mx: 'auto',
              mb: 2,
            }}
          />
          <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Summary
              </Typography>
              <Stack spacing={2}>
                <Stack spacing={1.75} divider={<Divider />}>
                  {state.items.map((item) => (
                    <Stack key={item.productId} direction="row" spacing={1.5} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          flexShrink: 0,
                          borderRadius: 1.5,
                          overflow: 'hidden',
                          position: 'relative',
                          bgcolor: 'grey.100',
                        }}
                      >
                        <Image
                          fill
                          alt={item.productName}
                          src={item.productImage}
                          sizes="52px"
                          style={{ objectFit: 'cover', objectPosition: item.productImagePosition }}
                        />
                      </Box>
                      <Stack spacing={0.25} sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ lineHeight: 1.3 }}>
                          {item.productName}
                        </Typography>
                        {item.variantName && (
                          <Typography variant="caption" color="primary.main">
                            {item.variantName}
                          </Typography>
                        )}
                        {item.choiceLabels?.map((label) => (
                          <Typography key={label} variant="caption" color="text.secondary">
                            {label}
                          </Typography>
                        ))}
                        <Typography variant="caption" color="text.secondary">
                          {item.quantity} × {money.format(item.unitPrice)}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2" sx={{ flexShrink: 0 }}>
                        {money.format(item.lineTotal)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Divider />

                {/* Promo code */}
                <GiftSetPromoSection
                  promoInput={promoInput}
                  onPromoInputChange={setPromoInput}
                  promoMessage={promoMessage}
                  appliedPromoCode={appliedPromoCode}
                  promoLoading={promoLoading}
                  onApply={applyPromo}
                  onRemove={removePromo}
                />

                <Stack spacing={1}>
                  <SummaryRow label="Subtotal" value={money.format(subtotal)} />
                  {!!appliedPromoCode && (
                    <SummaryRow
                      label={`Discount (${appliedPromoCode})`}
                      value={`- ${money.format(promoDiscount)}`}
                      color="success.main"
                    />
                  )}
                  <SummaryRow label="GST (9% incl.)" value={money.format(gstAmount)} />
                  <SummaryRow label="Total" value={money.format(total)} />
                  <SummaryRow
                    label={`Shipping (${SHIPPING_METHOD_LABEL[shippingFee.method]})`}
                    value={shippingFee.amount === 0 ? 'Free' : money.format(shippingFee.amount)}
                  />
                  <Divider />
                  <SummaryRow label="Grand Total" value={money.format(grandTotal)} bold />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Drawer>

      <Dialog
        open={paymentResult !== 'idle'}
        onClose={() => setPaymentResult('idle')}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Payment Issue</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {paymentResultMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setPaymentResult('idle')}>
            Try Again
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
    </LocalizationProvider>
  );
}
