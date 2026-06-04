/* ==============================
   main.js — Dev Duo Landing
   ============================== */




// ── Nav scroll effect ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});


// ── Hamburger mobile menu ──
const hamburger = document.getElementById('hamburger');

// Create mobile nav dynamically
const mobileNav = document.createElement('div');
mobileNav.className = 'nav-mobile';
const links = ['Inicio|#hero','Nosotros|#about','Skills|#skills','Tech Stack|#tech','Proyectos|#projects','Contacto|#contact'];
links.forEach(l => {
  const [text, href] = l.split('|');
  const a = document.createElement('a');
  a.textContent = text;
  a.href = href;
  a.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.appendChild(a);
});
document.body.appendChild(mobileNav);

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});


// ── Counter animation ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('.stat-num');
let countersAnimated = false;

function checkCounters() {
  if (countersAnimated) return;
  const hero = document.getElementById('hero');
  const rect = hero.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9) {
    countersAnimated = true;
    counters.forEach((el, i) => {
      setTimeout(() => animateCounter(el), i * 200);
    });
  }
}


// ── Skill bars animation ──
function animateSkillBars() {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && bar.style.width === '') {
      bar.style.width = bar.dataset.w + '%';
    }
  });
}


// ── Reveal on scroll ──
function revealElements() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', () => {
  revealElements();
  animateSkillBars();
  checkCounters();
});

// Run on load
revealElements();
checkCounters();
setTimeout(animateSkillBars, 300);


// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--accent)'
      : '';
  });
});


// ── Contact form ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"] span:first-child');
    const arrow = form.querySelector('.arrow');
    btn.textContent   = '✓ Mensaje enviado';
    arrow.textContent = '';
    form.querySelector('button').style.background = '#10b981';
    form.querySelector('button').style.boxShadow  = '0 0 20px rgba(16,185,129,0.4)';
    setTimeout(() => {
      btn.textContent   = 'Enviar Mensaje';
      arrow.textContent = '→';
      form.querySelector('button').style.background = '';
      form.querySelector('button').style.boxShadow  = '';
      form.reset();
    }, 3000);
  });
}


// ── Parallax glow orbs in hero ──
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const orb1 = document.querySelector('.orb1');
  const orb2 = document.querySelector('.orb2');
  if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
});


// ── Smooth scroll for all anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── Typewriter effect in code window ──
const codeBody = document.querySelector('.code-body code');
if (codeBody) {
  const originalHTML = codeBody.innerHTML;
  let visible = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !visible) {
        visible = true;
        codeBody.innerHTML = '';
        let i = 0;
        const chars = originalHTML.split('');
        const type = () => {
          if (i < chars.length) {
            codeBody.innerHTML = originalHTML.slice(0, i + 1);
            i++;
            setTimeout(type, i < 20 ? 60 : 12);
          }
        };
        type();
      }
    });
  }, { threshold: 0.3 });

  const codeWindow = document.querySelector('.code-window');
  if (codeWindow) observer.observe(codeWindow);
}

// Forzar visibilidad después de cargar
window.addEventListener('load', () => {
  setTimeout(() => {
    revealElements();
    animateSkillBars();
  }, 100);
});