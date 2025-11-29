import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { db } from './data/database';
import { performVetting } from './services/vettingService';
import { findMatchingCarriers } from './services/matchingService';
import { checkCompliance } from './services/complianceService';
import type { Bid, Load, Shipment, IoTData } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const app = express();
const PORT = process.env.PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Shipper endpoints
app.get('/api/shippers', (req, res) => {
    res.json(db.getShippers());
});

app.get('/api/shippers/:id', (req, res) => {
    const shipper = db.getShipper(req.params.id);
    if (!shipper) {
        return res.status(404).json({ error: 'Shipper not found' });
    }
    res.json(shipper);
});

app.post('/api/shippers', (req, res) => {
    const shipper = db.createShipper(req.body);
    res.status(201).json(shipper);
});

// Carrier endpoints
app.get('/api/carriers', (req, res) => {
    res.json(db.getCarriers());
});

app.get('/api/carriers/:id', (req, res) => {
    const carrier = db.getCarrier(req.params.id);
    if (!carrier) {
        return res.status(404).json({ error: 'Carrier not found' });
    }
    res.json(carrier);
});

app.post('/api/carriers', (req, res) => {
    const carrier = db.createCarrier(req.body);
    res.status(201).json(carrier);
});

app.post('/api/carriers/:id/vetting', (req, res) => {
    try {
        const result = performVetting(req.params.id);
        db.updateCarrier(req.params.id, {
            vettingStatus: result.status,
            vettingScore: result.score,
        });
        res.json(result);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

// Load endpoints
app.get('/api/loads', (req, res) => {
    const { status, shipperId } = req.query;
    let loads = db.getLoads();

    if (status) {
        loads = loads.filter(l => l.status === status);
    }
    if (shipperId) {
        loads = loads.filter(l => l.shipperId === shipperId);
    }

    res.json(loads);
});

app.get('/api/loads/:id', (req, res) => {
    const load = db.getLoad(req.params.id);
    if (!load) {
        return res.status(404).json({ error: 'Load not found' });
    }
    res.json(load);
});

app.post('/api/loads', (req, res) => {
    const load = db.createLoad(req.body);
    res.status(201).json(load);
});

app.post('/api/loads/:id/bids', (req, res) => {
    const load = db.getLoad(req.params.id);
    if (!load) {
        return res.status(404).json({ error: 'Load not found' });
    }

    const bid: Bid = {
        id: uuidv4(),
        loadId: req.params.id,
        ...req.body,
        submittedAt: new Date().toISOString(),
        status: 'pending',
    };

    db.createBid(bid);
    res.status(201).json(bid);
});

app.get('/api/loads/:id/matches', (req, res) => {
    try {
        const matches = findMatchingCarriers(req.params.id);
        res.json(matches);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

app.post('/api/loads/:id/assign', (req, res) => {
    const { carrierId, bidId } = req.body;
    const load = db.getLoad(req.params.id);

    if (!load) {
        return res.status(404).json({ error: 'Load not found' });
    }

    const carrier = db.getCarrier(carrierId);
    if (!carrier) {
        return res.status(404).json({ error: 'Carrier not found' });
    }

    // Update bid status
    if (bidId) {
        const bid = load.bids.find(b => b.id === bidId);
        if (bid) {
            bid.status = 'accepted';
            load.bids.forEach(b => {
                if (b.id !== bidId) b.status = 'rejected';
            });
        }
    }

    // Create shipment
    const shipment: Shipment = {
        id: uuidv4(),
        loadId: load.id,
        shipperId: load.shipperId,
        shipperName: load.shipperName,
        carrierId: carrier.id,
        carrierName: carrier.companyName,
        origin: load.origin,
        destination: load.destination,
        pickupDate: load.pickupDate,
        deliveryDate: load.deliveryDate,
        cargoType: load.cargoType,
        weight: load.weight,
        volume: load.volume,
        temperatureRequirement: load.temperatureRequirement,
        equipmentId: carrier.equipment[0]?.id || '',
        status: 'assigned',
        iotData: [],
        complianceStatus: 'pending',
        complianceIssues: [],
        estimatedArrival: load.deliveryDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    db.createShipment(shipment);
    db.updateLoad(req.params.id, {
        status: 'assigned',
        assignedCarrierId: carrierId,
        assignedCarrierName: carrier.companyName,
    });

    res.json({ load, shipment });
});

// Shipment endpoints
app.get('/api/shipments', (req, res) => {
    const { status, carrierId, shipperId } = req.query;
    let shipments = db.getShipments();

    if (status) {
        shipments = shipments.filter(s => s.status === status);
    }
    if (carrierId) {
        shipments = shipments.filter(s => s.carrierId === carrierId);
    }
    if (shipperId) {
        shipments = shipments.filter(s => s.shipperId === shipperId);
    }

    res.json(shipments);
});

app.get('/api/shipments/:id', (req, res) => {
    const shipment = db.getShipment(req.params.id);
    if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(shipment);
});

app.post('/api/shipments/:id/iot-data', (req, res) => {
    const shipment = db.getShipment(req.params.id);
    if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
    }

    const iotData: IoTData = {
        ...req.body,
        timestamp: req.body.timestamp || new Date().toISOString(),
    };

    db.addIoTData(req.params.id, iotData);

    // Check compliance when new data arrives
    checkCompliance(req.params.id);

    res.json(iotData);
});

app.get('/api/shipments/:id/compliance', (req, res) => {
    try {
        const issues = checkCompliance(req.params.id);
        const shipment = db.getShipment(req.params.id);
        res.json({ issues, complianceStatus: shipment?.complianceStatus });
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

// Review endpoints
app.get('/api/reviews', (req, res) => {
    const { carrierId, shipperId } = req.query;
    let reviews = db.getReviews();

    if (carrierId) {
        reviews = reviews.filter(r => r.revieweeId === carrierId && r.reviewerRole === 'shipper');
    }
    if (shipperId) {
        reviews = reviews.filter(r => r.revieweeId === shipperId && r.reviewerRole === 'carrier');
    }

    res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
    const review = db.createReview(req.body);
    res.status(201).json(review);
});

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`🚀 Backend API server running on http://localhost:${PORT}`);
});

// WebSocket server for real-time tracking
const wss = new WebSocketServer({ port: parseInt(WS_PORT as string) });

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());

            if (data.type === 'subscribe') {
                // Subscribe to shipment updates
                ws.send(JSON.stringify({
                    type: 'subscribed',
                    shipmentId: data.shipmentId,
                }));
            }
        } catch (error) {
            console.error('WebSocket error:', error);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

// Broadcast shipment updates to subscribed clients
export function broadcastShipmentUpdate(shipmentId: string, data: any) {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(JSON.stringify({
                type: 'shipment_update',
                shipmentId,
                data,
            }));
        }
    });
}

console.log(`📡 WebSocket server running on ws://localhost:${WS_PORT}`);

// Simulate IoT data updates for in-transit shipments
setInterval(() => {
    const inTransitShipments = db.getShipments().filter(s => s.status === 'in_transit');

    for (const shipment of inTransitShipments) {
        // Generate new IoT data point
        const lastData = shipment.iotData[shipment.iotData.length - 1];
        const progress = shipment.iotData.length / 100; // Assume 100 data points for full journey

        const newLat = shipment.origin.lat + (shipment.destination.lat - shipment.origin.lat) * progress;
        const newLng = shipment.origin.lng + (shipment.destination.lng - shipment.origin.lng) * progress;

        const targetTemp = (shipment.temperatureRequirement.min + shipment.temperatureRequirement.max) / 2;
        const tempVariation = (Math.random() - 0.5) * 2; // -1 to +1

        const iotData: IoTData = {
            timestamp: new Date().toISOString(),
            temperature: Math.max(
                shipment.temperatureRequirement.min - 1,
                Math.min(shipment.temperatureRequirement.max + 1, targetTemp + tempVariation)
            ),
            humidity: 45 + Math.random() * 20,
            location: {
                lat: newLat,
                lng: newLng,
                address: `In Transit - ${Math.round(progress * 100)}%`,
                city: 'In Transit',
                state: 'US',
                zipCode: '00000',
            },
            batteryLevel: 80 + Math.random() * 20,
            doorStatus: 'closed',
        };

        db.addIoTData(shipment.id, iotData);
        checkCompliance(shipment.id);

        // Broadcast update
        broadcastShipmentUpdate(shipment.id, {
            iotData: shipment.iotData,
            currentLocation: iotData.location,
            complianceStatus: db.getShipment(shipment.id)?.complianceStatus,
        });
    }
}, 30000); // Update every 30 seconds

export default server;

