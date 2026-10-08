'use client';

import type { FabProps } from '@mui/material/Fab';

import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

const WHATSAPP_NUMBER = '6587257099';
const WHATSAPP_MESSAGE = "Hi, I'd like to enquire about your confinement meal packages.";

type WhatsAppButtonProps = FabProps;

export function WhatsAppButton({ sx, ...other }: WhatsAppButtonProps) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <Tooltip title="Chat with us on WhatsApp" placement="top">
      <Fab
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        sx={[
          (theme) => ({
            width: 56,
            height: 56,
            position: 'fixed',
            right: { xs: 16, md: 24 },
            bottom: { xs: 16, md: 24 },
            zIndex: theme.zIndex.speedDial,
            bgcolor: '#25D366',
            color: '#fff',
            '&:hover': { bgcolor: '#1DA851' },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Iconify icon="mdi:whatsapp" width={32} />
      </Fab>
    </Tooltip>
  );
}
