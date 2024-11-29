import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/socket.io': {
        target: 'ws://localhost:3000',
        ws: true,
        changeOrigin: true,
        secure: false
      },
    },
  },
  optimizeDeps: {
    include: ['socket.io-client']
  },
  build: {
    rollupOptions: {
      external: [],
    },
    assetsDir: 'assets',
    copyPublicDir: true,
  }
});