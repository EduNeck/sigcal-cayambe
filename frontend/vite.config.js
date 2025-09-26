import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  build: {
    // Añade una marca de tiempo a los archivos para evitar problemas de caché
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // <- permite que se acceda desde otra IP
    port: 5173,
    proxy: {
      // '/api': { target: 'http://172.28.64.1:3001',  changeOrigin: true,     },
    },
  },
})
