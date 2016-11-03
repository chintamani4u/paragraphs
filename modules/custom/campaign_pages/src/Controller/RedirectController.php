<?php

namespace Drupal\campaign_pages\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Routing\TrustedRedirectResponse;

/**
 * Controller for redirect to tieto.com.
 */
class RedirectController extends ControllerBase {

  /**
   * Redirect to tieto.com if it is non local or dev site (brainsum domain).
   */
  public function redirectToTietoCom() {
    global $base_url;

    if ('127.0.0.1' == \Drupal::request()->getClientIp()
      || strpos($base_url, 'brainsum') !== FALSE
    ) {
      return [
        '#markup' => '',
      ];
    }

    return new TrustedRedirectResponse('https://www.tieto.com');
  }

}
