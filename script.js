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
// PARALLAX EFFECT ON HERO BANNER
// ========================================
const hero = document.querySelector('.hero');
const bannerImg = document.querySelector('.banner-img');

if (hero && bannerImg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    
    if (scrolled < heroHeight) {
      const parallaxSpeed = 0.5;
      bannerImg.style.transform = `scale(1.1) translateY(${scrolled * parallaxSpeed}px)`;
    }
  });
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================
const header = document.querySelector('.site-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
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
