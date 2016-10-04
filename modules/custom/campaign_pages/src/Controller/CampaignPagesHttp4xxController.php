<?php

namespace Drupal\campaign_pages\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Controller for default HTTP 4xx responses.
 *
 * @todo - cli, ajax request without theme.
 */
class CampaignPagesHttp4xxController extends ControllerBase {

  /**
   * The default 403 content.
   *
   * @return array
   *   A render array containing the message to display for 404 pages.
   */
  public function on403() {
    return [
      '#theme' => 'campaign_403',
      '#error_code' => '403',
    ];
  }

  /**
   * The default 404 content.
   *
   * @return array
   *   A render array containing the message to display for 404 pages.
   */
  public function on404() {
    return [
      '#theme' => 'campaign_404',
      '#error_code' => '404',
    ];
  }

}
