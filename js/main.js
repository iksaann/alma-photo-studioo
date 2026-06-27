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
  const instagramLink = document.getElementById('instagram-link');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const siteConfig = window.ALMA_PHOTO_CONFIG || {};

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

  /* ── Project Config Links ── */

  if (instagramLink && siteConfig.instagramUrl) {
    instagramLink.href = siteConfig.instagramUrl;
  }

  /* ── FAQ Accordion ── */

  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const answerId = question.getAttribute('aria-controls');
      const answer = answerId ? document.getElementById(answerId) : null;
      const shouldOpen = question.getAttribute('aria-expanded') !== 'true';

      faqQuestions.forEach((otherQuestion) => {
        const otherAnswerId = otherQuestion.getAttribute('aria-controls');
        const otherAnswer = otherAnswerId ? document.getElementById(otherAnswerId) : null;
        otherQuestion.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.hidden = true;
      });

      question.setAttribute('aria-expanded', String(shouldOpen));
      if (answer) answer.hidden = !shouldOpen;
    });
  });

  /* ── Portfolio Touch / Hover ── */

  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioItems.forEach((item) => {
    item.addEventListener('touchstart', () => {
      item.classList.add('is-touch');
    }, { passive: true });
  });

  /* ── Portfolio Modal Gallery ── */

  const portfolioModal = document.getElementById('portfolio-modal');
  const modalImage = document.getElementById('portfolio-modal-image');
  const modalTitle = document.getElementById('portfolio-modal-title');
  const modalCaption = document.getElementById('portfolio-modal-caption');
  const modalClose = portfolioModal ? portfolioModal.querySelector('.portfolio-modal__close') : null;
  const modalPrev = portfolioModal ? portfolioModal.querySelector('.portfolio-modal__nav--prev') : null;
  const modalNext = portfolioModal ? portfolioModal.querySelector('.portfolio-modal__nav--next') : null;
  let activePortfolioIndex = 0;
  let lastFocusedElement = null;
  let previousBodyOverflow = '';

  const portfolioGallery = Array.from(portfolioItems).map((item) => {
    const image = item.querySelector('img');
    const category = item.querySelector('figcaption span');
    const caption = item.querySelector('figcaption em');

    return {
      item,
      src: image ? image.currentSrc || image.src : '',
      alt: image ? image.alt : '',
      title: category ? category.textContent.trim() : 'Портфолио',
      caption: caption ? caption.textContent.trim() : '',
    };
  });

  function renderPortfolioModal(index) {
    const galleryItem = portfolioGallery[index];
    if (!galleryItem || !modalImage || !modalTitle || !modalCaption) return;

    activePortfolioIndex = index;
    modalImage.src = galleryItem.src;
    modalImage.alt = galleryItem.alt;
    modalTitle.textContent = galleryItem.title;
    modalCaption.textContent = galleryItem.caption;
  }

  function openPortfolioModal(index) {
    if (!portfolioModal || !portfolioGallery.length) return;

    lastFocusedElement = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;
    renderPortfolioModal(index);
    portfolioModal.classList.add('is-open');
    portfolioModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  }

  function closePortfolioModal() {
    if (!portfolioModal || !portfolioModal.classList.contains('is-open')) return;

    portfolioModal.classList.remove('is-open');
    portfolioModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousBodyOverflow;
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function showAdjacentPortfolio(direction) {
    const nextIndex = (activePortfolioIndex + direction + portfolioGallery.length) % portfolioGallery.length;
    renderPortfolioModal(nextIndex);
  }

  portfolioGallery.forEach(({ item }, index) => {
    item.addEventListener('click', () => openPortfolioModal(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPortfolioModal(index);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closePortfolioModal);
  }

  if (modalPrev) {
    modalPrev.addEventListener('click', () => showAdjacentPortfolio(-1));
  }

  if (modalNext) {
    modalNext.addEventListener('click', () => showAdjacentPortfolio(1));
  }

  if (portfolioModal) {
    portfolioModal.addEventListener('click', (e) => {
      if (e.target === portfolioModal) {
        closePortfolioModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!portfolioModal || !portfolioModal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closePortfolioModal();
    }

    if (e.key === 'ArrowLeft') {
      showAdjacentPortfolio(-1);
    }

    if (e.key === 'ArrowRight') {
      showAdjacentPortfolio(1);
    }
  });

  /* ── Button Micro-interaction ── */

  document.querySelectorAll('.btn-primary, .btn-secondary').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      if (prefersReducedMotion) return;
      btn.style.transitionDelay = '0s';
    });
  });

})();
