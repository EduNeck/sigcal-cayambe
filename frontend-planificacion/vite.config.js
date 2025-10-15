import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'img/**/*'],
      manifest: {
        name: "SIGCAL Planificación Cayambe",
        short_name: "SIGCAL Planificación",
        description: "Sistema de Planificación Urbana de Cayambe",
        theme_color: "#223770",
        background_color: "#F1ECE7",
        display: "standalone",
        icons: [
          {
            src: "/img/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/img/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    open: true,
    cors: true,
    https: {
      key: fs.readFileSync(path.join(__dirname, 'certs', 'localhost+3-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'certs', 'localhost+3.pem'))
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
