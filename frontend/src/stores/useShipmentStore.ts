import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Shipment, IoTData, ComplianceIssue } from '../../../shared/types';
import { apiClient, wsClient } from '@/lib/api';
import { dbManager } from '@/lib/storage';

interface ShipmentStore {
    shipments: Shipment[];
    currentShipment: Shipment | null;
    loading: boolean;
    error: string | null;
    fetchShipments: (params?: { status?: string; carrierId?: string; shipperId?: string }) => Promise<void>;
    fetchShipment: (id: string) => Promise<void>;
    subscribeToShipment: (id: string) => void;
    unsubscribeFromShipment: (id: string) => void;
    getCompliance: (id: string) => Promise<{ issues: ComplianceIssue[]; complianceStatus: string }>;
    setCurrentShipment: (shipment: Shipment | null) => void;
}

export const useShipmentStore = create<ShipmentStore>()(
    persist(
        (set, get) => ({
            shipments: [],
            currentShipment: null,
            loading: false,
            error: null,

            fetchShipments: async (params) => {
                set({ loading: true, error: null });
                try {
                    // Try IndexedDB first
                    const cached = await dbManager.getAll('shipments');
                    if (cached.length > 0 && !params) {
                        set({ shipments: cached, loading: false });
                    }

                    // Fetch from API
                    const shipments = await apiClient.getShipments(params);
                    set({ shipments, loading: false });

                    // Cache in IndexedDB
                    for (const shipment of shipments) {
                        await dbManager.save('shipments', shipment);
                    }
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            fetchShipment: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    // Try IndexedDB first
                    const cached = await dbManager.get('shipments', id);
                    if (cached) {
                        set({ currentShipment: cached, loading: false });
                    }

                    // Fetch from API
                    const shipment = await apiClient.getShipment(id);
                    set({ currentShipment: shipment, loading: false });

                    // Cache in IndexedDB
                    await dbManager.save('shipments', shipment);
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            subscribeToShipment: (id: string) => {
                wsClient.subscribe(id, (data) => {
                    set(state => {
                        const updatedShipment = state.currentShipment?.id === id
                            ? { ...state.currentShipment, ...data }
                            : state.currentShipment;

                        const updatedShipments = state.shipments.map(s =>
                            s.id === id ? { ...s, ...data } : s
                        );

                        return {
                            currentShipment: updatedShipment,
                            shipments: updatedShipments,
                        };
                    });

                    // Update IndexedDB
                    const shipment = get().shipments.find(s => s.id === id);
                    if (shipment) {
                        dbManager.save('shipments', { ...shipment, ...data });
                    }
                });
            },

            unsubscribeFromShipment: (id: string) => {
                wsClient.unsubscribe(id, () => { });
            },

            getCompliance: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const result = await apiClient.getCompliance(id);

                    // Update shipment in store
                    set(state => ({
                        shipments: state.shipments.map(s =>
                            s.id === id
                                ? { ...s, complianceStatus: result.complianceStatus, complianceIssues: result.issues }
                                : s
                        ),
                        currentShipment: state.currentShipment?.id === id
                            ? { ...state.currentShipment, complianceStatus: result.complianceStatus, complianceIssues: result.issues }
                            : state.currentShipment,
                        loading: false,
                    }));

                    return result;
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            setCurrentShipment: (shipment: Shipment | null) => {
                set({ currentShipment: shipment });
            },
        }),
        {
            name: 'shipment-storage',
            partialize: (state) => ({ currentShipment: state.currentShipment }),
        }
    )
);

