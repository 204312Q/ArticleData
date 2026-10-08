import type { PostItemData } from './types';

import { mockPosts } from 'src/mock_data/post-data';

export async function getPosts(): Promise<PostItemData[]> {
  return mockPosts;
}

export async function getPostBySlug(slug: string): Promise<PostItemData | undefined> {
  return mockPosts.find((post) => post.slug === slug);
}
