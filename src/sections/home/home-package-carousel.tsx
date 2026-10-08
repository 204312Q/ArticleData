'use client';

import type { PackageCard } from './home-data';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Carousel, useCarousel, CarouselDotButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

type HomePackageCarouselProps = {
  items: PackageCard[];
};

export function HomePackageCarousel({ items }: HomePackageCarouselProps) {
  const carousel = useCarousel({ loop: false, align: 'start' });

  return (
    <Box sx={{ mt: 5, display: { xs: 'block', md: 'none' } }}>
      <Carousel
        carousel={carousel}
        sx={{ px: { xs: 2, sm: 3 } }}
        slotProps={{
          slide: {
            flex: { xs: '0 0 88%', sm: '0 0 62%' },
            pr: { xs: 2, sm: 2.5 },
          },
        }}
      >
        {items.map((item) => (
          <Card key={item.id} sx={{ p: 1.5, borderRadius: 4, height: '100%' }}>
            <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', aspectRatio: '1 / 1' }}>
              <Image fill alt={item.alt} src={item.image} style={{ objectFit: 'cover' }} />
            </Box>

            <Stack spacing={1} sx={{ p: 2.5, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
              <Typography variant="h5">{item.name}</Typography>
              <Typography variant="body1" color="text.secondary">
                {item.price}
              </Typography>
            </Stack>
          </Card>
        ))}
      </Carousel>

      <CarouselDotButtons
        scrollSnaps={carousel.dots.scrollSnaps}
        selectedIndex={carousel.dots.selectedIndex}
        onClickDot={carousel.dots.onClickDot}
        sx={{
          mt: 2.5,
          color: 'primary.main',
        }}
      />
    </Box>
  );
}
