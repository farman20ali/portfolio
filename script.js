// ========================================
// FULL-PAGE BACKGROUND STARFIELD
// ========================================
(function initBgCanvas() {
  const bgCanvas = document.getElementById('bg-canvas');
  if (!bgCanvas) return;
  const bgCtx = bgCanvas.getContext('2d');
  let bw, bh;
  const bgStars = [];
  const BG_STAR_COUNT = 180;

  function resizeBg() {
    bw = bgCanvas.width  = window.innerWidth;
    bh = bgCanvas.height = window.innerHeight;
  }

  function makeBgStar() {
    return {
      x: Math.random() * bw,
      y: Math.random() * bh,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.5 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.005 + Math.random() * 0.01,
      speed: 0.02 + Math.random() * 0.04,
    };
  }

  resizeBg();
  for (let i = 0; i < BG_STAR_COUNT; i++) bgStars.push(makeBgStar());

  function animateBg() {
    const isDark = document.body.classList.contains('dark');
    // Light mode: very faint navy, Dark mode: deep space
    if (isDark) {
      bgCtx.fillStyle = 'rgba(5, 8, 20, 0.25)';
    } else {
      bgCtx.fillStyle = 'rgba(240, 245, 255, 0.3)';
    }
    bgCtx.fillRect(0, 0, bw, bh);

    bgStars.forEach(s => {
      s.twinkle += s.twinkleSpeed;
      const a = Math.max(0.05, s.alpha + Math.sin(s.twinkle) * 0.15);
      bgCtx.beginPath();
      bgCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      if (isDark) {
        bgCtx.fillStyle = `rgba(180, 200, 255, ${a})`;
      } else {
        bgCtx.fillStyle = `rgba(60, 80, 160, ${a * 0.5})`;
      }
      bgCtx.fill();
      s.y -= s.speed;
      if (s.y < -2) { s.y = bh + 2; s.x = Math.random() * bw; }
    });

    requestAnimationFrame(animateBg);
  }

  animateBg();
  window.addEventListener('resize', () => {
    resizeBg();
    bgStars.length = 0;
    for (let i = 0; i < BG_STAR_COUNT; i++) bgStars.push(makeBgStar());
  });
})();

// ========================================
// THEME TOGGLE
// ========================================
const themeBtn = document.getElementById('themeBtn');
const body = document.body;
const themeIcon = themeBtn.querySelector('.theme-icon');

function applyTheme(isDark) {
  if (isDark) {
    body.classList.add('dark');
    themeIcon.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    themeIcon.textContent = '🌙';
  }
  localStorage.setItem('site-dark', isDark ? '1' : '0');
}

// Initialize theme from previous selection or system preference
(function initTheme() {
  const saved = localStorage.getItem('site-dark');
  if (saved === null) {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark);
  } else {
    applyTheme(saved === '1');
  }
})();

