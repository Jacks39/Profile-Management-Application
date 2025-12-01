// Mock API that communicates with Express backend
// Falls back to localStorage if API is unavailable
const API_URL = 'http://localhost:5000/api';
const API_TIMEOUT = 3000; // 3 seconds timeout

const isApiAvailable = async () => {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(API_TIMEOUT),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const mockApi = {
  async getProfile() {
    try {
      const available = await isApiAvailable();
      
      if (available) {
        const response = await fetch(`${API_URL}/profiles`);
        if (!response.ok) throw new Error('Failed to fetch profiles');
        const data = await response.json();
        return data.data;
      } else {
        // Fallback to localStorage
        const profiles = localStorage.getItem('profiles');
        return profiles ? JSON.parse(profiles) : [];
      }
    } catch (error) {
      console.warn('API unavailable, falling back to localStorage:', error);
      // Fallback to localStorage
      const profiles = localStorage.getItem('profiles');
      return profiles ? JSON.parse(profiles) : [];
    }
  },

  async saveProfile(profileData: any) {
    try {
      const available = await isApiAvailable();
      
      if (available) {
        const hasId = profileData.id && profileData.id !== '';
        const url = hasId ? `${API_URL}/profiles/${profileData.id}` : `${API_URL}/profiles`;
        const method = hasId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            age: profileData.age,
          }),
          signal: AbortSignal.timeout(API_TIMEOUT),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save profile');
        }

        const data = await response.json();
        return data.data;
      } else {
        // Fallback to localStorage
        return this.saveProfileToLocalStorage(profileData);
      }
    } catch (error) {
      console.warn('API unavailable, saving to localStorage:', error);
      // Fallback to localStorage
      return this.saveProfileToLocalStorage(profileData);
    }
  },

  saveProfileToLocalStorage(profileData: any) {
    // Get existing profiles array
    const existingProfiles = localStorage.getItem('profiles');
    let profiles = existingProfiles ? JSON.parse(existingProfiles) : [];
    
    // Generate ID if not present
    const profileWithId = { 
      ...profileData, 
      id: profileData.id || Date.now().toString() 
    };
    
    // Check if updating existing profile
    const existingIndex = profiles.findIndex((p: any) => p.id === profileWithId.id);
    if (existingIndex >= 0) {
      // Update existing profile
      profiles[existingIndex] = profileWithId;
    } else {
      // Add new profile
      profiles.push(profileWithId);
    }
    
    // Save updated profiles array
    localStorage.setItem('profiles', JSON.stringify(profiles));
    
    return profileWithId;
  },

  async deleteProfile(profileId: string) {
    try {
      const available = await isApiAvailable();
      
      if (available) {
        const response = await fetch(`${API_URL}/profiles/${profileId}`, {
          method: 'DELETE',
          signal: AbortSignal.timeout(API_TIMEOUT),
        });

        if (!response.ok) throw new Error('Failed to delete profile');
        const data = await response.json();
        return data;
      } else {
        // Fallback to localStorage
        return this.deleteProfileFromLocalStorage(profileId);
      }
    } catch (error) {
      console.warn('API unavailable, deleting from localStorage:', error);
      // Fallback to localStorage
      return this.deleteProfileFromLocalStorage(profileId);
    }
  },

  deleteProfileFromLocalStorage(profileId: string) {
    const existingProfiles = localStorage.getItem('profiles');
    let profiles = existingProfiles ? JSON.parse(existingProfiles) : [];
    
    profiles = profiles.filter((p: any) => p.id !== profileId);
    
    localStorage.setItem('profiles', JSON.stringify(profiles));
    return { success: true };
  },
};
