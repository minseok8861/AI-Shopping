import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Login from './Login.jsx';
import Signup from './SIgnup.jsx';
import { Button } from './components/ui/index.js';
import { HomeScreen } from './screens/HomeScreen.jsx';

function Home() {
  const [member, setMember] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('http://localhost:8080/member/status', {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        if (!controller.signal.aborted && data.loggedIn) setMember(data);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('로그인 상태 확인 실패:', error);
      });

    return () => controller.abort();
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) setMember(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  }

  return (
    <HomeScreen
      accountActions={member ? (
        <>
          <span>{member.name}님 환영합니다!</span>
          <Button variant="account" className="site-header-account" onClick={handleLogout}>
            로그아웃
          </Button>
        </>
      ) : (
        <>
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </>
      )}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
