/**
 * @file
 * Scripts for theme.
 */
(function ($) {
	'use strict';

    var header = $('.page-header');
	$(document).ready(function() {
        header.scrollspy({
            min: 490,
            max: 10000,
            onEnter: function(element, position) {
                header.addClass('fixed');
            },
            onLeave: function(element, position) {
                header.removeClass('fixed');
            }
        });
    });

})(jQuery);