<?php

namespace Drupal\marketo_form\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;

/**
 * Plugin implementation of the 'marketo_form' formatter.
 *
 * @FieldFormatter(
 *   id = "marketo_form",
 *   label = @Translation("Marketo Form"),
 *   field_types = {
 *     "marketo_form"
 *   }
 * )
 */
class MarketoFormFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   *
   * @todo - js library, template
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = array();

    foreach ($items as $delta => $item) {
      $elements[$delta] = [
        '#markup' => '
        <script src="//' . trim($item->subscription_url) . '/js/forms2/js/forms2.js"></script>
    <form id="mktoForm_' . $item->form_id . '"></form>
    <script>
      MktoForms2.loadForm("//' . trim($item->subscription_url) . '", "' . $item->munchkin_id . '", ' . $item->form_id . ', function(form) {
           form.onSuccess(function(values, followUpUrl) {
                form.getFormElem().hide();
                return false;
                });
      });
    </script>',
        // Security hole?
        '#allowed_tags' => ['script', 'form'],
      ];
    }
    return $elements;
  }

}
