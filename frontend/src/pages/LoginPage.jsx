/**
 * @file LoginPage.jsx
 * @path frontend/src/pages/LoginPage.jsx
 * @description Login page with minimalist red theme and responsive design.
 * Includes email/password authentication with smooth transitions and validation.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../components/layout';
import { Input } from '../components/forms';
import { Button } from '../components/common';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear previous errors
    setErrors({});

    try {
      const result = await login(formData.email, formData.password, remember);
      
      if (result.success) {
        // Redirect to the page user was trying to access, or dashboard by default
        navigate(from, { replace: true });
      } else {
        setErrors({ general: result.error || 'Login failed. Please try again.' });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
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
          showPasswordToggle={true}
          isPasswordVisible={showPassword}
          onPasswordToggle={togglePasswordVisibility}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-600 rounded bg-slate-800"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
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