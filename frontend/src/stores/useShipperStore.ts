import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Shipper } from '../../../shared/types';
import { apiClient } from '@/lib/api';
import { dbManager } from '@/lib/storage';

interface ShipperStore {
    shippers: Shipper[];
    currentShipper: Shipper | null;
    loading: boolean;
    error: string | null;
    fetchShippers: () => Promise<void>;
    fetchShipper: (id: string) => Promise<void>;
    createShipper: (data: Partial<Shipper>) => Promise<Shipper>;
    setCurrentShipper: (shipper: Shipper | null) => void;
}

export const useShipperStore = create<ShipperStore>()(
    persist(
        (set, get) => ({
            shippers: [],
            currentShipper: null,
            loading: false,
            error: null,

            fetchShippers: async () => {
                set({ loading: true, error: null });
                try {
                    // Try IndexedDB first
                    const cached = await dbManager.getAll('shippers');
                    if (cached.length > 0) {
                        set({ shippers: cached, loading: false });
                    }

                    // Fetch from API
                    const shippers = await apiClient.getShippers();
                    set({ shippers, loading: false });

                    // Cache in IndexedDB
                    for (const shipper of shippers) {
                        await dbManager.save('shippers', shipper);
                    }
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            fetchShipper: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    // Try IndexedDB first
                    const cached = await dbManager.get('shippers', id);
                    if (cached) {
                        set({ currentShipper: cached, loading: false });
                    }

                    // Fetch from API
                    const shipper = await apiClient.getShipper(id);
                    set({ currentShipper: shipper, loading: false });

                    // Cache in IndexedDB
                    await dbManager.save('shippers', shipper);
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            createShipper: async (data: Partial<Shipper>) => {
                set({ loading: true, error: null });
                try {
                    const shipper = await apiClient.createShipper(data);
                    set(state => ({
                        shippers: [...state.shippers, shipper],
                        currentShipper: shipper,
                        loading: false,
                    }));

                    // Cache in IndexedDB
                    await dbManager.save('shippers', shipper);
                    return shipper;
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            setCurrentShipper: (shipper: Shipper | null) => {
                set({ currentShipper: shipper });
            },
        }),
        {
            name: 'shipper-storage',
            partialize: (state) => ({ currentShipper: state.currentShipper }),
        }
    )
);

