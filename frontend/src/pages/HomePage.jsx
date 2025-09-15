/**
 * @file HomePage.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/pages/HomePage.jsx
 * @description This component serves as the main landing page for unauthenticated users.
 * It assembles the various sections (Header, Hero, WhyJoin, Footer)
 * to create a complete, cohesive page.
 */
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import WhyJoinSection from '../components/WhyJoinSection';
import Footer from '../components/Footer';


function HomePage() {
    return (
      // Main page with red-orange-purplish gradient theme and light consistent overlay
      <div className="bg-gradient-to-br from-red-500 via-orange-500 via-purple-600 to-blue-900 relative">
        {/* Light greyish overlay for readability while preserving vibrant colors */}
        <div className="absolute inset-0 bg-slate-900/25 z-0"></div>
        
        {/* Content above the overlay */}
        <div className="relative z-10">
          <Header />
          <main>
            <HeroSection />
            <WhyJoinSection />
          </main>
          <Footer />
        </div>
      </div>
    );
  }

export default HomePage;
