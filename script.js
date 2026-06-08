/* ==============================
   main.js — Dev Duo Landing
   ============================== */




// ── Nav scroll effect ──
// Cambia el estilo del nav al hacer scroll: agrega/quita clase 'scrolled' si scrollY > 60px
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});


// ── Hamburger mobile menu ──
// Crea un menú móvil fullscreen con los mismos links del nav
const hamburger = document.getElementById('hamburger');

const mobileNav = document.createElement('div');
mobileNav.className = 'nav-mobile';
const links = ['Inicio|#hero','Nosotros|#about','Skills|#skills','Tech Stack|#tech','Proyectos|#projects','Contacto|#contact'];
links.forEach(l => {
  const [text, href] = l.split('|');
  const a = document.createElement('a');
  a.textContent = text;
  a.href = href;
  a.addEventListener('click', () => mobileNav.classList.remove('open')); // cierra menú al hacer clic
  mobileNav.appendChild(a);
});
document.body.appendChild(mobileNav);

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open'); // togglea visibilidad del menú
});


// ── Counter animation ──
// Anima los números desde 0 hasta el valor en data-target con easing cuártico
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4); // easing: easeOutQuart
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target; // asegura valor exacto al final
  };
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('.stat-num');
let countersAnimated = false;

function checkCounters() {
  if (countersAnimated) return; // solo se anima una vez
  const hero = document.getElementById('hero');
  const rect = hero.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9) { // cuando hero esté visible
    countersAnimated = true;
    counters.forEach((el, i) => {
      setTimeout(() => animateCounter(el), i * 200); // cada contador con retardo escalonado
    });
  }
}


// ── Skill bars animation ──
// Anima las barras de habilidades: les asigna el ancho desde data-w cuando entran al viewport
function animateSkillBars() {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && bar.style.width === '') {
      bar.style.width = bar.dataset.w + '%'; // asigna ancho (ej: "92%")
    }
  });
}


// ── Reveal on scroll ──
// Agrega clase 'visible' a elementos con clase .reveal cuando entran al 90% del viewport
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

// Ejecuta animaciones al cargar la página
revealElements();
checkCounters();
setTimeout(animateSkillBars, 300); // pequeño retardo para mejor efecto visual


// ── Active nav link on scroll ──
// Resalta el link de navegación de la sección actual según el scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.id; // última sección que pasó
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--accent)' // link activo → color acento
      : ''; // resto → color por defecto
  });
});


// ── Contact form ──
// Simula envío de formulario: muestra feedback visual y resetea después de 3s
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault(); // evita recarga/reenvío real
    const btn = form.querySelector('button[type="submit"] span:first-child');
    const arrow = form.querySelector('.arrow');
    btn.textContent   = '✓ Mensaje enviado';
    arrow.textContent = '';
    form.querySelector('button').style.background = '#10b981'; // verde
    form.querySelector('button').style.boxShadow  = '0 0 20px rgba(16,185,129,0.4)';
    setTimeout(() => {
      btn.textContent   = 'Enviar Mensaje';
      arrow.textContent = '→';
      form.querySelector('button').style.background = '';
      form.querySelector('button').style.boxShadow  = '';
      form.reset(); // limpia campos
    }, 3000);
  });
}


// ── Parallax glow orbs in hero ──
// Las esferas brillantes del hero siguen el mouse con movimiento inverso (parallax)
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const orb1 = document.querySelector('.orb1');
  const orb2 = document.querySelector('.orb2');
  if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`; // orb2 se mueve en dirección opuesta y más lento
});


// ── Smooth scroll for all anchor links ──
// Todos los links internos (#) hacen scroll suave en vez de salto instantáneo
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault(); // evita el salto brusco
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── Typewriter effect in code window ──
// Efecto de máquina de escribir en el bloque de código del hero al hacerse visible
const codeBody = document.querySelector('.code-body code');
if (codeBody) {
  const originalHTML = codeBody.innerHTML;
  let visible = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !visible) { // primera vez que entra al viewport
        visible = true;
        codeBody.innerHTML = '';
        let i = 0;
        const chars = originalHTML.split('');
        const type = () => {
          if (i < chars.length) {
            codeBody.innerHTML = originalHTML.slice(0, i + 1); // revela carácter por carácter
            i++;
            setTimeout(type, i < 20 ? 60 : 12); // más rápido después de los primeros 20 caracteres
          }
        };
        type();
      }
    });
  }, { threshold: 0.3 }); // se activa cuando el 30% del elemento es visible

  const codeWindow = document.querySelector('.code-window');
  if (codeWindow) observer.observe(codeWindow);
}

// Forzar animaciones al cargar la página (por si scroll no las activó)
window.addEventListener('load', () => {
  setTimeout(() => {
    revealElements();
    animateSkillBars();
  }, 100);
});