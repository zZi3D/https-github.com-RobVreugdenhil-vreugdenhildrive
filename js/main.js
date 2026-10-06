/**
 * Rijschool Vreugdenhil - Main JavaScript
 * Handelt thema (Light/Dark mode), navigatie, tabs, accordions en WhatsApp formulierafhandeling af.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initCourseTabs();
  initFaqAccordion();
  initWhatsAppContactForm();
  initCurrentYear();
  initScrollReveal();
  initParallax();
  initMagneticButton();
  initAmbientBackground();
});

/* ==========================================================================
   1. Theme Management (System Default + Manual Override + LocalStorage)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcons(theme);
  }

  function updateThemeIcons(theme) {
    themeToggleBtns.forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'inline-block';
          moonIcon.style.display = 'none';
          btn.setAttribute('aria-label', 'Schakel naar licht thema');
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'inline-block';
          btn.setAttribute('aria-label', 'Schakel naar donker thema');
        }
      }
    });
  }

  // Bepaal initieel thema
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme(systemPrefersDark.matches ? 'dark' : 'light');
  }

  // Luister naar wijzigingen in besturingssysteem wanneer gebruiker geen vaste voorkeur heeft opgeslagen
  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Toggle knop event
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });
  });
}

/* ==========================================================================
   2. Mobile Menu (Drawer & Overlay)
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !overlay) return;

  function openMenu() {
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. Course Selector Tabs
   ========================================================================== */
function initCourseTabs() {
  const tabs = document.querySelectorAll('.course-tab-btn');
  const panels = document.querySelectorAll('.course-panel');

  if (tabs.length === 0 || panels.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      // Update tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panels
      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.style.display = 'block';
          panel.removeAttribute('hidden');
        } else {
          panel.style.display = 'none';
          panel.setAttribute('hidden', 'true');
        }
      });
    });
  });
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Optioneel: sluit andere items voor een schone weergave
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   5. Direct WhatsApp Contact Form
   ========================================================================== */
function initWhatsAppContactForm() {
  const form = document.getElementById('directContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('formName');
    const phoneInput = document.getElementById('formPhone');
    const courseInput = document.getElementById('formCourse');
    const messageInput = document.getElementById('formMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const course = courseInput ? courseInput.value : 'Autorijles B';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !phone) {
      alert('Vul alstublieft jouw naam en telefoonnummer in.');
      return;
    }

    const whatsappNumber = '31626040620';
    let text = `Hallo Rijschool Vreugdenhil! Graag wil ik me aanmelden voor een rijopleiding. Kunnen wij op korte termijn een afspraak maken?\n\n`;
    text += `👤 *Naam:* ${name}\n`;
    text += `📱 *Telefoon:* ${phone}\n`;
    text += `🚗 *Interesse in:* ${course}\n`;
    if (message) {
      text += `💬 *Vraag/opmerking:* ${message}\n`;
    }

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

    // Open WhatsApp in nieuw tabblad
    window.open(whatsappUrl, '_blank');

    // Toon succesbericht op formulier
    const feedbackBox = document.getElementById('formFeedback');
    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.innerHTML = '<strong>Gelukt!</strong> WhatsApp wordt nu geopend om direct je bericht te versturen.';
    }
  });
}

/* ==========================================================================
   6. Current Year in Footer
   ========================================================================== */
function initCurrentYear() {
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
}


/* ==========================================================================
   7. Scroll Reveal (In-view animaties)
   ========================================================================== */
function initScrollReveal() {
  // Voeg de class automatisch toe aan belangrijke elementen
  const elementsToReveal = document.querySelectorAll('.pricing-card, .feature-card, .review-card, .section-header, .faq-item');
  elementsToReveal.forEach(el => el.classList.add('reveal-on-scroll'));

  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Voeg een kleine delay toe op basis van index voor een 'stagger' effect
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   8. Subtiele Parallax op Hero Image (Geoptimaliseerd met rAF)
   ========================================================================== */
function initParallax() {
  const heroVisual = document.querySelector(".hero-visual");
  const heroBadge = document.querySelector(".hero-floating-badge");
  
  if (!heroVisual || !heroBadge) return;
  
  let ticking = false;
  
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          heroVisual.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0)`;
          heroBadge.style.transform = `translate3d(0, ${scrollY * -0.04}px, 0)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   9. Magnetische WhatsApp Knop (Geoptimaliseerd met rAF)
   ========================================================================== */
function initMagneticButton() {
  const waBtn = document.querySelector(".wa-float-btn");
  if (!waBtn) return;
  
  let ticking = false;
  
  waBtn.addEventListener("mousemove", (e) => {
    if (!ticking) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      window.requestAnimationFrame(() => {
        const rect = waBtn.getBoundingClientRect();
        const h = rect.width / 2;
        const x = clientX - rect.left - h;
        const y = clientY - rect.top - (rect.height / 2);
        
        waBtn.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0) scale(1.02)`;
        ticking = false;
      });
      ticking = true;
    }
  });
  
  waBtn.addEventListener("mouseleave", () => {
    waBtn.style.transform = "";
  });
}


/* ==========================================================================
   10. Ambient Background (Multiple Shapes)
   ========================================================================== */
/* ==========================================================================
   10. Ambient Background (Distributed across full page height)
   ========================================================================== */
function initAmbientBackground() {
  const layer = document.createElement("div");
  layer.className = "bg-ambient-layer";
  
  // 6 smaakvolle, asymmetrisch verdeelde vormen over de hele lengte
  const shapes = [
    { size: 520, top: "4%", left: "-4%", rot: 24, delay: "0s", op: 0.22 },
    { size: 480, top: "22%", right: "4%", rot: -36, delay: "-5s", op: 0.24 },
    { size: 430, top: "41%", left: "12%", rot: 48, delay: "-11s", op: 0.20 },
    { size: 500, top: "59%", right: "8%", rot: -20, delay: "-3s", op: 0.23 },
    { size: 450, top: "76%", left: "-2%", rot: 58, delay: "-8s", op: 0.21 },
    { size: 540, top: "91%", right: "20%", rot: -15, delay: "-14s", op: 0.25 }
  ];
  
  const svgContent = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0071e3" />
          <stop offset="100%" stop-color="#389bf2" />
        </linearGradient>
      </defs>
      <polygon points="50,5 95,95 5,95" fill="url(#blueGrad)" />
    </svg>
  `);
  
  shapes.forEach(s => {
    const el = document.createElement("div");
    el.className = "bg-shape";
    el.style.width = `${s.size}px`;
    el.style.height = `${s.size}px`;
    el.style.top = s.top;
    if (s.left) el.style.left = s.left;
    if (s.right) el.style.right = s.right;
    el.style.setProperty("--base-rot", `${s.rot}deg`);
    el.style.setProperty("--base-op", s.op);
    el.style.animationDelay = s.delay;
    el.style.backgroundImage = `url("data:image/svg+xml,${svgContent}")`;
    layer.appendChild(el);
  });
  
  document.body.prepend(layer);
}

