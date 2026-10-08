'use client';

import type { HeroBanner } from './home-data';

import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

import Box from '@mui/material/Box';

import { Carousel, useCarousel, CarouselDotButtons } from 'src/components/carousel';

import { HERO_GUTTER_COLOR } from './home-data';

// ----------------------------------------------------------------------

type HomeHeroProps = {
  data: HeroBanner[];
};

export function HomeHero({ data }: HomeHeroProps) {
  const carousel = useCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 5000, stopOnInteraction: false }),
  ]);

  if (!data.length) {
    return null;
  }

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        // Fills the gutters beside the width-capped carousel below on
        // ultrawide screens, so the banner doesn't appear to float on plain
        // white past the 2000px cap. A lightened-further tint of
        // primary.lighter (#F9C9D3) — kept as a literal, not the theme
        // token, so it can be tuned independently of the token's other
        // uses. HomeView's gradient starts at this same HERO_GUTTER_COLOR,
        // so the two blend with no seam — no divider border here anymore,
        // since that would cut across the blend.
        bgcolor: HERO_GUTTER_COLOR,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          // Banner art is a fixed 4:1 image (3612x903). Beyond this width the
          // maxHeight cap below makes the box's rendered ratio exceed 4:1,
          // which flips object-fit: cover from side-cropping to top/bottom-
          // cropping and cuts off content near the top/bottom of the image
          // (e.g. a promo code) on ultrawide/5K displays. Capping width here
          // keeps the box ratio at or under the image's native ratio.
          maxWidth: 2000,
          mx: 'auto',
          overflow: 'hidden',
        }}
      >
        <Carousel carousel={carousel}>
          {data.map((item) => (
            <Box
              key={item.id}
              sx={{
                width: '100%',
                // Continuous width-based scaling (aspect-ratio) instead of fixed
                // px-per-breakpoint heights — breakpoint steps made the image
                // crop visibly "jump" whenever a resize/zoom crossed a step.
                aspectRatio: '2.4',
                minHeight: 220,
                maxHeight: 500,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image
                fill
                priority={item.id === 1}
                alt={item.title}
                src={item.image}
                // Banner art is a 4:1 image inside a ~2.4:1-at-widest box, so
                // object-fit: cover always scales it up beyond the container's
                // own width to fully cover the (relatively taller) box — plain
                // "100vw" undersells the resolution actually needed and made
                // the banner look soft. Values below derived from the same
                // aspectRatio/min/maxHeight clamp as the box: neededWidth =
                // clampedHeight(w) * 4, expressed per clamp region (flat px
                // while height is flat, vw while height scales with width).
                // Fallback is a flat 2000px, not 100vw — the wrapping box is
                // hard-capped at maxWidth: 2000, so the image can never
                // actually render wider than that regardless of viewport.
                sizes="(max-width: 528px) 880px, (max-width: 1200px) 167vw, 2000px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </Box>
          ))}
        </Carousel>

        <CarouselDotButtons
          scrollSnaps={carousel.dots.scrollSnaps}
          selectedIndex={carousel.dots.selectedIndex}
          onClickDot={carousel.dots.onClickDot}
          sx={{
            left: 0,
            right: 0,
            bottom: { xs: 12, md: 20 },
            position: 'absolute',
          }}
        />
      </Box>
    </Box>
  );
}
