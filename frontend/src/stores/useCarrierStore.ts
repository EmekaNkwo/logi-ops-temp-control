import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Carrier, VettingResult } from '../../../shared/types';
import { apiClient } from '@/lib/api';
import { dbManager } from '@/lib/storage';

interface CarrierStore {
    carriers: Carrier[];
    currentCarrier: Carrier | null;
    loading: boolean;
    error: string | null;
    fetchCarriers: () => Promise<void>;
    fetchCarrier: (id: string) => Promise<void>;
    createCarrier: (data: Partial<Carrier>) => Promise<Carrier>;
    vetCarrier: (id: string) => Promise<VettingResult>;
    setCurrentCarrier: (carrier: Carrier | null) => void;
}

export const useCarrierStore = create<CarrierStore>()(
    persist(
        (set, get) => ({
            carriers: [],
            currentCarrier: null,
            loading: false,
            error: null,

            fetchCarriers: async () => {
                set({ loading: true, error: null });
                try {
                    // Try IndexedDB first
                    const cached = await dbManager.getAll('carriers');
                    if (cached.length > 0) {
                        set({ carriers: cached, loading: false });
                    }

                    // Fetch from API
                    const carriers = await apiClient.getCarriers();
                    set({ carriers, loading: false });

                    // Cache in IndexedDB
                    for (const carrier of carriers) {
                        await dbManager.save('carriers', carrier);
                    }
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            fetchCarrier: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    // Try IndexedDB first
                    const cached = await dbManager.get('carriers', id);
                    if (cached) {
                        set({ currentCarrier: cached, loading: false });
                    }

                    // Fetch from API
                    const carrier = await apiClient.getCarrier(id);
                    set({ currentCarrier: carrier, loading: false });

                    // Cache in IndexedDB
                    await dbManager.save('carriers', carrier);
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            createCarrier: async (data: Partial<Carrier>) => {
                set({ loading: true, error: null });
                try {
                    const carrier = await apiClient.createCarrier(data);
                    set(state => ({
                        carriers: [...state.carriers, carrier],
                        currentCarrier: carrier,
                        loading: false,
                    }));

                    // Cache in IndexedDB
                    await dbManager.save('carriers', carrier);
                    return carrier;
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            vetCarrier: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const result = await apiClient.vetCarrier(id);

                    // Update carrier in store
                    set(state => ({
                        carriers: state.carriers.map(c =>
                            c.id === id
                                ? { ...c, vettingStatus: result.status, vettingScore: result.score }
                                : c
                        ),
                        currentCarrier: state.currentCarrier?.id === id
                            ? { ...state.currentCarrier, vettingStatus: result.status, vettingScore: result.score }
                            : state.currentCarrier,
                        loading: false,
                    }));

                    return result;
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            setCurrentCarrier: (carrier: Carrier | null) => {
                set({ currentCarrier: carrier });
            },
        }),
        {
            name: 'carrier-storage',
            partialize: (state) => ({ currentCarrier: state.currentCarrier }),
        }
    )
);

