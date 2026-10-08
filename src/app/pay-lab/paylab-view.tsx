'use client';

import type { UnifiedCheckoutPhase } from 'src/lib/payment-gateway/unified-checkout';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { runUnifiedCheckout } from 'src/lib/payment-gateway/unified-checkout';

// ----------------------------------------------------------------------

const PAYMENT_SELECTION_CONTAINER_ID = 'paylabPaymentSelectionContainer';
const PAYMENT_SCREEN_CONTAINER_ID = 'paylabPaymentScreenContainer';

type PaymentType = 'PANENTRY' | 'CLICKTOPAY' | 'GOOGLEPAY' | 'APPLEPAY';

const PAYMENT_TYPE_OPTIONS: Array<{ value: PaymentType; label: string; hint: string }> = [
  { value: 'PANENTRY', label: 'Card', hint: 'Any browser' },
  { value: 'CLICKTOPAY', label: 'Click to Pay', hint: 'Pair with Card — needs a fallback' },
  { value: 'GOOGLEPAY', label: 'Google Pay', hint: 'Chrome, saved card required' },
  { value: 'APPLEPAY', label: 'Apple Pay', hint: 'Safari on macOS/iOS only' },
];

type LabPhase = 'idle' | 'creating-session' | UnifiedCheckoutPhase | 'done' | 'error';

const PHASE_LABEL: Record<LabPhase, string> = {
  idle: 'Idle',
  'creating-session': 'Requesting capture context…',
  'loading-sdk': 'Loading CyberSource SDK…',
  'awaiting-input': 'Waiting for payment input…',
  verifying: 'Authorising…',
  done: 'Finished',
  error: 'Failed',
};

type SessionInfo = {
  correlationId: string | null;
  orderReference: string;
  targetOrigin: string;
};

type ApiEnvelope<T> = {
  data?: T | null;
  message?: string;
  status?: number;
};

type SessionData = SessionInfo & { captureContext: string };

function JsonBlock({ value }: { value: unknown }) {
  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        p: 2,
        fontSize: 12,
        lineHeight: 1.6,
        overflowX: 'auto',
        borderRadius: 1,
        bgcolor: 'grey.900',
        color: 'common.white',
        fontFamily: 'ui-monospace, Consolas, monospace',
      }}
    >
      {JSON.stringify(value, null, 2)}
    </Box>
  );
}

