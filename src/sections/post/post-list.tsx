'use client';

import type { PostItemData } from 'src/lib/post';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { PostItem } from './post-item';

// ----------------------------------------------------------------------

type PostListProps = {
  posts: PostItemData[];
};

export function PostList({ posts }: PostListProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      {posts.map((post) => (
        <Box key={post.id}>
          <PostItem post={post} detailsHref={paths.post.details(post.slug)} />
        </Box>
      ))}
    </Box>
  );
}
