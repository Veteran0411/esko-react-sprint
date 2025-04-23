import React from 'react';
import { TextField, Box, keyframes } from '@mui/material';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <Box sx={{
      // position: 'absolute',
      top: '20px',
      left: '50%',
      // transform: 'translateX(-50%)',
      zIndex: 100,
      width: '100%',
      maxWidth: '500px',
      padding: '0 20px'
    }}>
      <TextField
        fullWidth
        label="Search profiles..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(52, 152, 219, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(52, 152, 219, 0.8)',
              borderWidth: '2px'
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.6)',
            fontWeight: 500,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#3498db',
          }
        }}
        InputProps={{
          style: {
            fontSize: '1rem',
            paddingLeft: '20px',
          }
        }}
      />
    </Box>
  );
};

export default SearchBar;

// // SearchBar.jsx
// import React from 'react';
// import { TextField, Box } from '@mui/material';

// const SearchBar = ({ searchTerm, setSearchTerm }) => {
//   return (
//     <Box sx={{ textAlign: 'center', my: 4 ,position:"absolute"}}>
//       <TextField
//         label="Search profiles..."
//         variant="outlined"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         sx={{ width: '300px' }}
//       />
//     </Box>
//   );
// };

// export default SearchBar;
