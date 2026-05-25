/* ============================================================
   APLEAD — Applied Leadership
   js/main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. MOBILE NAVIGATION ── */
  const nav        = document.querySelector('.aplead-nav');
  const hamburger  = document.querySelector('.nav-hamburger');
  const overlay    = document.querySelector('.nav-mobile-overlay');
  const closeBtn   = document.querySelector('.nav-mobile-close');

  function openMobileNav() {
    if (!overlay) return;
    overlay.classList.add('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const spans = hamburger ? hamburger.querySelectorAll('span') : [];
    if (spans.length >= 3) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    }
  }

  function closeMobileNav() {
    if (!overlay) return;
    overlay.classList.remove('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    const spans = hamburger ? hamburger.querySelectorAll('span') : [];
    if (spans.length >= 3) {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  }

  hamburger && hamburger.addEventListener('click', function () {
    overlay && overlay.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });

  closeBtn && closeBtn.addEventListener('click', closeMobileNav);

  overlay && overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeMobileNav();
  });

  /* Close mobile nav on link click */
  overlay && overlay.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* ── 1b. MOBILE DROPDOWN ── */
  const mobileDropdownTrigger = document.querySelector('.mobile-dropdown-trigger');
  const mobileDropdownItems   = document.querySelector('.mobile-dropdown-items');
  mobileDropdownTrigger && mobileDropdownTrigger.addEventListener('click', function () {
    const isOpen = mobileDropdownItems.classList.toggle('open');
    this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  /* ── 1c. MEGA MENU (multi) ── */
  var megaCloseTimer = null;

  function closeAllMegaMenus() {
    document.querySelectorAll('.nav-mega-menu').forEach(function (m) { m.classList.remove('open'); });
    document.querySelectorAll('.nav-dropdown').forEach(function (w) {
      var btn = w.querySelector('.nav-dropdown-trigger');
      var arr = w.querySelector('.nav-dropdown-arrow');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (arr) arr.style.transform = '';
    });
  }

  function openMegaMenuById(menuId) {
    clearTimeout(megaCloseTimer);
    closeAllMegaMenus();
    var menu = document.querySelector('.nav-mega-menu[data-menu="' + menuId + '"]');
    var wrap = document.querySelector('.nav-dropdown[data-menu="' + menuId + '"]');
    var btn  = wrap && wrap.querySelector('.nav-dropdown-trigger');
    var arr  = wrap && wrap.querySelector('.nav-dropdown-arrow');
    if (menu) menu.classList.add('open');
    if (btn)  btn.setAttribute('aria-expanded', 'true');
    if (arr)  arr.style.transform = 'rotate(180deg)';
  }

  function scheduleMegaClose() {
    megaCloseTimer = setTimeout(closeAllMegaMenus, 80);
  }

  document.querySelectorAll('.nav-dropdown[data-menu]').forEach(function (wrap) {
    var menuId = wrap.getAttribute('data-menu');
    wrap.addEventListener('mouseenter', function () { openMegaMenuById(menuId); });
    wrap.addEventListener('mouseleave', scheduleMegaClose);
  });

  document.querySelectorAll('.nav-mega-menu').forEach(function (menu) {
    var menuId = menu.getAttribute('data-menu');
    menu.addEventListener('mouseenter', function () {
      clearTimeout(megaCloseTimer);
      openMegaMenuById(menuId);
    });
    menu.addEventListener('mouseleave', scheduleMegaClose);
  });

  /* ── 2. ACTIVE PAGE IN NAVIGATION ── */
  function markActivePage() {
    const path = window.location.pathname;
    const allLinks = document.querySelectorAll('.nav-links a, .nav-mobile-overlay a');
    allLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      /* Exact match or path starts with href (for index pages) */
      const normalized = path.endsWith('/') ? path : path + '/';
      const linkPath   = href.endsWith('/') ? href : href + '/';
      if (path === href || (href !== '/' && path.startsWith(href))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    /* Mark dropdown trigger active when on a sub-page */
    const dropdownTrigger = document.querySelector('.nav-dropdown-trigger');
    if (dropdownTrigger) {
      const subPaths = ['/angebot', '/coach', '/develop', '/transform', '/academy'];
      const isSubPage = subPaths.some(function(p) { return path.startsWith(p); });
      dropdownTrigger.classList.toggle('active', isSubPage);
    }
  }
  markActivePage();

  /* ── 3. SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 64;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── 4. NAV SCROLL BEHAVIOR ── */
  var lastScrollY = 0;
  function onScroll() {
    const scrollY = window.scrollY;
    if (nav) {
      if (scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    lastScrollY = scrollY;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 5. ACCORDION / COLLAPSE (Phase blocks) ── */
  document.querySelectorAll('.phase-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const block = this.closest('.phase-block');
      const body  = block && block.querySelector('.sessions-list');
      if (!body) return;
      const open = block.classList.contains('phase-open');
      block.classList.toggle('phase-open', !open);
      body.style.display = open ? 'none' : '';
      this.setAttribute('aria-expanded', String(!open));
    });
  });

  /* ── 6. CONTACT FORM VALIDATION ── */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      const required = this.querySelectorAll('[required]');
      required.forEach(function (field) {
        const group = field.closest('.form-group') || field.closest('.checkbox-group');
        if (!field.value.trim() && field.type !== 'checkbox') {
          valid = false;
          field.style.borderColor = '#C0392B';
          group && group.classList.add('has-error');
        } else if (field.type === 'checkbox' && !field.checked) {
          valid = false;
          group && group.classList.add('has-error');
        } else {
          field.style.borderColor = '';
          group && group.classList.remove('has-error');
        }
      });
      if (valid) {
        const btn = this.querySelector('[type="submit"]');
        if (btn) {
          btn.textContent = 'Nachricht gesendet ✓';
          btn.disabled = true;
          btn.style.background = '#444441';
          btn.style.borderColor = '#444441';
        }
      }
    });

    /* Clear error state on input */
    contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
        const group = this.closest('.form-group') || this.closest('.checkbox-group');
        group && group.classList.remove('has-error');
      });
    });
  }

  /* ── 7. FADE-IN ANIMATION (Intersection Observer) ── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: just show everything */
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }

})();
