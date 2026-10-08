import { BackToTopButton } from 'src/components/animate';

import { AboutWhat } from './about-what';
import { AboutVision } from './about-vision';
import { AboutViewPackage } from './about-view-package';
import { AboutTestimonials } from './about-testimonials';

// ----------------------------------------------------------------------

export function AboutView() {
  return (
    <>
      <AboutVision />
      <AboutWhat />
      <AboutViewPackage />
      <AboutTestimonials />
      <BackToTopButton color="primary" />
    </>
  );
}
