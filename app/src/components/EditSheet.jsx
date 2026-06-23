import { useState, useEffect } from 'react'
import { PRIORITY, REPEAT } from '../lib/tasks.js'
import { isoToLocalInput, localInputToIso } from '../lib/format.js'

// S3 추가/편집 바텀시트 — 점진적 공개(핵심 필드만, 메모는 더보기)
export default function EditSheet({ task, defaultTime, onClose, onSave, onDelete }) {
  const isNew = !task?.id
  const [title, setTitle] = useState(task?.title || '')
  const [dueAt, setDueAt] = useState(task?.dueAt || null)
  const [repeat, setRepeat] = useState(task?.repeat || 'none')
  const [priority, setPriority] = useState(task?.priority || 'normal')
  const [memo, setMemo] = useState(task?.memo || '')
  const [showMemo, setShowMemo] = useState(!!task?.memo)

  useEffect(() => {
    // 시트 열릴 때 새 항목이면 제목에 포커스
    const el = document.getElementById('sheet-title')
    if (el && isNew) el.focus()
  }, [isNew])

  function addDefaultDue() {
    const [h, m] = (defaultTime || '09:00').split(':').map(Number)
    const d = new Date()
    d.setHours(h, m, 0, 0)
    if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1) // 지난 시각이면 내일로
    setDueAt(d.toISOString())
  }

  function save() {
    if (!title.trim()) return
    onSave({ title: title.trim(), dueAt, repeat, priority, memo: memo.trim() })
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="handle" />

        <input
          id="sheet-title"
          className="sheet-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="무엇을 할까요?"
          onKeyDown={(e) => { if (e.key === 'Enter') save() }}
        />

        {/* 마감 */}
        <div className="field-row">
          <span className="flabel">📅 마감</span>
          <span className="fcontrol">
            {dueAt ? (
              <>
                <input
                  className="dt-input"
                  type="datetime-local"
                  value={isoToLocalInput(dueAt)}
                  onChange={(e) => setDueAt(localInputToIso(e.target.value))}
                />
                <button className="linklike" onClick={() => setDueAt(null)}>지우기</button>
              </>
            ) : (
              <button className="linklike" onClick={addDefaultDue}>+ 마감 추가</button>
            )}
          </span>
        </div>

        {/* 반복 */}
        <div className="field-row">
          <span className="flabel">🔁 반복</span>
          <span className="fcontrol">
            <div className="seg">
              {Object.values(REPEAT).map((r) => (
                <button
                  key={r.key}
                  className={repeat === r.key ? 'active' : ''}
                  onClick={() => setRepeat(r.key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </span>
        </div>

        {/* 우선순위 — 기본 보통, 강요 안 함 */}
        <div className="field-row">
          <span className="flabel">🚩 우선순위</span>
          <span className="fcontrol">
            <div className="seg">
              {Object.values(PRIORITY).map((p) => (
                <button
                  key={p.key}
                  className={priority === p.key ? 'active' : ''}
                  onClick={() => setPriority(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </span>
        </div>

        {/* 메모 — 더보기로 접힘 */}
        {showMemo ? (
          <div className="field-row" style={{ display: 'block' }}>
            <span className="flabel" style={{ marginBottom: 6 }}>📝 메모</span>
            <textarea
              className="memo-input"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="필요하면 상세 메모를 적어요"
            />
          </div>
        ) : (
          <div className="field-row">
            <button className="linklike" onClick={() => setShowMemo(true)}>＋ 더보기 (메모)</button>
          </div>
        )}

        <button className="save-btn" onClick={save} disabled={!title.trim()}>
          {isNew ? '추가하기' : '저장'}
        </button>
        {!isNew && (
          <button className="sheet-delete" onClick={() => onDelete(task.id)}>이 할 일 삭제</button>
        )}
      </div>
    </div>
  )
}
