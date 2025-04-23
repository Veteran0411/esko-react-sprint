// UserProfileData.jsx - Enhanced with more attractive and professional styling
import React from 'react';
import { Typography, Box, Rating, Chip, Divider } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import StarIcon from '@mui/icons-material/Star';

const UserProfileData = ({profile}) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            gap: '8px',
            p: 1
        }}>
            <Typography
            component="div"
            variant="h6" sx={{
                fontWeight: 700,
                color: '#2c3e50',
                textAlign: 'center',
                fontFamily: '"Poppins", sans-serif',
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                position: 'relative',
                pb: 1,
                mb: 0,
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #3498db, #9b59b6)',
                    borderRadius: '3px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }
            }}>
                {profile.name}
            </Typography>
            
            
            <Chip
                icon={<WorkIcon fontSize="small" sx={{ color: '#2980b9' }} />}
                label={profile.role || "Team Member"}
                color="primary"
                variant="outlined"
                size="small"
                sx={{
                    fontWeight: 600,
                    borderRadius: '16px',
                    px: 1,
                    py: 0.5,
                    background: 'linear-gradient(135deg, rgba(41,128,185,0.05) 0%, rgba(52,152,219,0.1) 100%)',
                    borderWidth: '1.5px',
                    borderColor: '#3498db',
                    boxShadow: '0 2px 8px rgba(52,152,219,0.15)',
                    '& .MuiChip-label': {
                        fontSize: '0.8rem',
                        color: '#2980b9',
                        fontWeight: 600
                    },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        background: 'linear-gradient(135deg, rgba(41,128,185,0.1) 0%, rgba(52,152,219,0.15) 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 3px 10px rgba(52,152,219,0.2)'
                    }
                }}
            />

            
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                p: 1.5,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, rgba(155, 89, 182, 0.05) 100%)',
                    zIndex: -1
                }
            }}>
                
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 0.5,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.08) 0%, rgba(52, 152, 219, 0.02) 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.12) 0%, rgba(52, 152, 219, 0.05) 100%)',
                        transform: 'translateX(2px)'
                    }
                }}>
                    <GroupsIcon sx={{ 
                        color: '#3498db', 
                        fontSize: '1.1rem',
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                    }} />
                    <Typography 
                    component="div"
                    variant="body2" sx={{ 
                        fontWeight: 600,
                        color: '#2c3e50',
                        fontSize: '0.85rem'
                    }}>
                        <Box component="span" sx={{
                            fontWeight: 700,
                            color: '#3498db',
                            mr: 1
                        }}>Skills:</Box>
                        {profile.skills}
                    </Typography>
                </Box>
                
                
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 0.5,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.08) 0%, rgba(52, 152, 219, 0.02) 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.12) 0%, rgba(52, 152, 219, 0.05) 100%)',
                        transform: 'translateX(2px)'
                    }
                }}>
                    <LocationOnIcon sx={{ 
                        color: '#3498db', 
                        fontSize: '1.1rem',
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                    }} />
                    <Typography
                    component="div"
                    variant="body2" sx={{ 
                        fontWeight: 600,
                        color: '#2c3e50',
                        fontSize: '0.85rem'
                    }}>
                        <Box component="span" sx={{
                            fontWeight: 700,
                            color: '#3498db',
                            mr: 1
                        }}>Location:</Box>
                        <Box sx={{ 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            maxWidth: '160px' 
                        }}>
                            {profile.address}
                        </Box>
                    </Typography>
                </Box>
                
                
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 0.5,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.08) 0%, rgba(52, 152, 219, 0.02) 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.12) 0%, rgba(52, 152, 219, 0.05) 100%)',
                        transform: 'translateX(2px)'
                    }
                }}>
                    <CalendarTodayIcon sx={{ 
                        color: '#3498db', 
                        fontSize: '1.1rem',
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                    }} />
                    <Typography
                    component="div"
                    variant="body2" sx={{ 
                        fontWeight: 600,
                        color: '#2c3e50',
                        fontSize: '0.85rem'
                    }}>
                        <Box component="span" sx={{
                            fontWeight: 700,
                            color: '#3498db',
                            mr: 1
                        }}>Joining Date:</Box>
                        {profile.joiningDate || "Jan 2023"}
                    </Typography>
                </Box>
            </Box>
            
            
            <Box sx={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(241, 196, 15, 0.08) 0%, rgba(243, 156, 18, 0.15) 100%)',
                borderRadius: '12px',
                p: 1.5,
                border: '1px solid rgba(243, 156, 18, 0.3)',
                boxShadow: '0 4px 12px rgba(243, 156, 18, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(243, 156, 18, 0.15)'
                },
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: 'linear-gradient(to bottom, #f39c12, #f1c40f)',
                    borderRadius: '2px 0 0 2px'
                }
            }}>
                
                
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                    }}>
                    <Rating 
                        value={profile.rating || 4.5} 
                        precision={0.5} 
                        readOnly 
                        size="small"
                        sx={{
                            '& .MuiRating-iconFilled': {
                                color: '#f39c12',
                                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
                            },
                            '& .MuiRating-iconEmpty': {
                                color: 'rgba(243, 156, 18, 0.3)'
                            }
                        }}
                    />
                    <Typography
                    component="div"
                    variant="body2" sx={{
                        fontWeight: 700,
                        color: '#7f6000',
                        fontSize: '0.9rem',
                        
                        background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.08) 0%, rgba(52, 152, 219, 0.02) 100%)',
                        px: 1,
                        py: 0.2,
                        borderRadius: '12px',
                        border: '1px solid rgba(243, 156, 18, 0.3)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      Rating  {profile.rating || 4.5}/5
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default UserProfileData;
