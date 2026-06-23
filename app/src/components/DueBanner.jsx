// N1 알림(앱 내 표현) — 마감 도래 시 완료/미루기를 바로 처리 (US-4.3)
import { formatDue } from '../lib/format.js'

export default function DueBanner({ task, onComplete, onSnooze }) {
  if (!task) return null
  return (
    <div className="due-banner">
      <div className="db-top">
        <span>📌 할 일 · {formatDue(task.dueAt)}</span>
        <span>지금이에요</span>
      </div>
      <div className="db-title">{task.title}</div>
      <div className="db-actions">
        <button className="primary" onClick={() => onComplete(task.id)}>✓ 완료</button>
        <button onClick={() => onSnooze(task.id)}>😴 미루기</button>
      </div>
    </div>
  )
}
