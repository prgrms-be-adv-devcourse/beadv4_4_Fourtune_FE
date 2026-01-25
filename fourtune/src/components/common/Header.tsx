import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from './Header.module.css';
import { api } from '../../services/api';

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = api.isAuthenticated();

    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };

    return (
        <header className={classes.header}>
            <div className={`container ${classes.container}`}>
                <Link to="/" className={classes.logo}>
                    CLOV4R
                </Link>
                <nav className={classes.nav}>
                    <Link to="/auctions" className={classes.navSearch}>둘러보기</Link>
                    {isAuthenticated && (
                        <Link to="/auctions/create" className="btn btn-primary btn-sm">
                            상품 등록
                        </Link>
                    )}
                    <Link to="/cart">장바구니</Link>
                    <Link to="/mypage">마이페이지</Link>
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="btn btn-outline btn-sm">로그아웃</button>
                    ) : (
                        <div className={classes.authButtons}>
                            <Link to="/login" className="btn btn-outline">로그인</Link>
                            <Link to="/signup" className="btn btn-primary">회원가입</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};
