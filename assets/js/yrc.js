/* Youth Resource Centre — small progressive enhancements. No dependencies. */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  /* Mobile navigation */
  var toggle = doc.querySelector('[data-nav-toggle]');
  var nav = doc.getElementById('primary-nav');
  if (toggle && nav) {
    var label = toggle.querySelector('[data-nav-label]');
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      if (label) label.textContent = open ? 'Close menu' : 'Open menu';
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    doc.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
    each(nav.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    var desktop = window.matchMedia('(min-width: 900px)');
    var onBreakpoint = function (mq) { if (mq.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);
  }

  /* Reading progress + back-to-top */
  var progress = doc.querySelector('[data-progress]');
  var toTop = doc.querySelector('[data-to-top]');
  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset || doc.documentElement.scrollTop;
    if (progress) {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      var main = doc.getElementById('main');
      if (main) main.focus({ preventScroll: true });
    });
  }

  /* Scroll reveal */
  var reveals = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      each(entries, function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    each(reveals, function (el) { io.observe(el); });
  } else {
    each(reveals, function (el) { el.classList.add('is-visible'); });
  }

  /* Table of contents: highlight the section in view */
  var tocLinks = doc.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    var targets = [];
    each(tocLinks, function (a) {
      var el = doc.getElementById(a.getAttribute('href').slice(1));
      if (el) { byId[el.id] = a; targets.push(el); }
    });
    var spy = new IntersectionObserver(function (entries) {
      each(entries, function (en) {
        if (!en.isIntersecting) return;
        each(tocLinks, function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        var link = byId[en.target.id];
        if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'location'); }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    each(targets, function (el) { spy.observe(el); });
  }

  /* Source-evaluation checklist */
  each(doc.querySelectorAll('[data-checklist]'), function (wrap) {
    var boxes = wrap.querySelectorAll('input[type="checkbox"]');
    var count = wrap.querySelector('[data-check-count]');
    var bar = wrap.querySelector('[data-check-bar]');
    var done = wrap.querySelector('[data-check-done]');
    var reset = wrap.querySelector('[data-check-reset]');
    function update() {
      var n = 0;
      each(boxes, function (b) {
        if (b.checked) n++;
        var item = b.closest('.check-item');
        if (item) item.classList.toggle('is-checked', b.checked);
      });
      if (count) count.textContent = n;
      if (bar) bar.style.width = (boxes.length ? (n / boxes.length) * 100 : 0) + '%';
      if (done) done.hidden = n !== boxes.length;
    }
    each(boxes, function (b) { b.addEventListener('change', update); });
    if (reset) {
      reset.addEventListener('click', function () {
        each(boxes, function (b) { b.checked = false; });
        update();
        if (boxes[0]) boxes[0].focus();
      });
    }
    update();
  });

  /* Interactive activities: show the feedback for the chosen response */
  each(doc.querySelectorAll('[data-activity]'), function (act) {
    var panels = act.querySelectorAll('[data-feedback]');
    var empty = act.querySelector('[data-feedback-empty]');
    var inputs = act.querySelectorAll('input[type="radio"]');
    each(inputs, function (input) {
      input.addEventListener('change', function () {
        each(inputs, function (i) { i.closest('.option').classList.toggle('is-selected', i.checked); });
        each(panels, function (p) { p.hidden = p.getAttribute('data-feedback') !== input.value; });
        if (empty) empty.hidden = true;
      });
    });
  });

  /* Resource type filter (only rendered once real resource types exist) */
  var filter = doc.querySelector('[data-filter]');
  if (filter) {
    var buttons = filter.querySelectorAll('button[data-filter-value]');
    var items = doc.querySelectorAll('.rcard[data-type], .review[data-type]');
    var status = doc.querySelector('[data-filter-status]');
    each(buttons, function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-filter-value');
        var shown = 0;
        var total = 0;
        each(buttons, function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        each(items, function (it) {
          var match = value === 'all' || it.getAttribute('data-type') === value;
          it.hidden = !match;
          if (it.classList.contains('rcard')) { total++; if (match) shown++; }
        });
        if (status) status.textContent = 'Showing ' + shown + ' of ' + total + ' resources.';
      });
    });
  }
})();
