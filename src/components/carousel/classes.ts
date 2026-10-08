import { createClasses } from 'src/theme/create-classes';

// ----------------------------------------------------------------------

export const carouselClasses = {
  root: createClasses('carousel__root'),
  container: createClasses('carousel__container'),
  dots: {
    root: createClasses('carousel__dots__root'),
    item: createClasses('carousel__dot__item'),
    itemSelected: createClasses('carousel__dot__selected'),
  },
  slide: {
    root: createClasses('carousel__slide__root'),
  },
};
