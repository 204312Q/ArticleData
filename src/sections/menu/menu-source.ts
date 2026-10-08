import type { DishCard } from '../home/home-data';
import type {
  MenuPool,
  MenuDaySet,
  GalleryTile,
  MenuWeekOption,
} from './menu-data';

import {
  nourishMenuPool,
  nonOperatingDays,
  recoveryMenuPool,
  dishGalleryTiles,
  MENU_WEEK_OPTIONS,
  menuPopularDishes,
  EMPTY_MENU_DAY_SET,
  menuOrderStepImages,
} from './menu-data';

// ----------------------------------------------------------------------

export type MenuPageData = {
  weekOptions: MenuWeekOption[];
  emptyDaySet: MenuDaySet;
  nonOperatingDays: string[];
  nourishMenuPool: MenuPool;
  recoveryMenuPool: MenuPool;
  popularDishes: DishCard[];
  orderStepImages: string[];
  galleryTiles: GalleryTile[];
};

export function getDefaultMenuPageData(): MenuPageData {
  return {
    weekOptions: MENU_WEEK_OPTIONS,
    emptyDaySet: EMPTY_MENU_DAY_SET,
    nonOperatingDays,
    nourishMenuPool,
    recoveryMenuPool,
    popularDishes: menuPopularDishes,
    orderStepImages: menuOrderStepImages,
    galleryTiles: dishGalleryTiles,
  };
}

export async function getMenuPageData(): Promise<MenuPageData> {
  // Future Business Central integration should fetch, validate, and normalize
  // the remote payload here before passing typed data into the UI.
  return getDefaultMenuPageData();
}
