"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function Animations() {
  return (
    <Box sx={{ width: 1000 }}>
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="pulse" />
      <Skeleton animation="pulse" />
      <Skeleton animation="pulse" />
      <Skeleton animation="pulse" />
      <Skeleton animation="pulse" />
      <Skeleton animation="pulse" />
      <Skeleton animation="pulse" />
      <Skeleton animation="pulse" />
    
    </Box>
  );
}
