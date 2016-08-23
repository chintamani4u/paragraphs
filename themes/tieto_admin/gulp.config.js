'use strict'
/**
 * @file
 * Configuration for Gulp and Elixir
 *
 * @author Gergely Pap <gpap@brainsum.com>
 * @see https://laravel.com/docs/master/elixir
 */

import Elixir from 'laravel-elixir'

Elixir.config.sourcemaps = true
Elixir.config.notifications = true
Elixir.config.assetsPath = 'src'
Elixir.config.publicPath = 'dist'
Elixir.config.viewPath = 'templates'
Elixir.config.js.folder = 'scripts'

/**
 * Configuration
 */
Elixir.config.browserSync = {
    proxy: 'http://public360.local',
    open: false,
    reloadOnRestart: true,
    notify: false
}
