'use client';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type PostSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PostSearch({ value, onChange }: PostSearchProps) {
  return (
    <TextField
      fullWidth
      value={value}
      placeholder="Search articles..."
      onChange={(event) => onChange(event.target.value)}
      sx={{ width: { xs: 1, sm: 300 } }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
