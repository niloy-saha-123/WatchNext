/**
 * @file useUserStats.js
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/hooks/useUserStats.js
 * @description Custom hook to manage user statistics (movies, shows, watch time)
 * This hook will handle API calls to backend and state management
 */
import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { userStatsAPI } from '../services/apiService';

export const useUserStats = () => {
  // State to store user statistics
  const [stats, setStats] = useState({
    moviesWatched: 0,
    showsTracked: 0,
    totalHours: 0,
    loading: true,
    error: null
  });

  // Function to fetch stats from backend
  const fetchUserStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      // TODO: Uncomment when backend is ready
      // const data = await userStatsAPI.getStats();
      // setStats(prev => ({ ...prev, ...data, loading: false }));
      
      // Simulate API call with mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      
      const mockData = {
        moviesWatched: 0, // Start with 0, will be dynamic from backend
        showsTracked: 0,  // Start with 0, will be dynamic from backend  
        totalHours: 0     // Start with 0, will be dynamic from backend
      };

      setStats(prev => ({
        ...prev,
        ...mockData,
        loading: false
      }));

    } catch (error) {
      console.error('Error fetching user stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Function to update a specific stat (when user adds/removes content)
  const updateStat = async (statType, newValue) => {
    try {
      // Optimistically update UI first (for better UX)
      setStats(prev => ({
        ...prev,
        [statType]: newValue
      }));

      // TODO: Uncomment when backend is ready
      // await userStatsAPI.updateStat(statType, newValue);

      console.log(`Updated ${statType} to ${newValue}`); // For now, just log

    } catch (error) {
      console.error('Error updating stat:', error);
      // Revert optimistic update on error
      fetchUserStats();
    }
  };

  // Function to increment a stat (helper for common use case)
  const incrementStat = (statType, amount = 1) => {
    const newValue = stats[statType] + amount;
    updateStat(statType, newValue);
  };

  // Fetch stats when component mounts
  useEffect(() => {
    fetchUserStats();
  }, []);

  return {
    stats,
    fetchUserStats,
    updateStat,
    incrementStat,
    isLoading: stats.loading,
    error: stats.error
  };
};