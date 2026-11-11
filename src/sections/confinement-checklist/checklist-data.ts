import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const CHECKLIST_HERO_IMAGE = '/banners/Confinement-Checklist/Pastel Pink Braised Meal Scene.png';

export const CHECKLIST_SECTIONS: { title: string; items: string[] }[] = [
  {
    title: 'Birth and hospital arrangements',
    items: [
      'Confirm your hospital’s admission instructions',
      'Keep your hospital and care team’s contact details handy',
      'Plan transport and a backup arrangement',
    ],
  },
  {
    title: 'Pack your hospital bag',
    items: [
      'Check your hospital’s recommended packing list',
      'Pack identification, admission documents and maternity essentials',
      'Prepare baby’s going-home clothes and suitable transport',
    ],
  },
  {
    title: 'Plan your Chilli Padi Confinement meals',
    items: [
      'Decide who will prepare or deliver your meals',
      'Discuss dietary preferences, allergies and any care-team advice',
      'Confirm how to activate or change your meal start date',
    ],
  },
  {
    title: 'Arrange help at home',
    items: [
      'Agree on household tasks and support with your partner or family',
      'Plan childcare for older children, if needed',
      'Confirm arrangements with your confinement nanny or helper',
    ],
  },
  {
    title: 'Set up baby’s essentials',
    items: [
      'Prepare a safe sleep space following local guidance',
      'Get feeding and changing essentials ready',
      'Wash and organise baby’s clothes and bedding',
    ],
  },
  {
    title: 'Keep important details together',
    items: [
      'Note postnatal and baby follow-up arrangements',
      'Save contacts for feeding support and meal delivery',
      'Share your plans with the people helping you',
    ],
  },
];

export const USEFUL_DETAIL_FIELDS = ['Hospital contact', 'Support person', 'Meal delivery contact'];

export const CHECKLIST_DOWNLOAD_PATH = `${paths.confinementChecklist}/download`;

export const CHECKLIST_ITEM_COUNT = CHECKLIST_SECTIONS.reduce(
  (sum, section) => sum + section.items.length,
  0
);

