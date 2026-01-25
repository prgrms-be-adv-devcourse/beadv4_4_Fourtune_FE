import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'fail'>('loading');

    useEffect(() => {
        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');

        if (!paymentKey || !orderId || !amount) {
            alert('결제 정보가 부족합니다.');
            navigate('/');
            return;
        }

        // Confirm payment
        api.confirmPayment(paymentKey, orderId, Number(amount))
            .then(() => {
                setStatus('success');
            })
            .catch((err) => {
                console.error('Payment confirmation failed:', err);
                setStatus('fail');
            });
    }, [searchParams, navigate]);

    if (status === 'loading') {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>결제 승인 처리 중입니다...</div>;
    }

    if (status === 'fail') {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>결제 승인 실패</h2>
                <p>결제는 완료되었으나 서버 승인 중 오류가 발생했습니다.</p>
                <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h1 style={{ color: '#2db400' }}>결제 완료!</h1>
            <p><strong>주문번호:</strong> {searchParams.get('orderId')}</p>
            <p><strong>결제금액:</strong> {Number(searchParams.get('amount')).toLocaleString()}원</p>
            <div style={{ marginTop: '2rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    홈으로 이동
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
