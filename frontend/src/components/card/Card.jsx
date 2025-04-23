import React, { useState } from 'react';
import { Card as MuiCard, Box } from '@mui/material';
import ParallaxTilt from 'react-parallax-tilt';
import BackFace from './BackFace';
import FrontFace from './FrontFace';

const Card = ({ children, info, backName}) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <ParallaxTilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      perspective={1200}
      transitionSpeed={1500}
      glareEnable={true}
      glareMaxOpacity={0.3}
      glareColor="#ffffff"
      glareBorderRadius="24px"
      glarePosition="all"
      scale={1.03}
      style={{
        width:'18.5rem',
        height:'540px',
        margin: '0',
        borderRadius: '24px',
        background: 'linear-gradient(145deg, #ff99cc, #66ccff, #99c2ff)',
        boxShadow: '0 20px 40px -10px rgba(0, 100, 255, 0.3)',
      }}
    >
      <MuiCard
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.3)',
          transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.4)',
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
            zIndex: 1,
            pointerEvents: 'none',
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
          }}
        >
          <FrontFace handleFlip={handleFlip} >
            {children}
          </FrontFace>
          <BackFace info={info} backName={backName} handleFlip={handleFlip}/>
        </Box>
      </MuiCard>
    </ParallaxTilt>
  );
};

export default Card;