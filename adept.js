(function(document, window) {

  var CONS = {};

  CONS.UNDEFINED = 'undefined';
  CONS.FUNCTION = 'function';
  CONS.CLASS_LIST = 'classList';

  function firstOrList(results) {
    return results.length === 1 ? results[0] : results;
  }

  var CanvasContext = (function() {

    var canvas = document.createElement('canvas');
    if (!canvas || typeof canvas.getContext !== CONS.FUNCTION) {
      return null;
    }

    /**
     * Wrapper around a canvas context to allow chaining of functions.
     * @constructor
     */
    function CanvasContext(list) {
      this.list = list.map(function(l) {
        if (typeof l.getContext === CONS.FUNCTION) {
          l.ctx = l.getContext('2d');
          return l;
        } else {
          return null;
        }
      }).filter(function(l) { return l !== null; });
    }

    CanvasContext.prototype.validSetters = {};

    var ctx = canvas.getContext('2d');

    for (var k in ctx) {
      if (!(k in CanvasContext.prototype) && typeof ctx[k] === CONS.FUNCTION) {
        (function(fn) {
          CanvasContext.prototype[fn] = function() {
            var args = Set.prototype.slice.call(arguments, 0);
            this.list.forEach(function(l) {
              l.ctx[fn].apply(l.ctx, args);
            }, this);
            return this;
          };
        }(k));
      } else {
        CanvasContext.prototype.validSetters[k] = 1;
      }
    }

    CanvasContext.prototype.set = function(options) {
      options = options || {};
      for (var k in options) {
        if (!(k in this.validSetters)) {
          delete options[k];
        }
      }
      this.list.forEach(function(l) {
        for (var k in options) {
          l.ctx[k] = options[k];
        }
      });
      return this;
    };

    CanvasContext.prototype.settings = function(i) {
      var list = (typeof i === CONS.UNDEFINED ? this.list : [this.list[i]]);
      var results = list.map(function(l) {
        var out = {};
        for (var k in this.validSetters) {
          out[k] = l.ctx[k];
        }
        return out;
      }, this);
      return firstOrList(results);
    };

    CanvasContext.prototype.raw = function(i) {
      return this.list[i] || this.list;
    };

    CanvasContext.prototype.toDataURL = function() {
      var args = Set.prototype.slice.call(arguments, 0);
      var results = this.list.map(function(c) {
        return c.toDataURL.call(c, args);
      });
      return firstOrList(results);
    };

    CanvasContext.prototype.toBlob = function() {
      var args = Set.prototype.slice.call(arguments, 0);
      var results = this.list.map(function(c) {
        return c.toBlob.call(c, args);
      });
      return firstOrList(results);
    };

    return CanvasContext;

  })();

  /**
   * @constructor
   */
  function Set(list) {
    this.list = this.slice.call(list, 0);
    this.length = this.list.length;
    return this;
  }

  Set.prototype.slice = Array.prototype.slice;

  /**
   * Iterate over the Set collection
   * @param {Function} fn the function to call on each iteration.
   * @param {Object} [ctx] context to pass to forEach.
   */
  Set.prototype.each = function(fn, ctx) {
    ctx = ctx || fn;
    this.list.forEach(fn, ctx);
    return this;
  };

  Set.prototype.filter = function(fn, ctx) {
    return new Set(this.list.filter(fn, ctx));
  };

  Set.prototype.find = function(selector) {
    return new Set(this.list.map(function(s) {
      return this.slice.call(s.querySelectorAll(selector), 0);
    }, this).reduce(function(a, b) { return a.concat(b); }));
  };

  Set.prototype.map = function(fn, ctx) {
    this.list.map(fn, ctx);
    return this;
  };

  Set.prototype.parent = function(selector) {
    if (!selector) {
      return new Set(this.list.map(function(item) {
        return item.parentNode;
      }));
    } else {
      return new Set(this.list.map(function(item) {
        var parent = item.parentNode;
        while (!(parent.parentNode.querySelector(selector))) {
          parent = parent.parentNode;
        }
        return parent;
      }))
    }
  };

  Set.prototype.get = function(i) {
    if (typeof i !== CONS.UNDEFINED) {
      return new Set([this.list[i]]);
    } else {
      return this;
    }
  };

  Set.prototype.raw = function(i) {
    return this.list[i] || this.list;
  };

  /**
   * DOM Attributes and Data
   */
  Set.prototype.attr = function(name, val) {
    if (name && typeof val === CONS.UNDEFINED) {
      var results = this.list.map(function(s) {
        return s.getAttribute(name);
      });
      return firstOrList(results);
    } else if (name && val) {
      this.each(function(s) {
        s.setAttribute(name, val);
      });
    }
    return this;
  };

  Set.prototype.data = function(name, val) {
    if (name && typeof val === CONS.UNDEFINED) {
      var results = this.list.map(function(s) {
        return s.dataset[name];
      });
      return firstOrList(results);
    } else if (name && val) {
      this.each(function(s) {
        s.dataset[name] = val;
      });
    } else if (!(name && val)) {
      var results = this.list.map(function(item) {
        var out = {};
        for (var k in item.dataset) {
          out[k] = item.dataset[k];
        }
        return out;
      });
      return firstOrList(results);
    }
    return this;
  };

  /**
   * Input field values and manipulation
   */
  Set.prototype.val = function(val) {
    if (val) {
      this.each(function(s) {
        s.value = val;
      });
      return this;
    } else {
      var results = this.list.map(function(s) {
        return s.value;
      });
      return firstOrList(results);
    }
  };

  /**
   * DOM modification
   */
  Set.prototype.content = function(content, type) {
    if (typeof content === CONS.UNDEFINED) {
      var out = this.list.map(function(s) {
        return s[type];
      });
      return firstOrList(out);
    } else {
      this.each(function(s) {
        s[type] = content;
      });
    }
    return this;
  };

  Set.prototype.html = function(content) {
    return this.content(content, 'innerHTML');
  };

  Set.prototype.text = function(content) {
    return this.content(content, 'textContent');
  };

  Set.prototype.prepend = function(content) {
    if (content instanceof Set) {
      var c = content.content(undefined, 'outerHTML');
      this.each(function(s) {
        s.innerHTML = c + s.innerHTML;
      });
    } else if (content instanceof HTMLElement) {
      this.each(function(s) {
        var c = content.cloneNode(true);
        s.parentNode.insertBefore(s.parentNode.childNodes[0], c);
      });
    } else {
      this.each(function(s) {
        s.innerHTML = content + s.innerHTML;
      });
    }
    return this;
  };

  Set.prototype.append = function(content) {
    if (content instanceof Set) {
      this.each(function(s) {
        s.innerHTML += content.content(undefined, 'outerHTML');
      });
    } else if (content instanceof HTMLElement) {
      this.each(function(s) {
        s.appendChild(content.cloneNode(true));
      });
    } else {
      this.each(function(s) {
        s.innerHTML += content;
      });
    }
    return this;
  };

  Set.prototype.remove = function() {
    this.each(function(s) {
      s.parentNode.removeChild(s);
    });
    return this;
  };

  /**
   * Style modification
   */

  Set.prototype.vendorPrefixes = {
    'ms': 1,
    'O': 1,
    'webkit': 1,
    'Moz': 1
  };

  Set.prototype.vendorProps = {
    'animationName': 1,
    'animationDelay': 1,
    'animationDirection': 1,
    'animationDuration': 1,
    'animationFillMode': 1,
    'animationIterationCount': 1,
    'animationName': 1,
    'animationPlayState': 1,
    'animationTimingFunction': 1,
    'borderRadius': 1,
    'transform': 1,
    'transformOrigin': 1,
    'transition': 1,
    'transitionProperty': 1,
    'transitionDuration': 1,
    'transitionTimingFunction': 1,
    'transitionDelay': 1
  };

  Set.prototype.setStyle = function(s, k, v) {
    if (k in this.vendorProps) {
      k = k.substr(0, 1).toUpperCase() + k.substr(1);
      for (var p in this.vendorPrefixes) {
        s.style[p + k] = v;
      }
    } else {
      s.style[k] = v;
    }
  };

  Set.prototype.style = function(dec) {
    if (typeof dec === 'string') {
      return window.getComputedStyle(this.list[0])[dec];
    } else {
      this.each(function(s) {
        for (var k in dec) {
          this.setStyle(s, k, dec[k]);
        }
      }, this);
      return this;
    }
  };

  Set.prototype.hide = function() {
    this.each(function(s) {
      var originalDisplay = window.getComputedStyle(s).display;
      if (originalDisplay !== 'none') {
        s.originalDisplay = originalDisplay;
      }
      s.style.display = 'none';
    });
    return this;
  };

  Set.prototype.show = function() {
    this.each(function(s) {
      if (window.getComputedStyle(s).display === 'none') {
        if (s.originalDisplay) {
          s.style.display = s.originalDisplay;
          delete s.originalDisplay;
        } else {
          s.style.display = 'block';
        }
      }
    });
    return this;
  };

  Set.prototype.modifyClass = function(className, type) {
    if (typeof className !== CONS.UNDEFINED) {
      className = className.split(' ');
      this.list.map(function(s) {
        className.map(function(name) {
          s[CONS.CLASS_LIST][type](name);
        });
      });
    } else if (type === 'remove') {
      this.list.map(function(s) {
        while(s[CONS.CLASS_LIST].length) {
          s[CONS.CLASS_LIST].remove(s[CONS.CLASS_LIST][0]);
        }
      });
    }
    return this;
  };

  Set.prototype.width = function() {
    var results = this.list.map(function(s) {
      return s.offsetWidth;
    });
    return firstOrList(results);
  };

  Set.prototype.height = function() {
    var results = this.list.map(function(s) {
      return s.offsetHeight;
    });
    return firstOrList(results);
  };

  /**
   * Add a classname to the selected nodes.
   * If no className passed, has no side effects.
   * @param {String} [className] the optional class name.
   */
  Set.prototype.addClass = function(className) {
    return this.modifyClass(className, 'add');
  };

  /**
   * Remove a classname to the selected nodes.
   * If no className passed, removes all classes from nodes.
   * @param {String} [className] the optional class name.
   */
  Set.prototype.removeClass = function(className) {
    return this.modifyClass(className, 'remove');
  };

  /**
   * Toggle a classname to the selected nodes.
   * If no className passed, has no side effects.
   * @param {String} [className] the optional class name.
   */
  Set.prototype.toggleClass = function(className) {
    return this.modifyClass(className, 'toggle');
  };

  /**
   * Replace the entire class list with a classname.
   * If no className passed, has no side effects.
   * @param {String} [className] the optional class name.
   */
  Set.prototype.replaceClass = function(className) {
    this.removeClass();
    return this.addClass(className);
  };

  /**
   * Check if a class is attached to an element.
   * @param {String} [className] the class name.
   */
  Set.prototype.hasClass = function(className) {
    return this.list.filter(function(s) {
      return s[CONS.CLASS_LIST].contains(className);
    }).length > 0;
  };

  Set.prototype.vendorEvents = {
    'transitionEnd': {
      'oTransitionEnd': 1,
      'webkitTransitionEnd': 1,
      'transitionend': 1
    }
  };

  /**
   * Events
   */

  Set.prototype.manageListener = function(type, fn, capture, listenerType) {
    capture = typeof capture === CONS.UNDEFINED ? false : capture;
    if (type in this.vendorEvents) {
      this.each(function(s) {
        for (var k in this.vendorEvents[type]) {
          s[listenerType + 'EventListener'](k, fn, capture);
        }
      }, this);
    } else {
      this.each(function(s) {
        s[listenerType + 'EventListener'](type, fn, capture);
      });
    }
    return this;
  };

  Set.prototype.addListener = function(type, fn, capture) {
    return this.manageListener(type, fn, capture, 'add');
  };

  Set.prototype.removeListener = function(type, fn, capture) {
    return this.manageListener(type, fn, capture, 'remove');
  };

  /**
   * Transitions
   */

  Set.prototype.transition = function(dec, options, callback)  {
    for (var k in options) {
      var vendorProp = k.substr(0, 1).toUpperCase() + k.substr(1);
      if (('transition' + vendorProp) in this.vendorProps) {
        for (var prefix in this.vendorPrefixes) {
          dec[prefix + 'Transition' + vendorProp] = options[k];
        }
      }
    }
    if (callback) {
      this.transitionEnd(callback);
    }
    setTimeout(function(self, dec) {
      return function() {
        self.style(dec);
      };
    }(this, dec), 10);
    return this;
  };

  Set.prototype.transitionEnd = function(fn)  {
    var events = this.vendorEvents['transitionEnd'];
    var transitionEnd = function(e) {
      fn.call(this, e);
      for (var k in events) {
        this.removeEventListener(k, transitionEnd, false);
      }
    };
    this.each(function(s) {
      for (var k in events) {
        s.addEventListener(k, transitionEnd, false);
      }
    }, this);
  };

  /**
   * Canvas chainable context functions.
   */
  Set.prototype.context = function() {
    return new CanvasContext(this.list);
  };

  function shim(name, fn) {
    if (name in Set.prototype) {
      Set.prototype[name] = fn;
      $['Set'].prototype[name] = Set.prototype[name];
    }
  }

  function fragment(str) {
    var parent = document.createElement('div');
    parent.innerHTML = str;
    return new Set([parent]);
  }

  function $(selector, root) {
    if (selector instanceof Set) {
      return selector;
    }
    if (selector instanceof window['NodeList']) {
      return new Set(selector);
    }
    if (selector === document ||
        selector instanceof window['HTMLElement']) {
      return new Set([selector]);
    }
    if (selector instanceof window['Object'] &&
        typeof selector.length !== CONS.UNDEFINED) {
      return new Set(Set.prototype.slice.call(selector, 0));
    }

    root = root || document;
    return new Set(root.querySelectorAll(selector));
  }

  $['fragment'] = fragment;

  /**
   * Export all functions needed for public API
   */
  $['Set'] = Set;
  $['Set'].prototype['each'] = Set.prototype.each;
  $['Set'].prototype['find'] = Set.prototype.find;
  $['Set'].prototype['filter'] = Set.prototype.filter;
  $['Set'].prototype['map'] = Set.prototype.map;
  $['Set'].prototype['parent'] = Set.prototype.parent;
  $['Set'].prototype['get'] = Set.prototype.get;
  $['Set'].prototype['raw'] = Set.prototype.raw;
  $['Set'].prototype['attr'] = Set.prototype.attr;
  $['Set'].prototype['data'] = Set.prototype.data;
  $['Set'].prototype['val'] = Set.prototype.val;
  $['Set'].prototype['html'] = Set.prototype.html;
  $['Set'].prototype['text'] = Set.prototype.text;
  $['Set'].prototype['prepend'] = Set.prototype.prepend;
  $['Set'].prototype['append'] = Set.prototype.append;
  $['Set'].prototype['remove'] = Set.prototype.remove;
  $['Set'].prototype['style'] = Set.prototype.style;
  $['Set'].prototype['css'] = Set.prototype.style; // jQuery-like
  $['Set'].prototype['hide'] = Set.prototype.hide;
  $['Set'].prototype['show'] = Set.prototype.show;
  $['Set'].prototype['width'] = Set.prototype.width;
  $['Set'].prototype['height'] = Set.prototype.height;
  $['Set'].prototype['addClass'] = Set.prototype.addClass;
  $['Set'].prototype['removeClass'] = Set.prototype.removeClass;
  $['Set'].prototype['toggleClass'] = Set.prototype.toggleClass;
  $['Set'].prototype['hasClass'] = Set.prototype.hasClass;
  $['Set'].prototype['replaceClass'] = Set.prototype.replaceClass;
  $['Set'].prototype['addListener'] = Set.prototype.addListener;
  $['Set'].prototype['removeListener'] = Set.prototype.removeListener;
  $['Set'].prototype['on'] = Set.prototype.addListener; // jQuery-like
  $['Set'].prototype['off'] = Set.prototype.removeListener; // jQuery-like
  $['Set'].prototype['transition'] = Set.prototype.transition;
  $['Set'].prototype['context'] = Set.prototype.context;

  $['CanvasContext'] = CanvasContext;
  $['CanvasContext'].prototype['set'] = CanvasContext.prototype.set;
  $['CanvasContext'].prototype['settings'] = CanvasContext.prototype.settings;
  $['CanvasContext'].prototype['toDataURL'] = CanvasContext.prototype.toDataURL;
  $['CanvasContext'].prototype['toBlob'] = CanvasContext.prototype.toBlob;

  $['shim'] = shim;

  window['$'] = $;

})(document, window);