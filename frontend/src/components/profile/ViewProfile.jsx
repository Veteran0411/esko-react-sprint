import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    Rating,
    Divider,
    CircularProgress,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import axios from 'axios';
import { Email, Phone, LocationOn, CalendarToday, Star, Schedule, Group, Code, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';

const THEME_COLORS = {
    primary: '#3498db',
    secondary: '#9b59b6',
    gradient: {
        start: '#3498db',
        end: '#9b59b6'
    },
    accent: '#e74c3c',
    success: '#2ecc71',
    ongoing: '#3498db',
    pending: '#e67e22'
};

const ViewProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const profile = location.state?.profileData;
    const [projects, setProjects] = useState([]);
    const [visibleProjects, setVisibleProjects] = useState(1); // Start with 1 projects
    const loaderRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/projects/getProjects`);
                console.log('Fetched Projects:', response.data);
                const allProjects = response.data;
                // Filter projects where this profile's email is in assignedTo array
                const userProjects = allProjects.filter(project =>
                    project.assignedTo && project.assignedTo.includes(profile.email)
                );
                setProjects(userProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        if (profile) {
            fetchProjects();
        }
    }, [profile]);

    // Intersection Observer to lazy load projects
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleProjects < projects.length) {
                    setTimeout(() => {
                        setVisibleProjects(prev => prev + 2); // Load 2 more projects
                    }, 500); // Small delay for smooth loading
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [visibleProjects, projects.length]);

    if (!profile) {
        return <Typography>No profile data available</Typography>;
    }

    const handleDeleteIntern = async (id) => {
        if (window.confirm('Are you sure you want to delete this intern?')) {
            try {
                console.log('Deleting intern with ID:', id);
                const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/deleteProfile/${id}`);
                
                if (response.data.success) {
                    toast.success('🗑️ Intern deleted successfully', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                    navigate('/viewAllIntern', { replace: true });
                } else {
                    toast.error(response.data.message || 'Failed to delete intern');
                }
            } catch (error) {
                console.error('Error deleting intern:', error);
                toast.error(error.response?.data?.message || 'Error occurred while deleting intern');
            }
        }
    };

    // Get only the projects to display
    const projectsToShow = projects.slice(0, visibleProjects);

    // Add this function to handle edit mode
    const handleEditClick = () => {
        setEditedProfile({
            name: profile.name,
            email: profile.email,
            rating: profile.rating,
            phoneNo: profile.phoneNo,
            address: profile.address
        });
        setIsEditMode(true);
    };

    // Add this function to handle profile updates
    const handleProfileUpdate = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/updateProfile`, editedProfile);
            
            if (response.data.success) {
                // Update local profile data
                Object.assign(profile, editedProfile);
                setIsEditMode(false);
                toast.success('✨ Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
            display: 'flex',
            gap: 3,
            p: 3
        }}>
            {/* Left Section - Profile Details */}
            <Card sx={{
                width: '30%',
                height: 'fit-content',
                borderRadius: '20px',
                position: 'sticky',
                top: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)'
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Avatar
                            src={profile.pic}
                            sx={{
                                width: 150,
                                height: 150,
                                margin: '0 auto',
                                border: '4px solid white',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                            }}
                        />
                        
                        {/* Name and Role Section */}
                        <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                            {profile.name}
                        </Typography>
                        
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Chip
                                label={profile.role}
                                sx={{
                                    background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
                                    color: 'white',
                                    fontWeight: 600
                                }}
                            />
                            {isAdmin && (
                                <>
                                    <Chip
                                        icon={<Edit sx={{ color: 'white !important' }} />}
                                        label="Edit"
                                        onClick={handleEditClick}
                                        sx={{
                                            background: 'linear-gradient(45deg, #2196f3 0%, #3f51b5 100%)',
                                            color: 'white',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #1976d2 0%, #283593 100%)',
                                            }
                                        }}
                                    />
                                    <Chip
                                        label="Delete"
                                        onClick={() => handleDeleteIntern(profile.id)}
                                        sx={{
                                            background: 'linear-gradient(45deg, #e74c3c 0%, #c0392b 100%)',
                                            color: 'white',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #c0392b 0%, #a93226 100%)',
                                            }
                                        }}
                                    />
                                </>
                            )}
                        </Box>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                            <Rating value={profile.rating} precision={0.1} readOnly />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#666' }}>
                                ({profile.rating})
                            </Typography>
                        </Box>

                        {/* Keep the existing Dialog component */}
                        <Dialog open={isEditMode} onClose={() => setIsEditMode(false)}>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                    <TextField
                                        label="Name"
                                        value={editedProfile.name || ''}
                                        onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Email"
                                        value={editedProfile.email || ''}
                                        onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                                        fullWidth
                                        disabled
                                    />
                                    <TextField
                                        label="Rating"
                                        type="number"
                                        value={editedProfile.rating || ''}
                                        onChange={(e) => setEditedProfile(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                                        inputProps={{ min: 0, max: 5, step: 0.1 }}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Phone Number"
                                        value={editedProfile.phoneNo || ''}
                                        onChange={(e) => setEditedProfile(prev => ({ ...prev, phoneNo: e.target.value }))}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Address"
                                        value={editedProfile.address || ''}
                                        onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                                        fullWidth
                                        multiline
                                        rows={2}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setIsEditMode(false)}>Cancel</Button>
                                <Button 
                                    onClick={handleProfileUpdate}
                                    sx={{
                                        background: 'linear-gradient(45deg, #3498db 30%, #2980b9 90%)',
                                        color: 'white',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #2980b9 30%, #2574a9 90%)',
                                        }
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Email sx={{ color: '#000000' }} />
                            <Typography>{profile.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Phone sx={{ color: '#000000' }} />
                            <Typography>{profile.phoneNo}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LocationOn sx={{ color: '#000000' }} />
                            <Typography>{profile.address}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CalendarToday sx={{ color: '#000000' }} />
                            <Typography>Joined: {profile.joiningDate}</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Skills</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profile.skills.split(',').map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill.trim()}
                                sx={{
                                    background: 'rgba(0, 0, 0, 0.05)',
                                    color: '#000000',
                                    fontWeight: 500,
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                    }
                                }}
                            />
                        ))}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Fun Fact</Typography>
                    <Typography variant="body2" sx={{
                        fontStyle: 'italic',
                        color: '#666',
                        background: '#f5f5f5',
                        p: 2,
                        borderRadius: '10px'
                    }}>
                        "{profile.funFact}"
                    </Typography>
                </CardContent>
            </Card>

            {/* Right Section - Projects */}
            <Box sx={{
                width: '70%',
                maxHeight: '100vh',
                overflowY: 'auto',
                pr: 2,
                '&::-webkit-scrollbar': {
                    width: '6px'
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '10px',
                    '&:hover': {
                        background: 'rgba(0,0,0,0.3)'
                    }
                }
            }}>
                <Box sx={{
                    mb: 4,
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-10px',
                        left: 0,
                        width: '100px',
                        height: '4px',
                        background: 'linear-gradient(90deg, #3498db, transparent)',
                        borderRadius: '2px'
                    }
                }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
                            color: 'white',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            display: 'inline-block',
                            position: 'relative',
                            zIndex: 1,
                            boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {    
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(155, 89, 182, 0.4)'
                            }
                        }}
                    >
                        Project Portfolio
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {projects.length} {projects.length === 1 ? 'Project' : 'Projects'} Involved
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {projectsToShow.map((project, index) => (
                        <Grid item xs={12} md={6} key={index} width={{ width: '100%' }}>
                            <Card sx={{
                                height: '100%',
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: `0 20px 40px ${THEME_COLORS.primary}20`,
                                    '& .project-details': {
                                        maxHeight: '500px',
                                        opacity: 1,
                                        visibility: 'visible'
                                    }
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)'
                                }
                            }}>
                                <CardContent sx={{ p: 3, width: '100%' }}>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="h5" sx={{
                                            fontWeight: 700,
                                            color: '#1a237e',
                                            fontSize: '1.25rem',
                                            maxWidth: '80%'
                                        }}>
                                            {project.projectName}
                                        </Typography>
                                        <Chip
                                            label={project.status}
                                            size="small"
                                            sx={{
                                                background: project.status === 'completed'
                                                    ? 'linear-gradient(45deg, #2ecc71 30%, #27ae60 90%)'
                                                    : project.status === 'ongoing'
                                                        ? 'linear-gradient(45deg, #3498db 30%, #2980b9 90%)'
                                                        : 'linear-gradient(45deg, #e67e22 30%, #d35400 90%)',
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                                height: '24px'
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="body2" sx={{
                                        mb: 3,
                                        color: '#666',
                                        lineHeight: 1.6,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {project.description}
                                    </Typography>

                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: 2,
                                        mb: 3,
                                        p: 2,
                                        background: 'rgba(0,0,0,0.02)',
                                        borderRadius: '12px'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Star sx={{ color: '#000000', fontSize: '1.2rem' }} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Rating</Typography>
                                                <Typography variant="body2" fontWeight={600}>{project.rating}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Schedule sx={{ color: '#000000', fontSize: '1.2rem' }} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Deadline</Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {new Date(project.deadline).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#1a237e', fontWeight: 600 }}>
                                        Tech Stack
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {project.techStack.map((tech, idx) => (
                                            <Chip
                                                key={idx}
                                                icon={<Code sx={{ fontSize: '1rem', color: '#000000' }} />}
                                                label={tech}
                                                size="small"
                                                sx={{
                                                    background: 'rgba(0, 0, 0, 0.05)',
                                                    color: '#000000',
                                                    fontWeight: 500,
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                                    },
                                                    transition: 'all 0.2s ease'
                                                }}
                                            />
                                        ))}
                                    </Box>

                                    <Box className="project-details" sx={{
                                        maxHeight: 0,
                                        opacity: 0,
                                        visibility: 'hidden',
                                        overflow: 'hidden',
                                        transition: 'all 0.4s ease-in-out',
                                        background: `linear-gradient(135deg, ${THEME_COLORS.primary}08, ${THEME_COLORS.primary}15)`,
                                        borderRadius: '12px',
                                        mt: 2,
                                        px: 2
                                        }}>
                                        <Box sx={{ py: 2 }}>
                                            <Typography variant="subtitle2" sx={{
                                                color: '#000000',
                                                fontWeight: 600,
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}>
                                                <Group sx={{ fontSize: '1.2rem', color: '#000000' }} />
                                                Team Members
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 1
                                            }}>
                                                {project.team.map((member, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={member}
                                                        size="small"
                                                        sx={{
                                                            background: 'rgba(0, 0, 0, 0.05)',
                                                            color: '#000000',
                                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                                            },
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                    {/* Loading indicator */}
                    {visibleProjects < projects.length && (
                        <Grid item xs={12} ref={loaderRef}>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                py: 3,
                                opacity: 0.7
                            }}>
                                <CircularProgress 
                                    sx={{ 
                                        color: THEME_COLORS.gradient.start,
                                        '& .MuiCircularProgress-circle': {
                                            strokeLinecap: 'round'
                                        }
                                    }} 
                                />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default ViewProfile;