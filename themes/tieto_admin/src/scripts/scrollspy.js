/**
 * @file
 * Initialize ScrollSpy scripts
 */

import '../../vendor/jquery-scrollspy'

($ => {

    let header = $('.field--name-field-menu')

    header.scrollspy({
        min: 490,
        max: 10000,
        onEnter: function() {
            header.addClass('fixed')
        },
        onLeave: function() {
            header.removeClass('fixed')
        }
    })

    $(document).ready(() => { header.trigger('scroll.scrollspy') })

})(jQuery)