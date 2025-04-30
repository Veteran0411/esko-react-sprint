import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from '../navbar/NavigationBar';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  useTheme,
  Button,
  Divider,
  Chip
} from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { exportToPDF, exportToCSV } from '../../utils/exportUtils';
import { Download as DownloadIcon, EmojiEvents, People } from '@mui/icons-material';

const Dashboard = () => {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getDetails');
        setTeamData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Role Distribution Pie Chart Data
  const roleDistribution = teamData.reduce((acc, member) => {
    const existingRole = acc.find(item => item.label === member.role);
    if (existingRole) {
      existingRole.value += 1;
    } else {
      acc.push({ id: acc.length, label: member.role, value: 1 }); // this default name for pie chart in mui
    }
    return acc;
  }, []);

  // Skills Distribution Data for Radar Chart
  const skillMap = {};
  teamData.forEach(member => {
    member.skills.split(',').forEach(skill => {
      const trimmed = skill.trim();
      skillMap[trimmed] = (skillMap[trimmed] || 0) + 1;
    });
  });
  // after this loop, skillMap will look like this:
  // {
  //   React: 2,
  //   Node: 2,
  //   Java: 1,
  //   Python: 1
  // }
  
  const skillsData = Object.entries(skillMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8) //top 8 
    .map(([skill, count]) => ({
      skill,
      count: Math.round((count / teamData.length) * 100) // Convert to percentage
    }));
    // after this loop, skillsData will look like this: example
    // [
    //   { skill: 'React', count: 67 },
    //   { skill: 'Node', count: 67 },
    //   { skill: 'Java', count: 33 },
    //   { skill: 'Python', count: 33 }
    // ]
    
  if (loading) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <CircularProgress size={80} thickness={4} sx={{ color: '#3f51b5' }} />
      </motion.div>
    </Box>
  );

  if (error) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Alert severity="error" sx={{ 
        width: '50%',
        boxShadow: theme.shadows[10],
        borderRadius: 4,
        fontSize: '1.1rem',
        '& .MuiAlert-icon': { fontSize: '2rem' }
      }}>
        {error}
      </Alert>
    </Box>
  );

  return (
    <>
      <NavigationBar />
      <Box sx={{
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f6f9fc 0%, #e9ecef 100%)',
      }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          mb: 6,
          position: 'relative'
        }}>
          {/* Export Buttons - Top Right */}
          <Box sx={{ 
            position: 'absolute',
            right: 0,
            top: 0,
            display: 'flex',
            gap: 2
          }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => exportToPDF(teamData)}
              sx={{
                background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
                px: 3,
                py: 1.5,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(33, 150, 243, 0.4)',
                }
              }}
            >
              Export PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => exportToCSV(teamData)}
              sx={{
                background: 'linear-gradient(45deg, #4caf50 30%, #388e3c 90%)',
                px: 3,
                py: 1.5,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(76, 175, 80, 0.4)',
                }
              }}
            >
              Export CSV
            </Button>
          </Box>

          {/* Dashboard Title - Center */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h2" sx={{
              fontWeight: 800,
              textAlign: 'center',
              background: 'linear-gradient(45deg, #2196f3 30%, #3f51b5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
              Dashboard
            </Typography>
            <Typography variant="h5" sx={{
              textAlign: 'center',
              color: '#546e7a',
              mb: 2
            }}>
              Total Team Members: {teamData.length}
            </Typography>
          </motion.div>
        </Box>

        {/* Add this new Box component for displaying total interns and unique tech stack */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          mb: 6
        }}>
          <Card sx={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
            width: '200px',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
          }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Total Members
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {teamData.length}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
            width: '200px',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
          }}>
            <CardContent sx={{ p: 1, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Unique Tech Stack
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {new Set(teamData.flatMap(member => 
                  member.skills.split(',').map(skill => skill.trim())
                )).size}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Skills Distribution */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card elevation={6} sx={{
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{
                    fontWeight: 700,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#1a237e'
                  }}>
                    <EmojiEvents sx={{ color: '#e91e63' }} /> Team Skills Distribution
                  </Typography>
                  <Box sx={{ 
                    height: 400,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {skillsData.length > 0 ? (
                      <RadarChart // needs array of objects for radar chart
                        cx={200}
                        cy={200}
                        outerRadius={150}
                        width={400}
                        height={400}
                        data={skillsData}
                      >
                        <PolarGrid gridType="circle" stroke="#e0e0e0" />

                        {/* circular label around radar */}
                        <PolarAngleAxis
                          dataKey="skill"
                          tick={{ 
                            fill: '#37474f',
                            fontSize: 12,
                            fontWeight: 500
                          }}
                        />
                        {/* circular radius around radar till what unit here 100*/}
                        <PolarRadiusAxis
                          angle={30} // i can remove this no issue
                          domain={[0, 100]}
                          tick={{ 
                            fill: '#37474f',
                            fontSize: 10
                          }}
                        />
                        <Radar
                          name="Skill Proficiency"
                          dataKey="count"
                          stroke="#3f51b5"
                          fill="#3f51b5"
                          fillOpacity={0.4}
                        />
                        <Legend />
                      </RadarChart>
                    ) : (
                      <Box sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#757575'
                      }}>
                        No skill data available
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skillsData.slice(0, 5).map((skill, index) => (
                      <Chip
                        key={index}
                        label={`${skill.skill} (${skill.count}%)`}
                        sx={{
                          background: `linear-gradient(45deg, rgba(63, 81, 181, 0.1) 30%, rgba(33, 150, 243, 0.1) 90%)`,
                          border: '1px solid rgba(63, 81, 181, 0.3)',
                          fontWeight: 500,
                          '&:hover': {
                            background: `linear-gradient(45deg, rgba(63, 81, 181, 0.2) 30%, rgba(33, 150, 243, 0.2) 90%)`,
                          }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Role Distribution */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card elevation={6} sx={{
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{
                    fontWeight: 700,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#1a237e'
                  }}>
                    <People sx={{ color: '#4caf50' }} /> Role Distribution
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    {roleDistribution.length > 0 ? (
                      // const roleDistribution = [
                      //   { id: 0, label: 'Frontend', value: 3, color: '#3f51b5' },
                      //   { id: 1, label: 'Backend', value: 2, color: '#4e79a7' },
                      //   { id: 2, label: 'Designer', value: 1, color: '#e15759' },
                      //   { id: 3, label: 'Tester', value: 2, color: '#f28e2b' },
                      //   { id: 4, label: 'Manager', value: 1, color: '#edc948' }
                      // ];
                      <PieChart
                        series={[{
                          data: roleDistribution.map((item, index) => ({
                            ...item,
                            color: ['#3f51b5', '#4e79a7', '#e15759', '#f28e2b', '#edc948', '#59a14f', '#76b7b2', '#b07aa1'][index % 8]
                          })),
                          innerRadius: 40,
                          outerRadius: 120,
                          paddingAngle: 1,
                          cornerRadius: 5,
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
                        }]}
                        slotProps={{
                          legend: {
                            direction: 'column',
                            position: { vertical: 'middle', horizontal: 'right' },
                            padding: 0,
                            labelStyle: {
                              fontSize: 14,
                              fontWeight: 500,
                              fill: theme.palette.text.primary
                            },
                            itemMarkWidth: 12,
                            itemMarkHeight: 12,
                          },
                        }}
                        margin={{ right: 150 }}
                        height={400}
                        width={500}
                      />
                    ) : (
                      <Box sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#757575'
                      }}>
                        No role data available
                      </Box>
                    )}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Total Roles: {roleDistribution.length}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;