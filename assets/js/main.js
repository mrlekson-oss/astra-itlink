/* ===== AstraITLink - Main JavaScript ===== */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== Mobile Burger Menu ===== */
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      nav.classList.toggle('open');
    });
    document.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }

  /* ===== Scroll Animations (Intersection Observer) ===== */
  const animElements = document.querySelectorAll('.fade-in');
  if (animElements.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    animElements.forEach(function (el) { observer.observe(el); });
  }

  /* ===== FAQ Accordion ===== */
  document.querySelectorAll('.faq-item__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = this.parentElement;
      var isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(function (f) { f.classList.remove('open'); });
      if (!isOpen) { item.classList.add('open'); }
    });
  });

  /* ===== Testimonials Carousel ===== */
  var track = document.querySelector('.testimonials__track');
  var dots = document.querySelectorAll('.testimonials__dot');
  if (track && dots.length) {
    var cards = track.querySelectorAll('.testimonial-card');
    var index = 0;
    function updateCarousel() {
      var cardWidth = cards[0].offsetWidth + 24; // card + gap
      var maxIndex = cards.length - Math.floor(track.parentElement.offsetWidth / cardWidth);
      if (maxIndex < 1) maxIndex = 1;
      if (index > maxIndex) index = 0;
      if (index < 0) index = maxIndex;
      track.style.transform = 'translateX(-' + (index * cardWidth) + 'px)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { index = i; updateCarousel(); });
    });
    window.addEventListener('resize', updateCarousel);
    // Auto rotate
    setInterval(function () { index++; updateCarousel(); }, 5000);
  }

  /* ===== Portfolio Filter ===== */
  var filterBtns = document.querySelectorAll('.portfolio__filter-btn');
  var portfolioCards = document.querySelectorAll('.portfolio-card');
  if (filterBtns.length && portfolioCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var filter = this.getAttribute('data-filter');
        portfolioCards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ===== Modal ===== */
  var modalOverlay = document.querySelector('.modal-overlay');
  var modalClose = document.querySelector('.modal__close');
  var modalTriggers = document.querySelectorAll('[data-modal]');
  if (modalOverlay && modalClose) {
    modalTriggers.forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        var target = this.getAttribute('data-modal');
        var content = document.getElementById(target);
        if (content) {
          var title = content.querySelector('.modal__title');
          var desc = content.querySelector('.modal__subtitle');
          var results = content.querySelector('.modal__results');
          if (title) modalOverlay.querySelector('.modal__title').textContent = title.textContent;
          if (desc) modalOverlay.querySelector('.modal__subtitle').textContent = desc.textContent;
          if (results) {
            modalOverlay.querySelector('.modal__results').innerHTML = results.innerHTML;
          }
        }
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ===== Form Validation ===== */
  var forms = document.querySelectorAll('.form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var inputs = this.querySelectorAll('.form__input, .form__textarea');
      inputs.forEach(function (input) {
        var error = input.parentElement.querySelector('.form__error');
        if (!error) return;
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.classList.add('error');
          error.textContent = 'Заполните это поле';
          error.classList.add('show');
          valid = false;
        } else if (input.type === 'email' && input.value.trim()) {
          var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!re.test(input.value.trim())) {
            input.classList.add('error');
            error.textContent = 'Введите корректный email';
            error.classList.add('show');
            valid = false;
          } else {
            input.classList.remove('error');
            error.classList.remove('show');
          }
        } else if (input.type === 'tel' && input.value.trim()) {
          var re = /^[\+\d\s\-\(\)]{7,20}$/;
          if (!re.test(input.value.trim())) {
            input.classList.add('error');
            error.textContent = 'Введите корректный телефон';
            error.classList.add('show');
            valid = false;
          } else {
            input.classList.remove('error');
            error.classList.remove('show');
          }
        } else {
          input.classList.remove('error');
          error.classList.remove('show');
        }
      });
      if (valid) {
        var success = this.querySelector('.form__success');
        var formBody = this.querySelector('.form__body');
        if (success && formBody) {
          formBody.style.display = 'none';
          success.classList.add('show');
        } else {
          alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
          this.reset();
        }
      }
    });
    // Clear errors on input
    this.querySelectorAll('.form__input, .form__textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        this.classList.remove('error');
        var error = this.parentElement.querySelector('.form__error');
        if (error) error.classList.remove('show');
      });
    });
  });

  /* ===== Services Tabs ===== */
  var tabBtns = document.querySelectorAll('.services-tab__btn');
  var tabPanels = document.querySelectorAll('.services-tab__panel');
  if (tabBtns.length && tabPanels.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tabId = this.getAttribute('data-tab');
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        tabPanels.forEach(function (p) { p.classList.remove('active'); });
        var target = document.getElementById(tabId);
        if (target) target.classList.add('active');
      });
    });
  }

  /* ===== Animated Counters ===== */
  var counters = document.querySelectorAll('.stat-item__num');
  if (counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var text = el.textContent.trim();
          var num = parseInt(text.replace(/\s/g, '').replace(/\+/g, ''));
          if (!isNaN(num)) {
            var suffix = text.replace(/[\d\s]/g, '');
            var duration = 1500;
            var start = performance.now();
            function update(now) {
              var progress = Math.min((now - start) / duration, 1);
              el.textContent = Math.floor(progress * num).toLocaleString() + suffix;
              if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
          }
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ===== Phone input mask helper (simple) ===== */
  document.querySelectorAll('input[type="tel"]').forEach(function (input) {
    input.addEventListener('input', function () {
      this.value = this.value.replace(/[^\d\+\-\(\)\s]/g, '');
    });
  });

});
