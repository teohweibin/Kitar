import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      workbox: {
        // The photo-scan runtime (ONNX WebAssembly, ~27 MB) is cached on first use instead of
        // at install, so installing the app stays fast. Model weights are cached by transformers.js.
        // App shell + Poppins (Latin) are precached so the app opens offline. Supabase calls are
        // never cached (no runtime rule matches them), so data is always live.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        globIgnores: ['**/*.wasm'],
        navigateFallback: '/index.html',
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.wasm'),
            handler: 'CacheFirst',
            options: { cacheName: 'kitar-scan-runtime', expiration: { maxEntries: 4 } },
          },
        ],
      },
      manifest: {
        name: 'Kitar',
        short_name: 'Kitar',
        description: 'Verified household recycling. Concept prototype with sample data.',
        theme_color: '#0D0A08',
        background_color: '#0D0A08',
        display: 'standalone',
        start_url: '/login',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
