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
  

if (block.type === 'practiceTable') {
  return (
    <TableContainer
      key={index}
      sx={{ my: 3, border: '2px solid #e2e4e7' }}
    >
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            {block.headers.map((header, i) => (
              <TableCell key={i} sx={{ fontWeight: 800 }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {block.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.cells.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  colSpan={cell.colSpan ?? 1}
                  sx={{
                    color: '#68727D',
                    lineHeight: 1.8,
                    verticalAlign: 'top',
                    fontWeight: cell.bold ? 700 : 400,
                    whiteSpace: 'pre-line',
                    border: '1px solid #e2e4e7 !important',
                    borderRight: '1px solid #e2e4e7 !important',
                  }}
                >
                  {cell.text}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
  
if (block.type === 'spacedHeading') {
  return (
    <Typography
      key={`spaced-heading-${index}`}
      sx={{
        mt: 4,
        mb: 2,
        color: '#68727D',
        fontSize: { xs: '1.15rem', md: '1.6rem' },
        fontWeight: 400,
        letterSpacing: '2px',
        lineHeight: 1.5,
        textTransform: 'uppercase',
      }}
    >
      {block.number && `${block.number}. `}
      {block.text}
    </Typography>
  );
}

  
if (block.type === 'promoLink') {
  return (
    <Typography
      key={index}
      component="p"
      sx={{
        mt: 0.8,
        mb: 1,
        fontSize: '1.0rem',
        fontStyle: 'italic',
        fontWeight: 400,
        lineHeight: 1.5,
        color: '#68727D',
      }}
    >
      {block.before}{' '}
      <Box
        component="a"
        href={block.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: '#f47795',
          fontStyle: 'italic',
          textDecoration: 'none',
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        {block.linkText}
      </Box>{' '}
      {block.after}
    </Typography>
  );
}

  
if (block.type === 'comparisonTable') {
  return (
    <Box key={index} sx={{ my: 4, width: '100%' }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: '#68727D',
          fontWeight: 800,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          textAlign: 'left',
        }}
      >
        {block.title}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          borderTop: '1px solid #e2e4e7',
          borderLeft: '1px solid #e2e4e7',
          backgroundColor: 'rgba(255,255,255,0.65)',
        }}
      >
        {/* Pros header */}
        <Box
          sx={{
            p: 1.5,
            textAlign: 'center',
            fontWeight: 800,
            color: '#f47795',
            borderRight: '1px solid #e2e4e7',
            borderBottom: '1px solid #e2e4e7',
          }}
        >
          Pros
        </Box>

        {/* Cons header */}
        <Box
          sx={{
            p: 1.5,
            textAlign: 'center',
            fontWeight: 800,
            color: '#68727D',
            borderRight: '1px solid #e2e4e7',
            borderBottom: '1px solid #e2e4e7',
          }}
        >
          Cons
        </Box>

        {Array.from(
          { length: Math.max(block.pros.length, block.cons.length) },
          (_, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{
                display: 'contents',
              }}
            >
              {/* Pros cell */}
              <Box
                sx={{
                  p: 1.5,
                  textAlign: 'center',
                  lineHeight: 1.8,
                  color: '#68727D',
                  borderRight: '1px solid #e2e4e7',
                  borderBottom: '1px solid #e2e4e7',
                }}
              >
                {block.pros[rowIndex] && (
                  <>
                    <Box
                      component="span"
                      sx={{ color: '#f47795', fontWeight: 800 }}
                    >
                      {block.pros[rowIndex].title}
                    </Box>{' '}
                    {block.pros[rowIndex].text}
                  </>
                )}
              </Box>

              {/* Cons cell */}
              <Box
                sx={{
                  p: 1.5,
                  textAlign: 'center',
                  lineHeight: 1.8,
                  color: '#68727D',
                  borderRight: '1px solid #e2e4e7',
                  borderBottom: '1px solid #e2e4e7',
                }}
              >
                {block.cons[rowIndex] && (
                  <>
                    <Box
                      component="span"
                      sx={{ fontWeight: 800 }}
                    >
                      {block.cons[rowIndex].title}
                    </Box>{' '}
                    {block.cons[rowIndex].text}
                  </>
                )}
              </Box>
            </Box>
          ),
        )}
      </Box>
    </Box>
  );
}

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

  if (block.type === 'standardHeading') {
  return (
    <Typography
      key={`standard-heading-${index}`}
      variant="h4"
      sx={{
        mt: 1,
        color: '#68727D',
        fontWeight: 700,
      }}
    >
      {block.text}
    </Typography>
  );
}
  
if (block.type === 'heading') {
  const headingSize = {
    small: 'h5',
    medium: 'h4',
    large: 'h3',
  } as const;

  return (
    <Typography
      key={`heading-${index}`}
      variant={headingSize[block.size ?? 'medium']}
      sx={{
        mt: 1,
        color: '#68727D',
        fontWeight: block.fontWeight ?? 700,
        letterSpacing: '1.5px',
        textTransform: block.uppercase ? 'uppercase' : 'none',
        ...(block.size === 'large' && {
          fontSize: { xs: '1rem', md: '2rem' },
          lineHeight: 1.2,
        }),
      }}
    >
      {block.text}
    </Typography>
  );
}


  

if (block.type === 'paragraph') {
  const urls: Record<string, string> = {
    'Lactation cookies': 'https://www.chillipadiconfinement.com/product',
    'lactation nougats': 'https://www.chillipadiconfinement.com/product',
    'Kühlbarra’s Barramundi' : 'https://kuhlbarra.com/our-kuhl-tale',
    'Chilli Padi Confinement' : 'https://www.chillipadiconfinement.com/',
    'Best Aquaculture Practice (BAP)' : 'https://bapcertification.org/WhoWeAre',
    'An article on the Ministry of Social and Family Development’s website' : 'https://www.babybonus.msf.gov.sg/parentingresources/web/Pregnancy/Nutrition/Supplements/Pregnancy_Confinement_Practices_Myths?_adf.ctrl-state=makh9awou_4&_afrLoop=4362227373891004&_afrWindowMode=0&_afrWindowId=null#%40%3F_afrWindowId%3Dnull%26_afrLoop%3D4362227373891004%26_afrWindowMode%3D0%26_adf.ctrl-state%3D193jv6t2y5_4',

  };

  const paragraphParts = block.text.split(/(\^\^.*?\^\^)/g);

  return (
    <Typography
      key={`paragraph-${index}`}
      component="p"
      color="#68727D"
      sx={{ lineHeight: 1.95 }}
    >
      {paragraphParts.map((part, partIndex) => {
        if (part.startsWith('^^') && part.endsWith('^^')) {
          const linkText = part.slice(2, -2);

          return (
            <Box
              key={partIndex}
              component="a"
              href={urls[linkText] ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#f47795',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {linkText}
            </Box>
          );
        }

        const leadingSpace = /^\s/.test(part);
        const trailingSpace = /\s$/.test(part);

        return (
          <Box component="span" key={partIndex}>
            {leadingSpace ? ' ' : ''}
            <ReactMarkdown
              components={{
                p: ({ children }) => <>{children}</>,
                strong: ({ children }) => (
                  <Box
                    component="strong"
                    sx={{
                      fontWeight: 700,
                      fontSize: '17px',
                      color: '#68727D',
                    }}
                  >
                    {children}
                  </Box>
                ),
              }}
            >
              {part.trim()}
            </ReactMarkdown>
            {trailingSpace ? ' ' : ''}
          </Box>
        );
      })}
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
  if (block.type === 'steriliserTable') {
  return (
    <Box
      key={`steriliser-table-${index}`}
      sx={{
        width: '100%',
        border: '1px solid',
        borderColor: 'divider',
        mt: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{ p: 2, fontWeight: 800, color: '#68727D' }}
      >
        {block.title}
      </Typography>

      {block.rows.map((item, rowIndex) => (
        <Box
          key={`${item.name}-${rowIndex}`}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#68727D' }}>
              {item.name}
            </Typography>

            <Typography sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              {item.description}
            </Typography>

            {item.pros && (
              <Typography sx={{ mt: 1, lineHeight: 1.8, color: 'text.secondary' }}>
                <strong>• Pros:</strong> {item.pros}
              </Typography>
            )}

            {item.cons && (
              <Typography sx={{ mt: 0.5, lineHeight: 1.8, color: 'text.secondary' }}>
                <strong>• Cons:</strong> {item.cons}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: { xs: 0, md: '1px solid #e5e5e5' },
              borderColor: 'divider',
            }}
          >
            <Image
              src={item.image.src}
              alt={item.image.alt}
              width={700}
              height={500}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>
      ))}
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
  const listStyle = block.style ?? 'bullet';

  return (
    <Box
      key={`list-${index}`}
      component={listStyle === 'number' ? 'ol' : 'ul'}
      sx={{
        m: 0,
        pl: listStyle === 'none' ? 3 : 5,
        color: '#68727D',
        display: 'grid',
        gap: 1.25,
        listStyleType:
          listStyle === 'number'
            ? 'decimal'
            : listStyle === 'bullet'
              ? 'disc'
              : 'none',
      }}
    >
      {block.items.map((item, itemIndex) => {
        const match = item.match(/^(.*?)(\*\*)(.*?)(\*\*)(.*)$/);

        return (
          <Box
            key={itemIndex}
            component="li"
            sx={{ lineHeight: 2.0 , '&::marker': {fontWeight: 800}, }}
          >
            
            {(match ? [match[1], match[3], match[5]] : [item]).map(
              (textPart, textIndex) => {
            // Keep the existing bold heading
            if (match && textIndex === 1) {
            return (
            <Typography
            key={textIndex}
            component="span"
            sx={{ fontWeight: 800, color: '#68727D' }} >
            {textPart}
        </Typography>
      );
    }

    // Turn ^^text^^ into a pink clickable link
    return textPart.split(/(\^\^.*?\^\^)/g).map((part, partIndex) => {
      if (part.startsWith('^^') && part.endsWith('^^')) {
        const linkText = part.slice(2, -2);

        const urls: Record<string, string> = {
          'Confinement Angels': 'https://confinementangels.com.sg/',
          'PEM Confinement Nanny Agency': 'https://pemconfinement.com//',
          'Caregiver Asia': 'https://www.caregiverasia.com/lander',
          'NannySOS': 'https://www.nannysos.com.sg/',
        };

        return (
          <Box
            key={`${textIndex}-${partIndex}`}
            component="a"
            href={urls[linkText] ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#f47795',
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {linkText}
          </Box>
        );
      }
            return (
            <span key={`${textIndex}-${partIndex}`}> {part} </span>
          );
         });
        }
        )}
        </Box>
        )
      ;})
     }
  </Box>
);}


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
        letterSpacing: '0.10em',
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
        maxWidth: isBanner ? '100%' : '100%',
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
          width={isBanner ? 1200 : undefined}
          height={isBanner ? 105 : undefined}
          style={{
            ...(isBanner
              ? {
                  position: 'static',
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                }
              : {
                  objectFit: block.image.fit ?? 'cover',
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
