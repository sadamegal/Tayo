import * as d3 from 'd3';
import { innerWidth, innerHeight, freshSvg, mainG, axisX, axisY } from '../core/layout.js';
import { showTip, moveTip, hideTip } from '../core/tooltip.js';
import { fmt } from '../core/utils.js';

/**
 * Heatmap renderer.
 * data: [{ x, y, value }]
 */
export function drawHeatmap(data, { svgEl, canvasEl, tooltipEl, height, colors }) {
    const W   = innerWidth(canvasEl);
    const H   = innerHeight(height);
    const svg = freshSvg(svgEl, canvasEl ? canvasEl.clientWidth : 500, height);
    const g   = mainG(svg);

    const xs = [...new Set(data.map(d => d.x))];
    const ys = [...new Set(data.map(d => d.y))];

    const x = d3.scaleBand().domain(xs).range([0, W]).padding(0.06);
    const y = d3.scaleBand().domain(ys).range([0, H]).padding(0.06);

    // Interpolate from a near-white tint → the first palette color.
    // Gives a light-to-dark gradient that respects the active palette.
    const baseColor = colors[0] || '#6366f1';
    const col = d3.scaleSequential()
        .domain(d3.extent(data, d => d.value))
        .interpolator(d3.interpolateRgb('#eef2ff', baseColor));

    axisX(g, x, H);
    axisY(g, y);

    const cells = g.selectAll('.cell')
        .data(data)
        .join('rect')
        .attr('class', 'cell')
        .attr('x',      d => x(d.x))
        .attr('y',      d => y(d.y))
        .attr('width',  x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('rx', 3)
        .attr('fill', '#f1f5f9');

    cells.transition().duration(400).attr('fill', d => col(d.value));

    cells
        .on('mouseenter', (ev, d) => showTip(ev, canvasEl, tooltipEl, `${d.x} · ${d.y}`, fmt(d.value)))
        .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
        .on('mouseleave', () => hideTip(tooltipEl));
}
