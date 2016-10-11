<?php

/**
 * @file
 * Amazee.io docker image settings.
 *
 * Created by PhpStorm.
 * User: mhavelant
 * Date: 2016.10.11.
 * Time: 14:14
 *
 * For additional settings:
 * @see https://github.com/amazeeio/drupal-setting-files/tree/master/Drupal8/sites/default
 */

// amazee.io Database connection.
if (getenv('AMAZEEIO_SITENAME')) {
  $databases['default']['default'] = array(
    'driver' => 'mysql',
    'database' => getenv('AMAZEEIO_SITENAME'),
    'username' => getenv('AMAZEEIO_DB_USERNAME'),
    'password' => getenv('AMAZEEIO_DB_PASSWORD'),
    'host' => getenv('AMAZEEIO_DB_HOST'),
    'port' => getenv('AMAZEEIO_DB_PORT'),
    'prefix' => '',
  );
}

// Trusted Host Patterns,
// see https://www.drupal.org/node/2410395 for more information.
// If your site runs on multiple domains, you need to add these domains here.
if (getenv('AMAZEEIO_SITE_URL')) {
  $settings['trusted_host_patterns'] = array(
    '^' . str_replace('.', '\.', getenv('AMAZEEIO_SITE_URL')) . '$',
  );
}

// amazee.io Base URL.
if (getenv('AMAZEEIO_BASE_URL')) {
  $base_url = getenv('AMAZEEIO_BASE_URL');
}
