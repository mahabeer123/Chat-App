import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux']
  }
}) 