/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./dist/**/*.html",
    "./src/pages/**/*.{html,js}",
    "./src/components/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          50: '#E6EAF4',
          100: '#C2CDE4',
          200: '#7D93C9',
          300: '#4A69B1',
          400: '#2C4B9E',
          500: '#1E3A8A',
          600: '#162C6B',
          700: '#0F1D4D',
          800: '#070F2E',
          900: '#02040F'
        },
        secondary: {
          DEFAULT: '#7C3AED',
          50: '#F3EEFE',
          100: '#E4D7FD',
          200: '#C7ACFB',
          300: '#AA81F9',
          400: '#8D56F7',
          500: '#7C3AED',
          600: '#5F15DA',
          700: '#4810A7',
          800: '#310B74',
          900: '#1A0641'
        },
        success: {
          DEFAULT: '#059669',
          50: '#E6F6F1',
          100: '#B3E6D9',
          200: '#80D6C1',
          300: '#4DC6A9',
          400: '#1AB691',
          500: '#059669',
          600: '#047857',
          700: '#035A45',
          800: '#023C33',
          900: '#011E21'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
