import React, { useEffect, useState, useMemo } from 'react';
import Card from '../card/Card';
import axios from 'axios';
import { Typography, Box, CircularProgress, Button } from '@mui/material';
import ProfileImage from './ProfileImage';
import UserProfileData from './UserProfileData';
import SearchBar from '../search/SearchBar';
import Pagination from '../pagination/Pagination';
import { usePagination } from '../custom hooks/usePagination';
import Filter from '../filter/Filter';
import TableView from '../table view/TableView';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableRowsIcon from '@mui/icons-material/TableRows';
import NavigationBar from '../navbar/NavigationBar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/getDetails')
      .then((res) => {
        setProfiles(res.data);
        console.log('Profiles fetched:', res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching profiles:', err);
        setLoading(false);
      });
  }, []);

  // Get unique roles for filter dropdown
  const roles = useMemo(() => {
      // usememo memoiszes return value and directly sends it
    const uniqueRoles = new Set();
    profiles.forEach(profile => {
      if (profile.role) {
        uniqueRoles.add(profile.role);
      }
    });
    return Array.from(uniqueRoles).sort();
  }, [profiles]);

    // this one is to search for all fields.
  // on every render it was re-calculating the filtered Profiles even if profiles and search term was same (new memory even if same content)
  //  so it was also creating a pagination hook

  // =====================================================

  // React.useMemo memoizes (caches) the filtered result so that it only recalculates 
  // when profiles or searchTerm actually change.

  // ======================|||||||||||||||||||||||||||||=============================
  // ======================|||||||||||||||||||||||||||||=============================

// React’s useMemo only keeps the same reference if the dependencies haven't changed. But in some cases:
// If profiles is fetched again (new array reference) or
// searchTerm is retyped or reset
// Parent component rerenders unexpectedly
// Then filteredProfiles is re-evaluated and gets a new array reference, even if its content looks the same.

// ======================|||||||||||||||||||||||||||||=============================
// ======================|||||||||||||||||||||||||||||=============================


  // Combined filter for search term and role
  const filteredProfiles = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return profiles.filter(profile => {
      const matchesSearch = Object.values(profile).some(value =>
        String(value).toLowerCase().includes(search)
      );
      const matchesRole = selectedRole === 'all' || profile.role === selectedRole;
      return matchesSearch && matchesRole; // returns the profile iterating element if both are true (included)
    });
  }, [profiles, searchTerm, selectedRole]);

     // Use the custom pagination hook for common code. 
    // but becoz of this. pagination hook is being recreated on every re-render or change in component (like change current page)
    //which resets the current page(as it treated it as new array bcoz of new memory) 
    // so i had to use React.memo to filteredProfiles 
    // where it only renders when filteredprofiles is changed

  const {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
    itemsPerPage
  } = usePagination(filteredProfiles);

  const handleProfileClick = (profile) => {
    navigate('/profileDetails', { state: { profileData: profile } });
  };

  if (loading) {
    return (
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
          Loading profiles...
        </Typography>
      </Box>
    );
  }

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
        <NavigationBar/>
        <Filter 
          roles={roles} 
          selectedRole={selectedRole} 
          onRoleChange={setSelectedRole} 
        />
        <Button
          variant="outlined"
          onClick={() => setViewMode(prev => prev === 'cards' ? 'table' : 'cards')}
          startIcon={viewMode === 'cards' ? <TableRowsIcon /> : <ViewModuleIcon />}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 16px'
          }}
        >
          {viewMode === 'cards' ? 'Table View' : 'Card View'}
        </Button>
      </Box>

      {viewMode === 'cards' ? (
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '4rem 0px',
          backgroundColor: "rgba(92, 82, 82, 0.11)",
          backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(0,0,0,0.05))',
          minHeight: '100vh',
          gap: '20px',
          width: '100%',
          margin: '0 auto'
        }}>
          {currentItems.map((profile, index) => (
            <Box key={index} sx={{
              display: 'flex',
              justifyContent: 'center',
              margin: '16px',
            }}>
              <Card info={profile.funFact} backName={profile.nickname}>
                <Box 
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%'
                  }}
                  onClick={() => handleProfileClick(profile)}  // Updated this line
                >
                  <ProfileImage profile={profile} />
                  <UserProfileData profile={profile} />
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      ) : (
        <TableView profiles={currentItems} />
      )}

      {filteredProfiles.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default Profile;