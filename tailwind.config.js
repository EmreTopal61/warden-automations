/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Tek aile: Archivo (wdth 62–125, wght 100–900). Genişlik, ses tonunu taşır.
        sans: ['"Archivo Variable"', 'Archivo', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Güvenlik kâğıdı dünyası — renk adları rollerini söyler.
        paper: {
          DEFAULT: '#E6EAE3',
          lift: '#EEF1EB',
        },
        ink: {
          DEFAULT: '#151A27', // Warden'ın bastığı her şey
          soft: '#3D4557',
          faint: '#596174',
        },
        rule: 'rgba(21, 26, 39, 0.26)',
        stamp: {
          DEFAULT: '#5B3BA6', // yalnızca ziyaretçinin kendi işaretleri
          light: '#9A86CF',
        },
        registry: '#B3261E', // evrak numaraları ve düzeltme notları
      },
      maxWidth: {
        sheet: '1240px',
      },
    },
  },
  plugins: [],
};
