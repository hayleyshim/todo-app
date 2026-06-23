import { expect } from '@playwright/test'

// 로그인 + (옵션) 마감 알림 배너 닫기
// 시드 데이터에 '어제' 마감인 항목이 있어 홈 진입 시 알림 배너가 뜬다.
export async function login(page, { keepBanner = false } = {}) {
  await page.goto('/')
  await page.getByRole('button', { name: /Google로 계속하기/ }).click()
  await expect(page.getByRole('heading', { name: /오늘/ })).toBeVisible()

  if (!keepBanner) {
    const banner = page.locator('.due-banner')
    // 시드에 지난 항목이 있으므로 배너는 반드시 뜬다 → 미루기로 닫음
    await banner.waitFor({ state: 'visible', timeout: 4000 })
    await page.getByRole('button', { name: /미루기/ }).click()
    await banner.waitFor({ state: 'hidden' })
  }
}

// 특정 제목을 가진 리스트 행
export function row(page, title) {
  return page.locator('.task', { hasText: title })
}
