(function(document, window) {

  /**
   * @constructor
   */
  function Set(list) {
    this.list = this['slice'].call(list, 0);
    this['length'] = this.list.length;
    return this;
  }

  Set.prototype['slice'] = Array.prototype.slice;

  /**
   * Selector and Traversal
   */
  Set.prototype['each'] = function(fn, ctx) {
    this.list.forEach(fn, ctx);
    return this;
  };

  Set.prototype['filter'] = function(fn, ctx) {
    return new Set(this.list.filter(fn, ctx));
  };

  Set.prototype['find'] = function(selector) {
    return new Set(this.list.map(function(s) {
      return this['slice'].call(s.querySelectorAll(selector), 0);
    }, this).reduce(function(a, b) { return a.concat(b); }));
  };

  Set.prototype['map'] = function(fn, ctx) {
    this.list.map(fn, ctx);
    return this;
  };

  Set.prototype['parent'] = function(selector) {
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

  Set.prototype['raw'] = function(i) {
    return this.list[i] || this.list;
  };

  /**
   * DOM Attributes and Data
   */
  Set.prototype['attr'] = function(name, val) {
    if (name && typeof val === 'undefined') {
      var results = this.list.map(function(s) {
        return s.getAttribute(name);
      });
      return results.length === 1 ? results[0] : results;
    } else if (name && val) {
      this['each'](function(s) {
        s.setAttribute(name, val);
      });
    }
    return this;
  };

  Set.prototype['data'] = function(name, val) {
    if (name && typeof val === 'undefined') {
      var results = this.list.map(function(s) {
        return s.dataset[name];
      });
      return results.length === 1 ? results[0] : results;
    } else if (name && val) {
      this['each'](function(s) {
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
      return (results.length === 1 ? results[0] : results);
    }
    return this;
  };

  /**
   * Input field values and manipulation
   */
  Set.prototype['val'] = function(val) {
    if (val) {
      this['each'](function(s) {
        s.value = val;
      });
      return this;
    } else {
      var results = this.list.map(function(s) {
        return s.value;
      });
      return results.length === 1 ? results[0] : results;
    }
  };

  /**
   * DOM modification
   */
  Set.prototype['content'] = function(content, type) {
    if (typeof content === 'undefined') {
      var out = this.list.map(function(s) {
        return s[type];
      });
      return out.length === 1 ? out[0] : out;
    } else {
      this['each'](function(s) {
        s[type] = content;
      });
    }
    return this;
  };

  Set.prototype['html'] = function(content) {
    return this['content'](content, 'innerHTML');
  };

  Set.prototype['text'] = function(content) {
    return this['content'](content, 'textContent');
  };

  Set.prototype['prepend'] = function(content) {
    if (content instanceof HTMLElement) {
      this['each'](function(s) {
        var c = content.cloneNode(true);
        s.parentNode.insertBefore(s.parentNode.childNodes[0], c);
      });
    } else {
      this['each'](function(s) {
        s.innerHTML = content + s.innerHTML;
      });
    }
    return this;
  };

  Set.prototype['append'] = function(content) {
    if (content instanceof HTMLElement) {
      this['each'](function(s) {
        s.appendChild(content.cloneNode(true));
      });
    } else {
      this['each'](function(s) {
        s.innerHTML += content;
      });
    }
    return this;
  };

  Set.prototype['remove'] = function() {
    this['each'](function(s) {
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

  Set.prototype['css'] = function(dec) {
    if (typeof dec === 'string') {
      return window.getComputedStyle(this.list[0])[dec];
    } else {
      this['each'](function(s) {
        for (var k in dec) {
          this.setStyle(s, k, dec[k]);
        }
      }, this);
      return this;
    }
  };

  Set.prototype['hide'] = function() {
    this['each'](function(s) {
      var originalDisplay = window.getComputedStyle(s).display;
      if (originalDisplay !== 'none') {
        s.originalDisplay = originalDisplay;
      }
      s.style.display = 'none';
    });
    return this;
  };

  Set.prototype['show'] = function() {
    this['each'](function(s) {
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
    if (typeof className !== 'undefined') {
      className = className.split(' ');
      this.list.map(function(s) {
        className.map(function(name) {
          s['classList'][type](name);
        });
      });
    } else if (type === 'remove') {
      this.list.map(function(s) {
        while(s['classList'].length) {
          s['classList'].remove(s['classList'][0]);
        }
      });
    }
    return this;
  };

  Set.prototype['addClass'] = function(className) {
    return this.modifyClass(className, 'add');
  };

  Set.prototype['removeClass'] = function(className) {
    return this.modifyClass(className, 'remove');
  };

  Set.prototype['toggleClass'] = function(className) {
    return this.modifyClass(className, 'toggle');
  };

  Set.prototype['replaceClass'] = function(className) {
    this['removeClass']();
    return this['addClass'](className, 'add');
  };

  /**
   * Events
   */

  Set.prototype['addListener'] = function(type, fn, capture) {
    capture = typeof capture === 'undefined' ? false : capture;
    this['each'](function(s) {
      s.addEventListener(type, fn, capture);
    });
    return this;
  };

  Set.prototype['removeListener'] = function(type, fn, capture) {
    capture = typeof capture === 'undefined' ? false : capture;
    this['each'](function(s) {
      s.removeEventListener(type, fn, capture);
    });
    return this;
  };

  /**
   * Transitions
   */

  Set.prototype['transition'] = function(dec, options, callback)  {
    for (var k in options) {
      var vendorProp = 'transition' + k.substr(0, 1).toUpperCase() + k.substr(1);
      if (vendorProp in this.vendorProps) {
        dec[vendorProp] = options[k];
      }
    }
    if (callback) {
      this.transitionEnd(callback);
    }
    this['css'](dec);
    return this;
  };

  Set.prototype.transitionEnd = function(fn)  {
    var prefixes = this.vendorPrefixes;
    var transitionEnd = function() {
      fn.call(this);
      for (var k in prefixes) {
        this.removeEventListener(k + 'TransitionEnd', transitionEnd, false);
      }
    };
    this['each'](function(s) {
      for (var k in prefixes) {
        s.addEventListener(k + 'TransitionEnd', transitionEnd, false);
      }
    }, this);
  };

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
        typeof selector.length !== 'undefined') {
      return new Set(Set.prototype['slice'].call(selector, 0));
    }

    root = root || document;
    return new Set(root.querySelectorAll(selector));
  }

  $['Set'] = Set;
  window['$'] = $;

})(document, window);