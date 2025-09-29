/**
 * @file HomePage.jsx
 * @path /frontend/src/pages/HomePage.jsx
 * @description Main landing page component for unauthenticated users.
 * Assembles Header, Hero, WhyJoin, and Footer sections into a complete page.
 */
import React from 'react';
import { Header, Footer } from '../components/common';
import { HeroSection, WhyJoinSection } from '../components/sections';


function HomePage() {
    return (
      // Main page with red-orange-purple gradient theme and consistent overlay
      <div className="bg-gradient-to-br from-red-500 via-orange-500 via-purple-600 to-blue-900 relative">
        {/* Light overlay for readability while preserving vibrant colors */}
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
