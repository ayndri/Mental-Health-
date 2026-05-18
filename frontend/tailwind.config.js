/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#415f83',
          hover: '#344D6E',
          light: '#EAF0FA',
        },
        pink: {
          DEFAULT: '#E596B2',
          hover: '#C97898',
          light: '#FCEEF4',
        },
        green: {
          DEFAULT: '#5BA970',
          hover: '#488A59',
          light: '#EBF6EE',
        },
        bg: {
          DEFAULT: '#F6F8FB',
          card: '#FFFFFF',
          input: '#F2F6FC',
        },
        text: {
          DEFAULT: '#1A2840',
          muted: '#7A8FA8',
        },
        border: {
          DEFAULT: '#D5E0EE',
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 24px 0 rgba(65, 95, 131, 0.08)",
        card: "0 2px 16px 0 rgba(65, 95, 131, 0.08)",
        hover: "0 8px 32px 0 rgba(65, 95, 131, 0.15)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
