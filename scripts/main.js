/* ===================================================
   Imuraa Portfolio — Main Script
   =================================================== */

// --- Mobile hamburger menu ---
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-active');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'メニューを開く');
    });
  });
}

// --- Scroll animation (IntersectionObserver) ---
const animateElements = document.querySelectorAll('[data-animate]');

if (animateElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  animateElements.forEach((el) => observer.observe(el));
}

// --- Header active nav link on scroll ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header-nav a');

if (sections.length > 0 && navLinks.length > 0) {
  const onScroll = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Contact form ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const statusEl = contactForm.querySelector('.form-status');
  const submitButton = contactForm.querySelector('[data-contact-submit]');
  let endpoint = contactForm.getAttribute('data-endpoint') || '/api/contact';

  const setStatus = (type, message) => {
    if (!statusEl) return;
    statusEl.textContent = message || '';
    statusEl.classList.remove('is-success', 'is-error');
    if (type) {
      statusEl.classList.add(type);
    }
  };

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('is-loading');
      }
      setStatus(null, '送信しています…');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message || '送信に失敗しました。時間をおいて再度お試しください。');
      }

      contactForm.reset();
      setStatus('is-success', '送信が完了しました。2〜3営業日以内にご返信いたします。');
    } catch (error) {
      setStatus('is-error', error.message);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('is-loading');
      }
    }
  });
}
