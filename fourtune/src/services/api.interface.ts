import { type AuctionItem, type SearchResponse, AuctionCategory, AuctionStatus } from '../types';

export interface CreateAuctionRequest {
    title: string;
    description: string;
    category: AuctionCategory;
    startPrice: number;
    buyNowPrice?: number;
    startAt: string; // ISO 8601 format
    endAt: string;   // ISO 8601 format
}

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

    createAuction(data: CreateAuctionRequest, images?: File[]): Promise<AuctionItem>;

    login(email: string, password?: string): Promise<{ user: { email: string; name: string } }>;
    signup(nickname: string, email: string, password?: string, phoneNumber?: string): Promise<{ user: { email: string; name: string } }>;
    logout(): void;
    isAuthenticated(): boolean;
    getCurrentUser(): { email: string; name: string } | null;

    // Payment & Order
    buyNow(auctionId: number): Promise<string>; // Returns orderId
    getPublicOrder(orderId: string): Promise<OrderDetailResponse>;
    confirmPayment(paymentKey: string, orderId: string, amount: number): Promise<void>;
    getMyOrders(): Promise<OrderResponse[]>;
}

export interface OrderDetailResponse {
    id: number;
    orderId: string;
    auctionId: number;
    auctionTitle: string;
    thumbnailUrl: string;
    winnerId: number;
    winnerNickname?: string;
    sellerId: number;
    sellerNickname?: string;
    finalPrice: number;
    orderType: string;
    status: string;
    paymentKey?: string;
    paidAt?: string;
    createdAt: string;
}

export interface OrderResponse {
    id: number;
    orderId: string;
    auctionId: number;
    auctionTitle: string;
    winnerId: number;
    winnerNickname?: string;
    finalPrice: number;
    orderType: 'AUCTION_WIN' | 'BUY_NOW';
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
}
