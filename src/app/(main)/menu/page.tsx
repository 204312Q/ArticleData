import { MenuView, getMenuPageData } from 'src/sections/menu';

// ----------------------------------------------------------------------

export const revalidate = 3600;
export const metadata = {
  title: 'Menu',
  description:
    'Browse the Chilli Padi Confinement 4-week rotating menu — recovery-focused dishes in week one, then nourishing daily lunch and dinner sets for the weeks after.',
};

export default async function MenuPage() {
  const data = await getMenuPageData();

  return <MenuView data={data} />;
}
