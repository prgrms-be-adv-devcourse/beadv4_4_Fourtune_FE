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
            // Default LATEST (by id desc for mock)
            filtered.sort((a, b) => b.auctionItemId - a.auctionItemId);
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
        localStorage.setItem('token', 'mock-jwt-token');
        return { user: { email, name: 'Test User' } };
    },

    signup: async (username: string, email: string) => {
        await delay(800);
        localStorage.setItem('token', 'mock-jwt-token');
        return { user: { email, name: username } };
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: () => !!localStorage.getItem('token')
};
