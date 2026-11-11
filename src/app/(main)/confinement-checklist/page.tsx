import { paths } from 'src/routes/paths';

import { JsonLd, breadcrumbJsonLd } from 'src/components/json-ld';

import { ChecklistView } from 'src/sections/confinement-checklist';
import { CHECKLIST_HERO_IMAGE } from 'src/sections/confinement-checklist/checklist-data';

// ----------------------------------------------------------------------

// The layout's title template appends the brand name, so TITLE leaves it out.
const TITLE = 'Confinement Checklist Singapore';
const SOCIAL_TITLE = `${TITLE} | Chilli Padi Confinement`;
const DESCRIPTION =
  'Free printable checklist for expecting parents: hospital bag, confinement meals, help at home and baby essentials. Download, save or share on WhatsApp.';

export const dynamic = 'force-static';
export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/confinement-checklist' },
  openGraph: {
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    url: '/confinement-checklist',
    images: [CHECKLIST_HERO_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    images: [CHECKLIST_HERO_IMAGE],
  },
};

export default function ConfinementChecklistPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd('Confinement Checklist', paths.confinementChecklist)} />
      <ChecklistView />
    </>
  );
}
