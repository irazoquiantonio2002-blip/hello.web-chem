/* ==========================================================
   CHEM — Asesoría Financiera
   ========================================================== */

// ── Configuración de contacto ──────────────────────────────
// Reemplaza con el número real de WhatsApp de Chem (formato: lada país +
// lada local + número, solo dígitos). Ejemplo: "5215512345678".
// Mientras esté vacío, los botones de WhatsApp mostrarán un aviso en
// lugar de abrir una conversación con un número inválido o ajeno.
const WHATSAPP_NUMBER = "";

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initHeroCanvas();
  initMarquee();
  initReveal();
  initStatCounters();
  initWhatsAppLinks();
  initContactForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ── Loader ─────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  const fill = loader.querySelector('.loader-bar-fill');
  requestAnimationFrame(() => { fill.style.width = '100%'; });

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      document.body.classList.add('loaded');
    }, 450);
  });

  // Fallback in case 'load' fires before the listener attaches
  if (document.readyState === 'complete') {
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      document.body.classList.add('loaded');
    }, 450);
  }
}

/* ── Navbar scroll state ────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const toggle = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ── Mobile menu ────────────────────────────────────────── */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mob-menu');

  const close = () => {
    btn.classList.remove('active');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ── Hero canvas: floating particle orbs ───────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h, raf;

  function resize() {
    const hero = document.getElementById('hero');
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function makeParticles() {
    const count = window.innerWidth < 700 ? 18 : 36;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + .6,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      a: Math.random() * .5 + .15
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 107, 107, ${p.a})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(tick);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  resize();
  makeParticles();
  if (!prefersReducedMotion) tick();

  window.addEventListener('resize', () => {
    resize();
    makeParticles();
  });
}

/* ── Marquee content ───────────────────────────────────── */
function initMarquee() {
  const el = document.getElementById('marquee');
  if (!el) return;
  const items = [
    'RETIRO DE AFORE POR DESEMPLEO',
    'CRÉDITO MEJORAVIT',
    'TRÁMITE 100% GARANTIZADO',
    'SIN PAGOS POR ADELANTADO',
    'ASESORÍA GRATUITA'
  ];
  const block = items.map(t => `<span>${t}<span class="sep">✦</span></span>`).join('');
  // Duplicated once so the CSS translateX(-50%) loop is seamless
  el.innerHTML = block + block;
}

/* ── Scroll reveal ──────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach(el => el.classList.add('active'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Stat counters ──────────────────────────────────────── */
function initStatCounters() {
  const nums = document.querySelectorAll('.stat-num');
  if (nums.length === 0) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = prefix + value.toLocaleString('es-MX') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    nums.forEach(animate);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  nums.forEach(el => observer.observe(el));
}

/* ── WhatsApp links / floating button / footer icon ───── */
function initWhatsAppLinks() {
  const links = document.querySelectorAll('.js-wa-link');

  links.forEach(link => {
    if (WHATSAPP_NUMBER) {
      const message = link.dataset.waMessage || 'Hola, me gustaría más información.';
      link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showConfigToast();
      });
    }
  });
}

let toastTimer;
function showConfigToast() {
  let toast = document.querySelector('.chem-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'chem-toast';
    toast.textContent = 'Falta configurar el número de WhatsApp en js/main.js (constante WHATSAPP_NUMBER) para activar este botón.';
    document.body.appendChild(toast);
  }
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}

/* ── Contact form → WhatsApp ───────────────────────────── */
function initContactForm() {
  const form = document.getElementById('wa-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('f-name').value.trim();
    const interest = document.getElementById('f-interest').value;
    const msg = document.getElementById('f-msg').value.trim();

    if (!name || !msg) return;

    if (!WHATSAPP_NUMBER) {
      showConfigToast();
      return;
    }

    const text =
      `Hola, soy ${name}.\n` +
      `Trámite de interés: ${interest}\n` +
      `Detalle: ${msg}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  });
}
