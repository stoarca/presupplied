import React from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Typography variant="h6" component="div" sx={{
      position: 'absolute',
      bottom: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center'
    }}>
      <Link to="/" style={{ display: 'inline-block' }}>
        <img src="/static/images/logodark.svg" style={{ height: '30px', cursor: 'pointer' }} />
      </Link>
    </Typography>
  );
};