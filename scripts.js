/**
 * Shadow Demon Cult — Core Interactions
 * IntersectionObserver scroll animations, smooth scroll, mobile menu
 */

(() => {
  'use strict';

  // ============================================================
  // Scroll Reveal with IntersectionObserver
  // ============================================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal for performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  });

  // Observe all .reveal elements
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Also observe .stagger containers
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  document.querySelectorAll('.stagger').forEach(el => staggerObserver.observe(el));

  // ============================================================
  // Header Scroll Effect
  // ============================================================
  const header = document.querySelector('.topbar');
  let lastScrollY = window.scrollY;

  const onScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  // Initial check
  onScroll();

  // ============================================================
  // Mobile Menu Toggle
  // ============================================================
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      menuBtn.innerHTML = isOpen
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    });

    // Close menu on nav link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
      }
    });
  }

  // ============================================================
  // Active Nav Link Highlighting
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  const activateNav = () => {
    const scrollY = window.scrollY + 120; // offset for header

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === `#${id}`) {
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', activateNav, { passive: true });
  activateNav(); // initial

  // ============================================================
  // Smooth Scroll for Anchor Links (fallback for older browsers)
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

        // Update URL without jump
        history.pushState(null, '', targetId);
      }
    });
  });

  // ============================================================
  // Parallax Hero Portrait (subtle)
  // ============================================================
  const portraitImg = document.querySelector('.portrait img');
  if (portraitImg) {
    const parallax = () => {
      const scrollY = window.scrollY;
      const speed = 0.15;
      portraitImg.style.transform = `translateY(${scrollY * speed}px) scale(1.02)`;
    };
    window.addEventListener('scroll', parallax, { passive: true });
  }

  // ============================================================
  // Image Lazy Loading Enhancement
  // ============================================================
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.loading = 'lazy';
    });
  } else {
    // Fallback IntersectionObserver lazy loading
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          lazyObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));
  }

  // ============================================================
  // Keyboard Navigation Enhancement
  // ============================================================
  document.addEventListener('keydown', (e) => {
    // Escape closes mobile menu
    if (e.key === 'Escape' && nav?.classList.contains('open')) {
      nav.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
      menuBtn?.focus();
    }
  });

  // ============================================================
  // Performance: Reduce animations on low-end devices
  // ============================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition', '0s');
  }

  prefersReducedMotion.addEventListener('change', (e) => {
    document.documentElement.style.setProperty('--transition', e.matches ? '0s' : '0.3s cubic-bezier(0.4, 0, 0.2, 1)');
  });

  // ============================================================
  // Console Signature
  // ============================================================
  console.log('%c🌑 Shadow Demon Cult %c— Тьма помнит своих.',
    'font-size: 14px; color: #a855f7; font-weight: bold;',
    'font-size: 12px; color: #c3b5dd;'
  );
})();