// S1 로그인 — 프로토타입은 소셜 로그인을 목업으로 처리(실제 Firebase Auth 자리)
export default function Login({ onLogin }) {
  return (
    <div className="login">
      <div className="logo">🗒️</div>
      <div className="tagline">할 일, 놓치지 않게.</div>
      <div className="sub">적어두면 제때 알려드려요.<br />이제 머릿속은 가볍게.</div>

      <button className="google-btn" onClick={() => onLogin({ name: '나', email: 'yhshim17@gmail.com' })}>
        <span style={{ fontWeight: 800, color: '#4285F4' }}>G</span>
        Google로 계속하기
      </button>

      <div className="terms">로그인 시 약관 · 개인정보처리방침에 동의합니다</div>
      <div className="terms" style={{ marginTop: 6 }}>※ 프로토타입: 실제 인증 없이 진행됩니다</div>
    </div>
  )
}
