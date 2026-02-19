/* ==========================================
   HÖRMANNSHOFER FASSADEN® – JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== NAVBAR SCROLL ==========
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleNavScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ========== MOBILE MENU ==========
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    let overlay = null;

    const createOverlay = () => {
        overlay = document.createElement('div');
        overlay.classList.add('nav-overlay');
        document.body.appendChild(overlay);
        overlay.addEventListener('click', closeMenu);
    };

    const openMenu = () => {
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        if (!overlay) createOverlay();
        requestAnimationFrame(() => overlay.classList.add('active'));
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========== SCROLL ANIMATIONS ==========
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observerCallback = (entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animations for sibling elements
                const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                let delay = 0;
                siblings.forEach((sibling, i) => {
                    if (sibling === entry.target) {
                        delay = i * 100;
                    }
                });

                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    animateElements.forEach(el => observer.observe(el));

    // ========== COUNTER ANIMATION ==========
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            const current = Math.round(eased * target);

            el.textContent = current.toLocaleString('de-DE');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ========== CONTACT FORM ==========
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Visual feedback
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px">
                <path d="M5 13l4 4L19 7"/>
            </svg>
            Nachricht gesendet!
        `;
        btn.style.background = '#27AE60';
        btn.style.borderColor = '#27AE60';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.disabled = false;
            contactForm.reset();
        }, 3000);
    });

    // ========== HERO IMAGE SLIDER ==========
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    const nextSlide = () => {
        heroSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
    };

    if (heroSlides.length > 1) {
        setInterval(nextSlide, 5000);
    }

    // ========== PARALLAX SUBTLE EFFECT ==========
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            const opacity = 1 - (scrollY / window.innerHeight) * 0.6;
            const translateY = scrollY * 0.3;
            heroContent.style.opacity = opacity;
            heroContent.style.transform = `translateY(${translateY}px)`;
        }
    }, { passive: true });

    // ==========================================
    // THEME SWITCHER
    // ==========================================
    const themeSwitcherToggle = document.getElementById('themeSwitcherToggle');
    const themeSwitcherPanel = document.getElementById('themeSwitcherPanel');
    const themePanelClose = document.getElementById('themePanelClose');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Toggle panel
    if (themeSwitcherToggle) {
        themeSwitcherToggle.addEventListener('click', () => {
            themeSwitcherPanel.classList.toggle('open');
        });
    }

    // Close panel
    if (themePanelClose) {
        themePanelClose.addEventListener('click', () => {
            themeSwitcherPanel.classList.remove('open');
        });
    }

    // Close panel on outside click
    document.addEventListener('click', (e) => {
        if (themeSwitcherPanel && themeSwitcherPanel.classList.contains('open')) {
            if (!e.target.closest('.theme-switcher')) {
                themeSwitcherPanel.classList.remove('open');
            }
        }
    });

    // Theme selection
    themeOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');

            // Add transition class for smooth theme change
            document.body.classList.add('theme-transitioning');

            // Set theme
            document.body.setAttribute('data-theme', theme);

            // Update active state
            themeOptions.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Save to localStorage
            localStorage.setItem('hoermannshofer-theme', theme);

            // Remove transition class after animation
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 700);
        });
    });

    // Restore saved theme on load
    const savedTheme = localStorage.getItem('hoermannshofer-theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        themeOptions.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === savedTheme);
        });
    }

});
