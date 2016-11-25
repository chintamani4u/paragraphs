/**
 * @file
 * Contains the definition of the behaviour addLinkedinScriptTag.
 */

(function ($, Drupal, drupalSettings) {

    'use strict';

    /**
     * Attaches the JS test behavior to to weight div.
     */
    Drupal.behaviors.addLinkedinScriptTag = {
        attach: function (context, settings) {
            var tag = $('<script ' +
                'type="IN/Form2" ' +
                'data-form="mktoForm_' + drupalSettings.addTagToHead.dataFormId + '" ' +
                'data-field-firstname="FirstName" ' +
                'data-field-lastname="LastName" ' +
                'data-field-phone="MobilePhone" ' +
                'data-field-email="Email" ' +
                'data-field-company="Company" ' +
                'data-field-title="Title" ' +
                'data-field-city="City" ' +
                'data-field-state="State" ' +
                'data-field-country="Country" ' +
                'data-field-zip="ZipCode"' +
                '></script>');

            $('head').append(tag);
        }
    };
})(jQuery, Drupal, drupalSettings);