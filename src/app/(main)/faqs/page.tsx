import { FaqsView } from 'src/sections/faqs';

// ----------------------------------------------------------------------

export const dynamic = 'force-static';
export const metadata = {
  title: 'FAQ',
  description:
    'Answers to common questions about Chilli Padi Confinement meals, service fulfilment, postponements and cancellations, add-ons, and our postnatal massage services.',
};

export default function FaqsPage() {
  return <FaqsView />;
}
