<?php

namespace Sadam\Tayo\Tests\Feature;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Sadam\Tayo\TayoServiceProvider;
use Sadam\Tayo\Tests\TestCase;

class ComponentRenderTest extends TestCase
{
    #[Test]
    public function it_renders_the_blade_component_without_error(): void
    {
        $view = $this->blade(
            '<x-tayo::chart type="bar" :data="$data" />',
            ['data' => [['label' => 'Jan', 'value' => 100]]],
        );

        $view->assertSee('x-data', false);
        $view->assertSee('tayoChart', false);
    }

    #[Test]
    public function it_renders_the_correct_chart_type(): void
    {
        $view = $this->blade(
            '<x-tayo::chart type="line" :data="$data" />',
            ['data' => [['label' => 'Mon', 'value' => 50]]],
        );

        $view->assertSee("type:   'line',", false);
    }

    #[Test]
    public function it_renders_the_title_when_provided(): void
    {
        $view = $this->blade(
            '<x-tayo::chart type="bar" :data="$data" title="Revenue" />',
            ['data' => [['label' => 'Jan', 'value' => 100]]],
        );

        $view->assertSee('Revenue', false);
        $view->assertSee('d3c-title', false);
    }

    #[Test]
    public function it_renders_the_subtitle_when_provided(): void
    {
        $view = $this->blade(
            '<x-tayo::chart type="bar" :data="$data" title="Revenue" subtitle="Last 12 months" />',
            ['data' => [['label' => 'Jan', 'value' => 100]]],
        );

        $view->assertSee('Last 12 months', false);
        $view->assertSee('d3c-subtitle', false);
    }

    #[Test]
    public function it_does_not_render_header_div_when_title_and_subtitle_are_absent(): void
    {
        $view = $this->blade(
            '<x-tayo::chart type="bar" :data="$data" />',
            ['data' => [['label' => 'Jan', 'value' => 100]]],
        );

        // The full output includes a <style> block containing `.d3c-header { ... }`,
        // so assertDontSee on the whole view always fails.
        // Slice to just the component div (everything before @assets) and assert there.
        $componentHtml = strstr((string) $view, '@assets', before_needle: true) ?: (string) $view;

        $this->assertStringNotContainsString(
            'class="d3c-header"',
            $componentHtml,
            'The d3c-header div should not be present when no title or subtitle is given.',
        );
    }

    #[Test]
    public function it_passes_height_to_alpine_config(): void
    {
        $view = $this->blade(
            '<x-tayo::chart type="bar" :data="$data" :height="480" />',
            ['data' => [['label' => 'Jan', 'value' => 100]]],
        );

        $view->assertSee('height: 480,', false);
    }

    #[Test]
    public function it_passes_color_palette_to_alpine_config(): void
    {
        $view = $this->blade(
            '<x-tayo::chart type="bar" :data="$data" colors="ocean" />',
            ['data' => [['label' => 'Jan', 'value' => 100]]],
        );

        $view->assertSee("colors: 'ocean',", false);
    }

    #[Test]
    public function it_includes_the_asset_script_tag_with_correct_hash(): void
    {
        $hash = TayoServiceProvider::assetHash();

        $view = $this->blade(
            '<x-tayo::chart type="bar" :data="$data" />',
            ['data' => [['label' => 'Jan', 'value' => 100]]],
        );

        $view->assertSee($hash, false);
        $view->assertSee('d3-chart.js', false);
    }

    #[Test]
    public function it_renders_required_alpine_refs(): void
    {
        $view = $this->blade(
            '<x-tayo::chart type="bar" :data="$data" />',
            ['data' => [['label' => 'Jan', 'value' => 100]]],
        );

        $view->assertSee('x-ref="canvas"', false);
        $view->assertSee('x-ref="svg"', false);
        $view->assertSee('x-ref="tooltip"', false);
        $view->assertSee('x-ref="legend"', false);
    }

    #[Test]
    public function it_renders_with_null_data_without_error(): void
    {
        $view = $this->blade(
            '<x-tayo::chart type="bar" :data="null" />',
        );

        $view->assertSee('tayoChart', false);
    }

    #[Test]
    #[DataProvider('chartTypeProvider')]
    public function it_renders_all_chart_types(string $type): void
    {
        $view = $this->blade(
            '<x-tayo::chart :type="$type" :data="$data" />',
            ['type' => $type, 'data' => [['label' => 'A', 'value' => 1]]],
        );

        $view->assertSee("type:   '{$type}',", false);
    }

    public static function chartTypeProvider(): array
    {
        return [
            ['bar'],       ['line'],      ['area'],  ['pie'],
            ['donut'],     ['scatter'],   ['bubble'],['radar'],
            ['heatmap'],   ['treemap'],   ['gauge'],
            ['histogram'], ['waterfall'], ['funnel'],
        ];
    }
}
