import Box from '@mui/material/Box';

import { WhatsAppButton } from 'src/components/whatsapp-button';

import { MainHeader } from './header';
import { MainFooter } from './footer';
import { PromoAnnouncementBar } from './promo-announcement-bar';

// ----------------------------------------------------------------------

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--palette-background-default)',
      }}
    >
      <PromoAnnouncementBar />
      <MainHeader />

      <Box component="main" sx={{ flex: '1 1 auto' }}>
        {children}
      </Box>

      <MainFooter />

      <WhatsAppButton />
    </Box>
  );
}
