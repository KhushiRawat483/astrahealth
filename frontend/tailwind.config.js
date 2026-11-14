/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg: "#071426",
          sidebar: "#0B1C32",
          card: "#10243D",
          cardSecondary: "#142B46",
          cyan: "#27D9E8",
          blue: "#3987FF",
          purple: "#9B8CFF",
          healthy: "#32D69A",
          warning: "#FFB547",
          critical: "#FF5C6C",
          textPrimary: "#F2F7FF",
          textSecondary: "#8FA8C3",
          border: "#1E3A5F",
          borderLight: "#274872"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        glowCyan: "0 0 20px -3px rgba(39, 217, 232, 0.35)",
        glowBlue: "0 0 20px -3px rgba(57, 135, 255, 0.35)",
        glowWarning: "0 0 20px -3px rgba(255, 181, 71, 0.35)",
        glowCritical: "0 0 20px -3px rgba(255, 92, 108, 0.4)",
        card: "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
      },
      animation: {
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        scanline: "scanline 8s linear infinite"
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
