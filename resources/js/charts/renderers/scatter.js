import * as d3 from 'd3';
import { innerWidth, innerHeight, freshSvg, mainG, gridY, axisX, axisY, setLegend } from '../core/layout.js';
import { showTip, moveTip, hideTip } from '../core/tooltip.js';

/**
 * Scatter plot renderer.
 * data: [{ x, y, label?, group? }]
 */
export function drawScatter(data, { svgEl, canvasEl, tooltipEl, legendEl, height, colors }) {
    const W   = innerWidth(canvasEl);
    const H   = innerHeight(height);
    const svg = freshSvg(svgEl, canvasEl ? canvasEl.clientWidth : 500, height);
    const g   = mainG(svg);

    const groups = [...new Set(data.map(d => d.group || '_'))];
    const cScale = d3.scaleOrdinal().domain(groups).range(colors);

    const x = d3.scaleLinear().domain(d3.extent(data, d => d.x)).nice().range([0, W]);
    const y = d3.scaleLinear().domain(d3.extent(data, d => d.y)).nice().range([H, 0]);

    gridY(g, y, W);
    // Vertical grid lines
    g.append('g')
        .attr('class', 'd3c-grid')
        .call(d3.axisBottom(x).tickSize(-H).tickFormat(''))
        .attr('transform', `translate(0,${H})`)
        .call(a => a.select('.domain').remove());

    axisX(g, x, H);
    axisY(g, y);

    const dots = g.selectAll('.sd')
        .data(data)
        .join('circle')
        .attr('class', 'sd')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('r', 0)
        .attr('fill', d => cScale(d.group || '_'))
        .attr('fill-opacity', 0.72)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);

    dots.transition().duration(450).ease(d3.easeBounceOut).attr('r', 6);

    dots
        .on('mouseenter', (ev, d) => {
            d3.select(ev.currentTarget).attr('r', 8).attr('fill-opacity', 1);
            showTip(ev, canvasEl, tooltipEl, d.label || `(${d.x}, ${d.y})`, `x: ${d.x}  y: ${d.y}`);
        })
        .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
        .on('mouseleave', ev => {
            d3.select(ev.currentTarget).attr('r', 6).attr('fill-opacity', 0.72);
            hideTip(tooltipEl);
        });

    if (groups.length > 1 && groups[0] !== '_') {
        setLegend(legendEl, groups.map((gr, i) => ({ label: gr, color: colors[i % colors.length] })));
    }
}
