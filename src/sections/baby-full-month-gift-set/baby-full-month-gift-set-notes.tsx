import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { companyInfo } from 'src/layouts/main/data';

import { BulletList } from 'src/sections/product/product-notes';

import { giftSetImportantNotes, giftSetImportantNotesFootnote } from './baby-full-month-gift-set-data';

const MESSENGER_URL = 'https://www.facebook.com/messages/t/412974612448347';

// ----------------------------------------------------------------------

export function GiftSetImportantNotesContent() {
  return (
    <Stack spacing={2}>
      {giftSetImportantNotes.map((section) => (
        <Box key={section.heading}>
          <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 700, color: 'primary.main' }}>
            {section.heading}
          </Typography>
          <BulletList items={section.items} />
        </Box>
      ))}

      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        {giftSetImportantNotesFootnote}
      </Typography>

      <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: { xs: 'left', sm: 'center' } }}>
        <Typography variant="caption" sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}>
          For more information or special arrangements, please contact us at{' '}
          <Link href={`tel:${companyInfo.phone.replace(/\s+/g, '')}`} underline="always" color="inherit">
            {companyInfo.phone}
          </Link>{' '}
          | email us at{' '}
          <Link href={`mailto:${companyInfo.email}`} underline="always" color="inherit">
            {companyInfo.email}
          </Link>{' '}
          | chat with us on{' '}
          <Link href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" underline="always" color="inherit">
            Messenger
          </Link>
        </Typography>
      </Box>
    </Stack>
  );
}
