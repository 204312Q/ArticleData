'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import { mainNavItems } from './data';
import { MainNavigation, MainMobileNavigation } from './navigation';

// ----------------------------------------------------------------------

export function MainHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={(theme) => ({
          backgroundColor: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          boxShadow: '0 10px 30px rgba(143, 118, 137, 0.08)',
        })}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 88, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
                sx={{
                  mr: 1,
                  ml: -1,
                  display: { xs: 'inline-flex', md: 'none' },
                  color: 'primary.main',
                }}
              >
                <Iconify width={24} icon="custom:menu-duotone" />
              </IconButton>

              <Logo isSingle={false} sx={{ width: 150, height: 48 }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <NoSsr>
                  <MainNavigation items={mainNavItems} />
                </NoSsr>
              </Box>

              <Button
                variant="contained"
                component={RouterLink}
                href={paths.product.root}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  backgroundColor: 'primary.main',
                  color: 'common.white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    color: 'common.white',
                  },
                }}
              >
                Order Now
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <MainMobileNavigation
        items={mainNavItems}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
