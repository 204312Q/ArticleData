import type { ProductCatalog } from 'src/sections/product/product-data';

// ----------------------------------------------------------------------

/** Durations shown in the comparison table, in column order. */
const COMPARED_DAYS = [7, 14, 28];

/** Dual meal = lunch + dinner. */
const MEALS_PER_DAY = 2;

export type ComparePackageColumn = {
  id: string;
  label: string;
  totalMeals: number;
  price: number;
  pricePerMeal: number;
};

export function getDualMealColumns(catalog: ProductCatalog): ComparePackageColumn[] {
  const dualMeal = catalog.packageCategories.find((category) => category.id === 'dual-meal');

  if (!dualMeal) {
    return [];
  }

  return COMPARED_DAYS.flatMap((days) => {
    const option = dualMeal.options.find((item) => item.durationDays === days);

    if (!option) {
      return [];
    }

    const totalMeals = days * MEALS_PER_DAY;

    return [
      {
        id: option.id,
        label: `${days} Days`,
        totalMeals,
        price: option.price,
        pricePerMeal: option.price / totalMeals,
      },
    ];
  });
}

export function formatPrice(value: number) {
  return `$${value.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatPricePerMeal(value: number) {
  return `$${value.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
