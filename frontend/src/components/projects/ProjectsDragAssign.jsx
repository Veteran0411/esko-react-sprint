import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import NavigationBar from '../navbar/NavigationBar';
import { Assignment, Star, Person } from '@mui/icons-material';

const ProjectsDragAssign = () => {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, membersResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/getProjects'),
          axios.get('http://localhost:5000/api/getDetails')
        ]);

        setProjects(projectsResponse.data.filter(p => !p.isAssigned));
        setTeamMembers(membersResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDragStart = (e, item, type) => {
    e.dataTransfer.setData('text', JSON.stringify({ ...item, type }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text'));
    const exists = assignments.some(item => 
      (data.type === 'project' && item.projectName === data.projectName) ||
      (data.type === 'member' && item.email === data.email)
    );

    if (!exists) {
      setAssignments(prev => [...prev, data]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAssign = () => {
    const projectAssignments = assignments.filter(item => item.type === 'project');
    const memberAssignments = assignments.filter(item => item.type === 'member');

    console.log('Projects to assign:', projectAssignments.map(p => p.projectName));
    console.log('Members to assign:', memberAssignments.map(m => m.email));
    
    setAssignments([]); // Clear assignments after logging
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  return (
    <>
      <NavigationBar />
      <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #f6f9fc 0%, #e9ecef 100%)' }}>
        <Grid container spacing={3}>
          {/* Team Members Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Team Members</Typography>
            <Box sx={{ 
              minHeight: '400px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              p: 2,
              overflowY: 'auto'
            }}>
              {teamMembers.map((member) => (
                <Card
                  key={member.email}
                  draggable
                  onDragStart={(e) => handleDragStart(e, member, 'member')}
                  sx={{ 
                    mb: 2,
                    cursor: 'move',
                    '&:hover': { transform: 'scale(1.02)' },
                    transition: 'transform 0.2s'
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1">{member.name}</Typography>
                    <Typography variant="body2">Rating: {member.rating}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* Projects Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Available Projects</Typography>
            <Box sx={{ 
              minHeight: '400px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              p: 2,
              overflowY: 'auto'
            }}>
              {projects.map((project) => (
                <Card
                  key={project.projectName}
                  draggable
                  onDragStart={(e) => handleDragStart(e, project, 'project')}
                  sx={{ 
                    mb: 2,
                    cursor: 'move',
                    '&:hover': { transform: 'scale(1.02)' },
                    transition: 'transform 0.2s'
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1">{project.projectName}</Typography>
                    <Typography variant="body2">Rating: {project.rating}</Typography>
                    <Box sx={{ mt: 1 }}>
                      {project.techStack.map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* Assignments Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Assignments</Typography>
            <Box
              sx={{ 
                minHeight: '400px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                p: 2,
                overflowY: 'auto'
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {assignments.map((item) => (
                <Card 
                  key={item.email || item.projectName}
                  sx={{ mb: 2 }}
                >
                  <CardContent>
                    <Typography>
                      {item.name || item.projectName}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleAssign}
              disabled={assignments.length === 0}
              sx={{
                mt: 2,
                background: 'linear-gradient(45deg, #2196f3 30%, #3f51b5 90%)',
                borderRadius: '8px'
              }}
            >
              Confirm Assignments
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProjectsDragAssign;