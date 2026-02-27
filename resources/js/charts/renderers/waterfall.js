import * as d3 from 'd3';
import { innerWidth, innerHeight, freshSvg, mainG, gridY, axisX, axisY } from '../core/layout.js';
import { showTip, moveTip, hideTip } from '../core/tooltip.js';
import { fmt } from '../core/utils.js';

/**
 * Waterfall chart renderer.
 * data: [{ label, value, type?: 'total' | 'positive' | 'negative' }]
 */
export function drawWaterfall(data, { svgEl, canvasEl, tooltipEl, height }) {
    const W   = innerWidth(canvasEl);
    const H   = innerHeight(height);
    const svg = freshSvg(svgEl, canvasEl ? canvasEl.clientWidth : 500, height);
    const g   = mainG(svg);

    let running = 0;
    const computed = data.map((d, i) => {
        if (i === 0 || d.type === 'total') {
            if (i === 0) running = d.value;
            return { ...d, start: 0, end: i === 0 ? d.value : running, isTotal: true };
        }
        const start = running;
        running += d.value;
        return { ...d, start, end: running, isTotal: false };
    });

    const allV = computed.flatMap(d => [d.start, d.end]);
    const x = d3.scaleBand().domain(computed.map(d => d.label)).range([0, W]).padding(0.32);
    const y = d3.scaleLinear().domain([Math.min(...allV), Math.max(...allV)]).nice().range([H, 0]);

    gridY(g, y, W);
    axisX(g, x, H);
    axisY(g, y, v => fmt(v));

    // Connector lines between bars
    computed.slice(0, -1).forEach((d, i) => {
        const nx = computed[i + 1];
        g.append('line')
            .attr('x1', x(d.label) + x.bandwidth()).attr('x2', x(nx.label))
            .attr('y1', y(d.end)).attr('y2', y(d.end))
            .attr('stroke', '#cbd5e1')
            .attr('stroke-dasharray', '3,3')
            .attr('stroke-width', 1);
    });

    const bars = g.selectAll('.wb')
        .data(computed)
        .join('rect')
        .attr('class', 'wb')
        .attr('x',     d => x(d.label))
        .attr('width', x.bandwidth())
        .attr('rx',    4)
        .attr('fill',  d => d.isTotal ? '#6366f1' : d.value >= 0 ? '#22c55e' : '#ef4444')
        .attr('y',     d => y(Math.max(d.start, d.end)))
        .attr('height', d => Math.max(2, Math.abs(y(d.start) - y(d.end))));

    bars
        .on('mouseenter', (ev, d) => {
            d3.select(ev.currentTarget).attr('opacity', 0.8);
            showTip(ev, canvasEl, tooltipEl, d.label, fmt(d.value));
        })
        .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
        .on('mouseleave', ev => {
            d3.select(ev.currentTarget).attr('opacity', 1);
            hideTip(tooltipEl);
        });
}
