import { useState, useEffect, useCallback, useRef } from 'react'
import { useTasks } from './hooks/useTasks.js'
import { storage } from './lib/storage.js'
import { findDue, fireNotification } from './lib/notify.js'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import EditSheet from './components/EditSheet.jsx'
import Settings from './components/Settings.jsx'
import DueBanner from './components/DueBanner.jsx'

export default function App() {
  const [auth, setAuth] = useState(() => {
    // 데모/스크린샷 편의: ?demo 로 자동 로그인
    if (typeof window !== 'undefined' && window.location.search.includes('demo')) {
      const u = storage.loadAuth() || { name: '나', email: 'yhshim17@gmail.com' }
      storage.saveAuth(u)
      return u
    }
    return storage.loadAuth()
  })
  const [settings, setSettings] = useState(() => storage.loadSettings())
  const [screen, setScreen] = useState('home') // 'home' | 'settings'
  const [editing, setEditing] = useState(null) // task | {} (new) | null
  const [toast, setToast] = useState(null) // { msg }
  const [dueTask, setDueTask] = useState(null)
  const toastTimer = useRef(null)

  const { tasks, addQuick, addTask, updateTask, removeTask, toggleDone, undo, setTasks } = useTasks()

  useEffect(() => { storage.saveSettings(settings) }, [settings])

  const showToast = useCallback((msg) => {
    setToast({ msg })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 4000)
  }, [])

  // ── 마감 알림 폴링 (앱이 열려 있는 동안) ──
  useEffect(() => {
    if (!auth || !settings.notifications) return
    const tick = () => {
      const due = findDue(tasks)
      if (due.length === 0) return
      const t = due[0]
      updateTask(t.id, { notified: true }) // 중복 알림 방지
      fireNotification('할 일 — 지금이에요', t.title)
      setDueTask(t)
    }
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [tasks, auth, settings.notifications, updateTask])

  // ── 핸들러 ──
  const handleQuickAdd = useCallback((title) => { addQuick(title) }, [addQuick])

  const handleSaveSheet = useCallback((data) => {
    if (editing && editing.id) {
      updateTask(editing.id, { ...data, notified: false })
    } else {
      addTask(data)
    }
    setEditing(null)
  }, [editing, addTask, updateTask])

  const handleDelete = useCallback((id) => {
    removeTask(id)
    setEditing(null)
    showToast('할 일을 삭제했어요')
  }, [removeTask, showToast])

  const handleToggle = useCallback((id) => {
    const t = tasks.find((x) => x.id === id)
    toggleDone(id)
    if (t && !t.done) showToast('완료했어요 🎉')
    if (dueTask?.id === id) setDueTask(null)
  }, [tasks, toggleDone, showToast, dueTask])

  const handleSnooze = useCallback((id) => {
    const next = new Date(Date.now() + settings.snoozeMinutes * 60000).toISOString()
    updateTask(id, { dueAt: next, notified: false })
    setDueTask(null)
    showToast(`${settings.snoozeMinutes}분 뒤 다시 알려드릴게요`)
  }, [settings.snoozeMinutes, updateTask, showToast])

  function handleLogin(user) {
    storage.saveAuth(user)
    setAuth(user)
  }
  function handleLogout() {
    storage.clearAuth()
    setAuth(null)
    setScreen('home')
  }

  // ── 렌더 ──
  if (!auth) {
    return (
      <div className="app-frame">
        <Login onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="app-frame">
      {dueTask && (
        <DueBanner task={dueTask} onComplete={handleToggle} onSnooze={handleSnooze} />
      )}

      {screen === 'home' && (
        <Home
          tasks={tasks}
          onToggle={handleToggle}
          onOpen={(t) => setEditing(t)}
          onOpenNew={() => setEditing({})}
          onDelete={handleDelete}
          onQuickAdd={handleQuickAdd}
          onOpenSettings={() => setScreen('settings')}
        />
      )}

      {screen === 'settings' && (
        <Settings
          settings={settings}
          onChange={setSettings}
          auth={auth}
          onLogout={handleLogout}
          onBack={() => setScreen('home')}
        />
      )}

      {editing && (
        <EditSheet
          task={editing}
          defaultTime={settings.defaultTime}
          onClose={() => setEditing(null)}
          onSave={handleSaveSheet}
          onDelete={handleDelete}
        />
      )}

      {toast && (
        <div className="toast">
          <span>{toast.msg}</span>
          <button onClick={() => { undo(); setToast(null) }}>되돌리기</button>
        </div>
      )}
    </div>
  )
}
