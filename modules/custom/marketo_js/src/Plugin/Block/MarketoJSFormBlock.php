<?php

/**
 * @todo: olyan modul, amelyik configozhatóvá teszi, hogy melyik formhoz melyik id kerüljön
 *  3 mező:
 *    subscriber URL
 *    subscriber munchkin ID
 *    form ID
 *
 *  e.g.: MktoForms2.loadForm("//app-sjqe.marketo.com", "718-GIV-198", 621);
 * @todo: Remake this so it uses the proper marketo munchkin API
 *    http://developers.marketo.com/documentation/websites/forms-2-0/
 *    For this, we need to add a script tag to the head,
 *    Also a form + script tag into body
 * @todo: Need someone to do css
 */


namespace Drupal\marketo_js\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a block with a JS based form through the Marketo API.
 *
 * @Block(
 *   id = "marketo_js_form_block",
 *   admin_label = @Translation("MarketoJS Form Block")
 * )
 */
class MarketoJSFormBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return array(
      'block_example_string' => $this->t('A default value. This block was created at %time', array('%time' => date('c'))),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['marketo_form_raw_html'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Marketo Form Raw HTML'),
      '#description' => $this->t('The raw HTML code we want to render.'), // @todo
      '#default_value' => $this->configuration['marketo_form_raw_html'],
      '#maxlength' => 5000 // rawFormMarkup_EnergyComponents is 3500 characters long, 5k is needed if other forms are bigger
    );
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['marketo_form_raw_html']
      = $form_state->getValue('marketo_form_raw_html');
  }

  /**
   * {@inheritdoc}
   *
   */
  public function build() {
    $tpl = [
      '#type' => 'inline_template',
      '#template' => '{{ somecontent | raw }}', // Raw so <> won't be escaped
      '#context' => [
        'somecontent' => $this->configuration['marketo_form_raw_html']
      ]
    ];

    return $tpl;
  }

  /**
   * Basic raw html form for the Energy Components site "Leave us a message" form
   * Copy this into the code part of the block on the block config page.
   *
   * @return string
   */
  private function rawFormMarkup_EnergyComponents() {
    return '
    <div class="form-title">
        Leave Us A Message
    </div>
    <form id="mktoForm_621" novalidate="novalidate" class="mktoForm mktoHasWidth mktoLayoutLeft">
        <div class="mktoFormRow">
            <div class="mktoFieldDescriptor mktoFormCol">
                <div class="mktoOffset"></div>
                <div class="mktoFieldWrap">
                    <div class="mktoGutter mktoHasWidth"></div>
                    <input id="Name" name="Name" placeholder="Your Name *" maxlength="255" type="text" class="mktoField mktoTextField mktoHasWidth mktoValid" />
                    <div class="mktoClear"></div>
                </div>
                <div class="mktoClear"></div>
            </div>
            <div class="mktoClear"></div>
        </div>
        <div class="mktoFormRow">
            <div class="mktoFieldDescriptor mktoFormCol">
                <div class="mktoOffset"></div>
                <div class="mktoFieldWrap">
                    <div class="mktoGutter mktoHasWidth"></div>
                    <input id="YourSubject" name="YourSubject" placeholder="Your Subject *" maxlength="255" type="text" class="mktoField mktoTextField mktoHasWidth mktoValid" />
                    <div class="mktoClear"></div>
                </div>
                <div class="mktoClear"></div>
            </div>
            <div class="mktoClear"></div>
        </div>
        <div class="mktoFormRow">
            <div class="mktoFieldDescriptor mktoFormCol">
                <div class="mktoOffset"></div>
                <div class="mktoFieldWrap">
                    <div class="mktoGutter mktoHasWidth"></div>
                    <input id="Email" name="Email" placeholder="Your E-mail *" maxlength="255" type="email" class="mktoField mktoEmailField mktoHasWidth">
                    <div class="mktoClear"></div>
                </div>
                <div class="mktoClear"></div>
            </div>
            <div class="mktoClear"></div>
        </div>
        <div class="mktoFormRow">
            <div class="mktoFieldDescriptor mktoFormCol">
                <div class="mktoOffset"></div>
                <div class="mktoFieldWrap">
                    <div class="mktoGutter mktoHasWidth"></div>
                    <input id="Phone" name="Phone" placeholder="Your Phone no.t" maxlength="255" type="tel" class="mktoField mktoTelField mktoHasWidth mktoValid">
                    <div class="mktoClear"></div>
                </div>
                <div class="mktoClear"></div>
            </div>
        </div>
        <div class="mktoFormRow">
            <div class="mktoFieldDescriptor mktoFormCol">
                <div class="mktoOffset"></div>
                <div class="mktoFieldWrap">
                    <div class="mktoGutter mktoHasWidth"></div>
                    <textarea id="Form_Inquiry__c" name="Form_Inquiry__c" placeholder="Your Message.. * " rows="4" class="mktoField mktoHasWidth mktoValid" maxlength="32768"></textarea>
                    <div class="mktoClear"></div>
                </div>
                <div class="mktoClear"></div>
            </div>
            <div class="mktoClear"></div>
        </div>
        <div class="mktoButtonRow">
            <span class="mktoButtonWrap mktoArrowButton">
                <button type="submit" class="mktoButton">Send Message</button>
            </span>
        </div>
        <input type="hidden" name="formid" class="mktoField mktoFieldDescriptor" value="621">
        <input type="hidden" name="munchkinId" class="mktoField mktoFieldDescriptor" value="718-GIV-198">
    </form>
    ';
  }
}