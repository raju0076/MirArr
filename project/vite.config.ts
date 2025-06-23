import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separates React-related libs into one chunk
          react: ['react', 'react-dom'],
          // Redux-related chunks
          redux: ['@reduxjs/toolkit', 'react-redux'],
          // UI/utility libraries
          ui: ['lucide-react', 'react-toastify'],
        },
      },
    },
    chunkSizeWarningLimit: 800, // optional: raise warning limit if you're okay with larger chunks
  },
});
