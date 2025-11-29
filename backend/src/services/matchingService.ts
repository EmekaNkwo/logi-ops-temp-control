import type { Load, Carrier, Equipment } from '../../../shared/types';
import { db } from '../data/database';

export interface MatchScore {
    carrier: Carrier;
    score: number;
    reasons: string[];
}

export function findMatchingCarriers(loadId: string): MatchScore[] {
    const load = db.getLoad(loadId);
    if (!load) {
        throw new Error('Load not found');
    }

    const carriers = db.getCarriers();
    const matches: MatchScore[] = [];

    for (const carrier of carriers) {
        // Only consider approved carriers
        if (carrier.vettingStatus !== 'approved') {
            continue;
        }

        const score = calculateMatchScore(load, carrier);
        if (score.score > 0) {
            matches.push(score);
        }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return matches;
}

function calculateMatchScore(load: Load, carrier: Carrier): MatchScore {
    let score = 0;
    const reasons: string[] = [];

    // Equipment compatibility (40 points)
    const equipmentMatch = findCompatibleEquipment(load, carrier);
    if (equipmentMatch) {
        score += 40;
        reasons.push(`Compatible equipment: ${equipmentMatch.type} (${equipmentMatch.make} ${equipmentMatch.model})`);
    } else {
        reasons.push('No compatible equipment available');
        return { carrier, score: 0, reasons };
    }

    // Geographic proximity (20 points)
    const originDistance = calculateDistance(load.origin, carrier.address);
    if (originDistance < 50) {
        score += 20;
        reasons.push(`Close to origin (${Math.round(originDistance)} miles)`);
    } else if (originDistance < 200) {
        score += 10;
        reasons.push(`Moderate distance to origin (${Math.round(originDistance)} miles)`);
    } else {
        reasons.push(`Far from origin (${Math.round(originDistance)} miles)`);
    }

    // Temperature range compatibility (20 points)
    const tempCompatible = isTemperatureCompatible(load, equipmentMatch);
    if (tempCompatible) {
        score += 20;
        reasons.push('Temperature range fully compatible');
    } else {
        score += 10;
        reasons.push('Temperature range partially compatible');
    }

    // Carrier rating (10 points)
    if (carrier.rating) {
        if (carrier.rating >= 4.5) {
            score += 10;
            reasons.push(`Excellent rating (${carrier.rating.toFixed(1)})`);
        } else if (carrier.rating >= 4.0) {
            score += 7;
            reasons.push(`Good rating (${carrier.rating.toFixed(1)})`);
        } else if (carrier.rating >= 3.5) {
            score += 5;
            reasons.push(`Average rating (${carrier.rating.toFixed(1)})`);
        }
    }

    // Experience and certifications (10 points)
    if (carrier.foodHandlingExperience >= 5) {
        score += 5;
        reasons.push(`${carrier.foodHandlingExperience} years experience`);
    }
    if (carrier.certifications.length >= 2) {
        score += 5;
        reasons.push(`Multiple certifications (${carrier.certifications.length})`);
    }

    return { carrier, score, reasons };
}

function findCompatibleEquipment(load: Load, carrier: Carrier): Equipment | null {
    const requiredMin = load.temperatureRequirement.min;
    const requiredMax = load.temperatureRequirement.max;
    const requiredVolume = load.volume;

    for (const equipment of carrier.equipment) {
        const canMaintainTemp =
            equipment.temperatureRange.min <= requiredMin &&
            equipment.temperatureRange.max >= requiredMax;

        const hasCapacity = equipment.capacity >= requiredVolume * 0.8; // 80% capacity threshold

        if (canMaintainTemp && hasCapacity) {
            return equipment;
        }
    }

    return null;
}

function isTemperatureCompatible(load: Load, equipment: Equipment): boolean {
    const buffer = 2; // 2 degree buffer
    return (
        equipment.temperatureRange.min <= load.temperatureRequirement.min - buffer &&
        equipment.temperatureRange.max >= load.temperatureRequirement.max + buffer
    );
}

function calculateDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number {
    // Haversine formula for distance calculation
    const R = 3959; // Earth radius in miles
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

