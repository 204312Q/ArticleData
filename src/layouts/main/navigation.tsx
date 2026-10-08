'use client';

import type { MainNavItem } from './data';

import { useState, useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type NavigationProps = {
  items: MainNavItem[];
  onNavigate?: () => void;
  orientation?: 'horizontal' | 'vertical';
};

type MobileNavigationProps = {
  items: MainNavItem[];
  open: boolean;
  onClose: () => void;
};

export function MainNavigation({
  items,
  onNavigate,
  orientation = 'horizontal',
}: NavigationProps) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const links = items.map((item) => {
    const isActive =
      hasMounted &&
      (pathname === item.path || (item.path !== paths.home && pathname.startsWith(`${item.path}/`)));

    return (
      <Link
        key={item.path}
        href={item.path}
        component={RouterLink}
        color="inherit"
        underline="none"
        onClick={onNavigate}
        sx={(theme) => ({
          px: orientation === 'horizontal' ? 1.25 : 0,
          py: orientation === 'horizontal' ? 0.75 : 1,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: '0.01em',
          color:
            orientation === 'horizontal'
              ? theme.vars.palette.primary.main
              : theme.vars.palette.primary.main,
          transition: theme.transitions.create(['color']),
          ...(orientation === 'horizontal' && {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            '&::before': {
              content: '""',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.55),
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1)' : 'scale(0)',
              transition: theme.transitions.create(['opacity', 'transform'], {
                duration: theme.transitions.duration.shorter,
              }),
              ...(isActive && {
                backgroundColor: theme.vars.palette.primary.main,
              }),
            },
            '&:hover': {
              '&::before': {
                opacity: 1,
                transform: 'scale(1)',
              },
            },
          }),
          ...(orientation === 'vertical' && {
            '&:hover': {
              color: theme.vars.palette.primary.dark,
            },
          }),
        })}
      >
        {item.title}
      </Link>
    );
  });

  if (orientation === 'vertical') {
    return <Stack spacing={0.5}>{links}</Stack>;
  }

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {links}
    </Stack>
  );
}

export function MainMobileNavigation({ items, open, onClose }: MobileNavigationProps) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        },
      }}
    >
      <Stack sx={{ height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 3,
            pb: 2,
            pl: 2.5,
            pr: 2,
          }}
        >
          <Logo isSingle={false} sx={{ width: 126, height: 40 }} />

          <IconButton onClick={onClose} aria-label="Close navigation">
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <Divider />

        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
          }}
        >
          <MainNavigation items={items} orientation="vertical" onNavigate={onClose} />
        </Box>

        <Box
          sx={{
            py: 3,
            px: 2.5,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            component={RouterLink}
            href={paths.product.root}
            onClick={onClose}
            sx={{
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
      </Stack>
    </Drawer>
  );
}
