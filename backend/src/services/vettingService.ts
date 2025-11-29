import type { Carrier, VettingResult, VettingStatus } from '../../../shared/types';
import { db } from '../data/database';

export function performVetting(carrierId: string): VettingResult {
    const carrier = db.getCarrier(carrierId);
    if (!carrier) {
        throw new Error('Carrier not found');
    }

    const checks = {
        equipment: checkEquipment(carrier),
        insurance: checkInsurance(carrier),
        safety: checkSafety(carrier),
        experience: checkExperience(carrier),
    };

    const allPassed = Object.values(checks).every(c => c.passed);
    const passedCount = Object.values(checks).filter(c => c.passed).length;
    const score = Math.round((passedCount / 4) * 100);

    let status: VettingStatus;
    if (allPassed && score >= 80) {
        status = 'approved';
    } else if (score >= 60) {
        status = 'under_review';
    } else {
        status = 'rejected';
    }

    return {
        carrierId,
        status,
        score,
        checks,
        reviewedAt: new Date().toISOString(),
    };
}

function checkEquipment(carrier: Carrier): { passed: boolean; details: string } {
    if (carrier.equipment.length === 0) {
        return { passed: false, details: 'No equipment registered' };
    }

    const hasValidEquipment = carrier.equipment.some(eq => {
        const hasCertifications = eq.certifications.length > 0;
        const inspectionRecent = new Date(eq.lastInspectionDate) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
        return hasCertifications && inspectionRecent;
    });

    if (!hasValidEquipment) {
        return { passed: false, details: 'Equipment lacks valid certifications or recent inspections' };
    }

    return { passed: true, details: `${carrier.equipment.length} equipment units with valid certifications` };
}

function checkInsurance(carrier: Carrier): { passed: boolean; details: string } {
    const expirationDate = new Date(carrier.insurance.expirationDate);
    const isExpired = expirationDate < new Date();
    const isExpiringSoon = expirationDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (isExpired) {
        return { passed: false, details: 'Insurance has expired' };
    }

    if (isExpiringSoon) {
        return { passed: true, details: 'Insurance expires within 30 days - renewal recommended' };
    }

    const hasAdequateCoverage = carrier.insurance.liability >= 1000000 && carrier.insurance.cargo >= 100000;

    if (!hasAdequateCoverage) {
        return { passed: false, details: 'Insurance coverage below minimum requirements' };
    }

    return { passed: true, details: `Liability: $${carrier.insurance.liability.toLocaleString()}, Cargo: $${carrier.insurance.cargo.toLocaleString()}` };
}

function checkSafety(carrier: Carrier): { passed: boolean; details: string } {
    if (carrier.safetyRating === 'unsatisfactory') {
        return { passed: false, details: 'Unsatisfactory safety rating' };
    }

    if (carrier.safetyRating === 'conditional') {
        return { passed: true, details: 'Conditional safety rating - requires monitoring' };
    }

    return { passed: true, details: 'Satisfactory safety rating' };
}

function checkExperience(carrier: Carrier): { passed: boolean; details: string } {
    const hasExperience = carrier.foodHandlingExperience >= 1;
    const hasCertifications = carrier.certifications.length > 0;

    if (!hasExperience && !hasCertifications) {
        return { passed: false, details: 'No food handling experience or certifications' };
    }

    if (hasExperience && hasCertifications) {
        return { passed: true, details: `${carrier.foodHandlingExperience} years experience with ${carrier.certifications.length} certifications` };
    }

    if (hasExperience) {
        return { passed: true, details: `${carrier.foodHandlingExperience} years of food handling experience` };
    }

    return { passed: true, details: `Certified in: ${carrier.certifications.join(', ')}` };
}

