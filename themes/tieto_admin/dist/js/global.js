(function (exports) {
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

}((this.LaravelElixirBundle = this.LaravelElixirBundle || {})));

//# sourceMappingURL=global.js.map
