/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
            colors: {
              primary: {
                50: '#EFF6FF',
                100: '#DBEAFE',
                200: '#BFDBFE',
                300: '#93C5FD',
                400: '#60A5FA',
                500: '#3B82F6',
                600: '#2563EB',
                700: '#1D4ED8',
                800: '#1E40AF',
                900: '#1E3A8A',
              },
              gray: {
                50: '#F8FAFC',
                100: '#F1F5F9',
                200: '#E2E8F0',
                300: '#CBD5E1',
                400: '#94A3B8',
                500: '#64748B',
                600: '#475569',
                700: '#334155',
                800: '#1E293B',
                900: '#0F172A',
              },
              success: {
                50: '#F0FDF4',
                500: '#22C55E',
                600: '#16A34A',
              },
              warning: {
                50: '#FFFBEB',
                500: '#F59E0B',
                600: '#D97706',
              },
              error: {
                50: '#FEF2F2',
                500: '#EF4444',
                600: '#DC2626',
              },
            },
            fontSize: {
              'display': ['32px', { lineHeight: '40px', fontWeight: '700' }],
              'heading-xl': ['28px', { lineHeight: '36px', fontWeight: '700' }],
              'heading-lg': ['24px', { lineHeight: '32px', fontWeight: '700' }],
              'heading-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
              'heading-sm': ['18px', { lineHeight: '26px', fontWeight: '600' }],
              'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
              'body-md': ['14px', { lineHeight: '22px', fontWeight: '400' }],
              'body-sm': ['13px', { lineHeight: '20px', fontWeight: '400' }],
              'caption': ['12px', { lineHeight: '18px', fontWeight: '400' }],
              'label': ['12px', { lineHeight: '16px', fontWeight: '600' }],
            },
            borderRadius: {
              'xs': '6px',
              'sm': '8px',
              'md': '12px',
              'lg': '16px',
              'xl': '20px',
              '2xl': '24px',
            },
            boxShadow: {
              'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
              'card-hover': '0 4px 12px rgba(0,0,0,0.08)',
              'elevated': '0 8px 24px rgba(0,0,0,0.1)',
              'bottom-nav': '0 -1px 12px rgba(0,0,0,0.06)',
              'button': '0 1px 2px rgba(59,130,246,0.3)',
            },
            maxWidth: {
              'mobile': '430px',
            },
            animation: {
              'fade-in': 'fadeIn 0.3s ease-out',
              'slide-up': 'slideUp 0.4s ease-out',
              'slide-in-right': 'slideInRight 0.3s ease-out',
              'scale-in': 'scaleIn 0.2s ease-out',
              'bounce-soft': 'bounceSoft 0.5s ease-out',
              'shimmer': 'shimmer 2s ease-in-out infinite',
            },
            keyframes: {
              fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
              },
              slideUp: {
                '0%': { opacity: '0', transform: 'translateY(24px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
              },
              slideInRight: {
                '0%': { opacity: '0', transform: 'translateX(24px)' },
                '100%': { opacity: '1', transform: 'translateX(0)' },
              },
              scaleIn: {
                '0%': { opacity: '0', transform: 'scale(0.9)' },
                '100%': { opacity: '1', transform: 'scale(1)' },
              },
              bounceSoft: {
                '0%': { transform: 'scale(0.95)' },
                '50%': { transform: 'scale(1.02)' },
                '100%': { transform: 'scale(1)' },
              },
              shimmer: {
                '0%': { backgroundPosition: '-200% 0' },
                '100%': { backgroundPosition: '200% 0' },
              },
            },
          },
        },
        plugins: [],
      };