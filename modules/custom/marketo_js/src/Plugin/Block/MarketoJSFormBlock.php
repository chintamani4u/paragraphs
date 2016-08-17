<?php

namespace Drupal\marketo_js\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element\Form;

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
    $form['marketo_code'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Marketo Form Code'),
      '#description' => $this->t('This text will appear in the example block.'), // @todo
      '#default_value' => $this->configuration['marketo_code'],
    );
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['marketo_code']
      = $form_state->getValue('marketo_code');
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
        'somecontent' => $this->rawFormMarkup()
      ]
    ];

    $mu = [
      '#type' => 'markup',
      '#markup' => $this->rawFormMarkup(),
      '#allowed_tags' => ['div', 'form', 'input', 'button', 'textarea', 'span'],
    ];

    return $tpl;
  }


  private function rawFormMarkup() {
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
/*
 *
 *
tieto.com: search:
mktoForm_621

http://developers.marketo.com/documentation/websites/forms-2-0/

if you output this as "raw html" it should work

Minden form 2 s include
1ik js-t headerben, másikat formonként
todo: olyan modul, amelyik configozhatóvá teszi, hogy melyik formhoz melyik id kerüljön
Minden form custom block kb

adverticum modul pl, 7

péntekig ok:
custom html blokként felvenni ezeket a formokat
esetleg paragraph type-ként (ptype: marketoForm. 2 mező: html code, form id)
modul: headerbe beteszi a központi js include-ot

marketo form paragraph modul kell
examples-ben configos block -> src/plugin/block kell majd
 */

/**
 *
 * <script>
MktoForms2.loadForm("//app-sjqe.marketo.com", "718-GIV-198", 621, function(form) {
// From here we have access to the form object and can call its methods
});
</script>
 */