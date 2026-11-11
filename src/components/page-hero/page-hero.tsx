import type { ReactNode, CSSProperties } from 'react';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

// ----------------------------------------------------------------------

/**
 * Shared page-top banner. Every page hero MUST use this so it keeps the same
 * frame as the home page banner (HomeHero):
 *  - full-width section whose background fills the gutters beside the cap,
 *  - banner capped at 2000px and centered,
 *  - width-based scaling: aspect-ratio 2.4, min-height 220, max-height 500
 *    (no fixed per-breakpoint heights, so the crop never "jumps" on resize).
 */
export const PAGE_HERO_GUTTER_COLOR = '#FBD7DE';

type PageHeroProps = {
  image: string;
  alt: string;
  /** Separate art for < md screens (e.g. the menu's mobile banner). */
  mobileImage?: string;
  /** CSS object-position for the photo. */
  imagePosition?: string;
  /** Gutter colour; sample it from the photo's edge so the cap blends in. */
  background?: string;
  /** Same colour as `background` as rgb channels, for the transparent end of fades. */
  backgroundRgb?: string;
  /** Desktop: photo on the left, text on the right. */
  reverse?: boolean;
  /** Multiplies the photo with the background so white areas pick up its colour. */
  blend?: boolean;
  /** Phones only: pull the photo up by this many px so it tucks behind the text. */
  mobileOverlap?: number;
  /** Optional live text. Overlays the photo on desktop, sits above it on phones. */
  children?: ReactNode;
};

export function PageHero({
  image,
  alt,
  mobileImage,
  imagePosition = 'center',
  background = PAGE_HERO_GUTTER_COLOR,
  backgroundRgb = '251, 215, 222',
  reverse = false,
  blend = false,
  mobileOverlap = 0,
  children,
}: PageHeroProps) {
  const imageStyle: CSSProperties = {
    objectFit: 'cover',
    objectPosition: imagePosition,
    ...(blend && { mixBlendMode: 'multiply' }),
  };

  return (
    <Box component="section" sx={{ width: 1, bgcolor: background, overflow: 'hidden' }}>
      <Box
        sx={{
          maxWidth: 2000,
          mx: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            // On phones the text sits above the photo instead of over the food.
            order: 2,
            width: 1,
            aspectRatio: '2.4',
            minHeight: 220,
            maxHeight: 500,
            position: 'relative',
            overflow: 'hidden',
            mt: { xs: `-${mobileOverlap}px`, md: 0 },
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, display: { xs: mobileImage ? 'none' : 'block', md: 'block' } }}>
            <Image
              fill
              priority
              alt={alt}
              src={image}
              sizes="(max-width: 528px) 880px, (max-width: 1200px) 167vw, 2000px"
              style={imageStyle}
            />
          </Box>

          {mobileImage && (
            <Box sx={{ position: 'absolute', inset: 0, display: { xs: 'block', md: 'none' } }}>
              <Image
                fill
                priority
                alt={alt}
                src={mobileImage}
                sizes="(max-width: 528px) 880px, (max-width: 1200px) 167vw, 2000px"
                style={imageStyle}
              />
            </Box>
          )}

          {children && (
            <>
              {/* Phones: fade the top of the photo into the text area. */}
              <Box
                sx={{
                  display: { md: 'none' },
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '45%',
                  pointerEvents: 'none',
                  background: `linear-gradient(to bottom, ${background}, rgba(${backgroundRgb}, 0))`,
                }}
              />
              {/* Desktop: fade the text side of the photo into the background. */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: `linear-gradient(to ${reverse ? 'left' : 'right'}, ${background} 0%, ${background} 25%, rgba(${backgroundRgb}, 0) 60%)`,
                }}
              />
            </>
          )}
        </Box>

        {children && (
          <Container
            sx={{
              py: { xs: 3, md: 0 },
              position: { xs: 'relative', md: 'absolute' },
              inset: { md: 0 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: { md: reverse ? 'flex-end' : 'flex-start' },
              zIndex: 1,
            }}
          >
            {children}
          </Container>
        )}
      </Box>
    </Box>
  );
}
