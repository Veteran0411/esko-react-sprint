import React, { useState } from 'react';
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
  OutlinedInput
} from '@mui/material';
import NavigationBar from '../navbar/NavigationBar';

const ProjectForm = () => {
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
      // Add your API call here to save the project
      console.log('Form Data:', {
        ...formData,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <NavigationBar />
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
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 600,
            padding: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 60, 135, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.6)'
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
            />

            <TextField
              label="Rating"
              name="rating"
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "5" }}
              value={formData.rating}
              onChange={handleChange}
              required
              fullWidth
            />

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
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Project Manager"
              name="projectManager"
              value={formData.projectManager}
              onChange={handleChange}
              required
              fullWidth
            />

            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Add Team Member"
                  value={newTeamMember}
                  onChange={(e) => setNewTeamMember(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={handleAddTeamMember}>Add</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.team.map((member, index) => (
                  <Chip
                    key={index}
                    label={member}
                    onDelete={() => handleRemoveTeamMember(member)}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Add Technology"
                  value={newTechStack}
                  onChange={(e) => setNewTechStack(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={handleAddTechStack}>Add</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.techStack.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    onDelete={() => handleRemoveTechStack(tech)}
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
                borderRadius: '24px',
                padding: '12px',
                background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(52, 152, 219, 0.5)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Create Project
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default ProjectForm;