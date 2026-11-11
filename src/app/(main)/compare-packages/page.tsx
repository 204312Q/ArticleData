import { paths } from 'src/routes/paths';

import { JsonLd, breadcrumbJsonLd } from 'src/components/json-ld';

import { getProductCatalog } from 'src/sections/product/product-catalog';
import { getDualMealColumns, ComparePackagesView } from 'src/sections/compare-packages';

// ----------------------------------------------------------------------

// The layout's title template appends the brand name, so TITLE leaves it out.
const TITLE = 'Compare Confinement Meal Packages';
const SOCIAL_TITLE = `${TITLE} | Chilli Padi Confinement`;
const DESCRIPTION =
  'Compare our 7, 14 and 28 day confinement meal packages in Singapore: lunch and dinner, total meals, package price and price per meal.';

const OG_IMAGE = '/banners/Compare-Packages/Pastel Blossom Feast with Traditional Bowls.png';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/compare-packages' },
  openGraph: {
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    url: '/compare-packages',
    images: [OG_IMAGE],
  },
  twitter: { card: 'summary_large_image', title: SOCIAL_TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

export default async function ComparePackagesPage() {
  const catalog = await getProductCatalog();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd('Compare Packages', paths.comparePackages)} />
      <ComparePackagesView columns={getDualMealColumns(catalog)} />
    </>
  );
}
