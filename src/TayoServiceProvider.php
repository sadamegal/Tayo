<?php

namespace Sadam\Tayo;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Response;

class TayoServiceProvider extends ServiceProvider
{
    /** @var string|null Cached content hash for the lifetime of the request. */
    private static ?string $hash = null;

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // ── Blade component ───────────────────────────────────────────────
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'tayo');
        Blade::anonymousComponentNamespace('tayo::components', 'tayo');

        // ── Asset route ───────────────────────────────────────────────────
        // The hash is part of the URL so browsers always fetch a fresh copy
        // after a new build, while still caching aggressively in between.
        Route::get('/tayo/{hash}/d3-chart.js', function (string $hash) {
            $path = __DIR__ . '/../resources/js/d3-chart.js';

            // Reject requests for a stale hash — forces re-fetch of the current URL.
            if ($hash !== self::assetHash()) {
                abort(404);
            }

            $content = file_get_contents($path);

            return new Response($content, 200, [
                'Content-Type'  => 'application/javascript',
                // Safe to cache forever — URL changes with every new build.
                'Cache-Control' => 'public, max-age=31536000, immutable',
            ]);
        })->name('tayo.js');

        // ── Optional: publish views for customisation ─────────────────────
        $this->publishes([
            __DIR__ . '/../resources/views' => resource_path('views/vendor/tayo'),
        ], 'tayo-views');
    }

    /**
     * Returns a short content hash of the built JS file.
     * Computed once per process and cached in a static property.
     * The blade component calls route('tayo.js', ['hash' => assetHash()])
     * so the URL always matches the file on disk.
     */
    public static function assetHash(): string
    {
        if (self::$hash === null) {
            $path = __DIR__ . '/../resources/js/d3-chart.js';
            self::$hash = substr(md5_file($path), 0, 12);
        }

        return self::$hash;
    }
}
