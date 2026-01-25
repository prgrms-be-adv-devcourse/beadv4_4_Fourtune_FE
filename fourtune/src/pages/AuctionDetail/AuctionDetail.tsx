import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { type AuctionItem, AuctionStatus } from '../../types';
import { AUCTION_STATUS_KO, AUCTION_CATEGORY_KO } from '../../constants/translations';
import classes from './AuctionDetail.module.css';

const AuctionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<AuctionItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [error, setError] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        if (id) {
            api.getAuctionById(Number(id))
                .then(data => {
                    setItem(data);
                    if (data.imageUrls && data.imageUrls.length > 0) {
                        setSelectedImage(data.imageUrls[0]);
                    }
                })
                .catch(err => {
                    console.error('Error loading auction:', err);
                    setError('Failed to load auction details.');
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    useEffect(() => {
        if (item) {
            try {
                const saved = localStorage.getItem('wishlist');
                const wishlist = saved ? JSON.parse(saved) : [];
                setIsWishlisted(wishlist.includes(item.auctionItemId));
            } catch (e) {
                console.error('Failed to parse wishlist', e);
                setIsWishlisted(false);
            }
        }
    }, [item]);

    const checkAuth = () => {
        if (!api.isAuthenticated()) {
            alert('로그인이 필요한 서비스입니다.');
            return false;
        }
        return true;
    };

    const handleBid = () => {
        if (!item) return;
        if (!checkAuth()) return;
        alert(`Bid placed for ${item.title}! (Mock Action)`);
    };

    const handleBuyNow = () => {
        if (!item) return;
        if (!checkAuth()) return;
        alert(`Buy Now initiated for ${item.title}! (Mock Action)`);
    };

    const toggleWishlist = () => {
        if (!item) return;
        if (!checkAuth()) return;

        try {
            const saved = localStorage.getItem('wishlist');
            let wishlist: number[] = saved ? JSON.parse(saved) : [];

            if (isWishlisted) {
                wishlist = wishlist.filter(wishId => wishId !== item.auctionItemId);
                setIsWishlisted(false);
                alert('관심상품이 해제되었습니다.');
            } else {
                wishlist.push(item.auctionItemId);
                setIsWishlisted(true);
                alert('관심상품으로 등록되었습니다.');
            }
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch (e) {
            console.error('Failed to update wishlist', e);
            alert('관심상품 업데이트 중 오류가 발생했습니다.');
        }
    };

    const getStatusBadge = (status: AuctionStatus) => {
        switch (status) {
            case AuctionStatus.ACTIVE: return classes.badgeRunning;
            case AuctionStatus.ENDED:
            case AuctionStatus.SOLD:
            case AuctionStatus.SOLD_BY_BUY_NOW:
            case AuctionStatus.CANCELLED:
                return classes.badgeClosed;
            case AuctionStatus.SCHEDULED: return classes.badgeReady;
            default: return classes.badgeClosed;
        }
    };

    if (loading) return <div className={classes.container} style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;
    if (error || !item) return <div className={classes.container} style={{ padding: '4rem 0', textAlign: 'center' }}>{error || 'Item not found'}</div>;

    return (
        <div className={classes.container}>
            <Link to="/" className={classes.backLink}>&larr; 목록으로 돌아가기</Link>

            <div className={classes.contentWrapper}>
                {/* Left: Images */}
                <div className={classes.imageSection}>
                    <div className={classes.mainImageContainer}>
                        <img src={selectedImage} alt={item.title} className={classes.mainImage} />
                    </div>
                    <div className={classes.thumbnailGrid}>
                        {item.imageUrls.map((url, idx) => (
                            <div
                                key={idx}
                                className={`${classes.thumbnail} ${selectedImage === url ? classes.active : ''}`}
                                onClick={() => setSelectedImage(url)}
                            >
                                <img src={url} alt={`Thumbnail ${idx + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className={classes.infoSection}>
                    <span className={`${classes.badge} ${getStatusBadge(item.status)}`}>{AUCTION_STATUS_KO[item.status]}</span>
                    <h1 className={classes.title}>{item.title}</h1>
                    <div className={classes.category}>{AUCTION_CATEGORY_KO[item.category]}</div>

                    <div className={classes.priceBox}>
                        <div className={classes.priceRow}>
                            <div>
                                <div className={classes.currentPriceLabel}>현재 입찰가</div>
                                <div className={classes.price}>{item.currentPrice.toLocaleString()}원</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className={classes.currentPriceLabel}>시작가</div>
                                <div style={{ fontWeight: 500 }}>{item.startPrice.toLocaleString()}원</div>
                            </div>
                        </div>

                        <div className={classes.actionButtons}>
                            {item.status === AuctionStatus.ACTIVE && (
                                <>
                                    <button onClick={handleBid} className={`btn btn-primary ${classes.bidButton}`}>
                                        입찰하기
                                    </button>
                                    <button onClick={handleBuyNow} className={`btn ${classes.buyNowButton}`}>
                                        즉시 구매
                                    </button>
                                </>
                            )}
                            <button
                                onClick={toggleWishlist}
                                className={`btn ${isWishlisted ? 'btn-primary' : 'btn-outline'}`}
                                style={{ width: '100%' }}
                            >
                                {/* Heart Icon SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                {isWishlisted ? '관심상품 해제' : '관심상품 추가'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className={classes.descriptionTitle}>상품 설명</h3>
                        <p className={classes.description}>{item.description}</p>
                    </div>

                    <div className={classes.meta}>
                        <div className={classes.metaRow}>
                            <span>상품 ID:</span>
                            <span>#{item.auctionItemId}</span>
                        </div>
                        <div className={classes.metaRow}>
                            <span>시작 일시:</span>
                            <span>{new Date(item.startAt).toLocaleString()}</span>
                        </div>
                        <div className={classes.metaRow}>
                            <span>종료 일시:</span>
                            <span>{new Date(item.endAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetail;
