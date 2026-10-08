'use client';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type PostFilterProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export function PostFilter({ value, options, onChange }: PostFilterProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
        Filter by
      </Typography>

      <Select
        size="small"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={{ minWidth: 190, borderRadius: 2 }}
      >
        <MenuItem value="all">All tags</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
