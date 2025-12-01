import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile, ProfileState } from '../types/profile';
import { mockApi } from '../utils/mockApi';

const initialState: ProfileState = {
  profiles: [],
  currentProfileId: null,
  loading: false,
  error: null,
};

export const saveProfile = createAsyncThunk(
  'profile/saveProfile',
  async (profileData: Profile) => {
    const response = await mockApi.saveProfile(profileData);
    return response;
  }
);

export const fetchProfiles = createAsyncThunk(
  'profile/fetchProfiles',
  async () => {
    // Fetch all profiles from API
    const response = await mockApi.getProfile();
    return Array.isArray(response) ? response : [];
  }
);

export const deleteProfile = createAsyncThunk(
  'profile/deleteProfile',
  async (profileId: string) => {
    await mockApi.deleteProfile(profileId);
    return profileId;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCurrentProfile: (state, action: PayloadAction<string>) => {
      state.currentProfileId = action.payload;
    },
    clearProfile: (state) => {
      state.currentProfileId = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.profiles.findIndex(p => p.id === action.payload.id);
        if (existingIndex >= 0) {
          state.profiles[existingIndex] = action.payload;
        } else {
          state.profiles.push(action.payload);
        }
        state.currentProfileId = action.payload.id || state.profiles[state.profiles.length - 1].id;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save profile';
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.profiles = action.payload;
        if (state.profiles.length > 0 && !state.currentProfileId) {
          state.currentProfileId = state.profiles[0].id || '';
        }
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch profiles';
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.profiles = state.profiles.filter(p => p.id !== action.payload);
        if (state.currentProfileId === action.payload) {
          state.currentProfileId = state.profiles.length > 0 ? state.profiles[0].id || null : null;
        }
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete profile';
      });
  },
});

export const { setCurrentProfile, clearProfile, clearError } = profileSlice.actions;
export default profileSlice.reducer;