import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Filter = ({ roles, selectedRole, onRoleChange }) => {
  return (
    <Box sx={{ 
      minWidth: 200,
      marginLeft: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '4px',
      padding: '0 8px'
    }}>
      <FormControl fullWidth size="small">
        <InputLabel id="role-filter-label">Filter by Role</InputLabel>
        <Select
          labelId="role-filter-label"
          value={selectedRole}
          label="Filter by Role"
          onChange={(e) => onRoleChange(e.target.value)}
          sx={{
            '& .MuiSelect-select': {
              padding: '8px 32px 8px 12px'
            }
          }}
        >
          <MenuItem value="all">All Roles</MenuItem>
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Filter;