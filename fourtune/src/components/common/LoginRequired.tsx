import React from 'react';
import { Link } from 'react-router-dom';
import classes from './LoginRequired.module.css';

interface LoginRequiredProps {
    title?: string;
    message?: string;
}

export const LoginRequired: React.FC<LoginRequiredProps> = ({
    title = '로그인이 필요한 서비스입니다.',
    message = '서비스를 이용하시려면 로그인이 필요합니다.'
}) => {
    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <h2 className={classes.title}>{title}</h2>
                <p className={classes.message}>
                    {message}
                </p>
                <div className={classes.buttonGroup}>
                    <Link to="/login" className="btn btn-primary">로그인</Link>
                    <Link to="/signup" className="btn btn-outline">회원가입</Link>
                </div>
            </div>
        </div>
    );
};
