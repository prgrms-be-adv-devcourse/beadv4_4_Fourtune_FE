import { MOCK_AUCTIONS } from './mockData';
import { type ApiService } from './api.interface';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi: ApiService = {
    searchAuctions: async (params) => {
        await delay(500);

        let filtered = [...MOCK_AUCTIONS];

        // Filter by Keyword
        if (params.keyword) {
            const lower = params.keyword.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(lower) ||
                item.description.toLowerCase().includes(lower)
            );
        }

        // Filter by Category
        if (params.category) {
            filtered = filtered.filter(item => item.category === params.category);
        }

        // Filter by Status
        if (params.status) {
            filtered = filtered.filter(item => item.status === params.status);
        }

        // Sort
        if (params.sort === 'POPULAR') {
            filtered.sort((a, b) => b.currentPrice - a.currentPrice); // Mock popular by price
        } else {
            // Default LATEST (Sort by createdAt desc)
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        // Pagination
        const page = params.page || 0;
        const size = params.size || 10;
        const start = page * size;
        const end = start + size;
        const items = filtered.slice(start, end);
        const totalPages = Math.ceil(filtered.length / size);

        return {
            items,
            page,
            size,
            totalPages
        };
    },

    getAuctionById: async (id: number) => {
        await delay(500);
        const item = MOCK_AUCTIONS.find(a => a.auctionItemId === id);
        if (!item) throw new Error('Auction not found');
        return item;
    },

    // Mock Auth
    login: async (email: string) => {
        await delay(800);
        const user = { email, name: 'Test User' };
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(user));
        return { user };
    },

    signup: async (nickname: string, email: string) => {
        await delay(800);
        const user = { email, name: nickname };
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(user));
        return { user };
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isAuthenticated: () => !!localStorage.getItem('token'),

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};
