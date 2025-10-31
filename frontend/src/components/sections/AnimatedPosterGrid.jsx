/**
 * @file AnimatedPosterGrid.jsx
 * @path /frontend/src/components/sections/AnimatedPosterGrid.jsx
 * @description Creates infinite scrolling poster carousel with two rows.
 * Top row scrolls right, bottom row scrolls left. Uses real TMDB data for movie and TV show posters.
 * No visible restart or jerking - continuous merry-go-round effect.
 */
import React, { useState, useEffect } from 'react';
import { getFeaturedContent, formatPosterGridData } from '../../utils/movieData';
import { getImageUrl } from '../../utils/imageUtils';
import { LoadingSpinner } from '../common';

function AnimatedPosterGrid() {
  const [content, setContent] = useState({ topRow: [], bottomRow: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedContent();
        const formattedData = formatPosterGridData(data.movies, data.tvShows);
        // Ensure enough items to create a seamless loop (avoid visible gaps)
        const ensureMinItems = (items, min = 14) => {
          if (!Array.isArray(items) || items.length === 0) return [];
          const out = [...items];
          while (out.length < min) {
            out.push(...items);
          }
          return out.slice(0, Math.max(min, out.length));
        };

        const paddedTop = ensureMinItems(formattedData.topRow, 16);
        const paddedBottom = ensureMinItems(formattedData.bottomRow, 16);
        setContent({ topRow: paddedTop, bottomRow: paddedBottom });
      } catch (err) {
        console.error('Error loading movie data:', err);
        setError(err.message);
        // Use fallback static data if API fails
        const fallbackData = {
          topRow: Array(10).fill(null).map((_, index) => ({
            id: `fallback-top-${index}`,
            title: `Movie ${index + 1}`,
            posterPath: null,
            type: 'movie'
          })),
          bottomRow: Array(10).fill(null).map((_, index) => ({
            id: `fallback-bottom-${index}`,
            title: `TV Show ${index + 1}`,
            posterPath: null,
            type: 'tv'
          }))
        };
        setContent(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Render poster item
  const renderPoster = (item, index, prefix) => {
    const posterUrl = item.posterPath ? getImageUrl(item.posterPath, 'w342') : null;
    
    return (
      <div key={`${prefix}-${item.id ?? index}`} className="flex-shrink-0 w-[342px] h-[513px]">
        {posterUrl ? (
          <img 
            src={posterUrl}
            srcSet={`${getImageUrl(item.posterPath, 'w185')} 185w, ${getImageUrl(item.posterPath, 'w342')} 342w, ${getImageUrl(item.posterPath, 'w500')} 500w`}
            sizes="(max-width: 768px) 50vw, 342px"
            alt={item.title}
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-700/10">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-white font-medium text-sm">{item.title}</p>
              <p className="text-slate-400 text-xs mt-1">{item.type === 'movie' ? 'Movie' : 'TV Show'}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner 
            size="xl" 
            variant="secondary" 
            text="Fetching the latest movies and TV shows just for you..."
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl">🎬</div>
            <div className="text-white text-xl">Unable to load movie posters</div>
            <p className="text-slate-400 text-sm max-w-md">
              Don't worry! The app is still fully functional. 
              Movie data will be available once you sign up.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              aria-label="Retry loading movie posters"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      {/* First row positioned right below header */}
      <div className="pt-16">
        <div className="h-[513px] w-full overflow-hidden relative flex">
          {/* First container */}
          <div className="flex-shrink-0 flex animate-scroll">
            {content.topRow.map((item, index) => 
              renderPoster(item, index, 'top-1')
            )}
          </div>
          {/* Duplicate container for seamless loop */}
          <div aria-hidden="true" className="flex-shrink-0 flex animate-scroll">
            {content.topRow.map((item, index) => 
              renderPoster(item, index, 'top-2')
            )}
          </div>
        </div>
        
        {/* Second row right after first row */}
        <div className="h-[513px] w-full overflow-hidden relative flex">
          {/* First container */}
          <div className="flex-shrink-0 flex animate-scroll-reverse">
            {content.bottomRow.map((item, index) => 
              renderPoster(item, index, 'bottom-1')
            )}
          </div>
          {/* Duplicate container for seamless loop */}
          <div aria-hidden="true" className="flex-shrink-0 flex animate-scroll-reverse">
            {content.bottomRow.map((item, index) => 
              renderPoster(item, index, 'bottom-2')
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimatedPosterGrid;

