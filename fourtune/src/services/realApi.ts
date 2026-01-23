import axios from 'axios';
import { type ApiService } from './api.interface';

// Use empty baseURL to leverage Vite's proxy configuration
// The proxy will forward /api/* requests to the backend server
const client = axios.create({
    baseURL: '',
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
