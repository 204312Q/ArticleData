import { paths } from 'src/routes/paths';

import { JsonLd, breadcrumbJsonLd } from 'src/components/json-ld';

import { BenefitsView } from 'src/sections/benefits';

// ----------------------------------------------------------------------

export const dynamic = 'force-static';
// The layout's title template appends the brand name, so TITLE leaves it out.
const TITLE = 'Confinement Food Benefits Singapore';
const SOCIAL_TITLE = `${TITLE} | Chilli Padi Confinement`;
const DESCRIPTION =
  'Explore the ingredients and dishes in our Singapore confinement menu, from breastfeeding and postpartum recovery to soups, hydration and traditional nourishment.';
const OG_IMAGE = '/banners/Benefits/Chicken Soup and Greens on Pink.png';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/benefits' },
  openGraph: {
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    url: '/benefits',
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function BenefitsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd('Benefits', paths.benefits)} />
      <BenefitsView />
    </>
  );
}
