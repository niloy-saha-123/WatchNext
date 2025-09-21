/**
 * @file useProfileData.js
 * @path /frontend/src/hooks/useProfileData.js
 * @description Custom hook for managing user profile data including detailed stats,
 * favorite genres, and recently watched content. Provides loading states and error handling.
 */
import { useState, useEffect } from 'react';
// import { profileAPI } from '../services/apiClient'; // Will be used when backend is ready

function useProfileData() {
  const [profileData, setProfileData] = useState({
    userInfo: {
      name: '',
      email: '',
      memberSince: '',
      avatar: null
    },
    stats: {
      moviesWatched: 0,
      showsTracked: 0,
      episodesLogged: 0,
      totalHours: 0
    },
    favoriteGenres: [],
    recentlyWatched: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate API call - will be replaced with real API when backend is ready
  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual API call when backend is ready
      // const response = await profileAPI.getUserProfile();
      // setProfileData(response.data);
      
      // For now, just keep the empty state - no random data needed
      // Real user data will come from backend
      
    } catch (err) {
      setError(err.message || 'Failed to load profile data');
      console.error('Error fetching profile data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user info
  const updateUserInfo = async (updates) => {
    try {
      setProfileData(prev => ({
        ...prev,
        userInfo: { ...prev.userInfo, ...updates }
      }));
      
      // TODO: API call to update user info
      // await profileAPI.updateUserInfo(updates);
      
    } catch (err) {
      setError(err.message || 'Failed to update user info');
      console.error('Error updating user info:', err);
    }
  };

  // Refresh profile data
  const refreshProfile = () => {
    fetchProfileData();
  };

  // Don't auto-fetch data - let the user see empty state
  useEffect(() => {
    // When backend is ready, uncomment the line below:
    // fetchProfileData();
  }, []);

  return {
    profileData,
    isLoading,
    error,
    updateUserInfo,
    refreshProfile
  };
}

export default useProfileData;