/**
 * @file
 * Scripts for theme.
 */
(function ($) {
	'use strict';

	$('#parallax-video').backgroundVideo({
		$outerWrap: $('#video-outer'),
		pauseVideoOnViewLoss: false,
        parallaxOptions: {
            effect: 1.9
        }
	});

})(jQuery);