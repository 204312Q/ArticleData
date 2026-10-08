import { ProductView } from 'src/sections/product';
import { getProductCatalog } from 'src/sections/product/product-catalog';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Confinement Meal Packages',
  description:
    'Choose a Chilli Padi Confinement meal package — 7, 14, or 28 days of dual or single meal delivery, with pricing and add-ons.',
};

export default async function ProductPage() {
  const productCatalog = await getProductCatalog();

  return <ProductView productCatalog={productCatalog} />;
}
