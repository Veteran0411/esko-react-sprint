import { Box, Typography, Button, keyframes } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(155, 89, 182, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(155, 89, 182, 0); }
  100% { box-shadow: 0 0 0 0 rgba(155, 89, 182, 0); }
`;

const subtleFloat = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
`;

const BackFace = ({ info, backName, handleFlip }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        transform: 'rotateY(180deg)',
        textAlign: 'center',
        overflow: 'hidden',
        p: 4,
        boxSizing: 'border-box',
        background: '#ffffff',
        backgroundSize: '400% 400%',
        color: '#333333',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderRadius: '16px',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(155, 89, 182, 0.05) 0%, rgba(52, 152, 219, 0.02) 70%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        position: 'relative',
        zIndex: 2
      }}>
        <Typography variant="h5" sx={{ 
          background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          position: 'relative',
          pb: 1,
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '50px',
            height: '3px',
            background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
            borderRadius: '3px'
          }
        }}>
          Fun Fact
        </Typography>

        <Box sx={{
          backgroundColor: 'rgba(52, 152, 219, 0.05)',
          borderRadius: '16px',
          p: 3,
          width: '100%',
          boxShadow: '0 4px 20px -8px rgba(0,0,0,0.1)',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(155, 89, 182, 0.1)',
          animation: `${subtleFloat} 4s ease-in-out infinite`,
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            zIndex: -1,
            borderRadius: '18px',
            opacity: 0.5,
            // filter: 'blur(8px)'
          }
        }}>
          <Typography variant="body1" sx={{ 
            background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}>
            "{info}"
          </Typography>
        </Box>

        <Box sx={{
          borderRadius: '16px',
          p: 3,
          width: '100%',
          border: '1px solid rgba(155, 89, 182, 0.2)',
          boxShadow: '0 4px 20px -8px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'rgba(52, 152, 219, 0.03)',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3498db, #9b59b6)',
          }
        }}>
          <Typography variant="subtitle1" sx={{ 
            color: '#9b59b6',
            fontWeight: 600, 
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.9rem'
          }}>
            Also known as:
          </Typography>
          <Typography variant="h4" sx={{ 
            background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700, 
            fontStyle: 'italic',
            letterSpacing: '0.5px'
          }}>
            "{backName}"
          </Typography>
        </Box>
      </Box>

      <Button
        onClick={handleFlip}
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{
          borderRadius: '24px',
          padding: '10px 24px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          borderWidth: '2px',
          borderColor: 'rgba(155, 89, 182, 0.6)',
          color: '#3498db',
          backgroundColor: 'white',
          marginTop: 3,
          '&:hover': {
            backgroundColor: 'rgba(52, 152, 219, 0.05)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(155, 89, 182, 0.2)',
            borderColor: '#9b59b6',
            animation: `${pulseAnimation} 1.5s infinite`
          },
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 2,
          '&:after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, transparent 50%, rgba(155, 89, 182, 0.1) 100%)',
            pointerEvents: 'none'
          }
        }}
      >
        Back to Profile
      </Button>
    </Box>
  );
};

export default BackFace;