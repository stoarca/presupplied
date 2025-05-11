import React from 'react';
import { Box, Grid } from '@mui/material';

// Predefined color options
const COLOR_OPTIONS = [
  '#FF6B6B', // Red
  '#FF9E7D', // Coral
  '#FFCE67', // Yellow
  '#88D8B0', // Green
  '#59C9E7', // Blue
  '#7D7AFF', // Purple
  '#D3A4FF', // Lavender
  '#FF7EB4', // Pink
  '#95A5A6', // Gray
];

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  onColorSelect
}) => {
  return (
    <Grid container spacing={1} justifyContent="center">
      {COLOR_OPTIONS.map((color) => (
        <Grid item key={color}>
          <Box
            onClick={() => onColorSelect(color)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: color,
              border: selectedColor === color ? '2px solid #1976d2' : '2px solid transparent',
              boxShadow: selectedColor === color ? '0 0 0 2px rgba(25, 118, 210, 0.5)' : 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              }
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};