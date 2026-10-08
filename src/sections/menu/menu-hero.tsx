import Image from 'next/image';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export function MenuHero() {
  return (
    <Box
      component="section"
      sx={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        ml: '-50vw',
        mr: '-50vw',
        bgcolor: 'common.white',
        overflow: 'hidden',
      }}
    >
      {/* Caps the banner at 2000px and centers it — same treatment as
          HomeHero — so on ultrawide screens the image stops growing instead
          of stretching edge-to-edge past its intended size. The outer box
          above stays full-bleed so its white background still fills the
          gutters beside this cap. */}
      <Box sx={{ maxWidth: 2000, mx: 'auto' }}>
        <Box
          sx={{
            position: 'relative',
            height: { xs: 220, sm: 280, md: 420, lg: 500 },
            display: { xs: 'block', md: 'none' },
          }}
        >
          <Image
            fill
            priority
            alt="Confinement menu banner"
            src="/banners/Confinement_Menu_Banner_Mobile.avif"
            sizes="(max-width: 2000px) 100vw, 2000px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </Box>

        <Box
          sx={{
            position: 'relative',
            height: { xs: 220, sm: 280, md: 420, lg: 500 },
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Image
            fill
            priority
            alt="Confinement menu banner"
            src="/banners/Confinement_Menu_Banner.avif"
            sizes="(max-width: 2000px) 100vw, 2000px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </Box>
      </Box>
    </Box>
  );
}
