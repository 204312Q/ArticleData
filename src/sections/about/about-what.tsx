'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AboutWhat() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        ml: '-50vw',
        mr: '-50vw',
        minHeight: { xs: 820, md: 620 },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/aboutUs/owner2.avif)',
          backgroundSize: 'cover',
          backgroundPosition: { xs: '22% center', md: 'center' },
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(31, 41, 55, 0.58) 0%, rgba(31, 41, 55, 0.38) 45%, rgba(31, 41, 55, 0.52) 100%)',
        }}
      />

      <Container
        component={MotionViewport}
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-start' },
          alignItems: { xs: 'flex-start', md: 'center' },
          pt: { xs: 7, md: 0 },
          pb: { xs: 7, md: 0 },
          minHeight: { xs: 820, md: 620 },
        }}
      >
        <Box
          sx={(theme) => ({
            width: { xs: 'calc(100% - 56px)', md: 680 },
            maxWidth: { xs: 360, sm: 380, md: 680 },
            p: { xs: 3, sm: 3.5, md: 4 },
            borderRadius: { xs: 3, md: 4 },
            color: 'text.primary',
            border: `1px solid ${alpha(theme.palette.grey[900], 0.08)}`,
            backgroundColor: theme.palette.common.white,
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.14)',
          })}
        >
          <Typography
            component={m.p}
            variants={varFade('inUp')}
            sx={{
              color: 'text.secondary',
              lineHeight: { xs: 1.75, md: 1.65 },
              fontSize: { xs: '1rem', md: '1.05rem' },
            }}
          >
            Chilli Padi started off as a restaurant which was founded in 1997 and has been
            synonymous with authentic Peranakan Cuisine, rich heritage and gourmet excellence. We
            have since built an island-wide footprint with our catering arm, flagship restaurant and
            chain of cafeterias, collectively known as Chilli Padi Holding.
          </Typography>

          <Typography
            component={m.p}
            variants={varFade('inUp')}
            sx={{
              mt: { xs: 3.5, md: 2.5 },
              color: 'text.secondary',
              lineHeight: { xs: 1.75, md: 1.65 },
              fontSize: { xs: '1rem', md: '1.05rem' },
            }}
          >
            Over the years, Chilli Padi has received numerous accolades including the coveted
            Singapore&apos;s Best Restaurant by Singapore Tatler, Asia Pacific Brands Award and
            Promising SME500, among others. In particular, the Singapore Tourism Board proudly
            recommends the international media to Chilli Padi&apos;s cuisine as a fine exemplary of
            Singapore&apos;s rich food heritage.
          </Typography>

          <Typography
            component={m.p}
            variants={varFade('inUp')}
            sx={{
              mt: { xs: 3.5, md: 2.5 },
              color: 'text.secondary',
              lineHeight: { xs: 1.75, md: 1.65 },
              fontSize: { xs: '1rem', md: '1.05rem' },
            }}
          >
            In 2011, we initially offered our confinement meals at our restaurant. Encouraged by the
            positive response and demand for our meals, we expanded our portfolio to cater
            confinement meal catering service aimed to aid mummies in their postpartum recovery.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
