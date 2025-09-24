import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // PWA Support
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      manifest: {
        name: 'AgriConnect',
        short_name: 'AgriConnect',
        description: 'Connect farmers directly with consumers',
        theme_color: '#059669',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    // Bundle analyzer for development
    mode === 'analyze' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    // Legacy browser support
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@contexts': fileURLToPath(new URL('./src/contexts', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
    }
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          
          // Router and navigation
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          
          // State management
          if (id.includes('node_modules/@reduxjs/toolkit') || id.includes('node_modules/react-redux')) {
            return 'redux';
          }
          
          // React Query for data fetching
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'react-query';
          }
          
          // Internationalization
          if (id.includes('node_modules/react-i18next') || id.includes('node_modules/i18next')) {
            return 'i18n';
          }
          
          // Other large vendor libraries
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
          
          // Feature-based chunking for larger components
          if (id.includes('src/pages/AdminDashboard') || id.includes('src/pages/FarmerDashboard')) {
            return 'dashboards';
          }
          
          if (id.includes('src/pages/ProductDetails') || id.includes('src/components/social')) {
            return 'product-social';
          }
          
          if (id.includes('src/pages/Subscription') || id.includes('src/components/LanguageSwitcher')) {
            return 'features';
          }
        }
      }
    },
    // Optimize bundle size
    chunkSizeWarningLimit: 500,
    // Enable source maps for production debugging (disable for production)
    sourcemap: mode !== 'production',
    // Additional optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    // Reduce CSS size
    cssCodeSplit: true,
    // Target modern browsers for smaller bundle
    target: 'es2015',
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    // Proxy API calls to backend
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 3000,
    open: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux', 'axios'],
  },
  // Environment variables
  envPrefix: 'VITE_',
}))