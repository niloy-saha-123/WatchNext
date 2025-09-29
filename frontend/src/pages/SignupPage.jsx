/**
 * @file SignupPage.jsx
 * @path frontend/src/pages/SignupPage.jsx
 * @description Signup page with required fields (name, email, birthday, phone) and minimalist red theme.
 * Includes comprehensive form validation and responsive design for all device sizes.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../components/layout';
import { Input } from '../components/forms';
import { Button } from '../components/common';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({});
  const { register, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (!formData.birthday) newErrors.birthday = 'Birthday is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Password confirmation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Age validation (must be 13+)
    if (formData.birthday) {
      const today = new Date();
      const birthDate = new Date(formData.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 13) {
        newErrors.birthday = 'You must be at least 13 years old to sign up';
      }
    }
    
    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear previous errors
    setErrors({});

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        birthday: formData.birthday,
        phone: formData.phone || undefined
      });
      
      if (result.success) {
        // Redirect to dashboard on successful registration
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error || 'Registration failed. Please try again.' });
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    }
  };

  return (
    <AuthLayout 
      title="Join WatchNext" 
      subtitle="Create your account to start tracking"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <Input
          type="text"
          id="name"
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
          error={errors.name}
        />

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="password"
            id="password"
            name="password"
            label="Password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
            error={errors.password}
          />

          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={errors.confirmPassword}
          />
        </div>

        <Input
          type="date"
          id="birthday"
          name="birthday"
          label="Birthday"
          value={formData.birthday}
          onChange={handleChange}
          required
          error={errors.birthday}
        />

        <Input
          type="tel"
          id="phone"
          name="phone"
          label="Phone Number"
          placeholder="Enter your phone number (optional)"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            required
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-600 rounded bg-slate-800"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-slate-300">
            I agree to the{' '}
            <Link to="/terms" className="text-red-300 hover:text-red-200 transition-colors duration-300">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-red-300 hover:text-red-200 transition-colors duration-300">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          theme="red"
          loading={isLoading}
          className="w-full"
        >
          Create Account
        </Button>

        <div className="text-center">
          <p className="text-slate-300">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-red-300 hover:text-red-200 transition-colors duration-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default SignupPage;