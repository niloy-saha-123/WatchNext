/**
 * @file SignupPage.jsx
 * @path frontend/src/pages/SignupPage.jsx
 * @description Signup page with required fields (name, email, birthday, phone) and minimalist red theme.
 * Includes comprehensive form validation and responsive design for all device sizes.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../components/layout';
import { Input } from '../components/forms';
import DatePicker from '../components/forms/DatePicker';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before being redirected to signup
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

  // Calculate age from birthday
  const calculateAge = (birthday) => {
    if (!birthday) return null;
    
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Check if age is less than 13
  const isAgeBelow13 = formData.birthday && calculateAge(formData.birthday) < 13;

  // Handle password visibility - only one can be visible at a time
  const togglePasswordVisibility = () => {
    if (!showPassword) {
      // Show password, hide confirm
      setShowPassword(true);
      setShowConfirmPassword(false);
    } else {
      // Hide password
      setShowPassword(false);
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    if (!showConfirmPassword) {
      // Show confirm password, hide password
      setShowConfirmPassword(true);
      setShowPassword(false);
    } else {
      // Hide confirm password
      setShowConfirmPassword(false);
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
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      }
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
        // Redirect to the page user was trying to access, or dashboard by default
        navigate(from, { replace: true });
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

        <div>
          <div className="relative">
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
              showPasswordToggle={true}
              isPasswordVisible={showPassword}
              onPasswordToggle={togglePasswordVisibility}
            />
          </div>
          
          {/* Password Requirements with better styling */}
          {formData.password && (
            <div className="mt-3 p-3 bg-slate-800/20 rounded-lg border border-slate-700/30">
              <p className="text-xs font-medium text-slate-300 mb-2">Password requirements:</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  {formData.password.length >= 8 ? (
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-xs ${formData.password.length >= 8 ? 'text-green-400' : 'text-red-400'}`}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/(?=.*[a-z])/.test(formData.password) ? (
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-xs ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                    At least 1 lowercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/(?=.*[A-Z])/.test(formData.password) ? (
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-xs ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                    At least 1 uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/(?=.*\d)/.test(formData.password) ? (
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-xs ${/(?=.*\d)/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                    At least 1 number
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={errors.confirmPassword || (formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : '')}
            showPasswordToggle={true}
            isPasswordVisible={showConfirmPassword}
            onPasswordToggle={toggleConfirmPasswordVisibility}
          />
        </div>

        <div>
          <DatePicker
            id="birthday"
            name="birthday"
            label="Birthday (Must be 13+ years old)"
            value={formData.birthday}
            onChange={handleChange}
            required
            error={errors.birthday}
          />
          <p className={`text-xs mt-1 ${isAgeBelow13 ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
            You must be at least 13 years old to create an account
            {isAgeBelow13 && ' - Your age is below 13'}
          </p>
        </div>

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