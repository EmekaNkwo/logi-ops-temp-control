import type {
    Shipper,
    Carrier,
    Load,
    Shipment,
    Review,
    Bid,
    IoTData,
} from '../../../shared/types';
import {
    generateShippers,
    generateCarriers,
    generateLoads,
    generateShipments,
    generateReviews,
} from '../utils/dataGenerator';

// In-memory database (in production, this would be a real database)
class Database {
    private shippers: Map<string, Shipper> = new Map();
    private carriers: Map<string, Carrier> = new Map();
    private loads: Map<string, Load> = new Map();
    private shipments: Map<string, Shipment> = new Map();
    private reviews: Map<string, Review> = new Map();
    private bids: Map<string, Bid> = new Map();

    constructor() {
        this.initializeData();
    }

    private initializeData() {
        console.log('Initializing database with dummy data...');

        // Generate shippers
        const shippers = generateShippers(30);
        shippers.forEach(shipper => this.shippers.set(shipper.id, shipper));

        // Generate carriers
        const carriers = generateCarriers(50);
        carriers.forEach(carrier => this.carriers.set(carrier.id, carrier));

        // Generate loads
        const loads = generateLoads(100, shippers);
        loads.forEach(load => {
            this.loads.set(load.id, load);
            load.bids.forEach(bid => this.bids.set(bid.id, bid));
        });

        // Generate shipments
        const shipments = generateShipments(100, loads, carriers);
        shipments.forEach(shipment => this.shipments.set(shipment.id, shipment));

        // Generate reviews
        const reviews = generateReviews(shipments, shippers, carriers);
        reviews.forEach(review => this.reviews.set(review.id, review));

        console.log(`Database initialized: ${shippers.length} shippers, ${carriers.length} carriers, ${loads.length} loads, ${shipments.length} shipments, ${reviews.length} reviews`);
    }

    // Shipper methods
    getShippers(): Shipper[] {
        return Array.from(this.shippers.values());
    }

    getShipper(id: string): Shipper | undefined {
        return this.shippers.get(id);
    }

    createShipper(shipper: Shipper): Shipper {
        this.shippers.set(shipper.id, shipper);
        return shipper;
    }

    // Carrier methods
    getCarriers(): Carrier[] {
        return Array.from(this.carriers.values());
    }

    getCarrier(id: string): Carrier | undefined {
        return this.carriers.get(id);
    }

    createCarrier(carrier: Carrier): Carrier {
        this.carriers.set(carrier.id, carrier);
        return carrier;
    }

    updateCarrier(id: string, updates: Partial<Carrier>): Carrier | null {
        const carrier = this.carriers.get(id);
        if (!carrier) return null;
        const updated = { ...carrier, ...updates };
        this.carriers.set(id, updated);
        return updated;
    }

    // Load methods
    getLoads(): Load[] {
        return Array.from(this.loads.values());
    }

    getLoad(id: string): Load | undefined {
        return this.loads.get(id);
    }

    createLoad(load: Load): Load {
        this.loads.set(load.id, load);
        return load;
    }

    updateLoad(id: string, updates: Partial<Load>): Load | null {
        const load = this.loads.get(id);
        if (!load) return null;
        const updated = { ...load, ...updates };
        this.loads.set(id, updated);
        return updated;
    }

    // Bid methods
    createBid(bid: Bid): Bid {
        this.bids.set(bid.id, bid);
        const load = this.loads.get(bid.loadId);
        if (load) {
            load.bids.push(bid);
            this.loads.set(load.id, load);
        }
        return bid;
    }

    getBidsByLoad(loadId: string): Bid[] {
        const load = this.loads.get(loadId);
        return load ? load.bids : [];
    }

    // Shipment methods
    getShipments(): Shipment[] {
        return Array.from(this.shipments.values());
    }

    getShipment(id: string): Shipment | undefined {
        return this.shipments.get(id);
    }

    getShipmentsByCarrier(carrierId: string): Shipment[] {
        return Array.from(this.shipments.values()).filter(s => s.carrierId === carrierId);
    }

    getShipmentsByShipper(shipperId: string): Shipment[] {
        return Array.from(this.shipments.values()).filter(s => s.shipperId === shipperId);
    }

    createShipment(shipment: Shipment): Shipment {
        this.shipments.set(shipment.id, shipment);
        return shipment;
    }

    updateShipment(id: string, updates: Partial<Shipment>): Shipment | null {
        const shipment = this.shipments.get(id);
        if (!shipment) return null;
        const updated = { ...shipment, ...updates, updatedAt: new Date().toISOString() };
        this.shipments.set(id, updated);
        return updated;
    }

    addIoTData(shipmentId: string, data: IoTData): void {
        const shipment = this.shipments.get(shipmentId);
        if (shipment) {
            shipment.iotData.push(data);
            shipment.currentLocation = data.location;
            this.shipments.set(shipmentId, shipment);
        }
    }

    // Review methods
    getReviews(): Review[] {
        return Array.from(this.reviews.values());
    }

    getReviewsByCarrier(carrierId: string): Review[] {
        return Array.from(this.reviews.values()).filter(r => r.revieweeId === carrierId && r.reviewerRole === 'shipper');
    }

    getReviewsByShipper(shipperId: string): Review[] {
        return Array.from(this.reviews.values()).filter(r => r.revieweeId === shipperId && r.reviewerRole === 'carrier');
    }

    createReview(review: Review): Review {
        this.reviews.set(review.id, review);
        return review;
    }
}

export const db = new Database();

