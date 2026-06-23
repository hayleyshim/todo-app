// 도메인 로직: Task 모델 · 정렬 · 반복 다음 회차 생성
// 핵심가치 ① 놓치지 않게 ② 빠른 입력(기본값) ③ 안심

export const PRIORITY = {
  high: { key: 'high', label: '높음', rank: 0 },
  normal: { key: 'normal', label: '보통', rank: 1 },
  low: { key: 'low', label: '낮음', rank: 2 },
}

export const REPEAT = {
  none: { key: 'none', label: '안 함' },
  daily: { key: 'daily', label: '매일' },
  weekly: { key: 'weekly', label: '매주' },
  monthly: { key: 'monthly', label: '매월' },
}

let _seq = 0
export function newId() {
  // Date.now 대체: 단조 증가 시퀀스 + 성능 타임스탬프
  _seq += 1
  return `t_${Math.floor(performance.now())}_${_seq}`
}

// 빠른 추가: 제목만으로 생성. 나머지는 기본값(가치 ②)
export function createTask(partial = {}) {
  const nowIso = new Date().toISOString()
  return {
    id: newId(),
    title: (partial.title || '').trim(),
    memo: partial.memo || '',
    dueAt: partial.dueAt || null, // ISO string | null
    priority: partial.priority || 'normal', // 강요 안 함 → 기본 보통
    repeat: partial.repeat || 'none',
    done: false,
    notified: false, // 마감 알림 발송 여부
    createdAt: nowIso,
    completedAt: null,
  }
}

// 마감 임박 + 우선순위 높은 순 (요구사항 US-6.2)
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const ad = a.dueAt ? new Date(a.dueAt).getTime() : Infinity
    const bd = b.dueAt ? new Date(b.dueAt).getTime() : Infinity
    if (ad !== bd) return ad - bd
    const ap = PRIORITY[a.priority]?.rank ?? 1
    const bp = PRIORITY[b.priority]?.rank ?? 1
    if (ap !== bp) return ap - bp
    return a.createdAt < b.createdAt ? -1 : 1
  })
}

// 마감이 지났는가
export function isOverdue(task, now = new Date()) {
  return !task.done && task.dueAt && new Date(task.dueAt).getTime() < now.getTime()
}

// 반복: 다음 회차의 마감일 계산
export function nextDueDate(dueAt, repeat) {
  const base = dueAt ? new Date(dueAt) : new Date()
  const d = new Date(base)
  if (repeat === 'daily') d.setDate(d.getDate() + 1)
  else if (repeat === 'weekly') d.setDate(d.getDate() + 7)
  else if (repeat === 'monthly') d.setMonth(d.getMonth() + 1)
  else return null
  return d.toISOString()
}

// 반복 할 일 완료 시 다음 회차 항목 생성 (US-5.2)
export function spawnNextOccurrence(task) {
  if (!task.repeat || task.repeat === 'none') return null
  const next = createTask({
    title: task.title,
    memo: task.memo,
    priority: task.priority,
    repeat: task.repeat,
    dueAt: nextDueDate(task.dueAt, task.repeat),
  })
  return next
}
