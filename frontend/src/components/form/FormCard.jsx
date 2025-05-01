import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Stack, Typography, FormControl, Box, keyframes, Select, MenuItem, InputLabel } from '@mui/material';
import NavigationBar from '../navbar/NavigationBar';
import { toast } from 'react-toastify';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shimmerAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const FormCard = () => {
  const navigate = useNavigate();
  const skillsOptions = [
    "React",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "DevOps",
    "AWS",
    "MongoDB"
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phoneNo: '',
    funFact: '',
    joiningDate: '',
    pic: null,
    skills: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      pic: e.target.files[0]
    });
  };

  const handleSkillsChange = (event) => {
    setFormData({
      ...formData,
      skills: event.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Form validation
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const phonePattern = /^[0-9]{10}$/;
      const namePattern = /^[a-zA-Z ]+$/;

      if (!namePattern.test(formData.name)) {
        alert('Please enter a valid name (letters and spaces only)');
        return;
      }

      if (!emailPattern.test(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }

      if (!phonePattern.test(formData.phoneNo)) {
        alert('Please enter a valid 10-digit phone number');
        return;
      }

      if (formData.address.length < 5 || formData.address.length > 100) {
        alert('Address should be between 5 and 100 characters');
        return;
      }

      if (formData.funFact.length > 200) {
        alert('Fun fact should not exceed 200 characters');
        return;
      }

      if (new Date(formData.joiningDate) > new Date()) {
        alert('Joining date cannot be in the future');
        return;
      }

      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('address', formData.address);
      data.append('phoneNo', formData.phoneNo);
      data.append('funFact', formData.funFact);
      data.append('joiningDate', formData.joiningDate);
      data.append('pic', formData.pic);
      data.append('skills', formData.skills.join(', '));

      const response = await axios.post('http://localhost:5000/api/postDetails', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Form submitted successfully!');
        setFormData({
          name: '',
          email: '',
          address: '',
          phoneNo: '',
          funFact: '',
          joiningDate: '',
          pic: null,
          skills: []
        });

        navigate('/dashboard');
      } else {
        throw new Error(response.data.message);
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.warn(`Failed to submit form: ${error.response?.data?.message || error.message}`);
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
        padding: 0
      }}
    >
      <NavigationBar/>
      <Box
        component="form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        sx={{
          width: '100%',
          maxWidth: 500,
          scale: 0.9,
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
            backgroundSize: '200% 200%',
            animation: `${gradientAnimation} 5s ease infinite`
          }}
        >
          Fill Your Details
        </Typography>

        <Stack spacing={3}>
          {[
            { 
              label: "Enter your name", 
              name: "name", 
              type: "text",
              inputProps: { 
                minLength: 2,
                maxLength: 50,
                pattern: "^[a-zA-Z ]+$"
              },
              helperText: "Name should only contain letters and spaces"
            },
            {
              label: "Enter your email",
              name: "email",
              type: "email",
              inputProps: {
                pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
              },
              helperText: "Enter a valid email address"
            },
            { 
              label: "Enter your phone number", 
              name: "phoneNo", 
              type: "tel", 
              inputProps: { 
                pattern: "[0-9]{10}",
                maxLength: 10 
              },
              helperText: "Enter 10 digit phone number"
            },
            { 
              label: "Enter your Address", 
              name: "address", 
              type: "text",
              inputProps: { 
                minLength: 5,
                maxLength: 100
              },
              helperText: "Address should be between 5 and 100 characters"
            },
            { 
              label: "Enter your Fun Fact", 
              name: "funFact", 
              type: "text",
              inputProps: { 
                maxLength: 200
              },
              helperText: "Maximum 200 characters"
            },
            { 
              label: "Select Skills",
              name: "skills",
              type: "select",
              component: (
                <FormControl fullWidth key="skills">
                  <InputLabel id="skills-label">Select Skills</InputLabel>
                  <Select
                    labelId="skills-label"
                    id="skills"
                    multiple
                    value={formData.skills}
                    onChange={handleSkillsChange}
                    required
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 224,
                          width: 250
                        }
                      }
                    }}
                    sx={{
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.1)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3498db'
                      },
                      '& .MuiSelect-select': {
                        padding: '14px'
                      }
                    }}
                  >
                    {skillsOptions.map((skill) => (
                      <MenuItem 
                        key={skill} 
                        value={skill}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: 'rgba(52, 152, 219, 0.2)',
                          }
                        }}
                      >
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            },
            { 
              label: "Enter Joining Date", 
              name: "joiningDate", 
              type: "date", 
              InputLabelProps: { 
                shrink: true 
              },
              inputProps: {
                max: new Date().toISOString().split('T')[0]
              },
              helperText: "Date cannot be in the future"
            }
          ].map((field) => 
            field.type === 'select' ? (
              field.component
            ) : (
              <FormControl key={field.name} fullWidth>
                <TextField
                  {...field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  error={formData[field.name] !== '' && field.inputProps?.pattern ? 
                    !new RegExp(field.inputProps.pattern).test(formData[field.name]) : 
                    false}
                  helperText={field.helperText}
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
            )
          )}

          <FormControl fullWidth>
            <Button
              component="label"
              variant="outlined"
              sx={{
                padding: '12px',
                borderRadius: '12px',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: '#3498db'
                }
              }}
            >
              Upload Profile Picture
              <input
                accept="image/*"
                type="file"
                name="pic"
                onChange={handleFileChange}
                hidden
                required
              />
            </Button>
            {formData.pic && (
              <Typography variant="caption" color="text.secondary" mt={1}>
                Selected: {formData.pic.name}
              </Typography>
            )}
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
            Submit Details
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default FormCard;