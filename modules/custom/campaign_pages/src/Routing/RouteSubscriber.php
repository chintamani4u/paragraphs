<?php

/**
 * @file
 * Contains \Drupal\campaign_pages\Routing\RouteSubscriber.
 */

namespace Drupal\campaign_pages\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    // Change controller for system.404
    if ($route = $collection->get('system.404')) {
      $defaults = [
        '_controller' => '\Drupal\campaign_pages\Controller\CampaignPagesHttp4xxController:on404',
        '_title' => 'Page not found',
      ];
      $route->setDefaults($defaults);
    }
    // Change controller for system.403
    if ($route = $collection->get('system.403')) {
      $defaults = [
        '_controller' => '\Drupal\campaign_pages\Controller\CampaignPagesHttp4xxController:on403',
        '_title' => 'Access denied',
      ];
      $route->setDefaults($defaults);
    }
  }

}
