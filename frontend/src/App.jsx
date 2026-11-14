import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Login from './Login.jsx';
import Signup from './SIgnup.jsx';
import { Button } from './components/ui/index.js';
import { HomeScreen } from './screens/HomeScreen.jsx';
import { WomenScreen } from './screens/WomenScreen.jsx';
import { SearchScreen } from './screens/SearchScreen.jsx';

function Storefront({ Screen = HomeScreen }) {
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
    <Screen
      accountActions={member ? (
        <>
          <span>{member.name}님 환영합니다!</span>
          <Button variant="account" className="site-header-account" onClick={handleLogout}>
            로그아웃
          </Button>
        </>
      ) : (
        <div className="site-header-account ui-button ui-button-account">
          <Link to="/login">로그인</Link>
          <span aria-hidden="true">/</span>
          <Link to="/signup">회원가입</Link>
        </div>
      )}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/women/all" element={<Storefront Screen={WomenScreen} />} />
        <Route path="/search" element={<Storefront Screen={SearchScreen} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
