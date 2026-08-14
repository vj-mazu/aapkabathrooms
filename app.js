/* ============================================================
   AAPKA BATHROOMS – App Logic
   ============================================================ */
(function () {
  'use strict';

  const modal = document.getElementById('modal');
  const reqRow = document.getElementById('reqRow');
  const selReq = document.getElementById('selReq');
  const toast = document.getElementById('toast');
  const menuToggle = document.querySelector('.menu-toggle');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.querySelector('.menu-close');

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      const isOpen = document.body.classList.toggle('menu-open');
      this.setAttribute('aria-expanded', String(isOpen));
    });
  }
  if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-nav a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* --- Open Modal --- */
  const selService = document.getElementById('selService');
  document.querySelectorAll('.open-modal').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var svc = this.getAttribute('data-svc');
      if (svc && selService) {
        selService.value = svc;
      }
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  /* --- Close Modal --- */
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  modal.querySelector('.modal-x').addEventListener('click', closeModal);
  modal.querySelector('.modal-bg').addEventListener('click', closeModal);

  /* --- Form Submit --- */
  document.getElementById('quoteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var phone = document.getElementById('phone').value;
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      alert('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    closeModal();
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 4000);
    this.reset();
  });

  /* --- Site Visit Inline Form Submit --- */
  var siteVisitForm = document.getElementById('siteVisitForm');
  if (siteVisitForm) {
    siteVisitForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var phone = document.getElementById('svPhone').value;
      if (!/^[6-9][0-9]{9}$/.test(phone)) {
        alert('Please enter a valid 10-digit Indian mobile number.');
        return;
      }
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 4000);
      this.reset();
    });
  }

  /* --- Vibration feedback on Call Now buttons (mobile) --- */
  function vibrate() {
    if (navigator.vibrate) navigator.vibrate(60);
  }
  document.querySelectorAll('.bnav-cta, .call-pill, .build-call, .cta-call').forEach(function (el) {
    el.addEventListener('click', vibrate);
    el.addEventListener('touchstart', vibrate, { passive: true });
  });

  /* --- Bottom Nav Active State --- */
  document.querySelectorAll('.bnav-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.bnav-item').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  /* ============================================================
     BEFORE / AFTER COMPARISON SLIDERS – auto-move + manual drag
     ============================================================ */
  document.querySelectorAll('.ba-compare').forEach(function (cmp) {
    var before = cmp.querySelector('.ba-before');
    var handle = cmp.querySelector('.ba-handle');
    if (!before || !handle) return;

    var p = 50, dragging = false;

    function setP(v) {
      p = Math.max(10, Math.min(90, v));
      before.style.clipPath = 'inset(0 ' + (100 - p).toFixed(2) + '% 0 0)';
      handle.style.left = p.toFixed(2) + '%';
    }

    function posFromEvent(e) {
      var r = cmp.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    }
    function onDown(e) {
      dragging = true;
      setP(posFromEvent(e));
      if (cmp.setPointerCapture) {
        try { cmp.setPointerCapture(e.pointerId); } catch (err) {}
      }
    }
    function onMove(e) {
      if (!dragging) return;
      setP(posFromEvent(e));
    }
    function onUp() {
      dragging = false;
    }

    cmp.addEventListener('pointerdown', onDown);
    cmp.addEventListener('pointermove', onMove);
    cmp.addEventListener('pointerup', onUp);
    cmp.addEventListener('pointercancel', onUp);
    // Tap anywhere on the image jumps the handle there
    cmp.addEventListener('click', function (e) {
      setP(posFromEvent(e));
    });

    setP(p);
  });

  /* ============================================================
     TESTIMONIAL MARQUEE – duplicate cards for a
     seamless left-to-right auto-scroll loop
     ============================================================ */
  ['.review-track'].forEach(function (sel) {
    var track = document.querySelector(sel);
    if (track && track.children.length) {
      var originals = Array.prototype.slice.call(track.children);
      originals.forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }
  });

  /* ============================================================
     HERO CAROUSEL – auto-rotate, arrows, dots, touch swipe
     ============================================================ */
  var slides = document.querySelectorAll('.hero-slide');
  var slidesTrack = document.getElementById('heroSlides');
  var dots = document.querySelectorAll('.hero-card .dots .dot');
  var heroBadge = document.getElementById('heroBadge');
  var heroHeadline = document.getElementById('heroHeadline');
  var heroSubline = document.getElementById('heroSubline');
  var current = 0;
  var timer = null;
  var AUTO_MS = 6000;

  function syncText(index) {
    var slide = slides[index];
    if (!slide) return;
    if (heroBadge && slide.getAttribute('data-badge')) {
      heroBadge.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span>' + slide.getAttribute('data-badge') + '</span>';
    }
    if (heroHeadline && slide.getAttribute('data-headline')) {
      heroHeadline.innerHTML = slide.getAttribute('data-headline');
    }
    if (heroSubline && slide.getAttribute('data-subline')) {
      heroSubline.innerHTML = slide.getAttribute('data-subline');
    }
  }

  function goTo(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    if (slidesTrack) slidesTrack.style.transform = 'translateX(-' + (current * 100) + '%)';
    slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    syncText(current);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, AUTO_MS);
  }
  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  if (slides.length) {
    // Clickable dots
    dots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        goTo(parseInt(this.getAttribute('data-slide'), 10));
        startAuto();
      });
    });

    // Arrows
    var prevBtn = document.getElementById('heroPrev');
    var nextBtn = document.getElementById('heroNext');
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAuto(); });

    // Touch swipe
    var heroCard = document.getElementById('heroCard');
    var touchX = null;
    heroCard.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });
    heroCard.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (dx > 40) prev();
      else if (dx < -40) next();
      touchX = null;
      startAuto();
    }, { passive: true });

    goTo(current);
    startAuto();
  }

  /* ============================================================
     HOW IT WORKS CAROUSEL – auto-rotate and dots
     ============================================================ */
  var howSlides = document.querySelectorAll('.how-slide');
  var howTrack = document.getElementById('howSlidesTrack');
  var howDots = document.querySelectorAll('.how-carousel .how-dots .how-dot');
  var howCurrent = 0;
  var howTimer = null;
  var HOW_AUTO_MS = 6000;

  function goToHow(index) {
    if (!howSlides.length) return;
    howCurrent = (index + howSlides.length) % howSlides.length;
    if (howTrack) howTrack.style.transform = 'translateX(-' + (howCurrent * 100) + '%)';
    howSlides.forEach(function (s, i) { s.classList.toggle('active', i === howCurrent); });
    howDots.forEach(function (d, i) { d.classList.toggle('active', i === howCurrent); });
  }

  function nextHow() { goToHow(howCurrent + 1); }

  function startHowAuto() {
    stopHowAuto();
    howTimer = setInterval(nextHow, HOW_AUTO_MS);
  }
  function stopHowAuto() {
    if (howTimer) { clearInterval(howTimer); howTimer = null; }
  }

  if (howSlides.length) {
    howDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goToHow(parseInt(this.getAttribute('data-how-slide'), 10));
        startHowAuto();
      });
    });

    var howCarousel = document.querySelector('.how-carousel');
    if (howCarousel) {
      var howTouchX = null;
      howCarousel.addEventListener('touchstart', function (e) {
        howTouchX = e.touches[0].clientX;
        stopHowAuto();
      }, { passive: true });
      howCarousel.addEventListener('touchend', function (e) {
        if (howTouchX === null) return;
        var dx = e.changedTouches[0].clientX - howTouchX;
        if (dx > 40) goToHow(howCurrent - 1);
        else if (dx < -40) goToHow(howCurrent + 1);
        howTouchX = null;
        startHowAuto();
      }, { passive: true });
    }

    startHowAuto();
  }

})();
