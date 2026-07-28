import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        secondary: '#00E5FF',
        bg: '#050816',
        card: '#111827',
        txt: '#F8FAFC'
      },
      fontFamily: {
        sans: ['"Space Grotesk"','system-ui','sans-serif'],
        mono: ['"JetBrains Mono"','monospace']
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg,#6C63FF,#00E5FF)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.8s ease forwards'
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          from: { 'text-shadow': '0 0 10px #6C63FF,0 0 20px #6C63FF' },
          to: { 'text-shadow': '0 0 20px #00E5FF,0 0 40px #00E5FF' }
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        }
      }
    }
  },
  plugins: []
} satisfies Config
