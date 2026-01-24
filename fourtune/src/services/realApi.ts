import axios from 'axios';
import { type ApiService } from './api.interface';

// Use VITE_BACKEND_URL environment variable for backend server address
// This keeps the backend URL secure and not exposed in the codebase
const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
const client = axios.create({
    baseURL: backendUrl,
    headers: {
        'Content-Type': 'application/json',
    },
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
        const response = await client.get('/api/auctions', { params });
        return response.data;
    },

    getAuctionById: async (id: number) => {
        const response = await client.get(`/api/auctions/${id}`);
        return response.data;
    },

    createAuction: async (data, images) => {
        const formData = new FormData();

        // Clean up data: convert empty buyNowPrice to undefined
        const cleanedData = {
            ...data,
            buyNowPrice: data.buyNowPrice || undefined,
            // Ensure datetime is in ISO 8601 format
            startAt: new Date(data.startAt).toISOString(),
            endAt: new Date(data.endAt).toISOString(),
        };

        // Add JSON data as a blob with proper content type
        const requestBlob = new Blob([JSON.stringify(cleanedData)], {
            type: 'application/json'
        });
        formData.append('request', requestBlob);

        // Add image files if provided
        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append('images', image);
            });
        }

        const response = await client.post('/api/v1/auctions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
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
