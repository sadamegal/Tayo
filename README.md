# Tayo
[![Tests](https://github.com/sadamegal/Tayo/actions/workflows/tests.yml/badge.svg)](https://github.com/sadamegal/Tayo/actions/workflows/tests.yml)
[![Latest Version](https://img.shields.io/packagist/v/sadam/tayo.svg?style=flat-square)](https://packagist.org/packages/sadam/tayo)
[![PHP Version](https://img.shields.io/packagist/php-v/sadam/tayo.svg?style=flat-square)](https://packagist.org/packages/sadam/tayo)
[![License](https://img.shields.io/packagist/l/sadam/tayo.svg?style=flat-square)](LICENSE)

Tayo provides interactive chart components for Laravel Livewire. Charts are defined entirely in PHP and Blade — no JavaScript configuration required.

## Requirements

| | Version |
|---|---|
| PHP | ^8.1 |
| Laravel | ^10.0 \| ^11.0 \| ^12.0 |
| Livewire | ^3.0 \| ^4.0 |

## Installation

```bash
composer require sadam/tayo
```

The package registers itself via Laravel's package auto-discovery. No additional setup is required.

## Basic Usage

Render a chart by passing a `type` and `data` to the component:

```blade
<x-tayo::chart
    type="bar"
    :data="$revenue"
/>
```

With a title, subtitle, and colour palette:

```blade
<x-tayo::chart
    type="bar"
    :data="$revenue"
    title="Monthly Revenue"
    subtitle="Jan – Dec 2024"
    colors="ocean"
    :height="400"
/>
```

## Component Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `string` | — | Chart type. Required. See [Chart Types](#chart-types). |
| `data` | `array\|null` | `null` | Chart data. Shape depends on the chart type. |
| `height` | `int` | `320` | Height in pixels. |
| `colors` | `string\|array` | `'default'` | A named palette or an array of hex colour strings. |
| `title` | `string\|null` | `null` | Heading rendered above the chart. |
| `subtitle` | `string\|null` | `null` | Sub-heading rendered below the title. |

## Livewire Integration

Pass data from a Livewire property or computed property. The chart updates automatically whenever the data changes.

```php
<?php
use Livewire\Component;
use Livewire\Attributes\Computed;

new class extends Component {
    public string $period = 'monthly';

    #[Computed]
    public function getbarChartProperty(): array
    {
        $data = [
            'monthly' => [
                ['label' => 'Jan', 'value' => 120], ['label' => 'Feb', 'value' => 98], 
                ['label' => 'Mar', 'value' => 145], ['label' => 'Apr', 'value' => 132], 
                ['label' => 'May', 'value' => 165], ['label' => 'Jun', 'value' => 178]
            ],
            'quarterly' => [
                ['label' => 'Q1', 'value' => 380], 
                ['label' => 'Q2', 'value' => 420], 
                ['label' => 'Q3', 'value' => 395], 
                ['label' => 'Q4', 'value' => 510]],
            'yearly' => [
                ['label' => '2021', 'value' => 1200], 
                ['label' => '2022', 'value' => 1480], 
                ['label' => '2023', 'value' => 1750], 
                ['label' => '2024', 'value' => 2100]],
        ];
        return $data[$this->period];
    }
};
?>


<div>
    <select wire:model.live="period">
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
    </select>

    <x-tayo::chart type="bar" :data="$this->barChart" title="Sales" />
</div>

```

## Chart Types

### Bar

Vertical bars. Suitable for comparing discrete categories.

```php
$data = [
    ['label' => 'Jan', 'value' => 120],
    ['label' => 'Feb', 'value' => 98],
    ['label' => 'Mar', 'value' => 145],
];
```

---

### Line

Single or multi-series line chart.

```php
// Single series
$data = [
    ['label' => 'Mon', 'value' => 230],
    ['label' => 'Tue', 'value' => 310],
    ['label' => 'Wed', 'value' => 280],
];

// Multi-series
$data = [
    [
        'name' => 'Revenue',
        'data' => [
            ['x' => 'Mon', 'y' => 400],
            ['x' => 'Tue', 'y' => 520],
        ],
    ],
    [
        'name' => 'Costs',
        'data' => [
            ['x' => 'Mon', 'y' => 200],
            ['x' => 'Tue', 'y' => 230],
        ],
    ],
];
```

---

### Area

Identical data shape to `line`. Fills the region between the line and the x-axis.

---

### Pie

Proportional segments. Suitable for part-to-whole comparisons with a small number of categories.

```php
$data = [
    ['label' => 'Direct',   'value' => 40],
    ['label' => 'Organic',  'value' => 35],
    ['label' => 'Referral', 'value' => 25],
];
```

---

### Donut

Same data shape as `pie`. Renders with a hollow centre displaying the total.

---

### Scatter

Two-dimensional point plot. Optionally groups points by category.

```php
$data = [
    ['x' => 160, 'y' => 80, 'label' => 'Alice', 'group' => 'Control'],
    ['x' => 175, 'y' => 95, 'label' => 'Bob',   'group' => 'Treatment'],
    ['x' => 155, 'y' => 60, 'label' => 'Carol', 'group' => 'Control'],
];
```

When `group` is provided, points are coloured per group and a legend is rendered automatically.

---

### Bubble

Three-dimensional scatter where the third variable is encoded as circle size.

```php
$data = [
    ['x' => 20, 'y' => 60, 'r' => 15, 'label' => 'Alpha'],
    ['x' => 40, 'y' => 30, 'r' => 40, 'label' => 'Beta'],
    ['x' => 70, 'y' => 75, 'r' => 25, 'label' => 'Gamma'],
];
```

`r` is the raw radius value, scaled proportionally relative to the other points.

---

### Radar

Multivariate comparison across a common scale. Supports single and multi-series.

```php
// Single series
$data = [
    ['axis' => 'Speed',    'value' => 80],
    ['axis' => 'Power',    'value' => 65],
    ['axis' => 'Stamina',  'value' => 90],
    ['axis' => 'Accuracy', 'value' => 72],
];

// Multi-series
$data = [
    [
        'name'   => 'Model A',
        'values' => [
            ['axis' => 'Speed', 'value' => 80],
            ['axis' => 'Power', 'value' => 65],
        ],
    ],
    [
        'name'   => 'Model B',
        'values' => [
            ['axis' => 'Speed', 'value' => 60],
            ['axis' => 'Power', 'value' => 90],
        ],
    ],
];
```

---

### Heatmap

A grid where cell colour encodes a numeric value. Useful for time-based patterns.

```php
$data = [
    ['x' => 'Mon', 'y' => '9am',  'value' => 74],
    ['x' => 'Mon', 'y' => '10am', 'value' => 55],
    ['x' => 'Tue', 'y' => '9am',  'value' => 90],
];
```

Cell colour is interpolated from light to the primary colour of the active palette.

---

### Treemap

Hierarchical data rendered as nested rectangles. Area encodes magnitude.

```php
$data = [
    'name'     => 'Expenditure',
    'children' => [
        ['name' => 'Engineering', 'value' => 400],
        ['name' => 'Marketing',   'value' => 250],
        ['name' => 'Operations',  'value' => 180],
        ['name' => 'Support',     'value' =>  90],
    ],
];
```

---

### Gauge

Displays a single value within a defined range. Supports optional colour zones.

```php
$data = [
    'value' => 72,
    'min'   => 0,
    'max'   => 100,
    'label' => 'Uptime',
];
```

Define zones to apply different colours across ranges of the arc:

```php
$data = [
    'value' => 72,
    'min'   => 0,
    'max'   => 100,
    'label' => 'Server Load',
    'zones' => [
        ['from' => 0,  'to' => 50,  'color' => '#22c55e'],
        ['from' => 50, 'to' => 80,  'color' => '#f59e0b'],
        ['from' => 80, 'to' => 100, 'color' => '#ef4444'],
    ],
];
```

When `zones` is omitted, the arc uses the first colour of the active palette.

---

### Histogram

Distributes numeric data into automatic bins and renders the frequency of each.

```php
// Flat array
$data = [23, 45, 67, 34, 89, 12, 56, 78, 43, 65];

// Keyed array
$data = [
    ['value' => 23],
    ['value' => 45],
];
```

---

### Waterfall

Shows a running total with incremental additions and subtractions. Mark the final entry with `'type' => 'total'` to render it as a summary bar.

```php
$data = [
    ['label' => 'Opening',  'value' => 1000],
    ['label' => 'Sales',    'value' =>  450],
    ['label' => 'Refunds',  'value' => -120],
    ['label' => 'Expenses', 'value' => -200],
    ['label' => 'Closing',  'value' =>    0, 'type' => 'total'],
];
```

Positive increments render in green, negative in red, and the total bar in the primary palette colour.

---

### Funnel

Ordered stages with automatic conversion rate calculation between each step.

```php
$data = [
    ['label' => 'Visitors',  'value' => 10000],
    ['label' => 'Signups',   'value' =>  4200],
    ['label' => 'Activated', 'value' =>  1800],
    ['label' => 'Paying',    'value' =>   600],
];
```

## Colour Palettes

The `colors` prop accepts either a palette name or a custom array of hex strings.

```blade
<x-tayo::chart colors="ocean" ... />

<x-tayo::chart :colors="['#6366f1', '#f59e0b', '#10b981']" ... />
```

Available palettes:

| Name | Description |
|---|---|
| `default` | Indigo, amber, emerald, blue, red, violet, pink, teal |
| `ocean` | Blues from light to deep |
| `vivid` | High-saturation spectrum |
| `pastel` | Soft, low-contrast tones |
| `warm` | Reds, oranges, and yellows |
| `cool` | Cyans, blues, and purples |
| `rose` | Pinks and deep reds |
| `slate` | Greys and navy |

## Customising the Blade Component

To publish the component view for local modification:

```bash
php artisan vendor:publish --tag=tayo-views
```

The file is published to `resources/views/vendor/tayo/components/chart.blade.php`. Laravel will use your published copy in preference to the package version.


## License

MIT. See [LICENSE](LICENSE).
