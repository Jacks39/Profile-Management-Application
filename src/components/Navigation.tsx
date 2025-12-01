import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setCurrentProfile } from '../store/profileSlice';

const Navigation: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { profiles, currentProfileId } = useSelector((state: RootState) => state.profile);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const currentProfile = profiles.find(p => p.id === currentProfileId);
  const isHomePage = location.pathname === '/';
  const isFormPage = location.pathname === '/profile-form';
  const isProfileDetailsPage = location.pathname === '/profile';

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectProfile = (profileId: string | undefined) => {
    if (profileId) {
      dispatch(setCurrentProfile(profileId));
    }
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/" sx={{ textTransform: 'none' }}>
            Profile Manager
          </Button>
        </Typography>
        
        {!isHomePage && !isFormPage && currentProfile && (
          <Button 
            color="inherit" 
            onClick={handleMenuOpen}
            sx={{ textTransform: 'none', mr: 2 }}
          >
            {currentProfile.firstName} {currentProfile.lastName}
          </Button>
        )}
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {profiles.map((profile) => (
            <MenuItem 
              key={profile.id} 
              onClick={() => handleSelectProfile(profile.id)}
              selected={profile.id === currentProfileId}
            >
              {profile.firstName} {profile.lastName}
            </MenuItem>
          ))}
        </Menu>
        
        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {!isHomePage && !isFormPage && !isProfileDetailsPage && (
            <>
              <Button color="inherit" component={Link} to="/profile">
                Profile Details
              </Button>
              <Button color="inherit" component={Link} to={currentProfile ? "/profile-form?edit=true" : "/profile-form"}>
                {currentProfile ? 'Edit Profile' : 'Create Profile'}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
