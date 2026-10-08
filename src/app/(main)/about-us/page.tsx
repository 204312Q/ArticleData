import { AboutView } from 'src/sections/about';

// ----------------------------------------------------------------------

export const dynamic = 'force-static';
export const metadata = {
  title: 'About Us',
  description:
    'Learn about Chilli Padi Confinement — a Singapore confinement caterer preparing Chinese confinement meals for new mums, with packages designed around different recovery timelines.',
};

export default function AboutUsPage() {
  return <AboutView />;
}
