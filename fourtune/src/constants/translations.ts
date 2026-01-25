import { AuctionStatus, AuctionCategory } from '../types';

export const AUCTION_STATUS_KO: Record<AuctionStatus, string> = {
    [AuctionStatus.SCHEDULED]: '경매 예정',
    [AuctionStatus.ACTIVE]: '진행중',
    [AuctionStatus.ENDED]: '종료됨',
    [AuctionStatus.SOLD]: '낙찰됨',
    [AuctionStatus.SOLD_BY_BUY_NOW]: '즉시 구매됨',
    [AuctionStatus.CANCELLED]: '취소됨',
};

export const AUCTION_CATEGORY_KO: Record<AuctionCategory, string> = {
    [AuctionCategory.ELECTRONICS]: '전자제품',
    [AuctionCategory.CLOTHING]: '의류',
    [AuctionCategory.POTTERY]: '도자기',
    [AuctionCategory.APPLIANCES]: '가전제품',
    [AuctionCategory.BEDDING]: '침구',
    [AuctionCategory.BOOKS]: '도서',
    [AuctionCategory.COLLECTIBLES]: '수집품',
    [AuctionCategory.ETC]: '기타',
};
