import type { SvgIconProps } from '@mui/material/SvgIcon';

import SvgIcon from '@mui/material/SvgIcon';

// ----------------------------------------------------------------------

export type RecoveryIconName = 'cooking' | 'delivery' | 'family' | 'checklist' | 'info';

const PATHS: Record<RecoveryIconName, string> = {
  cooking: 'M4 11h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2z M2 11h2 M20 11h2 M9 8a3 3 0 0 1 6 0',
  delivery:
    'M2 6h11v9H2z M13 9h4l3 3v3h-7z M4.5 17.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0 M15.5 17.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0',
  family:
    'M9 11a3 3 0 1 0 0-6a3 3 0 0 0 0 6z M3 19c0-3 2.7-5 6-5s6 2 6 5 M17 10a2.5 2.5 0 1 0 0-5 M17 14c2.5 0 4 1.7 4 4.5',
  checklist: 'M9 4H6v16h12V4h-3 M8 3h8v3H8z M9 12h6 M9 16h4',
  info: 'M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18z M12 11v5 M12 8h.01',
};

type RecoveryIconProps = SvgIconProps & { name: RecoveryIconName };

export function RecoveryIcon({ name, sx, ...other }: RecoveryIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={sx} {...other}>
      <path
        d={PATHS[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}
