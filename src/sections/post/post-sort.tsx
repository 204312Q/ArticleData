'use client';

import type { PostSortValue } from 'src/lib/post';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type PostSortProps = {
  sort: PostSortValue;
  sortOptions: ReadonlyArray<{ value: PostSortValue; label: string }>;
  onSort: (value: PostSortValue) => void;
};

export function PostSort({ sort, sortOptions, onSort }: PostSortProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
        Sort by
      </Typography>

      <Select
        size="small"
        value={sort}
        onChange={(event) => onSort(event.target.value as PostSortValue)}
        sx={{ minWidth: 150, borderRadius: 2 }}
      >
        {sortOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
