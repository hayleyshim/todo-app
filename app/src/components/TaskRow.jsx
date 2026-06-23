import { PRIORITY } from '../lib/tasks.js'
import { formatDue, formatRepeat } from '../lib/format.js'
import { isOverdue } from '../lib/tasks.js'

// 리스트 한 줄: 체크 | 제목 + 메타(우선순위/마감/반복) | 삭제
export default function TaskRow({ task, onToggle, onOpen, onDelete }) {
  const overdue = isOverdue(task)
  const due = formatDue(task.dueAt)
  const repeat = formatRepeat(task.repeat, task.dueAt)
  const pri = PRIORITY[task.priority] || PRIORITY.normal

  return (
    <div className={`task ${task.done ? 'done' : ''}`}>
      <button
        className={`check ${task.done ? 'on' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? '완료 취소' : '완료'}
      >
        {task.done ? '✓' : ''}
      </button>

      <div className="task-main" onClick={() => onOpen(task)}>
        <div className="task-title">{task.title}</div>
        {(due || repeat) && (
          <div className="task-meta">
            {repeat && <span className="meta-chip">🔁 {repeat}</span>}
            {due && <span className={`meta-chip ${overdue ? 'overdue' : ''}`}>
              {overdue ? '⚠ ' : '🕘 '}{due}
            </span>}
          </div>
        )}
      </div>

      {!task.done && <span className={`pri-pill ${pri.key}`}>{pri.label}</span>}
      <button className="del-btn" onClick={() => onDelete(task.id)} aria-label="삭제">×</button>
    </div>
  )
}
