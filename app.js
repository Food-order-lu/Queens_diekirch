/* ====================================================
   RESTAURANT QUEENS · DIEKIRCH
   App Logic: Admin Panel, Gallery, Lightbox, Navigation
   ==================================================== */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════
  // CONSTANTS & CONFIG
  // ═══════════════════════════════════════════════
  const STORAGE = {
    MENU_IMAGE: 'queens_menu_image',
    GALLERY_ITEMS: 'queens_gallery_items'
  };

  const DEFAULT_GALLERY = [
    { src: 'images/suckling-pig.png',    label: 'Cochon de lait (Leitão)' },
    { src: 'images/churrasco.png',       label: 'Grillades Mixtes' },
    { src: 'images/sardines.png',        label: 'Sardines Grillées' },
    { src: 'images/ribs.png',            label: 'Travers de Porc' },
    { src: 'images/cassoulet.png',       label: 'Feijoada Royale' },
    { src: 'images/bacalhau.jpg',        label: 'Bacalhau à Portuguesa' },
    { src: 'images/batatas.jpg',         label: 'Bacalhau à Brás' },
    { src: 'images/carpaccio.jpg',       label: 'Carpaccio de Bœuf' },
    { src: 'images/steak-roquette.jpg',  label: 'Steak Queens' }
  ];

  // Global state for gallery/lightbox
  let galleryData = [];
  let currentIndex = 0;
  let previousFocus = null;

  // ═══════════════════════════════════════════════
  // UTILS
  // ═══════════════════════════════════════════════
  const $ = (id) => document.getElementById(id);
  const $$ = (selector) => document.querySelectorAll(selector);

  // ═══════════════════════════════════════════════
  // GALLERY RENDERER
  // ═══════════════════════════════════════════════
  function getGalleryItems() {
    const stored = localStorage.getItem(STORAGE.GALLERY_ITEMS);
    const adminItems = stored ? JSON.parse(stored) : [];
    return [...DEFAULT_GALLERY, ...adminItems];
  }

  function renderGallery() {
    const grid = $('galleryGrid');
    if (!grid) return;
    
    const items = getGalleryItems();
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

    initLightbox();
  }

  // ═══════════════════════════════════════════════
  // MENU IMAGE
  // ═══════════════════════════════════════════════
  function loadMenuImage() {
    const menuImg = $('menuImage');
    const menuPlaceholder = $('menuPlaceholder');
    if (!menuImg || !menuPlaceholder) return;
    
    const stored = localStorage.getItem(STORAGE.MENU_IMAGE);
    if (stored) {
      menuImg.src = stored;
      menuImg.style.display = 'block';
      menuPlaceholder.style.display = 'none';
    } else {
      menuImg.style.display = 'none';
      menuPlaceholder.style.display = 'block';
    }
  }

  // ═══════════════════════════════════════════════
  // LIGHTBOX LOGIC
  // ═══════════════════════════════════════════════
  function initLightbox() {
    const lb = $('lightbox');
    if (!lb) return;

    const galleryItems = $$('.gallery-item');
    galleryData = Array.from(galleryItems).map(item => ({
      src: item.querySelector('img').src,
      alt: item.querySelector('img').alt,
      label: item.querySelector('.gallery-item__label')?.textContent || ''
    }));

    galleryItems.forEach((item, index) => {
      item.onclick = () => openLightbox(index);
      item.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      };
    });
  }

  function openLightbox(index) {
    const lb = $('lightbox');
    if (!lb) return;
    currentIndex = index;
    previousFocus = document.activeElement;
    updateLightbox();
    lb.hidden = false;
    void lb.offsetWidth;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    $('lightboxClose')?.focus();
  }

  function closeLightbox() {
    const lb = $('lightbox');
    if (!lb) return;
    lb.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lb.hidden = true;
      if (previousFocus) previousFocus.focus();
    }, 400);
  }

  function updateLightbox() {
    const item = galleryData[currentIndex];
    if (!item) return;
    const lbImg = $('lightboxImg');
    const lbCap = $('lightboxCaption');
    if (lbImg) lbImg.src = item.src;
    if (lbImg) lbImg.alt = item.alt;
    if (lbCap) lbCap.textContent = item.label;

    // Reset visibility of markers if multiple
    if ($('lightboxPrev')) $('lightboxPrev').style.display = galleryData.length > 1 ? 'block' : 'none';
    if ($('lightboxNext')) $('lightboxNext').style.display = galleryData.length > 1 ? 'block' : 'none';
  }

  function nextImage() {
    if (galleryData.length <= 1) return;
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightbox();
  }

  function prevImage() {
    if (galleryData.length <= 1) return;
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightbox();
  }

  // ═══════════════════════════════════════════════
  // NAVIGATION & UI
  // ═══════════════════════════════════════════════
  function initNavigation() {
    const navbar = $('navbar');
    const navBurger = $('navBurger');
    const navMenu = $('navMenu');
    const navOverlay = $('navOverlay');
    const navLinks = $$('.navbar__link');

    if (!navbar) return;

    const toggleNav = (open) => {
      const isOpening = open !== undefined ? open : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isOpening);
      navBurger.classList.toggle('open', isOpening);
      navOverlay.classList.toggle('active', isOpening);
      document.body.style.overflow = isOpening ? 'hidden' : '';
    };

    if (navBurger && navMenu && navOverlay) {
      navBurger.onclick = () => toggleNav();
      navOverlay.onclick = () => toggleNav(false);
      navLinks.forEach(link => link.onclick = () => toggleNav(false));
    }

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════
  // ADMIN PANEL
  // ═══════════════════════════════════════════════
  function ensureAdminPanelUI() {
    if ($('adminPanel')) return;
    const panel = document.createElement('div');
    panel.id = 'adminPanel';
    panel.className = 'admin-panel';
    panel.hidden = true;
    panel.innerHTML = `
      <div class="admin-panel__inner">
        <div class="admin-panel__header">
          <h2>🔧 Administration</h2>
          <button class="admin-panel__close" id="adminClose">&times;</button>
        </div>
        <div class="admin-panel__section">
          <h3>📋 Menu de la Semaine</h3>
          <p class="admin-panel__hint">Uploadez l'image du menu (JPG/PNG)</p>
          <label class="admin-upload-btn" for="menuUpload">📤 Choisir une image
            <input type="file" id="menuUpload" accept="image/*" hidden />
          </label>
          <div class="admin-panel__preview" id="menuPreview"></div>
          <button class="btn btn--sm btn--danger" id="menuClear" style="display:none;">🗑️ Effacer le menu</button>
        </div>
        <div class="admin-panel__section">
          <h3>📸 Galerie Photos</h3>
          <label class="admin-upload-btn" for="galleryUpload">📤 Ajouter des photos
            <input type="file" id="galleryUpload" accept="image/*" multiple hidden />
          </label>
          <div class="admin-gallery-list" id="adminGalleryList"></div>
          <button class="btn btn--sm btn--danger" id="galleryClearAll" style="display:none;">🗑️ Tout supprimer</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
  }

  function setupAdminEvents() {
    const logo = document.querySelector('.navbar__logo');
    const adminPanel = $('adminPanel');
    const adminClose = $('adminClose');

    if (!logo || !adminPanel) return;

    let clicks = 0;
    let timer;
    logo.onclick = () => {
      clicks++;
      if (clicks === 5) {
        const pass = prompt('Mot de passe :');
        if (pass === 'queens') {
          adminPanel.classList.add('open');
          loadAdminState();
        }
        clicks = 0;
      }
      clearTimeout(timer);
      timer = setTimeout(() => clicks = 0, 2000);
    };

    if (adminClose) adminClose.onclick = () => adminPanel.classList.remove('open');

    // Setup input listeners
    const menuUp = $('menuUpload');
    const menuClr = $('menuClear');
    const galleryUp = $('galleryUpload');
    const galleryClr = $('galleryClearAll');

    if (menuUp) menuUp.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        localStorage.setItem(STORAGE.MENU_IMAGE, ev.target.result);
        loadMenuImage();
        loadAdminState();
      };
      reader.readAsDataURL(file);
    };

    if (menuClr) menuClr.onclick = () => {
      localStorage.removeItem(STORAGE.MENU_IMAGE);
      loadMenuImage();
      loadAdminState();
    };

    if (galleryUp) galleryUp.onchange = (e) => {
      const files = Array.from(e.target.files);
      const stored = localStorage.getItem(STORAGE.GALLERY_ITEMS);
      const items = stored ? JSON.parse(stored) : [];
      let loaded = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
          items.push({ src: ev.target.result, label: name.charAt(0).toUpperCase() + name.slice(1) });
          if (++loaded === files.length) {
            localStorage.setItem(STORAGE.GALLERY_ITEMS, JSON.stringify(items));
            renderGallery();
            loadAdminState();
          }
        };
        reader.readAsDataURL(file);
      });
    };

    if (galleryClr) galleryClr.onclick = () => {
      if (confirm('Supprimer toutes vos photos ajoutées ?')) {
        localStorage.removeItem(STORAGE.GALLERY_ITEMS);
        renderGallery();
        loadAdminState();
      }
    };
  }

  function loadAdminState() {
    const menuPrev = $('menuPreview');
    const menuClr = $('menuClear');
    const galleryList = $('adminGalleryList');
    const galleryClr = $('galleryClearAll');

    if (!menuPrev) return;

    const menuData = localStorage.getItem(STORAGE.MENU_IMAGE);
    if (menuData) {
      menuPrev.innerHTML = `<img src="${menuData}" alt="Menu Preview" />`;
      if (menuClr) menuClr.style.display = 'inline-flex';
    } else {
      menuPrev.innerHTML = '<p>Aucun menu.</p>';
      if (menuClr) menuClr.style.display = 'none';
    }

    const stored = localStorage.getItem(STORAGE.GALLERY_ITEMS);
    const items = stored ? JSON.parse(stored) : [];
    if (items.length > 0) {
      galleryList.innerHTML = items.map((item, i) => `
        <div class="admin-gallery-item">
          <img src="${item.src}" alt="${item.label}" />
          <button class="remove-item" data-index="${i}">✕</button>
        </div>
      `).join('');
      if (galleryClr) galleryClr.style.display = 'inline-flex';
      
      galleryList.querySelectorAll('.remove-item').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.index);
          const current = JSON.parse(localStorage.getItem(STORAGE.GALLERY_ITEMS));
          current.splice(idx, 1);
          localStorage.setItem(STORAGE.GALLERY_ITEMS, JSON.stringify(current));
          renderGallery();
          loadAdminState();
        };
      });
    } else {
      galleryList.innerHTML = '<p>Aucune photo admin.</p>';
      if (galleryClr) galleryClr.style.display = 'none';
    }
  }

  // ═══════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════
  function init() {
    ensureAdminPanelUI();
    initNavigation();
    loadMenuImage();
    renderGallery();
    setupAdminEvents();

    // Scroll Animations
    const animEls = $$('.animate-fadein');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    
    animEls.forEach(el => {
      observer.observe(el);
      // Fallback: If not visible in 1.5s, force it
      setTimeout(() => el.classList.add('visible'), 1500);
    });

    // Lightbox Global Events
    const lbClose = $('lightboxClose');
    const lbPrev = $('lightboxPrev');
    const lbNext = $('lightboxNext');
    if (lbClose) lbClose.onclick = closeLightbox;
    if (lbPrev) lbPrev.onclick = prevImage;
    if (lbNext) lbNext.onclick = nextImage;

    document.onkeydown = (e) => {
      const lb = $('lightbox');
      if (!lb || lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    // Menu image also opens in lightbox
    const mImg = $('menuImage');
    const lb = $('lightbox');
    if (mImg && lb) {
      mImg.onclick = () => {
        const lbImg = $('lightboxImg');
        const lbCap = $('lightboxCaption');
        if (lbImg) lbImg.src = mImg.src;
        if (lbCap) lbCap.textContent = 'Menu de la Semaine';
        lb.hidden = false;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
        if ($('lightboxPrev')) $('lightboxPrev').style.display = 'none';
        if ($('lightboxNext')) $('lightboxNext').style.display = 'none';
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
