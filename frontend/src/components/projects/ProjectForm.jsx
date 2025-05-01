import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  Stack,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Alert,
  Snackbar,
  Rating,
  IconButton,
  Autocomplete
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import NavigationBar from '../navbar/NavigationBar';
import axios from 'axios';

const ProjectForm = () => {
  const navigate = useNavigate(); // Add this line near other hooks
  const [formData, setFormData] = useState({
    projectName: '',
    rating: '',
    deadline: '',
    description: '',
    team: [],
    status: 'ongoing',
    techStack: [],
    projectManager: '',
    isAssigned: false,
    assignedTo: []
  });

  const [newTeamMember, setNewTeamMember] = useState('');
  const [newTechStack, setNewTechStack] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Predefined tech stack options
  const techStackOptions = [
    'React', 'Node.js', 'MongoDB', 'Express',
    'Java', 'Python', 'Angular', 'Vue.js',
    'AWS', 'Firebase', 'Docker', 'Kubernetes',
    'TypeScript', 'GraphQL', 'Redux', 'MySQL'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTeamMember = () => {
    if (newTeamMember.trim()) {
      setFormData(prev => ({
        ...prev,
        team: [...prev.team, newTeamMember.trim()]
      }));
      setNewTeamMember('');
    }
  };

  const handleAddTechStack = () => {
    if (newTechStack.trim()) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTechStack.trim()]
      }));
      setNewTechStack('');
    }
  };

  const handleRemoveTeamMember = (member) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(m => m !== member)
    }));
  };

  const handleRemoveTechStack = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/projects/postProjects`, {
        ...formData,
        createdAt: new Date().toISOString()
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Project created successfully!',
          severity: 'success'
        });
        
        // Reset form
        setFormData({
          projectName: '',
          rating: '',
          deadline: '',
          description: '',
          team: [],
          status: 'ongoing',
          techStack: [],
          projectManager: '',
          isAssigned: false,
          assignedTo: []
        });
        
        // Reset other states
        setNewTeamMember('');
        setNewTechStack('');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500); // 1.5 second delay to show success message
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error creating project',
        severity: 'error'
      });
    }
  };

  // Replace the existing return statement with this enhanced UI
  return (
    <>
      <NavigationBar />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          padding: { xs: 2, md: 4 }
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 800,
            margin: '0 auto',
            padding: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.8)'
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight={700} 
            textAlign="center" 
            mb={4}
            sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Create New Project
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Project Name"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />

            <Box>
              <Typography component="legend" mb={1}>Project Rating</Typography>
              <Rating
                name="rating"
                value={Number(formData.rating) || 0}
                precision={0.5}
                onChange={(_, value) => {
                  handleChange({
                    target: { name: 'rating', value: value?.toString() || '' }
                  });
                }}
              />
            </Box>

            <TextField
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
              helperText="Provide a detailed description of the project"
            />

            <FormControl fullWidth>
              <InputLabel>Project Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="ongoing">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2196f3' }} />
                    Ongoing
                  </Box>
                </MenuItem>
                <MenuItem value="completed">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
                    Completed
                  </Box>
                </MenuItem>
                <MenuItem value="pending">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff9800' }} />
                    Pending
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              options={techStackOptions}
              value={formData.techStack}
              onChange={(_, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  techStack: newValue
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tech Stack"
                  placeholder="Select technologies"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    sx={{
                      background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
                      color: 'white'
                    }}
                  />
                ))
              }
            />

            <TextField
              label="Project Manager"
              name="projectManager"
              value={formData.projectManager}
              onChange={handleChange}
              required
              fullWidth
            />

            <Box>
              <Typography variant="subtitle1" mb={1}>Team Members</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Add Team Member"
                  value={newTeamMember}
                  onChange={(e) => setNewTeamMember(e.target.value)}
                  fullWidth
                  size="small"
                />
                <IconButton 
                  onClick={handleAddTeamMember}
                  sx={{ 
                    bgcolor: '#2196f3',
                    color: 'white',
                    '&:hover': { bgcolor: '#1976d2' }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.team.map((member, index) => (
                  <Chip
                    key={index}
                    label={member}
                    onDelete={() => handleRemoveTeamMember(member)}
                    sx={{
                      background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
                      color: 'white'
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Create Project
            </Button>
          </Stack>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProjectForm;