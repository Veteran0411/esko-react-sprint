import React from 'react';
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper,
  Avatar,
  Box
} from '@mui/material';
import { keyframes } from '@mui/system';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const TableView = ({ profiles }) => {
  return (
    <Box sx={{ 
      width: '100%',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <TableContainer 
        component={Paper}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 60, 135, 0.12)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,249,255,0.95) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{
              background: 'linear-gradient(90deg, #3498db, #9b59b6)',
              '& th': {
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem'
              }
            }}>
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Fun Fact</TableCell>
              <TableCell>Join Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.map((profile, index) => (
              <TableRow 
                key={index}
                hover
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  },
                  '&:last-child td, &:last-child th': {
                    border: 0
                  }
                }}
              >
                <TableCell>
                  <Avatar 
                    src={profile.pic} 
                    alt={profile.name}
                    sx={{ 
                      width: 56, 
                      height: 56,
                      border: '2px solid rgba(52, 152, 219, 0.3)'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {profile.name}
                  <Box component="span" sx={{ 
                    display: 'block', 
                    fontSize: '0.8rem', 
                    color: '#9b59b6',
                    fontStyle: 'italic'
                  }}>
                    {profile.nickname}
                  </Box>
                </TableCell>
                <TableCell>{profile.role}</TableCell>
                <TableCell>{profile.team}</TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #3498db 0%, #9b59b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 200%',
                  animation: `${gradientAnimation} 5s ease infinite`,
                }}>
                  {profile.rating}
                </TableCell>
                <TableCell sx={{ 
                  fontStyle: 'italic',
                  maxWidth: '300px'
                }}>
                  "{profile.funFact}"
                </TableCell>
                <TableCell>{profile.joiningDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableView;