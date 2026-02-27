export { drawBar }       from './bar.js';
export { drawLine }      from './line.js';
export { drawArea }      from './area.js';
export { drawPie, drawDonut } from './pie.js';
export { drawScatter }   from './scatter.js';
export { drawBubble }    from './bubble.js';
export { drawRadar }     from './radar.js';
export { drawHeatmap }   from './heatmap.js';
export { drawTreemap }   from './treemap.js';
export { drawGauge }     from './gauge.js';
export { drawHistogram } from './histogram.js';
export { drawWaterfall } from './waterfall.js';
export { drawFunnel }    from './funnel.js';

import { drawBar }       from './bar.js';
import { drawLine }      from './line.js';
import { drawArea }      from './area.js';
import { drawPie, drawDonut } from './pie.js';
import { drawScatter }   from './scatter.js';
import { drawBubble }    from './bubble.js';
import { drawRadar }     from './radar.js';
import { drawHeatmap }   from './heatmap.js';
import { drawTreemap }   from './treemap.js';
import { drawGauge }     from './gauge.js';
import { drawHistogram } from './histogram.js';
import { drawWaterfall } from './waterfall.js';
import { drawFunnel }    from './funnel.js';

/**
 * Map of chart type string → renderer function.
 * Each renderer signature: (data, ctx) where ctx = { svgEl, canvasEl, tooltipEl, legendEl, height, colors }
 */
export const RENDERERS = {
    bar:       drawBar,
    line:      drawLine,
    area:      drawArea,
    pie:       drawPie,
    donut:     drawDonut,
    scatter:   drawScatter,
    bubble:    drawBubble,
    radar:     drawRadar,
    heatmap:   drawHeatmap,
    treemap:   drawTreemap,
    gauge:     drawGauge,
    histogram: drawHistogram,
    waterfall: drawWaterfall,
    funnel:    drawFunnel,
};
