// localStorage 영속화 (프로토타입 — 추후 Firebase로 교체 가능한 경계)
// 오프라인 우선(US-7.1): 모든 쓰기는 즉시 로컬에 저장됨

const TASKS_KEY = 'todo.tasks.v1'
const SETTINGS_KEY = 'todo.settings.v1'
const AUTH_KEY = 'todo.auth.v1'

const DEFAULT_SETTINGS = {
  notifications: true,
  defaultTime: '09:00',
  snoozeMinutes: 30,
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 용량 초과 등은 프로토타입에서 무시 */
  }
}

export const storage = {
  loadTasks: () => read(TASKS_KEY, null),
  saveTasks: (tasks) => write(TASKS_KEY, tasks),

  loadSettings: () => ({ ...DEFAULT_SETTINGS, ...read(SETTINGS_KEY, {}) }),
  saveSettings: (s) => write(SETTINGS_KEY, s),

  loadAuth: () => read(AUTH_KEY, null),
  saveAuth: (a) => write(AUTH_KEY, a),
  clearAuth: () => localStorage.removeItem(AUTH_KEY),
}

// 첫 실행 시 데모 데이터 (빈 상태도 보고 싶으면 비우면 됨)
export function seedTasks() {
  const today = new Date()
  const at = (h, m, addDays = 0) => {
    const d = new Date(today)
    d.setDate(d.getDate() + addDays)
    d.setHours(h, m, 0, 0)
    return d.toISOString()
  }
  return [
    { title: '약 먹기', priority: 'high', dueAt: at(21, 0), repeat: 'daily' },
    { title: '분리수거 내놓기', priority: 'normal', dueAt: at(20, 0), repeat: 'weekly' },
    { title: '우산 챙기기', priority: 'low' },
    { title: '병원 예약 확인', priority: 'high', dueAt: at(9, 0, -1) }, // 어제(지남)
  ]
}
