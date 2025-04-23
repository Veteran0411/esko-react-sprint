import React, { useState } from 'react';
import { TextField, Button, Stack, Typography, FormControl, Box, MenuItem } from '@mui/material';
import NavigationBar from '../navbar/NavigationBar';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setFormData((prevData) => ({
        ...prevData,
        email: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        votes: {
          ...prevData.votes,
          [name]: value,
        },
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    alert('Your votes have been submitted!');
    setFormData({
      email: '',
      votes: {
        React: '',
        Angular: '',
        Vue: '',
        NodeJS: '',
        Python: '',
      },
    });
  };

  // Get all currently selected ratings except the one for the current technology
  const getAvailableRatings = (currentTech) => {
    const selectedRatings = Object.entries(formData.votes)
      .filter(([tech, rating]) => tech !== currentTech && rating !== '')
      .map(([_, rating]) => rating);
    
    return [1, 2, 3, 4, 5].filter(
      (rating) => !selectedRatings.includes(rating.toString())
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(245,249,255,0.95) 0%, rgba(255,255,255,0.95) 100%)',
        padding: 2,
      }}
    >
      <NavigationBar />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 500,
          padding: 4,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 30px rgba(0, 60, 135, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          sx={{
            background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            animation: 'gradientAnimation 5s ease infinite',
          }}
        >
          Rank Your Favorite Technologies
        </Typography>

        <Stack spacing={3}>
          <FormControl fullWidth>
            <TextField
              label="Enter your email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3498db',
                  },
                },
              }}
            />
          </FormControl>

          {Object.keys(formData.votes).map((tech) => (
            <FormControl key={tech} fullWidth>
              <TextField
                select
                label={`Rank for ${tech} (1 = highest)`}
                name={tech}
                value={formData.votes[tech]}
                onChange={handleChange}
                variant="outlined"
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#3498db',
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select a rank</em>
                </MenuItem>
                {getAvailableRatings(tech).concat(formData.votes[tech] ? [formData.votes[tech]] : [])
                  .sort((a, b) => a - b)
                  .map((rating) => (
                    <MenuItem key={rating} value={rating.toString()}>
                      {rating}
                    </MenuItem>
                  ))}
              </TextField>
            </FormControl>
          ))}

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              borderRadius: '24px',
              padding: '12px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              boxShadow: '0 6px 16px rgba(52, 152, 219, 0.4)',
              background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientAnimation 5s ease infinite',
              '&:hover': {
                boxShadow: '0 8px 20px rgba(52, 152, 219, 0.5)',
                transform: 'translateY(-3px)',
              },
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            }}
          >
            Submit Rankings
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PollVote;