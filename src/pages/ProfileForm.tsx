import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveProfile, clearError, setCurrentProfile } from '../store/profileSlice';
import { RootState } from '../store';
import { Profile } from '../types/profile';

const ProfileForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profiles, currentProfileId, loading, error } = useSelector((state: RootState) => state.profile);
  const [urlParams] = useState(new URLSearchParams(window.location.search));
  const isCreating = urlParams.get('mode') === 'create' || window.location.pathname === '/profile-form';
  const editProfileId = urlParams.get('id');
  
  const currentProfile = !isCreating ? profiles.find(p => p.id === currentProfileId) : null;
  const editingProfile = editProfileId ? profiles.find(p => p.id === editProfileId) : null;
  
  const [formData, setFormData] = useState<Profile>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    age: undefined,
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // If editing a specific profile from home page
    if (editingProfile && urlParams.get('edit') === 'true') {
      setFormData({
        id: editingProfile.id,
        firstName: editingProfile.firstName,
        lastName: editingProfile.lastName,
        email: editingProfile.email,
        age: editingProfile.age,
      });
      setIsEditing(true);
    } else if (currentProfile && urlParams.get('edit') === 'true') {
      // If editing current profile from EDIT PROFILE button in navbar
      setFormData({
        id: currentProfile.id,
        firstName: currentProfile.firstName,
        lastName: currentProfile.lastName,
        email: currentProfile.email,
        age: currentProfile.age,
      });
      setIsEditing(true);
    }
  }, [currentProfile, editingProfile, urlParams]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      id: Date.now().toString(),
      firstName: '',
      lastName: '',
      email: '',
      age: undefined,
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim() || formData.firstName.length < 3) {
      newErrors.firstName = 'First name is required and must be at least 3 characters';
    }

    if (!formData.lastName.trim() || formData.lastName.length < 3) {
      newErrors.lastName = 'Last name is required and must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.age !== undefined && formData.age !== null) {
      if (formData.age < 0 || formData.age > 99) {
        newErrors.age = 'Age must be single or double digit (0-99)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await dispatch(saveProfile(formData) as any);
      if (saveProfile.fulfilled.match(result)) {
        if (formData.id) {
          dispatch(setCurrentProfile(formData.id));
        }
        navigate('/profile');
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? (value ? parseInt(value) : undefined) : value,
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditing ? 'Edit Profile' : 'Create Profile'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Age (Optional)"
            name="age"
            type="number"
            value={formData.age || ''}
            onChange={handleChange}
            error={!!errors.age}
            helperText={errors.age || 'Must be single or double digit (0-99)'}
            margin="normal"
            inputProps={{ min: 0, max: 99 }}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Save Profile'}
            </Button>
            
            {isEditing ? (
              <Button
                variant="outlined"
                onClick={() => navigate('/profile')}
                fullWidth
                size="large"
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={resetForm}
                fullWidth
                size="large"
              >
                Clear
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ProfileForm;