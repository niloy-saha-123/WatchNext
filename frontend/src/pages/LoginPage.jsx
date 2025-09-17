/**
 * @file LoginPage.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/pages/LoginPage.jsx
 * @description Login page with minimalist red theme and responsive design.
 * Features email/password authentication with smooth transitions and validation.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout';
import { Input } from '../components/forms';
import { Button } from '../components/common';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual authentication logic
      console.log('Login attempt:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just log success
      alert('Login functionality will be implemented with backend!');
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your WatchNext account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <Input
          type="email"
          id="email"
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
        />

        <Input
          type="password"
          id="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-600 rounded bg-slate-800"
            />
            <span className="ml-2 text-sm text-slate-300">Remember me</span>
          </label>
          
          <Link 
            to="/forgot-password" 
            className="text-sm text-red-300 hover:text-red-200 transition-colors duration-300"
          >
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          theme="red"
          loading={isLoading}
          className="w-full"
        >
          Sign In
        </Button>

        <div className="text-center">
          <p className="text-slate-300">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-red-300 hover:text-red-200 transition-colors duration-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;