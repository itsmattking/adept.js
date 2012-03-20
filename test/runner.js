var runner = (function(window, $) {

  var template = document.getElementById('test-content').textContent;
  var container = document.getElementById('container');

  var timers = {},
    queue = [],
    running = false,
    queueCount = 0;

  function time(name) {
    timers[name] = new Date().getTime();
  }

  function timeEnd(name) {
    return (new Date().getTime() - timers[name]) + 'ms';
  }

  function log(name, type, status, time) {
    console[type](status + ' (' + time + '): ' + name);
  }

  function setup() {
    container.innerHTML = template;
  }

  function teardown() {
    container.innerHTML = template;
    timers[name] = null;
  }

  function addToQueue(fn) {
    queue.push(fn);
    queueCount++;
  }

  function test(name, fn, async) {
    async = async || false;
    addToQueue(function(name, fn) {
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