/**
 * @file HeroSection.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/components/HeroSection.jsx
 * @description This is the main "above the fold" content for the landing page.
 * It's designed to grab the user's attention with a strong headline
 * and a clear call-to-action, all set against the dynamic poster grid.
 */
import React from 'react';
import Button from './Button';
import AnimatedPosterGrid from './AnimatedPosterGrid';

function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden pt-16">
      {/* The animated background component */}
      <AnimatedPosterGrid />
      
      <div className="relative z-10 p-4 space-y-8 mt-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter leading-tight">
          Never Lose Track of a Show Again.
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300">
          WatchNext is your personal, automated tracker for every movie and series you love. Log what you've seen, and we'll tell you what's next.
        </p>
        <div className="pt-6">
          <Button onClick={() => console.log('Navigate to Auth Page')} variant="primary">
            Get Started for Free
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
