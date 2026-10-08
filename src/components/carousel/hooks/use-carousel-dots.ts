'use client';

import type { EmblaCarouselType } from 'embla-carousel';

import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useCarouselDots(mainApi?: EmblaCarouselType) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onClickDot = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index);
    },
    [mainApi]
  );

  const onInit = useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!mainApi) return;

    onInit(mainApi);
    onSelect(mainApi);

    mainApi.on('reInit', onInit);
    mainApi.on('reInit', onSelect);
    mainApi.on('select', onSelect);
  }, [mainApi, onInit, onSelect]);

  return {
    scrollSnaps,
    selectedIndex,
    onClickDot,
  };
}
