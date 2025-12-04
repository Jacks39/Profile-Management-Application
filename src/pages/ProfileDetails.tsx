import React, { useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProfiles } from '../store/profileSlice';
import { RootState } from '../store';

const ProfileDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { profiles, currentProfileId, loading, error } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (profiles.length === 0) {
      dispatch(fetchProfiles() as any);
    }
  }, [dispatch, profiles.length]);

  const currentProfile = profiles.find(p => p.id === currentProfileId);

  if (loading && profiles.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !currentProfile) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
          Back to Profiles
        </Button>
      </Container>
    );
  }

  if (!currentProfile) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            No Profile Selected
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Please select or create a profile first.
          </Typography>
          <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
            View All Profiles
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {currentProfile.firstName} {currentProfile.lastName}
            </Typography>
            
            <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Personal Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  First Name
                </Typography>
                <Typography variant="body1">
                  {currentProfile.firstName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Last Name
                </Typography>
                <Typography variant="body1">
                  {currentProfile.lastName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {currentProfile.email}
                </Typography>
              </Box>

              {currentProfile.age && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Age
                  </Typography>
                  <Typography variant="body1">
                    {currentProfile.age}
                  </Typography>
                </Box>
              )}

              {currentProfile.id && (
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Profile ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#666' }}>
                    {currentProfile.id}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/profile-form?edit=true"
                variant="contained"
                color="primary"
              >
                Edit Profile
              </Button>
              
              <Button
                component={Link}
                to="/"
                variant="outlined"
                color="primary"
              >
                Back to All Profiles
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfileDetails;
