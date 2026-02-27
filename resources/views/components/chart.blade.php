@props([
    'type'     => 'bar',
    'data'     => null,
    'height'   => 320,
    'colors'   => 'default',
    'title'    => null,
    'subtitle' => null,
])

<div
    wire:key="tayo-{{ $type }}-{{ uniqid() }}"
    wire:ignore
    x-data="tayoChart({
        type:   @js($type),
        data:   @js($data),
        height: @js($height),
        colors: @js($colors),
    })"
    x-init="init()"
    class="relative w-full"
    style="font-family: 'DM Sans', system-ui, sans-serif;"
>
    @if($title || $subtitle)
    <div class="d3c-header">
        @if($title)    <p class="d3c-title">{{ $title }}</p>       @endif
        @if($subtitle) <p class="d3c-subtitle">{{ $subtitle }}</p> @endif
    </div>
    @endif

    <div
        x-ref="canvas"
        class="relative w-full overflow-hidden"
        :style="{ height: height + 'px' }"
    >
        <svg x-ref="svg" class="block w-full h-full overflow-visible"></svg>
        <div x-ref="tooltip" class="d3c-tooltip"></div>
        <div x-show="loading" x-cloak class="absolute inset-0 flex items-center justify-center bg-white/75 rounded-lg z-20">
            <div class="d3c-spinner"></div>
        </div>
    </div>

    <div x-ref="legend" class="d3c-legend"></div>
</div>

@once
@assets
{{-- Package JS injected directly — no publish step needed --}}
<script src="{{ route('tayo.js', ['hash' => \Sadam\Tayo\TayoServiceProvider::assetHash()]) }}"></script>
@endassets

<style>
.d3c-header         { padding: 0 2px 10px; }
.d3c-title          { font-size: 13px; font-weight: 700; letter-spacing: .02em; color: #0f172a; line-height: 1.2; margin: 0; }
.d3c-subtitle       { font-size: 11px; color: #64748b; margin: 2px 0 0; }
.d3c-tooltip        { position: absolute; pointer-events: none; z-index: 50; background: #0f172a; color: #f8fafc; padding: 8px 12px; border-radius: 8px; font-size: 12px; line-height: 1.6; box-shadow: 0 4px 24px rgba(0,0,0,.25); opacity: 0; transition: opacity .12s ease; white-space: nowrap; }
.d3c-tooltip strong { display: block; font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
.d3c-tooltip span   { font-size: 15px; font-weight: 700; color: #fff; }
.d3c-tooltip small  { display: block; font-size: 10px; color: #64748b; margin-top: 1px; }
.d3c-spinner        { width: 26px; height: 26px; border: 3px solid #e2e8f0; border-top-color: #6366f1; border-radius: 50%; animation: d3c-spin .7s linear infinite; }
@@keyframes d3c-spin { to { transform: rotate(360deg); } }
.d3c-axis path,
.d3c-axis line      { stroke: #e2e8f0; }
.d3c-axis text      { fill: #94a3b8; font-size: 11px; font-family: inherit; }
.d3c-grid line      { stroke: #f1f5f9; stroke-dasharray: 3,3; }
.d3c-grid path      { stroke: none; }
.d3c-legend         { display: flex; flex-wrap: wrap; gap: 12px; padding: 10px 2px 0; }
.d3c-legend-item    { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #475569; }
.d3c-legend-swatch  { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
</style>
@endonce
