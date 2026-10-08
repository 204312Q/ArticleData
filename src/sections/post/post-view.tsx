'use client';

import type { PostItemData, PostSortValue } from 'src/lib/post';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

import { POST_SORT_OPTIONS } from 'src/lib/post';

import { SearchNotFound } from 'src/components/search-not-found/search-not-found';

import { PostList } from './post-list';
import { PostSort } from './post-sort';
import { PostFilter } from './post-filter';
import { PostSearch } from './post-search';

// ----------------------------------------------------------------------

type PostViewProps = {
  posts: PostItemData[];
};

const POSTS_PER_PAGE = 8;

export function PostView({ posts }: PostViewProps) {
  const [sortBy, setSortBy] = useState<PostSortValue>('latest');
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [page, setPage] = useState(1);

  const tagOptions = useMemo(
    () => [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b)),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filteredByTag =
      tagFilter === 'all' ? posts : posts.filter((post) => post.tags.includes(tagFilter));

    const searched = normalizedQuery
      ? filteredByTag.filter((post) =>
          [post.title, post.excerpt, post.category, ...post.tags]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : filteredByTag;

    const ordered = [...searched];

    if (sortBy === 'latest') {
      ordered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (sortBy === 'oldest') {
      ordered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return ordered;
  }, [posts, query, sortBy, tagFilter]);

  const pageCount = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * POSTS_PER_PAGE;

    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, page]);

  useEffect(() => {
    setPage(1);
  }, [query, sortBy, tagFilter]);

  useEffect(() => {
    if (pageCount > 0 && page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  return (
    <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 4, md: 5 }, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ color: 'primary.main', mb: 1.5 }}>
            Articles
          </Typography>
          
        </Box>

        <Box
          sx={{
            gap: 2,
            display: 'flex',
            mb: { xs: 4, md: 5 },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
          }}
        >
          <PostSearch value={query} onChange={setQuery} />
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
            }}
          >
            <PostFilter value={tagFilter} options={tagOptions} onChange={setTagFilter} />
            <PostSort sort={sortBy} sortOptions={POST_SORT_OPTIONS} onSort={setSortBy} />
          </Box>
        </Box>

        {filteredPosts.length ? (
          <>
            <PostList posts={paginatedPosts} />

            {pageCount > 1 && (
              <Box sx={{ mt: { xs: 4, md: 5 }, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  page={page}
                  count={pageCount}
                  color="primary"
                  variant="soft"
                  onChange={(_event, value) => setPage(value)}
                />
              </Box>
            )}
          </>
        ) : (
          <SearchNotFound query={query} sx={{ py: 8 }} />
        )}
      </Container>
    </Box>
  );
}
