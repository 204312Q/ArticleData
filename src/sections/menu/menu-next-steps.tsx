'use client';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type MenuNextStepsProps = {
  images: string[];
};

export function MenuNextSteps({ images }: MenuNextStepsProps) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 7, md: 9 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h2"
        sx={{ mb: { xs: 4, md: 5 }, color: 'primary.main', textAlign: 'center' }}
      >
        What&apos;s the next step?
      </Typography>

      <Container maxWidth="lg">
        <Box
          sx={{
            mt: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 0 },
          }}
        >
          {images.map((image, index) => (
            <Box
              key={image}
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              <Card
                sx={{
                  p: 1,
                  borderRadius: 4,
                  boxShadow: '0 24px 44px rgba(109, 110, 113, 0.12)',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: 270, md: 310 },
                    aspectRatio: '4 / 5',
                  }}
                >
                  <Image
                    fill
                    alt={`Order step ${index + 1}`}
                    src={image}
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              </Card>

              {index < images.length - 1 && (
                <Box
                  sx={{
                    width: { xs: 6, md: 88 },
                    height: { xs: 44, md: 6 },
                    backgroundColor: 'primary.main',
                    borderRadius: 999,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
