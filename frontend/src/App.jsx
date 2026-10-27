import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from "./SIgnup";
import Login from "./Login";
import Account from "./Account";

function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/member/status", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                setLoggedIn(data.loggedIn);
                if (data.loggedIn) {
                    setName(data.name);
                }
            })
            .catch((error) => {
                console.error("로그인 상태 확인 실패:", error);
                setLoggedIn(false);
            });
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/logout", {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                setLoggedIn(false);
                setName("");
                window.location.href = "/";
            }
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };
    return (
        <div>
            <h1>AI Shopping</h1>
            {loggedIn ? (
                <div> <p>{name}님 환영합니다!</p>
                    <Link to="/account">내 정보 관리</Link>{" "}
                    <button onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            ) : (
                <div>
                    <Link to="/signup">
                        <button>회원가입</button>
                    </Link>
                    <Link to="/login">
                        <button>로그인</button>
                    </Link>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
