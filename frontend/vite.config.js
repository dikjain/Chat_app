import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://chat-app-3-2cid.onrender.com',  // Backend API server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^/, ''),  // Optionally remove the '/api' prefix
      },
    },
  },
});
