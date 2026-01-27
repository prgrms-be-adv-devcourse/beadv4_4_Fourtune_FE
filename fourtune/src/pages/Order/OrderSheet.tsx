import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { OrderDetailResponse } from '../../services/api.interface';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import styles from './OrderSheet.module.css';

const OrderSheet: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

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
            const baseUrl = window.location.origin;

            await tossPayments.requestPayment('카드', {
                amount: order.finalPrice,
                orderId: order.orderId,
                orderName: order.auctionTitle,
                customerName: order.winnerNickname || '구매자',
                successUrl: `${baseUrl}/payment/success`,
                failUrl: `${baseUrl}/payment/fail`,
            });
        } catch (err: any) {
            if (err.code === 'USER_CANCEL') {
                // User cancelled, no api error
            } else {
                console.error('Payment request failed:', err);
                alert('결제 요청 중 오류가 발생했습니다.');
            }
        }
    };

    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>주문 정보를 불러오는 중입니다...</p>
        </div>
    );

    if (error) return (
        <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>!</div>
            <p className={styles.errorMessage}>{error}</p>
            <button className={styles.backButton} onClick={() => navigate(-1)}>돌아가기</button>
        </div>
    );

    if (!order) return null;

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>주문서</h1>
                    <span className={styles.orderId}>No. {order.orderId}</span>
                </header>

                <div className={styles.contentGrid}>
                    {/* Left Column: Product & Info */}
                    <div className={styles.leftColumn}>
                        <section className={styles.card}>
                            <h2 className={styles.cardTitle}>주문 상품</h2>
                            <div className={styles.productItem}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={order.thumbnailUrl || 'https://placehold.co/200x200?text=No+Image'}
                                        alt={order.auctionTitle}
                                        className={styles.productImage}
                                    />
                                </div>
                                <div className={styles.productDetails}>
                                    <div className={styles.productTitle}>{order.auctionTitle}</div>
                                    <div className={styles.priceRow}>
                                        <span className={styles.label}>낙찰가</span>
                                        <span className={styles.value}>{order.finalPrice.toLocaleString()}원</span>
                                    </div>
                                    <div className={styles.sellerRow}>
                                        <span className={styles.label}>판매자</span>
                                        <span className={styles.value}>{order.sellerNickname || '알 수 없음'}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={styles.card}>
                            <h2 className={styles.cardTitle}>주문자 정보</h2>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>보내는 분</span>
                                    <span className={styles.infoValue}>{order.winnerNickname}</span>
                                </div>
                                {/* Address field could be added here in future */}
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>이메일</span>
                                    <span className={styles.infoValue}>-</span> {/* User email access if needed */}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Payment Summary */}
                    <div className={styles.rightColumn}>
                        <section className={`${styles.card} ${styles.paymentCard}`}>
                            <h2 className={styles.cardTitle}>결제 상세</h2>

                            <div className={styles.summaryRow}>
                                <span>주문 금액</span>
                                <span>{order.finalPrice.toLocaleString()}원</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>수수료</span>
                                <span>0원</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>배송비</span>
                                <span>무료</span>
                            </div>

                            <div className={styles.divider}></div>

                            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                <span>총 결제 금액</span>
                                <span className={styles.totalPrice}>{order.finalPrice.toLocaleString()}원</span>
                            </div>

                            <div className={styles.paymentMethods}>
                                <div className={`${styles.method} ${styles.active}`}>
                                    <span className={styles.methodIcon}>💳</span>
                                    <span>카드 결제</span>
                                </div>
                                {/* Future methods */}
                                {/* <div className={styles.method}>
                                    <span>🏦 계좌이체</span>
                                </div> */}
                            </div>

                            <button className={styles.payButton} onClick={handlePayment}>
                                {order.finalPrice.toLocaleString()}원 결제하기
                            </button>

                            <p className={styles.terms}>
                                위 주문 내용을 확인하였으며, 결제에 동의합니다.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSheet;
