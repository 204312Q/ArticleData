import type { MenuPageData } from './menu-source';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

import { MenuHero } from './menu-hero';
import { MenuPopular } from './menu-popular';
import { MenuCalendar } from './menu-calendar';
import { MenuNextSteps } from './menu-next-steps';
import { MenuDishGallery } from './menu-dish-gallery';

// ----------------------------------------------------------------------

type MenuViewProps = {
  data: MenuPageData;
};

export function MenuView({ data }: MenuViewProps) {
  return (
    <>
      <MenuHero />

      <MenuDishGallery tiles={data.galleryTiles} />
      <Box component="section" sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 1, md: 2 } }}>
        <Container maxWidth="md">
          <Box sx={{ mx: 'auto', maxWidth: 760, textAlign: 'center' }}>
            <Typography variant="h2" sx={{ color: 'primary.main', mb: 1.5 }}>
              Explore Our 4-Week Menu
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mx: 'auto',
                maxWidth: 620,
                fontSize: { xs: '1rem', md: '1.08rem' },
                lineHeight: 1.8,
              }}
            >
              Browse the rotating confinement menu by start date to see how meals progress from
              recovery-focused dishes in week one to nourishing daily meals in the weeks after.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 2.5 }}>
        <Button
          variant="outlined"
          color="primary"
          component="a"
          href={CONFIG.weeklyMenuPdfUrl}
          target="_blank"
          rel="noreferrer"
          startIcon={<Iconify icon="solar:file-text-bold" />}
          sx={{ mt: 2.5 }}
        >
          View Full Menu (PDF)
        </Button>

      </Box>



      <MenuCalendar
        weekOptions={data.weekOptions}
        emptyDaySet={data.emptyDaySet}
        nonOperatingDays={data.nonOperatingDays}
        nourishMenuPool={data.nourishMenuPool}
        recoveryMenuPool={data.recoveryMenuPool}
      />


      <MenuPopular dishes={data.popularDishes} />
      <MenuNextSteps images={data.orderStepImages} />
    </>
  );
}
