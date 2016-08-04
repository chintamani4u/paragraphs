/**
 * @file
 * Scripts for theme.
 */
(function ($) {
	'use strict';

	$('.r-tabs-container').responsiveTabs({
	  startCollapsed: false,
	  animation: 'slide',
	  duration: 200
	});

	var hamburger = $('#hamburger');
	var header = $('.page-header');

	hamburger.on('click', function () {
		$(this).toggleClass('is-active');
	});

	$(document).ready(function() {
		if ($(window).width() < 768) return;
        header.scrollspy({
            min: 500,
            onEnter: function(element, position) {
                header.addClass('fixed');
            },
            onLeave: function(element, position) {
                header.removeClass('fixed');
            }
        });
    });

})(jQuery);