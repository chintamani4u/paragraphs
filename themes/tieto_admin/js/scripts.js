/**
 * @file
 * Scripts for theme.
 */
(function ($) {
	'use strict';

	var hamburger = $('#hamburger');
	hamburger.on('click', function () {
		$(this).toggleClass('is-active');
	});

})(jQuery);