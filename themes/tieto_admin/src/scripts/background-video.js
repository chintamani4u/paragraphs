/**
 * @file
 * Initialize Background Video scripts.
 */

import 'background-video'

($ => {

	$('#parallax-video').backgroundVideo({
		$outerWrap: $('#video-outer'),
		pauseVideoOnViewLoss: false,
        parallaxOptions: {
            effect: 1.9
        }
	})

})(jQuery)
