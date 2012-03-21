var runner = (function(window, $) {

  var template = document.getElementById('test-content').textContent;
  var container = document.getElementById('container');

  var timers = {},
    queue = [],
    running = false;

  function time(name) {
    timers[name] = new Date().getTime();
  }

  function timeEnd(name) {
    return (new Date().getTime() - timers[name]) + 'ms';
  }

  function log(name, type, status, time) {
    console[type](status + ' (' + time + '): ' + name);
  }

  function empty(parent) {
    if (parent.childNodes.length > 0) {
      while (parent.childNodes.length > 0) {
        parent.removeChild(parent.childNodes[0]);
      }
    }
  }

  function setup() {
    while (container.childNodes.length > 0) {
      empty(container);
    }
    container.innerHTML = template;
  }

  function teardown() {
    container.innerHTML = template;
    timers[name] = null;
  }

  function test(name, fn, async) {
    async = async || false;
    queue.push(function(name, fn) {
      return function() {
        setup();
        time(name);
        if (async) {
          fn.call(fn, function(results) {
            var next = queue.shift();
            try {
              var timeSpent = timeEnd(name);
              if (results) {
                log(name, 'log', 'PASS', timeSpent);
              } else {
                log(name, 'warn', 'FAIL', timeSpent);
              }
            } catch(e) {
              log(name, 'error', 'ERROR (Reason: ' + e + ')', timeSpent || 'N/A');
            }
            teardown();
            if (next) {
              next.call(next);
            }
          });
        } else {
          var next = queue.shift();
          try {
            var results = fn.call(fn);
            var timeSpent = timeEnd(name);
            if (results) {
              log(name, 'log', 'PASS', timeSpent);
            } else {
              log(name, 'warn', 'FAIL', timeSpent);
            }
          } catch(e) {
            log(name, 'error', 'ERROR (Reason: ' + e + ')', timeSpent || 'N/A');
          }
          teardown();
          if (next) {
            next.call(next);
          }
        }
      };
    }(name, fn));

    if (!running) {
      setTimeout(function() {
        var next = queue.shift();
        next.call(next);
      });
      running = true;
    }
  }

  return {
    test: test
  };

})(window, $);