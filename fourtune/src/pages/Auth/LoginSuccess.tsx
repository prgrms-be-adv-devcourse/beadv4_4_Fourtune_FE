import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');

        if (accessToken) {
            localStorage.setItem('token', accessToken);
            // Optionally, you might want to fetch user details here or just redirect
            navigate('/');
        } else {
            // If no token, redirect to login with error
            alert('로그인에 실패했습니다.');
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '1.2rem'
        }}>
            로그인 처리 중...
        </div>
    );
};

export default LoginSuccess;
