'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AboutVision() {
  return (
    <Box component="section" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 5, md: 7 } }}>
      <Container component={MotionViewport} maxWidth="md">
        <Stack spacing={2.5} sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography
            component={m.h1}
            variants={varFade('inUp')}
            variant="h2"
            sx={{ color: 'primary.main', maxWidth: 760 }}
          >
            Trusted By Mothers Since 2011
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