export function PayLabView() {
  const [amount, setAmount] = useState('1.00');
  const [currency, setCurrency] = useState('SGD');
  const [email, setEmail] = useState('paylab@example.com');
  const [phoneNumber, setPhoneNumber] = useState('+6580000000');
  const [selectedTypes, setSelectedTypes] = useState<PaymentType[]>(['PANENTRY']);

  const [phase, setPhase] = useState<LabPhase>('idle');
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const isBusy = phase !== 'idle' && phase !== 'done' && phase !== 'error';

  const togglePaymentType = (value: PaymentType, checked: boolean) => {
    setSelectedTypes((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleRun = useCallback(async () => {
    setError(null);
    setResult(null);
    setSession(null);
    setPhase('creating-session');

    try {
      const sessionResponse = await fetch('/api/paylab/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allowedPaymentTypes: selectedTypes,
          amount,
          currency,
          email,
          phoneNumber,
        }),
      });
      const sessionBody = (await sessionResponse.json()) as ApiEnvelope<SessionData>;

      if (!sessionResponse.ok || !sessionBody.data) {
        throw new Error(sessionBody.message || 'Failed to create the capture context.');
      }

      const { captureContext, ...info } = sessionBody.data;
      setSession(info);

      const { resultJwt, transientToken } = await runUnifiedCheckout({
        captureContext,
        onPhase: setPhase,
        paymentScreenSelector: `#${PAYMENT_SCREEN_CONTAINER_ID}`,
        paymentSelectionSelector: `#${PAYMENT_SELECTION_CONTAINER_ID}`,
      });

      const confirmResponse = await fetch('/api/paylab/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: info.orderReference,
          resultJwt,
          transientToken,
        }),
      });
      const confirmBody = (await confirmResponse.json()) as ApiEnvelope<unknown>;

      setResult(confirmBody);
      setPhase('done');

      if (!confirmResponse.ok) {
        setError(confirmBody.message || 'Authorisation did not succeed.');
      }
    } catch (caught) {
      console.error('[pay-lab] run failed', caught);
      setError(caught instanceof Error ? caught.message : 'The checkout run failed.');
      setPhase('error');
    }
  }, [amount, currency, email, phoneNumber, selectedTypes]);

  const browserOrigin = typeof window === 'undefined' ? '' : window.location.origin;
  const originMismatch = !!session && session.targetOrigin !== browserOrigin;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Payment Lab
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Internal harness for CyberSource Unified Checkout. Creates a capture context, runs the
            wallet, and authorises — then stops. No payment record is stored and no order is
            created.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 380px) minmax(0, 1fr)' },
          }}
        >
          {/* ---------------- controls ---------------- */}
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack spacing={2.5}>
              <Typography variant="subtitle2">Session</Typography>

              <Stack direction="row" spacing={1.5}>
                <TextField
                  size="small"
                  label="Amount"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  disabled={isBusy}
                  fullWidth
                />
                <TextField
                  size="small"
                  label="Currency"
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  disabled={isBusy}
                  sx={{ width: 110 }}
                />
              </Stack>

              <TextField
                size="small"
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isBusy}
                fullWidth
              />
              <TextField
                size="small"
                label="Phone"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                disabled={isBusy}
                fullWidth
              />

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Payment types
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Test one at a time — a failure is only diagnostic if you know which type caused
                  it.
                </Typography>
                <Stack sx={{ mt: 1 }}>
                  {PAYMENT_TYPE_OPTIONS.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedTypes.includes(option.value)}
                          onChange={(event) =>
                            togglePaymentType(option.value, event.target.checked)
                          }
                          disabled={isBusy}
                        />
                      }
                      label={
                        <span>
                          {option.label}{' '}
                          <Typography component="span" variant="caption" color="text.secondary">
                            — {option.hint}
                          </Typography>
                        </span>
                      }
                    />
                  ))}
                </Stack>
              </Box>

              <Button
                variant="contained"
                onClick={handleRun}
                disabled={isBusy || selectedTypes.length === 0}
                startIcon={isBusy ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                {isBusy ? PHASE_LABEL[phase] : 'Start checkout'}
              </Button>

              {phase !== 'idle' && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    size="small"
                    label={PHASE_LABEL[phase]}
                    color={phase === 'error' ? 'error' : phase === 'done' ? 'success' : 'default'}
                  />
                </Stack>
              )}
            </Stack>
          </Paper>

          {/* ---------------- checkout + output ---------------- */}
          <Stack spacing={2.5}>
            {!!error && <Alert severity="error">{error}</Alert>}

            {originMismatch && (
              <Alert severity="warning">
                <strong>Origin mismatch.</strong> The capture context was issued for{' '}
                <code>{session?.targetOrigin}</code> but this page is{' '}
                <code>{browserOrigin}</code>. Unified Checkout will refuse to render — fix{' '}
                <code>PG_TARGET_ORIGIN</code>.
              </Alert>
            )}

            {!!session && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Session
                </Typography>
                <Stack spacing={0.5} sx={{ fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 12 }}>
                  <span>orderReference: {session.orderReference}</span>
                  <span>targetOrigin: {session.targetOrigin}</span>
                  <span>correlationId: {session.correlationId ?? '—'}</span>
                </Stack>
              </Paper>
            )}

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Unified Checkout
              </Typography>
              {/* Both containers must exist in the DOM before show() is called. */}
              <Box id={PAYMENT_SELECTION_CONTAINER_ID} sx={{ minHeight: 8 }} />
              <Box id={PAYMENT_SCREEN_CONTAINER_ID} sx={{ minHeight: 120, mt: 1 }} />
              {phase === 'idle' && (
                <Typography variant="caption" color="text.secondary">
                  The payment UI renders here once a session is started.
                </Typography>
              )}
            </Paper>

            {!!result && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Gateway response
                </Typography>
                <JsonBlock value={result} />
              </Paper>
            )}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
