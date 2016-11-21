(function (exports) {
'use strict';

/**
 * @file
 * Smooth Scroll.
 */

(function ($) {

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
   * Update the hash in the URL without jumping to the element.
   *
   * @param  {String} hash
   * @return {void}
   */
  var updateHash = function (hash) {
    if (history.pushState) { history.pushState(null, null, hash); }
    else { window.location.hash = hash; }
    // @fixme temp
    // $('.campaign-menu-link > a.active').removeClass('active')
    // $('a[href="' + hash + '"]').addClass('active')
  };

  /**
   * Applying the animation to all anchors, which have
   * <a href="#my-anchor"> format.
   */
  var smoothScroll = function (e) {
    e.preventDefault();
    updateHash(this.hash);

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
        return false
      }
    }
  };

  $('a[href*="#"]:not([href="#"]):not([href^="#tab-"])').on('click', smoothScroll);

})(jQuery);

}((this.LaravelElixirBundle = this.LaravelElixirBundle || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi92YXIvd3d3L3BhcmFncmFwaHMubG9jYWwvd2ViL3RoZW1lcy90aWV0b19hZG1pbi9zcmMvc2NyaXB0cy9zbW9vdGgtc2Nyb2xsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIFNtb290aCBTY3JvbGwuXG4gKi9cblxuKGZ1bmN0aW9uICgkKSB7XG5cbiAgLyoqXG4gICAqIFNwZWVkIG9mIHRoZSBzbW9vdGggc2Nyb2xsLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgY29uc3Qgc2Nyb2xsU3BlZWQgPSAzMDBcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBvZmZzZXQgaW4gcGl4ZWxzLlxuICAgKiBET04nVCB3b3JyeSBhYm91dCBEcnVwYWwgQWRtaW4gdG9vbGJhciwgaXQgaXMgYWxyZWFkeSBjYWxjdWxhdGVkIGluLiA6KVxuICAgKlxuICAgKiAgIG5lZ2F0aXZlOiBzY3JvbGwgcGFzdCB0aGUgaXRlbS5cbiAgICogICAwOiBzdG9wIGV4YWN0bHkgYXQgdGhlIGl0ZW0uXG4gICAqICAgcG9zaXRpdmU6IHNjcm9sbCBiZWZvcmUgdGhlIGl0ZW0uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBjb25zdCBvZmZzZXQgPSA3MlxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGhhc2ggaW4gdGhlIFVSTCB3aXRob3V0IGp1bXBpbmcgdG8gdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ30gaGFzaFxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgdmFyIHVwZGF0ZUhhc2ggPSAoaGFzaCkgPT4ge1xuICAgIGlmIChoaXN0b3J5LnB1c2hTdGF0ZSkgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgaGFzaClcbiAgICBlbHNlIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaGFzaFxuICAgIC8vIEBmaXhtZSB0ZW1wXG4gICAgLy8gJCgnLmNhbXBhaWduLW1lbnUtbGluayA+IGEuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgLy8gJCgnYVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gIH1cblxuICAvKipcbiAgICogQXBwbHlpbmcgdGhlIGFuaW1hdGlvbiB0byBhbGwgYW5jaG9ycywgd2hpY2ggaGF2ZVxuICAgKiA8YSBocmVmPVwiI215LWFuY2hvclwiPiBmb3JtYXQuXG4gICAqL1xuICB2YXIgc21vb3RoU2Nyb2xsID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB1cGRhdGVIYXNoKHRoaXMuaGFzaClcblxuICAgIGlmIChsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywgJycpID09IHRoaXMucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSAmJiBsb2NhdGlvbi5ob3N0bmFtZSA9PSB0aGlzLmhvc3RuYW1lKSB7XG5cbiAgICAgIC8vIENhbGN1bGF0ZSBhZG1pbiB0b29sYmFyIGhlaWdodC5cbiAgICAgIC8vIEJvdGggVG9vbGJhciBhbmQgaXRzIFRyYXkgYXJlIDM5cHggaW4gZGVmYXVsdCBEcnVwYWwgdGhlbWUuXG4gICAgICB2YXIgaGVhZGVySGVpZ2h0ID0gMFxuICAgICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcygndG9vbGJhci1ob3Jpem9udGFsJykpIHtcbiAgICAgICAgaGVhZGVySGVpZ2h0ID0gMzlcbiAgICAgICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcygndG9vbGJhci10cmF5LW9wZW4nKSkge1xuICAgICAgICAgIGhlYWRlckhlaWdodCArPSAzOVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMuaGFzaClcbiAgICAgIGlmICh0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgICQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIGhlYWRlckhlaWdodCAtIG9mZnNldFxuICAgICAgICB9LCBzY3JvbGxTcGVlZClcbiAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgNzY4ICYmICQoJyNoYW1idXJnZXInKS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgICAgICAkKCcjaGFtYnVyZ2VyJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgJCgnYVtocmVmKj1cIiNcIl06bm90KFtocmVmPVwiI1wiXSk6bm90KFtocmVmXj1cIiN0YWItXCJdKScpLm9uKCdjbGljaycsIHNtb290aFNjcm9sbClcblxufSkoalF1ZXJ5KVxuIl0sIm5hbWVzIjpbImNvbnN0Il0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7QUFLQSxDQUFDLFVBQVUsQ0FBQyxFQUFFOzs7Ozs7O0VBT1pBLElBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQTs7Ozs7Ozs7Ozs7O0VBWXZCQSxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUE7Ozs7Ozs7O0VBUWpCLElBQUksVUFBVSxHQUFHLFVBQUMsSUFBSSxFQUFFO0lBQ3RCLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQSxFQUFBO1NBQ3JELEVBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBLEVBQUE7Ozs7R0FJakMsQ0FBQTs7Ozs7O0VBTUQsSUFBSSxZQUFZLEdBQUcsVUFBVSxDQUFDLEVBQUU7SUFDOUIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO0lBQ2xCLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7O0lBRXJCLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Ozs7TUFJbEgsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFBO01BQ3BCLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO1FBQzVDLFlBQVksR0FBRyxFQUFFLENBQUE7UUFDakIsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLEVBQUU7VUFDM0MsWUFBWSxJQUFJLEVBQUUsQ0FBQTtTQUNuQjtPQUNGOztNQUVELElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7TUFDekIsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ2pCLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUM7VUFDckIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsWUFBWSxHQUFHLE1BQU07U0FDdkQsRUFBRSxXQUFXLENBQUMsQ0FBQTtRQUNmLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1VBQ3BFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUE7U0FDekM7UUFDRCxPQUFPLEtBQUs7T0FDYjtLQUNGO0dBQ0YsQ0FBQTs7RUFFRCxDQUFDLENBQUMsbURBQW1ELENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFBOztDQUVqRixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7OyJ9