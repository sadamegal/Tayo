<?php

namespace Sadam\Tayo\Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Sadam\Tayo\TayoServiceProvider;
use Sadam\Tayo\Tests\TestCase;

class AssetRouteTest extends TestCase
{
    #[Test]
    public function it_serves_the_js_file_with_correct_hash(): void
    {
        $hash = TayoServiceProvider::assetHash();

        $response = $this->get("/tayo/{$hash}/d3-chart.js");

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/javascript');
    }

    #[Test]
    public function it_sets_long_lived_cache_headers(): void
    {
        $hash = TayoServiceProvider::assetHash();

        $response = $this->get("/tayo/{$hash}/d3-chart.js");

        $response->assertOk();
        $this->assertStringContainsString(
            'max-age=31536000',
            $response->headers->get('Cache-Control'),
        );
        $this->assertStringContainsString(
            'immutable',
            $response->headers->get('Cache-Control'),
        );
    }

    #[Test]
    public function it_returns_404_for_a_stale_hash(): void
    {
        $response = $this->get('/tayo/000000000000/d3-chart.js');

        $response->assertNotFound();
    }

    #[Test]
    public function it_returns_404_for_a_garbage_hash(): void
    {
        $response = $this->get('/tayo/not-a-real-hash/d3-chart.js');

        $response->assertNotFound();
    }

    #[Test]
    public function the_response_body_contains_js_content(): void
    {
        $hash = TayoServiceProvider::assetHash();

        $response = $this->get("/tayo/{$hash}/d3-chart.js");

        $response->assertOk();
        $this->assertStringContainsString('tayoChart', $response->getContent());
    }
}
