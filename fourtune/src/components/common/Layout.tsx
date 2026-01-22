import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, padding: '2rem 0' }}>
                <div className="container">
                    <Outlet />
                </div>
            </main>
            <footer style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--color-text-muted)',
                borderTop: '1px solid var(--color-border)',
                marginTop: 'auto',
                backgroundColor: 'var(--color-bg-surface)'
            }}>
                © 2026 AuctionApp. All rights reserved.
            </footer>
        </div>
    );
};
