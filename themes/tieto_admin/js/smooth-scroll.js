/**
 * @file
 * Smooth Scroll.
 */
(function ($, Drupal) {

  /**
   * Speed of the smooth scroll.
   *
   * @type {Number}
   */
  var scrollSpeed = 300;

  /**
   * Additional offset in pixels.
   * DON'T worry about Drupal Admin toolbar, it is already calculated in. :)
   *
   *   negative: scroll past the item.
   *   0: stop exactly at the item.
   *   positive: scroll before the item.
   *
   * @type {Number}
   */
  var offset = 72;

  /**
   * Applying the animation to all anchors, which have
   * <a href="#my-anchor"> format.
   */
  var smoothScroll = function (e) {
    e.preventDefault();
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {

      // Calculate admin toolbar height.
      // Both Toolbar and its Tray are 39px in default Drupal theme.
      var headerHeight = 0;
      if ($('body').hasClass('toolbar-horizontal')) {
        headerHeight = 39;
        if ($('body').hasClass('toolbar-tray-open')) {
          headerHeight += 39;
        }
      }

      var target = $(this.hash);
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - headerHeight - offset
        }, scrollSpeed);
        if ($(window).width() < 768 && $('#hamburger').hasClass('is-active')) {
          $('#hamburger').removeClass('is-active');
        }
        return false;
      }
    }
  };

  /**
   * Initialise.
   */
  Drupal.behaviors.smoothScroll = {
    attach: function (context, settings) {
      $('a[href*=#]:not([href=#]):not([href^=#tab-])', context).on('click', smoothScroll);
    }
  };

})(jQuery, Drupal);
