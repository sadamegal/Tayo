<?php

namespace Sadam\Tayo\Tests;

use Orchestra\Testbench\TestCase as OrchestraTestCase;
use Sadam\Tayo\TayoServiceProvider;

abstract class TestCase extends OrchestraTestCase
{
    protected function getPackageProviders($app): array
    {
        return [
            TayoServiceProvider::class,
        ];
    }

    protected function getEnvironmentSetUp($app): void
    {
        $app['config']->set('session.driver', 'array');
    }
}
