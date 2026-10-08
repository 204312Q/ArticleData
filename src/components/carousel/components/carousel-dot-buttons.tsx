import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';

import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

import { carouselClasses } from '../classes';

// ----------------------------------------------------------------------

type CarouselDotButtonsProps = BoxProps<'ul'> & {
  sx?: SxProps<Theme>;
  scrollSnaps: number[];
  selectedIndex: number;
  onClickDot: (index: number) => void;
  dotLabelPrefix?: string;
};

export function CarouselDotButtons({
  sx,
  className,
  onClickDot,
  scrollSnaps,
  selectedIndex,
  dotLabelPrefix = 'carousel-dot',
  ...other
}: CarouselDotButtonsProps) {
  return (
    <Box
      component="ul"
      className={mergeClasses([carouselClasses.dots.root, className])}
      sx={[
        {
          gap: 1,
          zIndex: 9,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& > li': {
            display: 'inline-flex',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {scrollSnaps.map((_, index) => {
        const selected = index === selectedIndex;

        return (
          <li key={index}>
            <DotItem
              disableRipple
              selected={selected}
              aria-label={`${dotLabelPrefix}-${index + 1}`}
              className={mergeClasses(carouselClasses.dots.item, {
                [carouselClasses.dots.itemSelected]: selected,
              })}
              onClick={() => onClickDot(index)}
            />
          </li>
        );
      })}
    </Box>
  );
}

// ----------------------------------------------------------------------

const DotItem = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ selected, theme }) => ({
  width: 14,
  height: 14,
  padding: 0,
  borderRadius: 999,
  color: 'common.white',
  '&::before': {
    content: '""',
    width: selected ? 28 : 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: selected
      ? theme.vars.palette.common.white
      : varAlpha(theme.vars.palette.common.whiteChannel, 0.48),
    transition: theme.transitions.create(['width', 'background-color'], {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));
