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

    createAuction: async (data, images) => {
        await delay(800);

        // Check authentication
        if (!mockApi.isAuthenticated()) {
            throw new Error('로그인이 필요합니다.');
        }

        // Create mock auction item
        const newAuction = {
            auctionItemId: Date.now(),
            title: data.title,
            description: data.description,
            category: data.category,
            status: 'SCHEDULED' as const,
            startPrice: data.startPrice,
            currentPrice: data.startPrice,
            startAt: data.startAt,
            endAt: data.endAt,
            imageUrls: images ? images.map((_, i) => `https://picsum.photos/800/600?random=${Date.now() + i}`) : [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // In a real scenario, this would be added to the backend
        // For mock, we'll just return it
        return newAuction;
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
    },

    // Mock Payment & Order
    buyNow: async (auctionId: number) => {
        await delay(500);
        return `MOCK_ORDER_${Date.now()}`;
    },

    getPublicOrder: async (orderId: string) => {
        await delay(500);
        return {
            id: 12345,
            orderId: orderId,
            auctionId: 1,
            auctionTitle: 'Mock Auction Item',
            thumbnailUrl: 'https://picsum.photos/200/300',
            winnerId: 100,
            winnerNickname: 'MockWinner',
            sellerId: 200,
            sellerNickname: 'MockSeller',
            finalPrice: 10000,
            orderType: 'BUY_NOW',
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };
    },

    confirmPayment: async (paymentKey: string, orderId: string, amount: number) => {
        await delay(1000);
        console.log(`[Mock] Payment Confirmed: ${paymentKey}, ${orderId}, ${amount}`);
    }
};
