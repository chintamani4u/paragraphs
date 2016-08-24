/**
 * @file
 * Initialize ScrollSpy scripts
 */

import '../../vendor/jquery-scrollspy'

($ => {

    const header = $('.page-header')

    header.scrollspy({
        min: 490,
        max: 10000,
        onEnter: function(element, position) {
            header.addClass('fixed')
        },
        onLeave: function(element, position) {
            header.removeClass('fixed')
        }
    })

})(jQuery)