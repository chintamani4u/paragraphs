/**
 * @file
 * Initialize Background Video scripts.
 */

import 'background-video'

($ => {

	let $paragraph = $('.paragraph--type--header')
	let $outerWrap = $paragraph.find('.video-outer')
	let $videoWrap = $outerWrap.find('.video-wrapper')

	let settings = {
		$outerWrap: $outerWrap,
		$videoWrap: $videoWrap,
		pauseVideoOnViewLoss: false,
        parallaxOptions: {
            effect: 1.9
        },
        parallax: $outerWrap.parent().hasClass('parallax-enabled')
	}

	$paragraph.find('.video').backgroundVideo(settings)

})(jQuery)
