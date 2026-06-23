import { defineConfig, devices } from '@playwright/test'

// 모바일 앱 프로토타입 → 모바일 뷰포트로 테스트
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // CI에서 test.only 방지
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
  // 실행 중인 dev 서버 재사용, 없으면 새로 띄움
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI, // CI에선 항상 새 서버
    timeout: 60000,
  },
})
