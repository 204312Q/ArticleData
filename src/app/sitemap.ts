import type { MetadataRoute } from 'next';

import { paths } from 'src/routes/paths';

import { getPosts } from 'src/lib/post';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${CONFIG.siteUrl}${paths.home}`, changeFrequency: 'weekly', priority: 1 },
    { url: `${CONFIG.siteUrl}${paths.menu}`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${CONFIG.siteUrl}${paths.product.root}`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${CONFIG.siteUrl}${paths.about}`, changeFrequency: 'monthly', priority: 0.8 },
    {
      url: `${CONFIG.siteUrl}${paths.babyFullMonthGiftSet}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: `${CONFIG.siteUrl}${paths.post.root}`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${CONFIG.siteUrl}${paths.faqs}`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${CONFIG.siteUrl}${paths.termsOfUse}`, changeFrequency: 'yearly', priority: 0.2 },
    {
      url: `${CONFIG.siteUrl}${paths.dataProtectionNotice}`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${CONFIG.siteUrl}${paths.post.details(post.slug)}`,
    lastModified: new Date(post.createdAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
