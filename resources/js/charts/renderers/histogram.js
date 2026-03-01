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

    const x        = d3.scaleLinear().domain(d3.extent(vals)).nice().range([0, W]);
    const binCount = Math.min(20, Math.ceil(Math.sqrt(vals.length)));
    const bins     = d3.bin().domain(x.domain()).thresholds(x.ticks(binCount))(vals);

    const maxCount = d3.max(bins, b => b.length);
    const y = d3.scaleLinear()
        .domain([0, maxCount])
        .nice()
        .range([H, 0]);

    gridY(g, y, W, Math.min(5, maxCount));
    axisX(g, x, H);
    axisY(g, y, v => Number.isInteger(v) ? String(v) : '');

    const R = 3; 

    
    const barPath = (x0, x1, yTop) => {
        const bx = x(x0);
        const bw = Math.max(0, x(x1) - x(x0));
        const bh = H - yTop;
        if (bw <= 0 || bh <= 0) return '';
        const r  = Math.min(R, bw / 2, bh);
        return `M${bx},${H}` +
               `L${bx},${yTop + r}` +
               `Q${bx},${yTop} ${bx + r},${yTop}` +
               `L${bx + bw - r},${yTop}` +
               `Q${bx + bw},${yTop} ${bx + bw},${yTop + r}` +
               `L${bx + bw},${H}Z`;
    };

    const bars = g.selectAll('.hb')
        .data(bins)
        .join('path')
        .attr('class', 'hb')
        .attr('d',            b => barPath(b.x0, b.x1, H))
        .attr('fill',         colors[0])
        .attr('fill-opacity', 0.85);

    bars.transition().duration(550).ease(d3.easeCubicOut)
        .attr('d', b => barPath(b.x0, b.x1, y(b.length)));

    const fmt = vals.every(v => Number.isInteger(v))
        ? v => String(Math.round(v))
        : v => d3.format('.2~f')(v);

    bars
        .on('mouseenter', (ev, b) => {
            d3.select(ev.currentTarget).attr('fill-opacity', 1);
            showTip(ev, canvasEl, tooltipEl, `${fmt(b.x0)} – ${fmt(b.x1)}`, `${b.length} items`);
        })
        .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
        .on('mouseleave', ev => {
            d3.select(ev.currentTarget).attr('fill-opacity', 0.85);
            hideTip(tooltipEl);
        });
}
