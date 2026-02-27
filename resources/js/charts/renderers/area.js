import * as d3 from 'd3';
import { innerWidth, innerHeight, freshSvg, mainG, gridY, axisX, axisY, setLegend } from '../core/layout.js';
import { showTip, moveTip, hideTip } from '../core/tooltip.js';
import { fmt } from '../core/utils.js';

/**
 * Area chart renderer.
 * data (single):  [{ label, value }]
 * data (multi):   [{ name, data: [{ x, y }], color? }]
 */
export function drawArea(data, { svgEl, canvasEl, tooltipEl, legendEl, height, colors }) {
    const isMulti = !!(data[0]?.name);
    const series  = isMulti
        ? data
        : [{ name: '', data: data.map(d => ({ x: d.label, y: d.value })) }];

    const allPts = series.flatMap(s => s.data);
    const W      = innerWidth(canvasEl);
    const H      = innerHeight(height);
    const svg    = freshSvg(svgEl, canvasEl ? canvasEl.clientWidth : 500, height);
    const g      = mainG(svg);

    const xDomain = [...new Set(allPts.map(d => d.x))];
    const x = d3.scalePoint().domain(xDomain).range([0, W]).padding(0.15);
    const y = d3.scaleLinear()
        .domain([0, d3.max(allPts, d => d.y)])
        .nice()
        .range([H, 0]);

    gridY(g, y, W);
    axisX(g, x, H);
    axisY(g, y, v => fmt(v));

    const curve   = d3.curveCatmullRom.alpha(0.5);
    const areaGen = d3.area().x(d => x(d.x)).y0(H).y1(d => y(d.y)).curve(curve);
    const lineGen = d3.line().x(d => x(d.x)).y(d => y(d.y)).curve(curve);

    series.forEach((s, i) => {
        const col = s.color || colors[i % colors.length];

        g.append('path').datum(s.data)
            .attr('fill', col).attr('fill-opacity', 0.15).attr('d', areaGen);

        g.append('path').datum(s.data)
            .attr('fill', 'none').attr('stroke', col)
            .attr('stroke-width', 2.5).attr('d', lineGen);

        g.selectAll(`.ad${i}`)
            .data(s.data)
            .join('circle')
            .attr('class', `ad${i}`)
            .attr('cx', d => x(d.x))
            .attr('cy', d => y(d.y))
            .attr('r', 3.5)
            .attr('fill', col)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .on('mouseenter', (ev, d) => {
                d3.select(ev.currentTarget).attr('r', 5.5);
                showTip(ev, canvasEl, tooltipEl, d.x, fmt(d.y), isMulti ? s.name : '');
            })
            .on('mousemove',  ev => moveTip(ev, canvasEl, tooltipEl))
            .on('mouseleave', ev => {
                d3.select(ev.currentTarget).attr('r', 3.5);
                hideTip(tooltipEl);
            });
    });

    if (isMulti) {
        setLegend(legendEl, series.map((s, i) => ({
            label: s.name,
            color: s.color || colors[i % colors.length],
        })));
    }
}
