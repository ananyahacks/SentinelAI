/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0E13',
        surface: '#10161F',
        elevated: '#171F2B',
        elevated2: '#1E2836',
        hairline: '#26303F',
        ink: '#E7ECF4',
        muted: '#8B98AC',
        faint: '#5C6980',
        signal: {
          DEFAULT: '#33D6C0',
          dim: '#178376',
          glow: '#33D6C033'
        },
        violet: {
          DEFAULT: '#7C6CFF',
          dim: '#5B4ECC'
        },
        risk: {
          critical: '#FF5D6C',
          high: '#FF8A5B',
          medium: '#F5B942',
          low: '#33D6C0',
          minimal: '#4C5A70'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 40px -20px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(51,214,192,0.25), 0 0 24px rgba(51,214,192,0.15)'
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)'
      },
      keyframes: {
        pulseLine: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 }
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        floatIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        pulseLine: 'pulseLine 2.4s ease-in-out infinite',
        scan: 'scan 3s linear infinite',
        floatIn: 'floatIn 0.4s ease-out both'
      }
    }
  },
  plugins: []
}
