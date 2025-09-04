/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(210 40% 25%)",
        accent: "hsl(180 60% 45%)",
        surface: "hsl(0 0% 100%)",
        bg: "hsl(210 30% 95%)",
      },
      borderRadius: {
        lg: "16px",
        md: "10px",
        sm: "6px",
      },
      boxShadow: {
        card: "0 8px 24px hsla(0,0%,0%,0.08)",
      },
      spacing: {
        lg: "20px",
        md: "12px",
        sm: "8px",
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}