themeBtn.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark');
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('site-dark', isDark ? '1' : '0');
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = 80; // Account for fixed header
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// FULL UNIVERSE SPACE BACKGROUND
// ========================================
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let mouseX = 0, mouseY = 0;

  // --- Star layers ---
  const layers = [
    { count: 120, radius: [0.3, 0.8],  speed: 0.04, parallax: 0.01, alpha: [0.3, 0.7], color: [200, 210, 255] },
    { count: 60,  radius: [0.8, 1.5],  speed: 0.08, parallax: 0.025, alpha: [0.5, 0.9], color: [180, 200, 255] },
    { count: 25,  radius: [1.5, 2.5],  speed: 0.14, parallax: 0.05,  alpha: [0.7, 1.0], color: [255, 240, 200] },
  ];
  let stars = [];

  // --- Shooting stars ---
  let shootingStars = [];

  // Nebula blobs (static, painted each frame)
  const nebulae = [
    { x: 0.25, y: 0.35, rx: 0.38, ry: 0.55, r: 80, g: 40, b: 140, a: 0.07 },
    { x: 0.75, y: 0.55, rx: 0.35, ry: 0.45, r: 20, g: 60, b: 160, a: 0.08 },
    { x: 0.5,  y: 0.15, rx: 0.55, ry: 0.28, r: 100, g: 20, b: 120, a: 0.05 },
  ];

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.04;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.04;
  });

  function makeStar(layer) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: layer.radius[0] + Math.random() * (layer.radius[1] - layer.radius[0]),
      speed: layer.speed * (0.7 + Math.random() * 0.6),
      parallax: layer.parallax,
      baseAlpha: layer.alpha[0] + Math.random() * (layer.alpha[1] - layer.alpha[0]),
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.008 + Math.random() * 0.015,
      color: layer.color,
      twinkleAngle: Math.random() * Math.PI * 2,
    };
  }

  function makeShootingStar() {
    const angle = (-20 + Math.random() * -30) * (Math.PI / 180);
    return {
      x: Math.random() * width * 1.2,
      y: Math.random() * height * 0.5,
      len: 80 + Math.random() * 120,
      speed: 10 + Math.random() * 14,
      alpha: 1,
      vx: Math.cos(angle) * (10 + Math.random() * 14),
      vy: Math.sin(angle) * (10 + Math.random() * 14) + 2,
      active: false,
      timer: Math.random() * 300,
    };
  }

  function init() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = document.querySelector('.hero').offsetHeight || window.innerHeight;
    stars = [];
    layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) stars.push(makeStar(layer));
    });
    shootingStars = Array.from({ length: 4 }, makeShootingStar);
  }

  function drawNebulae() {
    nebulae.forEach(n => {
      const gx = n.x * width  + mouseX * 0.3;
      const gy = n.y * height + mouseY * 0.3;
      const grad = ctx.createRadialGradient(
        gx, gy, 0,
        gx, gy, Math.max(width * n.rx, height * n.ry)
      );
      grad.addColorStop(0,   `rgba(${n.r},${n.g},${n.b},${n.a})`);
      grad.addColorStop(0.5, `rgba(${n.r},${n.g},${n.b},${n.a * 0.4})`);
      grad.addColorStop(1,   `rgba(${n.r},${n.g},${n.b},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    });
  }

  let tick = 0;
  function animate() {
    tick++;
    // Space-dark background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0,   '#020408');
    bgGrad.addColorStop(0.5, '#050c18');
    bgGrad.addColorStop(1,   '#030810');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    drawNebulae();

    // Draw & update stars
    stars.forEach(s => {
      s.twinkleAngle += s.twinkleSpeed;
      const alpha = Math.max(0.05, s.baseAlpha + Math.sin(s.twinkleAngle + s.twinkleOffset) * 0.25);
      const px = s.x + mouseX * s.parallax * 20;
      const py = s.y + mouseY * s.parallax * 20;
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${alpha})`;
      ctx.fill();
      // Slow drift upward
      s.y -= s.speed;
      if (s.y + s.r < 0) { s.y = height + s.r; s.x = Math.random() * width; }
    });

    // Shooting stars
    shootingStars.forEach((ss, i) => {
      if (!ss.active) {
        ss.timer--;
        if (ss.timer <= 0) { ss.active = true; ss.alpha = 1; }
        return;
      }
      // Trail
      const grad = ctx.createLinearGradient(
        ss.x, ss.y,
        ss.x - ss.vx * (ss.len / ss.speed),
        ss.y - ss.vy * (ss.len / ss.speed)
      );
      grad.addColorStop(0, `rgba(255,255,255,${ss.alpha})`);
      grad.addColorStop(1, `rgba(180,200,255,0)`);
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.vx * (ss.len / ss.speed), ss.y - ss.vy * (ss.len / ss.speed));
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.alpha -= 0.018;
      if (ss.alpha <= 0 || ss.x > width + 50 || ss.y > height + 50) {
        shootingStars[i] = makeShootingStar();
      }
    });

    requestAnimationFrame(animate);
  }

  init();
  animate();
  window.addEventListener('resize', init);
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================
const header = document.querySelector('.site-header');
const scrollDownArrow = document.querySelector('.scroll-down-arrow');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
    // Hide scroll down arrow when scrolling down
    if (scrollDownArrow) {
      scrollDownArrow.classList.add('hidden');
    }
  } else {
    header.classList.remove('scrolled');
    // Show scroll down arrow when at top
    if (scrollDownArrow) {
      scrollDownArrow.classList.remove('hidden');
    }
  }
  
  lastScroll = currentScroll;
});

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Optionally unobserve after animation
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with scroll-reveal class
document.querySelectorAll('.scroll-reveal').forEach(el => {
  observer.observe(el);
});

// ========================================
// SKILL CARDS STAGGERED ANIMATION
// ========================================
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      skillCards.forEach((card, index) => {
        setTimeout(() => {
          card.style.animationDelay = `${index * 0.05}s`;
        }, index * 50);
      });
      skillObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

if (skillCards.length > 0) {
  skillObserver.observe(skillCards[0]);
}

// ========================================
// ENHANCED CURSOR EFFECT (OPTIONAL)
// ========================================
const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .stat-card');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.cursor = 'pointer';
  });
});

