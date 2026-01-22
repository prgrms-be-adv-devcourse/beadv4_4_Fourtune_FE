import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from './Auth.module.css';
import { api } from '../../services/api';

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.signup(username, email, password);
            navigate('/');
        } catch (error) {
            alert('Signup failed');
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
                        <label htmlFor="username" className={classes.label}>사용자 이름</label>
                        <input
                            id="username"
                            type="text"
                            className={classes.input}
                            placeholder="홍길동"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
