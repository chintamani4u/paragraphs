(function () {
'use strict';

/**
 * @file
 * Global scripts, loaded on every page.
 */

(function ($) {

	var hamburger = $('#hamburger')

	hamburger.on('click', function () {
		hamburger.toggleClass('is-active')
	})

})(jQuery)

}());

//# sourceMappingURL=global.js.map
