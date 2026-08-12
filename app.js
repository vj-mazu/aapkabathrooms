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
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      const isOpen = document.body.classList.toggle('menu-open');
      this.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMenu);
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  document.querySelectorAll('.mobile-nav a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* --- Open Modal --- */
  document.querySelectorAll('.open-modal').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var svc = this.getAttribute('data-svc');
      if (svc) {
        reqRow.style.display = 'block';
        selReq.textContent = svc;
      } else {
        reqRow.style.display = 'none';
        selReq.textContent = '';
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
    document.getElementById('pin').value = '560001';
  });

  /* --- Bottom Nav Active State --- */
  document.querySelectorAll('.bnav-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.bnav-item').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  /* ============================================================
     HERO CAROUSEL – auto-rotate, clickable dots, touch swipe
     ============================================================ */
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-card .dots .dot');
  var current = 0;
  var timer = null;
  var AUTO_MS = 4500;

  function goTo(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
  }

  function next() { goTo(current + 1); }

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
        startAuto(); // reset timer
      });
    });

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
      if (dx > 40) goTo(current - 1);      // swipe right → prev
      else if (dx < -40) goTo(current + 1); // swipe left → next
      touchX = null;
      startAuto();
    }, { passive: true });

    startAuto();
  }

})();
