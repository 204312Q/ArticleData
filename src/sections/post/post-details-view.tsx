import type { PostItemData, PostContentBlock } from 'src/lib/post';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

type PostDetailsViewProps = {
  post: PostItemData;
};

const categoryChipSx = {
  bgcolor: 'rgba(242, 123, 150, 0.12)',
  color: 'primary.main',
  fontWeight: 700,
} as const;

function renderBlock(block: PostContentBlock, index: number) {
  if (block.type === 'heading') {
    return (
      <Typography key={`heading-${index}`} variant="h4" sx={{ mt: 1, color: 'text.primary' }}>
        {block.text}
      </Typography>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <Typography key={`paragraph-${index}`} color="text.secondary" sx={{ lineHeight: 1.95 }}>
        {block.text}
      </Typography>
    );
  }

  if (block.type === 'quote') {
    return (
      <Box
        key={`quote-${index}`}
        sx={{
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2.5,
          py: 0.5,
        }}
      >
        <Typography sx={{ fontSize: { xs: '1.15rem', md: '1.3rem' }, lineHeight: 1.7, fontStyle: 'italic' }}>
          {block.text}
        </Typography>
      </Box>
    );
  }

  if (block.type === 'callout') {
    return (
      <Box
        key={`callout-${index}`}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: 'rgba(242, 123, 150, 0.08)',
          border: '1px solid rgba(242, 123, 150, 0.16)',
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main', fontWeight: 700 }}>
          {block.title}
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>
          {block.text}
        </Typography>
      </Box>
    );
  }

  if (block.type === 'list') {
    return (
      <Box key={`list-${index}`} component="ul" sx={{ m: 0, pl: 3, color: 'text.secondary', display: 'grid', gap: 1.25 }}>
        {block.items.map((item) => (
          <Box key={item} component="li" sx={{ lineHeight: 1.8 }}>
            {item}
          </Box>
        ))}
      </Box>
    );
  }

  if (block.type === 'image') {
    return (
      <Box key={`image-${index}`}>
        <Box sx={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: 4, overflow: 'hidden' }}>
          <Image fill alt={block.image.alt} src={block.image.src} style={{ objectFit: 'cover' }} />
        </Box>

        {!!block.caption && (
          <Typography color="text.secondary" sx={{ mt: 1.25, fontSize: '0.9rem' }}>
            {block.caption}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box key={`gallery-${index}`}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        }}
      >
        {block.images.map((imageItem) => (
          <Box
            key={imageItem.src}
            sx={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 3, overflow: 'hidden' }}
          >
            <Image fill alt={imageItem.alt} src={imageItem.src} style={{ objectFit: 'cover' }} />
          </Box>
        ))}
      </Box>

      {!!block.caption && (
        <Typography color="text.secondary" sx={{ mt: 1.25, fontSize: '0.9rem' }}>
          {block.caption}
        </Typography>
      )}
    </Box>
  );
}

export function PostDetailsView({ post }: PostDetailsViewProps) {
  return (
    <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
      <Container maxWidth="md">
        <Link
          component={RouterLink}
          href={paths.post.root}
          underline="none"
          color="text.secondary"
          sx={{ display: 'inline-flex', mb: 4 }}
        >
          Back to Articles
        </Link>

        <Typography variant="h2" sx={{ color: 'primary.main', mb: 2 }}>
          {post.title}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ fontSize: { xs: '1rem', md: '1.08rem' }, lineHeight: 1.9, mb: 2.5 }}
        >
          {post.excerpt}
        </Typography>

        <Chip label={post.category} size="small" sx={{ ...categoryChipSx, mb: 4 }} />

        <Box sx={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: 4, overflow: 'hidden', mb: 4 }}>
          <Image fill alt={post.title} src={post.coverUrl} style={{ objectFit: 'cover' }} />
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ display: 'grid', gap: 3 }}>
          {post.blocks.map((block, index) => renderBlock(block, index))}
        </Box>

        {!!post.reference && (
          <Box
            sx={{
              mt: 5,
              p: 3,
              borderRadius: 3,
              bgcolor: 'rgba(15, 23, 42, 0.03)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
            }}
          >
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Reference
            </Typography>

            <Link
              href={post.reference}
              target="_blank"
              rel="noreferrer"
              underline="hover"
              sx={{ display: 'block', mt: 0.5, wordBreak: 'break-word' }}
            >
              {post.reference}
            </Link>
          </Box>
        )}
      </Container>
    </Box>
  );
}
