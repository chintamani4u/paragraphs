(function (exports) {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var rellax = createCommonjsModule(function (module) {
// ------------------------------------------
// Rellax.js - v0.2
// Buttery smooth parallax library
// Copyright (c) 2016 Moe Amaya (@moeamaya)
// MIT license
//
// Thanks to Paraxify.js and Jaime Cabllero
// for parallax concepts 
// ------------------------------------------

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Rellax = factory();
  }
}(commonjsGlobal, function () {
  var Rellax = function(el, options){ 
    "use strict";

    var self = Object.create(Rellax.prototype);

    // Rellax stays lightweight by limiting usage to desktops/laptops
    if (typeof window.orientation !== 'undefined') { return; }

    var posY = 0; // set it to -1 so the animate function gets called at least once
    var screenY = 0;
    var blocks = [];
    
    // check what requestAnimationFrame to use, and if
    // it's not supported, use the onscroll event
    var loop = window.requestAnimationFrame ||
    	window.webkitRequestAnimationFrame ||
    	window.mozRequestAnimationFrame ||
    	window.msRequestAnimationFrame ||
    	window.oRequestAnimationFrame ||
    	function(callback){ setTimeout(callback, 1000 / 60); };

    // Default Settings
    self.options = {
      speed: -2
    };

    // User defined options (might have more in the future)
    if (options){
      Object.keys(options).forEach(function(key){
        self.options[key] = options[key];
      });
    }

    // If some clown tries to crank speed, limit them to +-10
    if (self.options.speed < -10) {
      self.options.speed = -10;
    } else if (self.options.speed > 10) {
      self.options.speed = 10;
    }

    // By default, rellax class
    if (!el) {
      el = '.rellax';
    }

    // Classes
    if (document.getElementsByClassName(el.replace('.',''))){
      self.elems = document.getElementsByClassName(el.replace('.',''));
    }

    // Now query selector
    else if (document.querySelector(el) !== false) {
      self.elems = querySelector(el);
    }

    // The elements don't exist
    else {
      throw new Error("The elements you're trying to select don't exist.");
    }


    // Let's kick this script off
    // Build array for cached element values
    // Bind scroll and resize to animate method
    var init = function() {
      screenY = window.innerHeight;
      setPosition();

      // Get and cache initial position of all elements
      for (var i = 0; i < self.elems.length; i++){
        var block = createBlock(self.elems[i]);
        blocks.push(block);
      }
			
			window.addEventListener('resize', function(){
			  animate();
			});
			
			// Start the loop
      update();
      
      // The loop does nothing if the scrollPosition did not change
      // so call animate to make sure every element has their transforms
      animate();
    };


    // We want to cache the parallax blocks'
    // values: base, top, height, speed
    // el: is dom object, return: el cache values
    var createBlock = function(el) {

      // initializing at scrollY = 0 (top of browser)
      // ensures elements are positioned based on HTML layout
      var posY = 0;

      var blockTop = posY + el.getBoundingClientRect().top;
      var blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

      // apparently parallax equation everyone uses
      var percentage = (posY - blockTop + screenY) / (blockHeight + screenY);

      // Optional individual block speed as data attr, otherwise global speed
      var speed = el.dataset.rellaxSpeed ? el.dataset.rellaxSpeed : self.options.speed;
      var base = updatePosition(percentage, speed);

      // Store non-translate3d transforms
      var cssTransform = el.style.cssText.slice(11);

      return {
        base: base,
        top: blockTop,
        height: blockHeight,
        speed: speed,
        style: cssTransform
      };
    };


    // set scroll position (posY)
    // side effect method is not ideal, but okay for now
    // returns true if the scroll changed, false if nothing happened
    var setPosition = function() {
    	var oldY = posY;
    	
      if (window.pageYOffset !== undefined) {
        posY = window.pageYOffset;
      } else {
        posY = (document.documentElement || document.body.parentNode || document.body).scrollTop;
      }
      
      if (oldY != posY) {
      	// scroll changed, return true
      	return true;
      }
      
      // scroll did not change
      return false;
    };


    // Ahh a pure function, gets new transform value
    // based on scrollPostion and speed
    var updatePosition = function(percentage, speed) {
      var value = (speed * (100 * (1 - percentage)));
      return Math.round(value);
    };


    //
		var update = function() {
			if (setPosition()) {
				animate();
	    }
	    
	    // loop again
	    loop(update);
		};
		
    // Transform3d on parallax element
    var animate = function() {
    	for (var i = 0; i < self.elems.length; i++){
        var percentage = ((posY - blocks[i].top + screenY) / (blocks[i].height + screenY));

        // Subtracting initialize value, so element stays in same spot as HTML
        var position = updatePosition(percentage, blocks[i].speed) - blocks[i].base;

        // Move that element
        var translate = 'translate3d(0,' + position + 'px' + ',0)' + blocks[i].style;
        self.elems[i].style.cssText = '-webkit-transform:'+translate+';-moz-transform:'+translate+';transform:'+translate+';';
      }
    };


    init();
    Object.freeze();
    return self;
  };
  return Rellax;
}));
});

