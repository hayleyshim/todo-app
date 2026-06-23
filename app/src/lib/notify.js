// 브라우저 알림 (프로토타입)
// ⚠️ 한계: 순수 웹은 '앱이 닫혀 있어도 도착하는' 푸시를 보장하지 못한다.
// 실제 제품(Android)에서는 FCM + WorkManager로 구현(요구사항 US-4.2).
// 여기서는 앱이 열려 있는 동안 마감 시각을 폴링해 알림을 띄우는 것으로 핵심 UX를 시연한다.

export function notifySupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export async function requestPermission() {
  if (!notifySupported()) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  try {
    return await Notification.requestPermission()
  } catch {
    return 'denied'
  }
}

export function fireNotification(title, body) {
  if (!notifySupported() || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, tag: 'todo-due' })
  } catch {
    /* 무시 */
  }
}

// 마감이 도래한(아직 알림 안 보낸) 미완료 할 일 찾기
export function findDue(tasks, now = new Date()) {
  return tasks.filter(
    (t) => !t.done && !t.notified && t.dueAt && new Date(t.dueAt).getTime() <= now.getTime()
  )
}
