(function (exports) {
'use strict';

(function ( $, window, undefined ) {

    /** Default settings */
    var defaults = {
        active: null,
        event: 'click',
        disabled: [],
        collapsible: 'accordion',
        startCollapsed: false,
        rotate: false,
        setHash: false,
        animation: 'default',
        animationQueue: false,
        duration: 500,
        fluidHeight: true,
        scrollToAccordion: false,
        scrollToAccordionOnLoad: true,
        scrollToAccordionOffset: 0,
        accordionTabElement: '<div></div>',
        click: function(){},
        activate: function(){},
        deactivate: function(){},
        load: function(){},
        activateState: function(){},
        classes: {
            stateDefault: 'r-tabs-state-default',
            stateActive: 'r-tabs-state-active',
            stateDisabled: 'r-tabs-state-disabled',
            stateExcluded: 'r-tabs-state-excluded',
            container: 'r-tabs',
            ul: 'r-tabs-nav',
            tab: 'r-tabs-tab',
            anchor: 'r-tabs-anchor',
            panel: 'r-tabs-panel',
            accordionTitle: 'r-tabs-accordion-title'
        }
    };

    /**
     * Responsive Tabs
     * @constructor
     * @param {object} element - The HTML element the validator should be bound to
     * @param {object} options - An option map
     */
    function ResponsiveTabs(element, options) {
        this.element = element; // Selected DOM element
        this.$element = $(element); // Selected jQuery element

        this.tabs = []; // Create tabs array
        this.state = ''; // Define the plugin state (tabs/accordion)
        this.rotateInterval = 0; // Define rotate interval
        this.$queue = $({});

        // Extend the defaults with the passed options
        this.options = $.extend( {}, defaults, options);

        this.init();
    }


    /**
     * This function initializes the tab plugin
     */
    ResponsiveTabs.prototype.init = function () {
        var _this = this;

        // Load all the elements
        this.tabs = this._loadElements();
        this._loadClasses();
        this._loadEvents();

        // Window resize bind to check state
        $(window).on('resize', function(e) {
            _this._setState(e);
            _this._equaliseHeights();
        });

        // Hashchange event
        $(window).on('hashchange', function(e) {
            var tabRef = _this._getTabRefBySelector(window.location.hash);
            var oTab = _this._getTab(tabRef);

            // Check if a tab is found that matches the hash
            if(tabRef >= 0 && !oTab._ignoreHashChange && !oTab.disabled) {
                // If so, open the tab and auto close the current one
                _this._openTab(e, _this._getTab(tabRef), true);
            }
        });

        // Start rotate event if rotate option is defined
        if(this.options.rotate !== false) {
            this.startRotation();
        }

        // Set fluid height
        if(this.options.fluidHeight !== true)  {
            _this._equaliseHeights();
        }

        // --------------------
        // Define plugin events
        //

        // Activate: this event is called when a tab is selected
        this.$element.bind('tabs-click', function(e, oTab) {
            _this.options.click.call(this, e, oTab);
        });

        // Activate: this event is called when a tab is selected
        this.$element.bind('tabs-activate', function(e, oTab) {
            _this.options.activate.call(this, e, oTab);
        });
        // Deactivate: this event is called when a tab is closed
        this.$element.bind('tabs-deactivate', function(e, oTab) {
            _this.options.deactivate.call(this, e, oTab);
        });
        // Activate State: this event is called when the plugin switches states
        this.$element.bind('tabs-activate-state', function(e, state) {
            _this.options.activateState.call(this, e, state);
        });

        // Load: this event is called when the plugin has been loaded
        this.$element.bind('tabs-load', function(e) {
            var startTab;

            _this._setState(e); // Set state

            // Check if the panel should be collaped on load
            if(_this.options.startCollapsed !== true && !(_this.options.startCollapsed === 'accordion' && _this.state === 'accordion')) {

                startTab = _this._getStartTab();

                // Open the initial tab
                _this._openTab(e, startTab); // Open first tab

                // Call the callback function
                _this.options.load.call(this, e, startTab); // Call the load callback
            }
        });
        // Trigger loaded event
        this.$element.trigger('tabs-load');
    };

    //
    // PRIVATE FUNCTIONS
    //

    /**
     * This function loads the tab elements and stores them in an array
     * @returns {Array} Array of tab elements
     */
    ResponsiveTabs.prototype._loadElements = function() {
        var _this = this;
        var $ul = this.$element.children('ul:first');
        var tabs = [];
        var id = 0;

        // Add the classes to the basic html elements
        this.$element.addClass(_this.options.classes.container); // Tab container
        $ul.addClass(_this.options.classes.ul); // List container

        // Get tab buttons and store their data in an array
        $('li', $ul).each(function() {
            var $tab = $(this);
            var isExcluded = $tab.hasClass(_this.options.classes.stateExcluded);
            var $anchor, $panel, $accordionTab, $accordionAnchor, panelSelector;

            // Check if the tab should be excluded
            if(!isExcluded) {

                $anchor = $('a', $tab);
                panelSelector = $anchor.attr('href');
                $panel = $(panelSelector);
                $accordionTab = $(_this.options.accordionTabElement).insertBefore($panel);
                $accordionAnchor = $('<a></a>').attr('href', panelSelector).html($anchor.html()).appendTo($accordionTab);

                var oTab = {
                    _ignoreHashChange: false,
                    id: id,
                    disabled: ($.inArray(id, _this.options.disabled) !== -1),
                    tab: $(this),
                    anchor: $('a', $tab),
                    panel: $panel,
                    selector: panelSelector,
                    accordionTab: $accordionTab,
                    accordionAnchor: $accordionAnchor,
                    active: false
                };

                // 1up the ID
                id++;
                // Add to tab array
                tabs.push(oTab);
            }
        });
        return tabs;
    };


    /**
     * This function adds classes to the tab elements based on the options
     */
    ResponsiveTabs.prototype._loadClasses = function() {
        var this$1 = this;

        for (var i=0; i<this.tabs.length; i++) {
            this$1.tabs[i].tab.addClass(this$1.options.classes.stateDefault).addClass(this$1.options.classes.tab);
            this$1.tabs[i].anchor.addClass(this$1.options.classes.anchor);
            this$1.tabs[i].panel.addClass(this$1.options.classes.stateDefault).addClass(this$1.options.classes.panel);
            this$1.tabs[i].accordionTab.addClass(this$1.options.classes.accordionTitle);
            this$1.tabs[i].accordionAnchor.addClass(this$1.options.classes.anchor);
            if(this$1.tabs[i].disabled) {
                this$1.tabs[i].tab.removeClass(this$1.options.classes.stateDefault).addClass(this$1.options.classes.stateDisabled);
                this$1.tabs[i].accordionTab.removeClass(this$1.options.classes.stateDefault).addClass(this$1.options.classes.stateDisabled);
           }
        }
    };

    /**
     * This function adds events to the tab elements
     */
    ResponsiveTabs.prototype._loadEvents = function() {
        var this$1 = this;

        var _this = this;

        // Define activate event on a tab element
        var fActivate = function(e) {
            var current = _this._getCurrentTab(); // Fetch current tab
            var activatedTab = e.data.tab;

            e.preventDefault();

            // Trigger click event for whenever a tab is clicked/touched even if the tab is disabled
            activatedTab.tab.trigger('tabs-click', activatedTab);

            // Make sure this tab isn't disabled
            if(!activatedTab.disabled) {

                // Check if hash has to be set in the URL location
                if(_this.options.setHash) {
                    // Set the hash using the history api if available to tackle Chromes repaint bug on hash change
                    if(history.pushState) {
                        history.pushState(null, null, window.location.origin + window.location.pathname + window.location.search + activatedTab.selector);
                    } else {
                        // Otherwise fallback to the hash update for sites that don't support the history api
                        window.location.hash = activatedTab.selector;
                    }
                }

                e.data.tab._ignoreHashChange = true;

                // Check if the activated tab isnt the current one or if its collapsible. If not, do nothing
                if(current !== activatedTab || _this._isCollapisble()) {
                    // The activated tab is either another tab of the current one. If it's the current tab it is collapsible
                    // Either way, the current tab can be closed
                    _this._closeTab(e, current);

                    // Check if the activated tab isnt the current one or if it isnt collapsible
                    if(current !== activatedTab || !_this._isCollapisble()) {
                        _this._openTab(e, activatedTab, false, true);
                    }
                }
            }
        };

        // Loop tabs
        for (var i=0; i<this.tabs.length; i++) {
            // Add activate function to the tab and accordion selection element
            this$1.tabs[i].anchor.on(_this.options.event, {tab: _this.tabs[i]}, fActivate);
            this$1.tabs[i].accordionAnchor.on(_this.options.event, {tab: _this.tabs[i]}, fActivate);
        }
    };

    /**
     * This function gets the tab that should be opened at start
     * @returns {Object} Tab object
     */
    ResponsiveTabs.prototype._getStartTab = function() {
        var tabRef = this._getTabRefBySelector(window.location.hash);
        var startTab;

        // Check if the page has a hash set that is linked to a tab
        if(tabRef >= 0 && !this._getTab(tabRef).disabled) {
            // If so, set the current tab to the linked tab
            startTab = this._getTab(tabRef);
        } else if(this.options.active > 0 && !this._getTab(this.options.active).disabled) {
            startTab = this._getTab(this.options.active);
        } else {
            // If not, just get the first one
            startTab = this._getTab(0);
        }

        return startTab;
    };

    /**
     * This function sets the current state of the plugin
     * @param {Event} e - The event that triggers the state change
     */
    ResponsiveTabs.prototype._setState = function(e) {
        var $ul = $('ul:first', this.$element);
        var oldState = this.state;
        var startCollapsedIsState = (typeof this.options.startCollapsed === 'string');
        var startTab;

        // The state is based on the visibility of the tabs list
        if($ul.is(':visible')){
            // Tab list is visible, so the state is 'tabs'
            this.state = 'tabs';
        } else {
            // Tab list is invisible, so the state is 'accordion'
            this.state = 'accordion';
        }

        // If the new state is different from the old state
        if(this.state !== oldState) {
            // If so, the state activate trigger must be called
            this.$element.trigger('tabs-activate-state', {oldState: oldState, newState: this.state});

            // Check if the state switch should open a tab
            if(oldState && startCollapsedIsState && this.options.startCollapsed !== this.state && this._getCurrentTab() === undefined) {
                // Get initial tab
                startTab = this._getStartTab(e);
                // Open the initial tab
                this._openTab(e, startTab); // Open first tab
            }
        }
    };

    /**
     * This function opens a tab
     * @param {Event} e - The event that triggers the tab opening
     * @param {Object} oTab - The tab object that should be opened
     * @param {Boolean} closeCurrent - Defines if the current tab should be closed
     * @param {Boolean} stopRotation - Defines if the tab rotation loop should be stopped
     */
    ResponsiveTabs.prototype._openTab = function(e, oTab, closeCurrent, stopRotation) {
        var _this = this;
        var scrollOffset;

        // Check if the current tab has to be closed
        if(closeCurrent) {
            this._closeTab(e, this._getCurrentTab());
        }

        // Check if the rotation has to be stopped when activated
        if(stopRotation && this.rotateInterval > 0) {
            this.stopRotation();
        }

        // Set this tab to active
        oTab.active = true;
        // Set active classes to the tab button and accordion tab button
        oTab.tab.removeClass(_this.options.classes.stateDefault).addClass(_this.options.classes.stateActive);
        oTab.accordionTab.removeClass(_this.options.classes.stateDefault).addClass(_this.options.classes.stateActive);

        // Run panel transiton
        _this._doTransition(oTab.panel, _this.options.animation, 'open', function() {
            var scrollOnLoad = (e.type !== 'tabs-load' || _this.options.scrollToAccordionOnLoad);

            // When finished, set active class to the panel
            oTab.panel.removeClass(_this.options.classes.stateDefault).addClass(_this.options.classes.stateActive);

            // And if enabled and state is accordion, scroll to the accordion tab
            if(_this.getState() === 'accordion' && _this.options.scrollToAccordion && (!_this._isInView(oTab.accordionTab) || _this.options.animation !== 'default') && scrollOnLoad) {

                // Add offset element's height to scroll position
                scrollOffset = oTab.accordionTab.offset().top - _this.options.scrollToAccordionOffset;

                // Check if the animation option is enabled, and if the duration isn't 0
                if(_this.options.animation !== 'default' && _this.options.duration > 0) {
                    // If so, set scrollTop with animate and use the 'animation' duration
                    $('html, body').animate({
                        scrollTop: scrollOffset
                    }, _this.options.duration);
                } else {
                    //  If not, just set scrollTop
                    $('html, body').scrollTop(scrollOffset);
                }
            }
        });

        this.$element.trigger('tabs-activate', oTab);
    };

    /**
     * This function closes a tab
     * @param {Event} e - The event that is triggered when a tab is closed
     * @param {Object} oTab - The tab object that should be closed
     */
    ResponsiveTabs.prototype._closeTab = function(e, oTab) {
        var _this = this;
        var doQueueOnState = typeof _this.options.animationQueue === 'string';
        var doQueue;

        if(oTab !== undefined) {
            if(doQueueOnState && _this.getState() === _this.options.animationQueue) {
                doQueue = true;
            } else if(doQueueOnState) {
                doQueue = false;
            } else {
                doQueue = _this.options.animationQueue;
            }

            // Deactivate tab
            oTab.active = false;
            // Set default class to the tab button
            oTab.tab.removeClass(_this.options.classes.stateActive).addClass(_this.options.classes.stateDefault);

            // Run panel transition
            _this._doTransition(oTab.panel, _this.options.animation, 'close', function() {
                // Set default class to the accordion tab button and tab panel
                oTab.accordionTab.removeClass(_this.options.classes.stateActive).addClass(_this.options.classes.stateDefault);
                oTab.panel.removeClass(_this.options.classes.stateActive).addClass(_this.options.classes.stateDefault);
            }, !doQueue);

            this.$element.trigger('tabs-deactivate', oTab);
        }
    };

    /**
     * This function runs an effect on a panel
     * @param {Element} panel - The HTML element of the tab panel
     * @param {String} method - The transition method reference
     * @param {String} state - The state (open/closed) that the panel should transition to
     * @param {Function} callback - The callback function that is called after the transition
     * @param {Boolean} dequeue - Defines if the event queue should be dequeued after the transition
     */
    ResponsiveTabs.prototype._doTransition = function(panel, method, state, callback, dequeue) {
        var effect;
        var _this = this;

        // Get effect based on method
        switch(method) {
            case 'slide':
                effect = (state === 'open') ? 'slideDown' : 'slideUp';
                break;
            case 'fade':
                effect = (state === 'open') ? 'fadeIn' : 'fadeOut';
                break;
            default:
                effect = (state === 'open') ? 'show' : 'hide';
                // When default is used, set the duration to 0
                _this.options.duration = 0;
                break;
        }

        // Add the transition to a custom queue
        this.$queue.queue('responsive-tabs',function(next){
            // Run the transition on the panel
            panel[effect]({
                duration: _this.options.duration,
                complete: function() {
                    // Call the callback function
                    callback.call(panel, method, state);
                    // Run the next function in the queue
                    next();
                }
            });
        });

        // When the panel is openend, dequeue everything so the animation starts
        if(state === 'open' || dequeue) {
            this.$queue.dequeue('responsive-tabs');
        }

    };

    /**
     * This function returns the collapsibility of the tab in this state
     * @returns {Boolean} The collapsibility of the tab
     */
    ResponsiveTabs.prototype._isCollapisble = function() {
        return (typeof this.options.collapsible === 'boolean' && this.options.collapsible) || (typeof this.options.collapsible === 'string' && this.options.collapsible === this.getState());
    };

    /**
     * This function returns a tab by numeric reference
     * @param {Integer} numRef - Numeric tab reference
     * @returns {Object} Tab object
     */
    ResponsiveTabs.prototype._getTab = function(numRef) {
        return this.tabs[numRef];
    };

    /**
     * This function returns the numeric tab reference based on a hash selector
     * @param {String} selector - Hash selector
     * @returns {Integer} Numeric tab reference
     */
    ResponsiveTabs.prototype._getTabRefBySelector = function(selector) {
        var this$1 = this;

        // Loop all tabs
        for (var i=0; i<this.tabs.length; i++) {
            // Check if the hash selector is equal to the tab selector
            if(this$1.tabs[i].selector === selector) {
                return i;
            }
        }
        // If none is found return a negative index
        return -1;
    };

    /**
     * This function returns the current tab element
     * @returns {Object} Current tab element
     */
    ResponsiveTabs.prototype._getCurrentTab = function() {
        return this._getTab(this._getCurrentTabRef());
    };

    /**
     * This function returns the next tab's numeric reference
     * @param {Integer} currentTabRef - Current numeric tab reference
     * @returns {Integer} Numeric tab reference
     */
    ResponsiveTabs.prototype._getNextTabRef = function(currentTabRef) {
        var tabRef = (currentTabRef || this._getCurrentTabRef());
        var nextTabRef = (tabRef === this.tabs.length - 1) ? 0 : tabRef + 1;
        return (this._getTab(nextTabRef).disabled) ? this._getNextTabRef(nextTabRef) : nextTabRef;
    };

    /**
     * This function returns the previous tab's numeric reference
     * @returns {Integer} Numeric tab reference
     */
    ResponsiveTabs.prototype._getPreviousTabRef = function() {
        return (this._getCurrentTabRef() === 0) ? this.tabs.length - 1 : this._getCurrentTabRef() - 1;
    };

    /**
     * This function returns the current tab's numeric reference
     * @returns {Integer} Numeric tab reference
     */
    ResponsiveTabs.prototype._getCurrentTabRef = function() {
        var this$1 = this;

        // Loop all tabs
        for (var i=0; i<this.tabs.length; i++) {
            // If this tab is active, return it
            if(this$1.tabs[i].active) {
                return i;
            }
        }
        // No tabs have been found, return negative index
        return -1;
    };

    /**
     * This function gets the tallest tab and applied the height to all tabs
     */
    ResponsiveTabs.prototype._equaliseHeights = function() {
        var maxHeight = 0;

        $.each($.map(this.tabs, function(tab) {
            maxHeight = Math.max(maxHeight, tab.panel.css('minHeight', '').height());
            return tab.panel;
        }), function() {
            this.css('minHeight', maxHeight);
        });
    };

    //
    // HELPER FUNCTIONS
    //

    ResponsiveTabs.prototype._isInView = function($element) {
        var docViewTop = $(window).scrollTop(),
            docViewBottom = docViewTop + $(window).height(),
            elemTop = $element.offset().top,
            elemBottom = elemTop + $element.height();
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    };

    //
    // PUBLIC FUNCTIONS
    //

    /**
     * This function activates a tab
     * @param {Integer} tabRef - Numeric tab reference
     * @param {Boolean} stopRotation - Defines if the tab rotation should stop after activation
     */
    ResponsiveTabs.prototype.activate = function(tabRef, stopRotation) {
        var e = jQuery.Event('tabs-activate');
        var oTab = this._getTab(tabRef);
        if(!oTab.disabled) {
            this._openTab(e, oTab, true, stopRotation || true);
        }
    };

    /**
     * This function deactivates a tab
     * @param {Integer} tabRef - Numeric tab reference
     */
    ResponsiveTabs.prototype.deactivate = function(tabRef) {
        var e = jQuery.Event('tabs-dectivate');
        var oTab = this._getTab(tabRef);
        if(!oTab.disabled) {
            this._closeTab(e, oTab);
        }
    };

    /**
     * This function enables a tab
     * @param {Integer} tabRef - Numeric tab reference
     */
    ResponsiveTabs.prototype.enable = function(tabRef) {
        var oTab = this._getTab(tabRef);
        if(oTab){
            oTab.disabled = false;
            oTab.tab.addClass(this.options.classes.stateDefault).removeClass(this.options.classes.stateDisabled);
            oTab.accordionTab.addClass(this.options.classes.stateDefault).removeClass(this.options.classes.stateDisabled);
        }
    };

    /**
     * This function disable a tab
     * @param {Integer} tabRef - Numeric tab reference
     */
    ResponsiveTabs.prototype.disable = function(tabRef) {
        var oTab = this._getTab(tabRef);
        if(oTab){
            oTab.disabled = true;
            oTab.tab.removeClass(this.options.classes.stateDefault).addClass(this.options.classes.stateDisabled);
            oTab.accordionTab.removeClass(this.options.classes.stateDefault).addClass(this.options.classes.stateDisabled);
        }
    };

    /**
     * This function gets the current state of the plugin
     * @returns {String} State of the plugin
     */
    ResponsiveTabs.prototype.getState = function() {
        return this.state;
    };

    /**
     * This function starts the rotation of the tabs
     * @param {Integer} speed - The speed of the rotation
     */
    ResponsiveTabs.prototype.startRotation = function(speed) {
        var _this = this;
        // Make sure not all tabs are disabled
        if(this.tabs.length > this.options.disabled.length) {
            this.rotateInterval = setInterval(function(){
                var e = jQuery.Event('rotate');
                _this._openTab(e, _this._getTab(_this._getNextTabRef()), true);
            }, speed || (($.isNumeric(_this.options.rotate)) ? _this.options.rotate : 4000) );
        } else {
            throw new Error("Rotation is not possible if all tabs are disabled");
        }
    };

    /**
     * This function stops the rotation of the tabs
     */
    ResponsiveTabs.prototype.stopRotation = function() {
        window.clearInterval(this.rotateInterval);
        this.rotateInterval = 0;
    };

    /**
     * This function can be used to get/set options
     * @return {any} Option value
     */
    ResponsiveTabs.prototype.option = function(key, value) {
        if(value) {
            this.options[key] = value;
        }
        return this.options[key];
    };

    /** jQuery wrapper */
    $.fn.responsiveTabs = function ( options ) {
        var args = arguments;
        var instance;

        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'responsivetabs')) {
                    $.data(this, 'responsivetabs', new ResponsiveTabs( this, options ));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            instance = $.data(this[0], 'responsivetabs');

            // Allow instances to be destroyed via the 'destroy' method
            if (options === 'destroy') {
                // TODO: destroy instance classes, etc
                $.data(this, 'responsivetabs', null);
            }

            if (instance instanceof ResponsiveTabs && typeof instance[options] === 'function') {
                return instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
            } else {
                return this;
            }
        }
    };

}(jQuery, window));

