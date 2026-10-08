import type { Theme, Direction, CommonColors, ThemeProviderProps } from '@mui/material/styles';
import type { ThemeCssVariables } from './types';
import type { PaletteColorKey, PaletteColorNoChannels } from './core/palette';

// ----------------------------------------------------------------------

export type ThemeConfig = {
  direction: Direction;
  classesPrefix: string;
  cssVariables: ThemeCssVariables;
  defaultMode: ThemeProviderProps<Theme>['defaultMode'];
  modeStorageKey: ThemeProviderProps<Theme>['modeStorageKey'];
  fontFamily: Record<'primary' | 'secondary', string>;
  palette: Record<PaletteColorKey, PaletteColorNoChannels> & {
    common: Pick<CommonColors, 'black' | 'white'>;
    grey: {
      [K in 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 as `${K}`]: string;
    };
  };
};

export const themeConfig: ThemeConfig = {
  /** **************************************
   * Base
   *************************************** */
  defaultMode: 'light',
  modeStorageKey: 'theme-mode',
  direction: 'ltr',
  classesPrefix: 'minimal',
  /** **************************************
   * Css variables
   *************************************** */
  cssVariables: {
    cssVarPrefix: '',
    colorSchemeSelector: 'data-color-scheme',
  },
  /** **************************************
   * Typography
   *************************************** */
  fontFamily: {
    primary: 'Avenir LT Std, Public Sans Variable, Arial, sans-serif',
    secondary: 'Avenir LT Std, Public Sans Variable, Arial, sans-serif',
  },
  /** **************************************
   * Palette
   *************************************** */
  palette: {
    primary: {
      lighter: '#F9C9D3',
      light: '#F7B5B7',
      main: '#F27B96',
      dark: '#8F7689',
      darker: '#6D6E71',
      contrastText: '#FFFFFF',
    },
    secondary: {
      lighter: '#F9C9D3',
      light: '#C4AFBD',
      main: '#8F7689',
      dark: '#6D6E71',
      darker: '#4B4C4E',
      contrastText: '#FFFFFF',
    },
    info: {
      lighter: '#CAFDF5',
      light: '#61F3F3',
      main: '#00B8D9',
      dark: '#006C9C',
      darker: '#003768',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#D3FCD2',
      light: '#77ED8B',
      main: '#22C55E',
      dark: '#118D57',
      darker: '#065E49',
      contrastText: '#ffffff',
    },
    warning: {
      lighter: '#FFF5CC',
      light: '#FFD666',
      main: '#FFAB00',
      dark: '#B76E00',
      darker: '#7A4100',
      contrastText: '#1C252E',
    },
    error: {
      lighter: '#FFE9D5',
      light: '#FFAC82',
      main: '#FF5630',
      dark: '#B71D18',
      darker: '#7A0916',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#FCFBFC',
      100: '#F7F7F8',
      200: '#EEEFF0',
      300: '#E0E1E3',
      400: '#D0D1D4',
      500: '#BCBEC0',
      600: '#96979A',
      700: '#6D6E71',
      800: '#4B4C4E',
      900: '#2C2D2F',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
  },
};
