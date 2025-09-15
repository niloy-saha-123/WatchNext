/**
 * ⚠️ ⚠️ ⚠️ WARNING: REFERENCE COMPONENT ONLY ⚠️ ⚠️ ⚠️
 * 
 * @file LoadingDemo.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/components/common/LoadingDemo.jsx
 * @description Demo component to showcase all loading states and spinners
 * 
 * 🚨 DO NOT USE THIS COMPONENT IN PRODUCTION CODE! 🚨
 * 🚨 THIS IS FOR REFERENCE AND TESTING PURPOSES ONLY! 🚨
 * 
 * This component exists solely for:
 * - Visual testing of LoadingSpinner variations
 * - Reference implementation examples
 * - Development and design purposes
 * 
 * To use this component:
 * 1. Uncomment the route in App.jsx
 * 2. Visit /demo in your browser
 * 3. Remember to comment it back when done!
 * 
 * ⚠️ ⚠️ ⚠️ DO NOT MODIFY OR DELETE WITHOUT GOOD REASON ⚠️ ⚠️ ⚠️
 */
import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';

function LoadingDemo() {
  // 🚨 WARNING: This is a demo component for reference only!
  // 🚨 Do not use in production - for testing LoadingSpinner variations
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleButtonDemo = () => {
    setButtonLoading(true);
    // Simulate API call
    setTimeout(() => {
      setButtonLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Loading Spinner Demo</h1>
          <p className="text-slate-300">Preview all loading states and components</p>
        </div>

        {/* Spinner Sizes */}
        <section className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Spinner Sizes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <LoadingSpinner size="small" variant="primary" />
              <p className="text-slate-300 text-sm">Small</p>
            </div>
            <div className="text-center space-y-4">
              <LoadingSpinner size="medium" variant="primary" />
              <p className="text-slate-300 text-sm">Medium</p>
            </div>
            <div className="text-center space-y-4">
              <LoadingSpinner size="large" variant="primary" />
              <p className="text-slate-300 text-sm">Large</p>
            </div>
            <div className="text-center space-y-4">
              <LoadingSpinner size="xl" variant="primary" />
              <p className="text-slate-300 text-sm">Extra Large</p>
            </div>
          </div>
        </section>

        {/* Spinner Variants */}
        <section className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Spinner Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <LoadingSpinner size="large" variant="primary" />
              <p className="text-slate-300 text-sm">Primary (Red)</p>
            </div>
            <div className="text-center space-y-4">
              <LoadingSpinner size="large" variant="secondary" />
              <p className="text-slate-300 text-sm">Secondary (White)</p>
            </div>
            <div className="text-center space-y-4">
              <LoadingSpinner size="large" variant="slate" />
              <p className="text-slate-300 text-sm">Slate (Gray)</p>
            </div>
          </div>
        </section>

        {/* Spinners with Text */}
        <section className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Spinners with Text</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <LoadingSpinner 
                size="large" 
                variant="primary" 
                text="Loading amazing content..." 
              />
            </div>
            <div className="text-center">
              <LoadingSpinner 
                size="medium" 
                variant="secondary" 
                text="Please wait while we fetch your data" 
              />
            </div>
          </div>
        </section>

        {/* Button Loading States */}
        <section className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Button Loading States</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              variant="primary" 
              loading={buttonLoading}
              onClick={handleButtonDemo}
            >
              Click me for demo
            </Button>
            <Button variant="primary" loading={true}>
              Always Loading
            </Button>
            <Button variant="secondary" loading={true}>
              Secondary Loading
            </Button>
            <Button variant="primary" disabled={true}>
              Disabled Button
            </Button>
          </div>
          <p className="text-slate-400 text-sm text-center mt-4">
            Click "Click me for demo" to see 3-second loading simulation
          </p>
        </section>

        {/* Full Screen Loading Example */}
        <section className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Full Screen Loading Layout</h2>
          <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
            <LoadingSpinner 
              size="xl" 
              variant="secondary" 
              text="Loading your personalized dashboard..." 
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoadingDemo;