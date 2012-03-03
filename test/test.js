(function(window, document) {

  var container = document.getElementById('container'),
    template = document.getElementById('test-content').textContent;

  var timers = {};

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
    timers = {};
  }

  function test(name, fn) {
    setup();
    time(name);
    var args = Array.prototype.slice.call(arguments, 2);
    try {
      var results = fn.call(fn, args);
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
  }

  test('Should accept string as selector and return Set', function() {
    var results = $('#container');
    return (results instanceof $.Set &&
            results.length === 1 &&
            results.list[0] === container);
  });

  test('Should accept DOM node as selector', function() {
    var results = $(container);
    return (results instanceof $.Set &&
            results.length === 1 &&
            results.list[0] === container);
  });

  test('Should accept Set as selector', function() {
    var results = $($('#container'));
    return (results instanceof $.Set &&
            results.length === 1 &&
            results.list[0] === container);
  });

  test('Should accept Set with multiple results as selector', function() {
    var results = $($('#container h3'));
    return (results instanceof $.Set &&
            results.length === 3);
  });

  test('Should accept DOM NodeList as selector', function() {
    var results = $(document.querySelectorAll('h3'));
    return (results instanceof $.Set &&
            results.length === 3 &&
            results.list.filter(function(h) {
              return h.nodeName === 'H3';
            }).length === 3);
  });

  test('Should accept native DOM tag by name selector', function() {
    var results = $(document.getElementsByTagName('h3'));
    return (results instanceof $.Set &&
            results.length === 3 &&
            results.list.filter(function(h) {
              return h.nodeName === 'H3';
            }).length === 3);
  });

  test('Should accept native DOM tag by classname selector', function() {
    var results = $(document.getElementsByClassName('headline'));
    return (results instanceof $.Set &&
            results.length === 3 &&
            results.list.filter(function(h) {
              return h.nodeName === 'H3';
            }).length === 3);
  });

  test('Should scope selector to alternate root', function() {
    return $('article', container).list.filter(function(a) {
      return a.nodeName === 'ARTICLE' && a.parentNode === container;
    }).length === 3;
  });

  test('Should find h3 Tags with one selector', function() {
    return $('#container article h3').length === 3;
  });

  test('Should find h3 Tags with find function', function() {
    return $('#container article').find('h3').length === 3;
  });

  test('Should find h3 Tags with data attribute', function() {
    return $('#container article').find('h3[data-id=two]').length === 1;
  });

  test('Should get HTML content', function() {
    var item = $('#container #article-1'),
      expected = document.getElementById('article-1').innerHTML;
    return item.html()  === expected;
  });

  test('Should get HTML content for multiple elements', function() {
    var item = $('#container article p'),
      expected = document.getElementById('container').getElementsByTagName('p');
    return item.html().filter(function(h, i) {
      return h === expected[i].innerHTML;
    }).length === 3;
  });

  test('Should get text content', function() {
    var item = $('#container #article-1'),
      expected = document.getElementById('article-1').textContent;
    return item.text() === expected;
  });

  test('Should set HTML content', function() {
    var item = $('#container #article-2');
    return item.html('<p>New HTML Content</p>') &&
      item.html() === '<p>New HTML Content</p>' &&
      item.find('p').length === 1 &&
      item.find('h3').length === 0;
  });

  test('Should find parent node', function() {
    var results = $('#article-2').parent();
    return results.length === 1 && results.attr('id') === $('#container').attr('id');
  });

  test('Should find parent nodes', function() {
    var results = $('p').parent();
    return results.length === 4 && results.filter(function(item) { return item.nodeName === 'ARTICLE'; }).length === 3;
  });

  test('Should find parent node with selector', function() {
    var results = $('#article-2 p span').parent('article');
    return results.length === 1 && results.attr('id') === $('#article-2').attr('id');
  });

  test('Should find multiple parent nodes with selector', function() {
    var results = $('p span').parent('article');
    return results.length === 2 && results.filter(function(item) { return item.nodeName === 'ARTICLE'; }).length === 2;
  });

  test('Should return raw DOM elements', function() {
    var expected = Array.prototype.slice.call(document.querySelectorAll('#container article'));
    var results = $('#container article').raw();
    return (!(results instanceof $.Set)) && results.filter(function(item, i) {
      return item.getAttribute('id') === expected[i].getAttribute('id');
    }).length === 3;
  });

  test('Should return one raw DOM element if no index passed', function() {
    var expected = Array.prototype.slice.call(document.querySelectorAll('#container #article-1'));
    var results = $('#container #article-1').raw();
    return (!(results instanceof $.Set)) && results.filter(function(item, i) {
      return item.getAttribute('id') === expected[i].getAttribute('id');
    }).length === 1;
  });

  test('Should return one raw DOM element if index passed', function() {
    var expected = Array.prototype.slice.call(document.querySelectorAll('#container article'));
    var results = $('#container article').raw(0);
    return (results instanceof HTMLElement) && results.getAttribute('id') === expected[0].getAttribute('id');
  });

  test('Should set text content', function() {
    var item = $('#container #article-2 h3');
    return item.text('New text Content') &&
      item.text() === 'New text Content';
  });

  test('Should append content to end of all article tags', function() {
    $('#container article').append('<p>New Content</p>');
    return $('#container article p').list.filter(function(p) {
      return p.nodeName === 'P' && p.textContent === 'New Content';
    }).length === 3;
  });

  test('Should prepend content to beginning of all h3 tags', function() {
    $('#container article h3').prepend('Modified ');
    var expected = ['Modified Headline 1','Modified Headline 2','Modified Headline 3'];
    return $('#container article h3').list.filter(function(h, i) {
      return expected[i] === h.textContent;
    }).length === 3;
  });

  test('Should remove nodes', function() {
    var items = $('#container article h3');
    return items.length === 3 &&
      (items.remove() && $('#container article h3').length === 0);
  });

  test('Should iterate over nodes', function() {
    var out = [],
      expected = ['Headline 1','Headline 2','Headline 3'];
    $('#container article h3').each(function(h) {
      out.push(h.textContent);
    });
    return out.filter(function(o, i) {
      return expected[i] === o;
    }).length === 3;
  });

  test('Should filter nodes', function() {
    return $('#container article h3').filter(function(h) {
      return h.dataset.id === 'two';
    }).length === 1;
  });

  test('Should map function and return new Set', function() {
    var results = $('#container article h3').map(function(h) {
      h.innerHTML += ' yeah';
      return h;
    });
    return (results instanceof $.Set) && results.length === 3 &&
      results.filter(function(item) {
        return item.innerHTML.match(/ yeah$/);
      }).length === 3;
  });

  test('Should set basic css styles', function() {
    return $('#container article h3').css({color: '#F00', borderBottom: '2px solid #CCC'})
    .filter(function(h) {
      return (h.style.color === 'rgb(255, 0, 0)' || h.style.color === '#F00')
            && (h.style.borderBottom === '2px solid rgb(204, 204, 204)' || h.style.borderBottom === '2px solid #CCC');
    }).length === 3;
  });

  test('Should not add vendor prefixes to css declarations', function() {
    var results = $('#container article h3');
    results.css({ color: '#FFF' });
    return results.filter(function(item) {
      return (typeof item.style.MozColor === 'undefined') &&
        (typeof item.style.webkitColor === 'undefined') &&
        (typeof item.style.OColor === 'undefined') &&
        (typeof item.style.msColor === 'undefined');
    }).length === results.length;

  });

  test('Should add vendor prefixes to css declarations', function() {
    var results = $('#container article h3');
    results.css({ transform: 'scale(1.5)' });
    return results.filter(function(item) {
      return item.style.MozTransform === 'scale(1.5)' &&
        item.style.webkitTransform === 'scale(1.5)' &&
        item.style.OTransform === 'scale(1.5)' &&
        item.style.msTransform === 'scale(1.5)';
    }).length === results.length;

  });

  test('Should hide elements', function() {
    var results = $('#container article h3').hide();
    return results.filter(function(h) {
      return window.getComputedStyle(h).display === 'none';
    }).length === 3;
  });

  test('Should show elements', function() {
    return window.getComputedStyle($('#container div.hidden').list[0]).display === 'none' &&
      window.getComputedStyle($('#container div.hidden').show().list[0]).display === 'block';
  });

  test('Should show inline element correctly', function() {
    var span = $('#container article p span').hide().list[0];
    return window.getComputedStyle(span).display === 'none' &&
      window.getComputedStyle($(span).show().list[0]).display === 'inline';
  });

  test('Should show inline-block element correctly', function() {
    var span = $('#container #article-2 p span').list[0];
    return window.getComputedStyle(span).display === 'inline-block' &&
      window.getComputedStyle($(span).show().list[0]).display === 'inline-block';
  });

  test('Should add class to elements', function() {
    $('#container article').addClass('new-class');
    return $('#container article.new-class').length === 3;
  });

  test('Should remove class from elements', function() {
    return (($('#container article').addClass('new-class') &&
            $('#container article.new-class').length === 3) &&
            ($('#container article.new-class').removeClass('new-class') &&
            $('#container article.new-class').length === 0));
  });

  test('Should toggle class on elements', function() {
    return (($('#container article').toggleClass('new-class') &&
            $('#container article.new-class').length === 3) &&
            ($('#container article.new-class').toggleClass('new-class') &&
            $('#container article.new-class').length === 0));
  });

  test('Should get DOM attribute', function() {
    return $('#container #article-1').attr('title') === 'Article 1';
  });

  test('Should set DOM attribute', function() {
    var titles = ['a', 'b', 'c'];
    $('#container article').each(function(s, i) {
      $(s).attr('title', titles[i]);
    });
    return $('#container article').filter(function(a, i) {
      return $(a).attr('title') === titles[i];
    }).length === 3;
  });

  test('Should set DOM attributes on multiple elements', function() {
    return $('#container article[title="new-title"]').length === 0 &&
      $('#container article').attr('title', 'new-title') &&
      $('#container article').filter(function(a, i) {
        return $(a).attr('title') === 'new-title';
      }).length === 3;
  });

  test('Should get data attribute', function() {
    return $('#container #article-1 h3').data('id') === 'one';
  });

  test('Should get data multiple attributes', function() {
    var results = $('#container article h3').data('id'),
      expected = ['one', 'two', 'three'];
    return results.filter(function(h, i) {
      return h === expected[i];
    });
  });

  test('Should set data', function() {
    var titles = ['a', 'b', 'c'];
    $('#container article').each(function(s, i) {
      $(s).data('title', titles[i]);
    });
    return $('#container article').filter(function(a, i) {
      return $(a).data('title') === titles[i];
    }).length === 3;
  });

  test('Should set data on multiple elements', function() {
    return $('#container article[data-title=new-title]').length === 0 &&
      $('#container article').data('title', 'new-title') &&
      $('#container article').filter(function(a, i) {
        return $(a).data('title') === 'new-title';
      }).length === 3;
  });

  test('Should get full dataset on one element as object', function() {
    var results = $('#container #article-1 h3').data();
    return (results instanceof Object) && results.id === 'one';
  });

  test('Should set input form value', function() {
    $('form input[name=name]').val('Test Value');
    return document.querySelector('form input[name=name]').value === 'Test Value';
  });

  test('Should get input form value', function() {
    var expected = document.querySelector('form input[name=name]').value;
    return $('form input[name=name]').val() === 'Default Value';
  });

})(window, document);