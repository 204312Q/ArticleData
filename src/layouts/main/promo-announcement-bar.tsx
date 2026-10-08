'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Bump the suffix (e.g. EB5OFF-v2) if the promo copy/code ever changes —
// otherwise a customer who dismissed the old banner would never see the new one.
const DISMISS_KEY = 'promo-banner-dismissed:EB5OFF';

export function PromoAnnouncementBar() {
  // null = not checked yet (renders nothing, avoids a dismissed banner
  // flashing on screen before localStorage is read).
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === '1');
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Ignore — worst case the banner reappears next visit.
    }
  };

  if (dismissed !== false) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative', bgcolor: 'primary.main', color: 'common.white' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 1.5, sm: 1.25 }, px: { xs: 5, sm: 6 } }}>
        <Stack
          direction="row"
          useFlexGap
          flexWrap="wrap"
          rowGap={0.75}
          columnGap={{ xs: 1.25, sm: 2 }}
          alignItems="center"
          justifyContent="center"
          sx={{ textAlign: 'center' }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 800, letterSpacing: '0.02em', fontSize: { xs: '0.95rem', sm: '0.875rem' } }}
          >
            Early Bird Special
          </Typography>

          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, opacity: 0.85 }}>
            &middot;
          </Box>

          <Typography
            variant="body2"
            component="span"
            sx={{ fontSize: { xs: '0.95rem', sm: '0.875rem' } }}
          >
            {/* Precise on purpose: Dual qualifies at 14/21/28 days, but Single
                only at 28 days (see product-data.ts promoCodes.conditions) —
                the exact same 4 options are marked on /product for confirmation. */}
            <Box component="span" sx={{ fontWeight: 900, fontSize: '1.15em', mr: 0.75 }}>
              5% off
            </Box>
            Dual Meal{' '}
            <Box component="span" sx={{ fontSize: '0.88em', opacity: 0.85 }}>
              (28/21/14 - Days)
            </Box>{' '}
            &amp; Single Meal{' '}
            <Box component="span" sx={{ fontSize: '0.88em', opacity: 0.85 }}>
              (28 - Days)
            </Box>
          </Typography>

          {/* Pulled out of the sentence and given its own badge treatment so
              the code reads as a distinct, obviously-clickable/copyable thing
              rather than just another bold word in the line. White pill /
              navy text (not the theme palette) — a deliberate one-off pulled
              from the original flyer graphic, per design direction. */}
          <Box
            component="span"
            sx={{
              bgcolor: '#ffffff',
              color: '#2b3f8c',
              fontWeight: 800,
              fontSize: { xs: '0.85rem', sm: '0.78rem' },
              letterSpacing: '0.04em',
              borderRadius: 999,
              px: 1.5,
              py: 0.5,
              flexShrink: 0,
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)',
            }}
          >
            EB5OFF
          </Box>

          <Typography
            component={RouterLink}
            href={paths.product.root}
            variant="body2"
            sx={{
              flexShrink: 0,
              color: 'common.white',
              fontWeight: 700,
              fontSize: { xs: '0.95rem', sm: '0.875rem' },
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
            }}
          >
            Shop packages &rarr;
          </Typography>
        </Stack>
      </Container>

      <IconButton
        aria-label="Dismiss promo banner"
        size="small"
        onClick={handleDismiss}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'common.white',
        }}
      >
        <Iconify icon="mingcute:close-line" width={16} />
      </IconButton>
    </Box>
  );
}
