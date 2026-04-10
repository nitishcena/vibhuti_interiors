/* ═══════════════════════════════════════════════════════
   VIBHUTI INTERIORS — Cinematic Interactive JavaScript
   Parallax · Scroll Reveals · Gallery · Lightbox · Reels · Navigation
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar Scroll Effect ───
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ─── Mobile Navigation Toggle ───
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── Smooth Scroll for Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ═══════════════════════════════════════════════════════
  // CINEMATIC SCROLL REVEAL (Intersection Observer)
  // ═══════════════════════════════════════════════════════
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-text, .reveal-stagger');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger based on element index within its parent for natural cascade
        const siblings = Array.from(entry.target.parentElement.children);
        const index = siblings.indexOf(entry.target);
        const delay = Math.min(index * 100, 500); // Cap at 500ms

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -80px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ═══════════════════════════════════════════════════════
  // PARALLAX SCROLLING — Hero Background
  // ═══════════════════════════════════════════════════════
  const heroBgImg = document.querySelector('.hero-bg img');
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    // Only apply parallax while hero is visible
    if (scrollY < heroHeight * 1.5 && heroBgImg) {
      const parallaxOffset = scrollY * 0.35;
      heroBgImg.style.transform = `translateY(${parallaxOffset}px) scale(1.15)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // ─── Counter Animation ───
  const animateCounters = () => {
    const counters = document.querySelectorAll('.hero-stat .number');
    
    counters.forEach(counter => {
      const text = counter.textContent;
      const hasPlus = text.includes('+');
      const hasPercent = text.includes('%');
      const target = parseInt(text.replace(/[^0-9]/g, ''));
      
      let current = 0;
      const duration = 2500; // Slower for cinematic feel
      const steps = 60;
      const increment = target / steps;
      const stepTime = duration / steps;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current) + (hasPlus ? '+' : hasPercent ? '%' : '');
          setTimeout(updateCounter, stepTime);
        } else {
          counter.textContent = text;
        }
      };

      updateCounter();
    });
  };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);

  // ═══════════════════════════════════════════════════════
  // PORTFOLIO GALLERY FILTER
  // ═══════════════════════════════════════════════════════
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach((item, index) => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'translateY(30px)';
          
          setTimeout(() => {
            item.style.transition = 'opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 60);
        } else {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // ═══════════════════════════════════════════════════════
  // LIGHTBOX GALLERY
  // ═══════════════════════════════════════════════════════
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ═══════════════════════════════════════════════════════
  // REEL VIDEO PLAYER — Play/Pause Toggle
  // ═══════════════════════════════════════════════════════
  const reelPlayBtns = document.querySelectorAll('.reel-play-btn');

  reelPlayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const video = document.getElementById(targetId);

      if (!video) return;

      if (video.paused) {
        // Pause all other videos first
        document.querySelectorAll('.reel-video').forEach(v => {
          if (v !== video && !v.paused) {
            v.pause();
            const otherBtn = v.closest('.reel-video-wrap').querySelector('.reel-play-btn');
            if (otherBtn) {
              otherBtn.classList.remove('playing');
              otherBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
            }
          }
        });

        video.play();
        btn.classList.add('playing');
        btn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      } else {
        video.pause();
        btn.classList.remove('playing');
        btn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      }
    });
  });

  // Auto-play reels when they enter viewport (muted)
  const reelVideos = document.querySelectorAll('.reel-video');
  const reelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      const btn = video.closest('.reel-video-wrap').querySelector('.reel-play-btn');

      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        video.play().then(() => {
          if (btn) {
            btn.classList.add('playing');
            btn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
          }
        }).catch(() => {});
      } else {
        video.pause();
        if (btn) {
          btn.classList.remove('playing');
          btn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
        }
      }
    });
  }, { threshold: 0.6 });

  reelVideos.forEach(video => reelObserver.observe(video));

  // ═══════════════════════════════════════════════════════
  // ACTIVE NAV LINK ON SCROLL
  // ═══════════════════════════════════════════════════════
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

      if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(a => a.style.color = '');
        navLink.style.color = 'var(--gold-light)';
      }
    });
  });

  // ─── Contact Form Handler ───
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const originalHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>✓ Inquiry Sent!</span>';
    submitBtn.style.background = 'linear-gradient(135deg, var(--forest-mid), var(--forest-deep))';
    
    setTimeout(() => {
      submitBtn.innerHTML = originalHtml;
      submitBtn.style.background = '';
      contactForm.reset();
    }, 3000);
  });

});
