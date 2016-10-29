<?php

namespace Drupal\cloudfront_purger\Form;

use Drupal\Core\Form\FormStateInterface;
use Drupal\purge_ui\Form\PurgerConfigFormBase;

/**
 * Provides a config form for CloudFront purger.
 */
class CloudFrontPurgerConfigForm extends PurgerConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['cloudfront_purger.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'cloudfront_purger.config_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['distribution_id'] = [
      '#type' => 'textfield',
      '#title' => t('Distribution ID'),
      '#default_value' => $this->config('cloudfront_purger.settings')->get('distribution_id'),
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitFormSuccess(array &$form, FormStateInterface $form_state) {
    $this->config('cloudfront_purger.settings')
      ->set('distribution_id', $form_state->get('distribution_id'))
      ->save();
  }

}
