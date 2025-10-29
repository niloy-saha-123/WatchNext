/**
 * @file devAuthHelper.js
 * @description Development helper to quickly create and switch between test accounts
 * Only works in development mode
 */

import { authAPI } from '../services/apiClient';

/**
 * Auto-create and login with a test account for development
 * Test account credentials from environment variables
 */
export const createTestAccount = async (api = authAPI) => {
  // Only work in development
  if (import.meta.env.MODE !== 'development') {
    console.warn('Test account creation only works in development mode');
    return { success: false };
  }

  const testEmail = import.meta.env.VITE_DEV_EMAIL || 'dev@watchnext.com';
  const testPassword = import.meta.env.VITE_DEV_PASSWORD || 'dev123456';

  try {
    // Try to login first (in case account already exists)
    console.log('🔧 Attempting to login with test account...');
    const loginResult = await api.login(testEmail, testPassword);

    if (loginResult.success && loginResult.data?.user) {
      console.log('✅ Logged in with existing test account');
      return { success: true, created: false, user: loginResult.data.user };
    }
    console.log('❌ Login failed, account likely does not exist');
  } catch (error) {
    // Account doesn't exist, create it
    console.log('Account not found, creating test account...', error.message);
  }

  try {
    // Create test account
    console.log('📝 Creating new test account...');
    const signupResult = await api.register({
      name: 'Dev User',
      email: testEmail,
      password: testPassword,
      birthday: '2000-01-01',
      phone: ''
    });

    if (signupResult.success && signupResult.data?.user) {
      console.log('✅ Created and logged in with test account');
      return { success: true, created: true, user: signupResult.data.user };
    }
    console.log('❌ Registration succeeded but no user data returned');
  } catch (error) {
    console.error('❌ Failed to create test account:', error);
    return { success: false, error };
  }
  
  return { success: false };
};

/**
 * Quick login helper for developers
 * Add to browser console for easy access
 */
export const quickDevLogin = async (authAPI) => {
  if (import.meta.env.MODE !== 'development') {
    console.warn('This feature only works in development');
    return;
  }

  await createTestAccount(authAPI || undefined);
};

// Make it accessible from browser console in development
if (import.meta.env.MODE === 'development' && typeof window !== 'undefined') {
  window.quickDevLogin = () => quickDevLogin();
  window.enableDevAutoLogin = () => localStorage.setItem('devAutoLogin', 'true');
  window.disableDevAutoLogin = () => localStorage.removeItem('devAutoLogin');
  console.log('💡 Dev Tips: quickDevLogin(), enableDevAutoLogin(), disableDevAutoLogin()');
}

