// API client for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002';

export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Shipper endpoints
    async getShippers() {
        return this.request('/shippers');
    }

    async getShipper(id: string) {
        return this.request(`/shippers/${id}`);
    }

    async createShipper(data: any) {
        return this.request('/shippers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Carrier endpoints
    async getCarriers() {
        return this.request('/carriers');
    }

    async getCarrier(id: string) {
        return this.request(`/carriers/${id}`);
    }

    async createCarrier(data: any) {
        return this.request('/carriers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async vetCarrier(id: string) {
        return this.request(`/carriers/${id}/vetting`, {
            method: 'POST',
        });
    }

    // Load endpoints
    async getLoads(params?: { status?: string; shipperId?: string }) {
        const query = new URLSearchParams();
        if (params?.status) query.append('status', params.status);
        if (params?.shipperId) query.append('shipperId', params.shipperId);
        const queryString = query.toString();
        return this.request(`/loads${queryString ? `?${queryString}` : ''}`);
    }

    async getLoad(id: string) {
        return this.request(`/loads/${id}`);
    }

    async createLoad(data: any) {
        return this.request('/loads', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getLoadMatches(id: string) {
        return this.request(`/loads/${id}/matches`);
    }

    async createBid(loadId: string, data: any) {
        return this.request(`/loads/${loadId}/bids`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async assignLoad(loadId: string, data: { carrierId: string; bidId?: string }) {
        return this.request(`/loads/${loadId}/assign`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Shipment endpoints
    async getShipments(params?: { status?: string; carrierId?: string; shipperId?: string }) {
        const query = new URLSearchParams();
        if (params?.status) query.append('status', params.status);
        if (params?.carrierId) query.append('carrierId', params.carrierId);
        if (params?.shipperId) query.append('shipperId', params.shipperId);
        const queryString = query.toString();
        return this.request(`/shipments${queryString ? `?${queryString}` : ''}`);
    }

    async getShipment(id: string) {
        return this.request(`/shipments/${id}`);
    }

    async addIoTData(shipmentId: string, data: any) {
        return this.request(`/shipments/${shipmentId}/iot-data`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getCompliance(shipmentId: string) {
        return this.request(`/shipments/${shipmentId}/compliance`);
    }

    // Review endpoints
    async getReviews(params?: { carrierId?: string; shipperId?: string }) {
        const query = new URLSearchParams();
        if (params?.carrierId) query.append('carrierId', params.carrierId);
        if (params?.shipperId) query.append('shipperId', params.shipperId);
        const queryString = query.toString();
        return this.request(`/reviews${queryString ? `?${queryString}` : ''}`);
    }

    async createReview(data: any) {
        return this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const apiClient = new ApiClient();

// WebSocket client
export class WebSocketClient {
    private ws: WebSocket | null = null;
    private url: string;
    private listeners: Map<string, Set<(data: any) => void>> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    constructor(url: string = WS_URL) {
        this.url = url;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url);

                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.reconnectAttempts = 0;
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        this.handleMessage(message);
                    } catch (error) {
                        console.error('WebSocket message parse error:', error);
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    reject(error);
                };

                this.ws.onclose = () => {
                    console.log('WebSocket disconnected');
                    this.attemptReconnect();
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
                this.connect().catch(() => { });
            }, 1000 * this.reconnectAttempts);
        }
    }

    private handleMessage(message: any) {
        if (message.type === 'shipment_update') {
            const listeners = this.listeners.get(message.shipmentId);
            if (listeners) {
                listeners.forEach(listener => listener(message.data));
            }
        }
    }

    subscribe(shipmentId: string, callback: (data: any) => void) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.connect().then(() => {
                this.subscribe(shipmentId, callback);
            });
            return;
        }

        if (!this.listeners.has(shipmentId)) {
            this.listeners.set(shipmentId, new Set());
            this.ws.send(JSON.stringify({
                type: 'subscribe',
                shipmentId,
            }));
        }

        this.listeners.get(shipmentId)!.add(callback);
    }

    unsubscribe(shipmentId: string, callback: (data: any) => void) {
        const listeners = this.listeners.get(shipmentId);
        if (listeners) {
            listeners.delete(callback);
            if (listeners.size === 0) {
                this.listeners.delete(shipmentId);
            }
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.listeners.clear();
    }
}

export const wsClient = new WebSocketClient();

