// Shared types for frontend and backend

export type UserRole = 'shipper' | 'carrier' | 'admin';

export type EquipmentType = 'reefer_truck' | 'dry_van' | 'refrigerated_container' | 'frozen_truck';
export type TemperatureRange = 'frozen' | 'refrigerated' | 'cool' | 'ambient';

export type VettingStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

export type ShipmentStatus =
    | 'posted'
    | 'bidding'
    | 'assigned'
    | 'in_transit'
    | 'delivered'
    | 'cancelled'
    | 'completed';

export type ComplianceStatus = 'compliant' | 'warning' | 'violation' | 'pending';

export interface Location {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface IoTData {
    timestamp: string;
    temperature: number; // Celsius
    humidity: number; // Percentage
    location: Location;
    batteryLevel?: number;
    doorStatus?: 'open' | 'closed';
}

export interface Equipment {
    id: string;
    type: EquipmentType;
    make: string;
    model: string;
    year: number;
    capacity: number; // cubic feet
    temperatureRange: {
        min: number;
        max: number;
    };
    certifications: string[];
    lastInspectionDate: string;
}

export interface Shipper {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    address: Location;
    businessLicense: string;
    foodHandlingPermit: string;
    registrationDate: string;
    rating?: number;
    totalShipments?: number;
}

export interface Carrier {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    address: Location;
    dotNumber: string;
    mcNumber: string;
    equipment: Equipment[];
    insurance: {
        liability: number;
        cargo: number;
        expirationDate: string;
    };
    safetyRating: 'satisfactory' | 'conditional' | 'unsatisfactory';
    foodHandlingExperience: number; // years
    certifications: string[];
    vettingStatus: VettingStatus;
    vettingScore?: number; // 0-100
    registrationDate: string;
    rating?: number;
    totalShipments?: number;
    totalReviews?: number;
}

export interface Bid {
    id: string;
    loadId: string;
    carrierId: string;
    carrierName: string;
    amount: number;
    estimatedDeliveryDate: string;
    notes?: string;
    submittedAt: string;
    status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
}

export interface Load {
    id: string;
    shipperId: string;
    shipperName: string;
    origin: Location;
    destination: Location;
    pickupDate: string;
    deliveryDate: string;
    cargoType: string;
    weight: number; // pounds
    volume: number; // cubic feet
    temperatureRequirement: {
        min: number;
        max: number;
        range: TemperatureRange;
    };
    specialRequirements: string[];
    basePrice: number;
    status: ShipmentStatus;
    assignedCarrierId?: string;
    assignedCarrierName?: string;
    bids: Bid[];
    postedAt: string;
    createdAt: string;
}

export interface Shipment {
    id: string;
    loadId: string;
    shipperId: string;
    shipperName: string;
    carrierId: string;
    carrierName: string;
    origin: Location;
    destination: Location;
    pickupDate: string;
    deliveryDate: string;
    actualPickupDate?: string;
    actualDeliveryDate?: string;
    cargoType: string;
    weight: number;
    volume: number;
    temperatureRequirement: {
        min: number;
        max: number;
    };
    equipmentId: string;
    status: ShipmentStatus;
    currentLocation?: Location;
    iotData: IoTData[];
    complianceStatus: ComplianceStatus;
    complianceIssues: ComplianceIssue[];
    estimatedArrival?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ComplianceIssue {
    id: string;
    type: 'temperature_excursion' | 'haccp_violation' | 'documentation_gap' | 'delay';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    detectedAt: string;
    resolved: boolean;
    resolvedAt?: string;
}

export interface Review {
    id: string;
    shipmentId: string;
    reviewerId: string;
    reviewerName: string;
    reviewerRole: 'shipper' | 'carrier';
    revieweeId: string;
    revieweeName: string;
    rating: number; // 1-5
    comment: string;
    createdAt: string;
}

export interface VettingResult {
    carrierId: string;
    status: VettingStatus;
    score: number;
    checks: {
        equipment: { passed: boolean; details: string };
        insurance: { passed: boolean; details: string };
        safety: { passed: boolean; details: string };
        experience: { passed: boolean; details: string };
    };
    reviewedAt: string;
    reviewedBy?: string;
}

