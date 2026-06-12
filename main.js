(function() {
  'use strict';

// ── Pain point and step data ──
const painItems = [
{
icon:`<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="36" x2="36" y2="36" opacity="0.3" stroke-width="1.2"/><rect x="4" y="20" width="8" height="16" rx="2" fill="currentColor" opacity="0.1"/><rect x="4" y="20" width="8" height="16" rx="2"/><rect x="16" y="10" width="8" height="26" rx="2" fill="currentColor" opacity="0.1"/><rect x="16" y="10" width="8" height="26" rx="2"/><rect x="28" y="26" width="8" height="10" rx="2" fill="currentColor" opacity="0.1"/><rect x="28" y="26" width="8" height="10" rx="2"/><polyline points="32,20 32,26"/><polyline points="29,23 32,26 35,23"/></svg>`,
q:`"I'm profitable on paper but I never have cash."`,
a:`You're growing, invoices are getting paid, but your bank balance keeps dropping. Nobody's explained why.`
},
{
icon:`<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="30" height="27" rx="3"/><line x1="5" y1="16" x2="35" y2="16"/><line x1="13" y1="4" x2="13" y2="12"/><line x1="27" y1="4" x2="27" y2="12"/><line x1="20" y1="22" x2="20" y2="28"/><circle cx="20" cy="32" r="1.5" fill="currentColor" stroke="none"/></svg>`,
q:`"I got a surprise tax bill. My accountant said nothing all year."`,
a:`You filed. You paid. But you had zero warning it was coming.`
},
{
icon:`<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="20,4 36,12 4,12" fill="currentColor" opacity="0.08"/><polygon points="20,4 36,12 4,12"/><rect x="4" y="12" width="32" height="4" rx="1"/><rect x="4" y="32" width="32" height="4" rx="1"/><rect x="8" y="16" width="5" height="16"/><rect x="17" y="16" width="5" height="16"/><rect x="27" y="16" width="5" height="16"/></svg>`,
q:`"I can't get a loan because my books are a disaster."`,
a:`The bank wants clean financials. You have years of chaos.`
},
{
icon:`<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="12" r="7"/><path d="M4 36c0-7 5-12 11-12"/><path d="M29 18c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5c0 2.5-3.5 3-3.5 5"/><circle cx="32.5" cy="27" r="1.5" fill="currentColor" stroke="none"/></svg>`,
q:`"I have no idea if I can afford to hire."`,
a:`You're turning down work but terrified to take on payroll without knowing your real numbers.`
},
{
icon:`<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="16"/><polyline points="20,8 20,20 27,27"/><line x1="20" y1="4" x2="20" y2="6.5"/><line x1="20" y1="33.5" x2="20" y2="36"/><line x1="4" y1="20" x2="6.5" y2="20"/><line x1="33.5" y1="20" x2="36" y2="20"/></svg>`,
q:`"My bookkeeper just quit. Tax season is in 6 weeks."`,
a:`You need someone senior, now, not a junior VA who needs hand-holding.`
}
];
const stepItems = [
{ num:1, title:'Free 30-min discovery call', desc:'I learn your business, your pain, and what you actually need.' },
{ num:2, title:'Diagnostic', desc:'I review your books and send a plain-English summary of what\'s broken and what it\'s costing you.' },
{ num:3, title:'Proposal', desc:'Flat scope, flat rate. No billable-hour surprises.' },
{ num:4, title:'Ongoing', desc:'Monthly reporting, proactive alerts, and a real human who picks up when you have a question.' }
];
// ── Generic cycler ──
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function initCycler({ items, slotId, dotsId, prevBtnId, nextBtnId, intervalMs, renderFn, onAdvance }) {
let current = 0, timer;
const slot     = document.getElementById(slotId);
const dotsWrap = dotsId ? document.getElementById(dotsId) : null;
if (!slot) return null;
const dots = dotsWrap ? dotsWrap.querySelectorAll('.cdot') : [];
function show(idx) {
current = ((idx % items.length) + items.length) % items.length;
dots.forEach((d, i) => { d.classList.toggle('active', i === current); d.setAttribute('aria-selected', i === current); });
slot.classList.remove('flip-in');
slot.innerHTML = renderFn(items[current]);
if (!prefersReduced) { void slot.offsetWidth; slot.classList.add('flip-in'); }
if (onAdvance) onAdvance(current, items.length);
}
function advance() { show(current + 1); }
function startTimer() { timer = setInterval(advance, intervalMs); }
function resetTimer() { clearInterval(timer); startTimer(); }
dots.forEach((d, i) => d.addEventListener('click', () => { show(i); resetTimer(); }));
const prevBtn = prevBtnId ? document.getElementById(prevBtnId) : null;
const nextBtn = nextBtnId ? document.getElementById(nextBtnId) : null;
prevBtn?.addEventListener('click', () => { show(current - 1); resetTimer(); });
nextBtn?.addEventListener('click', () => { show(current + 1); resetTimer(); });
show(0);
startTimer();
return { show, getCurrent: () => current };
}
function renderPain(item) {
return `<div class="cycler-icon" aria-hidden="true">${item.icon}</div><div class="cycler-q">${item.q}</div><div class="cycler-a">${item.a}</div>`;
}
function renderStep(item) {
return `<div class="step-wm" aria-hidden="true">${item.num}</div><div class="step-circle">${item.num}</div><div class="step-cyc-title">${item.title}</div><div class="step-cyc-desc">${item.desc}</div>`;
}
// ── SVG Roadmap updater ──
let roadTotalLen = 0;
const roadFillEl = document.getElementById('roadFill');
if (roadFillEl) {
roadTotalLen = roadFillEl.getTotalLength();
roadFillEl.style.strokeDasharray = roadTotalLen;
roadFillEl.style.strokeDashoffset = roadTotalLen;
}
// ── Car animation along road ──
const roadPathEl  = document.getElementById('roadPath');
const carGroupEl  = document.getElementById('carGroup');
let carStep = 0;
let carAnimId = null;
function animateCar(toStep, total) {
if (!roadPathEl || !carGroupEl) return;
const totalLen = roadPathEl.getTotalLength();
const segLen   = totalLen / (total - 1);
const fromDist = carStep * segLen;
const toDist   = toStep  * segLen;
const startTime = performance.now();
const duration  = 600;
if (carAnimId) cancelAnimationFrame(carAnimId);
carGroupEl.style.display = '';
if (prefersReduced) {
const pt  = roadPathEl.getPointAtLength(toDist);
const pt2 = roadPathEl.getPointAtLength(Math.min(toDist + 2, totalLen));
const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
carGroupEl.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${ang})`);
carStep = toStep;
return;
}
function tick(now) {
const elapsed = now - startTime;
const p = Math.min(elapsed / duration, 1);
const eased = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
const dist = fromDist + (toDist - fromDist) * eased;
const pt   = roadPathEl.getPointAtLength(dist);
const pt2  = roadPathEl.getPointAtLength(Math.min(dist + 2, totalLen));
const ang  = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
carGroupEl.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${ang})`);
if (p < 1) carAnimId = requestAnimationFrame(tick);
else carStep = toStep;
}
requestAnimationFrame(tick);
}
function updateRoadmap(idx, total) {
if (roadFillEl && roadTotalLen > 0) {
const segLen = roadTotalLen / (total - 1);
roadFillEl.style.strokeDashoffset = roadTotalLen - idx * segLen;
}
for (let i = 0; i < total; i++) {
const fc  = document.getElementById('mn' + i + '-fill');
const rng = document.getElementById('mn' + i + '-ring');
const chk = document.getElementById('mn' + i + '-check');
const num = document.getElementById('mn' + i + '-num');
if (!fc) continue;
if (i < idx) {
fc.setAttribute('fill','#0F6E56');
rng?.setAttribute('opacity','0'); rng?.classList.remove('pulse-ring');
chk?.setAttribute('opacity','1'); num?.setAttribute('opacity','0');
} else if (i === idx) {
fc.setAttribute('fill','#0F6E56');
rng?.setAttribute('opacity','0.35'); rng?.classList.add('pulse-ring');
chk?.setAttribute('opacity','0');
num?.setAttribute('fill','#fff'); num?.setAttribute('opacity','1');
} else {
fc.setAttribute('fill','#E5E7EB');
rng?.setAttribute('opacity','0'); rng?.classList.remove('pulse-ring');
chk?.setAttribute('opacity','0');
num?.setAttribute('fill','#9CA3AF'); num?.setAttribute('opacity','1');
}
}
animateCar(idx, total);
}
initCycler({ items:painItems, slotId:'painSlot', dotsId:'painDots', prevBtnId:'painPrev', nextBtnId:'painNext', intervalMs:3500, renderFn:renderPain });
initCycler({
items:stepItems, slotId:'stepCard', dotsId:null, prevBtnId:'stepPrev', nextBtnId:'stepNext',
intervalMs:4000, renderFn:renderStep, onAdvance:updateRoadmap
});
// ── NAV scroll shadow ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });
// ── Hamburger ──
const ham = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
ham.addEventListener('click', () => {
const open = ham.classList.toggle('open');
mobileNav.classList.toggle('open', open);
ham.setAttribute('aria-expanded', open);
mobileNav.setAttribute('aria-hidden', !open);
document.body.style.overflow = open ? 'hidden' : '';
});
mobileNav.querySelectorAll('a').forEach(a => {
a.addEventListener('click', () => {
ham.classList.remove('open');
mobileNav.classList.remove('open');
ham.setAttribute('aria-expanded', 'false');
mobileNav.setAttribute('aria-hidden', 'true');
document.body.style.overflow = '';
});
});
// ── IntersectionObserver scroll animations ──
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
observer.unobserve(entry.target);
}
});
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => observer.observe(el));
// ── Hero parallax with lerp ──
const heroCard = document.getElementById('heroCard');
const hcWraps = document.querySelectorAll('.hc-wrap');
// Different parallax speeds per floating card (0.3 to 1.8)
const hcSpeeds = [0.3, 0.7, 1.2, 0.9, 0.5];
let tx = 0, ty = 0, cx = 0, cy = 0;
const LERP = 0.07;
function lerp(a, b, t) { return a + (b - a) * t; }
function animateParallax() {
cx = lerp(cx, tx, LERP);
cy = lerp(cy, ty, LERP);
if (heroCard) {
heroCard.style.transform = `perspective(1200px) rotateY(${cx * 14}deg) rotateX(${-cy * 9}deg)`;
}
hcWraps.forEach((w, i) => {
const sp = hcSpeeds[i] || 0.5;
// card 5 (top-center) uses translateX(-50%) for centering, preserve it
if (i === 4) {
w.style.transform = `translateX(calc(-50% + ${cx * sp * 22}px)) translateY(${cy * sp * 16}px)`;
} else {
w.style.transform = `translate(${cx * sp * 22}px, ${cy * sp * 16}px)`;
}
});
requestAnimationFrame(animateParallax);
}
document.addEventListener('mousemove', (e) => {
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
tx = (e.clientX / window.innerWidth  - 0.5) * 2;
ty = (e.clientY / window.innerHeight - 0.5) * 2;
}
}, { passive: true });
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth >= 768) {
animateParallax();
}
document.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
// ── Stat strip countup on scroll ──
const stripNums = document.querySelectorAll('#stat-strip [data-count]');
let counted = false;
const stripObserver = new IntersectionObserver((entries) => {
if (entries[0].isIntersecting && !counted) {
counted = true;
stripNums.forEach(el => {
const target = parseInt(el.dataset.count, 10);
const suffix = el.dataset.suffix || '';
const duration = 1400;
const start = performance.now();
function tick(now) {
const p = Math.min((now - start) / duration, 1);
const eased = 1 - Math.pow(1 - p, 3);
el.textContent = Math.floor(eased * target) + suffix;
if (p < 1) requestAnimationFrame(tick);
else el.textContent = target + suffix;
}
requestAnimationFrame(tick);
});
}
}, { threshold: 0.5 });
const strip = document.getElementById('stat-strip');
if (strip) stripObserver.observe(strip);
// ── Who I work with background parallax ──
function updateWhoParallax() {
const who = document.getElementById('who');
if (!who) return;
const rect = who.getBoundingClientRect();
if (rect.bottom < 0 || rect.top > window.innerHeight) return;
const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
const yPos = 55 + (progress - 0.5) * 22;
who.style.background = `radial-gradient(ellipse 70% 55% at 50% ${yPos.toFixed(1)}%, rgba(15,110,86,0.055) 0%, transparent 70%), #ffffff`;
}
window.addEventListener('scroll', () => {
updateWhoParallax();
}, { passive: true });
// ── Bridge animated underline ──
const financeUnderline = document.querySelector('.finance-underline');
if (financeUnderline) {
const bridgeObs = new IntersectionObserver((entries) => {
if (entries[0].isIntersecting) { financeUnderline.classList.add('drawn'); bridgeObs.disconnect(); }
}, { threshold: 0.3 });
const bridgeSec = document.getElementById('bridge');
if (bridgeSec) bridgeObs.observe(bridgeSec);
}
// ── Tech stack category stagger ──
const tsContainer = document.querySelector('.ts-float');
if (tsContainer) {
const tsObs = new IntersectionObserver((entries) => {
if (entries[0].isIntersecting) {
tsContainer.querySelectorAll('.ts-category').forEach((c, i) => {
if (prefersReduced) { c.classList.add('visible'); }
else { setTimeout(() => c.classList.add('visible'), i * 60); }
});
tsObs.disconnect();
}
}, { threshold: 0.08 });
tsObs.observe(tsContainer);
}
// ── Reveal-tag and reveal-h2 observers ──
document.querySelectorAll('.reveal-tag, .reveal-h2').forEach(el => observer.observe(el));
// ── Floating sticky CTA: hide while hero is visible ──
const stickyCta = document.getElementById('stickyCta');
if (stickyCta) {
const heroEl = document.getElementById('hero');
if (heroEl) {
const heroObs = new IntersectionObserver((entries) => {
stickyCta.classList.toggle('visible', !entries[0].isIntersecting);
}, { threshold: 0.1 });
heroObs.observe(heroEl);
}
}
// ── FAQ accordion ──
document.querySelectorAll('.faq-q').forEach(btn => {
btn.addEventListener('click', () => {
const item = btn.closest('.faq-item');
const isOpen = item.classList.contains('open');
document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
if (!isOpen) item.classList.add('open');
});
});
// ── Reviews carousel ──
(function() {
const stack = document.getElementById('revStack');
if (!stack) return;
const cards = Array.from(stack.querySelectorAll('.rev-card'));
const n = cards.length;
let current = 0;
let isAnimating = false;
let revTimer;
function render() {
const peekIdx = (current + 1) % n;
cards.forEach((c, i) => {
c.classList.remove('is-front','is-peek','is-hidden','is-exit');
if (i === current) c.classList.add('is-front');
else if (i === peekIdx) c.classList.add('is-peek');
else c.classList.add('is-hidden');
});
}
function goTo(nextIdx) {
if (isAnimating) return;
nextIdx = ((nextIdx % n) + n) % n;
if (nextIdx === current) return;
isAnimating = true;
const oldIdx = current;
current = nextIdx;
const newPeekIdx = (current + 1) % n;
cards[oldIdx].classList.remove('is-front');
cards[oldIdx].classList.add('is-exit');
cards[current].classList.remove('is-peek','is-hidden');
cards[current].classList.add('is-front');
cards.forEach((c, i) => {
if (i !== oldIdx && i !== current) {
c.classList.remove('is-front','is-peek','is-exit');
c.classList.add(i === newPeekIdx ? 'is-peek' : 'is-hidden');
}
});
setTimeout(() => {
cards[oldIdx].classList.remove('is-exit');
cards[oldIdx].classList.add('is-hidden');
isAnimating = false;
}, 520);
}
function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }
function startTimer() { revTimer = setInterval(next, 5000); }
function resetTimer() { clearInterval(revTimer); startTimer(); }
render();
startTimer();
document.getElementById('revNext')?.addEventListener('click', () => { next(); resetTimer(); });
document.getElementById('revPrev')?.addEventListener('click', () => { prev(); resetTimer(); });
})();
(function() {
const colInners = [
document.querySelector('.who-col-1 .who-col-inner'),
document.querySelector('.who-col-2 .who-col-inner'),
document.querySelector('.who-col-3 .who-col-inner')
];
function pause() { colInners.forEach(el => { if (el) el.style.animationPlayState = 'paused'; }); }
function resume() { colInners.forEach(el => { if (el) el.style.animationPlayState = 'running'; }); }
document.querySelectorAll('.who-ind-card').forEach(card => {
card.addEventListener('mouseenter', pause);
card.addEventListener('mouseleave', resume);
});
})();
})();
