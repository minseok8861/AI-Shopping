import "./Signup.css";

function Signup() {
    return (
        <div className="signup-page">
            <div className="signup-container">

                <h1>회원가입</h1>

                <form className="signup-form">

                    <div className="form-group">
                        <label>성명</label>
                        <input
                            type="text"
                            placeholder="성명을 입력하세요"
                        />
                    </div>

                    <div className="form-group">
                        <label>아이디</label>
                        <input
                            type="text"
                            placeholder="아이디 (4~20자)"
                        />
                    </div>

                    <div className="form-group">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            placeholder="비밀번호 (8~16자)"
                        />
                    </div>

                    <div className="form-group">
                        <label>비밀번호 확인</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
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