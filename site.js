/* ===================================================================
   Thistle Code — behaviour

   Three things: reveal on scroll, count metrics up, and boot the
   landing page readout.

   Every one of them is decoration. The class on <html> is added here,
   so with no JavaScript nothing below applies and the CSS leaves the
   page in its finished state. Nothing is ever gated on an animation —
   the whole point of the site is that it works, so it would be a poor
   joke if a visitor with a blocked script saw an empty page.
   =================================================================== */

document.documentElement.classList.add('js');

(function () {
  'use strict';

  var still = window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- The failsafe, armed first -----------------------------------
     Whatever the observer does or fails to do, everything is visible a
     few seconds in. Hiding content behind an animation that might never
     run is the one mistake this site cannot afford to make. */

  setTimeout(function () {
    document.documentElement.classList.add('reveal-all');
  }, 4000);

  /* --- Reveal on scroll -------------------------------------------- */

  (function () {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (still || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Number(el.dataset.delay || 0);
        setTimeout(function () { el.classList.add('in'); }, delay);
        seen.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { seen.observe(el); });
  })();

  /* --- Metrics count up --------------------------------------------
     Only once, only when reached, and it always lands exactly on the
     written value — the number in the HTML is the truth, this just
     takes a moment to arrive at it. */

  (function () {
    var cells = document.querySelectorAll('[data-count]');
    if (!cells.length || still || !('IntersectionObserver' in window)) return;

    function run(el) {
      var target = Number(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      if (!isFinite(target)) return;

      var started = null;
      var span = 900;

      function step(now) {
        if (started === null) started = now;
        var t = Math.min(1, (now - started) / span);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    cells.forEach(function (el) { io.observe(el); });
  })();

  /* --- Boot readout -------------------------------------------------
     Lines appear in sequence above the headline. The space they occupy
     is reserved in CSS, so the headline never jumps as they arrive —
     a page that shifts under the reader while it loads is exactly the
     kind of unmeasured sloppiness this site is arguing against. */

  (function () {
    var boot = document.querySelector('.boot');
    if (!boot) return;

    var lines = boot.querySelectorAll('li');
    if (!lines.length) return;

    if (still) {
      lines.forEach(function (li) { li.classList.add('on'); });
      return;
    }

    lines.forEach(function (li, i) {
      setTimeout(function () { li.classList.add('on'); }, 180 + i * 260);
    });
  })();

  /* --- Current page in the nav -------------------------------------- */

  (function () {
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(function (a) {
      var target = a.getAttribute('href');
      if (target === here) a.setAttribute('aria-current', 'page');
    });
  })();

})();
