import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { PageHero } from 'src/components/page-hero';

// ----------------------------------------------------------------------

// Sampled from the banner's left edge so the gutters beside the 2000px cap
// (and the mobile text block) blend into the image.
const BANNER_BG = '#FBE9EC';

export function BenefitsHero() {
  return (
    <PageHero
      alt="Chicken soup and greens"
      image="/banners/Benefits/Chicken Soup and Greens on Pink.png"
      imagePosition="75% center"
      mobileOverlap={32}
      background={BANNER_BG}
      backgroundRgb="251, 233, 236"
    >
      <Stack spacing={2.5} alignItems="flex-start" sx={{ maxWidth: { md: 460 } }}>
        <Typography
          variant="h1"
          sx={{ color: 'primary.main', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, textWrap: 'balance' }}
        >
          Nourishment for what matters to you
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 420, fontSize: '1.1rem' }}>
          Explore the ingredients and dishes in our confinement menu.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href={paths.menu}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
          sx={{ color: 'common.white', borderRadius: 999 }}
        >
          View Full Menu
        </Button>
      </Stack>
    </PageHero>
  );
}
