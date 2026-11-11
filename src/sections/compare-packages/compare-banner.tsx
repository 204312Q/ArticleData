import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type CompareBannerProps = {
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
  /** CSS object-position for the photo, e.g. '75% center'. */
  imagePosition?: string;
  action: { label: string; href: string; withArrow?: boolean };
  /** Optional outlined button beside the main action. */
  secondaryAction?: { label: string; href: string };
  /** Banner background; sampled from the photo's empty side so the fade blends. */
  background?: string;
  /** Same colour as `background` as rgb channels, used for the transparent end of the fade. */
  backgroundRgb?: string;
  /** Desktop: photo on the left, text on the right. */
  reverse?: boolean;
  /** Multiplies the photo with the banner colour so white areas turn into the banner pink. */
  blend?: boolean;
};

export function CompareBanner({
  title,
  description,
  image,
  imageAlt,
  imagePosition = '75% center',
  action,
  secondaryAction,
  background = '#FBE9EC',
  backgroundRgb = '251, 233, 236',
  reverse = false,
  blend = false,
}: CompareBannerProps) {
  return (
    <Box
      component="section"
      sx={{
        width: 1,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: background,
        display: 'flex',
        flexDirection: 'column',
        minHeight: { md: 340 },
      }}
    >
      {/* Photo: fills the banner on desktop, sits under the text on phones. */}
      <Box
        sx={{
          order: 2,
          position: { xs: 'relative', md: 'absolute' },
          top: { md: 0 },
          bottom: { md: 0 },
          ...(reverse ? { left: { md: 0 } } : { right: { md: 0 } }),
          width: { md: '60%' },
          height: { xs: 200, sm: 240, md: 'auto' },
        }}
      >
        <Image
          fill
          alt={imageAlt}
          src={image}
          sizes="(max-width: 2000px) 100vw, 2000px"
          style={{
            objectFit: 'cover',
            objectPosition: imagePosition,
            ...(blend && { mixBlendMode: 'multiply' }),
          }}
        />

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

        {/* Desktop: fade the left of the photo into the text area. */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(to ${reverse ? 'left' : 'right'}, ${background} 0%, rgba(${backgroundRgb}, 0) 45%)`,
          }}
        />
      </Box>

      <Container
        sx={{
          py: { xs: 3, md: 7 },
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: { md: reverse ? 'flex-end' : 'flex-start' },
          position: 'relative',
          flexGrow: { md: 1 },
        }}
      >
        <Stack spacing={2} alignItems="flex-start" sx={{ maxWidth: { md: 460 } }}>
          <Typography
            component="h2"
            variant="h2"
            sx={{
              color: 'grey.800',
              textWrap: 'balance',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              {description}
            </Typography>
          )}

          <Stack direction="row" flexWrap="wrap" sx={{ gap: 1.5 }}>
            <Button
              variant="contained"
              color="primary"
              href={action.href}
              endIcon={action.withArrow ? <Iconify icon="eva:arrow-ios-forward-fill" /> : undefined}
              sx={{ color: 'common.white', borderRadius: 999 }}
            >
              {action.label}
            </Button>
            {secondaryAction && (
              <Button
                variant="outlined"
                color="primary"
                href={secondaryAction.href}
                sx={{ borderRadius: 999, bgcolor: 'rgba(255,255,255,0.6)' }}
              >
                {secondaryAction.label}
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
