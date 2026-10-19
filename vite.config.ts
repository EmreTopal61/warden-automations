import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // three.js tek parça ~680KB; kasıtlı olarak ayrı/tembel chunk'ta tutuluyor, uyarı gürültü.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // 3D yığınını ayrı chunk'lara böl — initial bundle küçük kalsın, tembel yüklensin.
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber'],
        },
      },
    },
  },
});
