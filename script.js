'use strict';

// Reveal-on-scroll: anything with .reveal, .reveal-up or .reveal-line gets
// an .in-view class the first time it enters the viewport.
const revealTargets = document.querySelectorAll('.reveal, .reveal-up, .reveal-line');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
);
revealTargets.forEach((el) => revealObserver.observe(el));

// Navbar background switches once the hero has mostly scrolled past.
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle.
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }),
);

// Animated stat counters — start once the About section scrolls into view.
const statEls = document.querySelectorAll('.stat-num');
const countUp = (el) => {
  const target = Number(el.dataset.count || 0);
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
};
if (statEls.length) {
  const statsObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statEls.forEach(countUp);
          obs.disconnect();
        }
      });
    },
    { threshold: 0.4 },
  );
  statsObserver.observe(statEls[0].closest('.about-stats'));
}
