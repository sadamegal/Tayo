import * as d3 from 'd3';
import { freshSvg } from '../core/layout.js';
import { fmt } from '../core/utils.js';

/**
 * Gauge renderer.
 * data: { value, min?, max?, label?, zones?: [{ from, to, color }] }
 */
export function drawGauge(data, { svgEl, canvasEl, height, colors }) {
    const value = data.value  ?? 0;
    const min   = data.min   ?? 0;
    const max   = data.max   ?? 100;
    const label = data.label ?? '';
    const zones = data.zones ?? [];

    const W   = canvasEl ? canvasEl.clientWidth : 500;
    const H   = height;
    const cx  = W / 2;
    const cy  = H * 0.68;
    const r   = Math.min(W * 0.42, H * 0.78);
    const sA  = -Math.PI * 0.75;
    const eA  =  Math.PI * 0.75;

    const scale = d3.scaleLinear().domain([min, max]).range([sA, eA]);
    const svg   = freshSvg(svgEl, W, H);
    const g     = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    // Track background
    g.append('path')
        .attr('d', d3.arc()({ innerRadius: r * 0.68, outerRadius: r, startAngle: sA, endAngle: eA }))
        .attr('fill', '#f1f5f9');

    // Fill — zones or single color
    if (zones.length) {
        zones.forEach(z => {
            g.append('path')
                .attr('d', d3.arc()({ innerRadius: r * 0.68, outerRadius: r, startAngle: scale(z.from), endAngle: scale(z.to) }))
                .attr('fill', z.color);
        });
    } else {
        g.append('path')
            .attr('d', d3.arc()({ innerRadius: r * 0.68, outerRadius: r, startAngle: sA, endAngle: scale(value) }))
            .attr('fill', colors[0]);
    }

    // Needle
    const nA = scale(value);
    g.append('line')
        .attr('x2', Math.cos(nA - Math.PI / 2) * r * 0.6)
        .attr('y2', Math.sin(nA - Math.PI / 2) * r * 0.6)
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round');
    g.append('circle').attr('r', 7).attr('fill', '#1e293b');

    // Value label
    g.append('text')
        .attr('text-anchor', 'middle').attr('dy', '-0.3em')
        .attr('font-size', r * 0.24).attr('font-weight', '800').attr('fill', '#0f172a')
        .text(fmt(value));

    if (label) {
        g.append('text')
            .attr('text-anchor', 'middle').attr('dy', '1.1em')
            .attr('font-size', r * 0.1).attr('fill', '#94a3b8')
            .text(label);
    }
}
