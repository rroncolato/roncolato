const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Entrada dos elementos — com sequência (stagger) entre irmãos */
const reveals = document.querySelectorAll('.reveal');
const groups = new Map();
reveals.forEach(el => {
  const parent = el.parentElement;
  const i = groups.get(parent) || 0;
  el.style.setProperty('--d', Math.min(i, 6) * 90 + 'ms');
  groups.set(parent, i + 1);
});
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
reveals.forEach(el => revealObserver.observe(el));

/* Zoom de chegada da foto da seção 05 */
const scaleSection = document.querySelector('.scale');
if (scaleSection) {
  const scaleObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { scaleSection.classList.add('in-view'); scaleObserver.unobserve(scaleSection); }
  }), { threshold: .2 });
  scaleObserver.observe(scaleSection);
}

/* Scroll suave (Lenis) */
let lenis = null;
if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({ lerp: .085, smoothWheel: true, anchors: true });
  const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

/* Barra de progresso + parallax das fotos */
const progress = document.querySelector('.progress i');
const parallax = [...document.querySelectorAll('[data-parallax]')];
let ticking = false;
function update() {
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  if (!reduceMotion) {
    parallax.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const offset = (r.top + r.height / 2 - vh / 2) * -0.06;
      el.style.setProperty('--py', Math.max(-40, Math.min(40, offset)).toFixed(1) + 'px');
    });
  }
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
window.addEventListener('resize', update);
update();

document.querySelector('#year').textContent = new Date().getFullYear();
