import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { getPosts, getPostBySlug } from 'src/lib/post';

import { PostDetailsView } from 'src/sections/post';

// ----------------------------------------------------------------------

export const revalidate = 21600;

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

type PostDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PostDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: [{ url: post.coverUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverUrl],
    },
  };
}

export default async function PostDetailsPage({ params }: PostDetailsPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <PostDetailsView post={post} />;
}
