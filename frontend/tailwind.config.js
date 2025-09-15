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
      // Register the custom animations so they can be used as utility classes
      animation: {
        'marquee-left': 'marquee-left 60s linear infinite',
        'marquee-right': 'marquee-right 60s linear infinite',
      },
      // Define the keyframes for the animations to be used by the animation utility
      keyframes: {
        'marquee-left': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      }
    },
  },
  plugins: [],
}

