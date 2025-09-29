/**
 * @file HeroSection.jsx
 * @path /frontend/src/components/sections/HeroSection.jsx
 * @description Main "above the fold" content for the landing page.
 * Designed to grab attention with strong headline and clear call-to-action,
 * all set against the dynamic poster grid.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common';
import { AnimatedPosterGrid } from '.';

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center pt-24">
      {/* Animated background component */}
      <AnimatedPosterGrid />
      
      <div className="relative z-10 p-4 space-y-8 mt-16">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter leading-tight">
          Never Lose Track of a Show Again.
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white font-semibold">
          WatchNext is your personal, automated tracker for every movie and series you love. Log what you've seen, and we'll tell you what's next.
        </p>
        <div className="pt-4">
          <Link to="/signup">
            <Button variant="primary" theme="red">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
