import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({
  title,
  eyebrow,
  description,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <Stack spacing={1.5} sx={{ textAlign: align }}>
      {eyebrow && (
        <Typography variant="overline" color="primary.main">
          {eyebrow}
        </Typography>
      )}

      <Typography variant="h2" sx={{ color: 'primary.main' }}>
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: align === 'center' ? 720 : 640,
            mx: align === 'center' ? 'auto' : 0,
          }}
        >
          {description}
        </Typography>
      )}
    </Stack>
  );
}
