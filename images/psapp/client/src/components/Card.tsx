import React, { CSSProperties } from 'react';
import { Paper, SxProps, Theme } from '@mui/material';

interface CardProps {
  children: React.ReactNode;
  variant?: 'standard' | 'elevated' | 'outlined';
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  hover?: boolean;
  sx?: SxProps<Theme>;
  style?: CSSProperties;
  elevation?: number;
  'data-test'?: string;
}

export const Card = ({
  children,
  variant = 'standard',
  onClick,
  hover = false,
  sx = {},
  style,
  elevation = 3,
  'data-test': dataTest
}: CardProps) => {
  const isClickable = !!onClick;

  const getCardSx = (): SxProps<Theme> => {
    const baseSx: SxProps<Theme> = {
      p: 4,
      position: 'relative',
      borderRadius: 2,
      cursor: isClickable ? 'pointer' : 'default',
      ...sx
    };

    if (hover) {
      return {
        ...baseSx,
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease-in-out',
      };
    }

    return baseSx;
  };

  const cardProps = {
    elevation,
    sx: getCardSx(),
    style,
    onClick,
    ...(dataTest && { 'data-test': dataTest })
  };

  return (
    <Paper {...cardProps}>
      {children}
    </Paper>
  );
};