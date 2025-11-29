import { create } from 'zustand';
import type { Review } from '../../../shared/types';
import { apiClient } from '@/lib/api';
import { dbManager } from '@/lib/storage';

interface ReviewStore {
    reviews: Review[];
    loading: boolean;
    error: string | null;
    fetchReviews: (params?: { carrierId?: string; shipperId?: string }) => Promise<void>;
    createReview: (data: Partial<Review>) => Promise<Review>;
}

export const useReviewStore = create<ReviewStore>((set) => ({
    reviews: [],
    loading: false,
    error: null,

    fetchReviews: async (params) => {
        set({ loading: true, error: null });
        try {
            const reviews = await apiClient.getReviews(params);
            set({ reviews, loading: false });

            // Cache in IndexedDB
            for (const review of reviews) {
                await dbManager.save('reviews', review);
            }
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    createReview: async (data: Partial<Review>) => {
        set({ loading: true, error: null });
        try {
            const review = await apiClient.createReview(data);
            set(state => ({
                reviews: [...state.reviews, review],
                loading: false,
            }));

            // Cache in IndexedDB
            await dbManager.save('reviews', review);
            return review;
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },
}));

