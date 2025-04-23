// FrontFace.jsx - Enhanced with more professional styling
import React from 'react';
import { Box, Button, keyframes } from '@mui/material';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shimmerAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const FrontFace = ({ children, handleFlip }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        display: 'flex',
        padding: "16px",
        boxSizing: "border-box",
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,249,255,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 10px 30px rgba(0, 60, 135, 0.12)',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #3498db, #9b59b6)',
          boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box
        sx={{
          flex: 1,
          gap: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Box>

      <Box
        sx={{
          marginTop: '4px',
          display: 'flex',
          justifyContent: 'center',
          pt: 1
        }}
      >
        <Button
          onClick={handleFlip}
          variant="contained"
          color="primary"
          size="small"
          sx={{
            borderRadius: '24px',
            padding: '8px 28px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            boxShadow: '0 6px 16px rgba(52, 152, 219, 0.4)',
            background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
            backgroundSize: '200% 200%',
            animation: `${gradientAnimation} 5s ease infinite`,
            '&:hover': {
              boxShadow: '0 8px 20px rgba(52, 152, 219, 0.5)',
              transform: 'translateY(-3px)',
            },
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            position: 'relative',
            overflow: 'hidden',
            textTransform: 'none',
            fontSize: '0.85rem',
            '&:after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '200%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: `${shimmerAnimation} 2s infinite`,
              pointerEvents: 'none'
            }
          }}
        >
          Discover More
        </Button>
      </Box>
    </Box>
  );
};

export default FrontFace;