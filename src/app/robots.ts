import type { MetadataRoute } from 'next';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/docs/',
        '/pay-lab',
        '/meal-calendar',
        '/order-success',
        '/baby-full-month-gift-set/checkout',
      ],
    },
    sitemap: `${CONFIG.siteUrl}/sitemap.xml`,
  };
}
