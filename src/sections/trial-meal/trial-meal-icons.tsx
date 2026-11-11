import type { SvgIconProps } from '@mui/material/SvgIcon';

import SvgIcon from '@mui/material/SvgIcon';

// ----------------------------------------------------------------------

export type TrialIconName =
  | 'taste'
  | 'portions'
  | 'variety'
  | 'delivery'
  | 'lunch'
  | 'dinner'
  | 'sentosa'
  | 'closed';

const PATHS: Record<TrialIconName, string> = {
  taste: 'M7 3v7a2 2 0 0 0 2 2v9 M5 3v5 M9 3v5 M17 21V3c-2 1.5-3 4-3 7v3h3',
  portions: 'M4 11h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2z M9 8a3 3 0 0 1 6 0',
  variety: 'M4 5h7v7H4z M13 5h7v7h-7z M4 14h7v5H4z M13 14h7v5h-7z',
  delivery:
    'M2 6h11v9H2z M13 9h4l3 3v3h-7z M4.5 17.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0 M15.5 17.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0',
  lunch: 'M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18z M12 7v5l3 2',
  dinner: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',
  sentosa:
    'M5 16l1.5-5h11L19 16 M3 16h18v3H3z M7 19.5v1.5 M17 19.5v1.5 M8 13.5h.01 M16 13.5h.01',
  closed: 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4',
};

type TrialIconProps = SvgIconProps & { name: TrialIconName };

export function TrialIcon({ name, sx, ...other }: TrialIconProps) {
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
