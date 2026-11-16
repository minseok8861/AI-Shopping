import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryPanel } from './components/CategoryPanel.jsx';
import { Header } from './components/Header.jsx';
import { useCategoryPanel } from './hooks/useCategoryPanel.js';
import './Login.css';

const accountLinks = [
  { to: '/login/email', label: '이메일로 로그인', variant: 'login' },
  { to: '/signup', label: '이메일로 회원가입', variant: 'signup' },
];

export function AuthLayout({ accountActions, className = '', children }) {
  const { activeCategory, toggleCategory, handleCategoryKeyDown } = useCategoryPanel();

  return (
    <div className="storefront auth-page" onKeyDown={handleCategoryKeyDown}>
      <Header
        links={{ best: '/#outfits', outfits: '/#outfits' }}
        activeCategory={activeCategory}
        onCategoryClick={toggleCategory}
        accountActions={accountActions}
        showUnavailableActions
      />
      <main className={`storefront-main ${className}`}>
        {children}
        <CategoryPanel activeCategory={activeCategory} />
      </main>
    </div>
  );
}

export function LoginScreen({ accountActions }) {
  return (
    <AuthLayout accountActions={accountActions} className="login-screen">
        <div className="login-screen-content">
          <div className="login-screen-intro">
            <h1>ONDO</h1>
            <div className="login-screen-copy">
              <p>당신의 취향, 온도를 읽다.</p>
              <p>오늘의 기분부터 나만의 스타일 발견까지.</p>
            </div>
          </div>
          <div className="login-screen-actions">
            {accountLinks.map(({ to, label, variant }) => (
              <Link key={to} to={to} className={`login-screen-action login-screen-action--${variant}`}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 6 8 7 8-7" />
                </svg>
                {label}
              </Link>
            ))}
          </div>
        </div>
    </AuthLayout>
  );
}

export function PasswordField({ id, label, error, markRequired, required, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}{markRequired && <span aria-hidden="true"> *</span>}</label>
      <div className="auth-password">
        <input {...props} id={id} type={visible ? 'text' : 'password'} required={required}
          aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} />
        <button type="button" aria-label={`${label} 표시`} aria-pressed={visible}
          onClick={() => setVisible(!visible)}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
            {!visible && <path d="M3 21 21 3" />}
          </svg>
        </button>
      </div>
      {error && <p className="auth-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}

function Login({ accountActions }) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                credentials: "include",
                body: new URLSearchParams({
                    username: name,
                    password: password,
                }),
            });

            if (response.ok) {
                window.location.href = "/";
            } else if (response.status === 401) {
                setMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
            }
            else{
                setMessage("로그인에 실패했습니다. 다시 시도해주세요.");
            }
        } catch {
            setMessage("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <AuthLayout accountActions={accountActions} className="login-form-page">
            <form className="login-box" onSubmit={handleLogin}>
                <h1>ONDO 로그인</h1>
                <div className="auth-field">
                    <label htmlFor="login-name">아이디</label>
                    <input id="login-name" autoComplete="username" placeholder="가입한 아이디"
                        value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <PasswordField id="login-password" label="비밀번호" autoComplete="current-password"
                    placeholder="비밀번호를 입력해주세요" value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
                <button className="auth-submit" type="submit">로그인</button>
                {message && <p className="auth-error" role="alert">{message}</p>}
                <p className="login-signup-link">아직 ONDO 회원이 아니신가요? <Link to="/signup">회원가입</Link></p>
            </form>
        </AuthLayout>
    );
}

export default Login;
