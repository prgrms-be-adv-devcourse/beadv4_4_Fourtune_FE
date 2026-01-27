import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import type { OrderDetailResponse } from '../../services/api.interface';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import styles from './OrderSheet.module.css';

const OrderSheet: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'; // Use test key or env

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('유효하지 않은 주문입니다.');
                setLoading(false);
                return;
            }

            try {
                const data = await api.getOrderById(orderId);
                setOrder(data);
            } catch (err: any) {
                console.error('Failed to fetch order:', err);
                setError('주문 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const handlePayment = async () => {
        if (!order) return;

        try {
            const tossPayments = await loadTossPayments(clientKey);

            // Generate a random success/fail url for now, or match routes
            const baseUrl = window.location.origin;

            await tossPayments.requestPayment('카드', {
                amount: order.finalPrice,
                orderId: order.orderId,
                orderName: order.auctionTitle,
                customerName: order.winnerNickname || '구매자',
                successUrl: `${baseUrl}/payment/success`,
                failUrl: `${baseUrl}/payment/fail`,
            });
        } catch (err) {
            console.error('Payment request failed:', err);
            alert('결제 요청 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div className={styles.container}>로딩 중...</div>;
    if (error) return <div className={styles.container}>{error}</div>;
    if (!order) return <div className={styles.container}>주문 정보가 없습니다.</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>주문/결제</h1>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>주문 상품 정보</h2>
                <div className={styles.productInfo}>
                    <img src={order.thumbnailUrl || '/placeholder.png'} alt={order.auctionTitle} className={styles.thumbnail} />
                    <div className={styles.details}>
                        <p className={styles.productName}>{order.auctionTitle}</p>
                        <p className={styles.productPrice}>{order.finalPrice.toLocaleString()}원</p>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>구매자 정보</h2>
                <div className={styles.infoRow}>
                    <span>닉네임</span>
                    <span>{order.winnerNickname || '불러오는 중...'}</span>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>결제 금액</h2>
                <div className={styles.totalPrice}>
                    <span>최종 결제 금액</span>
                    <span className={styles.priceHighlight}>{order.finalPrice.toLocaleString()}원</span>
                </div>
            </div>

            <button className={styles.payButton} onClick={handlePayment}>
                {order.finalPrice.toLocaleString()}원 결제하기
            </button>
        </div>
    );
};

export default OrderSheet;
