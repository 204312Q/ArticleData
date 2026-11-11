import type { ProductCatalog } from 'src/sections/product/product-data';

// ----------------------------------------------------------------------

// NOTE: copy follows the brief from the team. Dish photos are cropped from the
// trial set photo (public/trial-meal) so they show exactly what is delivered.

const WHATSAPP_NUMBER = '6587257099';
const WHATSAPP_MESSAGE = "Hi, I'd like to ask about your trial meal.";

export const TRIAL_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

export type TrialReasonIcon = 'taste' | 'portions' | 'variety' | 'delivery';

export const TRIAL_REASONS: { icon: TrialReasonIcon; title: string; description: string }[] = [
  {
    icon: 'taste',
    title: 'Taste the food',
    description: 'Enjoy a complete confinement meal and find out if it suits your taste.',
  },
  {
    icon: 'portions',
    title: 'See the portions',
    description: 'Get a real sense of our serving size and presentation before you commit.',
  },
  {
    icon: 'variety',
    title: 'Enjoy the variety',
    description: 'Sample a full set of dishes: a main, a vegetable, a soup, rice and a warm tea.',
  },
  {
    icon: 'delivery',
    title: 'Experience the delivery',
    description: 'See how our meals are prepared, packed and delivered to you.',
  },
];

export const TRIAL_DISHES = [
  {
    name: "Pig's Trotters with Black Vinegar, Ginger and Egg",
    image: '/trial-meal/pigs-trotters.webp',
  },
  {
    name: 'Stir-Fried Spinach with Sea Cucumber topped with Wolfberries',
    image: '/trial-meal/spinach-sea-cucumber.webp',
  },
  {
    name: 'Sesame Kampung Chicken with Omelette',
    image: '/trial-meal/sesame-chicken.webp',
  },
  {
    name: 'Red Bean, Burdock Pork Rib Soup',
    image: '/trial-meal/red-bean-soup.webp',
  },
  {
    name: 'Steamed Fragrant White Rice',
    image: '/trial-meal/white-rice.webp',
  },
  {
    name: 'Longan with Red Dates Tea',
    image: '/trial-meal/longan-red-dates-tea.webp',
  },
];

export type TrialDeliveryIcon = 'lunch' | 'dinner' | 'sentosa' | 'closed';

export const TRIAL_DELIVERY: { icon: TrialDeliveryIcon; label: string; value: string }[] = [
  { icon: 'lunch', label: 'Lunch', value: '10am – 1pm' },
  { icon: 'dinner', label: 'Dinner', value: '4pm – 7pm' },
  { icon: 'sentosa', label: 'Sentosa', value: 'additional $20 per trip' },
  {
    icon: 'closed',
    label: 'No deliveries on',
    value: "Christmas Day, Chinese New Year's Eve, and the first and second days of Chinese New Year",
  },
];

/** Live trial price from the product catalog, or null if it can't be found. */
export function getTrialMealPrice(catalog: ProductCatalog): number | null {
  const trial = catalog.packageCategories.find((category) => category.id === 'trial-meal');
  const option = trial?.options.find((item) => item.durationDays === 1) ?? trial?.options[0];

  return option ? option.price : null;
}
