import { useState, useMemo } from 'react'
import TaskRow from './TaskRow.jsx'
import { sortTasks } from '../lib/tasks.js'

// S2 홈 — 앱의 중심. 목록 + 빠른추가 + 완료됨 섹션 + 빈 상태
export default function Home({ tasks, onToggle, onOpen, onDelete, onQuickAdd, onOpenNew, onOpenSettings }) {
  const [draft, setDraft] = useState('')
  const [showDone, setShowDone] = useState(false)

  const { active, done } = useMemo(() => {
    const a = sortTasks(tasks.filter((t) => !t.done))
    const d = tasks.filter((t) => t.done)
    return { active: a, done: d }
  }, [tasks])

  const today = new Date()
  const dateLabel = `${today.getMonth() + 1}월 ${today.getDate()}일 ${['일','월','화','수','목','금','토'][today.getDay()]}요일`

  function submitQuick(e) {
    e.preventDefault()
    const v = draft.trim()
    if (!v) return
    onQuickAdd(v)
    setDraft('') // 연속 입력 가능 (가치 ②)
  }

  const isEmpty = active.length === 0 && done.length === 0

  return (
    <>
      <div className="topbar">
        <div>
          <h1>오늘 ☀️</h1>
          <div className="date">{dateLabel}</div>
        </div>
        <button className="icon-btn" onClick={onOpenSettings} aria-label="설정">⚙</button>
      </div>

      {isEmpty ? (
        <div className="empty">
          <div className="big">🌱</div>
          <div className="msg">오늘은 아직 비어 있어요.<br />아래에 떠오른 일을 적어보세요.</div>
        </div>
      ) : (
        <div className="list">
          {active.map((t) => (
            <TaskRow key={t.id} task={t} onToggle={onToggle} onOpen={onOpen} onDelete={onDelete} />
          ))}

          {active.length === 0 && (
            <div className="empty" style={{ flex: 'none', padding: '30px 10px' }}>
              <div className="big">🎉</div>
              <div className="msg">할 일을 다 끝냈어요!</div>
            </div>
          )}

          {done.length > 0 && (
            <>
              <div className="section-h" onClick={() => setShowDone((s) => !s)}>
                <span>✓ 완료됨 ({done.length})</span>
                <span>{showDone ? '▾' : '▸'}</span>
              </div>
              {showDone &&
                done.map((t) => (
                  <TaskRow key={t.id} task={t} onToggle={onToggle} onOpen={onOpen} onDelete={onDelete} />
                ))}
            </>
          )}
        </div>
      )}

      <div className="quickadd">
        <form onSubmit={submitQuick}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="할 일 적어볼까요?"
            aria-label="할 일 빠르게 추가"
          />
        </form>
        <button className="fab" onClick={onOpenNew} aria-label="상세 추가">+</button>
      </div>
    </>
  )
}
