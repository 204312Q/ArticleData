import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { PageHero } from 'src/components/page-hero';

import { TrialIcon } from './trial-meal-icons';
import {
  TRIAL_DISHES,
  TRIAL_REASONS,
  TRIAL_DELIVERY,
  TRIAL_WHATSAPP_URL,
} from './trial-meal-data';

// ----------------------------------------------------------------------

// Sampled from the hero photo's edge so the gutters blend in.
const HERO_BG = '#FDEDF1';
const HERO_BG_RGB = '253, 237, 241';
const SOFT_BG = '#FDE8EC';
const ICON_BG = '#FBD7DE';

function SectionTitle({ title }: { title: string }) {
  return (
    <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
      <Typography variant="h3" component="h2" sx={{ color: 'primary.main', textWrap: 'balance' }}>
        {title}
      </Typography>
      <Box sx={{ width: 28, height: 3, borderRadius: 1, bgcolor: 'primary.main' }} />
    </Stack>
  );
}

function IconBadge({ name }: { name: React.ComponentProps<typeof TrialIcon>['name'] }) {
  return (
    <Box
      sx={{
        width: 56,
        height: 56,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        bgcolor: ICON_BG,
        color: 'primary.main',
      }}
    >
      <TrialIcon name={name} sx={{ fontSize: 28 }} />
    </Box>
  );
}

function TrialButtons({ center }: { center?: boolean }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{
        width: { xs: 1, sm: 'auto' },
        justifyContent: center ? 'center' : 'flex-start',
      }}
    >
      <Button
        size="large"
        variant="contained"
        color="primary"
        href={paths.product.root}
        sx={{ color: 'common.white', borderRadius: 999, px: 4 }}
      >
        Order Trial Meal
      </Button>
      <Button
        size="large"
        variant="outlined"
        color="primary"
        href={TRIAL_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ borderRadius: 999, px: 4, bgcolor: 'rgba(255,255,255,0.6)' }}
      >
        Speak to Our Team
      </Button>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type TrialMealViewProps = {
  /** Live trial price from the catalog; the price block is hidden when null. */
  price: number | null;
};

export function TrialMealView({ price }: TrialMealViewProps) {
  return (
    <>
      <PageHero
        alt="Trial meal set: pig's trotters, spinach, chicken, soup, rice and tea"
        image="/banners/Trial-Meal/Pastel Pink Braised Meal Scene.png"
        imagePosition="right center"
        mobileOverlap={56}
        background={HERO_BG}
        backgroundRgb={HERO_BG_RGB}
      >
        <Stack spacing={2} alignItems="flex-start" sx={{ maxWidth: { md: 520 } }}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' }, lineHeight: 1.1 }}
          >
            <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
              Try a meal.
            </Box>
            <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
              Get to know us.
            </Box>
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            Experience our food before choosing your confinement package.
          </Typography>

          {price !== null && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                component="p"
                sx={{ color: 'primary.main', fontWeight: 800, fontSize: '3rem', lineHeight: 1 }}
              >
                ${price}
              </Typography>
              <Box sx={{ width: '1px', height: 36, bgcolor: 'grey.400' }} />
              <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400 }}>
                Trial meal
              </Typography>
            </Stack>
          )}

          <TrialButtons />
        </Stack>
      </PageHero>

      <Container sx={{ pt: { xs: 5, md: 8 }, pb: { xs: 4, md: 5 } }}>
        <SectionTitle title="Why start with a trial?" />

        <Box
          sx={{
            display: 'grid',
            gap: { xs: 3, md: 2 },
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          }}
        >
          {TRIAL_REASONS.map((reason, index) => (
            <Stack
              key={reason.title}
              direction="row"
              spacing={2}
              alignItems="flex-start"
              sx={{
                px: { md: 2 },
                ...(index > 0 && {
                  borderLeft: { md: '1px solid' },
                  borderColor: { md: 'divider' },
                }),
              }}
            >
              <IconBadge name={reason.icon} />
              <Stack spacing={0.5}>
                <Typography variant="h6" component="h3" sx={{ color: 'primary.main' }}>
                  {reason.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reason.description}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Box>
      </Container>

      <Container sx={{ py: { xs: 4, md: 5 } }}>
        <SectionTitle title="Your trial meal includes" />

        <Box
          component="ul"
          sx={{
            m: 0,
            p: 0,
            listStyle: 'none',
            display: 'grid',
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {TRIAL_DISHES.map((dish) => (
            <Box
              component="li"
              key={dish.name}
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                bgcolor: 'common.white',
                boxShadow: '0 4px 16px rgba(145, 158, 171, 0.16)',
              }}
            >
              <Box sx={{ position: 'relative', aspectRatio: '4 / 3', bgcolor: SOFT_BG }}>
                <Image
                  fill
                  alt={dish.name}
                  src={dish.image}
                  sizes="(max-width: 900px) 50vw, 380px"
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Typography
                variant="subtitle2"
                sx={{
                  px: 2,
                  py: 1.5,
                  textAlign: 'center',
                  fontWeight: 500,
                  textWrap: 'balance',
                  minHeight: { sm: 64 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {dish.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <Box component="section" sx={{ mt: { xs: 4, md: 5 }, py: { xs: 5, md: 6 }, bgcolor: SOFT_BG }}>
        <Container>
          <SectionTitle title="Delivery details" />

          <Box
            sx={{
              display: 'grid',
              gap: { xs: 3, md: 2 },
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            }}
          >
            {TRIAL_DELIVERY.map((item, index) => (
              <Stack
                key={item.label}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  px: { md: 2 },
                  ...(index > 0 && {
                    borderLeft: { md: '1px solid' },
                    borderColor: { md: 'divider' },
                  }),
                }}
              >
                <IconBadge name={item.icon} />
                <Typography variant="body2" color="text.secondary">
                  <Box component="strong" sx={{ display: 'block', color: 'text.primary' }}>
                    {item.label}
                    {item.icon === 'closed' ? '' : ':'}
                  </Box>
                  {item.value}
                </Typography>
              </Stack>
            ))}
          </Box>

          <Box sx={{ mt: { xs: 4, md: 5 }, display: 'flex', justifyContent: 'center' }}>
            <TrialButtons center />
          </Box>
        </Container>
      </Box>
    </>
  );
}
