import * as d3 from 'd3';
import { innerWidth, innerHeight, freshSvg, mainG, gridY, axisX, axisY } from '../core/layout.js';
import { showTip, moveTip, hideTip } from '../core/tooltip.js';

/**
 * Histogram renderer.
 * data: number[]  OR  [{ value }]
 */
export function drawHistogram(data, { svgEl, canvasEl, tooltipEl, height, colors }) {
    const vals = data.map(d => typeof d === 'number' ? d : d.value);
    const W    = innerWidth(canvasEl);
    const H    = innerHeight(height);
    const svg  = freshSvg(svgEl, canvasEl ? canvasEl.clientWidth : 500, height);
    const g    = mainG(svg);

    const x    = d3.scaleLinear().domain(d3.extent(vals)).nice().range([0, W]);
    const bins = d3.bin().domain(x.domain()).thresholds(x.ticks(20))(vals);
    const y    = d3.scaleLinear()
        .domain([0, d3.max(bins, b => b.length)])
        .nice()
        .range([H, 0]);

    gridY(g, y, W);
    axisX(g, x, H);
    axisY(g, y);

    const bars = g.selectAll('.hb')
        .data(bins)
        .join('rect')
        .attr('class', 'hb')
        .attr('x',      b => x(b.x0) + 1)
        .attr('width',  b => Math.max(0, x(b.x1) - x(b.x0) - 2))
        .attr('y',      H)
        .attr('height', 0)
        .attr('rx', 3)
        .attr('fill', colors[0])
        .attr('fill-opacity', 0.85);

    bars.transition().duration(550).ease(d3.easeCubicOut)
        .attr('y',      b => y(b.length))
        .attr('height', b => H - y(b.length));

    bars
        .on('mouseenter', (ev, b) => {
            d3.select(ev.currentTarget).attr('fill-opacity', 1);
            showTip(ev, canvasEl, tooltipEl, `${b.x0} – ${b.x1}`, `${b.length} items`);
        })
        .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
        .on('mouseleave', ev => {
            d3.select(ev.currentTarget).attr('fill-opacity', 0.85);
            hideTip(tooltipEl);
        });
}
