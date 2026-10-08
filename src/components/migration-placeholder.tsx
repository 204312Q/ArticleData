import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type MigrationPlaceholderProps = {
  title: string;
  description: string;
};

export function MigrationPlaceholder({ title, description }: MigrationPlaceholderProps) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box
        sx={{
          px: { xs: 3, md: 6 },
          py: { xs: 5, md: 7 },
          borderRadius: 4,
          backgroundColor: 'background.paper',
          boxShadow: 8,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="overline" color="primary.main">
            Layout Migration
          </Typography>

          <Typography variant="h2">{title}</Typography>

          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
            {description}
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
