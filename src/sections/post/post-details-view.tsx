import type { PostItemData, PostContentBlock } from 'src/lib/post';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import NextLink from 'next/link';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
    if (block.type === 'table') {
    return (
      <TableContainer
        key={`table-${index}`}
        sx={{
          width: '100%',
          overflowX: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: 0,
          backgroundColor: 'transparent',
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Birth
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Food to Avoid
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Food to Eat
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {block.rows.map((row, rowIndex) => (
              <TableRow key={`${row.birth}-${rowIndex}`}>
                <TableCell align="center">
                  {row.birth}
                </TableCell>
                <TableCell align="center">
                  {row.avoid}
                </TableCell>
                <TableCell align="center">
                  {row.eat}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  if (block.type === 'heading') {
    return (
      <Typography key={`heading-${index}`} variant="h5" sx={{ mt: 1, color:'#68727D' , fontWeight: 800
      }}>
        {block.text}
      </Typography>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <Typography key={`paragraph-${index}`} color="text.secondary" sx={{ lineHeight: 1.95 }}>
        <ReactMarkdown
        components={{
          p: ({ children }) => <>{children}</>,
          strong: ({ children }) => (
            <Box component="strong" sx={{ fontWeight: 700, fontSize: '18px', color: '#68727D' }}>
              {children}
            </Box>
          )
        }}
      >
        {block.text}
      </ReactMarkdown>
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
        <Box
            key={`list-${index}`}
            component="ul"
            sx={{ m: 0, pl: 3, color: 'text.secondary', display: 'grid', gap: 1.25 }}
        >
            {block.items.map((item) => {
                const match = item.match(/^(.*?)(?:\*\*)(.*?)(?:\*\*)(.*)$/);

                return (
                    <Box key={item} component="li" sx={{ lineHeight: 2.0 }}>
                        {match ? (
                            <>
                                {match[1]}
                                <Typography
                                component="span"
                                sx={{ fontWeight: 800, color: '#68727D' }}
                                >
                                {match[2]}
                                </Typography>
                                {match[3]}
                            </>
                        ) : (
                            item
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}

if (block.type === 'pinkHeading') {
  return (
    <Typography
      key={`pink-heading-${index}`}
      variant="h4"
      sx={{
        mt: 1,
        fontSize: '1.6rem',
        fontWeight: 700,
        color: '#F07A9A',
        letterSpacing: '0.09em',
        lineHeight: 1.2,
        textTransform: 'uppercase',
      }}
    >
      {block.text}
    </Typography>
  );
}


if (block.type === 'image') {
  const isBanner = block.image.src === '/banners/banner.png';

  return (
    <Box
      key={`image-${index}`}
      sx={{
        width: '100%',
        maxWidth: isBanner ? 650 : '100%',
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          ...(isBanner
            ? { width: '100%', aspectRatio: 'auto' }
            : {
                aspectRatio: '16 / 9',
                borderRadius: 4,
                overflow: 'hidden',
              }),
        }}
      >
        {isBanner && (
          <NextLink
          href="https://www.chillipadiconfinement.com/product"
          target="_blank"
          rel="noopener noreferrer"
          style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
        }}
      />
     )}
        <Image
          fill={!isBanner}
          src={block.image.src}
          alt={block.image.alt}
          width={isBanner ? 650 : undefined}
          height={isBanner ? 57 : undefined}
          style={{
            ...(isBanner
              ? {
                  position: 'static',
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                }
              : {
                  objectFit: 'cover',
                  objectPosition: block.image.objectPosition ?? 'center',
                }),
          }}
        />
      </Box>

      {!block.caption && (
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

        <Typography variant="h2"
        sx={{
        color: 'primary.main',
        mb: 2,
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
        width:'100%',
        maxWidth: '800px',
        textAlign: 'center',
        }}>{post.title}
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

        
{post.reference && (
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
      References
    </Typography>

    {(Array.isArray(post.reference)
      ? post.reference
      : [post.reference]
    ).map((url, index) => (
      <Link
        key={url}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        sx={{
          display: 'block',
          mt: 0.5,
          wordBreak: 'break-word',
        }}
      >
       {url} 
       </Link> 
       ))}
  </Box> 
 )}
 </Container>
    </Box>
  );

}
