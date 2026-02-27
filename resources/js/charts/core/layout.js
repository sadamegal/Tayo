import * as d3 from 'd3';

/** Standard chart margins. */
export const MARGIN = { top: 16, right: 24, bottom: 44, left: 54 };

/**
 * Return the canvas pixel width, falling back to 500.
 * @param {HTMLElement|null} canvasEl
 * @returns {number}
 */
export function canvasWidth(canvasEl) {
    return canvasEl ? canvasEl.clientWidth : 500;
}

/**
 * Inner drawing width (canvas minus margins).
 * @param {HTMLElement|null} canvasEl
 * @returns {number}
 */
export function innerWidth(canvasEl) {
    return canvasWidth(canvasEl) - MARGIN.left - MARGIN.right;
}

/**
 * Inner drawing height (total height minus margins).
 * @param {number} height
 * @returns {number}
 */
export function innerHeight(height) {
    return height - MARGIN.top - MARGIN.bottom;
}

/**
 * Clear the SVG element and set its dimensions, returning a d3 selection.
 * @param {SVGElement} svgEl
 * @param {number}     totalWidth
 * @param {number}     totalHeight
 * @returns {d3.Selection}
 */
export function freshSvg(svgEl, totalWidth, totalHeight) {
    d3.select(svgEl).selectAll('*').remove();
    svgEl.setAttribute('width',  totalWidth);
    svgEl.setAttribute('height', totalHeight);
    return d3.select(svgEl);
}

/**
 * Append the main <g> translated by margins.
 * @param {d3.Selection} svg
 * @returns {d3.Selection}
 */
export function mainG(svg) {
    return svg.append('g')
        .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);
}

/**
 * Append horizontal grid lines to g.
 * @param {d3.Selection} g
 * @param {d3.Scale}     yScale
 * @param {number}       width   - inner width for tick length
 * @param {number}       [ticks]
 */
export function gridY(g, yScale, width, ticks = 5) {
    g.append('g')
        .attr('class', 'd3c-grid')
        .call(d3.axisLeft(yScale).ticks(ticks).tickSize(-width).tickFormat(''))
        .call(a => a.select('.domain').remove());
}

/**
 * Append the bottom X axis.
 * @param {d3.Selection}    g
 * @param {d3.Scale}        scale
 * @param {number}          height  - inner height for positioning
 * @param {Function|null}   [fmt]
 */
export function axisX(g, scale, height, fmt = null) {
    const ax = d3.axisBottom(scale).tickSize(0).tickPadding(10);
    if (fmt) ax.tickFormat(fmt);
    g.append('g')
        .attr('class', 'd3c-axis')
        .attr('transform', `translate(0,${height})`)
        .call(ax)
        .call(a => a.select('.domain').attr('stroke', '#e2e8f0'));
}

/**
 * Append the left Y axis.
 * @param {d3.Selection}    g
 * @param {d3.Scale}        scale
 * @param {Function|null}   [fmt]
 */
export function axisY(g, scale, fmt = null) {
    const ax = d3.axisLeft(scale).tickSize(0).tickPadding(8).ticks(5);
    if (fmt) ax.tickFormat(fmt);
    g.append('g')
        .attr('class', 'd3c-axis')
        .call(ax)
        .call(a => a.select('.domain').remove());
}

/**
 * Render categorical legend items into the legend container element.
 * @param {HTMLElement}                    legendEl
 * @param {{ label: string, color: string }[]} items
 */
export function setLegend(legendEl, items) {
    if (!legendEl) return;
    legendEl.innerHTML = items.map(it =>
        `<div class="d3c-legend-item">` +
        `<div class="d3c-legend-swatch" style="background:${it.color}"></div>` +
        `${it.label}</div>`
    ).join('');
}
