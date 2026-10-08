import { BabyFullMonthGiftSetView } from 'src/sections/baby-full-month-gift-set';
import { getGiftSetProducts } from 'src/sections/baby-full-month-gift-set/baby-full-month-gift-set-catalog';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Baby Full Month Gift Set',
  description:
    'Celebrate your baby\'s full month with Chilli Padi Confinement\'s gift sets — a thoughtful way to welcome your baby and share the joy with loved ones.',
};

export default async function BabyFullMonthGiftSetPage() {
  const products = await getGiftSetProducts();

  return <BabyFullMonthGiftSetView products={products} />;
}
