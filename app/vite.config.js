import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 새 버전 배포 시 자동 갱신
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: '오늘 — 할 일',
        short_name: '할 일',
        description: '적어두면 제때 알려주는 할 일 관리 앱',
        lang: 'ko',
        theme_color: '#f0883e', // 디자인 안 B 강조색
        background_color: '#fdf6ee', // 스플래시 배경(크림)
        display: 'standalone', // 전체화면(주소창 없음)
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 앱 셸 + 정적 자산 오프라인 캐싱 (오프라인 우선과 결)
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
})
