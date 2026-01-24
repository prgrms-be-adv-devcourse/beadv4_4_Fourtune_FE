import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import classes from './CreateAuction.module.css';
import { api } from '../../services/api';
import { AuctionCategory } from '../../types';
import type { CreateAuctionRequest } from '../../services/api.interface';

const CreateAuction: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [formData, setFormData] = useState<CreateAuctionRequest>({
        title: '',
        description: '',
        category: AuctionCategory.ETC,
        startPrice: 0,
        buyNowPrice: undefined,
        startAt: '',
        endAt: '',
    });

    // Check authentication on mount
    useEffect(() => {
        if (!api.isAuthenticated()) {
            alert('로그인이 필요합니다.');
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'startPrice' || name === 'buyNowPrice' ? Number(value) : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files);
            setImages(fileList);
        }
    };

    const validateForm = (): string | null => {
        if (!formData.title.trim()) return '제목을 입력해주세요.';
        if (!formData.description.trim()) return '설명을 입력해주세요.';
        if (formData.startPrice <= 0) return '시작가는 0보다 커야 합니다.';
        if (formData.buyNowPrice && formData.buyNowPrice <= formData.startPrice) {
            return '즉시구매가는 시작가보다 커야 합니다.';
        }
        if (!formData.startAt) return '경매 시작 시간을 입력해주세요.';
        if (!formData.endAt) return '경매 종료 시간을 입력해주세요.';

        const now = new Date();
        const startAt = new Date(formData.startAt);
        const endAt = new Date(formData.endAt);

        if (startAt <= now) return '경매 시작 시간은 현재 시간보다 이후여야 합니다.';
        if (endAt <= startAt) return '경매 종료 시간은 시작 시간보다 이후여야 합니다.';

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const error = validateForm();
        if (error) {
            alert(error);
            return;
        }

        setIsLoading(true);
        try {
            const createdAuction = await api.createAuction(formData, images.length > 0 ? images : undefined);
            alert('경매 상품이 등록되었습니다!');
            navigate(`/auctions/${createdAuction.auctionItemId}`);
        } catch (e) {
            const error = e as AxiosError<any>;
            console.error('Auction creation error:', error);

            let message = '경매 상품 등록에 실패했습니다.';
            let details = '';

            if (error.response) {
                // Server responded with a status code out of 2xx range
                message = `서버 오류 (${error.response.status})`;
                if (typeof error.response.data === 'string') {
                    details = error.response.data;
                } else if (error.response.data && typeof error.response.data === 'object') {
                    // Prettify JSON object to show field names
                    details = JSON.stringify(error.response.data, null, 2);
                    if (error.response.data.message) {
                        message = error.response.data.message;
                    }
                }
            } else if (error.request) {
                message = '서버로부터 응답이 없습니다.';
            } else {
                message = error.message;
            }

            alert(`${message}\n\n상세 정보: ${details}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={classes.container}>
            <div className={classes.formCard}>
                <div className={classes.header}>
                    <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
                        ← 뒤로가기
                    </button>
                    <h1 className={classes.title}>경매 상품 등록</h1>
                </div>

                <form onSubmit={handleSubmit} className={classes.form}>
                    <div className={classes.formGroup}>
                        <label htmlFor="title" className={classes.label}>제목 *</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className={classes.input}
                            placeholder="상품 제목을 입력하세요"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={classes.formGroup}>
                        <label htmlFor="description" className={classes.label}>설명 *</label>
                        <textarea
                            id="description"
                            name="description"
                            className={classes.textarea}
                            placeholder="상품 설명을 입력하세요"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={5}
                            required
                        />
                    </div>

                    <div className={classes.formGroup}>
                        <label htmlFor="category" className={classes.label}>카테고리 *</label>
                        <select
                            id="category"
                            name="category"
                            className={classes.select}
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value={AuctionCategory.ELECTRONICS}>전자제품</option>
                            <option value={AuctionCategory.CLOTHING}>의류</option>
                            <option value={AuctionCategory.POTTERY}>도자기</option>
                            <option value={AuctionCategory.APPLIANCES}>가전제품</option>
                            <option value={AuctionCategory.BEDDING}>침구</option>
                            <option value={AuctionCategory.BOOKS}>도서</option>
                            <option value={AuctionCategory.COLLECTIBLES}>수집품</option>
                            <option value={AuctionCategory.ETC}>기타</option>
                        </select>
                    </div>

                    <div className={classes.formRow}>
                        <div className={classes.formGroup}>
                            <label htmlFor="startPrice" className={classes.label}>시작가 (원) *</label>
                            <input
                                id="startPrice"
                                name="startPrice"
                                type="number"
                                className={classes.input}
                                placeholder="10000"
                                value={formData.startPrice || ''}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className={classes.formGroup}>
                            <label htmlFor="buyNowPrice" className={classes.label}>즉시구매가 (원)</label>
                            <input
                                id="buyNowPrice"
                                name="buyNowPrice"
                                type="number"
                                className={classes.input}
                                placeholder="50000 (선택사항)"
                                value={formData.buyNowPrice || ''}
                                onChange={handleInputChange}
                                min="1"
                            />
                        </div>
                    </div>

                    <div className={classes.formRow}>
                        <div className={classes.formGroup}>
                            <label htmlFor="startAt" className={classes.label}>경매 시작 시간 *</label>
                            <input
                                id="startAt"
                                name="startAt"
                                type="datetime-local"
                                className={classes.input}
                                value={formData.startAt}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={classes.formGroup}>
                            <label htmlFor="endAt" className={classes.label}>경매 종료 시간 *</label>
                            <input
                                id="endAt"
                                name="endAt"
                                type="datetime-local"
                                className={classes.input}
                                value={formData.endAt}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={classes.formGroup}>
                        <label htmlFor="images" className={classes.label}>상품 이미지</label>
                        <input
                            id="images"
                            name="images"
                            type="file"
                            className={classes.fileInput}
                            onChange={handleImageChange}
                            accept="image/*"
                            multiple
                        />
                        <p className={classes.hint}>최대 5개의 이미지를 업로드할 수 있습니다.</p>
                        {images.length > 0 && (
                            <div className={classes.imagePreview}>
                                {images.map((file, index) => (
                                    <div key={index} className={classes.previewItem}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index + 1}`}
                                            className={classes.previewImage}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className={`btn btn-primary ${classes.submitBtn}`} disabled={isLoading}>
                        {isLoading ? '등록 중...' : '경매 상품 등록하기'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAuction;