// ========================================
// PERFORMANCE: REDUCE MOTION FOR USERS WHO PREFER IT
// ========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Disable animations for users who prefer reduced motion
  document.documentElement.style.setProperty('--transition-fast', '0s');
  document.documentElement.style.setProperty('--transition-base', '0s');
  document.documentElement.style.setProperty('--transition-slow', '0s');
}

// ========================================
// STATS COUNTER ANIMATION (OPTIONAL ENHANCEMENT)
// ========================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (element.dataset.suffix || '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (element.dataset.suffix || '');
    }
  }, 16);
}

// Observe stat cards and trigger counter animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const text = target.textContent.trim();
      const numMatch = text.match(/\d+/);
      
      if (numMatch) {
        const number = parseInt(numMatch[0]);
        const suffix = text.replace(number.toString(), '').trim();
        target.dataset.suffix = suffix;
        animateCounter(target, number, 1500);
      }
      
      statsObserver.unobserve(target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
  statsObserver.observe(stat);
});

// ========================================
// LAZY LOAD IMAGES (IF NEEDED)
// ========================================
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// ========================================
// BACK TO TOP BUTTON
// ========================================
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ========================================
// CONSOLE EASTER EGG
// ========================================
console.log('%c👋 Hello, fellow developer!', 'font-size: 20px; color: #3b82f6; font-weight: bold;');
console.log('%cLike what you see? Let\'s connect!', 'font-size: 14px; color: #64748b;');
console.log('%c🔗 https://github.com/farman20ali', 'font-size: 12px; color: #8b5cf6;');

// ========================================
// 3D TILT EFFECT FOR CARDS
// ========================================
const tiltCards = document.querySelectorAll('.tilt-card, .skill-category');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    if(window.innerWidth < 768) return; // Disable on mobile
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5; // Max rotation 5deg
    const rotateY = ((x - centerX) / centerX) * 5;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'none';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease';
  });
});

// ========================================
// MAGNETIC BUTTON EFFECT
// ========================================
const magneticBtns = document.querySelectorAll('.magnetic-btn');
magneticBtns.forEach(btn => {
  btn.addEventListener('mousemove', e => {
    if(window.innerWidth < 768) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0px, 0px)';
    btn.style.transition = 'transform 0.3s ease';
  });
  
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'none';
  });
});

// ========================================
// AMBIENT MOUSE GLOW
// ========================================
const mouseGlow = document.createElement('div');
mouseGlow.id = 'mouse-glow';
document.body.appendChild(mouseGlow);

document.addEventListener('mousemove', e => {
  if(window.innerWidth < 768) {
    mouseGlow.style.opacity = '0';
    return;
  }
  mouseGlow.style.opacity = '1';
  mouseGlow.style.left = `${e.clientX}px`;
  mouseGlow.style.top = `${e.clientY}px`;
});

document.addEventListener('mouseleave', () => {
  mouseGlow.style.opacity = '0';
});

// ========================================
// MOBILE MENU TOGGLE (with overlay)
// ========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.getElementById('nav-overlay');
const navLinksItems = document.querySelectorAll('.nav-link');

function closeMobileMenu() {
  if (mobileMenuBtn) mobileMenuBtn.classList.remove('open');
  if (navLinks) navLinks.classList.remove('active');
  if (navOverlay) navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('open', isOpen);
    if (navOverlay) navOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinksItems.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }
}

// ========================================
// TERMINAL ANIMATION
// ========================================
const terminalBody = document.getElementById('terminal-body');
if (terminalBody) {
  const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lines = terminalBody.querySelectorAll('.terminal-output, .terminal-line.hidden');
        let delay = 1000;
        
        lines.forEach((line, index) => {
          setTimeout(() => {
            line.classList.remove('hidden');
          }, delay);
          // add random variance to terminal output
          delay += Math.random() * 400 + 400; 
        });
        
        terminalObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  
  terminalObserver.observe(terminalBody);
}

// ========================================
// TYPEWRITER EFFECT
// ========================================
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'Software Engineer',
    'Backend Systems Architect',
    'FinTech Developer',
    'Distributed Systems Engineer',
    'Microservices Specialist',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const TYPING_SPEED = 80, DELETE_SPEED = 40, PAUSE = 2200;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? DELETE_SPEED : TYPING_SPEED);
  }
  setTimeout(tick, 800);
})();

// ========================================
// SCROLL PROGRESS BAR
// ========================================
const scrollProgressBar = document.getElementById('scroll-progress');
if (scrollProgressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = pct + '%';
  }, { passive: true });
}

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');
  if (!sections.length || !navItems.length) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(sec => sectionObserver.observe(sec));
})();
