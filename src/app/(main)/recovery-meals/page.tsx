import { paths } from 'src/routes/paths';

import { JsonLd, breadcrumbJsonLd } from 'src/components/json-ld';

import { RecoveryView } from 'src/sections/recovery';

// ----------------------------------------------------------------------

// The layout's title template appends the brand name, so TITLE leaves it out.
const TITLE = 'Post-Surgery & Recovery Meals Delivered';
const SOCIAL_TITLE = `${TITLE} | Chilli Padi Confinement`;
const DESCRIPTION =
  'Meal delivery for your time recovering at home. Speak with our team about recovery meals, dietary requirements and delivery arrangements in Singapore.';
const OG_IMAGE = '/banners/Recovery-Meals/Asian Recovery Meal Table Setting.png';

export const dynamic = 'force-static';
export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/recovery-meals' },
  openGraph: {
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    url: '/recovery-meals',
    images: [OG_IMAGE],
  },
  twitter: { card: 'summary_large_image', title: SOCIAL_TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

export default function RecoveryMealsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd('Post-Surgery & Recovery Meals', paths.recoveryMeals)} />
      <RecoveryView />
    </>
  );
}
