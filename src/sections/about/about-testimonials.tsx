'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { AboutTestimonial } from './about-data';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { aboutTestimonials } from './about-data';

// ----------------------------------------------------------------------

export function AboutTestimonials() {
  return (
    <Box
      component="section"
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 8, md: 0 },
          height: { md: 840 },
          backgroundImage:
            'linear-gradient(180deg, rgba(27, 33, 45, 0.86) 0%, rgba(27, 33, 45, 0.74) 100%), url(/assets/background/confinement_group_shot.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      ]}
    >
      <Container
        component={MotionViewport}
        maxWidth="lg"
        sx={{
          position: 'relative',
          height: 1,
          minHeight: { xs: 'auto', md: 840 },
          py: { xs: 0, md: 0 },
          display: 'grid',
          gap: { xs: 5, md: 8 },
          alignItems: 'center',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 0.85fr) minmax(0, 1.15fr)' },
        }}
      >
        <Stack spacing={3} sx={{ color: 'common.white', textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            component={m.span}
            variants={varFade('inUp')}
            variant="overline"
            sx={{ color: alpha('#FFFFFF', 0.72) }}
          >
            Testimonials
          </Typography>

          <Typography
            component={m.h2}
            variants={varFade('inUp')}
            variant="h2"
            sx={{ color: 'common.white' }}
          >
            Who loved our meals
          </Typography>

          <Typography
            component={m.p}
            variants={varFade('inUp')}
            sx={{ color: alpha('#FFFFFF', 0.86), lineHeight: 1.8 }}
          >
            We bring convenience with our array of nourishing confinement dishes delivered right to your doorstep, allowing you the luxury of spending quality time with your newborn and family, as well as ensuring you get adequate rest for your postpartum recovery!
          </Typography>
        </Stack>

        <Box
          sx={[
            (theme) => ({
              ...theme.mixins.hideScrollY,
              py: { xs: 0, md: 0 },
              height: { md: 1 },
              overflowY: { xs: 'unset', md: 'auto' },
            }),
          ]}
        >
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={3} sx={{ m: 0, ml: 0 }}>
            {aboutTestimonials.map((testimonial) => (
              <Box key={testimonial.name} component={m.div} variants={varFade('inUp')}>
                <TestimonialCard testimonial={testimonial} />
              </Box>
            ))}
          </Masonry>
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

type TestimonialCardProps = {
  testimonial: AboutTestimonial;
  sx?: SxProps<Theme>;
};

function TestimonialCard({ testimonial, sx }: TestimonialCardProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          p: 3,
          borderRadius: 3,
          color: 'common.white',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          backgroundColor: alpha(theme.palette.common.white, 0.09),
          border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Iconify icon="mingcute:quote-left-fill" width={34} sx={{ mb: 2, opacity: 0.72 }} />

      <Typography sx={{ lineHeight: 1.85, color: alpha('#FFFFFF', 0.92) }}>
        {testimonial.content}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
          {testimonial.name}
        </Typography>
        <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7) }}>
          {testimonial.role}
        </Typography>
      </Box>
    </Box>
  );
}
