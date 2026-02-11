/* ================================================
   MAZTECHDESIGNS — Main JavaScript
   ================================================ */

(function () {
  'use strict';

  // ============ LOADER ============
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loader--hidden');
      document.body.style.overflow = '';
      initCountUp();
    }, 2000);
  });

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';

  // ============ CUSTOM CURSOR ============
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');

  if (window.matchMedia('(pointer: fine)').matches && cursor && cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .service-card, .portfolio__item, .contact__form-input, .contact__form-select');
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor--hover');
        cursorFollower.classList.add('cursor-follower--hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor--hover');
        cursorFollower.classList.remove('cursor-follower--hover');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorFollower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorFollower.style.opacity = '1';
    });
  }

  // ============ NAVIGATION ============
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('mobile-menu--open');
    navToggle.classList.toggle('nav__toggle--active');
    mobileMenu.classList.toggle('mobile-menu--open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close mobile menu on link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('nav__toggle--active');
      mobileMenu.classList.remove('mobile-menu--open');
      document.body.style.overflow = '';
    });
  });

  // ============ HERO CANVAS (Particle Network) ============
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let canvasWidth, canvasHeight;

    function resizeCanvas() {
      canvasWidth = canvas.width = canvas.offsetWidth;
      canvasHeight = canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 181, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Determine particle count based on screen size
    function getParticleCount() {
      if (canvasWidth < 768) return 30;
      if (canvasWidth < 1200) return 50;
      return 80;
    }

    function initParticles() {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDist = 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 181, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      connectParticles();
      animationId = requestAnimationFrame(animate);
    }

    // Only animate when hero is visible
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!animationId) animate();
          } else {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        });
      },
      { threshold: 0.1 }
    );

    heroObserver.observe(document.getElementById('hero'));
    initParticles();
    animate();
  }

  // ============ SCROLL REVEAL ============
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ============ COUNT UP ANIMATION ============
  function initCountUp() {
    const statNumbers = document.querySelectorAll('.hero__stat-number[data-count]');

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            animateCount(el, target);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((num) => countObserver.observe(num));
  }

  function animateCount(el, target) {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // ============ SERVICE CARD GLOW TRACKING ============
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // ============ PORTFOLIO FILTER ============
  const filterBtns = document.querySelectorAll('.portfolio__filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio__item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach((item) => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('portfolio__item--hidden');
          item.style.display = '';
        } else {
          item.classList.add('portfolio__item--hidden');
          // Let the animation play, then hide
          setTimeout(() => {
            if (item.classList.contains('portfolio__item--hidden')) {
              item.style.display = 'none';
            }
          }, 400);
        }
      });
    });
  });

  // ============ TESTIMONIALS CAROUSEL ============
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialDots');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  let currentSlide = 0;
  const totalSlides = cards.length;

  // Create dots
  if (dotsContainer) {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('testimonials__dot');
      if (i === 0) dot.classList.add('testimonials__dot--active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    currentSlide = index;
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.testimonials__dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('testimonials__dot--active', i === currentSlide);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      goToSlide(currentSlide);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      goToSlide(currentSlide);
    });
  }

  // Auto-advance
  let autoSlide = setInterval(() => {
    if (track) {
      currentSlide = (currentSlide + 1) % totalSlides;
      goToSlide(currentSlide);
    }
  }, 6000);

  // Pause on hover
  const carousel = document.getElementById('testimonialCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carousel.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
      }, 6000);
    });
  }

  // Touch swipe for carousel
  if (track) {
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          currentSlide = (currentSlide + 1) % totalSlides;
        } else {
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        }
        goToSlide(currentSlide);
      }
    }, { passive: true });
  }

  // ============ PARALLAX EFFECTS ============
  const bgText = document.querySelector('.testimonials__bg-text');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Parallax on testimonials background text
    if (bgText) {
      const rect = bgText.closest('.testimonials').getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        bgText.style.transform = `translate(-50%, -50%) translateX(${(progress - 0.5) * 80}px)`;
      }
    }
  }, { passive: true });

  // ============ CONTACT FORM ============
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');
      let valid = true;

      [name, email, message].forEach((field) => {
        if (!field.value.trim()) {
          field.style.borderColor = '#EF4444';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (email.value && !isValidEmail(email.value)) {
        email.style.borderColor = '#EF4444';
        valid = false;
      }

      if (valid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              formSuccess.classList.add('active');
              contactForm.reset();
            } else {
              alert('Something went wrong. Please try again or email us directly at hello@MazTechDesigns.co.uk');
            }
          })
          .catch(() => {
            alert('Network error. Please try again or email us directly at hello@MazTechDesigns.co.uk');
          })
          .finally(() => {
            submitBtn.innerHTML = '<span>Send Message</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
            submitBtn.disabled = false;
          });
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ============ NEWSLETTER FORM ============
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input.value && isValidEmail(input.value)) {
        const btn = newsletterForm.querySelector('button');
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
        input.value = '';
        input.placeholder = 'Subscribed!';
        setTimeout(() => {
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
          input.placeholder = 'your@email.com';
        }, 3000);
      }
    });
  }

  // ============ STICKY CTA (MOBILE) ============
  const stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        stickyCta.classList.add('sticky-cta--visible');
      } else {
        stickyCta.classList.remove('sticky-cta--visible');
      }
    }, { passive: true });
  }

  // ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ============ ACTIVE NAV LINK HIGHLIGHT ============
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('nav__link--active');
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px',
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // ============ KEYBOARD NAVIGATION ============
  document.addEventListener('keydown', (e) => {
    // Escape to close mobile menu
    if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
      navToggle.classList.remove('nav__toggle--active');
      mobileMenu.classList.remove('mobile-menu--open');
      document.body.style.overflow = '';
    }
  });

})();
