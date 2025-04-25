import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Checkbox,
  DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import NavigationBar from '../navbar/NavigationBar';
import { Assignment, Star, Person } from '@mui/icons-material';
import SearchBar from '../search/SearchBar';
import Pagination from '../pagination/Pagination';
import { usePagination } from '../custom hooks/usePagination';

const ProjectsAssignment = () => {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, membersResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/projects/getProjects'),
          axios.get('http://localhost:5000/api/getDetails')
        ]);

        setProjects(projectsResponse.data);
        setTeamMembers(membersResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return projects.filter(project =>
      !project.isAssigned && (
        project.projectName.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search) ||
        project.techStack.some(skill => skill.toLowerCase().includes(search))
      )
    );
  }, [projects, searchTerm]);

  const {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
    itemsPerPage
  } = usePagination(filteredProjects);

  const handleAssignProject = (project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  const handleMemberSelection = (member) => {
    setSelectedMembers(prev => {
      if (prev.find(m => m.email === member.email)) {
        return prev.filter(m => m.email !== member.email);
      }
      return [...prev, member];
    });
  };

  const handleAssignMembers = async () => {
    if (selectedProject && selectedMembers.length > 0) {
      try {
        const assignedEmails = selectedMembers.map(member => member.email);

        const response = await axios.post('http://localhost:5000/api/projects/updateAssignments', {
          projectName: selectedProject.projectName,
          assignedEmails: assignedEmails
        });

        if (response.data.success) {
          setProjects(prevProjects =>
            prevProjects.map(project =>
              project.projectName === selectedProject.projectName
                ? { ...project, isAssigned: true, assignedTo: assignedEmails }
                : project
            )
          );
          console.log('Assignment successful:', response.data.message);
        }

        setSelectedMembers([]);
        setOpenDialog(false);

      } catch (error) {
        console.error('Error assigning members:', error);
        alert(error.response?.data?.message || 'Failed to assign members');
      }
    }
  };

  const hasRequiredSkills = (memberSkills, projectTechStack) => {
    const memberSkillsArray = memberSkills.split(',').map(skill => skill.trim());
    return projectTechStack.some(tech => 
      memberSkillsArray.includes(tech)
    );
  };

  if (loading) return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: 2
    }}>
      <CircularProgress size={70} thickness={4} />
      <Typography variant="h6" color="primary">
        Loading projects...
      </Typography>
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        background: '#ffffff',
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
          mb: 4,
          fontWeight: 800,
          background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            width: '100px',
            height: '4px',
            background: 'linear-gradient(90deg, #2196f3, #64b5f6)',
            margin: '16px auto 0',
            borderRadius: '2px'
          }
        }}
      >
        Project Assignment
      </Typography>

      <Box sx={{
        maxWidth: '600px',
        margin: '0 auto 2rem',
        background: '#ffffff',
        borderRadius: '12px',
        padding: '0.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          sx={{
            '& .MuiInputBase-root': {
              color: '#333333',
            }
          }} 
        />
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '2rem 0'
      }}>
        {currentItems.map((project, index) => (
          <motion.div
            key={project.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: '16px',
                background: '#ffffff',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2
                }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Assignment sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    color: '#1a237e',
                    fontSize: '1.25rem'
                  }}>
                    {project.projectName}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  mb: 2,
                  lineHeight: 1.6
                }}>
                  {project.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {project.techStack.map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        size="small"
                        sx={{
                          background: '#f5f5f5',
                          color: '#2196f3',
                          fontWeight: 500,
                          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.1)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                            background: '#e3f2fd'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}>
                  <Star sx={{ color: '#ffd700' }} />
                  <Typography variant="subtitle2">
                    Required Rating: {project.rating}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleAssignProject(project)}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(33, 150, 243, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(33, 150, 243, 0.3)',
                    }
                  }}
                >
                  Assign Project
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedMembers([]);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: '#ffffff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle>
          Eligible Team Members for {selectedProject?.projectName}
        </DialogTitle>
        <DialogContent>
          <List>
            {selectedProject && teamMembers
              .filter(member => 
                member.rating >= selectedProject.rating && 
                hasRequiredSkills(member.skills, selectedProject.techStack)
              )
              .map((member) => (
                <ListItem
                  key={member.email}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      onChange={() => handleMemberSelection(member)}
                      checked={selectedMembers.some(m => m.email === member.email)}
                    />
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={member.pic}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Rating: {member.rating}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Skills: {member.skills}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textSecondary">
                          {member.email}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
          </List>
          {selectedProject && teamMembers.filter(member => 
            member.rating >= selectedProject.rating && 
            hasRequiredSkills(member.skills, selectedProject.techStack)
          ).length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography color="error">
                No eligible members found with required skills and rating
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setSelectedMembers([]);
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignMembers}
            variant="contained"
            disabled={selectedMembers.length === 0}
            sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
              color: 'white'
            }}
          >
            Assign Selected Members
          </Button>
        </DialogActions>
      </Dialog>

      {filteredProjects.length > itemsPerPage && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProjectsAssignment;