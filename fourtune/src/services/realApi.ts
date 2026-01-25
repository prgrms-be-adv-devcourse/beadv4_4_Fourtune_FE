import axios from 'axios';
import { type ApiService } from './api.interface';

// Use VITE_BACKEND_URL environment variable for backend server address
// This keeps the backend URL secure and not exposed in the codebase
const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
const client = axios.create({
    baseURL: backendUrl,
});

// Request interceptor to add token
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const realApi: ApiService = {
    searchAuctions: async (params) => {
        const queryParams: any = {
            keyword: params.keyword || undefined,
            searchPriceRange: undefined, // Add if needed
            sort: params.sort || 'LATEST',
            page: (params.page || 0) + 1,
            size: params.size || 12,
        };

        if (params.category && (params.category as string) !== '') queryParams.categories = params.category;
        if (params.status && (params.status as string) !== '') queryParams.statuses = params.status;

        const response = await client.get('/api/v1/search/auction-items', { params: queryParams });
        const data = response.data; // SearchResultPage

        // Map backend SearchAuctionItemView to frontend AuctionItem interface
        const items = data.items.map((item: any) => ({
            auctionItemId: item.auctionItemId,
            title: item.title,
            description: item.description,
            category: item.category,
            status: item.status,
            startPrice: item.startPrice,
            currentPrice: item.currentPrice,
            startAt: item.startAt || '',
            endAt: item.endAt || '',
            imageUrls: item.thumbnailUrl ? [item.thumbnailUrl] : [], // Map thumbnail to array
            createdAt: item.createdAt || '',
            updatedAt: item.updatedAt || '',
            // Additional fields from ES view if needed in UI: viewCount, etc.
        }));

        return {
            items,
            page: data.page - 1,   // Convert back to 0-based
            size: data.size,
            totalPages: Math.ceil(data.totalElements / data.size) // Calculate totalPages from totalElements
        };
    },

    getAuctionById: async (id: number) => {
        const response = await client.get(`/api/v1/auctions/${id}`);
        const data = response.data;

        return {
            auctionItemId: data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            status: data.status,
            startPrice: data.startPrice,
            currentPrice: data.currentPrice,
            startAt: data.auctionStartTime,
            endAt: data.auctionEndTime,
            imageUrls: data.imageUrls || [],
            // These fields are not in the detail response but required by interface
            createdAt: '',
            updatedAt: '',
        };
    },

    createAuction: async (data, images) => {
        const formData = new FormData();

        // Clean up data and map fields to backend DTO

        const payload = {
            title: data.title,
            description: data.description,
            category: data.category,
            startPrice: data.startPrice,
            bidUnit: undefined, // Add if needed
            buyNowPrice: data.buyNowPrice || undefined,
            auctionStartTime: new Date(data.startAt).toISOString().split('.')[0],
            auctionEndTime: new Date(data.endAt).toISOString().split('.')[0],
        };

        console.log('Sending createAuction payload:', payload);

        // Add JSON data as a blob with proper content type
        const requestBlob = new Blob([JSON.stringify(payload)], {
            type: 'application/json'
        });
        formData.append('request', requestBlob, 'request.json');

        // Add image files if provided
        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append('images', image);
            });
        }

        const response = await client.post('/api/v1/auctions', formData);
        return response.data;
    },

    login: async (email, password) => {
        const response = await client.post('/api/auth/login', { email, password });
        // Assuming response.data is TokenResponse { accessToken: string, ... }
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);

        // Since login endpoint only returns token, we might need to decode it or fetch profile
        // For now, returning mock user context to satisfy interface
        return { user: { email, name: 'User' } };
    },

    signup: async (nickname, email, password, phoneNumber) => {
        // Backend returns Void (201 Created)
        await client.post('/api/users/signup', { nickname, email, password, phoneNumber });
        return { user: { email, name: nickname } };
    },

    logout: () => {
        localStorage.removeItem('token');
        // Optional: Call network logout if needed
        // client.post('/api/auth/logout').catch(() => {});
    },

    isAuthenticated: () => !!localStorage.getItem('token'),

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};
