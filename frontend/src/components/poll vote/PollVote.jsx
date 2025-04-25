import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Card,
  CardContent,
  CardMedia,
  Rating,
  Container,
  Avatar
} from '@mui/material';
import ParallaxTilt from 'react-parallax-tilt';
import NavigationBar from '../navbar/NavigationBar';

const technologies = [
  {
    name: 'React',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png',
    color: '#61DAFB'
  },
  {
    name: 'Angular',
    logo: 'https://angular.io/assets/images/logos/angular/angular.svg',
    color: '#DD0031'
  },
  {
    name: 'Vue',
    logo: 'https://vuejs.org/images/logo.png',
    color: '#42B883'
  },
  {
    name: 'NodeJS',
    logo: 'https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg',
    color: '#339933'
  },
  {
    name: 'Python',
    logo: 'https://www.python.org/static/community_logos/python-logo-generic.svg',
    color: '#3776AB'
  }
];

const PollVote = () => {
  const [formData, setFormData] = useState({
    email: '',
    votes: {
      React: '',
      Angular: '',
      Vue: '',
      NodeJS: '',
      Python: '',
    },
  });

  const [currentTech, setCurrentTech] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleRatingChange = (tech, value) => {
    setFormData(prev => ({
      ...prev,
      votes: {
        ...prev.votes,
        [tech]: value.toString()
      }
    }));

    if (currentTech < technologies.length - 1) {
      setTimeout(() => setCurrentTech(prev => prev + 1), 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    setHasVoted(true);
    // Add your API call here
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', py: 4 }}>
      <NavigationBar />
      <Container maxWidth="md">
        <Typography
          variant="h3"
          textAlign="center"
          mb={6}
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(45deg, #ff99cc 30%, #66ccff 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Rate Your Tech Stack
        </Typography>

        {!hasVoted ? (
          <>
            <TextField
              fullWidth
              label="Your Email"
              variant="outlined"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <ParallaxTilt
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              perspective={1200}
              transitionSpeed={1500}
              glareEnable={true}
              glareMaxOpacity={0.3}
              glareColor="#ffffff"
              glareBorderRadius="24px"
              glarePosition="all"
              scale={1.03}
              style={{
                width: '100%',
                maxWidth: '600px',
                height: '540px',
                margin: '0 auto',
                borderRadius: '24px',
                background: 'linear-gradient(145deg, #ff99cc, #66ccff, #99c2ff)',
                boxShadow: '0 20px 40px -10px rgba(0, 100, 255, 0.3)',
              }}
            >
              <Card
                elevation={0}
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
                  },
                  background: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={technologies[currentTech].logo}
                  alt={technologies[currentTech].name}
                  sx={{
                    objectFit: 'contain',
                    p: 4,
                    background: `linear-gradient(145deg, ${technologies[currentTech].color}22, ${technologies[currentTech].color}11)`
                  }}
                />
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: technologies[currentTech].color }}>
                    {technologies[currentTech].name}
                  </Typography>
                  <Rating
                    name={technologies[currentTech].name}
                    value={Number(formData.votes[technologies[currentTech].name]) || 0}
                    onChange={(_, value) => handleRatingChange(technologies[currentTech].name, value)}
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: technologies[currentTech].color
                      },
                      transform: 'scale(1.5)',
                      my: 4
                    }}
                  />
                </CardContent>
              </Card>
            </ParallaxTilt>

            {currentTech === technologies.length - 1 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!formData.email || Object.values(formData.votes).some(v => !v)}
                  sx={{
                    py: 2,
                    px: 6,
                    borderRadius: '24px',
                    background: 'linear-gradient(145deg, #ff99cc, #66ccff)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: '0 8px 16px rgba(0, 100, 255, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 20px rgba(0, 100, 255, 0.4)',
                    }
                  }}
                >
                  Submit Ratings
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Card
            sx={{
              maxWidth: 600,
              margin: '0 auto',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.95)',
              p: 4,
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" gutterBottom color="primary">
              Thanks for rating!
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 3 }}>
              {technologies.map((tech) => (
                <Box
                  key={tech.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: `${tech.color}11`
                  }}
                >
                  <Avatar src={tech.logo} sx={{ width: 30, height: 30 }} />
                  <Typography>
                    {tech.name}: {formData.votes[tech.name]} ★
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default PollVote;