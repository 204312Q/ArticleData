'use client';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function AboutViewPackage() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 5, md: 7 },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 2 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                maxWidth: { xs: 360, sm: 420, md: 440 },
                mx: { xs: 'auto', md: 0 },
                ml: { md: 'auto' },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 4,
                  aspectRatio: '1 / 1',
                  boxShadow: '0 20px 40px rgba(109, 110, 113, 0.14)',
                }}
              >
                <Image
                  fill
                  src="/aboutUs/confinementPackage.avif"
                  alt="Confinement package"
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                maxWidth: 500,
                mx: { xs: 'auto', md: 0 },
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h2"
                sx={{ color: 'primary.main', mb: 2, fontSize: { xs: '1.85rem', md: '2.5rem' } }}
              >
                Convenience and Quality
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.85, maxWidth: 520 }}>
                Our thermal wares help meals arrive warm and ready to enjoy, giving mums one less
                task to manage during recovery. From preparation to delivery, the service is built
                to reduce kitchen work and make daily nourishment easier to stay consistent with.
              </Typography>

              <Button
                variant="contained"
                href={paths.product.root}
                sx={{ minWidth: 180, color: 'common.white' }}
              >
                View Packages
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
