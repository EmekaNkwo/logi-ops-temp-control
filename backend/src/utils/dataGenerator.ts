import { v4 as uuidv4 } from 'uuid';
import { addDays, addHours, subDays, subMonths, format } from 'date-fns';
import type {
    Shipper,
    Carrier,
    Load,
    Shipment,
    Equipment,
    Location,
    IoTData,
    Bid,
    Review,
    TemperatureRange,
} from '../../../shared/types';

// Sample data arrays
const companyNames = [
    'Fresh Foods Co', 'Arctic Logistics', 'Cold Chain Solutions', 'Frozen Express',
    'Premium Meats Inc', 'Dairy Direct', 'Seafood Specialists', 'Organic Farms',
    'Gourmet Distributors', 'Farm Fresh Supply', 'Chilled Cargo LLC', 'Frosty Freight',
    'Temperature Tech', 'Ice Cold Transport', 'Refrigerated Routes', 'Cool Carriers',
    'Frozen Freight Lines', 'Chill Logistics', 'Subzero Shipping', 'Cryo Transport'
];

const foodTypes = [
    'Fresh Produce', 'Frozen Meats', 'Dairy Products', 'Seafood', 'Bakery Items',
    'Beverages', 'Ice Cream', 'Prepared Meals', 'Organic Vegetables', 'Poultry'
];

