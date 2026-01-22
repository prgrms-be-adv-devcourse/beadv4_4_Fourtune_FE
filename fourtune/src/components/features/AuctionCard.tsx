import React from 'react';
import { Link } from 'react-router-dom';
import { type AuctionItem, AuctionStatus } from '../../types';
import classes from './AuctionCard.module.css';

interface AuctionCardProps {
    item: AuctionItem;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ item }) => {
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

    return (
        <Link to={`/auctions/${item.auctionItemId}`} className={classes.card}>
            <div className={classes.imageContainer}>
                <img src={item.imageUrls[0]} alt={item.title} className={classes.image} loading="lazy" />
                <span className={`${classes.badge} ${getStatusBadge(item.status)}`}>
                    {item.status}
                </span>
            </div>
            <div className={classes.content}>
                <div className={classes.category}>{item.category}</div>
                <h3 className={classes.title}>{item.title}</h3>
                <div className={classes.priceSection}>
                    <div className={classes.currentPriceLabel}>현재 입찰가</div>
                    <div className={classes.price}>{item.currentPrice.toLocaleString()}원</div>
                </div>
            </div>
        </Link>
    );
};
