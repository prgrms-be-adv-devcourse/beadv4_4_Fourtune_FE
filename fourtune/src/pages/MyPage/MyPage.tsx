import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { type AuctionItem } from '../../types';
import { AuctionCard } from '../../components/features/AuctionCard';
import classes from './MyPage.module.css';
import { LoginRequired } from '../../components/common/LoginRequired';

type Tab = 'wishlist' | 'bids' | 'orders' | 'history';

const MyPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('wishlist');
    const [wishlistItems, setWishlistItems] = useState<AuctionItem[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // User Data
    const user = api.getCurrentUser() || { name: 'Unknown', email: 'unknown@example.com' };

    const isAuthenticated = api.isAuthenticated();

    if (!isAuthenticated) {
        return (
            <LoginRequired
                message="마이페이지를 이용하시려면 로그인이 필요합니다."
            />
        );
    }

    useEffect(() => {
        if (activeTab === 'wishlist') {
            fetchWishlist();
        } else if (activeTab === 'orders') {
            fetchOrders();
        } else if (activeTab === 'bids') {
            fetchBids();
        } else {
            setLoading(false);
        }
    }, [activeTab]);

    const fetchWishlist = async () => {
        setLoading(true);
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            try {
                const ids: number[] = JSON.parse(saved);
                const promises = ids.map(id => api.getAuctionById(id).catch(() => null));
                const results = await Promise.all(promises);
                const validItems = results.filter((item): item is AuctionItem => item !== null);
                setWishlistItems(validItems);
            } catch (error) {
                console.error('Error fetching wishlist', error);
                setWishlistItems([]);
            }
        } else {
            setWishlistItems([]);
        }
        setLoading(false);
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await api.getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBids = async () => {
        setLoading(true);
        try {
            const data = await api.getMyBids();
            setBids(data);
        } catch (error) {
            console.error('Error fetching bids', error);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (activeTab === 'wishlist') {
            if (loading) return <div>불러오는 중...</div>;
            if (wishlistItems.length === 0) {
                return (
                    <div className={classes.emptyState}>
                        <h3>관심상품이 없습니다.</h3>
                        <p>경매 상품을 둘러보고 마음에 드는 상품을 추가해보세요!</p>
                    </div>
                );
            }
            return (
                <div className={classes.grid}>
                    {wishlistItems.map(item => (
                        <AuctionCard key={item.auctionItemId} item={item} />
                    ))}
                </div>
            );
        }

        if (activeTab === 'orders') {
            if (loading) return <div>불러오는 중...</div>;
            if (orders.length === 0) {
                return (
                    <div className={classes.emptyState}>
                        <h3>구매 내역이 없습니다.</h3>
                        <p>다양한 경매 상품에 참여해보세요!</p>
                    </div>
                );
            }
            return (
                <div className={classes.listContainer} style={{ display: 'block' }}>
                    {orders.map((order) => (
                        <div key={order.orderId} className={classes.orderCard} style={{
                            border: '1px solid #eee',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'white'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                    {new Date(order.createdAt).toLocaleDateString()} | 주문번호 {order.orderId}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{order.auctionTitle}</h3>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <span className={`${classes.badge} ${order.orderType === 'BUY_NOW' ? classes.badgeReady : classes.badgeRunning}`} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                                        {order.orderType === 'BUY_NOW' ? '즉시 구매' : '경매 낙찰'}
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>{order.finalPrice.toLocaleString()}원</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: order.status === 'COMPLETED' ? '#e6f4ea' : '#fce8e6',
                                    color: order.status === 'COMPLETED' ? '#1e7e34' : '#c53030',
                                    fontSize: '0.9rem',
                                    fontWeight: 500
                                }}>
                                    {order.status === 'COMPLETED' ? '결제 완료' : order.status === 'PENDING' ? '결제 대기' : '취소됨'}
                                </div>
                                {order.status === 'PENDING' && (
                                    <Link
                                        to={`/payment?orderId=${order.orderId}`}
                                        className="btn btn-primary"
                                        style={{
                                            padding: '6px 12px',
                                            fontSize: '0.9rem',
                                            marginTop: '0.5rem',
                                            display: 'inline-block',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        결제하기
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'bids') {
            if (loading) return <div>불러오는 중...</div>;
            if (bids.length === 0) {
                return (
                    <div className={classes.emptyState}>
                        <h3>참여 중인 입찰 내역이 없습니다.</h3>
                    </div>
                );
            }
            return (
                <div className={classes.listContainer} style={{ display: 'block' }}>
                    {bids.map((bid) => (
                        <div key={bid.id} className={classes.orderCard} style={{
                            border: '1px solid #eee',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'white'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                    {new Date(bid.createdAt).toLocaleDateString()} | 입찰번호 {bid.id}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                    <Link to={`/auctions/${bid.auctionId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        경매 상품 #{bid.auctionId} (바로가기)
                                    </Link>
                                </h3>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <span style={{ fontWeight: 'bold' }}>입찰가: {bid.bidAmount.toLocaleString()}원</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: bid.isWinning ? '#e6f4ea' : '#f5f5f5',
                                    color: bid.isWinning ? '#1e7e34' : '#666',
                                    fontSize: '0.9rem',
                                    fontWeight: 500
                                }}>
                                    {bid.isWinning ? '현재 최고가' : '패찰 (상위 입찰 있음)'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'history') {
            return (
                <div className={classes.emptyState}>
                    <h3>과거 활동 내역이 없습니다.</h3>
                </div>
            );
        }
    };

    return (
        <div className={classes.container}>
            <aside className={classes.sidebar}>
                <div className={classes.profileInfo}>
                    <div className={classes.avatar}>👤</div>
                    <div className={classes.username}>{user.name}</div>
                    <div className={classes.email}>{user.email}</div>
                </div>
                <nav className={classes.menu}>
                    <button
                        className={`${classes.menuItem} ${activeTab === 'wishlist' ? classes.activeMenu : ''}`}
                        onClick={() => setActiveTab('wishlist')}
                    >
                        ❤️ 관심상품
                    </button>
                    <button
                        className={`${classes.menuItem} ${activeTab === 'orders' ? classes.activeMenu : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        📦 구매 내역
                    </button>
                    <button
                        className={`${classes.menuItem} ${activeTab === 'bids' ? classes.activeMenu : ''}`}
                        onClick={() => setActiveTab('bids')}
                    >
                        🔨 입찰 내역
                    </button>
                    <button
                        className={`${classes.menuItem} ${activeTab === 'history' ? classes.activeMenu : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        📋 활동 기록
                    </button>
                </nav>
            </aside>

            <main className={classes.content}>
                <h2 className={classes.sectionTitle}>
                    {activeTab === 'wishlist' && '관심상품'}
                    {activeTab === 'orders' && '구매 내역'}
                    {activeTab === 'bids' && '입찰 내역'}
                    {activeTab === 'history' && '활동 기록'}
                </h2>
                {renderContent()}
            </main>
        </div>
    );
};

export default MyPage;
