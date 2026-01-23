import { type AuctionItem, type SearchResponse, AuctionCategory, AuctionStatus } from '../types';

export interface ApiService {
    searchAuctions(params: {
        page?: number;
        size?: number;
        keyword?: string;
        category?: AuctionCategory;
        status?: AuctionStatus;
        sort?: string;
    }): Promise<SearchResponse>;

    getAuctionById(id: number): Promise<AuctionItem>;

    login(email: string, password?: string): Promise<{ user: { email: string; name: string } }>;
    signup(nickname: string, email: string, password?: string, phoneNumber?: string): Promise<{ user: { email: string; name: string } }>;
    logout(): void;
    isAuthenticated(): boolean;
    getCurrentUser(): { email: string; name: string } | null;
}
