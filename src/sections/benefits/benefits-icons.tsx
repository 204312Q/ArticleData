import type { SvgIconProps } from '@mui/material/SvgIcon';

import SvgIcon from '@mui/material/SvgIcon';

// ----------------------------------------------------------------------

export type BenefitIconName =
  | 'breastfeeding'
  | 'recovery'
  | 'energy'
  | 'digestive'
  | 'soups'
  | 'traditional'
  | 'article';

const PATHS: Record<BenefitIconName, React.ReactNode> = {
  breastfeeding: (
    <>
      <circle cx="9" cy="5.5" r="2.5" />
      <path d="M5 21v-5.5c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5V21" />
      <circle cx="16.5" cy="13" r="2" />
      <path d="M13.5 17.5c1-1 2-1.5 3-1.5 1.7 0 3 1.3 3 3v2" />
    </>
  ),
  recovery: (
    <path d="M12 20.5s-8-4.6-8-10.4A4.6 4.6 0 0 1 12 7.6a4.6 4.6 0 0 1 8 2.5c0 5.8-8 10.4-8 10.4Z" />
  ),
  energy: <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8Z" />,
  digestive: (
    <path d="M9 2.5v4c0 1.5-1 2.2-2 3-1.700 1.300-2.500 3-2.500 5.200 0 3.800 3 6.800 7 6.800 3.300 0 5.500-2 5.500-4.500 0-1.800-1.200-3-2.800-3.200-1.500-.2-2.200-1-2.200-2.300V7M12 2.500H9" />
  ),
  soups: (
    <>
      <path d="M3 12h18a9 9 0 0 1-18 0Z" />
      <path d="M8 21h8" />
      <path d="M9 4c-1 1 1 2 0 3M13 3c-1 1.200 1 2.300 0 3.500M17 4c-1 1 1 2 0 3" />
    </>
  ),
  traditional: (
    <>
      <path d="M20 4C10 4 4.500 8.500 4.500 14.500c0 2 .8 3.500 2 4.500C13 19 20 15 20 4Z" />
      <path d="M4 21c2-5 5-8.500 10-11" />
    </>
  ),
  article: (
    <>
      <path d="M12 6.500C10.500 5 8 4.500 3.500 4.500v13c4.500 0 7 .5 8.500 2 1.500-1.500 4-2 8.500-2v-13c-4.500 0-7 .5-8.500 2Z" />
      <path d="M12 6.500v13" />
    </>
  ),
};

type BenefitIconProps = SvgIconProps & { name: BenefitIconName };

export function BenefitIcon({ name, sx, ...other }: BenefitIconProps) {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        ...sx,
      }}
      {...other}
    >
      {PATHS[name]}
    </SvgIcon>
  );
}
