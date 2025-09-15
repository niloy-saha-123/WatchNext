/**
 * @file AnimatedPosterGrid.jsx
 * @path /frontend/src/components/AnimatedPosterGrid.jsx
 * @description This component creates a true infinite scrolling poster carousel with two rows.
 * Top row scrolls right, bottom row scrolls left. Uses CSS transforms for seamless looping.
 * No visible restart or jerking - continuous merry-go-round effect.
 */
import React from 'react';

// Generate movie data for the carousel
const generateMovies = () => {
  const movieTitles = [
    'Oppenheimer', 'Inception', 'Interstellar', 'The Matrix', 'Gladiator',
    'Pulp Fiction', 'Parasite', 'Spider-Man', 'Top Gun', 'Dune',
    'Avatar', 'Titanic', 'The Dark Knight', 'Avengers', 'Iron Man',
    'Black Panther', 'Wonder Woman', 'Joker', 'Frozen', 'Moana'
  ];
  
  return movieTitles.map((title, index) => ({
    id: index,
    title: title,
  }));
};

const movies = generateMovies();

function AnimatedPosterGrid() {
  // Simple single set of movies for each row
  const topRowMovies = movies.slice(0, 10);
  const bottomRowMovies = movies.slice(10, 20);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Container for both rows with proper spacing and positioning */}
      <div className="h-full flex flex-col justify-center py-16 pt-24">
        {/* Top Row - scrolls right */}
        <div className="h-[40rem] mb-3 overflow-hidden relative">
          <div className="animate-marquee-right whitespace-nowrap flex">
            {/* Seamless infinite loop without gaps */}
            <div className="flex space-x-3 animate-marquee-right">
              {[...topRowMovies, ...topRowMovies].map((movie, index) => (
                <div key={`top-${index}`} className="flex-shrink-0 w-72 h-[40rem]">
                  <div className="w-full h-full bg-slate-700/20 border border-slate-600/20">
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row - scrolls left */}
        <div className="h-[40rem] overflow-hidden relative">
          <div className="animate-marquee-left whitespace-nowrap flex">
            {/* Seamless infinite loop without gaps */}
            <div className="flex space-x-3 animate-marquee-left">
              {[...bottomRowMovies, ...bottomRowMovies].map((movie, index) => (
                <div key={`bottom-${index}`} className="flex-shrink-0 w-72 h-[40rem]">
                  <div className="w-full h-full bg-slate-700/20 border border-slate-600/20">
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AnimatedPosterGrid;

