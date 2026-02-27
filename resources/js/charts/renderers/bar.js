import * as d3 from 'd3';
import { MARGIN, innerWidth, innerHeight, freshSvg, mainG, gridY, axisX, axisY } from '../core/layout.js';
import { showTip, moveTip, hideTip } from '../core/tooltip.js';
import { fmt } from '../core/utils.js';

/**
 * Bar chart renderer.
 * data: [{ label, value, color? }]
 */
export function drawBar(data, { svgEl, canvasEl, tooltipEl, height, colors }) {
    const W   = innerWidth(canvasEl);
    const H   = innerHeight(height);
    const svg = freshSvg(svgEl, canvasEl ? canvasEl.clientWidth : 500, height);
    const g   = mainG(svg);

    const x = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, W])
        .padding(0.28);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([H, 0]);

    gridY(g, y, W);
    axisX(g, x, H);
    axisY(g, y, v => fmt(v));

    const bars = g.selectAll('.bar')
        .data(data)
        .join('rect')
        .attr('class', 'bar')
        .attr('x',      d => x(d.label))
        .attr('width',  x.bandwidth())
        .attr('y',      H)
        .attr('height', 0)
        .attr('rx',     5)
        .attr('fill',   (d, i) => d.color || colors[i % colors.length]);

    bars.transition().duration(550).ease(d3.easeCubicOut)
        .attr('y',      d => y(d.value))
        .attr('height', d => H - y(d.value));

    bars
        .on('mouseenter', (ev, d) => {
            d3.select(ev.currentTarget).attr('opacity', 0.78);
            showTip(ev, canvasEl, tooltipEl, d.label, fmt(d.value));
        })
        .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
        .on('mouseleave', ev => {
            d3.select(ev.currentTarget).attr('opacity', 1);
            hideTip(tooltipEl);
        });
}
