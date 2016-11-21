(function (exports) {
'use strict';

/**
 * @file
 * Scripts for install page.
 */

(function () {

  function findActiveStep(steps) {
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].className === 'is-active') {
        return i + 1;
      }
    }
    // The final "Finished" step is never "active".
    if (steps[steps.length - 1].className === 'done') {
      return steps.length;
    }
    return 0;
  }

  function installStepsSetup() {
    var steps = document.querySelectorAll('.task-list li');
    if (steps.length) {
      var header = document.querySelector('header[role="banner"]');
      var stepIndicator = document.createElement('div');
      stepIndicator.className = 'step-indicator';
      stepIndicator.innerHTML = findActiveStep(steps) + '/' + steps.length;
      header.appendChild(stepIndicator);
    }
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', installStepsSetup);
  }

})();

}((this.LaravelElixirBundle = this.LaravelElixirBundle || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi92YXIvd3d3L3BhcmFncmFwaHMubG9jYWwvd2ViL3RoZW1lcy90aWV0b19hZG1pbi9zcmMvc2NyaXB0cy9tb2JpbGUuaW5zdGFsbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlXG4gKiBTY3JpcHRzIGZvciBpbnN0YWxsIHBhZ2UuXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuICBmdW5jdGlvbiBmaW5kQWN0aXZlU3RlcChzdGVwcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzdGVwc1tpXS5jbGFzc05hbWUgPT09ICdpcy1hY3RpdmUnKSB7XG4gICAgICAgIHJldHVybiBpICsgMTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gVGhlIGZpbmFsIFwiRmluaXNoZWRcIiBzdGVwIGlzIG5ldmVyIFwiYWN0aXZlXCIuXG4gICAgaWYgKHN0ZXBzW3N0ZXBzLmxlbmd0aCAtIDFdLmNsYXNzTmFtZSA9PT0gJ2RvbmUnKSB7XG4gICAgICByZXR1cm4gc3RlcHMubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc3RhbGxTdGVwc1NldHVwKCkge1xuICAgIHZhciBzdGVwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YXNrLWxpc3QgbGknKTtcbiAgICBpZiAoc3RlcHMubGVuZ3RoKSB7XG4gICAgICB2YXIgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZGVyW3JvbGU9XCJiYW5uZXJcIl0nKTtcbiAgICAgIHZhciBzdGVwSW5kaWNhdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBzdGVwSW5kaWNhdG9yLmNsYXNzTmFtZSA9ICdzdGVwLWluZGljYXRvcic7XG4gICAgICBzdGVwSW5kaWNhdG9yLmlubmVySFRNTCA9IGZpbmRBY3RpdmVTdGVwKHN0ZXBzKSArICcvJyArIHN0ZXBzLmxlbmd0aDtcbiAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChzdGVwSW5kaWNhdG9yKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbnN0YWxsU3RlcHNTZXR1cCk7XG4gIH1cblxufSkoKTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7QUFLQSxDQUFDLFlBQVk7O0VBRVgsU0FBUyxjQUFjLENBQUMsS0FBSyxFQUFFO0lBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3JDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUU7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2Q7S0FDRjs7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxNQUFNLEVBQUU7TUFDaEQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO0tBQ3JCO0lBQ0QsT0FBTyxDQUFDLENBQUM7R0FDVjs7RUFFRCxTQUFTLGlCQUFpQixHQUFHO0lBQzNCLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN2RCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7TUFDaEIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO01BQzdELElBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDbEQsYUFBYSxDQUFDLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQztNQUMzQyxhQUFhLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztNQUNyRSxNQUFNLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ25DO0dBQ0Y7O0VBRUQsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7SUFDN0IsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLGlCQUFpQixDQUFDLENBQUM7R0FDbEU7O0NBRUYsQ0FBQyxFQUFFLENBQUM7OyJ9