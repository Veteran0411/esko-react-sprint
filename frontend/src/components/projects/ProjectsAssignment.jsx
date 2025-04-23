import React, { useState, useEffect, useMemo } from 'react';
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
import ViewModuleIcon from '@mui/icons-material/ViewModule';

const ProjectsAssignment = () => {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'grid'

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
    <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        backdropFilter: 'blur(8px)',
        gap: '16px'
      }}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <NavigationBar />
      </Box>

      <Box sx={{
        p: 4,
        minHeight: '100vh',
        backgroundColor: "rgba(92, 82, 82, 0.11)",
        backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(0,0,0,0.05))'
      }}>
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            fontWeight: 800,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #2196f3 30%, #3f51b5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Available Projects
        </Typography>

        {filteredProjects.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No unassigned projects available
            </Typography>
          </Box>
        ) :
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '2rem 0px',
            gap: '20px',
            width: '100%',
            margin: '0 auto'
          }}>
            {currentItems.map((project, index) => (
              <motion.div
                key={project.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  elevation={6}
                  sx={{
                    width: 300,
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
                      {project.projectName}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" paragraph>
                      {project.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Required Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {project.techStack.map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            size="small"
                            sx={{
                              background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                              color: 'white'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Star sx={{ color: '#ffc107', mr: 1 }} />
                      <Typography variant="subtitle2">
                        Required Rating: {project.rating}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      startIcon={<Assignment />}
                      fullWidth
                      onClick={() => handleAssignProject(project)}
                      sx={{
                        mt: 2,
                        background: 'linear-gradient(45deg, #2196f3 30%, #3f51b5 90%)',
                        borderRadius: '8px',
                        textTransform: 'none'
                      }}
                    >
                      Assign Project
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        }

        {filteredProjects.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setSelectedMembers([]);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Eligible Team Members for {selectedProject?.projectName}
          </DialogTitle>
          <DialogContent>
            <List>
              {selectedProject && teamMembers
                .filter(member => member.rating >= selectedProject.rating)
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
                          <Typography component="span" variant="body2" color="textSecondary">
                            {member.email}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
            </List>
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
                background: 'linear-gradient(45deg, #2196f3 30%, #3f51b5 90%)',
                color: 'white'
              }}
            >
              Assign Selected Members
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ProjectsAssignment;