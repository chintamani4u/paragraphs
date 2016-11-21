(function (exports) {
'use strict';

/**
 * @file
 * Modify default Drupal tabledrag functionality
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Override Drupal's default, the only difference is,
   * that we pass a third arguments to the tableDrag constructor
   */
  Drupal.behaviors.tableDrag = {
    attach: function (context, settings) {
      function initTableDrag(table, base) {
        if (table.length) {
          // Create the new tableDrag instance. Save in the Drupal variable
          // to allow other scripts access to the object.
          Drupal.tableDrag[base] = new Drupal.tableDrag(table[0], settings.tableDrag[base], base);
        }
      }

      for (var base in settings.tableDrag) {
        if (settings.tableDrag.hasOwnProperty(base)) {
          initTableDrag($(context).find('#' + base).once('tabledrag'), base);
        }
      }
    }
  };

  // References to the original constructor and dragStart handler
  var TableDrag = Drupal.tableDrag;
  var _dragStart = TableDrag.prototype.dragStart;

  /**
   * Override Drupal's default constructor
   * We call the original, and replace the dragStart handler if it's the paragraph list
   */
  Drupal.tableDrag = function (table, tableSettings, base) {
    var tableDrag = new TableDrag(table, tableSettings);

    if (base.indexOf('field-paragraphs-values' === 0)) {
      tableDrag.dragStart = dragStart;
    }

    return tableDrag;
  };

  /**
   * The modified dragStart handler, which prevents dragging if services are open
   * otherwise call the original handler
   */
	var dragStart = function() {
    var numberOfOpenSections = this.$table.find('.paragraphs-subform').length;

    if (numberOfOpenSections) {
      return;
    }

    _dragStart.apply(this, arguments);
	};
})(jQuery, Drupal);

}((this.LaravelElixirBundle = this.LaravelElixirBundle || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi92YXIvd3d3L3BhcmFncmFwaHMubG9jYWwvd2ViL3RoZW1lcy90aWV0b19hZG1pbi9zcmMvc2NyaXB0cy90YWJsZWRyYWcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZVxuICogTW9kaWZ5IGRlZmF1bHQgRHJ1cGFsIHRhYmxlZHJhZyBmdW5jdGlvbmFsaXR5XG4gKi9cblxuKGZ1bmN0aW9uICgkLCBEcnVwYWwpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIERydXBhbCdzIGRlZmF1bHQsIHRoZSBvbmx5IGRpZmZlcmVuY2UgaXMsXG4gICAqIHRoYXQgd2UgcGFzcyBhIHRoaXJkIGFyZ3VtZW50cyB0byB0aGUgdGFibGVEcmFnIGNvbnN0cnVjdG9yXG4gICAqL1xuICBEcnVwYWwuYmVoYXZpb3JzLnRhYmxlRHJhZyA9IHtcbiAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgZnVuY3Rpb24gaW5pdFRhYmxlRHJhZyh0YWJsZSwgYmFzZSkge1xuICAgICAgICBpZiAodGFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBuZXcgdGFibGVEcmFnIGluc3RhbmNlLiBTYXZlIGluIHRoZSBEcnVwYWwgdmFyaWFibGVcbiAgICAgICAgICAvLyB0byBhbGxvdyBvdGhlciBzY3JpcHRzIGFjY2VzcyB0byB0aGUgb2JqZWN0LlxuICAgICAgICAgIERydXBhbC50YWJsZURyYWdbYmFzZV0gPSBuZXcgRHJ1cGFsLnRhYmxlRHJhZyh0YWJsZVswXSwgc2V0dGluZ3MudGFibGVEcmFnW2Jhc2VdLCBiYXNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBiYXNlIGluIHNldHRpbmdzLnRhYmxlRHJhZykge1xuICAgICAgICBpZiAoc2V0dGluZ3MudGFibGVEcmFnLmhhc093blByb3BlcnR5KGJhc2UpKSB7XG4gICAgICAgICAgaW5pdFRhYmxlRHJhZygkKGNvbnRleHQpLmZpbmQoJyMnICsgYmFzZSkub25jZSgndGFibGVkcmFnJyksIGJhc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZmVyZW5jZXMgdG8gdGhlIG9yaWdpbmFsIGNvbnN0cnVjdG9yIGFuZCBkcmFnU3RhcnQgaGFuZGxlclxuICB2YXIgVGFibGVEcmFnID0gRHJ1cGFsLnRhYmxlRHJhZztcbiAgdmFyIF9kcmFnU3RhcnQgPSBUYWJsZURyYWcucHJvdG90eXBlLmRyYWdTdGFydDtcblxuICAvKipcbiAgICogT3ZlcnJpZGUgRHJ1cGFsJ3MgZGVmYXVsdCBjb25zdHJ1Y3RvclxuICAgKiBXZSBjYWxsIHRoZSBvcmlnaW5hbCwgYW5kIHJlcGxhY2UgdGhlIGRyYWdTdGFydCBoYW5kbGVyIGlmIGl0J3MgdGhlIHBhcmFncmFwaCBsaXN0XG4gICAqL1xuICBEcnVwYWwudGFibGVEcmFnID0gZnVuY3Rpb24gKHRhYmxlLCB0YWJsZVNldHRpbmdzLCBiYXNlKSB7XG4gICAgdmFyIHRhYmxlRHJhZyA9IG5ldyBUYWJsZURyYWcodGFibGUsIHRhYmxlU2V0dGluZ3MpO1xuXG4gICAgaWYgKGJhc2UuaW5kZXhPZignZmllbGQtcGFyYWdyYXBocy12YWx1ZXMnID09PSAwKSkge1xuICAgICAgdGFibGVEcmFnLmRyYWdTdGFydCA9IGRyYWdTdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFibGVEcmFnO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUaGUgbW9kaWZpZWQgZHJhZ1N0YXJ0IGhhbmRsZXIsIHdoaWNoIHByZXZlbnRzIGRyYWdnaW5nIGlmIHNlcnZpY2VzIGFyZSBvcGVuXG4gICAqIG90aGVyd2lzZSBjYWxsIHRoZSBvcmlnaW5hbCBoYW5kbGVyXG4gICAqL1xuXHR2YXIgZHJhZ1N0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG51bWJlck9mT3BlblNlY3Rpb25zID0gdGhpcy4kdGFibGUuZmluZCgnLnBhcmFncmFwaHMtc3ViZm9ybScpLmxlbmd0aDtcblxuICAgIGlmIChudW1iZXJPZk9wZW5TZWN0aW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIF9kcmFnU3RhcnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0fTtcbn0pKGpRdWVyeSwgRHJ1cGFsKTsiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7O0FBS0EsQ0FBQyxVQUFVLENBQUMsRUFBRSxNQUFNLEVBQUU7O0VBRXBCLFlBQVksQ0FBQzs7Ozs7O0VBTWIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUc7SUFDM0IsTUFBTSxFQUFFLFVBQVUsT0FBTyxFQUFFLFFBQVEsRUFBRTtNQUNuQyxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1FBQ2xDLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTs7O1VBR2hCLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pGO09BQ0Y7O01BRUQsS0FBSyxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ25DLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7VUFDM0MsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNwRTtPQUNGO0tBQ0Y7R0FDRixDQUFDOzs7RUFHRixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0VBQ2pDLElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDOzs7Ozs7RUFNL0MsTUFBTSxDQUFDLFNBQVMsR0FBRyxVQUFVLEtBQUssRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO0lBQ3ZELElBQUksU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQzs7SUFFcEQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLHlCQUF5QixLQUFLLENBQUMsQ0FBQyxFQUFFO01BQ2pELFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0tBQ2pDOztJQUVELE9BQU8sU0FBUyxDQUFDO0dBQ2xCLENBQUM7Ozs7OztDQU1ILElBQUksU0FBUyxHQUFHLFdBQVc7SUFDeEIsSUFBSSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7SUFFMUUsSUFBSSxvQkFBb0IsRUFBRTtNQUN4QixPQUFPO0tBQ1I7O0lBRUQsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7RUFDcEMsQ0FBQztDQUNGLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDOzsifQ==