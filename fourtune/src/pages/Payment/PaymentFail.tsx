import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import classes from './PaymentResult.module.css';

const PaymentFail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get('code');
    const message = searchParams.get('message');

    return (
        <div className={classes.container}>
            <div className={classes.card}>
                <div className={`${classes.iconWrapper} ${classes.iconFail}`}>
                    !
                </div>
                <h1 className={classes.title}>결제 실패</h1>
                <p className={classes.message}>
                    결제 진행 중 오류가 발생했습니다.<br />
                    다시 시도해 주세요.
                </p>

                <div className={classes.detailsBox} style={{ background: '#fef2f2', borderColor: '#fee2e2' }}>
                    <div className={classes.detailRow}>
                        <span className={classes.detailLabel}>에러 코드</span>
                        <span className={classes.errorCode}>{code}</span>
                    </div>
                    <div className={classes.detailRow}>
                        <span className={classes.detailLabel}>사유</span>
                        <span className={classes.detailValue} style={{ color: '#b91c1c' }}>{message}</span>
                    </div>
                </div>

                <div className={classes.buttonGroup}>
                    <button
                        className={classes.secondaryButton}
                        onClick={() => navigate('/')}
                    >
                        취소
                    </button>
                    <button
                        className={classes.primaryButton}
                        onClick={() => navigate(-1)}
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;
