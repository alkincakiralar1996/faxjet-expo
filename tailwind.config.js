/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        green: {
          900: '#0F3D2E',
          700: '#1B5E47',
          500: '#2E8B5E',
          100: '#E8F5EF',
        },
        amber: {
          500: '#FFB020',
          100: '#FFF4DD',
        },
        ink: {
          DEFAULT: '#0A0A0A',
        },
        gray: {
          700: '#3F3F46',
          500: '#6B7280',
          300: '#D1D5DB',
          100: '#F3F4F6',
          50: '#FAFAF7',
        },
        success: '#10B981',
        error: '#DC2626',
        errorBg: '#FEE2E2',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      fontFamily: {
        sans: ['System'],
        inter: ['Inter'],
        mono: ['SpaceMono'],
      },
      fontSize: {
        display: ['34px', { lineHeight: '40px', letterSpacing: '-0.68px', fontWeight: '700' }],
        'title-1': ['28px', { lineHeight: '34px', letterSpacing: '-0.56px', fontWeight: '700' }],
        'title-2': ['22px', { lineHeight: '28px', letterSpacing: '-0.22px', fontWeight: '600' }],
        'title-3': ['17px', { lineHeight: '22px', letterSpacing: '-0.17px', fontWeight: '600' }],
        body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-bold': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        callout: ['15px', { lineHeight: '20px', fontWeight: '400' }],
        caption: ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'caption-bold': ['13px', { lineHeight: '18px', fontWeight: '600' }],
        footnote: ['11px', { lineHeight: '14px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};
