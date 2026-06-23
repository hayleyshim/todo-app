import { useState, useEffect, useCallback, useRef } from 'react'
import { storage, seedTasks } from '../lib/storage.js'
import { createTask, spawnNextOccurrence } from '../lib/tasks.js'

// 할 일 상태 + 영속화를 묶은 훅. 모든 변경은 즉시 localStorage에 저장(오프라인 우선).
export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = storage.loadTasks()
    if (saved) return saved
    const seeded = seedTasks().map((t) => createTask(t))
    storage.saveTasks(seeded)
    return seeded
  })

  // 되돌리기용 직전 스냅샷
  const undoRef = useRef(null)

  useEffect(() => {
    storage.saveTasks(tasks)
  }, [tasks])

  const snapshot = useCallback(() => {
    undoRef.current = tasks
  }, [tasks])

  const undo = useCallback(() => {
    if (undoRef.current) {
      setTasks(undoRef.current)
      undoRef.current = null
    }
  }, [])

  // 빠른 추가: 제목만 (가치 ②)
  const addQuick = useCallback((title) => {
    const t = createTask({ title })
    if (!t.title) return null
    setTasks((prev) => [t, ...prev])
    return t
  }, [])

  const addTask = useCallback((partial) => {
    const t = createTask(partial)
    if (!t.title) return null
    setTasks((prev) => [t, ...prev])
    return t
  }, [])

  const updateTask = useCallback((id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }, [])

  const removeTask = useCallback(
    (id) => {
      snapshot()
      setTasks((prev) => prev.filter((t) => t.id !== id))
    },
    [snapshot]
  )

  // 완료 토글 — 반복 할 일이면 다음 회차 생성 (US-5.2)
  const toggleDone = useCallback(
    (id) => {
      snapshot()
      setTasks((prev) => {
        const target = prev.find((t) => t.id === id)
        if (!target) return prev
        const willBeDone = !target.done
        let next = prev.map((t) =>
          t.id === id
            ? { ...t, done: willBeDone, completedAt: willBeDone ? new Date().toISOString() : null }
            : t
        )
        if (willBeDone) {
          const spawned = spawnNextOccurrence(target)
          if (spawned) next = [spawned, ...next]
        }
        return next
      })
    },
    [snapshot]
  )

  return { tasks, addQuick, addTask, updateTask, removeTask, toggleDone, undo, snapshot, setTasks }
}
