'use client';

import type { PostItemData } from 'src/lib/post';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

type PostItemProps = {
  post: PostItemData;
  detailsHref: string;
};

export function PostItem({ post, detailsHref }: PostItemProps) {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 5,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'rgba(31, 41, 55, 0.08)',
        boxShadow: '0 18px 42px rgba(15, 23, 42, 0.05)',
        bgcolor: 'background.paper',
      }}
    >
      <Link component={RouterLink} href={detailsHref} underline="none" color="inherit">
        <Box sx={{ position: 'relative', aspectRatio: '4 / 3' }}>
          <Image
            fill
            alt={post.title}
            src={post.coverUrl}
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </Link>

      <CardContent sx={{ p: 3 }}>
        <Link
          component={RouterLink}
          href={detailsHref}
          underline="none"
          color="inherit"
          sx={{ display: 'block' }}
        >
          <Typography
            sx={(theme) => ({
              mb: 1.5,
              color: 'text.primary',
              fontWeight: 500,
              fontSize: { xs: '1.3rem', md: '1.4rem' },
              lineHeight: 1.28,
              ...theme.mixins.maxLine({ line: 3 }),
            })}
          >
            {post.title}
          </Typography>
        </Link>

        <Typography
          color="text.secondary"
          sx={(theme) => ({
            mb: 2.25,
            ...theme.typography.body1,
            ...theme.mixins.maxLine({ line: 4 }),
            lineHeight: 1.7,
          })}
        >
          {post.excerpt}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.25,
            mb: 2.5,
          }}
        >
          {post.tags.map((tag) => (
            <Typography
              key={tag}
              component="span"
              sx={{
                color: 'primary.main',
                fontSize: '0.92rem',
                lineHeight: 1.4,
              }}
            >
              {tag}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
