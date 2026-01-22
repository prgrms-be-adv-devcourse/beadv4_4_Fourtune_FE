import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Link imported with React hooks
import { api } from '../../services/api';
import { type AuctionItem } from '../../types';
import { AuctionCard } from '../../components/features/AuctionCard';
import classes from './MyPage.module.css';

type Tab = 'wishlist' | 'bids' | 'history';

const MyPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('wishlist');
    const [wishlistItems, setWishlistItems] = useState<AuctionItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock User Data
    const user = {
        username: "User123",
        email: "user@example.com"
    };

    const isAuthenticated = api.isAuthenticated();

    if (!isAuthenticated) {
        return (
            <div className={classes.container} style={{ justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1rem' }}>로그인이 필요한 서비스입니다.</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                        마이페이지를 이용하시려면 로그인이 필요합니다.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/login" className="btn btn-primary">로그인</Link>
                        <Link to="/signup" className="btn btn-outline">회원가입</Link>
                    </div>
                </div>
            </div>
        );
    }


    useEffect(() => {
        if (activeTab === 'wishlist') {
            fetchWishlist();
        } else {
            setLoading(false);
        }
    }, [activeTab]);

    const fetchWishlist = async () => {
        setLoading(true);
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            const ids: number[] = JSON.parse(saved);
            try {
                const promises = ids.map(id => api.getAuctionById(id).catch(() => null));
                const results = await Promise.all(promises);
                const validItems = results.filter((item): item is AuctionItem => item !== null);
                setWishlistItems(validItems);
            } catch (error) {
                console.error('Error fetching wishlist', error);
            }
        }
        setLoading(false);
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

        if (activeTab === 'bids') {
            return (
                <div className={classes.emptyState}>
                    <h3>참여 중인 입찰 내역이 없습니다.</h3>
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
                    <div className={classes.username}>{user.username}</div>
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
                    {activeTab === 'bids' && '입찰 내역'}
                    {activeTab === 'history' && '활동 기록'}
                </h2>
                {renderContent()}
            </main>
        </div>
    );
};

export default MyPage;
