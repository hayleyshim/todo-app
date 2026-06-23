import { test, expect } from '@playwright/test'
import { login, row } from './helpers.js'

// 각 테스트는 격리된 브라우저 컨텍스트(=깨끗한 localStorage)에서 실행된다.
// 로그인 후 시드 데이터 4건이 생성된다.

test.describe('할 일 앱 E2E', () => {
  // US-1.1 소셜 로그인
  test('로그인: Google 버튼으로 홈에 진입한다', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('할 일, 놓치지 않게.')).toBeVisible()
    await page.getByRole('button', { name: /Google로 계속하기/ }).click()
    await expect(page.getByRole('heading', { name: /오늘/ })).toBeVisible()
    // 시드 데이터가 보인다
    await expect(page.getByText('약 먹기')).toBeVisible()
  })

  // US-2.1 제목만으로 빠른 추가
  test('빠른 추가: 제목 입력 후 Enter로 즉시 등록되고 입력란이 비워진다', async ({ page }) => {
    await login(page)
    const input = page.getByPlaceholder('할 일 적어볼까요?')
    await input.fill('운동하기')
    await input.press('Enter')

    await expect(page.getByText('운동하기', { exact: true })).toBeVisible()
    await expect(input).toHaveValue('') // 연속 입력 가능
  })

  test('빠른 추가: 빈 제목은 등록되지 않는다', async ({ page }) => {
    await login(page)
    const before = await page.locator('.task').count()
    const input = page.getByPlaceholder('할 일 적어볼까요?')
    await input.fill('   ')
    await input.press('Enter')
    await expect(page.locator('.task')).toHaveCount(before)
  })

  // US-3.2 완료/취소 + 되돌리기
  test('완료: 체크하면 완료됨 섹션으로 가고, 되돌리기로 복원된다', async ({ page }) => {
    await login(page)
    await row(page, '우산 챙기기').getByRole('button', { name: '완료' }).click()

    // 완료됨 섹션이 생기고 활성 목록에서 사라짐(완료됨 기본 접힘)
    await expect(page.getByText(/완료됨 \(1\)/)).toBeVisible()
    await expect(page.getByText('우산 챙기기')).toHaveCount(0)

    // 되돌리기
    await page.getByRole('button', { name: '되돌리기' }).click()
    await expect(page.getByText('우산 챙기기')).toBeVisible()
  })

  // US-3.1 / US-3.4 편집: 우선순위 변경
  test('편집: 항목을 열어 우선순위를 높음으로 바꾸면 반영된다', async ({ page }) => {
    await login(page)
    const target = row(page, '우산 챙기기')
    await expect(target.locator('.pri-pill')).toHaveText('낮음')

    await target.locator('.task-main').click()
    const sheet = page.locator('.sheet')
    await expect(sheet).toBeVisible()
    await sheet.getByRole('button', { name: '높음' }).click()
    await sheet.getByRole('button', { name: '저장' }).click()

    await expect(row(page, '우산 챙기기').locator('.pri-pill')).toHaveText('높음')
  })

  // US-5.1 반복 설정으로 신규 추가
  test('추가 시트: 반복(매주)으로 새 할 일을 만들면 반복 표시가 보인다', async ({ page }) => {
    await login(page)
    await page.getByRole('button', { name: '상세 추가' }).click()
    const sheet = page.locator('.sheet')
    await sheet.getByPlaceholder('무엇을 할까요?').fill('스트레칭')
    await sheet.getByRole('button', { name: '매주' }).click()
    await sheet.getByRole('button', { name: '추가하기' }).click()

    const created = row(page, '스트레칭')
    await expect(created).toBeVisible()
    await expect(created).toContainText('매주')
  })

  // US-3.3 삭제 + 되돌리기
  test('삭제: 항목을 지우면 토스트가 뜨고 되돌리기로 복원된다', async ({ page }) => {
    await login(page)
    await row(page, '우산 챙기기').getByRole('button', { name: '삭제' }).click()

    await expect(page.getByText('할 일을 삭제했어요')).toBeVisible()
    await expect(page.getByText('우산 챙기기')).toHaveCount(0)

    await page.getByRole('button', { name: '되돌리기' }).click()
    await expect(page.getByText('우산 챙기기')).toBeVisible()
  })

  // US-4.3 마감 알림에서 바로 완료
  test('알림: 지난 마감 항목의 배너에서 바로 완료할 수 있다', async ({ page }) => {
    await login(page, { keepBanner: true })
    const banner = page.locator('.due-banner')
    await expect(banner).toBeVisible()
    await expect(banner).toContainText('병원 예약 확인')

    await banner.getByRole('button', { name: /완료/ }).click()
    await expect(banner).toBeHidden()
    // 완료됨 섹션에 반영
    await expect(page.getByText(/완료됨 \(1\)/)).toBeVisible()
  })

  // US-8.1 / US-1.2 설정 + 로그아웃
  test('설정: 진입 후 로그아웃하면 로그인 화면으로 돌아온다', async ({ page }) => {
    await login(page)
    await page.getByRole('button', { name: '설정' }).click()
    await expect(page.getByText('전체 알림')).toBeVisible()
    await page.getByRole('button', { name: '로그아웃' }).click()
    await expect(page.getByRole('button', { name: /Google로 계속하기/ })).toBeVisible()
  })

  // US-7.1 오프라인/영속화: 새로고침 후에도 데이터 유지
  test('영속화: 추가한 할 일이 새로고침 후에도 남아 있다', async ({ page }) => {
    await login(page)
    const input = page.getByPlaceholder('할 일 적어볼까요?')
    await input.fill('지속성 테스트')
    await input.press('Enter')
    await expect(page.getByText('지속성 테스트')).toBeVisible()

    await page.reload()
    // 새로고침 후 로그인 유지 + 데이터 유지
    await expect(page.getByText('지속성 테스트')).toBeVisible()
  })
})
