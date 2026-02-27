<?php

namespace Sadam\Tayo\Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Sadam\Tayo\TayoServiceProvider;
use Sadam\Tayo\Tests\TestCase;

class ServiceProviderTest extends TestCase
{
    #[Test]
    public function it_registers_the_service_provider(): void
    {
        $this->assertInstanceOf(
            TayoServiceProvider::class,
            $this->app->getProvider(TayoServiceProvider::class),
        );
    }

    #[Test]
    public function it_registers_the_named_route(): void
    {
        $this->assertTrue(
            $this->app['router']->getRoutes()->hasNamedRoute('tayo.js'),
            'Named route tayo.js should be registered.',
        );
    }

    #[Test]
    public function asset_hash_is_a_twelve_character_hex_string(): void
    {
        $hash = TayoServiceProvider::assetHash();

        $this->assertMatchesRegularExpression('/^[a-f0-9]{12}$/', $hash);
    }

    #[Test]
    public function asset_hash_is_stable_across_multiple_calls(): void
    {
        $this->assertSame(
            TayoServiceProvider::assetHash(),
            TayoServiceProvider::assetHash(),
        );
    }

    #[Test]
    public function it_loads_views_from_the_correct_namespace(): void
    {
        $this->assertTrue(
            $this->app['view']->exists('tayo::components.chart'),
            'View tayo::components.chart should exist.',
        );
    }
}
