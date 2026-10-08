'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  description?: string;
  sx?: SxProps<Theme>;
};

export function BlankView({ title = 'Blank', description, sx }: Props) {
  const renderContent = () => (
    <Box
      sx={[
        (theme) => ({
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          border: `dashed 1px ${theme.vars.palette.divider}`,
          bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h4"> {title} </Typography>
      {description && <Typography sx={{ mt: 1 }}> {description} </Typography>}

      {renderContent()}
    </Container>
  );
}
