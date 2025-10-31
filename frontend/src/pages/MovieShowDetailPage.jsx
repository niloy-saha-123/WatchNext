/**
 * @file MovieShowDetailPage.jsx
 * @path /frontend/src/pages/MovieShowDetailPage.jsx
 * @description Individual movie/TV show detail page with comprehensive information, cast, ratings, and user actions.
 * Features a hero section with backdrop, detailed information, and interactive elements.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, LoadingSpinner, ErrorMessage, Button } from '../components/common';
import { mediaAPI, bundleAPI } from '../services/apiClient';
import { useWatchData } from '../contexts/WatchDataContext';
import { getImageUrl } from '../utils/imageUtils';

function MovieShowDetailPage() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [mediaData, setMediaData] = useState(null);
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { 
    isWatched, 
    isInWatchlist, 
    getWatchedContent, 
    addWatchedMovie, 
    addWatchedShow, 
    addToWatchlist, 
    removeFromWatchlist,
    updateMovie,
    updateShow,
    saveEpisodeProgress
  } = useWatchData();
  const [showEpisodeTracker, setShowEpisodeTracker] = useState(false);
  const [episodeProgress, setEpisodeProgress] = useState({});
  const [visibleSeasons, setVisibleSeasons] = useState(5); // Show first 5 seasons by default
  const [bundles, setBundles] = useState([]);
  const [selectedBundleId, setSelectedBundleId] = useState('');
  
  // Helpers to read real per-season episode counts from TMDB details
  const getEpisodeCountForSeason = (seasonNumber) => {
    const season = mediaData?.seasons?.find(s => s.season_number === seasonNumber);
    return season?.episode_count || 0;
  };
  
  // Get current watch data
  const currentWatchData = getWatchedContent(id, type);
  const currentRating = currentWatchData?.rating || null;
  const currentNotes = currentWatchData?.notes || '';

  // Load existing watch data when component mounts
  useEffect(() => {
    if (mediaData && id) {
      const existingData = getWatchedContent(id, type);
      if (existingData) {
        if (type === 'tv' && existingData.episodeProgress) {
          setEpisodeProgress(existingData.episodeProgress);
        }
      } else {
        // Reset episode progress for new shows
        setEpisodeProgress({});
      }
      // Always close episode tracker when navigating to new show/movie
      setShowEpisodeTracker(false);
    }
  }, [mediaData, id, type, getWatchedContent]);

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch main media data
        const mediaResponse = await mediaAPI.getDetails(type, id);
        // Ensure media_type is set correctly based on URL parameter
        const mediaDataWithType = {
          ...mediaResponse,
          media_type: type
        };
        setMediaData(mediaDataWithType);

        // Fetch cast data
        const castResponse = await mediaAPI.getCast(type, id);
        setCast(castResponse.cast || []);

        // Fetch recommendations
        const recommendationsResponse = await mediaAPI.getRecommendations(type, id);
        setRecommendations(recommendationsResponse.results || []);

      } catch (err) {
        console.error('Error fetching media data:', err);
        setError('Failed to load movie/show details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id && type) {
      fetchMediaData();
    }
  }, [id, type]);

  // Load bundles for add-to-bundle control
  useEffect(() => {
    const loadBundles = async () => {
      try {
        const resp = await bundleAPI.list();
        setBundles(resp.data || []);
        if ((resp.data || []).length > 0) setSelectedBundleId((resp.data || [])[0]._id);
      } catch (e) {
        // Non-fatal
        console.warn('Failed to load bundles', e);
      }
    };
    loadBundles();
  }, []);

  const handleAddToWatchlist = () => {
    if (!mediaData) return;
    
    if (isInWatchlist(id)) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist(mediaData);
    }
  };

  const handleMarkWatched = () => {
    if (!mediaData) return;
    
    if (mediaData.media_type === 'tv') {
      // For TV shows, show episode tracker
      setShowEpisodeTracker(!showEpisodeTracker);
    } else {
      // For movies, toggle watched status
      if (isWatched(id, type)) {
        // Remove from watched list (this would need additional context method)
        console.log('Remove from watched - implement if needed');
      } else {
        addWatchedMovie(mediaData);
      }
    }
  };

  const handleEpisodeToggle = (seasonNumber, episodeNumber) => {
    const key = `s${seasonNumber}e${episodeNumber}`;
    const isCurrentlyWatched = episodeProgress[key];
    
    if (!isCurrentlyWatched) {
      // If marking as watched, auto-select all previous seasons and episodes
      const newProgress = { ...episodeProgress };
      
      // Mark all previous seasons as fully watched
      for (let prevSeason = 1; prevSeason < seasonNumber; prevSeason++) {
        const prevSeasonEpisodeCount = getEpisodeCountForSeason(prevSeason);
        for (let ep = 1; ep <= prevSeasonEpisodeCount; ep++) {
          const episodeKey = `s${prevSeason}e${ep}`;
          newProgress[episodeKey] = true;
        }
      }
      
      // Mark all episodes up to the clicked episode in current season
      for (let ep = 1; ep <= episodeNumber; ep++) {
        const episodeKey = `s${seasonNumber}e${ep}`;
        newProgress[episodeKey] = true;
      }
      
      setEpisodeProgress(newProgress);
    } else {
      // If unmarking, unselect this episode and all episodes/seasons after it
      const newProgress = { ...episodeProgress };
      
      // Unselect all episodes in the same season after the clicked episode
      const currentSeasonEpisodeCount = getEpisodeCountForSeason(seasonNumber);
      for (let ep = episodeNumber; ep <= currentSeasonEpisodeCount; ep++) {
        const episodeKey = `s${seasonNumber}e${ep}`;
        newProgress[episodeKey] = false;
      }
      
      // Unselect all episodes in all seasons after the current season
      const totalSeasons = mediaData?.number_of_seasons || 1;
      for (let futureSeason = seasonNumber + 1; futureSeason <= totalSeasons; futureSeason++) {
        const futureSeasonEpisodeCount = getEpisodeCountForSeason(futureSeason);
        for (let ep = 1; ep <= futureSeasonEpisodeCount; ep++) {
          const episodeKey = `s${futureSeason}e${ep}`;
          newProgress[episodeKey] = false;
        }
      }
      
      setEpisodeProgress(newProgress);
    }
    // TODO: Implement API call to save episode progress
  };

  const handleSeasonToggle = (seasonNumber) => {
    const episodeCount = getEpisodeCountForSeason(seasonNumber);
    
    // Check if entire season is watched
    const isSeasonWatched = Array.from({ length: episodeCount }, (_, i) => {
      const episodeKey = `s${seasonNumber}e${i + 1}`;
      return episodeProgress[episodeKey];
    }).every(watched => watched);

    const newProgress = { ...episodeProgress };

    if (!isSeasonWatched) {
      // If marking season as watched, also mark all previous seasons
      for (let prevSeason = 1; prevSeason <= seasonNumber; prevSeason++) {
        const prevSeasonEpisodeCount = getEpisodeCountForSeason(prevSeason);
        for (let ep = 1; ep <= prevSeasonEpisodeCount; ep++) {
          const episodeKey = `s${prevSeason}e${ep}`;
          newProgress[episodeKey] = true;
        }
      }
    } else {
      // If unmarking season, unmark this season and all seasons after it
      const totalSeasons = mediaData?.number_of_seasons || 1;
      
      for (let unmarkSeason = seasonNumber; unmarkSeason <= totalSeasons; unmarkSeason++) {
        const unmarkSeasonEpisodeCount = getEpisodeCountForSeason(unmarkSeason);
        for (let ep = 1; ep <= unmarkSeasonEpisodeCount; ep++) {
          const episodeKey = `s${unmarkSeason}e${ep}`;
          newProgress[episodeKey] = false;
        }
      }
    }

    setEpisodeProgress(newProgress);
    // TODO: Implement API call to save episode progress
  };

  const getWatchedEpisodeCount = () => {
    return Object.values(episodeProgress).filter(watched => watched).length;
  };

  const getTotalEpisodeCount = () => {
    if (!mediaData || mediaData.media_type !== 'tv') return 0;
    return (mediaData.seasons || []).reduce((sum, s) => sum + (s.episode_count || 0), 0);
  };

  const handleLoadMoreSeasons = () => {
    setVisibleSeasons(prev => prev + 5);
  };

  const handleRatingChange = (rating) => {
    if (type === 'movie') {
      updateMovie(id, { rating });
    } else if (type === 'tv') {
      updateShow(id, { rating });
    }
  };

  const handleNotesChange = (notes) => {
    if (type === 'movie') {
      updateMovie(id, { notes });
    } else if (type === 'tv') {
      updateShow(id, { notes });
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getGenreNames = (genres) => {
    if (!genres || !Array.isArray(genres)) return 'N/A';
    return genres.map(genre => genre.name).join(', ');
  };

  const getProductionCompanies = (companies) => {
    if (!companies || !Array.isArray(companies)) return 'N/A';
    return companies.map(company => company.name).join(', ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <LoadingSpinner size="large" variant="primary" text="Loading movie details..." />
        </div>
      </div>
    );
  }

  if (error || !mediaData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <ErrorMessage message={error || 'Movie/show not found'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section with Backdrop */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        {mediaData.backdrop_path ? (
          <div className="absolute inset-0">
            <img
              src={getImageUrl(mediaData.backdrop_path, 'w1280')}
              alt={mediaData.title || mediaData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-purple-600" />
        )}
        
        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="max-w-4xl">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                {mediaData.title || mediaData.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6">
                <span className="text-lg">
                  {formatDate(mediaData.release_date || mediaData.first_air_date)}
                </span>
                <span className="text-lg">•</span>
                <span className="text-lg">
                  {mediaData.media_type === 'movie' ? 'Movie' : 'TV Show'}
                </span>
                <span className="text-lg">•</span>
                <span className="text-lg">
                  {mediaData.media_type === 'movie' 
                    ? formatRuntime(mediaData.runtime)
                    : `${mediaData.number_of_seasons} Season${mediaData.number_of_seasons !== 1 ? 's' : ''}`
                  }
                </span>
                <span className="text-lg">•</span>
                <span className="text-lg">
                  ⭐ {mediaData.vote_average?.toFixed(1) || 'N/A'}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {mediaData.genres?.map(genre => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-white/90 text-lg leading-relaxed max-w-3xl">
                {mediaData.overview}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* User Actions */}
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">My Watch Status</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Button
                    onClick={handleAddToWatchlist}
                    variant={isInWatchlist(id) ? 'primary' : 'outline'}
                    className={`w-full ${
                      isInWatchlist(id)
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white border-0'
                        : ''
                    }`}
                  >
                    {isInWatchlist(id) ? '✓ Added to Watchlist' : '+ Add to Watchlist'}
                  </Button>
                  
                  <Button
                    onClick={handleMarkWatched}
                    variant={isWatched(id, type) ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {showEpisodeTracker ? 'Hide Episode Tracker' : 'Mark as Watched'}
                  </Button>
                </div>

              {/* Add to Bundle */}
              {bundles.length > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <select
                    value={selectedBundleId}
                    onChange={(e) => setSelectedBundleId(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {bundles.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                  <Button
                    onClick={async () => {
                      if (!selectedBundleId || !mediaData) return;
                      const item = {
                        mediaId: Number(id),
                        mediaType: type,
                        title: mediaData.title,
                        name: mediaData.name,
                        posterPath: mediaData.poster_path,
                        backdropPath: mediaData.backdrop_path,
                        releaseDate: mediaData.release_date,
                        firstAirDate: mediaData.first_air_date,
                        voteAverage: mediaData.vote_average
                      };
                      await bundleAPI.addItem(selectedBundleId, item);
                    }}
                    variant="outline"
                  >
                    Add to Bundle
                  </Button>
                </div>
              )}

                {/* Rating - Only show if watched */}
                {isWatched(id, type) && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      My Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => handleRatingChange(star)}
                          className={`text-2xl transition-colors ${
                            star <= (currentRating || 0)
                              ? 'text-yellow-400'
                              : 'text-slate-300 hover:text-yellow-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personal Notes - Only show if watched */}
                {isWatched(id, type) && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Personal Notes
                    </label>
                    <textarea
                      value={currentNotes}
                      onChange={(e) => handleNotesChange(e.target.value)}
                      placeholder="Add your personal notes about this movie/show..."
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                )}

                {/* Episode Tracker for TV Shows */}
                {showEpisodeTracker && mediaData && mediaData.media_type === 'tv' && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-slate-900">Episode Progress</h4>
                      <span className="text-sm text-slate-600">
                        {getWatchedEpisodeCount()} episodes watched
                      </span>
                    </div>
                    
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {/* Generate episodes for all seasons */}
                      {Array.from({ length: Math.min(mediaData.number_of_seasons || 1, visibleSeasons) }, (_, seasonIndex) => {
                        const seasonNumber = seasonIndex + 1;
                        const episodeCount = getEpisodeCountForSeason(seasonNumber);
                        
                        return (
                          <div key={seasonNumber} className="border border-slate-200 rounded-lg p-3">
                            <div className="flex items-center gap-3 mb-2">
                              <button
                                onClick={() => handleSeasonToggle(seasonNumber)}
                                className="flex items-center justify-center w-5 h-5 border-2 rounded-full transition-colors"
                                style={{
                                  borderColor: Array.from({ length: episodeCount }, (_, i) => {
                                    const episodeKey = `s${seasonNumber}e${i + 1}`;
                                    return episodeProgress[episodeKey];
                                  }).every(watched => watched) ? '#10b981' : '#d1d5db',
                                  backgroundColor: Array.from({ length: episodeCount }, (_, i) => {
                                    const episodeKey = `s${seasonNumber}e${i + 1}`;
                                    return episodeProgress[episodeKey];
                                  }).every(watched => watched) ? '#10b981' : 'transparent'
                                }}
                              >
                                {Array.from({ length: episodeCount }, (_, i) => {
                                  const episodeKey = `s${seasonNumber}e${i + 1}`;
                                  return episodeProgress[episodeKey];
                                }).every(watched => watched) && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                              <h5 className="font-medium text-slate-900">Season {seasonNumber}</h5>
                            </div>
                            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                              {Array.from({ length: Math.min(episodeCount, 30) }, (_, episodeIndex) => {
                                const episodeNumber = episodeIndex + 1;
                                const isWatched = episodeProgress[`s${seasonNumber}e${episodeNumber}`];
                                
                                return (
                                  <button
                                    key={episodeNumber}
                                    onClick={() => handleEpisodeToggle(seasonNumber, episodeNumber)}
                                    className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                                      isWatched
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                                    }`}
                                    title={`Season ${seasonNumber}, Episode ${episodeNumber}`}
                                  >
                                    {episodeNumber}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Load More Seasons Button */}
                      {mediaData.number_of_seasons > visibleSeasons && (
                        <div className="text-center py-4">
                          <button
                            onClick={handleLoadMoreSeasons}
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Load More Seasons ({Math.min(5, mediaData.number_of_seasons - visibleSeasons)} more)
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <Button
                        onClick={async () => {
                          const watchedCount = getWatchedEpisodeCount();
                          const totalCount = getTotalEpisodeCount();
                          const isFullyWatched = watchedCount === totalCount;
                          
                          setShowEpisodeTracker(false);
                          
                          if (watchedCount > 0) {
                            // Add/update TV show in watched list
                            await addWatchedShow({
                              ...mediaData,
                              episodeProgress,
                              watched: true
                            });
                            try {
                              await saveEpisodeProgress(id, {
                                showName: mediaData.name || mediaData.title,
                                episodeProgress,
                                totalSeasons: mediaData.number_of_seasons || 1,
                                totalEpisodes: totalCount
                              });
                            } catch (e) {
                              // saving progress failed; continue
                            }
                            
                            // Auto-add to watchlist if not fully watched
                            if (!isFullyWatched && !isInWatchlist(id)) {
                              await addToWatchlist(mediaData);
                            }
                            // Persist episode progress to backend and refresh
                            await saveEpisodeProgress(id, episodeProgress);
                          }
                        }}
                        variant="primary"
                        className="w-full"
                      >
                        Save Progress
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cast */}
              {cast.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Cast</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cast.slice(0, 8).map(person => (
                      <div key={person.id} className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-slate-200">
                          {person.profile_path ? (
                            <img
                              src={getImageUrl(person.profile_path, 'w185')}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-900">{person.name}</p>
                        <p className="text-xs text-slate-600">{person.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">More Like This</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recommendations.slice(0, 8).map(item => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/${item.media_type || type}/${item.id}`)}
                        className="cursor-pointer group"
                      >
                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-slate-200 mb-2">
                          {item.poster_path ? (
                            <img
                              src={getImageUrl(item.poster_path, 'w185')}
                              alt={item.title || item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-900 group-hover:text-red-500 transition-colors">
                          {item.title || item.name}
                        </p>
                        <p className="text-xs text-slate-600">
                          ⭐ {item.vote_average?.toFixed(1) || 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Poster */}
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-slate-200 mb-4">
                  {mediaData.poster_path ? (
                    <img
                      src={getImageUrl(mediaData.poster_path, 'w500')}
                      alt={mediaData.title || mediaData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-900 mb-2">
                    {mediaData.title || mediaData.name}
                  </p>
                  <p className="text-sm text-slate-600">
                    {mediaData.media_type === 'movie' ? 'Movie' : 'TV Show'}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Details</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-slate-700">Release Date:</span>
                    <span className="ml-2 text-slate-600">
                      {formatDate(mediaData.release_date || mediaData.first_air_date)}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-slate-700">Runtime:</span>
                    <span className="ml-2 text-slate-600">
                      {mediaData.media_type === 'movie' 
                        ? formatRuntime(mediaData.runtime)
                        : `${mediaData.number_of_seasons} Season${mediaData.number_of_seasons !== 1 ? 's' : ''}`
                      }
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-slate-700">Rating:</span>
                    <span className="ml-2 text-slate-600">
                      ⭐ {mediaData.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-slate-700">Genres:</span>
                    <span className="ml-2 text-slate-600">
                      {getGenreNames(mediaData.genres)}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-slate-700">Production:</span>
                    <span className="ml-2 text-slate-600">
                      {getProductionCompanies(mediaData.production_companies)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MovieShowDetailPage;
