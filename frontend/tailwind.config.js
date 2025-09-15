/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define your custom theme colors here
      colors: {
        // Updated to a more vibrant, reddish color
        'brand-red': '#dc2626',
      },
      // Set Inter as the default font family
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'brand': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // Register the custom animations using CodePen pattern
      animation: {
        'scroll': 'scroll 60s linear infinite',
        'scroll-reverse': 'scroll-reverse 60s linear infinite',
      },
      // Define the keyframes using CodePen pattern
      keyframes: {
        'scroll': {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-100%)' },
        },
        'scroll-reverse': {
          'from': { transform: 'translateX(-100%)' },
          'to': { transform: 'translateX(0)' },
        },
      }
    },
  },
  plugins: [],
}

