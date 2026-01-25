import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuctionCategory } from '../../types';
import { AUCTION_CATEGORY_KO } from '../../constants/translations';
import classes from './CategoryNav.module.css';

export const CategoryNav: React.FC = () => {
    const location = useLocation();

    // Helper to check if "All Products" is active (when pathname is /auctions and no category param)
    const isAllActive = location.pathname === '/auctions' && !location.search.includes('category=');

    return (
        <div className={classes.navContainer}>
            <div className={`container ${classes.navContent}`}>
                <NavLink
                    to="/auctions"
                    className={() =>
                        `${classes.navLink} ${isAllActive ? classes.active : ''}`
                    }
                    end
                >
                    전체 상품
                </NavLink>
                {Object.values(AuctionCategory).map((category) => (
                    <NavLink
                        key={category}
                        to={`/auctions?category=${category}`}
                        className={() => {
                            const params = new URLSearchParams(location.search);
                            const isActive = location.pathname === '/auctions' && params.get('category') === category;
                            return `${classes.navLink} ${isActive ? classes.active : ''}`;
                        }}
                    >
                        {AUCTION_CATEGORY_KO[category]}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};
