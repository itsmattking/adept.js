(function(window, document, runner) {

  var container = document.getElementById('container');

  runner.test('Should accept string as selector and return Set', function() {
    var results = $('#container');
    return (results instanceof $.Set &&
            results.length === 1 &&
            results.list[0] === container);
  });

  runner.test('Should accept DOM node as selector', function() {
    var results = $(container);
    return (results instanceof $.Set &&
            results.length === 1 &&
            results.list[0] === container);
  });

  runner.test('Should accept Set as selector', function() {
    var results = $($('#container'));
    return (results instanceof $.Set &&
            results.length === 1 &&
            results.list[0] === container);
  });

  runner.test('Should accept Set with multiple results as selector', function() {
    var results = $($('#container h3'));
    return (results instanceof $.Set &&
            results.length === 3);
  });

  runner.test('Should accept DOM NodeList as selector', function() {
    var results = $(document.querySelectorAll('h3'));
    return (results instanceof $.Set &&
            results.length === 3 &&
            results.list.filter(function(h) {
              return h.nodeName === 'H3';
            }).length === 3);
  });

  runner.test('Should accept native DOM tag by name selector', function() {
    var results = $(document.getElementsByTagName('h3'));
    return (results instanceof $.Set &&
            results.length === 3 &&
            results.list.filter(function(h) {
              return h.nodeName === 'H3';
            }).length === 3);
  });

  runner.test('Should accept native DOM tag by classname selector', function() {
    var results = $(document.getElementsByClassName('headline'));
    return (results instanceof $.Set &&
            results.length === 3 &&
            results.list.filter(function(h) {
              return h.nodeName === 'H3';
            }).length === 3);
  });

  runner.test('Should scope selector to alternate root', function() {
    return $('article', container).list.filter(function(a) {
      return a.nodeName === 'ARTICLE' && a.parentNode === container;
    }).length === 3;
  });

  runner.test('Should find h3 Tags with one selector', function() {
    return $('#container article h3').length === 3;
  });

  runner.test('Should find h3 Tags with find function', function() {
    return $('#container article').find('h3').length === 3;
  });

  runner.test('Should find h3 Tags with data attribute', function() {
    return $('#container article').find('h3[data-id=two]').length === 1;
  });

  runner.test('Should get HTML content', function() {
    var item = $('#container #article-1'),
      expected = document.getElementById('article-1').innerHTML;
    return item.html()  === expected;
  });

  runner.test('Should get HTML content for multiple elements', function() {
    var item = $('#container article p'),
      expected = document.getElementById('container').getElementsByTagName('p');
    return item.html().filter(function(h, i) {
      return h === expected[i].innerHTML;
    }).length === 3;
  });

  runner.test('Should get text content', function() {
    var item = $('#container #article-1'),
      expected = document.getElementById('article-1').textContent;
    return item.text() === expected;
  });

  runner.test('Should set HTML content', function() {
    var item = $('#container #article-2');
    return item.html('<p>New HTML Content</p>') &&
      item.html() === '<p>New HTML Content</p>' &&
      item.find('p').length === 1 &&
      item.find('h3').length === 0;
  });

  runner.test('Should find parent node', function() {
    var results = $('#article-2').parent();
    return results.length === 1 && results.attr('id') === $('#container').attr('id');
  });

  runner.test('Should find parent nodes', function() {
    var results = $('p').parent();
    return results.length === 4 && results.filter(function(item) { return item.nodeName === 'ARTICLE'; }).length === 3;
  });

  runner.test('Should find parent node with selector', function() {
    var results = $('#article-2 p span').parent('article');
    return results.length === 1 && results.attr('id') === $('#article-2').attr('id');
  });

  runner.test('Should find multiple parent nodes with selector', function() {
    var results = $('p span').parent('article');
    return results.length === 2 && results.filter(function(item) { return item.nodeName === 'ARTICLE'; }).length === 2;
  });

  runner.test('Should return raw DOM elements', function() {
    var expected = Array.prototype.slice.call(document.querySelectorAll('#container article'));
    var results = $('#container article').raw();
    return (!(results instanceof $.Set)) && results.filter(function(item, i) {
      return item.getAttribute('id') === expected[i].getAttribute('id');
    }).length === 3;
  });

  runner.test('Should return one raw DOM element if no index passed', function() {
    var expected = Array.prototype.slice.call(document.querySelectorAll('#container #article-1'));
    var results = $('#container #article-1').raw();
    return (!(results instanceof $.Set)) && results.filter(function(item, i) {
      return item.getAttribute('id') === expected[i].getAttribute('id');
    }).length === 1;
  });

  runner.test('Should return one raw DOM element if index passed', function() {
    var expected = Array.prototype.slice.call(document.querySelectorAll('#container article'));
    var results = $('#container article').raw(0);
    return (results instanceof HTMLElement) && results.getAttribute('id') === expected[0].getAttribute('id');
  });

  runner.test('Should return new Set using get', function() {
    var expected = Array.prototype.slice.call(document.querySelectorAll('#container article'), 0, 1);
    var results = $('#container article').get(0);
    return ((results instanceof $.Set)) && results.filter(function(item, i) {
      return item.getAttribute('id') === expected[i].getAttribute('id');
    }).length === 1;
  });

  runner.test('Should return entire Set using get', function() {
    var expected = Array.prototype.slice.call(document.querySelectorAll('#container article'));
    var results = $('#container article').get();
    return ((results instanceof $.Set)) && results.filter(function(item, i) {
      return item.getAttribute('id') === expected[i].getAttribute('id');
    }).length === 3;
  });

  runner.test('Should set text content', function() {
    var item = $('#container #article-2 h3');
    return item.text('New text Content') &&
      item.text() === 'New text Content';
  });

  runner.test('Should append content to end of all article tags', function() {
    $('#container article').append('<p>New Content</p>');
    return $('#container article p').list.filter(function(p) {
      return p.nodeName === 'P' && p.textContent === 'New Content';
    }).length === 3;
  });

  runner.test('Should prepend content to beginning of all h3 tags', function() {
    $('#container article h3').prepend('Modified ');
    var expected = ['Modified Headline 1','Modified Headline 2','Modified Headline 3'];
    return $('#container article h3').list.filter(function(h, i) {
      return expected[i] === h.textContent;
    }).length === 3;
  });

  runner.test('Should remove nodes', function() {
    var items = $('#container article h3');
    return items.length === 3 &&
      (items.remove() && $('#container article h3').length === 0);
  });

  runner.test('Should iterate over nodes', function() {
    var out = [],
      expected = ['Headline 1','Headline 2','Headline 3'];
    $('#container article h3').each(function(h) {
      out.push(h.textContent);
    });
    return out.filter(function(o, i) {
      return expected[i] === o;
    }).length === 3;
  });

  runner.test('Should filter nodes', function() {
    return $('#container article h3').filter(function(h) {
      return h.dataset.id === 'two';
    }).length === 1;
  });

  runner.test('Should map function and return new Set', function() {
    var results = $('#container article h3').map(function(h) {
      h.innerHTML += ' yeah';
      return h;
    });
    return (results instanceof $.Set) && results.length === 3 &&
      results.filter(function(item) {
        return item.innerHTML.match(/ yeah$/);
      }).length === 3;
  });

  runner.test('Should set basic css styles', function() {
    return $('#container article h3').style({color: '#F00', borderBottom: '2px solid #CCC'})
    .filter(function(h) {
      return (h.style.color === 'rgb(255, 0, 0)' || h.style.color === '#F00')
            && (h.style.borderBottom === '2px solid rgb(204, 204, 204)' || h.style.borderBottom === '2px solid #CCC');
    }).length === 3;
  });

  runner.test('Should get inline css style', function() {
    $('#container article h3').style({color: '#F00'});
    var result = $('#container article h3').style('color');
    return result === 'rgb(255, 0, 0)' || result === '#F00';
  });

  runner.test('Should get precomputed css style', function() {
    var result = $('#container h1').style('fontSize');
    return result === '48px';
  });

  runner.test('Should not add vendor prefixes to css declarations', function() {
    var results = $('#container article h3');
    results.style({ color: '#FFF' });
    return results.filter(function(item) {
      return (typeof item.style.MozColor === 'undefined') &&
        (typeof item.style.webkitColor === 'undefined') &&
        (typeof item.style.OColor === 'undefined') &&
        (typeof item.style.msColor === 'undefined');
    }).length === results.length;

  });

  runner.test('Should add vendor prefixes to css declarations', function() {
    var results = $('#container article h3');
    results.style({ transform: 'scale(1.5)' });
    return results.filter(function(item) {
      return item.style.MozTransform === 'scale(1.5)' &&
        item.style.webkitTransform === 'scale(1.5)' &&
        item.style.OTransform === 'scale(1.5)' &&
        item.style.msTransform === 'scale(1.5)';
    }).length === results.length;

  });

  runner.test('Should hide elements', function() {
    var results = $('#container article h3').hide();
    return results.filter(function(h) {
      return window.getComputedStyle(h).display === 'none';
    }).length === 3;
  });

  runner.test('Should show elements', function() {
    return window.getComputedStyle($('#container div.hidden').list[0]).display === 'none' &&
      window.getComputedStyle($('#container div.hidden').show().list[0]).display === 'block';
  });

  runner.test('Should show inline element correctly', function() {
    var span = $('#container article p span').hide().list[0];
    return window.getComputedStyle(span).display === 'none' &&
      window.getComputedStyle($(span).show().list[0]).display === 'inline';
  });

  runner.test('Should show inline-block element correctly', function() {
    var span = $('#container #article-2 p span').list[0];
    return window.getComputedStyle(span).display === 'inline-block' &&
      window.getComputedStyle($(span).show().list[0]).display === 'inline-block';
  });

  runner.test('Should detect elements not having a class', function() {
    return !$('#container article').hasClass('new-class');
  });

  runner.test('Should detect elements having a class', function() {
    $('#container article').addClass('new-class');
    return $('#container article').hasClass('new-class');
  });

  runner.test('Should add class to elements', function() {
    $('#container article').addClass('new-class');
    return $('#container article.new-class').length === 3;
  });

  runner.test('Should remove class from elements', function() {
    return (($('#container article').addClass('new-class') &&
            $('#container article.new-class').length === 3) &&
            ($('#container article.new-class').removeClass('new-class') &&
            $('#container article.new-class').length === 0));
  });

  runner.test('Should remove multiple classes from elements', function() {
    var passed = true;

    $('#container article').addClass('new-class another-class');
    if ($('#container article.new-class').length !== 3 &&
        $('#container article.another-class').length !== 3) {
      passed = false;
    }

    $('#container article').removeClass('new-class another-class');
    if ($('#container article.new-class').length !== 0 ||
      $('#container article.another-class').length !== 0) {
      passed = false;
    }
    return passed;
  });

  runner.test('Should remove all classes from element if no argument', function() {
    var passed = true;

    $('#container article').addClass('new-class another-class');
    if ($('#container article.new-class').length !== 3 &&
        $('#container article.another-class').length !== 3) {
      passed = false;
    }

    $('#container article').removeClass();
    if ($('#container article.new-class').length !== 0 ||
      $('#container article.another-class').length !== 0) {
      passed = false;
    }
    return passed;
  });

  runner.test('Should toggle class on elements', function() {
    return (($('#container article').toggleClass('new-class') &&
            $('#container article.new-class').length === 3) &&
            ($('#container article.new-class').toggleClass('new-class') &&
            $('#container article.new-class').length === 0));
  });

  runner.test('Should replace class on elements', function() {
    var passed = true;

    $('#container article').addClass('new-class another-class');
    if ($('#container article.new-class').length !== 3 &&
        $('#container article.another-class').length !== 3) {
      passed = false;
    }

    $('#container article').replaceClass('something-else');
    if ($('#container article.something-else').length !== 3 ||
        $('#container article.new-class').length !== 0 ||
        $('#container article.another-class').length !== 0) {
      passed = false;
    }
    return passed;
  });

  runner.test('Should get DOM attribute', function() {
    return $('#container #article-1').attr('title') === 'Article 1';
  });

  runner.test('Should set DOM attribute', function() {
    var titles = ['a', 'b', 'c'];
    $('#container article').each(function(s, i) {
      $(s).attr('title', titles[i]);
    });
    return $('#container article').filter(function(a, i) {
      return $(a).attr('title') === titles[i];
    }).length === 3;
  });

  runner.test('Should set DOM attributes on multiple elements', function() {
    return $('#container article[title="new-title"]').length === 0 &&
      $('#container article').attr('title', 'new-title') &&
      $('#container article').filter(function(a, i) {
        return $(a).attr('title') === 'new-title';
      }).length === 3;
  });

  runner.test('Should get data attribute', function() {
    return $('#container #article-1 h3').data('id') === 'one';
  });

  runner.test('Should get data multiple attributes', function() {
    var results = $('#container article h3').data('id'),
      expected = ['one', 'two', 'three'];
    return results.filter(function(h, i) {
      return h === expected[i];
    });
  });

  runner.test('Should set data', function() {
    var titles = ['a', 'b', 'c'];
    $('#container article').each(function(s, i) {
      $(s).data('title', titles[i]);
    });
    return $('#container article').filter(function(a, i) {
      return $(a).data('title') === titles[i];
    }).length === 3;
  });

  runner.test('Should set data on multiple elements', function() {
    return $('#container article[data-title=new-title]').length === 0 &&
      $('#container article').data('title', 'new-title') &&
      $('#container article').filter(function(a, i) {
        return $(a).data('title') === 'new-title';
      }).length === 3;
  });

  runner.test('Should get full dataset on one element as object', function() {
    var results = $('#container #article-1 h3').data();
    return (results instanceof Object) && results.id === 'one';
  });

  runner.test('Should set input form value', function() {
    $('form input[name=name]').val('Test Value');
    return document.querySelector('form input[name=name]').value === 'Test Value';
  });

  runner.test('Should get input form value', function() {
    var expected = document.querySelector('form input[name=name]').value;
    return $('form input[name=name]').val() === 'Default Value';
  });

  runner.test('Should run callback after 1 second transition', function(next) {
    var time = new Date().getTime();
    $('#article-1 h3').transition({color: '#F00'}, {duration: '1s'}, function() {
      var passed = true;
      if ((new Date().getTime()) - time < 1000) {
        passed = false;
      }
      next(passed);
    });
  }, true);

  runner.test('Should not be red before transition', function() {
    var color = $('#article-1 h3').style('color');
    return color === 'rgb(0, 0, 0)' || color === '#000';
  });

  runner.test('Should be red after transition', function(next) {
    $('#article-1 h3').transition({color: '#F00'}, {duration: '1s'}, function() {
      var passed = true;
      if (!($(this).style('color') === 'rgb(255, 0, 0)' || $(this).style('color') === '#F00')) {
        passed = false;
      }
      next(passed);
    });
  }, true);

  runner.test('Should add vendor transitionEnd event using addListener', function(next) {
    var runNext = function() {
      next(true);
    };
    $('#article-1 h3').addListener('transitionEnd', runNext, true);
    $('#article-1 h3').transition({color: '#F00'}, {property: 'color', duration: '1.0s'});
  }, true);

  runner.test('Should remove vendor transitionEnd event using removeListener', function(next) {
    var fail = function(e) {
      throw new Error('fail');
    };

    $('#article-1 h3').addListener('transitionEnd', fail);
    $('#article-1 h3').removeListener('transitionEnd', fail);
    $('#article-1 h3').transition({color: '#F00'}, {property: 'color', duration: '1.0s'}, function() {
      next(true);
    });
  }, true);

  runner.test('Should add click event listener', function(next) {
    var passed = false;
    $('#article-1 h3').addListener('click', function() {
      passed = true;
    });

    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    $('#article-1 h3').raw(0).dispatchEvent(e);
    return passed;
  });

  runner.test('Should remove click event listener', function() {
    var bool = false;

    var setTrue = function() {
      bool = true;
    };

    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    $('#article-1 h3').addListener('click', setTrue);
    $('#article-1 h3').raw(0).dispatchEvent(e);

    if (bool) {
      bool = false;
      $('#article-1 h3').removeListener('click', setTrue);
      $('#article-1 h3').raw(0).dispatchEvent(e);
      return bool === false;
    } else {
      return false;
    }
  });

  runner.test('Should return canvas context object', function() {
    return $('#canvas-test').context() instanceof $.CanvasContext;
  });

  runner.test('Should have all canvas context functions on canvas context', function() {
    var ctx = document.getElementById('test-canvas-a').getContext('2d');
    var contextObject = $('#canvas-test').context();
    var passed = true;
    for (var k in ctx) {
      if (typeof ctx[k] === 'function' &&
          typeof contextObject[k] !== 'function') {
        passed = false;
      };
    }
    return passed;
  });

  runner.test('Should set context options', function() {
    var ctx = $('#test-canvas-a').context();
    var defaultFillStyle = document.getElementById('test-canvas-a').getContext('2d').fillStyle;
    return ctx.settings(0).fillStyle === defaultFillStyle &&
      ctx.set({fillStyle: '#F00'}) && ctx.settings(0).fillStyle === '#ff0000';
  });

  runner.test('Should not set invalid context options', function() {
    var ctx = $('#test-canvas-a').context();
    ctx.set({fillStyle: '#F00', invalidSetting: true});
    return ctx.settings(0).fillStyle === '#ff0000' && typeof ctx.settings(0).invalidSetting === 'undefined';
  });

  runner.test('Should get context option settings', function() {
    var ctx = $('#test-canvas-a').context();
    ctx.set({fillStyle: '#F00', lineWidth: 100});
    return ctx.settings(0).fillStyle === '#ff0000' && ctx.settings(0).lineWidth === 100;
  });

  runner.test('Should set multiple context option settings', function() {
    var ctx = $('canvas').context();
    ctx.set({fillStyle: '#F00', lineWidth: 100});
    return ctx.settings(0).fillStyle === '#ff0000' && ctx.settings(0).lineWidth === 100 &&
      ctx.settings(1).fillStyle === '#ff0000' && ctx.settings(1).lineWidth === 100;
  });

  runner.test('Should get all context option settings', function() {
    var settings = $('canvas').context().set({fillStyle: '#F00', lineWidth: 100}).settings();
    return settings[0].fillStyle === '#ff0000' && settings[0].lineWidth === 100 &&
      settings[1].fillStyle === '#ff0000' && settings[1].lineWidth === 100;
  });

  runner.test('Should draw on canvas with chained commands', function() {
    var raw = document.getElementById('test-canvas-a');
    var rawCtx = raw.getContext('2d');
    var ctx = $('#test-canvas-b').context();
    rawCtx.fillStyle = '#F00';
    rawCtx.save();
    rawCtx.fillRect(0, 0, 100, 100);
    rawCtx.restore();
    ctx.set({fillStyle: '#F00'}).save().fillRect(0, 0, 100, 100).restore();
    return raw.toDataURL() === $('#test-canvas-b').context().toDataURL();
  });

  runner.test('Should fail on mismatched draw on canvas with chained commands', function() {
    var raw = document.getElementById('test-canvas-a');
    var rawCtx = raw.getContext('2d');
    var ctx = $('#test-canvas-b').context();
    rawCtx.fillStyle = '#F00';
    rawCtx.save();
    rawCtx.fillRect(0, 0, 50, 100);
    rawCtx.restore();
    ctx.set({fillStyle: '#F00'}).save().fillRect(0, 0, 100, 100).restore();
    return raw.toDataURL() !== $('#test-canvas-b').context().toDataURL();
  });

  runner.test('Should allow shim functions', function() {
    var passed = true;
    var results = $('#container article');

    $.shim('each', function(fn, ctx) {
      return 'shimmed';
    });
    var shimmedResults = $('#container article').each(function(item) {
      console.log(item);
    });

    return (results instanceof $.Set) && shimmedResults === 'shimmed';
  });

})(window, document, runner);