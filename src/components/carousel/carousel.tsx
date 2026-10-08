import type { Theme, SxProps } from '@mui/material/styles';
import type { UseCarouselReturn } from './hooks/use-carousel';

import { Children, isValidElement } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

import { carouselClasses } from './classes';
import { CarouselSlide } from './components';

// ----------------------------------------------------------------------

type CarouselProps = React.ComponentProps<'div'> & {
  sx?: SxProps<Theme>;
  carousel: UseCarouselReturn;
  slotProps?: {
    slide?: SxProps<Theme>;
  };
};

export function Carousel({
  sx,
  children,
  carousel,
  slotProps,
  className,
  ...other
}: CarouselProps) {
  const renderChildren = () =>
    Children.map(children, (child) => {
      if (!isValidElement(child)) return null;

      return (
        <CarouselSlide key={child.key} sx={slotProps?.slide}>
          {child}
        </CarouselSlide>
      );
    });

  return (
    <CarouselRoot
      ref={carousel.mainRef}
      sx={sx}
      className={mergeClasses([carouselClasses.root, className])}
      {...other}
    >
      <CarouselContainer className={carouselClasses.container}>{renderChildren()}</CarouselContainer>
    </CarouselRoot>
  );
}

// ----------------------------------------------------------------------

const CarouselRoot = styled('div')({
  margin: 'auto',
  maxWidth: '100%',
  overflow: 'hidden',
  position: 'relative',
});

const CarouselContainer = styled('ul')({
  display: 'flex',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  backfaceVisibility: 'hidden',
  touchAction: 'pan-y pinch-zoom',
});