/**
 * @file
 * Initialize Responsive Tabs scripts.
 */

(function ($) {

	$('.r-tabs-container').responsiveTabs({
	  startCollapsed: false,
	  animation: 'slide',
	  duration: 200
	});

})(jQuery);

}((this.LaravelElixirBundle = this.LaravelElixirBundle || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi92YXIvd3d3L3BhcmFncmFwaHMubG9jYWwvd2ViL3RoZW1lcy90aWV0b19hZG1pbi9ub2RlX21vZHVsZXMvcmVzcG9uc2l2ZS10YWJzL2pzL2pxdWVyeS5yZXNwb25zaXZlVGFicy5qcyIsIi92YXIvd3d3L3BhcmFncmFwaHMubG9jYWwvd2ViL3RoZW1lcy90aWV0b19hZG1pbi9zcmMvc2NyaXB0cy9yZXNwb25zaXZlLXRhYnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbiAoICQsIHdpbmRvdywgdW5kZWZpbmVkICkge1xuXG4gICAgLyoqIERlZmF1bHQgc2V0dGluZ3MgKi9cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIGFjdGl2ZTogbnVsbCxcbiAgICAgICAgZXZlbnQ6ICdjbGljaycsXG4gICAgICAgIGRpc2FibGVkOiBbXSxcbiAgICAgICAgY29sbGFwc2libGU6ICdhY2NvcmRpb24nLFxuICAgICAgICBzdGFydENvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgIHJvdGF0ZTogZmFsc2UsXG4gICAgICAgIHNldEhhc2g6IGZhbHNlLFxuICAgICAgICBhbmltYXRpb246ICdkZWZhdWx0JyxcbiAgICAgICAgYW5pbWF0aW9uUXVldWU6IGZhbHNlLFxuICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICBmbHVpZEhlaWdodDogdHJ1ZSxcbiAgICAgICAgc2Nyb2xsVG9BY2NvcmRpb246IGZhbHNlLFxuICAgICAgICBzY3JvbGxUb0FjY29yZGlvbk9uTG9hZDogdHJ1ZSxcbiAgICAgICAgc2Nyb2xsVG9BY2NvcmRpb25PZmZzZXQ6IDAsXG4gICAgICAgIGFjY29yZGlvblRhYkVsZW1lbnQ6ICc8ZGl2PjwvZGl2PicsXG4gICAgICAgIGNsaWNrOiBmdW5jdGlvbigpe30sXG4gICAgICAgIGFjdGl2YXRlOiBmdW5jdGlvbigpe30sXG4gICAgICAgIGRlYWN0aXZhdGU6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgbG9hZDogZnVuY3Rpb24oKXt9LFxuICAgICAgICBhY3RpdmF0ZVN0YXRlOiBmdW5jdGlvbigpe30sXG4gICAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgICAgIHN0YXRlRGVmYXVsdDogJ3ItdGFicy1zdGF0ZS1kZWZhdWx0JyxcbiAgICAgICAgICAgIHN0YXRlQWN0aXZlOiAnci10YWJzLXN0YXRlLWFjdGl2ZScsXG4gICAgICAgICAgICBzdGF0ZURpc2FibGVkOiAnci10YWJzLXN0YXRlLWRpc2FibGVkJyxcbiAgICAgICAgICAgIHN0YXRlRXhjbHVkZWQ6ICdyLXRhYnMtc3RhdGUtZXhjbHVkZWQnLFxuICAgICAgICAgICAgY29udGFpbmVyOiAnci10YWJzJyxcbiAgICAgICAgICAgIHVsOiAnci10YWJzLW5hdicsXG4gICAgICAgICAgICB0YWI6ICdyLXRhYnMtdGFiJyxcbiAgICAgICAgICAgIGFuY2hvcjogJ3ItdGFicy1hbmNob3InLFxuICAgICAgICAgICAgcGFuZWw6ICdyLXRhYnMtcGFuZWwnLFxuICAgICAgICAgICAgYWNjb3JkaW9uVGl0bGU6ICdyLXRhYnMtYWNjb3JkaW9uLXRpdGxlJ1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpdmUgVGFic1xuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gVGhlIEhUTUwgZWxlbWVudCB0aGUgdmFsaWRhdG9yIHNob3VsZCBiZSBib3VuZCB0b1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gQW4gb3B0aW9uIG1hcFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFJlc3BvbnNpdmVUYWJzKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDsgLy8gU2VsZWN0ZWQgRE9NIGVsZW1lbnRcbiAgICAgICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7IC8vIFNlbGVjdGVkIGpRdWVyeSBlbGVtZW50XG5cbiAgICAgICAgdGhpcy50YWJzID0gW107IC8vIENyZWF0ZSB0YWJzIGFycmF5XG4gICAgICAgIHRoaXMuc3RhdGUgPSAnJzsgLy8gRGVmaW5lIHRoZSBwbHVnaW4gc3RhdGUgKHRhYnMvYWNjb3JkaW9uKVxuICAgICAgICB0aGlzLnJvdGF0ZUludGVydmFsID0gMDsgLy8gRGVmaW5lIHJvdGF0ZSBpbnRlcnZhbFxuICAgICAgICB0aGlzLiRxdWV1ZSA9ICQoe30pO1xuXG4gICAgICAgIC8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgd2l0aCB0aGUgcGFzc2VkIG9wdGlvbnNcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGluaXRpYWxpemVzIHRoZSB0YWIgcGx1Z2luXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgLy8gTG9hZCBhbGwgdGhlIGVsZW1lbnRzXG4gICAgICAgIHRoaXMudGFicyA9IHRoaXMuX2xvYWRFbGVtZW50cygpO1xuICAgICAgICB0aGlzLl9sb2FkQ2xhc3NlcygpO1xuICAgICAgICB0aGlzLl9sb2FkRXZlbnRzKCk7XG5cbiAgICAgICAgLy8gV2luZG93IHJlc2l6ZSBiaW5kIHRvIGNoZWNrIHN0YXRlXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgX3RoaXMuX3NldFN0YXRlKGUpO1xuICAgICAgICAgICAgX3RoaXMuX2VxdWFsaXNlSGVpZ2h0cygpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBIYXNoY2hhbmdlIGV2ZW50XG4gICAgICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciB0YWJSZWYgPSBfdGhpcy5fZ2V0VGFiUmVmQnlTZWxlY3Rvcih3aW5kb3cubG9jYXRpb24uaGFzaCk7XG4gICAgICAgICAgICB2YXIgb1RhYiA9IF90aGlzLl9nZXRUYWIodGFiUmVmKTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYSB0YWIgaXMgZm91bmQgdGhhdCBtYXRjaGVzIHRoZSBoYXNoXG4gICAgICAgICAgICBpZih0YWJSZWYgPj0gMCAmJiAhb1RhYi5faWdub3JlSGFzaENoYW5nZSAmJiAhb1RhYi5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIC8vIElmIHNvLCBvcGVuIHRoZSB0YWIgYW5kIGF1dG8gY2xvc2UgdGhlIGN1cnJlbnQgb25lXG4gICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgX3RoaXMuX2dldFRhYih0YWJSZWYpLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU3RhcnQgcm90YXRlIGV2ZW50IGlmIHJvdGF0ZSBvcHRpb24gaXMgZGVmaW5lZFxuICAgICAgICBpZih0aGlzLm9wdGlvbnMucm90YXRlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5zdGFydFJvdGF0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgZmx1aWQgaGVpZ2h0XG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5mbHVpZEhlaWdodCAhPT0gdHJ1ZSkgIHtcbiAgICAgICAgICAgIF90aGlzLl9lcXVhbGlzZUhlaWdodHMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIERlZmluZSBwbHVnaW4gZXZlbnRzXG4gICAgICAgIC8vXG5cbiAgICAgICAgLy8gQWN0aXZhdGU6IHRoaXMgZXZlbnQgaXMgY2FsbGVkIHdoZW4gYSB0YWIgaXMgc2VsZWN0ZWRcbiAgICAgICAgdGhpcy4kZWxlbWVudC5iaW5kKCd0YWJzLWNsaWNrJywgZnVuY3Rpb24oZSwgb1RhYikge1xuICAgICAgICAgICAgX3RoaXMub3B0aW9ucy5jbGljay5jYWxsKHRoaXMsIGUsIG9UYWIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBY3RpdmF0ZTogdGhpcyBldmVudCBpcyBjYWxsZWQgd2hlbiBhIHRhYiBpcyBzZWxlY3RlZFxuICAgICAgICB0aGlzLiRlbGVtZW50LmJpbmQoJ3RhYnMtYWN0aXZhdGUnLCBmdW5jdGlvbihlLCBvVGFiKSB7XG4gICAgICAgICAgICBfdGhpcy5vcHRpb25zLmFjdGl2YXRlLmNhbGwodGhpcywgZSwgb1RhYik7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBEZWFjdGl2YXRlOiB0aGlzIGV2ZW50IGlzIGNhbGxlZCB3aGVuIGEgdGFiIGlzIGNsb3NlZFxuICAgICAgICB0aGlzLiRlbGVtZW50LmJpbmQoJ3RhYnMtZGVhY3RpdmF0ZScsIGZ1bmN0aW9uKGUsIG9UYWIpIHtcbiAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuZGVhY3RpdmF0ZS5jYWxsKHRoaXMsIGUsIG9UYWIpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQWN0aXZhdGUgU3RhdGU6IHRoaXMgZXZlbnQgaXMgY2FsbGVkIHdoZW4gdGhlIHBsdWdpbiBzd2l0Y2hlcyBzdGF0ZXNcbiAgICAgICAgdGhpcy4kZWxlbWVudC5iaW5kKCd0YWJzLWFjdGl2YXRlLXN0YXRlJywgZnVuY3Rpb24oZSwgc3RhdGUpIHtcbiAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuYWN0aXZhdGVTdGF0ZS5jYWxsKHRoaXMsIGUsIHN0YXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTG9hZDogdGhpcyBldmVudCBpcyBjYWxsZWQgd2hlbiB0aGUgcGx1Z2luIGhhcyBiZWVuIGxvYWRlZFxuICAgICAgICB0aGlzLiRlbGVtZW50LmJpbmQoJ3RhYnMtbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBzdGFydFRhYjtcblxuICAgICAgICAgICAgX3RoaXMuX3NldFN0YXRlKGUpOyAvLyBTZXQgc3RhdGVcblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBhbmVsIHNob3VsZCBiZSBjb2xsYXBlZCBvbiBsb2FkXG4gICAgICAgICAgICBpZihfdGhpcy5vcHRpb25zLnN0YXJ0Q29sbGFwc2VkICE9PSB0cnVlICYmICEoX3RoaXMub3B0aW9ucy5zdGFydENvbGxhcHNlZCA9PT0gJ2FjY29yZGlvbicgJiYgX3RoaXMuc3RhdGUgPT09ICdhY2NvcmRpb24nKSkge1xuXG4gICAgICAgICAgICAgICAgc3RhcnRUYWIgPSBfdGhpcy5fZ2V0U3RhcnRUYWIoKTtcblxuICAgICAgICAgICAgICAgIC8vIE9wZW4gdGhlIGluaXRpYWwgdGFiXG4gICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgc3RhcnRUYWIpOyAvLyBPcGVuIGZpcnN0IHRhYlxuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICBfdGhpcy5vcHRpb25zLmxvYWQuY2FsbCh0aGlzLCBlLCBzdGFydFRhYik7IC8vIENhbGwgdGhlIGxvYWQgY2FsbGJhY2tcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFRyaWdnZXIgbG9hZGVkIGV2ZW50XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndGFicy1sb2FkJyk7XG4gICAgfTtcblxuICAgIC8vXG4gICAgLy8gUFJJVkFURSBGVU5DVElPTlNcbiAgICAvL1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBsb2FkcyB0aGUgdGFiIGVsZW1lbnRzIGFuZCBzdG9yZXMgdGhlbSBpbiBhbiBhcnJheVxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgdGFiIGVsZW1lbnRzXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9sb2FkRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyICR1bCA9IHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oJ3VsOmZpcnN0Jyk7XG4gICAgICAgIHZhciB0YWJzID0gW107XG4gICAgICAgIHZhciBpZCA9IDA7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBjbGFzc2VzIHRvIHRoZSBiYXNpYyBodG1sIGVsZW1lbnRzXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLmNvbnRhaW5lcik7IC8vIFRhYiBjb250YWluZXJcbiAgICAgICAgJHVsLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy51bCk7IC8vIExpc3QgY29udGFpbmVyXG5cbiAgICAgICAgLy8gR2V0IHRhYiBidXR0b25zIGFuZCBzdG9yZSB0aGVpciBkYXRhIGluIGFuIGFycmF5XG4gICAgICAgICQoJ2xpJywgJHVsKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICR0YWIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIGlzRXhjbHVkZWQgPSAkdGFiLmhhc0NsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZUV4Y2x1ZGVkKTtcbiAgICAgICAgICAgIHZhciAkYW5jaG9yLCAkcGFuZWwsICRhY2NvcmRpb25UYWIsICRhY2NvcmRpb25BbmNob3IsIHBhbmVsU2VsZWN0b3I7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSB0YWIgc2hvdWxkIGJlIGV4Y2x1ZGVkXG4gICAgICAgICAgICBpZighaXNFeGNsdWRlZCkge1xuXG4gICAgICAgICAgICAgICAgJGFuY2hvciA9ICQoJ2EnLCAkdGFiKTtcbiAgICAgICAgICAgICAgICBwYW5lbFNlbGVjdG9yID0gJGFuY2hvci5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICAgICAgJHBhbmVsID0gJChwYW5lbFNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAkYWNjb3JkaW9uVGFiID0gJChfdGhpcy5vcHRpb25zLmFjY29yZGlvblRhYkVsZW1lbnQpLmluc2VydEJlZm9yZSgkcGFuZWwpO1xuICAgICAgICAgICAgICAgICRhY2NvcmRpb25BbmNob3IgPSAkKCc8YT48L2E+JykuYXR0cignaHJlZicsIHBhbmVsU2VsZWN0b3IpLmh0bWwoJGFuY2hvci5odG1sKCkpLmFwcGVuZFRvKCRhY2NvcmRpb25UYWIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG9UYWIgPSB7XG4gICAgICAgICAgICAgICAgICAgIF9pZ25vcmVIYXNoQ2hhbmdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogKCQuaW5BcnJheShpZCwgX3RoaXMub3B0aW9ucy5kaXNhYmxlZCkgIT09IC0xKSxcbiAgICAgICAgICAgICAgICAgICAgdGFiOiAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6ICQoJ2EnLCAkdGFiKSxcbiAgICAgICAgICAgICAgICAgICAgcGFuZWw6ICRwYW5lbCxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6IHBhbmVsU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgICAgIGFjY29yZGlvblRhYjogJGFjY29yZGlvblRhYixcbiAgICAgICAgICAgICAgICAgICAgYWNjb3JkaW9uQW5jaG9yOiAkYWNjb3JkaW9uQW5jaG9yLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIDF1cCB0aGUgSURcbiAgICAgICAgICAgICAgICBpZCsrO1xuICAgICAgICAgICAgICAgIC8vIEFkZCB0byB0YWIgYXJyYXlcbiAgICAgICAgICAgICAgICB0YWJzLnB1c2gob1RhYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGFicztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgY2xhc3NlcyB0byB0aGUgdGFiIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBvcHRpb25zXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9sb2FkQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy50YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0udGFiLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMudGFiKTtcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS5hbmNob3IuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuYW5jaG9yKTtcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS5wYW5lbC5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnBhbmVsKTtcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS5hY2NvcmRpb25UYWIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuYWNjb3JkaW9uVGl0bGUpO1xuICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFjY29yZGlvbkFuY2hvci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5hbmNob3IpO1xuICAgICAgICAgICAgaWYodGhpcy50YWJzW2ldLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJzW2ldLnRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFic1tpXS5hY2NvcmRpb25UYWIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURpc2FibGVkKTtcbiAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBldmVudHMgdG8gdGhlIHRhYiBlbGVtZW50c1xuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fbG9hZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIC8vIERlZmluZSBhY3RpdmF0ZSBldmVudCBvbiBhIHRhYiBlbGVtZW50XG4gICAgICAgIHZhciBmQWN0aXZhdGUgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IF90aGlzLl9nZXRDdXJyZW50VGFiKCk7IC8vIEZldGNoIGN1cnJlbnQgdGFiXG4gICAgICAgICAgICB2YXIgYWN0aXZhdGVkVGFiID0gZS5kYXRhLnRhYjtcblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBUcmlnZ2VyIGNsaWNrIGV2ZW50IGZvciB3aGVuZXZlciBhIHRhYiBpcyBjbGlja2VkL3RvdWNoZWQgZXZlbiBpZiB0aGUgdGFiIGlzIGRpc2FibGVkXG4gICAgICAgICAgICBhY3RpdmF0ZWRUYWIudGFiLnRyaWdnZXIoJ3RhYnMtY2xpY2snLCBhY3RpdmF0ZWRUYWIpO1xuXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhpcyB0YWIgaXNuJ3QgZGlzYWJsZWRcbiAgICAgICAgICAgIGlmKCFhY3RpdmF0ZWRUYWIuZGlzYWJsZWQpIHtcblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGhhc2ggaGFzIHRvIGJlIHNldCBpbiB0aGUgVVJMIGxvY2F0aW9uXG4gICAgICAgICAgICAgICAgaWYoX3RoaXMub3B0aW9ucy5zZXRIYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgaGFzaCB1c2luZyB0aGUgaGlzdG9yeSBhcGkgaWYgYXZhaWxhYmxlIHRvIHRhY2tsZSBDaHJvbWVzIHJlcGFpbnQgYnVnIG9uIGhhc2ggY2hhbmdlXG4gICAgICAgICAgICAgICAgICAgIGlmKGhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBudWxsLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCArIGFjdGl2YXRlZFRhYi5zZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgZmFsbGJhY2sgdG8gdGhlIGhhc2ggdXBkYXRlIGZvciBzaXRlcyB0aGF0IGRvbid0IHN1cHBvcnQgdGhlIGhpc3RvcnkgYXBpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGFjdGl2YXRlZFRhYi5zZWxlY3RvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGUuZGF0YS50YWIuX2lnbm9yZUhhc2hDaGFuZ2UgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGFjdGl2YXRlZCB0YWIgaXNudCB0aGUgY3VycmVudCBvbmUgb3IgaWYgaXRzIGNvbGxhcHNpYmxlLiBJZiBub3QsIGRvIG5vdGhpbmdcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50ICE9PSBhY3RpdmF0ZWRUYWIgfHwgX3RoaXMuX2lzQ29sbGFwaXNibGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgYWN0aXZhdGVkIHRhYiBpcyBlaXRoZXIgYW5vdGhlciB0YWIgb2YgdGhlIGN1cnJlbnQgb25lLiBJZiBpdCdzIHRoZSBjdXJyZW50IHRhYiBpdCBpcyBjb2xsYXBzaWJsZVxuICAgICAgICAgICAgICAgICAgICAvLyBFaXRoZXIgd2F5LCB0aGUgY3VycmVudCB0YWIgY2FuIGJlIGNsb3NlZFxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY2xvc2VUYWIoZSwgY3VycmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGFjdGl2YXRlZCB0YWIgaXNudCB0aGUgY3VycmVudCBvbmUgb3IgaWYgaXQgaXNudCBjb2xsYXBzaWJsZVxuICAgICAgICAgICAgICAgICAgICBpZihjdXJyZW50ICE9PSBhY3RpdmF0ZWRUYWIgfHwgIV90aGlzLl9pc0NvbGxhcGlzYmxlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vcGVuVGFiKGUsIGFjdGl2YXRlZFRhYiwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIExvb3AgdGFic1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy50YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBBZGQgYWN0aXZhdGUgZnVuY3Rpb24gdG8gdGhlIHRhYiBhbmQgYWNjb3JkaW9uIHNlbGVjdGlvbiBlbGVtZW50XG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0uYW5jaG9yLm9uKF90aGlzLm9wdGlvbnMuZXZlbnQsIHt0YWI6IF90aGlzLnRhYnNbaV19LCBmQWN0aXZhdGUpO1xuICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFjY29yZGlvbkFuY2hvci5vbihfdGhpcy5vcHRpb25zLmV2ZW50LCB7dGFiOiBfdGhpcy50YWJzW2ldfSwgZkFjdGl2YXRlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGdldHMgdGhlIHRhYiB0aGF0IHNob3VsZCBiZSBvcGVuZWQgYXQgc3RhcnRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUYWIgb2JqZWN0XG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRTdGFydFRhYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGFiUmVmID0gdGhpcy5fZ2V0VGFiUmVmQnlTZWxlY3Rvcih3aW5kb3cubG9jYXRpb24uaGFzaCk7XG4gICAgICAgIHZhciBzdGFydFRhYjtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGFnZSBoYXMgYSBoYXNoIHNldCB0aGF0IGlzIGxpbmtlZCB0byBhIHRhYlxuICAgICAgICBpZih0YWJSZWYgPj0gMCAmJiAhdGhpcy5fZ2V0VGFiKHRhYlJlZikuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIC8vIElmIHNvLCBzZXQgdGhlIGN1cnJlbnQgdGFiIHRvIHRoZSBsaW5rZWQgdGFiXG4gICAgICAgICAgICBzdGFydFRhYiA9IHRoaXMuX2dldFRhYih0YWJSZWYpO1xuICAgICAgICB9IGVsc2UgaWYodGhpcy5vcHRpb25zLmFjdGl2ZSA+IDAgJiYgIXRoaXMuX2dldFRhYih0aGlzLm9wdGlvbnMuYWN0aXZlKS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgc3RhcnRUYWIgPSB0aGlzLl9nZXRUYWIodGhpcy5vcHRpb25zLmFjdGl2ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiBub3QsIGp1c3QgZ2V0IHRoZSBmaXJzdCBvbmVcbiAgICAgICAgICAgIHN0YXJ0VGFiID0gdGhpcy5fZ2V0VGFiKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YXJ0VGFiO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHNldHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHBsdWdpblxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBUaGUgZXZlbnQgdGhhdCB0cmlnZ2VycyB0aGUgc3RhdGUgY2hhbmdlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9zZXRTdGF0ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICR1bCA9ICQoJ3VsOmZpcnN0JywgdGhpcy4kZWxlbWVudCk7XG4gICAgICAgIHZhciBvbGRTdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHZhciBzdGFydENvbGxhcHNlZElzU3RhdGUgPSAodHlwZW9mIHRoaXMub3B0aW9ucy5zdGFydENvbGxhcHNlZCA9PT0gJ3N0cmluZycpO1xuICAgICAgICB2YXIgc3RhcnRUYWI7XG5cbiAgICAgICAgLy8gVGhlIHN0YXRlIGlzIGJhc2VkIG9uIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSB0YWJzIGxpc3RcbiAgICAgICAgaWYoJHVsLmlzKCc6dmlzaWJsZScpKXtcbiAgICAgICAgICAgIC8vIFRhYiBsaXN0IGlzIHZpc2libGUsIHNvIHRoZSBzdGF0ZSBpcyAndGFicydcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAndGFicyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUYWIgbGlzdCBpcyBpbnZpc2libGUsIHNvIHRoZSBzdGF0ZSBpcyAnYWNjb3JkaW9uJ1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdhY2NvcmRpb24nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIG5ldyBzdGF0ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgb2xkIHN0YXRlXG4gICAgICAgIGlmKHRoaXMuc3RhdGUgIT09IG9sZFN0YXRlKSB7XG4gICAgICAgICAgICAvLyBJZiBzbywgdGhlIHN0YXRlIGFjdGl2YXRlIHRyaWdnZXIgbXVzdCBiZSBjYWxsZWRcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndGFicy1hY3RpdmF0ZS1zdGF0ZScsIHtvbGRTdGF0ZTogb2xkU3RhdGUsIG5ld1N0YXRlOiB0aGlzLnN0YXRlfSk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBzdGF0ZSBzd2l0Y2ggc2hvdWxkIG9wZW4gYSB0YWJcbiAgICAgICAgICAgIGlmKG9sZFN0YXRlICYmIHN0YXJ0Q29sbGFwc2VkSXNTdGF0ZSAmJiB0aGlzLm9wdGlvbnMuc3RhcnRDb2xsYXBzZWQgIT09IHRoaXMuc3RhdGUgJiYgdGhpcy5fZ2V0Q3VycmVudFRhYigpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgaW5pdGlhbCB0YWJcbiAgICAgICAgICAgICAgICBzdGFydFRhYiA9IHRoaXMuX2dldFN0YXJ0VGFiKGUpO1xuICAgICAgICAgICAgICAgIC8vIE9wZW4gdGhlIGluaXRpYWwgdGFiXG4gICAgICAgICAgICAgICAgdGhpcy5fb3BlblRhYihlLCBzdGFydFRhYik7IC8vIE9wZW4gZmlyc3QgdGFiXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBvcGVucyBhIHRhYlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBUaGUgZXZlbnQgdGhhdCB0cmlnZ2VycyB0aGUgdGFiIG9wZW5pbmdcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1RhYiAtIFRoZSB0YWIgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIG9wZW5lZFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gY2xvc2VDdXJyZW50IC0gRGVmaW5lcyBpZiB0aGUgY3VycmVudCB0YWIgc2hvdWxkIGJlIGNsb3NlZFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gc3RvcFJvdGF0aW9uIC0gRGVmaW5lcyBpZiB0aGUgdGFiIHJvdGF0aW9uIGxvb3Agc2hvdWxkIGJlIHN0b3BwZWRcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX29wZW5UYWIgPSBmdW5jdGlvbihlLCBvVGFiLCBjbG9zZUN1cnJlbnQsIHN0b3BSb3RhdGlvbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgc2Nyb2xsT2Zmc2V0O1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBjdXJyZW50IHRhYiBoYXMgdG8gYmUgY2xvc2VkXG4gICAgICAgIGlmKGNsb3NlQ3VycmVudCkge1xuICAgICAgICAgICAgdGhpcy5fY2xvc2VUYWIoZSwgdGhpcy5fZ2V0Q3VycmVudFRhYigpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSByb3RhdGlvbiBoYXMgdG8gYmUgc3RvcHBlZCB3aGVuIGFjdGl2YXRlZFxuICAgICAgICBpZihzdG9wUm90YXRpb24gJiYgdGhpcy5yb3RhdGVJbnRlcnZhbCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcFJvdGF0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhpcyB0YWIgdG8gYWN0aXZlXG4gICAgICAgIG9UYWIuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgLy8gU2V0IGFjdGl2ZSBjbGFzc2VzIHRvIHRoZSB0YWIgYnV0dG9uIGFuZCBhY2NvcmRpb24gdGFiIGJ1dHRvblxuICAgICAgICBvVGFiLnRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpO1xuICAgICAgICBvVGFiLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpO1xuXG4gICAgICAgIC8vIFJ1biBwYW5lbCB0cmFuc2l0b25cbiAgICAgICAgX3RoaXMuX2RvVHJhbnNpdGlvbihvVGFiLnBhbmVsLCBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbiwgJ29wZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzY3JvbGxPbkxvYWQgPSAoZS50eXBlICE9PSAndGFicy1sb2FkJyB8fCBfdGhpcy5vcHRpb25zLnNjcm9sbFRvQWNjb3JkaW9uT25Mb2FkKTtcblxuICAgICAgICAgICAgLy8gV2hlbiBmaW5pc2hlZCwgc2V0IGFjdGl2ZSBjbGFzcyB0byB0aGUgcGFuZWxcbiAgICAgICAgICAgIG9UYWIucGFuZWwucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKTtcblxuICAgICAgICAgICAgLy8gQW5kIGlmIGVuYWJsZWQgYW5kIHN0YXRlIGlzIGFjY29yZGlvbiwgc2Nyb2xsIHRvIHRoZSBhY2NvcmRpb24gdGFiXG4gICAgICAgICAgICBpZihfdGhpcy5nZXRTdGF0ZSgpID09PSAnYWNjb3JkaW9uJyAmJiBfdGhpcy5vcHRpb25zLnNjcm9sbFRvQWNjb3JkaW9uICYmICghX3RoaXMuX2lzSW5WaWV3KG9UYWIuYWNjb3JkaW9uVGFiKSB8fCBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbiAhPT0gJ2RlZmF1bHQnKSAmJiBzY3JvbGxPbkxvYWQpIHtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgZWxlbWVudCdzIGhlaWdodCB0byBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgICAgICAgICBzY3JvbGxPZmZzZXQgPSBvVGFiLmFjY29yZGlvblRhYi5vZmZzZXQoKS50b3AgLSBfdGhpcy5vcHRpb25zLnNjcm9sbFRvQWNjb3JkaW9uT2Zmc2V0O1xuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGFuaW1hdGlvbiBvcHRpb24gaXMgZW5hYmxlZCwgYW5kIGlmIHRoZSBkdXJhdGlvbiBpc24ndCAwXG4gICAgICAgICAgICAgICAgaWYoX3RoaXMub3B0aW9ucy5hbmltYXRpb24gIT09ICdkZWZhdWx0JyAmJiBfdGhpcy5vcHRpb25zLmR1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBzbywgc2V0IHNjcm9sbFRvcCB3aXRoIGFuaW1hdGUgYW5kIHVzZSB0aGUgJ2FuaW1hdGlvbicgZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBzY3JvbGxPZmZzZXRcbiAgICAgICAgICAgICAgICAgICAgfSwgX3RoaXMub3B0aW9ucy5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gIElmIG5vdCwganVzdCBzZXQgc2Nyb2xsVG9wXG4gICAgICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndGFicy1hY3RpdmF0ZScsIG9UYWIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGNsb3NlcyBhIHRhYlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBUaGUgZXZlbnQgdGhhdCBpcyB0cmlnZ2VyZWQgd2hlbiBhIHRhYiBpcyBjbG9zZWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1RhYiAtIFRoZSB0YWIgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIGNsb3NlZFxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fY2xvc2VUYWIgPSBmdW5jdGlvbihlLCBvVGFiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBkb1F1ZXVlT25TdGF0ZSA9IHR5cGVvZiBfdGhpcy5vcHRpb25zLmFuaW1hdGlvblF1ZXVlID09PSAnc3RyaW5nJztcbiAgICAgICAgdmFyIGRvUXVldWU7XG5cbiAgICAgICAgaWYob1RhYiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZihkb1F1ZXVlT25TdGF0ZSAmJiBfdGhpcy5nZXRTdGF0ZSgpID09PSBfdGhpcy5vcHRpb25zLmFuaW1hdGlvblF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgZG9RdWV1ZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9RdWV1ZU9uU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBkb1F1ZXVlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvUXVldWUgPSBfdGhpcy5vcHRpb25zLmFuaW1hdGlvblF1ZXVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEZWFjdGl2YXRlIHRhYlxuICAgICAgICAgICAgb1RhYi5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIFNldCBkZWZhdWx0IGNsYXNzIHRvIHRoZSB0YWIgYnV0dG9uXG4gICAgICAgICAgICBvVGFiLnRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpO1xuXG4gICAgICAgICAgICAvLyBSdW4gcGFuZWwgdHJhbnNpdGlvblxuICAgICAgICAgICAgX3RoaXMuX2RvVHJhbnNpdGlvbihvVGFiLnBhbmVsLCBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbiwgJ2Nsb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0IGRlZmF1bHQgY2xhc3MgdG8gdGhlIGFjY29yZGlvbiB0YWIgYnV0dG9uIGFuZCB0YWIgcGFuZWxcbiAgICAgICAgICAgICAgICBvVGFiLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpO1xuICAgICAgICAgICAgICAgIG9UYWIucGFuZWwucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KTtcbiAgICAgICAgICAgIH0sICFkb1F1ZXVlKTtcblxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCd0YWJzLWRlYWN0aXZhdGUnLCBvVGFiKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJ1bnMgYW4gZWZmZWN0IG9uIGEgcGFuZWxcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IHBhbmVsIC0gVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgdGFiIHBhbmVsXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZCAtIFRoZSB0cmFuc2l0aW9uIG1ldGhvZCByZWZlcmVuY2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RhdGUgLSBUaGUgc3RhdGUgKG9wZW4vY2xvc2VkKSB0aGF0IHRoZSBwYW5lbCBzaG91bGQgdHJhbnNpdGlvbiB0b1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIGFmdGVyIHRoZSB0cmFuc2l0aW9uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBkZXF1ZXVlIC0gRGVmaW5lcyBpZiB0aGUgZXZlbnQgcXVldWUgc2hvdWxkIGJlIGRlcXVldWVkIGFmdGVyIHRoZSB0cmFuc2l0aW9uXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9kb1RyYW5zaXRpb24gPSBmdW5jdGlvbihwYW5lbCwgbWV0aG9kLCBzdGF0ZSwgY2FsbGJhY2ssIGRlcXVldWUpIHtcbiAgICAgICAgdmFyIGVmZmVjdDtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBHZXQgZWZmZWN0IGJhc2VkIG9uIG1ldGhvZFxuICAgICAgICBzd2l0Y2gobWV0aG9kKSB7XG4gICAgICAgICAgICBjYXNlICdzbGlkZSc6XG4gICAgICAgICAgICAgICAgZWZmZWN0ID0gKHN0YXRlID09PSAnb3BlbicpID8gJ3NsaWRlRG93bicgOiAnc2xpZGVVcCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmYWRlJzpcbiAgICAgICAgICAgICAgICBlZmZlY3QgPSAoc3RhdGUgPT09ICdvcGVuJykgPyAnZmFkZUluJyA6ICdmYWRlT3V0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZWZmZWN0ID0gKHN0YXRlID09PSAnb3BlbicpID8gJ3Nob3cnIDogJ2hpZGUnO1xuICAgICAgICAgICAgICAgIC8vIFdoZW4gZGVmYXVsdCBpcyB1c2VkLCBzZXQgdGhlIGR1cmF0aW9uIHRvIDBcbiAgICAgICAgICAgICAgICBfdGhpcy5vcHRpb25zLmR1cmF0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0aGUgdHJhbnNpdGlvbiB0byBhIGN1c3RvbSBxdWV1ZVxuICAgICAgICB0aGlzLiRxdWV1ZS5xdWV1ZSgncmVzcG9uc2l2ZS10YWJzJyxmdW5jdGlvbihuZXh0KXtcbiAgICAgICAgICAgIC8vIFJ1biB0aGUgdHJhbnNpdGlvbiBvbiB0aGUgcGFuZWxcbiAgICAgICAgICAgIHBhbmVsW2VmZmVjdF0oe1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBfdGhpcy5vcHRpb25zLmR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChwYW5lbCwgbWV0aG9kLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biB0aGUgbmV4dCBmdW5jdGlvbiBpbiB0aGUgcXVldWVcbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXaGVuIHRoZSBwYW5lbCBpcyBvcGVuZW5kLCBkZXF1ZXVlIGV2ZXJ5dGhpbmcgc28gdGhlIGFuaW1hdGlvbiBzdGFydHNcbiAgICAgICAgaWYoc3RhdGUgPT09ICdvcGVuJyB8fCBkZXF1ZXVlKSB7XG4gICAgICAgICAgICB0aGlzLiRxdWV1ZS5kZXF1ZXVlKCdyZXNwb25zaXZlLXRhYnMnKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgY29sbGFwc2liaWxpdHkgb2YgdGhlIHRhYiBpbiB0aGlzIHN0YXRlXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IFRoZSBjb2xsYXBzaWJpbGl0eSBvZiB0aGUgdGFiXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9pc0NvbGxhcGlzYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAodHlwZW9mIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSA9PT0gJ2Jvb2xlYW4nICYmIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSkgfHwgKHR5cGVvZiB0aGlzLm9wdGlvbnMuY29sbGFwc2libGUgPT09ICdzdHJpbmcnICYmIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSA9PT0gdGhpcy5nZXRTdGF0ZSgpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgdGFiIGJ5IG51bWVyaWMgcmVmZXJlbmNlXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBudW1SZWYgLSBOdW1lcmljIHRhYiByZWZlcmVuY2VcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUYWIgb2JqZWN0XG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRUYWIgPSBmdW5jdGlvbihudW1SZWYpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFic1tudW1SZWZdO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIG51bWVyaWMgdGFiIHJlZmVyZW5jZSBiYXNlZCBvbiBhIGhhc2ggc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBIYXNoIHNlbGVjdG9yXG4gICAgICogQHJldHVybnMge0ludGVnZXJ9IE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0VGFiUmVmQnlTZWxlY3RvciA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICAgIC8vIExvb3AgYWxsIHRhYnNcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGhhc2ggc2VsZWN0b3IgaXMgZXF1YWwgdG8gdGhlIHRhYiBzZWxlY3RvclxuICAgICAgICAgICAgaWYodGhpcy50YWJzW2ldLnNlbGVjdG9yID09PSBzZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIG5vbmUgaXMgZm91bmQgcmV0dXJuIGEgbmVnYXRpdmUgaW5kZXhcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGN1cnJlbnQgdGFiIGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBDdXJyZW50IHRhYiBlbGVtZW50XG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRDdXJyZW50VGFiID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRUYWIodGhpcy5fZ2V0Q3VycmVudFRhYlJlZigpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBuZXh0IHRhYidzIG51bWVyaWMgcmVmZXJlbmNlXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBjdXJyZW50VGFiUmVmIC0gQ3VycmVudCBudW1lcmljIHRhYiByZWZlcmVuY2VcbiAgICAgKiBAcmV0dXJucyB7SW50ZWdlcn0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXROZXh0VGFiUmVmID0gZnVuY3Rpb24oY3VycmVudFRhYlJlZikge1xuICAgICAgICB2YXIgdGFiUmVmID0gKGN1cnJlbnRUYWJSZWYgfHwgdGhpcy5fZ2V0Q3VycmVudFRhYlJlZigpKTtcbiAgICAgICAgdmFyIG5leHRUYWJSZWYgPSAodGFiUmVmID09PSB0aGlzLnRhYnMubGVuZ3RoIC0gMSkgPyAwIDogdGFiUmVmICsgMTtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9nZXRUYWIobmV4dFRhYlJlZikuZGlzYWJsZWQpID8gdGhpcy5fZ2V0TmV4dFRhYlJlZihuZXh0VGFiUmVmKSA6IG5leHRUYWJSZWY7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcHJldmlvdXMgdGFiJ3MgbnVtZXJpYyByZWZlcmVuY2VcbiAgICAgKiBAcmV0dXJucyB7SW50ZWdlcn0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRQcmV2aW91c1RhYlJlZiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSA9PT0gMCkgPyB0aGlzLnRhYnMubGVuZ3RoIC0gMSA6IHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSAtIDE7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgY3VycmVudCB0YWIncyBudW1lcmljIHJlZmVyZW5jZVxuICAgICAqIEByZXR1cm5zIHtJbnRlZ2VyfSBOdW1lcmljIHRhYiByZWZlcmVuY2VcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldEN1cnJlbnRUYWJSZWYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gTG9vcCBhbGwgdGFic1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy50YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIHRhYiBpcyBhY3RpdmUsIHJldHVybiBpdFxuICAgICAgICAgICAgaWYodGhpcy50YWJzW2ldLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE5vIHRhYnMgaGF2ZSBiZWVuIGZvdW5kLCByZXR1cm4gbmVnYXRpdmUgaW5kZXhcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGdldHMgdGhlIHRhbGxlc3QgdGFiIGFuZCBhcHBsaWVkIHRoZSBoZWlnaHQgdG8gYWxsIHRhYnNcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2VxdWFsaXNlSGVpZ2h0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWF4SGVpZ2h0ID0gMDtcblxuICAgICAgICAkLmVhY2goJC5tYXAodGhpcy50YWJzLCBmdW5jdGlvbih0YWIpIHtcbiAgICAgICAgICAgIG1heEhlaWdodCA9IE1hdGgubWF4KG1heEhlaWdodCwgdGFiLnBhbmVsLmNzcygnbWluSGVpZ2h0JywgJycpLmhlaWdodCgpKTtcbiAgICAgICAgICAgIHJldHVybiB0YWIucGFuZWw7XG4gICAgICAgIH0pLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuY3NzKCdtaW5IZWlnaHQnLCBtYXhIZWlnaHQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy9cbiAgICAvLyBIRUxQRVIgRlVOQ1RJT05TXG4gICAgLy9cblxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5faXNJblZpZXcgPSBmdW5jdGlvbigkZWxlbWVudCkge1xuICAgICAgICB2YXIgZG9jVmlld1RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgIGRvY1ZpZXdCb3R0b20gPSBkb2NWaWV3VG9wICsgJCh3aW5kb3cpLmhlaWdodCgpLFxuICAgICAgICAgICAgZWxlbVRvcCA9ICRlbGVtZW50Lm9mZnNldCgpLnRvcCxcbiAgICAgICAgICAgIGVsZW1Cb3R0b20gPSBlbGVtVG9wICsgJGVsZW1lbnQuaGVpZ2h0KCk7XG4gICAgICAgIHJldHVybiAoKGVsZW1Cb3R0b20gPD0gZG9jVmlld0JvdHRvbSkgJiYgKGVsZW1Ub3AgPj0gZG9jVmlld1RvcCkpO1xuICAgIH07XG5cbiAgICAvL1xuICAgIC8vIFBVQkxJQyBGVU5DVElPTlNcbiAgICAvL1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBhY3RpdmF0ZXMgYSB0YWJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gc3RvcFJvdGF0aW9uIC0gRGVmaW5lcyBpZiB0aGUgdGFiIHJvdGF0aW9uIHNob3VsZCBzdG9wIGFmdGVyIGFjdGl2YXRpb25cbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbih0YWJSZWYsIHN0b3BSb3RhdGlvbikge1xuICAgICAgICB2YXIgZSA9IGpRdWVyeS5FdmVudCgndGFicy1hY3RpdmF0ZScpO1xuICAgICAgICB2YXIgb1RhYiA9IHRoaXMuX2dldFRhYih0YWJSZWYpO1xuICAgICAgICBpZighb1RhYi5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5fb3BlblRhYihlLCBvVGFiLCB0cnVlLCBzdG9wUm90YXRpb24gfHwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBkZWFjdGl2YXRlcyBhIHRhYlxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gdGFiUmVmIC0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbih0YWJSZWYpIHtcbiAgICAgICAgdmFyIGUgPSBqUXVlcnkuRXZlbnQoJ3RhYnMtZGVjdGl2YXRlJyk7XG4gICAgICAgIHZhciBvVGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XG4gICAgICAgIGlmKCFvVGFiLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9jbG9zZVRhYihlLCBvVGFiKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGVuYWJsZXMgYSB0YWJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbih0YWJSZWYpIHtcbiAgICAgICAgdmFyIG9UYWIgPSB0aGlzLl9nZXRUYWIodGFiUmVmKTtcbiAgICAgICAgaWYob1RhYil7XG4gICAgICAgICAgICBvVGFiLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICBvVGFiLnRhYi5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xuICAgICAgICAgICAgb1RhYi5hY2NvcmRpb25UYWIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURpc2FibGVkKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGRpc2FibGUgYSB0YWJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24odGFiUmVmKSB7XG4gICAgICAgIHZhciBvVGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XG4gICAgICAgIGlmKG9UYWIpe1xuICAgICAgICAgICAgb1RhYi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBvVGFiLnRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xuICAgICAgICAgICAgb1RhYi5hY2NvcmRpb25UYWIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURpc2FibGVkKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGdldHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHBsdWdpblxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFN0YXRlIG9mIHRoZSBwbHVnaW5cbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gc3RhcnRzIHRoZSByb3RhdGlvbiBvZiB0aGUgdGFic1xuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gc3BlZWQgLSBUaGUgc3BlZWQgb2YgdGhlIHJvdGF0aW9uXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLnN0YXJ0Um90YXRpb24gPSBmdW5jdGlvbihzcGVlZCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyBNYWtlIHN1cmUgbm90IGFsbCB0YWJzIGFyZSBkaXNhYmxlZFxuICAgICAgICBpZih0aGlzLnRhYnMubGVuZ3RoID4gdGhpcy5vcHRpb25zLmRpc2FibGVkLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5yb3RhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSBqUXVlcnkuRXZlbnQoJ3JvdGF0ZScpO1xuICAgICAgICAgICAgICAgIF90aGlzLl9vcGVuVGFiKGUsIF90aGlzLl9nZXRUYWIoX3RoaXMuX2dldE5leHRUYWJSZWYoKSksIHRydWUpO1xuICAgICAgICAgICAgfSwgc3BlZWQgfHwgKCgkLmlzTnVtZXJpYyhfdGhpcy5vcHRpb25zLnJvdGF0ZSkpID8gX3RoaXMub3B0aW9ucy5yb3RhdGUgOiA0MDAwKSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUm90YXRpb24gaXMgbm90IHBvc3NpYmxlIGlmIGFsbCB0YWJzIGFyZSBkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHN0b3BzIHRoZSByb3RhdGlvbiBvZiB0aGUgdGFic1xuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5zdG9wUm90YXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yb3RhdGVJbnRlcnZhbCk7XG4gICAgICAgIHRoaXMucm90YXRlSW50ZXJ2YWwgPSAwO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGNhbiBiZSB1c2VkIHRvIGdldC9zZXQgb3B0aW9uc1xuICAgICAqIEByZXR1cm4ge2FueX0gT3B0aW9uIHZhbHVlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLm9wdGlvbiA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc1trZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc1trZXldO1xuICAgIH07XG5cbiAgICAvKiogalF1ZXJ5IHdyYXBwZXIgKi9cbiAgICAkLmZuLnJlc3BvbnNpdmVUYWJzID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgdmFyIGluc3RhbmNlO1xuXG4gICAgICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQuZGF0YSh0aGlzLCAncmVzcG9uc2l2ZXRhYnMnKSkge1xuICAgICAgICAgICAgICAgICAgICAkLmRhdGEodGhpcywgJ3Jlc3BvbnNpdmV0YWJzJywgbmV3IFJlc3BvbnNpdmVUYWJzKCB0aGlzLCBvcHRpb25zICkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyAmJiBvcHRpb25zWzBdICE9PSAnXycgJiYgb3B0aW9ucyAhPT0gJ2luaXQnKSB7XG4gICAgICAgICAgICBpbnN0YW5jZSA9ICQuZGF0YSh0aGlzWzBdLCAncmVzcG9uc2l2ZXRhYnMnKTtcblxuICAgICAgICAgICAgLy8gQWxsb3cgaW5zdGFuY2VzIHRvIGJlIGRlc3Ryb3llZCB2aWEgdGhlICdkZXN0cm95JyBtZXRob2RcbiAgICAgICAgICAgIGlmIChvcHRpb25zID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBkZXN0cm95IGluc3RhbmNlIGNsYXNzZXMsIGV0Y1xuICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAncmVzcG9uc2l2ZXRhYnMnLCBudWxsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUmVzcG9uc2l2ZVRhYnMgJiYgdHlwZW9mIGluc3RhbmNlW29wdGlvbnNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlW29wdGlvbnNdLmFwcGx5KCBpbnN0YW5jZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3MsIDEgKSApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbn0oalF1ZXJ5LCB3aW5kb3cpKTtcbiIsIi8qKlxuICogQGZpbGVcbiAqIEluaXRpYWxpemUgUmVzcG9uc2l2ZSBUYWJzIHNjcmlwdHMuXG4gKi9cblxuaW1wb3J0ICdyZXNwb25zaXZlLXRhYnMnXG5cbigkID0+IHtcblxuXHQkKCcuci10YWJzLWNvbnRhaW5lcicpLnJlc3BvbnNpdmVUYWJzKHtcblx0ICBzdGFydENvbGxhcHNlZDogZmFsc2UsXG5cdCAgYW5pbWF0aW9uOiAnc2xpZGUnLFxuXHQgIGR1cmF0aW9uOiAyMDBcblx0fSlcblxufSkoalF1ZXJ5KSJdLCJuYW1lcyI6WyJ0aGlzIl0sIm1hcHBpbmdzIjoiOzs7QUFBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLEdBQUc7OztJQUdoQyxJQUFJLFFBQVEsR0FBRztRQUNYLE1BQU0sRUFBRSxJQUFJO1FBQ1osS0FBSyxFQUFFLE9BQU87UUFDZCxRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxXQUFXO1FBQ3hCLGNBQWMsRUFBRSxLQUFLO1FBQ3JCLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLEtBQUs7UUFDZCxTQUFTLEVBQUUsU0FBUztRQUNwQixjQUFjLEVBQUUsS0FBSztRQUNyQixRQUFRLEVBQUUsR0FBRztRQUNiLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLGlCQUFp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