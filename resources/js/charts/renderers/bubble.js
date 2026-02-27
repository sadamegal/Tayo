import * as d3 from 'd3';
import { innerWidth, innerHeight, freshSvg, mainG, gridY, axisX, axisY } from '../core/layout.js';
import { showTip, moveTip, hideTip } from '../core/tooltip.js';

/**
 * Bubble chart renderer.
 * data: [{ x, y, r, label? }]
 */
export function drawBubble(data, { svgEl, canvasEl, tooltipEl, height, colors }) {
    const W   = innerWidth(canvasEl);
    const H   = innerHeight(height);
    const svg = freshSvg(svgEl, canvasEl ? canvasEl.clientWidth : 500, height);
    const g   = mainG(svg);

    const x = d3.scaleLinear().domain(d3.extent(data, d => d.x)).nice().range([0, W]);
    const y = d3.scaleLinear().domain(d3.extent(data, d => d.y)).nice().range([H, 0]);
    const r = d3.scaleSqrt().domain([0, d3.max(data, d => d.r)]).range([4, 50]);

    gridY(g, y, W);
    axisX(g, x, H);
    axisY(g, y);

    const bubs = g.selectAll('.bb')
        .data(data)
        .join('circle')
        .attr('class', 'bb')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('r', 0)
        .attr('fill', (_, i) => colors[i % colors.length])
        .attr('fill-opacity', 0.65)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

    bubs.transition().duration(700).ease(d3.easeCubicOut).attr('r', d => r(d.r));

    bubs
        .on('mouseenter', (ev, d) => {
            d3.select(ev.currentTarget).attr('fill-opacity', 0.9);
            showTip(ev, canvasEl, tooltipEl, d.label || '', `x:${d.x}  y:${d.y}  size:${d.r}`);
        })
        .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
        .on('mouseleave', ev => {
            d3.select(ev.currentTarget).attr('fill-opacity', 0.65);
            hideTip(tooltipEl);
        });

    // Labels inside large bubbles
    g.selectAll('.bl')
        .data(data)
        .join('text')
        .attr('class', 'bl')
        .attr('x', d => x(d.x))
        .attr('y', d => y(d.y) + 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('font-weight', '600')
        .attr('fill', '#fff')
        .attr('pointer-events', 'none')
        .text(d => r(d.r) > 16 ? (d.label || '') : '');
}
