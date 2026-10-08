'use client';

import type { EmblaPluginType, EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';

import useEmblaCarousel from 'embla-carousel-react';

import { useTheme } from '@mui/material/styles';

import { useCarouselDots } from './use-carousel-dots';

// ----------------------------------------------------------------------

export type UseCarouselReturn = {
  mainRef: ReturnType<typeof useEmblaCarousel>[0];
  mainApi?: EmblaCarouselType;
  dots: ReturnType<typeof useCarouselDots>;
};

export function useCarousel(options?: EmblaOptionsType, plugins?: EmblaPluginType[]) {
  const theme = useTheme();

  const [mainRef, mainApi] = useEmblaCarousel(
    { ...options, direction: theme.direction },
    plugins
  );

  const dots = useCarouselDots(mainApi);

  return {
    mainRef,
    mainApi,
    dots,
  } satisfies UseCarouselReturn;
}
