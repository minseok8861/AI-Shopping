import "./Signup.css";
import { useState } from "react";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/member/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    name,
                    email,
                    password,
                    password2,
                }),
            });

            console.log("HTTP 상태:", response.status);

            const result = await response.text();

            console.log("서버 응답:", result);
            alert(result);

        } catch (error) {
            console.error(error);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">

                <h1>회원가입</h1>

                <form className="signup-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>아이디</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="아이디 (4~20자)"
                        />
                    </div>

                    <div className="form-group">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호 (8~20자)"
                        />
                    </div>

                    <div className="form-group">
                        <label>비밀번호 확인</label>
                        <input
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            placeholder="비밀번호를 다시 입력하세요"
                        />
                    </div>

                    <div className="form-group">
                        <label>이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                        />
                    </div>

                    <button type="submit">
                        회원가입
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Signup;