import * as d3 from 'd3';
import { freshSvg } from '../core/layout.js';
import { showTip, moveTip, hideTip } from '../core/tooltip.js';
import { fmt } from '../core/utils.js';

/**
 * Funnel chart renderer.
 * data: [{ label, value, color? }]  — ordered largest → smallest
 */
export function drawFunnel(data, { svgEl, canvasEl, tooltipEl, height, colors }) {
    const W    = canvasEl ? canvasEl.clientWidth : 500;
    const H    = height;
    const cx   = W / 2;
    const maxW = W * 0.7;
    const rowH = (H - 24) / data.length;
    const maxV = data[0].value;
    const svg  = freshSvg(svgEl, W, H);
    const g    = svg.append('g').attr('transform', 'translate(0,12)');

    data.forEach((d, i) => {
        const pct  = d.value / maxV;
        const nPct = i < data.length - 1 ? data[i + 1].value / maxV : pct;
        const tw   = pct  * maxW;
        const bw   = nPct * maxW;
        const y    = i * rowH;

        const pts = [
            `${cx - tw / 2},${y}`,
            `${cx + tw / 2},${y}`,
            `${cx + bw / 2},${y + rowH - 2}`,
            `${cx - bw / 2},${y + rowH - 2}`,
        ].join(' ');

        g.append('polygon')
            .attr('points', pts)
            .attr('fill', d.color || colors[i % colors.length])
            .attr('fill-opacity', 0.88)
            .on('mouseenter', ev => {
                const conv = i > 0
                    ? (d.value / data[i - 1].value * 100).toFixed(1) + '% conv.'
                    : 'Top';
                showTip(ev, canvasEl, tooltipEl, d.label, fmt(d.value), conv);
            })
            .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
            .on('mouseleave', () => hideTip(tooltipEl));

        if (rowH > 22) {
            g.append('text')
                .attr('x', cx).attr('y', y + rowH / 2 + 5)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11).attr('font-weight', '600')
                .attr('fill', '#fff').attr('pointer-events', 'none')
                .text(`${d.label}  ${fmt(d.value)}`);
        }

        if (i > 0 && rowH > 16) {
            g.append('text')
                .attr('x', cx + maxW / 2 + 10).attr('y', y + rowH / 2 + 4)
                .attr('font-size', 10).attr('fill', '#94a3b8')
                .attr('pointer-events', 'none')
                .text(`▼${(d.value / data[i - 1].value * 100).toFixed(0)}%`);
        }
    });
}
