import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, FormControl, Alert, Switch, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isAdmin ? '/api/admin/login' : '/api/auth/login';
      const payload = isAdmin 
        ? { username: formData.username, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, payload);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.admin || response.data.profile));
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(245,249,255,0.95) 0%, rgba(255,255,255,0.95) 100%)',
        padding: 2
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 4,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 30px rgba(0, 60, 135, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          position: 'relative',
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
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          sx={{
            background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%'
          }}
        >
          {isAdmin ? 'Admin Login' : 'User Login'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <FormControlLabel
          control={
            <Switch
              checked={isAdmin}
              onChange={(e) => {
                setIsAdmin(e.target.checked);
                setError('');
                setFormData({ username: '', email: '', password: '' });
              }}
              color="primary"
            />
          }
          label="Admin Login"
          sx={{ mb: 2 }}
        />

        <Stack spacing={3}>
          {isAdmin ? (
            <FormControl fullWidth>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover fieldset': {
                      borderColor: '#3498db'
                    }
                  }
                }}
              />
            </FormControl>
          ) : (
            <FormControl fullWidth>
              <TextField
                label="Email Address"
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
                      borderColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover fieldset': {
                      borderColor: '#3498db'
                    }
                  }
                }}
              />
            </FormControl>
          )}

          <FormControl fullWidth>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.1)'
                  },
                  '&:hover fieldset': {
                    borderColor: '#3498db'
                  }
                }
              }}
            />
          </FormControl>

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
              background: isAdmin
                ? 'linear-gradient(45deg, #2196f3 0%, #3f51b5 100%)'
                : 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
              backgroundSize: '200% 200%',
              '&:hover': {
                boxShadow: '0 8px 20px rgba(52, 152, 219, 0.5)',
                transform: 'translateY(-3px)',
              },
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }}
          >
            {isAdmin ? 'Admin Login' : 'Login'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;