const cities = [
    { city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
    { city: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060 },
    { city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
    { city: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698 },
    { city: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740 },
    { city: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652 },
    { city: 'San Antonio', state: 'TX', lat: 29.4241, lng: -98.4936 },
    { city: 'San Diego', state: 'CA', lat: 32.7157, lng: -117.1611 },
    { city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970 },
    { city: 'San Jose', state: 'CA', lat: 37.3382, lng: -121.8863 },
    { city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
    { city: 'Atlanta', state: 'GA', lat: 33.7490, lng: -84.3880 },
    { city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321 },
    { city: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903 },
    { city: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589 },
];

const equipmentMakes = ['Thermo King', 'Carrier', 'Daikin', 'Mitsubishi', 'Lennox'];
const equipmentModels = ['SB-210', 'SB-230', 'SB-250', 'SB-300', 'SB-400'];

function randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function generateLocation(): Location {
    const cityData = randomElement(cities);
    return {
        lat: cityData.lat + randomFloat(-0.5, 0.5),
        lng: cityData.lng + randomFloat(-0.5, 0.5),
        address: `${randomInt(100, 9999)} ${randomElement(['Main', 'Oak', 'Elm', 'Park', 'First', 'Second'])} St`,
        city: cityData.city,
        state: cityData.state,
        zipCode: `${randomInt(10000, 99999)}`,
    };
}

function generateEquipment(): Equipment {
    const types: Equipment['type'][] = ['reefer_truck', 'dry_van', 'refrigerated_container', 'frozen_truck'];
    const type = randomElement(types);

    let tempRange = { min: 0, max: 0 };
    if (type === 'frozen_truck') {
        tempRange = { min: -25, max: -15 };
    } else if (type === 'reefer_truck') {
        tempRange = { min: -5, max: 5 };
    } else if (type === 'refrigerated_container') {
        tempRange = { min: -10, max: 10 };
    } else {
        tempRange = { min: 10, max: 25 };
    }

    return {
        id: uuidv4(),
        type,
        make: randomElement(equipmentMakes),
        model: randomElement(equipmentModels),
        year: randomInt(2018, 2024),
        capacity: randomInt(1000, 5000),
        temperatureRange: tempRange,
        certifications: randomElement([
            ['FDA', 'USDA'],
            ['FDA', 'HACCP'],
            ['USDA', 'HACCP', 'FDA'],
            ['FDA'],
        ]),
        lastInspectionDate: format(subDays(new Date(), randomInt(0, 180)), 'yyyy-MM-dd'),
    };
}

export function generateShippers(count: number = 30): Shipper[] {
    const shippers: Shipper[] = [];
    const usedNames = new Set<string>();

    for (let i = 0; i < count; i++) {
        let companyName = randomElement(companyNames);
        while (usedNames.has(companyName)) {
            companyName = randomElement(companyNames) + ` ${randomInt(1, 99)}`;
        }
        usedNames.add(companyName);

        const registrationDate = format(subMonths(new Date(), randomInt(1, 24)), 'yyyy-MM-dd');

        shippers.push({
            id: uuidv4(),
            companyName,
            contactName: `${randomElement(['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily'])} ${randomElement(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'])}`,
            email: `${companyName.toLowerCase().replace(/\s+/g, '')}@example.com`,
            phone: `+1-${randomInt(200, 999)}-${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
            address: generateLocation(),
            businessLicense: `BL-${randomInt(100000, 999999)}`,
            foodHandlingPermit: `FHP-${randomInt(100000, 999999)}`,
            registrationDate,
            rating: randomFloat(3.5, 5.0),
            totalShipments: randomInt(10, 500),
        });
    }

    return shippers;
}

export function generateCarriers(count: number = 50): Carrier[] {
    const carriers: Carrier[] = [];
    const usedNames = new Set<string>();

    for (let i = 0; i < count; i++) {
        let companyName = randomElement(companyNames);
        while (usedNames.has(companyName)) {
            companyName = randomElement(companyNames) + ` Logistics ${randomInt(1, 99)}`;
        }
        usedNames.add(companyName);

        const equipmentCount = randomInt(1, 5);
        const equipment: Equipment[] = [];
        for (let j = 0; j < equipmentCount; j++) {
            equipment.push(generateEquipment());
        }

        const registrationDate = format(subMonths(new Date(), randomInt(1, 36)), 'yyyy-MM-dd');
        const vettingStatus = randomElement(['pending', 'approved', 'approved', 'approved', 'under_review'] as const);
        const vettingScore = vettingStatus === 'approved' ? randomInt(70, 100) : randomInt(40, 69);

        carriers.push({
            id: uuidv4(),
            companyName,
            contactName: `${randomElement(['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily'])} ${randomElement(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'])}`,
            email: `${companyName.toLowerCase().replace(/\s+/g, '')}@example.com`,
            phone: `+1-${randomInt(200, 999)}-${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
            address: generateLocation(),
            dotNumber: `DOT-${randomInt(100000, 999999)}`,
            mcNumber: `MC-${randomInt(100000, 999999)}`,
            equipment,
            insurance: {
                liability: randomInt(750000, 5000000),
                cargo: randomInt(100000, 1000000),
                expirationDate: format(addDays(new Date(), randomInt(30, 365)), 'yyyy-MM-dd'),
            },
            safetyRating: randomElement(['satisfactory', 'satisfactory', 'satisfactory', 'conditional'] as const),
            foodHandlingExperience: randomInt(1, 20),
            certifications: randomElement([
                ['HACCP', 'FDA'],
                ['HACCP', 'USDA', 'FDA'],
                ['HACCP'],
                ['FDA', 'USDA'],
            ]),
            vettingStatus,
            vettingScore,
            registrationDate,
            rating: randomFloat(3.0, 5.0),
            totalShipments: randomInt(5, 1000),
            totalReviews: randomInt(5, 200),
        });
    }

    return carriers;
}

export function generateLoads(count: number, shippers: Shipper[]): Load[] {
    const loads: Load[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const shipper = randomElement(shippers);
        const origin = generateLocation();
        let destination = generateLocation();
        while (destination.city === origin.city) {
            destination = generateLocation();
        }

        const pickupDate = format(addDays(now, randomInt(1, 30)), 'yyyy-MM-dd');
        const deliveryDate = format(addDays(new Date(pickupDate), randomInt(1, 7)), 'yyyy-MM-dd');
        const postedAt = format(subDays(new Date(pickupDate), randomInt(1, 14)), 'yyyy-MM-dd');

        const tempRange = randomElement([
            { min: -20, max: -15, range: 'frozen' as TemperatureRange },
            { min: -5, max: 2, range: 'frozen' as TemperatureRange },
            { min: 0, max: 4, range: 'refrigerated' as TemperatureRange },
            { min: 2, max: 8, range: 'refrigerated' as TemperatureRange },
            { min: 8, max: 15, range: 'cool' as TemperatureRange },
        ]);

        const status = randomElement(['posted', 'bidding', 'assigned', 'in_transit', 'delivered', 'completed'] as const);

        const load: Load = {
            id: uuidv4(),
            shipperId: shipper.id,
            shipperName: shipper.companyName,
            origin,
            destination,
            pickupDate,
            deliveryDate,
            cargoType: randomElement(foodTypes),
            weight: randomInt(1000, 50000),
            volume: randomInt(500, 5000),
            temperatureRequirement: tempRange,
            specialRequirements: randomElement([
                [],
                ['No stacking', 'Fragile'],
                ['HACCP certified', 'Organic'],
                ['Express delivery'],
                ['Temperature monitoring required'],
            ]),
            basePrice: randomInt(500, 10000),
            status,
            bids: [],
            postedAt,
            createdAt: postedAt,
        };

        // Generate bids for loads in bidding status
        if (status === 'bidding' || status === 'assigned') {
            const bidCount = randomInt(2, 8);
            for (let j = 0; j < bidCount; j++) {
                load.bids.push({
                    id: uuidv4(),
                    loadId: load.id,
                    carrierId: uuidv4(),
                    carrierName: randomElement(companyNames) + ' Logistics',
                    amount: load.basePrice + randomInt(-500, 2000),
                    estimatedDeliveryDate: deliveryDate,
                    submittedAt: format(addDays(new Date(postedAt), randomInt(0, 5)), 'yyyy-MM-dd'),
                    status: j === 0 && status === 'assigned' ? 'accepted' : 'pending',
                });
            }
        }

        loads.push(load);
    }

    return loads;
}

export function generateShipments(count: number, loads: Load[], carriers: Carrier[]): Shipment[] {
    const shipments: Shipment[] = [];
    const assignedLoads = loads.filter(l => l.status === 'assigned' || l.status === 'in_transit' || l.status === 'delivered' || l.status === 'completed');

    for (let i = 0; i < Math.min(count, assignedLoads.length); i++) {
        const load = assignedLoads[i];
        const carrier = randomElement(carriers);
        const equipment = randomElement(carrier.equipment);

        const now = new Date();
        const pickupDate = new Date(load.pickupDate);
        const deliveryDate = new Date(load.deliveryDate);
        const isInTransit = load.status === 'in_transit';
        const isDelivered = load.status === 'delivered' || load.status === 'completed';

        // Generate IoT data
        const iotData: IoTData[] = [];
        const dataPoints = isDelivered ? 100 : (isInTransit ? randomInt(20, 50) : 0);

        for (let j = 0; j < dataPoints; j++) {
            const timestamp = isDelivered
                ? format(addHours(pickupDate, j * 2), "yyyy-MM-dd'T'HH:mm:ss")
                : format(addHours(now, -dataPoints + j), "yyyy-MM-dd'T'HH:mm:ss");

            // Simulate temperature with some variation
            const targetTemp = (load.temperatureRequirement.min + load.temperatureRequirement.max) / 2;
            const tempVariation = randomFloat(-2, 2);
            const temperature = Math.max(
                load.temperatureRequirement.min - 1,
                Math.min(load.temperatureRequirement.max + 1, targetTemp + tempVariation)
            );

            // Simulate location progression
            const progress = j / dataPoints;
            const currentLat = load.origin.lat + (load.destination.lat - load.origin.lat) * progress;
            const currentLng = load.origin.lng + (load.destination.lng - load.origin.lng) * progress;

            iotData.push({
                timestamp,
                temperature,
                humidity: randomFloat(40, 70),
                location: {
                    lat: currentLat,
                    lng: currentLng,
                    address: `${randomInt(100, 9999)} Route ${j}`,
                    city: 'In Transit',
                    state: 'US',
                    zipCode: '00000',
                },
                batteryLevel: randomInt(60, 100),
                doorStatus: randomElement(['open', 'closed']),
            });
        }

        shipments.push({
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
            actualPickupDate: isInTransit || isDelivered ? load.pickupDate : undefined,
            actualDeliveryDate: isDelivered ? load.deliveryDate : undefined,
            cargoType: load.cargoType,
            weight: load.weight,
            volume: load.volume,
            temperatureRequirement: load.temperatureRequirement,
            equipmentId: equipment.id,
            status: load.status as any,
            currentLocation: iotData.length > 0 ? iotData[iotData.length - 1].location : load.origin,
            iotData,
            complianceStatus: randomElement(['compliant', 'compliant', 'compliant', 'warning'] as const),
            complianceIssues: [],
            estimatedArrival: load.deliveryDate,
            createdAt: load.createdAt,
            updatedAt: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
        });
    }

    return shipments;
}

export function generateReviews(shipments: Shipment[], shippers: Shipper[], carriers: Carrier[]): Review[] {
    const reviews: Review[] = [];
    const completedShipments = shipments.filter(s => s.status === 'completed' || s.status === 'delivered');

    for (const shipment of completedShipments.slice(0, Math.floor(completedShipments.length * 0.7))) {
        // Shipper reviews carrier
        reviews.push({
            id: uuidv4(),
            shipmentId: shipment.id,
            reviewerId: shipment.shipperId,
            reviewerName: shipment.shipperName,
            reviewerRole: 'shipper',
            revieweeId: shipment.carrierId,
            revieweeName: shipment.carrierName,
            rating: randomFloat(3.5, 5.0),
            comment: randomElement([
                'Excellent service, on-time delivery',
                'Good communication throughout',
                'Temperature maintained perfectly',
                'Professional driver, careful handling',
                'Would use again',
                'Minor delay but overall good',
            ]),
            createdAt: format(addDays(new Date(shipment.actualDeliveryDate || shipment.deliveryDate), randomInt(0, 7)), 'yyyy-MM-dd'),
        });

        // Carrier reviews shipper (less frequent)
        if (Math.random() > 0.5) {
            reviews.push({
                id: uuidv4(),
                shipmentId: shipment.id,
                reviewerId: shipment.carrierId,
                reviewerName: shipment.carrierName,
                reviewerRole: 'carrier',
                revieweeId: shipment.shipperId,
                revieweeName: shipment.shipperName,
                rating: randomFloat(3.5, 5.0),
                comment: randomElement([
                    'Clear instructions, easy pickup',
                    'Professional operation',
                    'Good communication',
                    'Well organized',
                ]),
                createdAt: format(addDays(new Date(shipment.actualDeliveryDate || shipment.deliveryDate), randomInt(0, 7)), 'yyyy-MM-dd'),
            });
        }
    }

    return reviews;
}

