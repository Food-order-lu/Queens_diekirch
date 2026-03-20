/* ====================================================
   RESTAURANT QUEENS · DIEKIRCH
   App Logic: Admin Panel, Gallery, Lightbox, GloriaFood
   ==================================================== */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════
  // STORAGE KEYS
  // ═══════════════════════════════════════════════
  const STORAGE = {
    MENU_IMAGE: 'queens_menu_image',
    GALLERY_ITEMS: 'queens_gallery_items'
  };

  // Default gallery images (shipped with the site)
  const DEFAULT_GALLERY = [
    { src: 'images/carpaccio.jpg',      label: 'Carpaccio de Bœuf' },
    { src: 'images/bacalhau.jpg',       label: 'Bacalhau à Portuguesa' },
    { src: 'images/batatas.jpg',        label: 'Bacalhau à Brás' },
    { src: 'images/steak-roquette.jpg', label: 'Steak à la Roquette' }
  ];


  // ═══════════════════════════════════════════════
  // GALLERY RENDERER
  // ═══════════════════════════════════════════════
  function getGalleryItems() {
    const stored = localStorage.getItem(STORAGE.GALLERY_ITEMS);
    const adminItems = stored ? JSON.parse(stored) : [];
    return [...DEFAULT_GALLERY, ...adminItems];
  }

  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const items = getGalleryItems();

    // Layout classes for visual variety
    const layoutClasses = ['gallery-item--tall', '', '', 'gallery-item--wide', '', 'gallery-item--tall'];

    grid.innerHTML = items.map((item, i) => {
      const layoutClass = layoutClasses[i % layoutClasses.length];
      return `
        <div class="gallery-item ${layoutClass}" role="listitem" tabindex="0" 
             data-index="${i}" aria-label="Voir la photo : ${item.label}">
          <img src="${item.src}" alt="${item.label}" loading="lazy" />
          <div class="gallery-item__overlay">
            <span class="gallery-item__label">${item.label}</span>
          </div>
        </div>
      `;
    }).join('');

    // Re-bind lightbox after render
    initLightbox();
  }


  // ═══════════════════════════════════════════════
  // MENU IMAGE
  // ═══════════════════════════════════════════════
  function loadMenuImage() {
    const menuImage = document.getElementById('menuImage');
    const menuPlaceholder = document.getElementById('menuPlaceholder');
    const stored = localStorage.getItem(STORAGE.MENU_IMAGE);

    if (stored) {
      menuImage.src = stored;
      menuImage.style.display = 'block';
      menuPlaceholder.style.display = 'none';
    } else {
      menuImage.style.display = 'none';
      menuPlaceholder.style.display = 'block';
    }
  }


  // ═══════════════════════════════════════════════
  // LIGHTBOX
  // ═══════════════════════════════════════════════
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;
  let previousFocus = null;
  let galleryData = [];

  function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryData = Array.from(galleryItems).map(item => ({
      src: item.querySelector('img').src,
      alt: item.querySelector('img').alt,
      label: item.querySelector('.gallery-item__label')?.textContent || ''
    }));

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
    });
  }

  function openLightbox(index) {
    currentIndex = index;
    previousFocus = document.activeElement;
    updateLightbox();
    lightbox.hidden = false;
    void lightbox.offsetWidth;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightbox.hidden = true;
      if (previousFocus) previousFocus.focus();
    }, 400);
  }

  function updateLightbox() {
    const item = galleryData[currentIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = item.label;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightbox();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightbox();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    switch (e.key) {
      case 'Escape': closeLightbox(); break;
      case 'ArrowLeft': prevImage(); break;
      case 'ArrowRight': nextImage(); break;
    }
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 60) { diff > 0 ? prevImage() : nextImage(); }
  }, { passive: true });

  // Also let menu image open in lightbox
  const menuImage = document.getElementById('menuImage');
  menuImage.addEventListener('click', () => {
    previousFocus = document.activeElement;
    lightboxImg.src = menuImage.src;
    lightboxImg.alt = menuImage.alt;
    lightboxCaption.textContent = 'Menu de la Semaine';
    lightbox.hidden = false;
    void lightbox.offsetWidth;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Hide prev/next for single image
    lightboxPrev.style.display = 'none';
    lightboxNext.style.display = 'none';
    lightboxClose.focus();
  });


  // ═══════════════════════════════════════════════
  // NAVBAR
  // ═══════════════════════════════════════════════
  const navbar = document.getElementById('navbar');
  const navBurger = document.getElementById('navBurger');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('[data-nav]');

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  function openMobileNav() {
    navMenu.classList.add('open');
    navBurger.classList.add('open');
    navOverlay.classList.add('active');
    navOverlay.setAttribute('aria-hidden', 'false');
    navBurger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    navMenu.classList.remove('open');
    navBurger.classList.remove('open');
    navOverlay.classList.remove('active');
    navOverlay.setAttribute('aria-hidden', 'true');
    navBurger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navBurger.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });

  navOverlay.addEventListener('click', closeMobileNav);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });


  // ═══════════════════════════════════════════════
  // ADMIN PANEL
  // ═══════════════════════════════════════════════
  // ── Admin Panel (Hidden Shortcut: 5 clicks on logo) ──
  const adminPanel = document.getElementById('adminPanel');
  const adminClose = document.getElementById('adminClose');
  const logo = document.querySelector('.navbar__logo');

  let logoClicks = 0;
  let logoTimer;

  logo.addEventListener('click', (e) => {
    logoClicks++;
    
    if (logoClicks === 5) {
      const pass = prompt('Entrez le mot de passe administration :');
      if (pass === 'admin queens' || pass === 'queens') { 
        adminPanel.classList.add('open');
        loadAdminState();
      } else {
        alert('Mot de passe incorrect.');
      }
      logoClicks = 0;
    }

    clearTimeout(logoTimer);
    logoTimer = setTimeout(() => { logoClicks = 0; }, 3000);
  });

  adminClose.addEventListener('click', () => {
    adminPanel.classList.remove('open');
  });

  // ── Menu Upload ──
  const menuUpload = document.getElementById('menuUpload');
  const menuPreview = document.getElementById('menuPreview');
  const menuClear = document.getElementById('menuClear');

  menuUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      localStorage.setItem(STORAGE.MENU_IMAGE, dataUrl);
      loadMenuImage();
      loadAdminState();
    };
    reader.readAsDataURL(file);
  });

  menuClear.addEventListener('click', () => {
    localStorage.removeItem(STORAGE.MENU_IMAGE);
    loadMenuImage();
    loadAdminState();
  });

  // ── Gallery Upload ──
  const galleryUpload = document.getElementById('galleryUpload');
  const adminGalleryList = document.getElementById('adminGalleryList');
  const galleryClearAll = document.getElementById('galleryClearAll');

  galleryUpload.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const stored = localStorage.getItem(STORAGE.GALLERY_ITEMS);
    const existingItems = stored ? JSON.parse(stored) : [];

    let loaded = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        existingItems.push({
          src: ev.target.result,
          label: name.charAt(0).toUpperCase() + name.slice(1)
        });
        loaded++;
        if (loaded === files.length) {
          localStorage.setItem(STORAGE.GALLERY_ITEMS, JSON.stringify(existingItems));
          renderGallery();
          loadAdminState();
        }
      };
      reader.readAsDataURL(file);
    });
  });

  galleryClearAll.addEventListener('click', () => {
    localStorage.removeItem(STORAGE.GALLERY_ITEMS);
    renderGallery();
    loadAdminState();
  });

  function removeGalleryItem(index) {
    const stored = localStorage.getItem(STORAGE.GALLERY_ITEMS);
    const items = stored ? JSON.parse(stored) : [];
    items.splice(index, 1);
    localStorage.setItem(STORAGE.GALLERY_ITEMS, JSON.stringify(items));
    renderGallery();
    loadAdminState();
  }

  function loadAdminState() {
    // Menu preview
    const menuData = localStorage.getItem(STORAGE.MENU_IMAGE);
    if (menuData) {
      menuPreview.innerHTML = `<img src="${menuData}" alt="Aperçu menu" />`;
      menuClear.style.display = 'inline-flex';
    } else {
      menuPreview.innerHTML = '<p style="color: var(--gray-400); font-size: 0.85rem;">Aucun menu uploadé</p>';
      menuClear.style.display = 'none';
    }

    // Gallery list
    const stored = localStorage.getItem(STORAGE.GALLERY_ITEMS);
    const items = stored ? JSON.parse(stored) : [];
    if (items.length > 0) {
      adminGalleryList.innerHTML = items.map((item, i) => `
        <div class="admin-gallery-item">
          <img src="${item.src}" alt="${item.label}" />
          <button class="admin-gallery-item__remove" data-remove="${i}" aria-label="Supprimer ${item.label}">✕</button>
        </div>
      `).join('');
      galleryClearAll.style.display = 'inline-flex';

      adminGalleryList.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => removeGalleryItem(parseInt(btn.dataset.remove)));
      });
    } else {
      adminGalleryList.innerHTML = '<p style="color: var(--gray-400); font-size: 0.85rem;">Aucune photo admin ajoutée</p>';
      galleryClearAll.style.display = 'none';
    }


  }




  // ═══════════════════════════════════════════════
  // SCROLL ANIMATIONS
  // ═══════════════════════════════════════════════
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-fadein').forEach(el => observer.observe(el));
  }


  // ═══════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    loadMenuImage();
    renderGallery();
    initScrollAnimations();
    onScroll();
  });

})();
