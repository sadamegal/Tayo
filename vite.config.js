import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        // Output goes to resources/js/d3-chart.js — served via the package route.
        // d3 is bundled in so there is no external CDN dependency in production.
        outDir: 'resources/js',
        emptyOutDir: false,
        lib: {
            entry:    resolve(__dirname, 'resources/js/charts/d3-chart.js'),
            name:     'tayoCharts',
            fileName: () => 'd3-chart.js',
            formats:  ['iife'],
        },
        minify:    true,
        sourcemap: false,
    },
});
