import { resolveColors } from './core/palettes.js';
import { normalize } from './core/utils.js';
import { showTip, moveTip, hideTip } from './core/tooltip.js';
import { RENDERERS } from './renderers/index.js';

/**
 * Alpine component factory for d3-chart.
 *
 * Registered in app.js (or bootstrap.js) as:
 *   import { tayoChart } from './charts/d3-chart.js';
 *   Alpine.data('tayoChart', tayoChart);
 *
 * @param {object} config
 * @param {string}          config.type    - chart type key
 * @param {*}               config.data    - raw data from Blade @js()
 * @param {number}          config.height  - total pixel height
 * @param {string|string[]} config.colors  - palette name or hex array
 */
// Livewire 3 ships Alpine — hook into its init event rather than importing it.
document.addEventListener('alpine:init', () => {
    Alpine.data('tayoChart', tayoChart);
});

export function tayoChart(config) {
    return {
        // ── Reactive state ────────────────────────────────────────────────
        type:        config.type,
        data:        config.data,
        height:      config.height,
        colors:      config.colors,
        loading:     false,
        currentData: null,

        // ── Lifecycle ─────────────────────────────────────────────────────
        init() {
            this.currentData = normalize(this.data);
            // Resolve palette once — avoids reading through Alpine's proxy on every draw.
            this._colors = resolveColors(this.colors);

            this.$nextTick(() => {
                if (this.currentData) this._draw(this.currentData);

                this.$watch('data', value => {
                    this.currentData = normalize(value);
                    if (this.currentData) this._draw(this.currentData);
                });

                new ResizeObserver(() => {
                    if (this.currentData && this._refsReady()) {
                        this._draw(this.currentData);
                    }
                }).observe(this.$refs.canvas);
            });
        },

        // ── Drawing ───────────────────────────────────────────────────────
        _draw(data) {
            if (!data || !this._refsReady()) return;

            this.$refs.legend.innerHTML = '';

            const renderer = RENDERERS[this.type];
            if (!renderer) {
                console.warn('[d3-chart] unknown type:', this.type);
                return;
            }

            renderer(data, this._ctx());
        },

        /**
         * Build the context object passed to every renderer.
         * @returns {object}
         */
        _ctx() {
            return {
                svgEl:     this.$refs.svg,
                canvasEl:  this.$refs.canvas,
                tooltipEl: this.$refs.tooltip,
                legendEl:  this.$refs.legend,
                height:    this.height,
                colors:    this._colors,
            };
        },

        // ── Tooltip (exposed for renderers that call back via ctx) ────────
        tip(ev, label, value, extra) {
            showTip(ev, this.$refs.canvas, this.$refs.tooltip, label, value, extra);
        },
        moveTip(ev) {
            moveTip(ev, this.$refs.canvas, this.$refs.tooltip);
        },
        hideTip() {
            hideTip(this.$refs.tooltip);
        },

        // ── Guards ────────────────────────────────────────────────────────
        _refsReady() {
            return !!(
                this.$refs.canvas &&
                this.$refs.svg    &&
                this.$refs.legend &&
                this.$refs.tooltip
            );
        },
    };
}
