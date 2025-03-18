import type { Config } from 'tailwindcss'

export default <Config>{
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // Add more shades as needed
          500: '#0ea5e9',
          // Add more shades as needed
          900: '#0c4a6e',
        },
      },
    },
  },
}