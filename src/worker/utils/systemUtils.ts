const knownSystemMetrics = ["rssi", "heap", "uptime"] as const;

export function isKnownSystemMetric(
    metric: string
): metric is typeof knownSystemMetrics[number] {
    return knownSystemMetrics.includes(metric as any);
}
