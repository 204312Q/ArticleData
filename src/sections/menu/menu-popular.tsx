'use client';

import type { DishCard } from '../home/home-data';

import Image from 'next/image';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { Carousel, useCarousel, CarouselDotButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

type MenuPopularProps = {
  dishes: DishCard[];
};

export function MenuPopular({ dishes }: MenuPopularProps) {
  const carousel = useCarousel({ loop: false, align: 'start' });
  const [selectedDish, setSelectedDish] = useState<DishCard | null>(null);

  const renderCard = (item: DishCard) => (
    <Card
      key={item.id}
      onClick={() => setSelectedDish(item)}
      sx={{
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '1 / 1' }}>
        <Image fill alt={item.alt} src={item.image} style={{ objectFit: 'cover' }} />
      </Box>

      <Stack spacing={1.25} sx={{ p: 2.5 }}>
        <Typography variant="h5">{item.name}</Typography>
      </Stack>
    </Card>
  );

  return (
    <>
      <Box component="section" sx={{ py: { xs: 4, md: 8 } }}>
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 5, color: 'primary.main' }}>
            Our Popular Dishes
          </Typography>

          <Carousel
            carousel={carousel}
            sx={{ px: { xs: 2, sm: 3 }, display: { xs: 'block', md: 'none' } }}
            slotProps={{
              slide: {
                flex: { xs: '0 0 88%', sm: '0 0 62%' },
                pr: { xs: 2, sm: 2.5 },
              },
            }}
          >
            {dishes.map((item) => renderCard(item))}
          </Carousel>

          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 3,
            }}
          >
            {dishes.map((item) => renderCard(item))}
          </Box>

          <CarouselDotButtons
            scrollSnaps={carousel.dots.scrollSnaps}
            selectedIndex={carousel.dots.selectedIndex}
            onClickDot={carousel.dots.onClickDot}
            sx={{ mt: 3.5, color: 'primary.main', display: { xs: 'flex', md: 'none' } }}
          />
        </Container>
      </Box>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={Boolean(selectedDish)}
        onClose={() => setSelectedDish(null)}
      >
        <DialogTitle>{selectedDish?.name}</DialogTitle>
        <DialogContent sx={{ pb: 3.5 }}>
          {selectedDish && (
            <Stack spacing={1.5}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <Image
                  fill
                  alt={selectedDish.alt}
                  src={selectedDish.image}
                  style={{ objectFit: 'cover' }}
                />
              </Box>

              <Typography color="text.secondary">{selectedDish.description}</Typography>

              <Box>
                <Typography variant="subtitle2" color="primary.main">
                  {selectedDish.chineseName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {selectedDish.chineseDescription}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
