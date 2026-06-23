import { requestPermission, notifySupported } from '../lib/notify.js'

// S4 설정 — 알림 / 계정
export default function Settings({ settings, onChange, auth, onLogout, onBack }) {
  async function toggleNotifications() {
    const next = !settings.notifications
    if (next) {
      const perm = await requestPermission()
      onChange({ ...settings, notifications: perm === 'granted' })
    } else {
      onChange({ ...settings, notifications: false })
    }
  }

  const permBlocked = notifySupported() && Notification.permission === 'denied'

  return (
    <>
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>← 설정</button>
        <span />
      </div>

      <div className="settings">
        <div className="group-title">알림</div>

        {permBlocked && (
          <div className="set-row" style={{ background: '#fde2dc', borderColor: '#f3c5ba' }}>
            <span className="rlabel" style={{ color: '#d4503a', fontSize: 13 }}>
              브라우저 알림 권한이 차단돼 있어요. 주소창 옆 설정에서 허용해주세요.
            </span>
          </div>
        )}

        <div className="set-row">
          <span className="rlabel">전체 알림</span>
          <button
            className={`switch ${settings.notifications ? 'on' : ''}`}
            onClick={toggleNotifications}
            aria-label="전체 알림 토글"
          />
        </div>

        <div className="set-row">
          <span className="rlabel">기본 알림 시각</span>
          <input
            className="set-input"
            type="time"
            value={settings.defaultTime}
            onChange={(e) => onChange({ ...settings, defaultTime: e.target.value })}
          />
        </div>

        <div className="set-row">
          <span className="rlabel">미루기 간격</span>
          <select
            className="set-input"
            value={settings.snoozeMinutes}
            onChange={(e) => onChange({ ...settings, snoozeMinutes: Number(e.target.value) })}
          >
            <option value={10}>10분</option>
            <option value={30}>30분</option>
            <option value={60}>1시간</option>
          </select>
        </div>

        <div className="group-title">계정</div>
        <div className="set-row">
          <span className="rlabel">{auth?.email || '게스트'}</span>
        </div>
        <button className="logout-btn" onClick={onLogout}>로그아웃</button>

        <div className="group-title">정보</div>
        <div className="set-row">
          <span className="rlabel">버전</span>
          <span className="rval">0.1.0 (프로토타입)</span>
        </div>
      </div>
    </>
  )
}
