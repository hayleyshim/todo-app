// 날짜/시간 표시 헬퍼 (한국어, 친근한 표현)

const WEEK = ['일', '월', '화', '수', '목', '금', '토']

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// 마감 시각을 사람 친화적으로: "오후 9:00", "어제", "내일 오전 9:00"
export function formatDue(dueAt) {
  if (!dueAt) return ''
  const d = new Date(dueAt)
  const now = new Date()
  const time = formatTime(d)

  const dayDiff = Math.round((stripTime(d) - stripTime(now)) / 86400000)
  if (dayDiff === 0) return time
  if (dayDiff === -1) return `어제 ${time}`
  if (dayDiff === 1) return `내일 ${time}`
  if (dayDiff < -1) return `${-dayDiff}일 지남`
  return `${d.getMonth() + 1}/${d.getDate()} ${time}`
}

export function formatTime(d) {
  const h = d.getHours()
  const m = d.getMinutes()
  const ampm = h < 12 ? '오전' : '오후'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${ampm} ${h12}:${String(m).padStart(2, '0')}`
}

function stripTime(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.getTime()
}

// 반복 라벨: "매주 화" 등
export function formatRepeat(repeat, dueAt) {
  if (!repeat || repeat === 'none') return ''
  if (repeat === 'daily') return '매일'
  if (repeat === 'weekly') {
    const day = dueAt ? WEEK[new Date(dueAt).getDay()] : ''
    return day ? `매주 ${day}` : '매주'
  }
  if (repeat === 'monthly') {
    const date = dueAt ? new Date(dueAt).getDate() : ''
    return date ? `매월 ${date}일` : '매월'
  }
  return ''
}

// <input type="datetime-local"> 값 <-> ISO 변환
export function isoToLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function localInputToIso(value) {
  if (!value) return null
  return new Date(value).toISOString()
}

export { sameDay }
