import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 백엔드에서 가져온 데이터를 저장할 공간(state)
  const [message, setMessage] = useState('');

  // 화면이 처음 켜질 때 딱 한 번 실행되는 함수
  useEffect(() => {
    // Spring Boot 서버(8080 포트)로 데이터 요청하기
    fetch('http://localhost:8080/hello')
        .then((response) => response.text())
        .then((data) => {
          setMessage(data); // 가져온 데이터를 message에 저장
        })
        .catch((error) => {
          console.error('데이터를 가져오는데 실패했습니다:', error);
        });
  }, []);

  return (
      <div>
        <div style={{ padding: '20px', border: '2px solid #ccc', borderRadius: '10px' }}>
          <h2>백엔드(Spring Boot)에서 온 메시지:</h2>
          <p style={{ color: 'blue', fontSize: '24px', fontWeight: 'bold' }}>
            {message || '데이터를 불러오는 중입니다... ⏳'}
          </p>
        </div>
      </div>
  );
}

export default App;