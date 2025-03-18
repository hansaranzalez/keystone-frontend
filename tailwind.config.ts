import type { Config } from 'tailwindcss'

export default <Config>{
  // Note: With Nuxt UI and Tailwind CSS v4, most of the theme configuration 
  // happens in app/assets/css/main.css using the @theme directive
  // This file is mainly used for extensions that don't fit in CSS variables
  
  theme: {
    extend: {
      // Line heights from UI Kit
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75'
      },
      // Font weights from UI Kit
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700'
      },
      // Ensure screens match our breakpoints from UI Kit
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      }
    },
  },
}