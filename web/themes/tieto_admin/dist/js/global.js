(function (exports) {
'use strict';

/**
 * @file
 * Global scripts, loaded on every page.
 */

(function ($) {

	var hamburger = $('#hamburger');

	hamburger.on('click', function () {
		hamburger.toggleClass('is-active');
	});

	// Updates parallax header height with px value instead of vh, so it won't be jumping on Android
	// @todo - remove this from here
	var $header = $('.paragraph--type--header.paragraph--view-mode--default');
	if ($header.length) {
		$header.height($header.height());
	}

})(jQuery);

}((this.LaravelElixirBundle = this.LaravelElixirBundle || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi92YXIvd3d3L3BhcmFncmFwaHMubG9jYWwvd2ViL3RoZW1lcy90aWV0b19hZG1pbi9zcmMvc2NyaXB0cy9nbG9iYWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZVxuICogR2xvYmFsIHNjcmlwdHMsIGxvYWRlZCBvbiBldmVyeSBwYWdlLlxuICovXG5cbigkID0+IHtcblxuXHRjb25zdCBoYW1idXJnZXIgPSAkKCcjaGFtYnVyZ2VyJylcblxuXHRoYW1idXJnZXIub24oJ2NsaWNrJywgKCkgPT4ge1xuXHRcdGhhbWJ1cmdlci50b2dnbGVDbGFzcygnaXMtYWN0aXZlJylcblx0fSlcblxuXHQvLyBVcGRhdGVzIHBhcmFsbGF4IGhlYWRlciBoZWlnaHQgd2l0aCBweCB2YWx1ZSBpbnN0ZWFkIG9mIHZoLCBzbyBpdCB3b24ndCBiZSBqdW1waW5nIG9uIEFuZHJvaWRcblx0Ly8gQHRvZG8gLSByZW1vdmUgdGhpcyBmcm9tIGhlcmVcblx0Y29uc3QgJGhlYWRlciA9ICQoJy5wYXJhZ3JhcGgtLXR5cGUtLWhlYWRlci5wYXJhZ3JhcGgtLXZpZXctbW9kZS0tZGVmYXVsdCcpO1xuXHRpZiAoJGhlYWRlci5sZW5ndGgpIHtcblx0XHQkaGVhZGVyLmhlaWdodCgkaGVhZGVyLmhlaWdodCgpKTtcblx0fVxuXG59KShqUXVlcnkpXG4iXSwibmFtZXMiOlsiY29uc3QiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7OztBQUtBLENBQUMsVUFBQSxDQUFDLEVBQUM7O0NBRUZBLElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQTs7Q0FFakMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBRztFQUN4QixTQUFTLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0VBQ2xDLENBQUMsQ0FBQTs7OztDQUlGQSxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsd0RBQXdELENBQUMsQ0FBQztDQUM1RSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7RUFDbkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztFQUNqQzs7Q0FFRCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7OyJ9