/**
 * @file
 * Initialize parallaxes with Rellax lib.
 *
 * @see  https://github.com/dixonandmoe/rellax
 */

(function () {
	var rellax$$1 = new rellax('.parallax');
})();

}((this.LaravelElixirBundle = this.LaravelElixirBundle || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi92YXIvd3d3L3BhcmFncmFwaHMubG9jYWwvd2ViL3RoZW1lcy90aWV0b19hZG1pbi9ub2RlX21vZHVsZXMvcmVsbGF4L3JlbGxheC5qcyIsIi92YXIvd3d3L3BhcmFncmFwaHMubG9jYWwvd2ViL3RoZW1lcy90aWV0b19hZG1pbi9zcmMvc2NyaXB0cy9wYXJhbGxheC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmVsbGF4LmpzIC0gdjAuMlxuLy8gQnV0dGVyeSBzbW9vdGggcGFyYWxsYXggbGlicmFyeVxuLy8gQ29weXJpZ2h0IChjKSAyMDE2IE1vZSBBbWF5YSAoQG1vZWFtYXlhKVxuLy8gTUlUIGxpY2Vuc2Vcbi8vXG4vLyBUaGFua3MgdG8gUGFyYXhpZnkuanMgYW5kIEphaW1lIENhYmxsZXJvXG4vLyBmb3IgcGFyYWxsYXggY29uY2VwdHMgXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAgICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgICAgIC8vIGxpa2UgTm9kZS5cbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgICAgcm9vdC5SZWxsYXggPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICB2YXIgUmVsbGF4ID0gZnVuY3Rpb24oZWwsIG9wdGlvbnMpeyBcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBzZWxmID0gT2JqZWN0LmNyZWF0ZShSZWxsYXgucHJvdG90eXBlKTtcblxuICAgIC8vIFJlbGxheCBzdGF5cyBsaWdodHdlaWdodCBieSBsaW1pdGluZyB1c2FnZSB0byBkZXNrdG9wcy9sYXB0b3BzXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cub3JpZW50YXRpb24gIT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIHBvc1kgPSAwOyAvLyBzZXQgaXQgdG8gLTEgc28gdGhlIGFuaW1hdGUgZnVuY3Rpb24gZ2V0cyBjYWxsZWQgYXQgbGVhc3Qgb25jZVxuICAgIHZhciBzY3JlZW5ZID0gMDtcbiAgICB2YXIgYmxvY2tzID0gW107XG4gICAgXG4gICAgLy8gY2hlY2sgd2hhdCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgdG8gdXNlLCBhbmQgaWZcbiAgICAvLyBpdCdzIG5vdCBzdXBwb3J0ZWQsIHVzZSB0aGUgb25zY3JvbGwgZXZlbnRcbiAgICB2YXIgbG9vcCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBcdHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBcdHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIFx0d2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBcdGZ1bmN0aW9uKGNhbGxiYWNrKXsgc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTsgfTtcblxuICAgIC8vIERlZmF1bHQgU2V0dGluZ3NcbiAgICBzZWxmLm9wdGlvbnMgPSB7XG4gICAgICBzcGVlZDogLTJcbiAgICB9O1xuXG4gICAgLy8gVXNlciBkZWZpbmVkIG9wdGlvbnMgKG1pZ2h0IGhhdmUgbW9yZSBpbiB0aGUgZnV0dXJlKVxuICAgIGlmIChvcHRpb25zKXtcbiAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgc2VsZi5vcHRpb25zW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBJZiBzb21lIGNsb3duIHRyaWVzIHRvIGNyYW5rIHNwZWVkLCBsaW1pdCB0aGVtIHRvICstMTBcbiAgICBpZiAoc2VsZi5vcHRpb25zLnNwZWVkIDwgLTEwKSB7XG4gICAgICBzZWxmLm9wdGlvbnMuc3BlZWQgPSAtMTA7XG4gICAgfSBlbHNlIGlmIChzZWxmLm9wdGlvbnMuc3BlZWQgPiAxMCkge1xuICAgICAgc2VsZi5vcHRpb25zLnNwZWVkID0gMTA7XG4gICAgfVxuXG4gICAgLy8gQnkgZGVmYXVsdCwgcmVsbGF4IGNsYXNzXG4gICAgaWYgKCFlbCkge1xuICAgICAgZWwgPSAnLnJlbGxheCc7XG4gICAgfVxuXG4gICAgLy8gQ2xhc3Nlc1xuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGVsLnJlcGxhY2UoJy4nLCcnKSkpe1xuICAgICAgc2VsZi5lbGVtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoZWwucmVwbGFjZSgnLicsJycpKTtcbiAgICB9XG5cbiAgICAvLyBOb3cgcXVlcnkgc2VsZWN0b3JcbiAgICBlbHNlIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKSAhPT0gZmFsc2UpIHtcbiAgICAgIHNlbGYuZWxlbXMgPSBxdWVyeVNlbGVjdG9yKGVsKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgZWxlbWVudHMgZG9uJ3QgZXhpc3RcbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBlbGVtZW50cyB5b3UncmUgdHJ5aW5nIHRvIHNlbGVjdCBkb24ndCBleGlzdC5cIik7XG4gICAgfVxuXG5cbiAgICAvLyBMZXQncyBraWNrIHRoaXMgc2NyaXB0IG9mZlxuICAgIC8vIEJ1aWxkIGFycmF5IGZvciBjYWNoZWQgZWxlbWVudCB2YWx1ZXNcbiAgICAvLyBCaW5kIHNjcm9sbCBhbmQgcmVzaXplIHRvIGFuaW1hdGUgbWV0aG9kXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNjcmVlblkgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICBzZXRQb3NpdGlvbigpO1xuXG4gICAgICAvLyBHZXQgYW5kIGNhY2hlIGluaXRpYWwgcG9zaXRpb24gb2YgYWxsIGVsZW1lbnRzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuZWxlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgYmxvY2sgPSBjcmVhdGVCbG9jayhzZWxmLmVsZW1zW2ldKTtcbiAgICAgICAgYmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgfVxuXHRcdFx0XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKXtcblx0XHRcdCAgYW5pbWF0ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdC8vIFN0YXJ0IHRoZSBsb29wXG4gICAgICB1cGRhdGUoKTtcbiAgICAgIFxuICAgICAgLy8gVGhlIGxvb3AgZG9lcyBub3RoaW5nIGlmIHRoZSBzY3JvbGxQb3NpdGlvbiBkaWQgbm90IGNoYW5nZVxuICAgICAgLy8gc28gY2FsbCBhbmltYXRlIHRvIG1ha2Ugc3VyZSBldmVyeSBlbGVtZW50IGhhcyB0aGVpciB0cmFuc2Zvcm1zXG4gICAgICBhbmltYXRlKCk7XG4gICAgfTtcblxuXG4gICAgLy8gV2Ugd2FudCB0byBjYWNoZSB0aGUgcGFyYWxsYXggYmxvY2tzJ1xuICAgIC8vIHZhbHVlczogYmFzZSwgdG9wLCBoZWlnaHQsIHNwZWVkXG4gICAgLy8gZWw6IGlzIGRvbSBvYmplY3QsIHJldHVybjogZWwgY2FjaGUgdmFsdWVzXG4gICAgdmFyIGNyZWF0ZUJsb2NrID0gZnVuY3Rpb24oZWwpIHtcblxuICAgICAgLy8gaW5pdGlhbGl6aW5nIGF0IHNjcm9sbFkgPSAwICh0b3Agb2YgYnJvd3NlcilcbiAgICAgIC8vIGVuc3VyZXMgZWxlbWVudHMgYXJlIHBvc2l0aW9uZWQgYmFzZWQgb24gSFRNTCBsYXlvdXRcbiAgICAgIHZhciBwb3NZID0gMDtcblxuICAgICAgdmFyIGJsb2NrVG9wID0gcG9zWSArIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgICAgIHZhciBibG9ja0hlaWdodCA9IGVsLmNsaWVudEhlaWdodCB8fCBlbC5vZmZzZXRIZWlnaHQgfHwgZWwuc2Nyb2xsSGVpZ2h0O1xuXG4gICAgICAvLyBhcHBhcmVudGx5IHBhcmFsbGF4IGVxdWF0aW9uIGV2ZXJ5b25lIHVzZXNcbiAgICAgIHZhciBwZXJjZW50YWdlID0gKHBvc1kgLSBibG9ja1RvcCArIHNjcmVlblkpIC8gKGJsb2NrSGVpZ2h0ICsgc2NyZWVuWSk7XG5cbiAgICAgIC8vIE9wdGlvbmFsIGluZGl2aWR1YWwgYmxvY2sgc3BlZWQgYXMgZGF0YSBhdHRyLCBvdGhlcndpc2UgZ2xvYmFsIHNwZWVkXG4gICAgICB2YXIgc3BlZWQgPSBlbC5kYXRhc2V0LnJlbGxheFNwZWVkID8gZWwuZGF0YXNldC5yZWxsYXhTcGVlZCA6IHNlbGYub3B0aW9ucy5zcGVlZDtcbiAgICAgIHZhciBiYXNlID0gdXBkYXRlUG9zaXRpb24ocGVyY2VudGFnZSwgc3BlZWQpO1xuXG4gICAgICAvLyBTdG9yZSBub24tdHJhbnNsYXRlM2QgdHJhbnNmb3Jtc1xuICAgICAgdmFyIGNzc1RyYW5zZm9ybSA9IGVsLnN0eWxlLmNzc1RleHQuc2xpY2UoMTEpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBiYXNlOiBiYXNlLFxuICAgICAgICB0b3A6IGJsb2NrVG9wLFxuICAgICAgICBoZWlnaHQ6IGJsb2NrSGVpZ2h0LFxuICAgICAgICBzcGVlZDogc3BlZWQsXG4gICAgICAgIHN0eWxlOiBjc3NUcmFuc2Zvcm1cbiAgICAgIH07XG4gICAgfTtcblxuXG4gICAgLy8gc2V0IHNjcm9sbCBwb3NpdGlvbiAocG9zWSlcbiAgICAvLyBzaWRlIGVmZmVjdCBtZXRob2QgaXMgbm90IGlkZWFsLCBidXQgb2theSBmb3Igbm93XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmIHRoZSBzY3JvbGwgY2hhbmdlZCwgZmFsc2UgaWYgbm90aGluZyBoYXBwZW5lZFxuICAgIHZhciBzZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIFx0dmFyIG9sZFkgPSBwb3NZO1xuICAgIFx0XG4gICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcG9zWSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvc1kgPSAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZSB8fCBkb2N1bWVudC5ib2R5KS5zY3JvbGxUb3A7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChvbGRZICE9IHBvc1kpIHtcbiAgICAgIFx0Ly8gc2Nyb2xsIGNoYW5nZWQsIHJldHVybiB0cnVlXG4gICAgICBcdHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBzY3JvbGwgZGlkIG5vdCBjaGFuZ2VcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG5cbiAgICAvLyBBaGggYSBwdXJlIGZ1bmN0aW9uLCBnZXRzIG5ldyB0cmFuc2Zvcm0gdmFsdWVcbiAgICAvLyBiYXNlZCBvbiBzY3JvbGxQb3N0aW9uIGFuZCBzcGVlZFxuICAgIHZhciB1cGRhdGVQb3NpdGlvbiA9IGZ1bmN0aW9uKHBlcmNlbnRhZ2UsIHNwZWVkKSB7XG4gICAgICB2YXIgdmFsdWUgPSAoc3BlZWQgKiAoMTAwICogKDEgLSBwZXJjZW50YWdlKSkpO1xuICAgICAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUpO1xuICAgIH07XG5cblxuICAgIC8vXG5cdFx0dmFyIHVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHNldFBvc2l0aW9uKCkpIHtcblx0XHRcdFx0YW5pbWF0ZSgpO1xuXHQgICAgfVxuXHQgICAgXG5cdCAgICAvLyBsb29wIGFnYWluXG5cdCAgICBsb29wKHVwZGF0ZSk7XG5cdFx0fTtcblx0XHRcbiAgICAvLyBUcmFuc2Zvcm0zZCBvbiBwYXJhbGxheCBlbGVtZW50XG4gICAgdmFyIGFuaW1hdGUgPSBmdW5jdGlvbigpIHtcbiAgICBcdGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5lbGVtcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBwZXJjZW50YWdlID0gKChwb3NZIC0gYmxvY2tzW2ldLnRvcCArIHNjcmVlblkpIC8gKGJsb2Nrc1tpXS5oZWlnaHQgKyBzY3JlZW5ZKSk7XG5cbiAgICAgICAgLy8gU3VidHJhY3RpbmcgaW5pdGlhbGl6ZSB2YWx1ZSwgc28gZWxlbWVudCBzdGF5cyBpbiBzYW1lIHNwb3QgYXMgSFRNTFxuICAgICAgICB2YXIgcG9zaXRpb24gPSB1cGRhdGVQb3NpdGlvbihwZXJjZW50YWdlLCBibG9ja3NbaV0uc3BlZWQpIC0gYmxvY2tzW2ldLmJhc2U7XG5cbiAgICAgICAgLy8gTW92ZSB0aGF0IGVsZW1lbnRcbiAgICAgICAgdmFyIHRyYW5zbGF0ZSA9ICd0cmFuc2xhdGUzZCgwLCcgKyBwb3NpdGlvbiArICdweCcgKyAnLDApJyArIGJsb2Nrc1tpXS5zdHlsZTtcbiAgICAgICAgc2VsZi5lbGVtc1tpXS5zdHlsZS5jc3NUZXh0ID0gJy13ZWJraXQtdHJhbnNmb3JtOicrdHJhbnNsYXRlKyc7LW1vei10cmFuc2Zvcm06Jyt0cmFuc2xhdGUrJzt0cmFuc2Zvcm06Jyt0cmFuc2xhdGUrJzsnO1xuICAgICAgfVxuICAgIH07XG5cblxuICAgIGluaXQoKTtcbiAgICBPYmplY3QuZnJlZXplKCk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG4gIHJldHVybiBSZWxsYXg7XG59KSk7IiwiLyoqXG4gKiBAZmlsZVxuICogSW5pdGlhbGl6ZSBwYXJhbGxheGVzIHdpdGggUmVsbGF4IGxpYi5cbiAqXG4gKiBAc2VlICBodHRwczovL2dpdGh1Yi5jb20vZGl4b25hbmRtb2UvcmVsbGF4XG4gKi9cblxuaW1wb3J0IFJlbGxheCBmcm9tICdyZWxsYXgnXG5cbihmdW5jdGlvbiAoKSB7XG5cdHZhciByZWxsYXggPSBuZXcgUmVsbGF4KCcucGFyYWxsYXgnKTtcbn0pKClcbiJdLCJuYW1lcyI6WyJ0aGlzIiwicmVsbGF4IiwiUmVsbGF4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXQSxDQUFDLFVBQVUsSUFBSSxFQUFFLE9BQU8sRUFBRTtJQUN0QixJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFOztRQUU1QyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZCLE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTs7OztRQUlyRCxjQUFjLEdBQUcsT0FBTyxFQUFFLENBQUM7S0FDOUIsTUFBTTs7UUFFSCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sRUFBRSxDQUFDO0dBQzdCO0NBQ0YsQ0FBQ0EsY0FBSSxFQUFFLFlBQVk7RUFDbEIsSUFBSSxNQUFNLEdBQUcsU0FBUyxFQUFFLEVBQUUsT0FBTyxDQUFDO0lBQ2hDLFlBQVksQ0FBQzs7SUFFYixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0lBRzNDLElBQUksT0FBTyxNQUFNLENBQUMsV0FBVyxLQUFLLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRTs7SUFFMUQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQzs7OztJQUloQixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMscUJBQXFCO0tBQ3RDLE1BQU0sQ0FBQywyQkFBMkI7S0FDbEMsTUFBTSxDQUFDLHdCQUF3QjtLQUMvQixNQUFNLENBQUMsdUJBQXVCO0tBQzlCLE1BQU0sQ0FBQyxzQkFBc0I7S0FDN0IsU0FBUyxRQUFRLENBQUMsRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7OztJQUd4RCxJQUFJLENBQUMsT0FBTyxHQUFHO01BQ2IsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUNWLENBQUM7OztJQUdGLElBQUksT0FBTyxDQUFDO01BQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDbEMsQ0FBQyxDQUFDO0tBQ0o7OztJQUdELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUU7TUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUM7S0FDMUIsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRTtNQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7S0FDekI7OztJQUdELElBQUksQ0FBQyxFQUFFLEVBQUU7TUFDUCxFQUFFLEdBQUcsU0FBUyxDQUFDO0tBQ2hCOzs7SUFHRCxJQUFJLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ3RELElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbEU7OztTQUdJLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsS0FBSyxLQUFLLEVBQUU7TUFDN0MsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDaEM7OztTQUdJO01BQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO0tBQ3RFOzs7Ozs7SUFNRCxJQUFJLElBQUksR0FBRyxXQUFXO01BQ3BCLE9BQU8sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO01BQzdCLFdBQVcsRUFBRSxDQUFDOzs7TUFHZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDekMsSUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3BCOztHQUVKLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsVUFBVTtLQUMxQyxPQUFPLEVBQUUsQ0FBQztJQUNYLENBQUMsQ0FBQzs7O01BR0EsTUFBTSxFQUFFLENBQUM7Ozs7TUFJVCxPQUFPLEVBQUUsQ0FBQztLQUNYLENBQUM7Ozs7OztJQU1GLElBQUksV0FBVyxHQUFHLFNBQVMsRUFBRSxFQUFFOzs7O01BSTdCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQzs7TUFFYixJQUFJLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUMsR0FBRyxDQUFDO01BQ3JELElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDOzs7TUFHeEUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLE9BQU8sS0FBSyxXQUFXLEdBQUcsT0FBTyxDQUFDLENBQUM7OztNQUd2RSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztNQUNqRixJQUFJLElBQUksR0FBRyxjQUFjLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7TUFHN0MsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztNQUU5QyxPQUFPO1FBQ0wsSUFBSSxFQUFFLElBQUk7UUFDVixHQUFHLEVBQUUsUUFBUTtRQUNiLE1BQU0sRUFBRSxXQUFXO1FBQ25CLEtBQUssRUFBRSxLQUFLO1FBQ1osS0FBSyxFQUFFLFlBQVk7T0FDcEIsQ0FBQztLQUNILENBQUM7Ozs7OztJQU1GLElBQUksV0FBVyxHQUFHLFdBQVc7S0FDNUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztNQUVmLElBQUksTUFBTSxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7UUFDcEMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7T0FDM0IsTUFBTTtRQUNMLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxlQUFlLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUM7T0FDMUY7O01BRUQsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFOztPQUVqQixPQUFPLElBQUksQ0FBQztPQUNaOzs7TUFHRCxPQUFPLEtBQUssQ0FBQztLQUNkLENBQUM7Ozs7O0lBS0YsSUFBSSxjQUFjLEdBQUcsU0FBUyxVQUFVLEVBQUUsS0FBSyxFQUFFO01BQy9DLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUMvQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDMUIsQ0FBQzs7OztFQUlKLElBQUksTUFBTSxHQUFHLFdBQVc7R0FDdkIsSUFBSSxXQUFXLEVBQUUsRUFBRTtJQUNsQixPQUFPLEVBQUUsQ0FBQztNQUNSOzs7S0FHRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDZixDQUFDOzs7SUFHQSxJQUFJLE9BQU8sR0FBRyxXQUFXO0tBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUN4QyxJQUFJLFVBQVUsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLE9BQU8sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7OztRQUduRixJQUFJLFFBQVEsR0FBRyxjQUFjLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDOzs7UUFHNUUsSUFBSSxTQUFTLEdBQUcsZ0JBQWdCLEdBQUcsUUFBUSxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM3RSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztPQUN2SDtLQUNGLENBQUM7OztJQUdGLElBQUksRUFBRSxDQUFDO0lBQ1AsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLE9BQU8sSUFBSSxDQUFDO0dBQ2IsQ0FBQztFQUNGLE9BQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQzs7O0FDNU1GOzs7Ozs7O0FBT0EsQ0FFQyxZQUFZO0NBQ1osSUFBSUMsU0FBTSxHQUFHLElBQUlDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztDQUNyQyxDQUFDLEVBQUUsQ0FBQTs7In0=