import React from 'react';
import { Button, Box } from '@mui/material';
import { keyframes } from '@mui/system';

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
  100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      margin: "auto",
      flexWrap: 'wrap',
      position: "fixed",
      bottom: "0",
      padding: "1.5rem",
      width: "100%",
      background: "linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
      backdropFilter: "blur(8px)",
      borderTop: "1px solid rgba(0,0,0,0.1)",
      zIndex: 1000
    }}>
      <Button
        variant="outlined"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        sx={{
          minWidth: '80px',
          fontWeight: 600,
          borderRadius: '20px',
          '&:hover': { transform: 'translateY(-2px)' }
        }}
      >
        First
      </Button>
      
      <Button
        variant="outlined"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        sx={{
          minWidth: '40px',
          borderRadius: '50%',
          aspectRatio: '1/1'
        }}
      >
        ←
      </Button>

      {startPage > 1 && (
        <Button variant="text" disabled sx={{ minWidth: '40px' }}>
          ...
        </Button>
      )}
      
      {pageNumbers.map(number => (
        <Button
          key={number}
          variant={currentPage === number ? "contained" : "outlined"}
          onClick={() => onPageChange(number)}
          sx={{
            minWidth: '40px',
            borderRadius: '50%',
            aspectRatio: '1/1',
            fontWeight: currentPage === number ? 700 : 500,
            ...(currentPage === number && {
              animation: `${pulseAnimation} 1.5s infinite`,
              background: 'linear-gradient(45deg, #3498db, #9b59b6)'
            })
          }}
        >
          {number}
        </Button>
      ))}
      
      {endPage < totalPages && (
        <Button variant="text" disabled sx={{ minWidth: '40px' }}>
          ...
        </Button>
      )}

      <Button
        variant="outlined"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        sx={{
          minWidth: '40px',
          borderRadius: '50%',
          aspectRatio: '1/1'
        }}
      >
        →
      </Button>
      
      <Button
        variant="outlined"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        sx={{
          minWidth: '80px',
          fontWeight: 600,
          borderRadius: '20px',
          '&:hover': { transform: 'translateY(-2px)' }
        }}
      >
        Last
      </Button>
    </Box>
  );
};

export default Pagination;

// import React from 'react';
// import { Pagination as MuiPagination, Box } from '@mui/material';

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   return (
//     <Box sx={{
//       position: "fixed",
//       bottom: "0",
//       width: "100%",
//       padding: "1.5rem",
//       display: "flex",
//       justifyContent: "center",
//       background: "linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
//       backdropFilter: "blur(8px)",
//       borderTop: "1px solid rgba(0,0,0,0.1)",
//       zIndex: 1000
//     }}>
//       <MuiPagination
//         count={totalPages}
//         page={currentPage}
//         onChange={(e, page) => onPageChange(page)}
//         color="primary"
//         shape="rounded"
//         size="large"
//         showFirstButton
//         showLastButton
//         sx={{
//           '& .MuiPaginationItem-root': {
//             fontWeight: 600,
//             fontSize: '0.875rem'
//           },
//           '& .MuiPaginationItem-page.Mui-selected': {
//             background: 'linear-gradient(45deg, #3498db, #9b59b6)',
//             color: 'white',
//             boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)'
//           },
//           '& .MuiPaginationItem-page:hover': {
//             transform: 'translateY(-2px)',
//             transition: 'transform 0.2s'
//           }
//         }}
//       />
//     </Box>
//   );
// };

// export default Pagination;