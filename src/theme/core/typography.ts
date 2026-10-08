import type { Breakpoint, TypographyVariantsOptions } from '@mui/material/styles';

import { pxToRem, setFont } from 'minimal-shared/utils';

import { createTheme } from '@mui/material/styles';

import { themeConfig } from '../theme-config';

// ----------------------------------------------------------------------

/**
 * TypeScript extension for MUI theme augmentation.
 * @to {@link file://./../extend-theme-types.d.ts}
 */

export type TypographyVariantsExtend = {
  fontWeightSemiBold: React.CSSProperties['fontWeight'];
  fontWeightExtraBold: React.CSSProperties['fontWeight'];
  fontSecondaryFamily: React.CSSProperties['fontFamily'];
};

/**
 * Generates responsive font styles for given breakpoints
 * @param sizes - Object mapping breakpoints to font sizes in pixels
 * @returns CSS media query styles for responsive font sizes
 */
type FontSizesInput = Partial<Record<Breakpoint, number>>;
type FontSizesResult = Record<string, { fontSize: React.CSSProperties['fontSize'] }>;

function responsiveFontSizes(sizes: FontSizesInput): FontSizesResult {
  const {
    breakpoints: { keys, up },
  } = createTheme();

  return keys.reduce((styles, breakpoint) => {
    const size = sizes[breakpoint];

    if (size !== undefined && size >= 0) {
      styles[up(breakpoint)] = {
        fontSize: pxToRem(size),
      };
    }

    return styles;
  }, {} as FontSizesResult);
}

// ----------------------------------------------------------------------

const primaryFont = setFont(themeConfig.fontFamily.primary);
const secondaryFont = setFont(themeConfig.fontFamily.secondary);

const baseTypography: TypographyVariantsOptions = {
  fontFamily: primaryFont,
  fontSecondaryFamily: secondaryFont,
  fontWeightLight: 400,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 500,
  fontWeightBold: 500,
  fontWeightExtraBold: 500,
};

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
/**
 * Line height is set as a unitless ratio: 22 / 14 ≈ 1.57
 * - 22px is the desired visual line height
 * - 14px is the font size
 * This keeps the line height scalable and responsive.
 */
export const typography: TypographyVariantsOptions = {
  ...baseTypography,
  h1: {
    fontFamily: primaryFont,
    fontWeight: baseTypography.fontWeightMedium,
    lineHeight: 1.15,
    fontSize: pxToRem(40),
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontFamily: primaryFont,
    fontWeight: baseTypography.fontWeightMedium,
    lineHeight: 1.2,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  },
  h3: {
    fontFamily: primaryFont,
    fontWeight: baseTypography.fontWeightMedium,
    lineHeight: 1.3,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
  },
  h4: {
    fontFamily: primaryFont,
    fontWeight: baseTypography.fontWeightMedium,
    lineHeight: 1.4,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ md: 24 }),
  },
  h5: {
    fontFamily: primaryFont,
    fontWeight: baseTypography.fontWeightMedium,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 19 }),
  },
  h6: {
    fontFamily: primaryFont,
    fontWeight: baseTypography.fontWeightMedium,
    lineHeight: 1.5,
    fontSize: pxToRem(17),
    ...responsiveFontSizes({ sm: 18 }),
  },
  subtitle1: {
    fontFamily: primaryFont,
    fontWeight: baseTypography.fontWeightRegular,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontFamily: primaryFont,
    fontWeight: baseTypography.fontWeightRegular,
    lineHeight: 1.5,
    fontSize: pxToRem(14),
  },
  body1: {
    fontFamily: secondaryFont,
    fontWeight: baseTypography.fontWeightRegular,
    lineHeight: 1.7,
    fontSize: pxToRem(16),
  },
  body2: {
    fontFamily: secondaryFont,
    fontWeight: baseTypography.fontWeightRegular,
    lineHeight: 1.7,
    fontSize: pxToRem(14),
  },
  caption: {
    fontFamily: secondaryFont,
    fontWeight: baseTypography.fontWeightRegular,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontFamily: secondaryFont,
    fontWeight: baseTypography.fontWeightRegular,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: secondaryFont,
    fontWeight: baseTypography.fontWeightMedium,
    lineHeight: 26 / 16,
    fontSize: pxToRem(16),
    textTransform: 'unset',
  },
};
