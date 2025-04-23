// ProfileImage.jsx - Enhanced with more professional styling
import React from 'react';
import { Box, Avatar } from '@mui/material';

const ProfileImage = ({ profile }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(52, 152, 219, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)',
        border: '4px solid rgba(255, 255, 255, 0.8)',
        margin: '8px 0',
        transition: 'all 0.4s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
        }
      }}
    >
      <Avatar
        src={profile.pic}
        alt={profile.name}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.5s ease',
        }}
      />
    </Box>
  );
};

export default ProfileImage;