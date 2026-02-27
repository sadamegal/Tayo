<?php

namespace Sadam\Tayo\Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Sadam\Tayo\TayoServiceProvider;
use Sadam\Tayo\Tests\TestCase;

class AssetTest extends TestCase
{
    private string $jsPath;

    protected function setUp(): void
    {
        parent::setUp();
        $this->jsPath = __DIR__ . '/../../resources/js/d3-chart.js';
    }

    #[Test]
    public function the_built_js_file_exists(): void
    {
        $this->assertFileExists($this->jsPath);
    }

    #[Test]
    public function the_built_js_file_is_not_empty(): void
    {
        $this->assertGreaterThan(0, filesize($this->jsPath));
    }

    #[Test]
    public function the_built_js_registers_d3chart_alpine_component(): void
    {
        $content = file_get_contents($this->jsPath);

        $this->assertStringContainsString(
            'tayoChart',
            $content,
            'Built JS should register the tayoChart Alpine component.',
        );
    }

    #[Test]
    public function the_built_js_hooks_into_alpine_init_event(): void
    {
        $content = file_get_contents($this->jsPath);

        $this->assertStringContainsString(
            'alpine:init',
            $content,
            'Built JS should listen for the alpine:init event.',
        );
    }

    #[Test]
    public function the_built_js_contains_all_renderer_types(): void
    {
        $content = file_get_contents($this->jsPath);

        $expectedTypes = [
            'bar', 'line', 'area', 'pie', 'donut',
            'scatter', 'bubble', 'radar', 'heatmap',
            'treemap', 'gauge', 'histogram', 'waterfall', 'funnel',
        ];

        foreach ($expectedTypes as $type) {
            $this->assertStringContainsString(
                $type,
                $content,
                "Built JS should contain renderer for chart type: {$type}",
            );
        }
    }

    #[Test]
    public function asset_hash_matches_actual_file_hash(): void
    {
        $expected = substr(md5_file($this->jsPath), 0, 12);

        $this->assertSame($expected, TayoServiceProvider::assetHash());
    }
}
