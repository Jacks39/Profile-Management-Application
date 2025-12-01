import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProfiles, deleteProfile, setCurrentProfile } from '../store/profileSlice';
import { RootState } from '../store';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profiles, currentProfileId, loading, error } = useSelector((state: RootState) => state.profile);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchProfiles() as any);
  }, [dispatch]);

  const handleDeleteClick = (profileId: string | undefined) => {
    if (profileId) {
      setProfileToDelete(profileId);
      setDeleteDialogOpen(true);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (profileToDelete) {
        await dispatch(deleteProfile(profileToDelete) as any);
      }
      setDeleteDialogOpen(false);
      setProfileToDelete(null);
    } catch (err) {
      console.error('Failed to delete profile:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectProfile = (profileId: string | undefined) => {
    if (profileId) {
      dispatch(setCurrentProfile(profileId));
      navigate('/profile');
    }
  };

  if (loading && profiles.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Button component={Link} to="/profile-form" variant="contained" sx={{ mt: 2 }}>
          Create Profile
        </Button>
      </Container>
    );
  }

  if (profiles.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            No Profiles Found
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Please create a profile to get started.
          </Typography>
          <Button component={Link} to="/profile-form" variant="contained" sx={{ mt: 2 }}>
            Create Profile
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            All Profiles ({profiles.length})
          </Typography>
          <Button 
            component={Link} 
            to="/profile-form" 
            variant="contained" 
            color="primary"
          >
            + Add New Profile
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {profiles.map((profile) => (
            <Box key={profile.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: profile.id === currentProfileId ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  backgroundColor: profile.id === currentProfileId ? '#f5f5f5' : 'white',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {profile.firstName} {profile.lastName}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {profile.email}
                  </Typography>
                  
                  {profile.age && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      <strong>Age:</strong> {profile.age}
                    </Typography>
                  )}

                  {profile.id === currentProfileId && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                        ✓ Current Profile
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <Box sx={{ display: 'flex', gap: 1, p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleSelectProfile(profile.id)}
                    fullWidth
                  >
                    Select
                  </Button>
                  
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to={`/profile-form?edit=true&id=${profile.id}`}
                    fullWidth
                  >
                    Edit
                  </Button>
                  
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteClick(profile.id)}
                    fullWidth
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Profile</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this profile? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;