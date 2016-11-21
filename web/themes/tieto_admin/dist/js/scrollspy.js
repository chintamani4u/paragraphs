(function (exports) {
'use strict';

/*
 * jQuery ScrollSpy Plugin
 * Author: @sxalexander, softwarespot
 * Licensed under the MIT license
 */
(function jQueryScrollspy(window, $) {
    // Plugin Logic

    $.fn.extend({
        scrollspy: function scrollspy(options, action) {
            // If the options parameter is a string, then assume it's an 'action', therefore swap the parameters around
            if (_isString(options)) {
                var tempOptions = action;

                // Set the action as the option parameter
                action = options;

                // Set to be the reference action pointed to
                options = tempOptions;
            }

            // override the default options with those passed to the plugin
            options = $.extend({}, _defaults, options);

            // sanitize the following option with the default value if the predicate fails
            _sanitizeOption(options, _defaults, 'container', _isObject);

            // cache the jQuery object
            var $container = $(options.container);

            // check if it's a valid jQuery selector
            if ($container.length === 0) {
                return this;
            }

            // sanitize the following option with the default value if the predicate fails
            _sanitizeOption(options, _defaults, 'namespace', _isString);

            // check if the action is set to DESTROY/destroy
            if (_isString(action) && action.toUpperCase() === 'DESTROY') {
                $container.off('scroll.' + options.namespace);
                return this;
            }

            // sanitize the following options with the default values if the predicates fails
            _sanitizeOption(options, _defaults, 'buffer', $.isNumeric);
            _sanitizeOption(options, _defaults, 'max', $.isNumeric);
            _sanitizeOption(options, _defaults, 'min', $.isNumeric);

            // callbacks
            _sanitizeOption(options, _defaults, 'onEnter', $.isFunction);
            _sanitizeOption(options, _defaults, 'onLeave', $.isFunction);
            _sanitizeOption(options, _defaults, 'onLeaveTop', $.isFunction);
            _sanitizeOption(options, _defaults, 'onLeaveBottom', $.isFunction);
            _sanitizeOption(options, _defaults, 'onTick', $.isFunction);

            if ($.isFunction(options.max)) {
                options.max = options.max();
            }

            if ($.isFunction(options.min)) {
                options.min = options.min();
            }

            // check if the mode is set to VERTICAL/vertical
            var isVertical = window.String(options.mode).toUpperCase() === 'VERTICAL';

            return this.each(function each() {
                // cache this
                var _this = this;

                // cache the jQuery object
                var $element = $(_this);

                // count the number of times a container is entered
                var enters = 0;

                // determine if the scroll is with inside the container
                var inside = false;

                // count the number of times a container is left
                var leaves = 0;

                // create a scroll listener for the container
                $container.on('scroll.' + options.namespace, function onScroll() {
                    // cache the jQuery object
                    var $this = $(this);

                    // create a position object literal
                    var position = {
                        top: $this.scrollTop(),
                        left: $this.scrollLeft(),
                    };

                    var containerHeight = $container.height();

                    var max = options.max;

                    var min = options.min;

                    var xAndY = isVertical ? position.top + options.buffer : position.left + options.buffer;

                    if (max === 0) {
                        // get the maximum value based on either the height or the outer width
                        max = isVertical ? containerHeight : $container.outerWidth() + $element.outerWidth();
                    }

                    // if we have reached the minimum bound, though are below the max
                    if (xAndY >= min && xAndY <= max) {
                        // trigger the 'scrollEnter' event
                        if (!inside) {
                            inside = true;
                            enters++;

                            // trigger the 'scrollEnter' event
                            $element.trigger('scrollEnter', {
                                position: position,
                            });

                            // call the 'onEnter' function
                            if (options.onEnter !== null) {
                                options.onEnter(_this, position);
                            }
                        }

                        // trigger the 'scrollTick' event
                        $element.trigger('scrollTick', {
                            position: position,
                            inside: inside,
                            enters: enters,
                            leaves: leaves,
                        });

                        // call the 'onTick' function
                        if (options.onTick !== null) {
                            options.onTick(_this, position, inside, enters, leaves);
                        }
                    } else {
                        if (inside) {
                            inside = false;
                            leaves++;

                            // trigger the 'scrollLeave' event
                            $element.trigger('scrollLeave', {
                                position: position,
                                leaves: leaves,
                            });

                            // call the 'onLeave' function
                            if (options.onLeave !== null) {
                                options.onLeave(_this, position);
                            }

                            if (xAndY <= min) {
                                // trigger the 'scrollLeaveTop' event
                                $element.trigger('scrollLeaveTop', {
                                    position: position,
                                    leaves: leaves,
                                });

                                // call the 'onLeaveTop' function
                                if (options.onLeaveTop !== null) {
                                    options.onLeaveTop(_this, position);
                                }
                            } else if (xAndY >= max) {
                                // trigger the 'scrollLeaveBottom' event
                                $element.trigger('scrollLeaveBottom', {
                                    position: position,
                                    leaves: leaves,
                                });

                                // call the 'onLeaveBottom' function
                                if (options.onLeaveBottom !== null) {
                                    options.onLeaveBottom(_this, position);
                                }
                            }
                        } else {
                            // Idea taken from: http://stackoverflow.com/questions/5353934/check-if-element-is-visible-on-screen
                            var containerScrollTop = $container.scrollTop();

                            // Get the element height
                            var elementHeight = $element.height();

                            // Get the element offset
                            var elementOffsetTop = $element.offset().top;

                            if ((elementOffsetTop < (containerHeight + containerScrollTop)) && (elementOffsetTop > (containerScrollTop - elementHeight))) {
                                // trigger the 'scrollView' event
                                $element.trigger('scrollView', {
                                    position: position,
                                });

                                // call the 'onView' function
                                if (options.onView !== null) {
                                    options.onView(_this, position);
                                }
                            }
                        }
                    }
                });
            });
        },
    });

    // Fields (Private)

    // Defaults

    // default options
    var _defaults = {
        // the offset to be applied to the left and top positions of the container
        buffer: 0,

        // the element to apply the 'scrolling' event to (default window)
        container: window,

        // the maximum value of the X or Y coordinate, depending on mode the selected
        max: 0,

        // the maximum value of the X or Y coordinate, depending on mode the selected
        min: 0,

        // whether to listen to the X (horizontal) or Y (vertical) scrolling
        mode: 'vertical',

        // namespace to append to the 'scroll' event
        namespace: 'scrollspy',

        // call the following callback function every time the user enters the min / max zone
        onEnter: null,

        // call the following callback function every time the user leaves the min / max zone
        onLeave: null,

        // call the following callback function every time the user leaves the top zone
        onLeaveTop: null,

        // call the following callback function every time the user leaves the bottom zone
        onLeaveBottom: null,

        // call the following callback function on each scroll event within the min and max parameters
        onTick: null,

        // call the following callback function on each scroll event when the element is inside the viewable view port
        onView: null,
    };

    // Methods (Private)

    // check if a value is an object datatype
    function _isObject(value) {
        return $.type(value) === 'object';
    }

    // check if a value is a string datatype with a length greater than zero when whitespace is stripped
    function _isString(value) {
        return $.type(value) === 'string' && $.trim(value).length > 0;
    }

    // check if an option is correctly formatted using a predicate; otherwise, return the default value
    function _sanitizeOption(options, defaults, property, predicate) {
        // set the property to the default value if the predicate returned false
        if (!predicate(options[property])) {
            options[property] = defaults[property];
        }
    }
}(window, window.jQuery));

/**
 * @file
 * Initialize ScrollSpy scripts
 */

(function ($) {

    var targets = $('.field--name-field-menu, .tieto-campaign-page > .logo, #hamburger');

    targets.scrollspy({
        min: 490,
        max: 50000,
        onEnter: function() {
            targets.removeClass('not-fixed');
            targets.addClass('fixed');
        },
        onLeave: function() {
            targets.removeClass('fixed');
            targets.addClass('not-fixed');
        }
    });

    $(document).ready(function () { targets.trigger('scroll.scrollspy'); });

})(jQuery);

}((this.LaravelElixirBundle = this.LaravelElixirBundle || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi92YXIvd3d3L3BhcmFncmFwaHMubG9jYWwvd2ViL3RoZW1lcy90aWV0b19hZG1pbi92ZW5kb3IvanF1ZXJ5LXNjcm9sbHNweS5qcyIsIi92YXIvd3d3L3BhcmFncmFwaHMubG9jYWwvd2ViL3RoZW1lcy90aWV0b19hZG1pbi9zcmMvc2NyaXB0cy9zY3JvbGxzcHkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIGpRdWVyeSBTY3JvbGxTcHkgUGx1Z2luXG4gKiBBdXRob3I6IEBzeGFsZXhhbmRlciwgc29mdHdhcmVzcG90XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuKGZ1bmN0aW9uIGpRdWVyeVNjcm9sbHNweSh3aW5kb3csICQpIHtcbiAgICAvLyBQbHVnaW4gTG9naWNcblxuICAgICQuZm4uZXh0ZW5kKHtcbiAgICAgICAgc2Nyb2xsc3B5OiBmdW5jdGlvbiBzY3JvbGxzcHkob3B0aW9ucywgYWN0aW9uKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgb3B0aW9ucyBwYXJhbWV0ZXIgaXMgYSBzdHJpbmcsIHRoZW4gYXNzdW1lIGl0J3MgYW4gJ2FjdGlvbicsIHRoZXJlZm9yZSBzd2FwIHRoZSBwYXJhbWV0ZXJzIGFyb3VuZFxuICAgICAgICAgICAgaWYgKF9pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wT3B0aW9ucyA9IGFjdGlvbjtcblxuICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgYWN0aW9uIGFzIHRoZSBvcHRpb24gcGFyYW1ldGVyXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gb3B0aW9ucztcblxuICAgICAgICAgICAgICAgIC8vIFNldCB0byBiZSB0aGUgcmVmZXJlbmNlIGFjdGlvbiBwb2ludGVkIHRvXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHRlbXBPcHRpb25zO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhvc2UgcGFzc2VkIHRvIHRoZSBwbHVnaW5cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgX2RlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgLy8gc2FuaXRpemUgdGhlIGZvbGxvd2luZyBvcHRpb24gd2l0aCB0aGUgZGVmYXVsdCB2YWx1ZSBpZiB0aGUgcHJlZGljYXRlIGZhaWxzXG4gICAgICAgICAgICBfc2FuaXRpemVPcHRpb24ob3B0aW9ucywgX2RlZmF1bHRzLCAnY29udGFpbmVyJywgX2lzT2JqZWN0KTtcblxuICAgICAgICAgICAgLy8gY2FjaGUgdGhlIGpRdWVyeSBvYmplY3RcbiAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJChvcHRpb25zLmNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0J3MgYSB2YWxpZCBqUXVlcnkgc2VsZWN0b3JcbiAgICAgICAgICAgIGlmICgkY29udGFpbmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzYW5pdGl6ZSB0aGUgZm9sbG93aW5nIG9wdGlvbiB3aXRoIHRoZSBkZWZhdWx0IHZhbHVlIGlmIHRoZSBwcmVkaWNhdGUgZmFpbHNcbiAgICAgICAgICAgIF9zYW5pdGl6ZU9wdGlvbihvcHRpb25zLCBfZGVmYXVsdHMsICduYW1lc3BhY2UnLCBfaXNTdHJpbmcpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgYWN0aW9uIGlzIHNldCB0byBERVNUUk9ZL2Rlc3Ryb3lcbiAgICAgICAgICAgIGlmIChfaXNTdHJpbmcoYWN0aW9uKSAmJiBhY3Rpb24udG9VcHBlckNhc2UoKSA9PT0gJ0RFU1RST1knKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lci5vZmYoJ3Njcm9sbC4nICsgb3B0aW9ucy5uYW1lc3BhY2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzYW5pdGl6ZSB0aGUgZm9sbG93aW5nIG9wdGlvbnMgd2l0aCB0aGUgZGVmYXVsdCB2YWx1ZXMgaWYgdGhlIHByZWRpY2F0ZXMgZmFpbHNcbiAgICAgICAgICAgIF9zYW5pdGl6ZU9wdGlvbihvcHRpb25zLCBfZGVmYXVsdHMsICdidWZmZXInLCAkLmlzTnVtZXJpYyk7XG4gICAgICAgICAgICBfc2FuaXRpemVPcHRpb24ob3B0aW9ucywgX2RlZmF1bHRzLCAnbWF4JywgJC5pc051bWVyaWMpO1xuICAgICAgICAgICAgX3Nhbml0aXplT3B0aW9uKG9wdGlvbnMsIF9kZWZhdWx0cywgJ21pbicsICQuaXNOdW1lcmljKTtcblxuICAgICAgICAgICAgLy8gY2FsbGJhY2tzXG4gICAgICAgICAgICBfc2FuaXRpemVPcHRpb24ob3B0aW9ucywgX2RlZmF1bHRzLCAnb25FbnRlcicsICQuaXNGdW5jdGlvbik7XG4gICAgICAgICAgICBfc2FuaXRpemVPcHRpb24ob3B0aW9ucywgX2RlZmF1bHRzLCAnb25MZWF2ZScsICQuaXNGdW5jdGlvbik7XG4gICAgICAgICAgICBfc2FuaXRpemVPcHRpb24ob3B0aW9ucywgX2RlZmF1bHRzLCAnb25MZWF2ZVRvcCcsICQuaXNGdW5jdGlvbik7XG4gICAgICAgICAgICBfc2FuaXRpemVPcHRpb24ob3B0aW9ucywgX2RlZmF1bHRzLCAnb25MZWF2ZUJvdHRvbScsICQuaXNGdW5jdGlvbik7XG4gICAgICAgICAgICBfc2FuaXRpemVPcHRpb24ob3B0aW9ucywgX2RlZmF1bHRzLCAnb25UaWNrJywgJC5pc0Z1bmN0aW9uKTtcblxuICAgICAgICAgICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLm1heCkpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLm1heCA9IG9wdGlvbnMubWF4KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy5taW4pKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5taW4gPSBvcHRpb25zLm1pbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgbW9kZSBpcyBzZXQgdG8gVkVSVElDQUwvdmVydGljYWxcbiAgICAgICAgICAgIHZhciBpc1ZlcnRpY2FsID0gd2luZG93LlN0cmluZyhvcHRpb25zLm1vZGUpLnRvVXBwZXJDYXNlKCkgPT09ICdWRVJUSUNBTCc7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gZWFjaCgpIHtcbiAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGlzXG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIHRoZSBqUXVlcnkgb2JqZWN0XG4gICAgICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gJChfdGhpcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBjb3VudCB0aGUgbnVtYmVyIG9mIHRpbWVzIGEgY29udGFpbmVyIGlzIGVudGVyZWRcbiAgICAgICAgICAgICAgICB2YXIgZW50ZXJzID0gMDtcblxuICAgICAgICAgICAgICAgIC8vIGRldGVybWluZSBpZiB0aGUgc2Nyb2xsIGlzIHdpdGggaW5zaWRlIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgICAgICB2YXIgaW5zaWRlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAvLyBjb3VudCB0aGUgbnVtYmVyIG9mIHRpbWVzIGEgY29udGFpbmVyIGlzIGxlZnRcbiAgICAgICAgICAgICAgICB2YXIgbGVhdmVzID0gMDtcblxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBhIHNjcm9sbCBsaXN0ZW5lciBmb3IgdGhlIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgICRjb250YWluZXIub24oJ3Njcm9sbC4nICsgb3B0aW9ucy5uYW1lc3BhY2UsIGZ1bmN0aW9uIG9uU2Nyb2xsKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGUgalF1ZXJ5IG9iamVjdFxuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBhIHBvc2l0aW9uIG9iamVjdCBsaXRlcmFsXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJHRoaXMuc2Nyb2xsVG9wKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAkdGhpcy5zY3JvbGxMZWZ0KCksXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lckhlaWdodCA9ICRjb250YWluZXIuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heCA9IG9wdGlvbnMubWF4O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBtaW4gPSBvcHRpb25zLm1pbjtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgeEFuZFkgPSBpc1ZlcnRpY2FsID8gcG9zaXRpb24udG9wICsgb3B0aW9ucy5idWZmZXIgOiBwb3NpdGlvbi5sZWZ0ICsgb3B0aW9ucy5idWZmZXI7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1heCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBtYXhpbXVtIHZhbHVlIGJhc2VkIG9uIGVpdGhlciB0aGUgaGVpZ2h0IG9yIHRoZSBvdXRlciB3aWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4ID0gaXNWZXJ0aWNhbCA/IGNvbnRhaW5lckhlaWdodCA6ICRjb250YWluZXIub3V0ZXJXaWR0aCgpICsgJGVsZW1lbnQub3V0ZXJXaWR0aCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgaGF2ZSByZWFjaGVkIHRoZSBtaW5pbXVtIGJvdW5kLCB0aG91Z2ggYXJlIGJlbG93IHRoZSBtYXhcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhBbmRZID49IG1pbiAmJiB4QW5kWSA8PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyaWdnZXIgdGhlICdzY3JvbGxFbnRlcicgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5zaWRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zaWRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRlcnMrKztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyaWdnZXIgdGhlICdzY3JvbGxFbnRlcicgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC50cmlnZ2VyKCdzY3JvbGxFbnRlcicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgJ29uRW50ZXInIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMub25FbnRlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uRW50ZXIoX3RoaXMsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyaWdnZXIgdGhlICdzY3JvbGxUaWNrJyBldmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQudHJpZ2dlcignc2Nyb2xsVGljaycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zaWRlOiBpbnNpZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50ZXJzOiBlbnRlcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhdmVzOiBsZWF2ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgJ29uVGljaycgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm9uVGljayAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25UaWNrKF90aGlzLCBwb3NpdGlvbiwgaW5zaWRlLCBlbnRlcnMsIGxlYXZlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zaWRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zaWRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhdmVzKys7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cmlnZ2VyIHRoZSAnc2Nyb2xsTGVhdmUnIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQudHJpZ2dlcignc2Nyb2xsTGVhdmUnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhdmVzOiBsZWF2ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSAnb25MZWF2ZScgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5vbkxlYXZlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25MZWF2ZShfdGhpcywgcG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4QW5kWSA8PSBtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJpZ2dlciB0aGUgJ3Njcm9sbExlYXZlVG9wJyBldmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC50cmlnZ2VyKCdzY3JvbGxMZWF2ZVRvcCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlYXZlczogbGVhdmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSAnb25MZWF2ZVRvcCcgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMub25MZWF2ZVRvcCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vbkxlYXZlVG9wKF90aGlzLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHhBbmRZID49IG1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cmlnZ2VyIHRoZSAnc2Nyb2xsTGVhdmVCb3R0b20nIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LnRyaWdnZXIoJ3Njcm9sbExlYXZlQm90dG9tJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhdmVzOiBsZWF2ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlICdvbkxlYXZlQm90dG9tJyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5vbkxlYXZlQm90dG9tICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uTGVhdmVCb3R0b20oX3RoaXMsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWRlYSB0YWtlbiBmcm9tOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUzNTM5MzQvY2hlY2staWYtZWxlbWVudC1pcy12aXNpYmxlLW9uLXNjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250YWluZXJTY3JvbGxUb3AgPSAkY29udGFpbmVyLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBlbGVtZW50IGhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50SGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGVsZW1lbnQgb2Zmc2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXRUb3AgPSAkZWxlbWVudC5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGVsZW1lbnRPZmZzZXRUb3AgPCAoY29udGFpbmVySGVpZ2h0ICsgY29udGFpbmVyU2Nyb2xsVG9wKSkgJiYgKGVsZW1lbnRPZmZzZXRUb3AgPiAoY29udGFpbmVyU2Nyb2xsVG9wIC0gZWxlbWVudEhlaWdodCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyaWdnZXIgdGhlICdzY3JvbGxWaWV3JyBldmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC50cmlnZ2VyKCdzY3JvbGxWaWV3Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSAnb25WaWV3JyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5vblZpZXcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25WaWV3KF90aGlzLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gRmllbGRzIChQcml2YXRlKVxuXG4gICAgLy8gRGVmYXVsdHNcblxuICAgIC8vIGRlZmF1bHQgb3B0aW9uc1xuICAgIHZhciBfZGVmYXVsdHMgPSB7XG4gICAgICAgIC8vIHRoZSBvZmZzZXQgdG8gYmUgYXBwbGllZCB0byB0aGUgbGVmdCBhbmQgdG9wIHBvc2l0aW9ucyBvZiB0aGUgY29udGFpbmVyXG4gICAgICAgIGJ1ZmZlcjogMCxcblxuICAgICAgICAvLyB0aGUgZWxlbWVudCB0byBhcHBseSB0aGUgJ3Njcm9sbGluZycgZXZlbnQgdG8gKGRlZmF1bHQgd2luZG93KVxuICAgICAgICBjb250YWluZXI6IHdpbmRvdyxcblxuICAgICAgICAvLyB0aGUgbWF4aW11bSB2YWx1ZSBvZiB0aGUgWCBvciBZIGNvb3JkaW5hdGUsIGRlcGVuZGluZyBvbiBtb2RlIHRoZSBzZWxlY3RlZFxuICAgICAgICBtYXg6IDAsXG5cbiAgICAgICAgLy8gdGhlIG1heGltdW0gdmFsdWUgb2YgdGhlIFggb3IgWSBjb29yZGluYXRlLCBkZXBlbmRpbmcgb24gbW9kZSB0aGUgc2VsZWN0ZWRcbiAgICAgICAgbWluOiAwLFxuXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gbGlzdGVuIHRvIHRoZSBYIChob3Jpem9udGFsKSBvciBZICh2ZXJ0aWNhbCkgc2Nyb2xsaW5nXG4gICAgICAgIG1vZGU6ICd2ZXJ0aWNhbCcsXG5cbiAgICAgICAgLy8gbmFtZXNwYWNlIHRvIGFwcGVuZCB0byB0aGUgJ3Njcm9sbCcgZXZlbnRcbiAgICAgICAgbmFtZXNwYWNlOiAnc2Nyb2xsc3B5JyxcblxuICAgICAgICAvLyBjYWxsIHRoZSBmb2xsb3dpbmcgY2FsbGJhY2sgZnVuY3Rpb24gZXZlcnkgdGltZSB0aGUgdXNlciBlbnRlcnMgdGhlIG1pbiAvIG1heCB6b25lXG4gICAgICAgIG9uRW50ZXI6IG51bGwsXG5cbiAgICAgICAgLy8gY2FsbCB0aGUgZm9sbG93aW5nIGNhbGxiYWNrIGZ1bmN0aW9uIGV2ZXJ5IHRpbWUgdGhlIHVzZXIgbGVhdmVzIHRoZSBtaW4gLyBtYXggem9uZVxuICAgICAgICBvbkxlYXZlOiBudWxsLFxuXG4gICAgICAgIC8vIGNhbGwgdGhlIGZvbGxvd2luZyBjYWxsYmFjayBmdW5jdGlvbiBldmVyeSB0aW1lIHRoZSB1c2VyIGxlYXZlcyB0aGUgdG9wIHpvbmVcbiAgICAgICAgb25MZWF2ZVRvcDogbnVsbCxcblxuICAgICAgICAvLyBjYWxsIHRoZSBmb2xsb3dpbmcgY2FsbGJhY2sgZnVuY3Rpb24gZXZlcnkgdGltZSB0aGUgdXNlciBsZWF2ZXMgdGhlIGJvdHRvbSB6b25lXG4gICAgICAgIG9uTGVhdmVCb3R0b206IG51bGwsXG5cbiAgICAgICAgLy8gY2FsbCB0aGUgZm9sbG93aW5nIGNhbGxiYWNrIGZ1bmN0aW9uIG9uIGVhY2ggc2Nyb2xsIGV2ZW50IHdpdGhpbiB0aGUgbWluIGFuZCBtYXggcGFyYW1ldGVyc1xuICAgICAgICBvblRpY2s6IG51bGwsXG5cbiAgICAgICAgLy8gY2FsbCB0aGUgZm9sbG93aW5nIGNhbGxiYWNrIGZ1bmN0aW9uIG9uIGVhY2ggc2Nyb2xsIGV2ZW50IHdoZW4gdGhlIGVsZW1lbnQgaXMgaW5zaWRlIHRoZSB2aWV3YWJsZSB2aWV3IHBvcnRcbiAgICAgICAgb25WaWV3OiBudWxsLFxuICAgIH07XG5cbiAgICAvLyBNZXRob2RzIChQcml2YXRlKVxuXG4gICAgLy8gY2hlY2sgaWYgYSB2YWx1ZSBpcyBhbiBvYmplY3QgZGF0YXR5cGVcbiAgICBmdW5jdGlvbiBfaXNPYmplY3QodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICQudHlwZSh2YWx1ZSkgPT09ICdvYmplY3QnO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIGEgdmFsdWUgaXMgYSBzdHJpbmcgZGF0YXR5cGUgd2l0aCBhIGxlbmd0aCBncmVhdGVyIHRoYW4gemVybyB3aGVuIHdoaXRlc3BhY2UgaXMgc3RyaXBwZWRcbiAgICBmdW5jdGlvbiBfaXNTdHJpbmcodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICQudHlwZSh2YWx1ZSkgPT09ICdzdHJpbmcnICYmICQudHJpbSh2YWx1ZSkubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBhbiBvcHRpb24gaXMgY29ycmVjdGx5IGZvcm1hdHRlZCB1c2luZyBhIHByZWRpY2F0ZTsgb3RoZXJ3aXNlLCByZXR1cm4gdGhlIGRlZmF1bHQgdmFsdWVcbiAgICBmdW5jdGlvbiBfc2FuaXRpemVPcHRpb24ob3B0aW9ucywgZGVmYXVsdHMsIHByb3BlcnR5LCBwcmVkaWNhdGUpIHtcbiAgICAgICAgLy8gc2V0IHRoZSBwcm9wZXJ0eSB0byB0aGUgZGVmYXVsdCB2YWx1ZSBpZiB0aGUgcHJlZGljYXRlIHJldHVybmVkIGZhbHNlXG4gICAgICAgIGlmICghcHJlZGljYXRlKG9wdGlvbnNbcHJvcGVydHldKSkge1xuICAgICAgICAgICAgb3B0aW9uc1twcm9wZXJ0eV0gPSBkZWZhdWx0c1twcm9wZXJ0eV07XG4gICAgICAgIH1cbiAgICB9XG59KHdpbmRvdywgd2luZG93LmpRdWVyeSkpO1xuIiwiLyoqXG4gKiBAZmlsZVxuICogSW5pdGlhbGl6ZSBTY3JvbGxTcHkgc2NyaXB0c1xuICovXG5cbmltcG9ydCAnLi4vLi4vdmVuZG9yL2pxdWVyeS1zY3JvbGxzcHknXG5cbigkID0+IHtcblxuICAgIGxldCB0YXJnZXRzID0gJCgnLmZpZWxkLS1uYW1lLWZpZWxkLW1lbnUsIC50aWV0by1jYW1wYWlnbi1wYWdlID4gLmxvZ28sICNoYW1idXJnZXInKVxuXG4gICAgdGFyZ2V0cy5zY3JvbGxzcHkoe1xuICAgICAgICBtaW46IDQ5MCxcbiAgICAgICAgbWF4OiA1MDAwMCxcbiAgICAgICAgb25FbnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0YXJnZXRzLnJlbW92ZUNsYXNzKCdub3QtZml4ZWQnKVxuICAgICAgICAgICAgdGFyZ2V0cy5hZGRDbGFzcygnZml4ZWQnKVxuICAgICAgICB9LFxuICAgICAgICBvbkxlYXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRhcmdldHMucmVtb3ZlQ2xhc3MoJ2ZpeGVkJylcbiAgICAgICAgICAgIHRhcmdldHMuYWRkQ2xhc3MoJ25vdC1maXhlZCcpXG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoKCkgPT4geyB0YXJnZXRzLnRyaWdnZXIoJ3Njcm9sbC5zY3JvbGxzcHknKSB9KVxuXG59KShqUXVlcnkpXG4iXSwibmFtZXMiOlsibGV0Il0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7QUFLQSxDQUFDLFNBQVMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7OztJQUdqQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUNSLFNBQVMsRUFBRSxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFOztZQUUzQyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDcEIsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDOzs7Z0JBR3pCLE1BQU0sR0FBRyxPQUFPLENBQUM7OztnQkFHakIsT0FBTyxHQUFHLFdBQVcsQ0FBQzthQUN6Qjs7O1lBR0QsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzs7O1lBRzNDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQzs7O1lBRzVELElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7OztZQUd0QyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN6QixPQUFPLElBQUksQ0FBQzthQUNmOzs7WUFHRCxlQUFlLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7OztZQUc1RCxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssU0FBUyxFQUFFO2dCQUN6RCxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzlDLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7OztZ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