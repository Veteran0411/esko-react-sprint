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
import { Assignment, Star, Person, DragIndicator } from '@mui/icons-material';

// Add this helper function at the top of the file
const findBestMatch = (project, members) => {
  // Filter members with required skills and rating
  const eligibleMembers = members.filter(member => {
    const memberSkills = member.skills.split(',').map(s => s.trim());
    const hasRequiredSkills = project.techStack.some(tech => 
      memberSkills.includes(tech)
    );
    return member.rating >= project.rating && hasRequiredSkills;
  });

  // Sort by rating match (closest to project rating)
  return eligibleMembers.sort((a, b) => {
    const aDiff = Math.abs(a.rating - project.rating);
    const bDiff = Math.abs(b.rating - project.rating);
    return aDiff - bDiff;
  })[0];
};

const ProjectsDragAssign = () => {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, membersResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/projects/getProjects`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getDetails`)
        ]);

        // Filter out completed and already assigned projects
        const availableProjects = projectsResponse.data.filter(p => 
          !p.isAssigned && p.status !== 'completed'
        );
        
        setProjects(availableProjects);
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
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
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
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleAssign = async () => {
    try {
      if (assignments.length === 0) {
        // Auto-assign logic remains the same
        const autoAssignments = [];
        const assignedMembers = new Set();

        projects.forEach(project => {
          const bestMatch = findBestMatch(
            project, 
            teamMembers.filter(m => !assignedMembers.has(m.email))
          );

          if (bestMatch) {
            autoAssignments.push({
              ...project,
              type: 'project',
              assignedTo: bestMatch.email
            });
            autoAssignments.push({
              ...bestMatch,
              type: 'member'
            });
            assignedMembers.add(bestMatch.email);
          }
        });

        setAssignments(autoAssignments);
      } else {
        // Format assignments to match ProjectsAssignment.jsx
        const projectAssignments = assignments
          .filter(item => item.type === 'project')
          .map(project => ({
            projectName: project.projectName,
            assignedEmails: assignments
              .filter(item => item.type === 'member')
              .map(member => member.email)
          }));

        // Make the API call
        for (const assignment of projectAssignments) {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/projects/updateAssignments`, {
            projectName: assignment.projectName,
            assignedEmails: assignment.assignedEmails
          });
        }

        // Clear assignments and refresh projects list
        setAssignments([]);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/projects/getProjects`);
        const updatedProjects = response.data.filter(p => 
          !p.isAssigned && p.status !== 'completed'
        );
        setProjects(updatedProjects);
      }
    } catch (error) {
      console.error('Error making assignments:', error);
      // Add error UI feedback here if needed
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={80} thickness={4} sx={{ color: '#3f51b5' }} />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error" sx={{ borderRadius: 2, boxShadow: 3 }}>{error}</Alert>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        minHeight: '100vh',
        p: 4,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <NavigationBar />
      <Typography
        variant="h2"
        sx={{
          textAlign: 'center',
          mb: 6,
          fontWeight: 800,
          background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px',
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            width: '100px',
            height: '4px',
            background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
            margin: '16px auto 0',
            borderRadius: '2px'
          }
        }}
      >
        Project Assignment
      </Typography>

      <Grid container spacing={4} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Team Members Section */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <motion.div style={{ height: '100%' }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              mb: 3,
              p: 1,
              background: 'linear-gradient(90deg, rgba(63,81,181,0.1) 0%, rgba(33,150,243,0.05) 100%)',
              borderRadius: '8px'
            }}>
              <Person sx={{ 
                fontSize: 32,
                color: '#3f51b5',
                mr: 2,
                p: 0.5,
                bgcolor: 'rgba(63,81,181,0.1)',
                borderRadius: '50%'
              }} />
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                color: '#3f51b5'
              }}>
                Team Members
              </Typography>
            </Box>
            <Box sx={{ 
              height: 'calc(100% - 60px)', // Adjust for header
              minHeight: '600px',
              background: 'white',
              borderRadius: '16px',
              p: 2,
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-track': { background: 'rgba(63,81,181,0.05)' },
              '&::-webkit-scrollbar-thumb': { 
                background: 'rgba(63,81,181,0.2)', 
                borderRadius: '4px' 
              }
            }}>
              {teamMembers.map((member) => (
                <motion.div
                  key={member.email}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Card
                    draggable
                    onDragStart={(e) => handleDragStart(e, member, 'member')}
                    onDragEnd={handleDragEnd}
                    sx={{ 
                      mb: 2,
                      cursor: 'grab',
                      background: 'white',
                      borderRadius: '12px',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      boxShadow: '0 2px 8px rgba(63,81,181,0.08)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(63,81,181,0.15)',
                      },
                      '&:active': {
                        cursor: 'grabbing',
                      }
                    }}
                  >
                    <CardContent sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 2,
                      p: 2
                    }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(63,81,181,0.1) 0%, rgba(33,150,243,0.1) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Person sx={{ color: '#3f51b5' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{member.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Star sx={{ 
                            color: '#ffc107',
                            fontSize: '1rem' 
                          }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Rating: {member.rating}
                          </Typography>
                        </Box>
                      </Box>
                      <DragIndicator sx={{ 
                        color: 'rgba(63,81,181,0.5)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          color: '#3f51b5'
                        }
                      }} />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Grid>

        {/* Projects Section */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <motion.div style={{ height: '100%' }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              mb: 3,
              p: 1,
              background: 'linear-gradient(90deg, rgba(63,81,181,0.1) 0%, rgba(33,150,243,0.05) 100%)',
              borderRadius: '8px'
            }}>
              <Assignment sx={{ 
                fontSize: 32,
                color: '#3f51b5',
                mr: 2,
                p: 0.5,
                bgcolor: 'rgba(63,81,181,0.1)',
                borderRadius: '50%'
              }} />
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                color: '#3f51b5'
              }}>
                Available Projects
              </Typography>
            </Box>
            <Box sx={{ 
              height: 'calc(100% - 60px)', // Adjust for header
              minHeight: '600px',
              background: 'white',
              borderRadius: '16px',
              p: 2,
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              {projects.map((project) => (
                <motion.div
                  key={project.projectName}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Card
                    draggable
                    onDragStart={(e) => handleDragStart(e, project, 'project')}
                    onDragEnd={handleDragEnd}
                    sx={{ 
                      mb: 2,
                      cursor: 'grab',
                      background: 'white',
                      borderRadius: '12px',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      boxShadow: '0 2px 8px rgba(63,81,181,0.08)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(63,81,181,0.15)',
                      },
                      '&:active': {
                        cursor: 'grabbing',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, rgba(63,81,181,0.1) 0%, rgba(33,150,243,0.1) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}>
                          <Assignment sx={{ color: '#3f51b5' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>{project.projectName}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Star sx={{ 
                              color: '#ffc107',
                              fontSize: '1rem' 
                            }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Rating: {project.rating}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                            {project.techStack.map((skill, idx) => (
                              <Chip
                                key={idx}
                                label={skill}
                                size="small"
                                sx={{
                                  background: 'rgba(63,81,181,0.08)',
                                  color: '#3f51b5',
                                  fontWeight: 500,
                                  '&:hover': {
                                    background: 'rgba(63,81,181,0.15)',
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                        <DragIndicator sx={{ 
                          color: 'rgba(63,81,181,0.5)',
                          transition: 'all 0.3s',
                          '&:hover': {
                            color: '#3f51b5'
                          }
                        }} />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Grid>

        {/* Assignments Section */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <motion.div style={{ height: '100%' }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              mb: 3,
              p: 1,
              background: 'linear-gradient(90deg, rgba(63,81,181,0.1) 0%, rgba(33,150,243,0.05) 100%)',
              borderRadius: '8px'
            }}>
              <Assignment sx={{ 
                fontSize: 32,
                color: '#3f51b5',
                mr: 2,
                p: 0.5,
                bgcolor: 'rgba(63,81,181,0.1)',
                borderRadius: '50%'
              }} />
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                color: '#3f51b5'
              }}>
                Assignments
              </Typography>
            </Box>

            {/* Buttons at top */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleAssign()}
                sx={{
                  py: 1.5,
                  borderColor: '#3f51b5',
                  color: '#3f51b5',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#2196f3',
                    backgroundColor: 'rgba(63,81,181,0.04)',
                  }
                }}
              >
                Auto Assign
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAssign}
                disabled={assignments.length === 0}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(63,81,181,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 20px rgba(63,81,181,0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(0,0,0,0.1)',
                    color: 'rgba(0,0,0,0.26)',
                    boxShadow: 'none'
                  }
                }}
              >
                Confirm
              </Button>
            </Box>

            {/* Assignments drop area */}
            <Box
              sx={{ 
                height: 'calc(100% - 140px)', // Adjusted height to account for buttons
                minHeight: '500px',
                background: isDraggingOver 
                  ? 'linear-gradient(135deg, rgba(63,81,181,0.05) 0%, rgba(33,150,243,0.05) 100%)' 
                  : 'white',
                borderRadius: '16px',
                p: 2,
                overflowY: 'auto',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
                border: isDraggingOver 
                  ? '2px dashed #3f51b5' 
                  : '1px solid rgba(63,81,181,0.1)',
                transition: 'all 0.3s ease',
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {assignments.length === 0 ? (
                <Box sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: 4,
                  color: 'text.secondary'
                }}>
                  <DragIndicator sx={{ 
                    fontSize: 64,
                    color: 'rgba(63,81,181,0.2)',
                    mb: 2
                  }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Drop Projects & Members Here
                  </Typography>
                  <Typography variant="body2">
                    Drag and drop items from the left panels to create assignments
                  </Typography>
                </Box>
              ) : (
                assignments.map((item) => (
                  <motion.div
                    key={item.email || item.projectName}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    layout
                  >
                    <Card sx={{ 
                      mb: 2,
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(63,81,181,0.08)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(63,81,181,0.15)',
                      }
                    }}>
                      <CardContent sx={{ 
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: item.type === 'member' 
                            ? 'linear-gradient(135deg, rgba(63,81,181,0.1) 0%, rgba(33,150,243,0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(233,30,99,0.1) 0%, rgba(156,39,176,0.1) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {item.type === 'member' ? (
                            <Person sx={{ 
                              color: '#3f51b5' 
                            }} />
                          ) : (
                            <Assignment sx={{ 
                              color: '#e91e63' 
                            }} />
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {item.name || item.projectName}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}>
                            <Star sx={{ 
                              color: '#ffc107',
                              fontSize: '1rem' 
                            }} />
                            {item.rating}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectsDragAssign;