import type { Theme, SxProps } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

import { carouselClasses } from '../classes';

// ----------------------------------------------------------------------

type CarouselSlideProps = React.ComponentProps<'li'> & {
  sx?: SxProps<Theme>;
};

export function CarouselSlide({ sx, className, children, ...other }: CarouselSlideProps) {
  return (
    <CarouselSlideRoot
      className={mergeClasses([carouselClasses.slide.root, className])}
      sx={sx}
      {...other}
    >
      {children}
    </CarouselSlideRoot>
  );
}

// ----------------------------------------------------------------------

const CarouselSlideRoot = styled('li')({
  minWidth: 0,
  display: 'block',
  position: 'relative',
  flex: '0 0 100%',
});
