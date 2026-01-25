import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { api } from '../../services/api';
import type { OrderDetailResponse } from '../../services/api.interface';

const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;

const Payment: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('orderId');

    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            alert('잘못된 접근입니다.');
            navigate('/');
            return;
        }

        api.getPublicOrder(orderId)
            .then(data => setOrder(data))
            .catch(err => {
                console.error(err);
                alert('주문 정보를 불러오는데 실패했습니다.');
                navigate(-1);
            })
            .finally(() => setLoading(false));
    }, [orderId, navigate]);

    const handlePayment = async () => {
        if (!order || !order.finalPrice) {
            alert('결제 금액 정보가 유효하지 않습니다.');
            return;
        }

        try {
            const tossPayments = await loadTossPayments(clientKey);
            const payment = tossPayments.payment({ customerKey: `USER-${order.winnerId}` }); // Use winnerId for customerKey

            await payment.requestPayment({
                method: 'CARD',
                amount: {
                    currency: 'KRW',
                    value: order.finalPrice,
                },
                orderId: order.orderId,
                orderName: order.auctionTitle,
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
                customerEmail: 'customer@example.com', // Optional
                customerName: '구매자', // Optional
            });
        } catch (error) {
            console.error('Payment request failed:', error);
            alert('결제 요청 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div>Loading order...</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1>주문 결제</h1>
            <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <p><strong>주문번호:</strong> {order.orderId}</p>
                <p><strong>상품명:</strong> {order.auctionTitle}</p>
                <p><strong>결제금액:</strong> {order.finalPrice?.toLocaleString() || '0'}원</p>
            </div>
            <button
                onClick={handlePayment}
                style={{
                    backgroundColor: '#3182f6',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    width: '100%'
                }}
            >
                결제하기
            </button>
        </div>
    );
};

export default Payment;
