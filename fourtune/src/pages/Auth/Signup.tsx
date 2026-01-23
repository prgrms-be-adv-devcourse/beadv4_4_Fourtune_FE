import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from './Auth.module.css';
import { api } from '../../services/api';

const Signup: React.FC = () => {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.signup(nickname, email, password, phoneNumber);
            navigate('/');
        } catch (error: any) {
            let message = '회원가입에 실패했습니다.';
            if (error.response && error.response.data) {
                if (typeof error.response.data === 'string') {
                    message = error.response.data;
                } else if (error.response.data.message) {
                    message = error.response.data.message;
                }
            }
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={classes.container}>
            <div className={classes.authCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ border: 'none', padding: 0 }}>
                        &larr; 뒤로가기
                    </button>
                    <Link to="/" className="btn btn-outline btn-sm" style={{ border: 'none', padding: 0 }}>
                        메인으로 🏠
                    </Link>
                </div>
                <h1 className={classes.title}>회원가입</h1>
                <form onSubmit={handleSubmit} className={classes.form}>
                    <div className={classes.formGroup}>
                        <label htmlFor="nickname" className={classes.label}>사용자 이름 (닉네임)</label>
                        <input
                            id="nickname"
                            type="text"
                            className={classes.input}
                            placeholder="홍길동"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="email" className={classes.label}>이메일</label>
                        <input
                            id="email"
                            type="email"
                            className={classes.input}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="password" className={classes.label}>비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            className={classes.input}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="phoneNumber" className={classes.label}>전화번호</label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            className={classes.input}
                            placeholder="010-1234-5678"
                            pattern="^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$"
                            title="010-1234-5678 형식으로 입력해주세요."
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={`btn btn-primary ${classes.submitBtn}`} disabled={isLoading}>
                        {isLoading ? '가입 중...' : '회원가입'}
                    </button>
                </form>
                <div className={classes.footer}>
                    이미 계정이 있으신가요?
                    <Link to="/login" className={classes.link}>로그인</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
