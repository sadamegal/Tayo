export const PALETTES = {
    default: ['#6366f1','#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6','#ec4899','#14b8a6'],
    ocean:   ['#0ea5e9','#38bdf8','#0284c7','#7dd3fc','#0369a1','#bae6fd','#075985','#e0f2fe'],
    vivid:   ['#f43f5e','#f97316','#eab308','#22c55e','#06b6d4','#6366f1','#a855f7','#ec4899'],
    pastel:  ['#fda4af','#fdba74','#fde68a','#86efac','#67e8f9','#a5b4fc','#f0abfc','#6ee7b7'],
    warm:    ['#ef4444','#f97316','#f59e0b','#eab308','#84cc16','#dc2626','#b91c1c','#7f1d1d'],
    cool:    ['#06b6d4','#0ea5e9','#6366f1','#8b5cf6','#a855f7','#0284c7','#2563eb','#4f46e5'],
    rose:    ['#f43f5e','#fb7185','#fda4af','#fecdd3','#e11d48','#be123c','#9f1239','#881337'],
    slate:   ['#334155','#475569','#64748b','#94a3b8','#0f172a','#1e293b','#cbd5e1','#e2e8f0'],
};

/**
 * Resolve a palette name or custom array to a color array.
 * @param {string|string[]} colors
 * @returns {string[]}
 */
export function resolveColors(colors) {
    if (Array.isArray(colors)) return colors;
    const key = String(colors || 'default').trim();
    return PALETTES[key] ?? PALETTES.default;
}
