<?php

namespace Drupal\campaign_pages\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Routing\TrustedRedirectResponse;

/**
 * Controller for redirect to tieto.com.
 */
class RedirectController extends ControllerBase {

  /**
   * Redirect.
   *
   * @return \Drupal\Core\Routing\TrustedRedirectResponse
   */
  public function redirectToTietoCom() {
    return new TrustedRedirectResponse('https://www.tieto.com');
  }


}
