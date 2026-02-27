import * as d3 from 'd3';
import { freshSvg } from '../core/layout.js';
import { showTip, moveTip, hideTip } from '../core/tooltip.js';
import { fmt } from '../core/utils.js';

/**
 * Pie chart renderer.
 * data: [{ label, value, color? }]
 */
export function drawPie(data, ctx) {
    _pie(data, ctx, 0);
}

/**
 * Donut chart renderer.
 * data: [{ label, value, color? }]
 */
export function drawDonut(data, ctx) {
    _pie(data, ctx, 0.58);
}

function _pie(data, { svgEl, canvasEl, tooltipEl, height, colors }, innerRatio) {
    const isDonut = innerRatio > 0;
    const W       = canvasEl ? canvasEl.clientWidth : 500;
    const H       = height;
    const svg     = freshSvg(svgEl, W, H);
    const r       = Math.min(W * 0.46, H * 0.46) - 10;
    const cx      = isDonut ? W * 0.42 : W / 2;
    const g       = svg.append('g').attr('transform', `translate(${cx},${H / 2})`);
    const pie     = d3.pie().value(d => d.value).sort(null);
    const arc     = d3.arc().innerRadius(r * innerRatio).outerRadius(r);
    const arcH    = d3.arc().innerRadius(r * innerRatio).outerRadius(r + 7);
    const arcs    = pie(data);
    const total   = d3.sum(data, d => d.value);

    const paths = g.selectAll('path')
        .data(arcs)
        .join('path')
        .attr('d', arc)
        .attr('fill',         (_, i) => data[i].color || colors[i % colors.length])
        .attr('stroke',       '#fff')
        .attr('stroke-width', 2.5)
        .style('cursor',      'pointer');

    paths.transition().duration(600).ease(d3.easeCubicOut)
        .attrTween('d', d => {
            const interp = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return t => arc(interp(t));
        });

    paths
        .on('mouseenter', (ev, d) => {
            d3.select(ev.currentTarget).transition().duration(120).attr('d', arcH);
            showTip(
                ev, canvasEl, tooltipEl,
                d.data.label,
                fmt(d.data.value),
                (d.data.value / total * 100).toFixed(1) + '%',
            );
        })
        .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
        .on('mouseleave', ev => {
            d3.select(ev.currentTarget).transition().duration(120).attr('d', arc);
            hideTip(tooltipEl);
        });

    if (isDonut) {
        g.append('text')
            .attr('text-anchor', 'middle').attr('dy', '-0.3em')
            .attr('font-size', r * 0.24).attr('font-weight', '800').attr('fill', '#0f172a')
            .text(fmt(total));
        g.append('text')
            .attr('text-anchor', 'middle').attr('dy', '1em')
            .attr('font-size', 11).attr('fill', '#94a3b8')
            .text('total');
    }

    // Inline legend on right side
    const lx = isDonut ? W * 0.78 : W * 0.82;
    const ly = H / 2 - data.length * 11;
    data.forEach((d, i) => {
        const row = svg.append('g').attr('transform', `translate(${lx},${ly + i * 22})`);
        row.append('rect')
            .attr('width', 9).attr('height', 9).attr('rx', 2)
            .attr('fill', d.color || colors[i % colors.length]);
        row.append('text')
            .attr('x', 14).attr('y', 9)
            .attr('font-size', 11).attr('fill', '#475569')
            .text(d.label.length > 14 ? d.label.slice(0, 14) + '…' : d.label);
    });
}
