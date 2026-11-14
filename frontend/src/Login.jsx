import { useState } from "react";
import "./Login.css";

function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
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
        <div className="login-container">
            <div className="login-box">
                <h2>로그인</h2>

                <input
                    type="text"
                    placeholder="아이디"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="button" onClick={handleLogin}>
                    로그인
                </button>

                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default Login;
