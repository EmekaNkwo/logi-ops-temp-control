import type { Shipment, ComplianceIssue, IoTData } from '../../../shared/types';
import { db } from '../data/database';

export function checkCompliance(shipmentId: string): ComplianceIssue[] {
    const shipment = db.getShipment(shipmentId);
    if (!shipment) {
        throw new Error('Shipment not found');
    }

    const issues: ComplianceIssue[] = [];

    // Check temperature excursions
    const tempIssues = checkTemperatureExcursions(shipment);
    issues.push(...tempIssues);

    // Check HACCP violations
    const haccpIssues = checkHACCPViolations(shipment);
    issues.push(...haccpIssues);

    // Check documentation gaps
    const docIssues = checkDocumentationGaps(shipment);
    issues.push(...docIssues);

    // Check delays
    const delayIssues = checkDelays(shipment);
    issues.push(...delayIssues);

    // Update shipment compliance status
    const complianceStatus = determineComplianceStatus(issues);
    db.updateShipment(shipmentId, {
        complianceStatus,
        complianceIssues: issues,
    });

    return issues;
}

function checkTemperatureExcursions(shipment: Shipment): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];
    const { min, max } = shipment.temperatureRequirement;
    const threshold = 2; // 2 degree buffer

    for (let i = 0; i < shipment.iotData.length; i++) {
        const data = shipment.iotData[i];
        const temp = data.temperature;

        if (temp < min - threshold || temp > max + threshold) {
            const severity =
                temp < min - 5 || temp > max + 5 ? 'critical' :
                    temp < min - 3 || temp > max + 3 ? 'high' :
                        'medium';

            issues.push({
                id: `temp-${shipment.id}-${i}`,
                type: 'temperature_excursion',
                severity,
                description: `Temperature excursion: ${temp.toFixed(1)}°C (required: ${min}°C - ${max}°C) at ${data.timestamp}`,
                detectedAt: data.timestamp,
                resolved: false,
            });
        }
    }

    return issues;
}

function checkHACCPViolations(shipment: Shipment): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];

    // Check for door open violations (door should be closed during transit)
    for (let i = 0; i < shipment.iotData.length; i++) {
        const data = shipment.iotData[i];
        if (data.doorStatus === 'open' && shipment.status === 'in_transit') {
            issues.push({
                id: `haccp-${shipment.id}-${i}`,
                type: 'haccp_violation',
                severity: 'high',
                description: `Door opened during transit at ${data.timestamp}`,
                detectedAt: data.timestamp,
                resolved: false,
            });
        }
    }

    // Check for extended temperature monitoring gaps
    if (shipment.iotData.length > 0) {
        const sortedData = [...shipment.iotData].sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        for (let i = 1; i < sortedData.length; i++) {
            const timeDiff = new Date(sortedData[i].timestamp).getTime() - new Date(sortedData[i - 1].timestamp).getTime();
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            if (hoursDiff > 4) {
                issues.push({
                    id: `haccp-gap-${shipment.id}-${i}`,
                    type: 'haccp_violation',
                    severity: 'medium',
                    description: `Temperature monitoring gap of ${hoursDiff.toFixed(1)} hours detected`,
                    detectedAt: sortedData[i].timestamp,
                    resolved: false,
                });
            }
        }
    }

    return issues;
}

function checkDocumentationGaps(shipment: Shipment): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];

    // Check for missing pickup documentation
    if (shipment.status !== 'posted' && !shipment.actualPickupDate) {
        issues.push({
            id: `doc-pickup-${shipment.id}`,
            type: 'documentation_gap',
            severity: 'medium',
            description: 'Missing actual pickup date documentation',
            detectedAt: new Date().toISOString(),
            resolved: false,
        });
    }

    // Check for missing delivery documentation
    if (shipment.status === 'delivered' && !shipment.actualDeliveryDate) {
        issues.push({
            id: `doc-delivery-${shipment.id}`,
            type: 'documentation_gap',
            severity: 'high',
            description: 'Missing actual delivery date documentation',
            detectedAt: new Date().toISOString(),
            resolved: false,
        });
    }

    // Check for insufficient IoT data
    if (shipment.status === 'in_transit' && shipment.iotData.length < 10) {
        issues.push({
            id: `doc-iot-${shipment.id}`,
            type: 'documentation_gap',
            severity: 'low',
            description: 'Insufficient IoT monitoring data points',
            detectedAt: new Date().toISOString(),
            resolved: false,
        });
    }

    return issues;
}

function checkDelays(shipment: Shipment): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];

    if (shipment.status === 'in_transit' && shipment.estimatedArrival) {
        const estimated = new Date(shipment.estimatedArrival);
        const now = new Date();
        const delayHours = (now.getTime() - estimated.getTime()) / (1000 * 60 * 60);

        if (delayHours > 24) {
            issues.push({
                id: `delay-${shipment.id}`,
                type: 'delay',
                severity: 'high',
                description: `Shipment delayed by ${Math.round(delayHours)} hours`,
                detectedAt: new Date().toISOString(),
                resolved: false,
            });
        } else if (delayHours > 12) {
            issues.push({
                id: `delay-${shipment.id}`,
                type: 'delay',
                severity: 'medium',
                description: `Shipment delayed by ${Math.round(delayHours)} hours`,
                detectedAt: new Date().toISOString(),
                resolved: false,
            });
        }
    }

    return issues;
}

function determineComplianceStatus(issues: ComplianceIssue[]): 'compliant' | 'warning' | 'violation' | 'pending' {
    if (issues.length === 0) {
        return 'compliant';
    }

    const hasCritical = issues.some(i => i.severity === 'critical');
    const hasHigh = issues.some(i => i.severity === 'high');
    const unresolved = issues.filter(i => !i.resolved);

    if (hasCritical && unresolved.length > 0) {
        return 'violation';
    }

    if (hasHigh && unresolved.length > 0) {
        return 'violation';
    }

    if (unresolved.length > 0) {
        return 'warning';
    }

    return 'compliant';
}

