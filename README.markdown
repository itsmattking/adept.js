Adept.js - DOM Manipulation for Modern Browsers
===============================================

Adept.js is made to provide a minimal convenience layer over the DOM
for querying, traversal, and modification of elements. It's specifically
made for modern browsers, and includes very little built-in shims for
compatibility, instead relying on built-in functionality found
in the latest releases of browsers.

Quick Tour
----------

All this stuff is pretty standard if you're used to jQuery. There are only
a few minor differences, a few things added.

All syntax valid with querySelectorAll will work when selecting nodes:

    $('#container article');
    $('#container article a[rel=external]');
    $('#container div.comments');
    $('#container div.comments > h3');

Of course, it's chainable:

    $('#container article div.comments').addClass('disabled').find('h3').text('Comments Disabled');

Styling elements using the Javascript style notation:

    $('#container article h3').style({backgroundColor: 'blue', color: 'white'});

CSS3 Transitions on elements on the fly:

    $('#container article.disabled').transition({opacity: '0.5'}, {duration: '1.0s'});

You can also use normalized transform and transition options (it will add vendor prefixes for you):

    $('#container article.disabled').transition(
        {transform: 'scale(0)'},
        {duration: '1.0s', transformOrigin: '50% 50%'});

With a transitionEnd callback:

    $('#container article.disabled').transition(
        {transform: 'scale(0)'},
        {duration: '1.0s', transformOrigin: '50% 50%'},
        function() {
          $(this).remove();        
        }
    );

Applying events is pretty boring:

    $('#container article a[rel=external]').addListener('click',
        function(e) {
          window.open($(e.target).attr('href'));
          e.preventDefault();
        }
    );

Only thing special is adding normalized transitionEnd events:

    $('#container article div.comments .deleted').addListener('transitionEnd',
      $(this).remove();
    });

Drawing on canvas elements gets less verbose with a chainable context object:

    $('#container canvas').context().fillRect(0, 0, 100, 100);

Set any attributes of a canvas context this way:

    $('#container canvas').context().set({fillStyle: 'red'}).fillRect(0, 0, 100, 100);

All context and canvas operations are supported:

    $('#container canvas').context().save().set({fillStyle: 'red'}).fillRect(0, 0, 100, 100).restore().toDataURL();

Core Features
-------------

* Chainable syntax (yes, like jQuery)
* Query selector engine solely based on querySelectorAll
* Traversal of nodes using built-in each, map, filter functions
* Data and attribute handling
* Style modification of DOM nodes using Javascript naming conventions
  (e.g. backgroundColor vs. background-color)
* DOM event binding
* Some form input querying and manipulation
* Class name modification using built-in classList
* Content insert, remove, append/prepend

Interesting Features
--------------------

* Normalizes applying CSS transitions with vendor prefixes.
* Normalizes application of transitionEnd events with vendor prefixes.
* A chainable context object for drawing on canvas elements.

Unfeatures
----------

* No AJAX
* No JSON parsing (that's built into modern browsers now)
* No animation or effects (use CSS3 transitions)
* No helper utility hodge-podge (I recommend underscore.js for more
  robust enumerator operations)
* No browser sniffing/feature detection (you shouldn't need it, but if you
  do, I recommend Modernizr)

For the Caremad People
======================

Q: Why did you write this? Why would I use this instead of jQuery??
-------------------------------------------------------------------

A: I wrote this for a couple reasons. First, I figured there would be
a lot to learn when writing a library like this. So I did, and I learned
a ton. Second, I'm not saying you should use this instead of jQuery. However,
if you are working on projects that don't require support for older browsers,
this might be a good alternative, as it's goal is to be close to the metal,
small, and fast.

Q: But if you write a library you have to include support for older browsers!
-----------------------------------------------------------------------------

A: Alright fine. There is a shim API that will allow anyone to
override built in functions. With this you can possibly add support
for older browsers. If you REALLY wanted to. But you're on your own
at that point. But if you do write one, feel free to send me a link to it
and I'll make sure it gets included in a list of shims.

Q: I can't believe you didn't include {feature name}?
---------------------------------------------------

Well if a feature doesn't exist either I haven't had a use for it yet or
I don't think it belongs in there. If you have an idea for a
feature, please do fork and submit a pull request, or open a new issue.

Q: Why did you use querySelectorAll? It sucks!
----------------------------------------------

A: Sure, there are some bugs, but overall querySelectorAll functions and is
performant for 99% of what I see people using this library for. And it's
built right into the browser.

Browser Compatibility
=====================

Definitely Compatible Browsers
------------------------------

Has been tested to run in, and will continue to be full support for:

* Google Chrome 16.x or higher
* Mozilla Firefox 9.x or higher
* Safari 5.x or higher on Mac OS X
* Safari on iOS 5 or higher

Might-Be-Compatible Browsers
----------------------------

Will be testing to work in, but may not necessarily be 100% compatible with:

* Android-based Mobile Webkit Browsers
* Safari on iOS versions 4.x
* Safari version 4.x on Mac OS X
* Internet Explorer 9 or 10
* Opera 11.x

Definitely-Not-Compatible Browsers
----------------------------------

Very small chance there will be compatibility now or any time in the future in:

* Firefox versions before 5.x
* Safari version before 4.x
* Internet Explorer before 9.x
* Safari on iOS before 4.0
* Anything before Opera 11