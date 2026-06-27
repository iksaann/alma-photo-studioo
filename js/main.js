/**
 * Alma Photo Studio — Main JavaScript
 */

(function () {
  'use strict';

  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const bookingForm = document.getElementById('booking');
  const bookingStatus = document.getElementById('booking-status');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Page Load ── */

  function initPageLoad() {
    document.body.classList.add('is-loading');

    window.addEventListener('load', () => {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
    });

    setTimeout(() => {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
    }, 1200);
  }

  initPageLoad();

  /* ── Mobile Navigation ── */

  function setMenuOpen(open) {
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.classList.toggle('hidden', !open);
    menuIconOpen.classList.toggle('hidden', open);
    menuIconClose.classList.toggle('hidden', !open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      setMenuOpen(!mobileMenu.classList.contains('is-open'));
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        setMenuOpen(false);
      }
    });
  }

  /* ── Scroll Reveal ── */

  const animatedElements = document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale');

  if (animatedElements.length && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -28px 0px' }
    );

    animatedElements.forEach((el) => revealObserver.observe(el));
  } else {
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* ── Header & Active Nav ── */

  function updateOnScroll() {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 16);
    }

    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });

    if (!prefersReducedMotion) {
      const heroVisual = document.querySelector('.hero-visual');
      if (heroVisual && window.scrollY < window.innerHeight) {
        const offset = window.scrollY * 0.12;
        heroVisual.style.transform = `translateY(${offset}px)`;
      }
    }
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateOnScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  updateOnScroll();

  /* ── Smooth Anchor Navigation ── */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ── Booking Form ── */

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(bookingForm);
      const name = String(formData.get('name') || '').trim();
      const contact = String(formData.get('contact') || '').trim();
      const type = String(formData.get('type') || '').trim();
      const message = String(formData.get('message') || '').trim();

      const text = [
        'Здравствуйте! Хочу записаться на фотосессию.',
        name ? `Имя: ${name}` : '',
        contact ? `Контакт: ${contact}` : '',
        type ? `Формат: ${type}` : '',
        message ? `Комментарий: ${message}` : '',
      ].filter(Boolean).join('\n');

      if (bookingStatus) {
        bookingStatus.textContent = 'Открываю WhatsApp с подготовленным сообщением...';
      }

      window.open(`https://wa.me/77000000000?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
      bookingForm.reset();
    });
  }

  /* ── Portfolio Touch / Hover ── */

  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioItems.forEach((item) => {
    item.addEventListener('touchstart', () => {
      item.classList.add('is-touch');
    }, { passive: true });
  });

  /* ── Button Micro-interaction ── */

  document.querySelectorAll('.btn-primary, .btn-secondary').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      if (prefersReducedMotion) return;
      btn.style.transitionDelay = '0s';
    });
  });

})();
