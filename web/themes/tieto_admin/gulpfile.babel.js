'use strict'
/**
 * @file
 * Gulpfile
 *
 * This Drupal theme uses Gulp with Laravel Elixir wrapper,
 * which helps setting up the build process easier and more readable.
 * Also we are using the new ES2015 JavaScript syntax, because why not?
 *
 * @author Gergely Pap <gpap@brainsum.com>
 * @see https://laravel.com/docs/master/elixir
 */

import Elixir from 'laravel-elixir'

/**
 * Configuration
 */
Elixir.config.sourcemaps = true
Elixir.config.notifications = false
Elixir.config.assetsPath = 'src'
Elixir.config.publicPath = 'dist'
Elixir.config.viewPath = 'templates'
Elixir.config.js.folder = 'scripts'
Elixir.config.browserSync = {
    proxy: 'http://public360.local',
    open: false,
    reloadOnRestart: true,
    notify: false
}

/**
 * Build
 */
Elixir(mix => {

    mix
        // Compile SASS/SCSS styles.
        .sass('global.scss')
        .sass('components/dialog.scss')
        .sass('components/vertical-tabs.scss')
        .sass('theme/wysiwyg.scss')
        .sass('theme/install-page.scss')
        .sass('theme/maintenance-page.scss')
        .sass('vendor/jquery.ui.theme.scss')
        .sass('vendor/responsive-tabs.scss')

        // Compile and bundle scripts with Rollup.
        // @see http://rollupjs.org/guide/
        .rollup('global.js')
        .rollup('responsive-tabs.js')
        .rollup('parallax.js')
        .rollup('iphone-inline-video.js')
        .rollup('scrollspy.js')
        .rollup('smooth-scroll.js')
        .rollup('mobile.install.js')
        .rollup('nav-tabs.js')
        .rollup('tabledrag.js')

    // Live reload the browser on file updates.
    Elixir.isWatching() && mix.browserSync()
})