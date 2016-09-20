<?php

namespace Drupal\campaign_pages\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Translation switcher' block.
 *
 * @Block(
 *   id = "campaign_pages_translation_switcher",
 *   admin_label = @Translation("Transaltion switcher"),
 * )
 */
class TranslationSwitcher extends BlockBase {

  /**
   * {@inheritdoc}
   *
   * @todo
   */
  public function build() {
    $current_uri = \Drupal::request()->getRequestUri();

    $en = <<<EOL
<ul class="links">
	<li class="en is-active" data-drupal-link-system-path="/kth-breakfast-seminars" hreflang="en"><a class="language-link" href="/kth-breakfast-seminars" hreflang="en">English</a></li>
	<li class="sv" data-drupal-link-system-path="/sv/kth-frukostseminarium" hreflang="sv"><a class="language-link" href="/sv/kth-frukostseminarium" hreflang="sv">Swedish</a></li>
</ul>
EOL;
    $sv = <<<EOL
<ul class="links">
	<li class="en" data-drupal-link-system-path="/kth-breakfast-seminars" hreflang="en"><a class="language-link" href="/kth-breakfast-seminars" hreflang="en">English</a></li>
	<li class="sv is-active" data-drupal-link-system-path="/sv/kth-frukostseminarium" hreflang="sv"><a class="language-link" href="/sv/kth-frukostseminarium" hreflang="sv">Swedish</a></li>
</ul>
EOL;

    switch ($current_uri) {
      case '/kth-breakfast-seminars':
        $output = $en;
        break;

      case '/sv/kth-frukostseminarium':
        $output = $sv;
        break;
    }

    return array(
      '#markup' => $output,
      '#attributes' => [
        'class' => ['block-language'],
      ],
    );
  }

}
