/**
 * Format a number into a human-readable string.
 * @param {*} v
 * @returns {string}
 */
export function fmt(v) {
    if (typeof v !== 'number') return String(v);
    if (Math.abs(v) >= 1e6)   return (v / 1e6).toFixed(1) + 'M';
    if (Math.abs(v) >= 1e3)   return (v / 1e3).toFixed(1) + 'K';
    return v.toLocaleString();
}

/**
 * Normalize raw data into a consistent array format.
 * Handles: null, plain objects, number[], and {label,value}[] passthrough.
 * @param {*} data
 * @returns {Array|object|null}
 */
export function normalize(data) {
    if (!data) return null;
    if (!Array.isArray(data) && typeof data === 'object') return data;
    if (!Array.isArray(data) || data.length === 0) return null;
    if (typeof data[0] === 'number') {
        return data.map((v, i) => ({ label: String(i + 1), value: v }));
    }
    return data;
}
