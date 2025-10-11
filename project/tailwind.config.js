/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      // Contenedor central y breakpoints de diseño (grid responsive)
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          md: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem'
        },
        screens: {
          sm: '640px',   // mobile grande
          md: '768px',   // tablet
          lg: '1024px',  // laptop
          xl: '1280px',
          '2xl': '1440px'
        }
      },
      extend: {
        // Escala mínima para gutters/espacios del grid (ajustable)
        spacing: {
          '3': '0.75rem',  // 12px
          '4': '1rem',     // 16px
          '5': '1.25rem',  // 20px
          '6': '1.5rem',   // 24px
          '8': '2rem'      // 32px
        }
      }
    },
    plugins: []
  };
  