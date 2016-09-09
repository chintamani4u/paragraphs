/**
 * @file
 * Initialize ScrollSpy scripts
 */

import '../../vendor/jquery-scrollspy'

($ => {

    let header = $('.field--name-field-menu, .tieto-campaign-page > .logo')

    header.scrollspy({
        min: 490,
        max: 50000,
        onEnter: function() {
            header.addClass('fixed')
        },
        onLeave: function() {
            header.removeClass('fixed')
        }
    })

    $(document).ready(() => { header.trigger('scroll.scrollspy') })

})(jQuery)