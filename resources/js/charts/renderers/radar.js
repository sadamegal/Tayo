import * as d3 from 'd3';
import { freshSvg, setLegend } from '../core/layout.js';
import { showTip, moveTip, hideTip } from '../core/tooltip.js';
import { fmt } from '../core/utils.js';

/**
 * Radar / spider chart renderer.
 * data (single):  [{ axis, value }]
 * data (multi):   [{ name, values: [{ axis, value }], color? }]
 */
export function drawRadar(data, { svgEl, canvasEl, tooltipEl, legendEl, height, colors }) {
    const isMulti = !!(data[0]?.name);
    const series  = isMulti ? data : [{ name: '', values: data }];
    const axes    = series[0].values.map(d => d.axis);
    const n       = axes.length;
    const W       = canvasEl ? canvasEl.clientWidth : 500;
    const H       = height;
    const r       = Math.min(W, H) / 2 - 56;
    const maxVal  = d3.max(series.flatMap(s => s.values.map(v => v.value)));
    const rScale  = d3.scaleLinear().domain([0, maxVal]).range([0, r]);
    const aSlice  = (Math.PI * 2) / n;
    const svg     = freshSvg(svgEl, W, H);
    const g       = svg.append('g').attr('transform', `translate(${W / 2},${H / 2})`);

    // Web rings
    [0.25, 0.5, 0.75, 1].forEach(pct => {
        const pts = axes.map((_, i) => {
            const a = aSlice * i - Math.PI / 2;
            return `${Math.cos(a) * r * pct},${Math.sin(a) * r * pct}`;
        });
        g.append('polygon')
            .attr('points', pts.join(' '))
            .attr('fill', 'none')
            .attr('stroke', '#e2e8f0');
    });

    // Spokes + labels
    axes.forEach((ax, i) => {
        const a  = aSlice * i - Math.PI / 2;
        const lx = Math.cos(a) * (r + 20);
        const ly = Math.sin(a) * (r + 20);
        g.append('line')
            .attr('x2', Math.cos(a) * r).attr('y2', Math.sin(a) * r)
            .attr('stroke', '#e2e8f0');
        g.append('text')
            .attr('x', lx).attr('y', ly + 4)
            .attr('text-anchor', Math.abs(lx) < 5 ? 'middle' : lx > 0 ? 'start' : 'end')
            .attr('font-size', 11).attr('fill', '#475569')
            .text(ax);
    });

    // Series polygons + dots
    series.forEach((s, si) => {
        const col = s.color || colors[si % colors.length];
        const pts = s.values.map((v, i) => {
            const a  = aSlice * i - Math.PI / 2;
            const rv = rScale(v.value);
            return `${Math.cos(a) * rv},${Math.sin(a) * rv}`;
        });

        g.append('polygon')
            .attr('points', pts.join(' '))
            .attr('fill', col).attr('fill-opacity', 0.15)
            .attr('stroke', col).attr('stroke-width', 2);

        g.selectAll(`.rd${si}`)
            .data(s.values)
            .join('circle')
            .attr('class', `rd${si}`)
            .attr('cx', (v, i) => Math.cos(aSlice * i - Math.PI / 2) * rScale(v.value))
            .attr('cy', (v, i) => Math.sin(aSlice * i - Math.PI / 2) * rScale(v.value))
            .attr('r', 4)
            .attr('fill', col)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .on('mouseenter', (ev, v) => showTip(ev, canvasEl, tooltipEl, v.axis, fmt(v.value), isMulti ? s.name : ''))
            .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
            .on('mouseleave', () => hideTip(tooltipEl));
    });

    if (isMulti) {
        setLegend(legendEl, series.map((s, i) => ({
            label: s.name,
            color: s.color || colors[i % colors.length],
        })));
    }
}
