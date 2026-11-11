import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { JsonLd, breadcrumbJsonLd } from 'src/components/json-ld';

import { getProductCatalog } from 'src/sections/product/product-catalog';
import { TrialMealView, getTrialMealPrice } from 'src/sections/trial-meal';

// ----------------------------------------------------------------------

// The layout's title template appends the brand name, so TITLE leaves it out.
const TITLE = 'Confinement Trial Meal Singapore';
const SOCIAL_TITLE = `${TITLE} | Chilli Padi Confinement`;
const DESCRIPTION =
  'Try a Chilli Padi confinement meal before choosing a package. Taste the food, see the portions and experience our delivery in Singapore.';
const OG_IMAGE = '/banners/Trial-Meal/Pastel Pink Braised Meal Scene.png';

// The trial price comes from the live product catalog.
export const dynamic = 'force-dynamic';
export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/trial-meal' },
  openGraph: {
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    url: '/trial-meal',
    images: [OG_IMAGE],
  },
  twitter: { card: 'summary_large_image', title: SOCIAL_TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

export default async function TrialMealPage() {
  const catalog = await getProductCatalog();

  const price = getTrialMealPrice(catalog);

  // Only emitted when the live price is known, so the markup always matches the
  // price shown on the page.
  const offerJsonLd =
    price !== null
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Confinement Trial Meal',
          description: DESCRIPTION,
          image: `${CONFIG.siteUrl}${encodeURI(OG_IMAGE)}`,
          brand: { '@type': 'Brand', name: CONFIG.appName },
          offers: {
            '@type': 'Offer',
            url: `${CONFIG.siteUrl}${paths.trialMeal}`,
            price: price.toFixed(2),
            priceCurrency: 'SGD',
            availability: 'https://schema.org/InStock',
          },
        }
      : null;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd('Trial Meal', paths.trialMeal)} />
      {offerJsonLd && <JsonLd data={offerJsonLd} />}
      <TrialMealView price={price} />
    </>
  );
}
