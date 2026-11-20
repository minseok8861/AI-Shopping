import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout, PasswordField } from './Login.jsx';
import { Button } from './components/ui/index.js';
import './SIgnup.css';

const headings = [
    '이메일과 비밀번호를 입력해주세요.',
    '이름과 연락처를 입력해주세요.',
    '맞춤 추천을 위한 정보를 입력해 주세요.',
];

function SignupField({ id, label, required = true, unit, ...props }) {
    return (
        <div className="auth-field">
            <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
            <div className={unit ? 'signup-unit-field' : undefined}>
                <input {...props} id={id} required={required} />
                {unit && <span aria-hidden="true">{unit}</span>}
            </div>
        </div>
    );
}

export default function Signup({ accountActions }) {
    const [details, setDetails] = useState({
        email: '', password: '', password2: '',
        fullName: '', phone: '', gender: '', birthDate: '', heightCm: '',
    });
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const passwordsDiffer = Boolean(details.password2 && details.password !== details.password2);

    function field(key) {
        return {
            value: details[key],
            onChange: (event) => {
                const { value } = event.target;
                setDetails((previous) => ({ ...previous, [key]: value }));
            },
        };
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (submitting || passwordsDiffer) return;
        setError('');

        if (step < 2) {
            setStep(step + 1);
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:8080/member/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    ...details,
                    fullName: details.fullName.trim(),
                    phone: details.phone.replaceAll('-', ''),
                }),
            });
            const message = (await response.text()).trim();
            if (response.ok && message === '회원가입이 완료되었습니다.') {
                setStep(3);
            } else {
                setError(message || '회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
            }
        } catch {
            setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setSubmitting(false);
        }
    }

    if (step === 3) {
        return (
            <AuthLayout accountActions={accountActions} className="signup-complete">
                <h1>회원가입을 축하합니다!</h1>
                <p>이제 당신만의 스타일 온도를 찾아볼까요?</p>
                <div className="signup-actions">
                    <Link className="auth-submit signup-back" to="/">홈으로 이동</Link>
                    <Link className="auth-submit" to="/login/email">로그인 하러가기</Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout accountActions={accountActions} className="signup-page">
            <h1>ONDO 회원가입</h1>
            <ol className="signup-progress" aria-label="회원가입 진행">
                {headings.map((heading, index) => (
                    <li key={heading} aria-current={index === step ? 'step' : undefined}
                        aria-label={`${index + 1}단계. ${heading}`} />
                ))}
            </ol>
            <form className={step === 1 ? 'signup-form signup-form--contact' : 'signup-form'}
                onSubmit={handleSubmit}>
                <h2>{headings[step]}</h2>
                {step === 0 && (
                    <div className="signup-fields signup-account-fields">
                        <SignupField id="signup-email" label="이메일 주소" type="email" autoComplete="email"
                            placeholder="ondo@email.com" {...field('email')} />
                        <PasswordField id="signup-password" label="비밀번호" markRequired
                            autoComplete="new-password" placeholder="비밀번호 8~20자"
                            minLength={8} maxLength={20} {...field('password')} required />
                        <PasswordField id="signup-confirm" label="비밀번호 확인" markRequired
                            autoComplete="new-password" {...field('password2')} required
                            error={passwordsDiffer ? '비밀번호가 일치하지 않습니다.' : undefined} />
                    </div>
                )}
                {step === 1 && (
                    <div className="signup-fields">
                        <SignupField id="signup-full-name" label="이름" autoComplete="name"
                            placeholder="김온도" maxLength={100} pattern=".*[^ ].*" {...field('fullName')} />
                        <SignupField id="signup-phone" label="휴대전화" type="tel" autoComplete="tel-national"
                            placeholder="010-1234-5678" pattern="01[0-9]-?[0-9]{3,4}-?[0-9]{4}"
                            title="010-1234-5678 형식으로 입력해주세요." {...field('phone')} />
                    </div>
                )}
                {step === 2 && (
                    <div className="signup-fields">
                        <fieldset className="auth-field signup-gender">
                            <legend>성별<span aria-hidden="true"> *</span></legend>
                            <div>
                                {[['female', '여자'], ['male', '남자']].map(([value, label]) => (
                                    <label key={value}>
                                        <input type="radio" name="gender" value={value}
                                            checked={details.gender === value} onChange={field('gender').onChange} required />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                        <SignupField id="signup-birth-date" label="생년월일" type="date" autoComplete="bday"
                            max={new Intl.DateTimeFormat('sv-SE').format(new Date())} {...field('birthDate')} />
                        <SignupField id="signup-height" label="키" type="number" min={1} max={300}
                            unit="cm" required={false} {...field('heightCm')} />
                    </div>
                )}
                {error && <p className="auth-error signup-error" role="alert">{error}</p>}
                <div className="signup-actions">
                    {step === 0 ? (
                        <Link className="auth-submit signup-back" to="/login">이전</Link>
                    ) : (
                        <Button className="signup-action-button" disabled={submitting}
                            onClick={() => { setError(''); setStep(step - 1); }}>이전</Button>
                    )}
                    <Button variant="black" className="signup-action-button" type="submit"
                        disabled={submitting || passwordsDiffer}>
                        {step === 2 ? '가입 완료' : '다음'}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
