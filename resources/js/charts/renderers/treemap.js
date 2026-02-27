import * as d3 from 'd3';
import { freshSvg } from '../core/layout.js';
import { showTip, moveTip, hideTip } from '../core/tooltip.js';
import { fmt } from '../core/utils.js';

/**
 * Treemap renderer.
 * data: { name, children: [{ name, value }] }
 */
export function drawTreemap(data, { svgEl, canvasEl, tooltipEl, height, colors }) {
    const W   = canvasEl ? canvasEl.clientWidth : 500;
    const H   = height;
    const svg = freshSvg(svgEl, W, H);

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    d3.treemap().size([W, H]).paddingInner(3).paddingOuter(5)(root);

    const leaves = svg.selectAll('.leaf')
        .data(root.leaves())
        .join('g')
        .attr('class', 'leaf');

    leaves.append('rect')
        .attr('x',      d => d.x0)
        .attr('y',      d => d.y0)
        .attr('width',  d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('rx', 5)
        .attr('fill', (_, i) => colors[i % colors.length])
        .attr('fill-opacity', 0.88)
        .on('mouseenter', (ev, d) => showTip(ev, canvasEl, tooltipEl, d.data.name, fmt(d.data.value)))
        .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
        .on('mouseleave', () => hideTip(tooltipEl));

    leaves.append('text')
        .attr('x', d => d.x0 + 8)
        .attr('y', d => d.y0 + 17)
        .attr('font-size', 11)
        .attr('font-weight', '600')
        .attr('fill', '#fff')
        .attr('pointer-events', 'none')
        .text(d => (d.x1 - d.x0) > 50 ? d.data.name : '');
}
