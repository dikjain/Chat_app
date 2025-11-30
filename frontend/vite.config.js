import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',  // Backend API server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^/, ''),  // Optionally remove the '/api' prefix
      },
    },
  },
});
