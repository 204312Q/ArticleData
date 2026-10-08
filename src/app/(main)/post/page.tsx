import { getPosts } from 'src/lib/post';

import { PostView } from 'src/sections/post';

// ----------------------------------------------------------------------

export const revalidate = 21600;
export const metadata = {
  title: 'Articles',
  description:
    'Articles from Chilli Padi Confinement on confinement nutrition, recovery, breastfeeding, and wellbeing for new mums.',
};

export default async function PostPage() {
  const posts = await getPosts();

  return <PostView posts={posts} />;
}
