import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Load, Bid } from '../../../shared/types';
import { apiClient } from '@/lib/api';
import { dbManager } from '@/lib/storage';

interface LoadStore {
    loads: Load[];
    currentLoad: Load | null;
    loading: boolean;
    error: string | null;
    fetchLoads: (params?: { status?: string; shipperId?: string }) => Promise<void>;
    fetchLoad: (id: string) => Promise<void>;
    createLoad: (data: Partial<Load>) => Promise<Load>;
    getMatches: (id: string) => Promise<any[]>;
    createBid: (loadId: string, data: Partial<Bid>) => Promise<Bid>;
    assignLoad: (loadId: string, carrierId: string, bidId?: string) => Promise<any>;
    setCurrentLoad: (load: Load | null) => void;
}

export const useLoadStore = create<LoadStore>()(
    persist(
        (set, get) => ({
            loads: [],
            currentLoad: null,
            loading: false,
            error: null,

            fetchLoads: async (params) => {
                set({ loading: true, error: null });
                try {
                    // Try IndexedDB first
                    const cached = await dbManager.getAll('loads');
                    if (cached.length > 0 && !params) {
                        set({ loads: cached, loading: false });
                    }

                    // Fetch from API
                    const loads = await apiClient.getLoads(params);
                    set({ loads, loading: false });

                    // Cache in IndexedDB
                    for (const load of loads) {
                        await dbManager.save('loads', load);
                    }
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            fetchLoad: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    // Try IndexedDB first
                    const cached = await dbManager.get('loads', id);
                    if (cached) {
                        set({ currentLoad: cached, loading: false });
                    }

                    // Fetch from API
                    const load = await apiClient.getLoad(id);
                    set({ currentLoad: load, loading: false });

                    // Cache in IndexedDB
                    await dbManager.save('loads', load);
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            createLoad: async (data: Partial<Load>) => {
                set({ loading: true, error: null });
                try {
                    const load = await apiClient.createLoad(data);
                    set(state => ({
                        loads: [...state.loads, load],
                        currentLoad: load,
                        loading: false,
                    }));

                    // Cache in IndexedDB
                    await dbManager.save('loads', load);
                    return load;
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            getMatches: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const matches = await apiClient.getLoadMatches(id);
                    set({ loading: false });
                    return matches;
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            createBid: async (loadId: string, data: Partial<Bid>) => {
                set({ loading: true, error: null });
                try {
                    const bid = await apiClient.createBid(loadId, data);

                    // Update load in store
                    set(state => ({
                        loads: state.loads.map(l =>
                            l.id === loadId ? { ...l, bids: [...l.bids, bid] } : l
                        ),
                        currentLoad: state.currentLoad?.id === loadId
                            ? { ...state.currentLoad, bids: [...state.currentLoad.bids, bid] }
                            : state.currentLoad,
                        loading: false,
                    }));

                    return bid;
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            assignLoad: async (loadId: string, carrierId: string, bidId?: string) => {
                set({ loading: true, error: null });
                try {
                    const result = await apiClient.assignLoad(loadId, { carrierId, bidId });

                    // Update load in store
                    set(state => ({
                        loads: state.loads.map(l =>
                            l.id === loadId ? result.load : l
                        ),
                        currentLoad: state.currentLoad?.id === loadId ? result.load : state.currentLoad,
                        loading: false,
                    }));

                    return result;
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            setCurrentLoad: (load: Load | null) => {
                set({ currentLoad: load });
            },
        }),
        {
            name: 'load-storage',
            partialize: (state) => ({ currentLoad: state.currentLoad }),
        }
    )
);

