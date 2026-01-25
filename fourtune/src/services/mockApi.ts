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

    // Bidding Mock
    placeBid: async (auctionId: number, bidAmount: number) => {
        await delay(500);
        // Find auction and update price
        const auction = MOCK_AUCTIONS.find(a => a.auctionItemId === auctionId);
        if (!auction) throw new Error("Auction not found");

        if (bidAmount <= auction.currentPrice) {
            throw new Error("입찰가는 현재가보다 높아야 합니다.");
        }

        auction.currentPrice = bidAmount; // Hacky update for mock

        // Mock Response
        return {
            id: Date.now(),
            auctionId: auctionId,
            auctionTitle: auction.title,
            bidderId: 1,
            bidderNickname: "MockUser",
            bidAmount: bidAmount,
            status: "ACTIVE" as any,
            isWinning: true,
            createdAt: new Date().toISOString(),
            message: "현재 최고 입찰자입니다."
        };
    },

    getMyBids: async () => {
        await delay(500);
        return [];
    },

    getAuctionBids: async (auctionId: number) => {
        await delay(500);
        return {
            auctionId,
            bids: []
        };
    },

    // Mock Payment & Order
    buyNow: async (_auctionId: number) => {
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

    getOrderByAuctionId: async (_auctionId: number) => {
        await delay(500);
        throw new Error('Mock not implemented for getOrderByAuctionId');
    },

    confirmPayment: async (paymentKey: string, orderId: string, amount: number) => {
        await delay(1000);
        console.log(`[Mock] Payment Confirmed: ${paymentKey}, ${orderId}, ${amount}`);
    },

    getMyOrders: async () => {
        await delay(500);
        return [];
    },

    // Mock Cart Implementation
    getCart: async () => {
        await delay(500);
        return {
            id: 1,
            userId: 1,
            totalItemCount: 0,
            activeItemCount: 0,
            totalPrice: 0,
            items: []
        };
    },

    getCartItemCount: async () => {
        await delay(300);
        return 0;
    },

    addItemToCart: async (_auctionId: number) => {
        await delay(500);
        console.log('Mock: Added to cart', _auctionId);
    },

    removeItemFromCart: async (_cartItemId: number) => {
        await delay(500);
        console.log('Mock: Removed from cart', _cartItemId);
    },

    buyNowFromCart: async (_cartItemIds: number[]) => {
        await delay(1000);
        console.log('Mock: Bought from cart', _cartItemIds);
        return [`MOCK_ORDER_CART_${Date.now()}`];
    },

    buyNowAllCart: async () => {
        await delay(1000);
        console.log('Mock: Bought all from cart');
        return [`MOCK_ORDER_CART_ALL_${Date.now()}`];
    },

    clearExpiredItems: async () => {
        await delay(500);
        console.log('Mock: Cleared expired items');
    }
};
