import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Account.css";

const endpoint = "http://localhost:8080/member/me";

async function request(options = {}) {
    const response = await fetch(endpoint, { credentials: "include", ...options });
    if (response.status === 401) throw new Error("로그인 후 이용해 주세요.");
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "요청을 처리하지 못했습니다.");
    }
    return response.status === 204 ? null : response.json();
}

export default function Account() {
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        request().then((data) => {
            setMember(data);
            setEmail(data.email);
        }).catch((error) => setMessage(error.message));
    }, []);

    async function update(event) {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("새 비밀번호가 일치하지 않습니다.");
            return;
        }
        setBusy(true);
        setMessage("");
        try {
            const data = await request({
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, currentPassword, newPassword }),
            });
            setMember(data);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setMessage("회원 정보를 수정했습니다.");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setBusy(false);
        }
    }

    async function withdraw() {
        if (!currentPassword) {
            setMessage("탈퇴하려면 현재 비밀번호를 입력해 주세요.");
            return;
        }
        if (!window.confirm("정말 탈퇴하시겠습니까? 회원 정보가 삭제됩니다.")) return;
        setBusy(true);
        setMessage("");
        try {
            await request({
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword }),
            });
            navigate("/", { replace: true });
        } catch (error) {
            setMessage(error.message);
            setBusy(false);
        }
    }

    return (
        <main className="account-page">
            <div className="account-card">
                <Link to="/">← 홈으로</Link>
                <h1>내 정보 관리</h1>
                {member && <form onSubmit={update}>
                    <label>아이디<input value={member.name} readOnly /></label>
                    <label>이메일<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                    <label>현재 비밀번호<input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" required /></label>
                    <label>새 비밀번호 <small>(변경할 때만 입력)</small><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} maxLength={20} autoComplete="new-password" /></label>
                    <label>새 비밀번호 확인<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} maxLength={20} autoComplete="new-password" /></label>
                    <button type="submit" disabled={busy}>정보 수정</button>
                    <button type="button" className="withdraw" onClick={withdraw} disabled={busy}>회원 탈퇴</button>
                </form>}
                {message && <p role="status">{message}</p>}
                {!member && <Link to="/login">로그인하기</Link>}
            </div>
        </main>
    );
}
