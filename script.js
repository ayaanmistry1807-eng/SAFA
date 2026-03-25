/* ═══════════════════════════════════════════
   SAFA – Saeed Ahmed Football Academy
   script.js  |  Interactions & Animations
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────
     1. PRELOADER
  ────────────────────────────── */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 900);
  });

  /* ──────────────────────────────
     2. NAVBAR – scroll behaviour
  ────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 60;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // init

  /* ──────────────────────────────
     3. MOBILE MENU
  ────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Animate spans
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  /* ──────────────────────────────
     4. HERO PARTICLES (floating balls)
  ────────────────────────────── */
  const particlesContainer = document.getElementById('particles');

  const createParticle = () => {
    const el = document.createElement('div');
    const size = Math.random() * 18 + 6;
    const startX = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 10;
    const opacity = Math.random() * 0.12 + 0.04;

    el.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${startX}%;
      bottom: -${size}px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8), rgba(100,100,100,0.4));
      opacity: ${opacity};
      animation: floatUp ${duration}s ${delay}s linear infinite;
      pointer-events: none;
    `;
    particlesContainer.appendChild(el);
  };

  // Inject keyframes for particles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes floatUp {
      0%   { transform: translateY(0) rotate(0deg); opacity: var(--op, 0.08); }
      50%  { opacity: var(--op, 0.12); }
      100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);

  for (let i = 0; i < 18; i++) createParticle();

  /* ──────────────────────────────
     5. SCROLL-REVEAL
  ────────────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.stat-item, .program-card, .learn-item, .about-img-wrap, .about-text, ' +
    '.coach-visual, .coach-text, .gallery-item, .contact-info, .contact-form-wrap, ' +
    '.info-item, .about-badge-cert'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ──────────────────────────────
     6. ANIMATED STAT COUNTERS
  ────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const countUp = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statsObserver.observe(el));

  /* ──────────────────────────────
     7. SMOOTH ACTIVE NAV LINKS
  ────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const activateNav = () => {
    let current = '';
    sections.forEach(section => {
      const sTop = section.offsetTop - 100;
      if (window.scrollY >= sTop) current = section.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}`
        ? 'var(--gold)'
        : '';
    });
  };
  window.addEventListener('scroll', activateNav, { passive: true });

  /* ──────────────────────────────
     8. CONTACT FORM
  ────────────────────────────── */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById('playerName').value.trim();
      const age  = document.getElementById('playerAge').value.trim();
      const num  = document.getElementById('contactNum').value.trim();

      if (!name || !age || !num) {
        shakeForm();
        return;
      }
      if (parseInt(age) < 4) {
        alert('Minimum age for training is 4 years.');
        return;
      }

      // Simulate submission
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Submitting…';
      btn.disabled = true;

      setTimeout(() => {
        form.reset();
        btn.innerHTML = '<i class="fas fa-futbol"></i> Submit Registration';
        btn.disabled = false;
        successMsg.classList.remove('hidden');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide success
        setTimeout(() => successMsg.classList.add('hidden'), 6000);
      }, 1200);
    });
  }

  const shakeForm = () => {
    const wrap = document.querySelector('.contact-form-wrap');
    wrap.style.animation = 'shake 0.4s ease';
    wrap.addEventListener('animationend', () => wrap.style.animation = '', { once: true });

    const shakeKF = document.createElement('style');
    shakeKF.textContent = `
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        20%,60%  { transform: translateX(-8px); }
        40%,80%  { transform: translateX(8px); }
      }
    `;
    if (!document.getElementById('shakeKF')) {
      shakeKF.id = 'shakeKF';
      document.head.appendChild(shakeKF);
    }
  };

  /* ──────────────────────────────
     9. GALLERY LIGHTBOX (simple)
  ────────────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item img');

  galleryItems.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  const openLightbox = (src, alt) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 5000;
      background: rgba(0,0,0,0.92);
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-out;
      animation: lbFadeIn 0.3s ease;
    `;

    const imgEl = document.createElement('img');
    imgEl.src = src;
    imgEl.alt = alt;
    imgEl.style.cssText = `
      max-width: 88vw; max-height: 86vh;
      border-radius: 10px;
      box-shadow: 0 20px 80px rgba(0,0,0,0.8);
      object-fit: contain;
      animation: lbScaleIn 0.3s ease;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      position: absolute; top: 20px; right: 24px;
      background: none; border: none; color: rgba(255,255,255,0.6);
      font-size: 3rem; cursor: pointer; line-height: 1;
      transition: color 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.color = '#fff';
    closeBtn.onmouseout  = () => closeBtn.style.color = 'rgba(255,255,255,0.6)';

    const lbStyle = document.createElement('style');
    lbStyle.textContent = `
      @keyframes lbFadeIn  { from { opacity: 0; } to { opacity: 1; } }
      @keyframes lbScaleIn { from { transform: scale(0.9); opacity:0; } to { transform:scale(1); opacity:1;} }
    `;
    document.head.appendChild(lbStyle);

    overlay.appendChild(imgEl);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.2s';
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
      }, 200);
    };

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }, { once: true });
  };

  /* ──────────────────────────────
     10. HERO SCROLL PARALLAX
  ────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    if (!heroBg) return;
    const offset = window.scrollY;
    heroBg.style.transform = `translateY(${offset * 0.25}px)`;
  }, { passive: true });

  /* ──────────────────────────────
     11. COPY PHONE NUMBER CHIP
  ────────────────────────────── */
  const phoneChip = document.querySelector('.contact-chip[href^="tel"]');
  if (phoneChip) {
    phoneChip.addEventListener('click', (e) => {
      // Also copy to clipboard
      navigator.clipboard?.writeText('9867020937').catch(() => {});
    });
  }

  /* ──────────────────────────────
     12. SCHEDULE DAY HOVER HINT
  ────────────────────────────── */
  const days = document.querySelectorAll('.day');
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  days.forEach((day, i) => {
    day.title = dayNames[i];
  });

  console.log('%c⚽ SAFA – Saeed Ahmed Football Academy', 'color:#C9A227;font-size:1.2rem;font-weight:bold;');
  console.log('%cMumbra, Maharashtra | AIFF D Licensed', 'color:#2E8B57;font-size:0.9rem;');
});