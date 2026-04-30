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
    GALLERY_ITEMS: 'queens_gallery_items',
    WEEKLY_MENU_JSON: 'queens_weekly_menu_json'
  };

  const API = {
    WEEKLY_MENU: '/weekly-menu.json'
  };

  const DEFAULT_MENU = {
    weekOf: "17 Mars – 23 Mars 2026",
    days: [
      { day: "Lundi", date: "17 Mars", dishes: [{ name: "Ribs de porc", description: "Accompagnés de pommes de terre au four et salade verte", price: "14.90", tag: "🔥 Populaire" }] },
      { day: "Mardi", date: "18 Mars", dishes: [{ name: "Fermé", description: "Nous sommes fermés le mardi. À demain !", price: null, tag: "🚪 Fermé" }], closed: true },
      { day: "Mercredi", date: "19 Mars", dishes: [{ name: "Petites sardines grillées", description: "Servies avec riz à la tomate et salade", price: "14.90", tag: "🐟 Poisson" }] },
      { day: "Jeudi", date: "20 Mars", dishes: [{ name: "Cassoulet façon Transmontana", description: "Haricots rouges, saucisses et viande de porc mijotés", price: "14.90", tag: "🍲 Tradition" }] },
      { day: "Vendredi", date: "21 Mars", dishes: [{ name: "Tortellini à la crème de jambon", price: "14.90", tag: "🍝 Pâtes" }, { name: "Pota façon Lagareiro", price: "16.90", tag: "🐙 Fruits de mer" }] },
      { day: "Samedi", date: "22 Mars", dishes: [{ name: "Choucroute garnie", description: "Choucroute traditionnelle avec saucisses et viande fumée", price: "18.90", tag: "⭐ Spécial Weekend" }] },
      { day: "Dimanche", date: "23 Mars", dishes: [{ name: "Porcelet façon maison", description: "Cochon de lait rôti croustillant, légumes du marché", price: "19.90", tag: "👑 Spécial Dimanche" }] }
    ]
  };

  const DEFAULT_GALLERY = [
    { src: 'images/bacalhau.jpg',        label: 'Bacalhau à Portuguesa' },
    { src: 'images/batatas.jpg',         label: 'Bacalhau à Brás' },
    { src: 'images/carpaccio.jpg',       label: 'Carpaccio de Bœuf' },
    { src: 'images/steak-roquette.jpg',  label: 'Steak Queens' },
    { src: 'images/Queens/627743248_122110019841215837_4204416791411020826_n.jpg', label: 'Queens 1' },
    { src: 'images/Queens/627796303_122110019475215837_5430384203999375145_n.jpg', label: 'Queens 2' },
    { src: 'images/Queens/634057008_122111468589215837_3828487695051494631_n.jpg', label: 'Queens 3' },
    { src: 'images/Queens/634087315_122111468895215837_9145182799219835581_n.jpg', label: 'Queens 4' },
    { src: 'images/Queens/634329209_122111467941215837_8287282115241487640_n.jpg', label: 'Queens 5' },
    { src: 'images/Queens/636907184_122112865605215837_7686141593221583875_n (1).jpg', label: 'Queens 6' },
    { src: 'images/Queens/636907184_122112865605215837_7686141593221583875_n.jpg', label: 'Queens 7' },
    { src: 'images/Queens/637158104_122112865179215837_4988832843147592840_n.jpg', label: 'Queens 8' },
    { src: 'images/Queens/637662028_122112864855215837_4987314281872629858_n.jpg', label: 'Queens 9' },
    { src: 'images/Queens/642249865_122114121993215837_6771031720058429946_n.jpg', label: 'Queens 10' },
    { src: 'images/Queens/642262416_122114120751215837_909782779303998567_n.jpg', label: 'Queens 11' },
    { src: 'images/Queens/643877238_122114121459215837_7521790760515008819_n.jpg', label: 'Queens 12' },
    { src: 'images/Queens/646387899_122115605439215837_2113884154243322937_n (1).jpg', label: 'Queens 13' },
    { src: 'images/Queens/648174269_122115605877215837_654488904260382651_n.jpg', label: 'Queens 14' },
    { src: 'images/Queens/648816270_122116427199215837_7761401326552966798_n (1).jpg', label: 'Queens 15' },
    { src: 'images/Queens/649487802_122116427511215837_687368217631153325_n.jpg', label: 'Queens 16' },
    { src: 'images/Queens/650252552_122116426809215837_8303350991067738372_n (1).jpg', label: 'Queens 17' },
    { src: 'images/Queens/654310168_122117970891215837_7816125621332543703_n.jpg', label: 'Queens 18' },
    { src: 'images/Queens/655569381_122117971545215837_384947876179943681_n (1).jpg', label: 'Queens 19' },
    { src: 'images/Queens/656762720_122119153569215837_4165249356513355796_n (1).jpg', label: 'Queens 20' },
    { src: 'images/Queens/659027741_122119152999215837_1391761648502867086_n (1).jpg', label: 'Queens 21' },
    { src: 'images/Queens/660856828_122119153299215837_5879972116388762791_n (1).jpg', label: 'Queens 22' },
    { src: 'images/Queens/661006864_122120691993215837_8489622086656452210_n.jpg', label: 'Queens 23' },
    { src: 'images/Queens/661414805_122120419197215837_8382786154582306328_n.jpg', label: 'Queens 24' },
    { src: 'images/Queens/668591619_122120691573215837_7638015397470135629_n.jpg', label: 'Queens 25' },
    { src: 'images/Queens/668655139_122121101349215837_4427351680854774101_n.jpg', label: 'Queens 26' },
    { src: 'images/Queens/669800414_122121100329215837_7060067057218962401_n.jpg', label: 'Queens 27' },
    { src: 'images/Queens/672675411_122122083891215837_7505544867779962205_n.jpg', label: 'Queens 28' },
    { src: 'images/Queens/674178109_122122084209215837_2399025347307132532_n.jpg', label: 'Queens 29' }
  ];

  // Global state for gallery/lightbox
  let galleryData = [];
  let currentIndex = 0;
  let previousFocus = null;
  let scrollObserver = null;

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
    const weeklyGrid = $('weeklyMenuGrid');
    if (!menuImg || !menuPlaceholder) return;
    
    const stored = localStorage.getItem(STORAGE.MENU_IMAGE);
    if (stored) {
      menuImg.src = stored;
      menuImg.style.display = 'block';
      menuPlaceholder.style.display = 'none';
    } else {
      menuImg.style.display = 'none';
      // Only show placeholder if the grid is ALSO empty or doesn't exist
      if (!weeklyGrid || weeklyGrid.children.length === 0) {
        menuPlaceholder.style.display = 'block';
      } else {
        menuPlaceholder.style.display = 'none';
      }
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

  /* ── Weekly Menu ── */
  async function fetchWeeklyMenu() {
    const grid = $('weeklyMenuGrid');
    if (!grid) return;

    try {
      // 1. Prioritize local storage (admin edits)
      let data = null;
      const stored = localStorage.getItem(STORAGE.WEEKLY_MENU_JSON);
      
      if (stored) {
        data = JSON.parse(stored);
      } else {
        // 2. Try fetching the latest JSON
        // Using a try/catch specifically for the fetch to catch CORS/file: errors
        try {
          const response = await fetch(API.WEEKLY_MENU);
          if (response.ok) {
            data = await response.json();
          }
        } catch (fErr) {
          console.log('Fetch skipped or failed (likely CORS/file), using default.');
        }
      }

      // 3. Final fallback to embedded DEFAULT_MENU
      const activeData = data || DEFAULT_MENU;
      
      if (activeData && activeData.days) {
        renderWeeklyMenu(activeData);
      }
      loadMenuImage();
    } catch (err) {
      console.warn('Erreur chargement menu JSON:', err);
      loadMenuImage();
    }
  }

  function renderWeeklyMenu(data) {
    const grid = $('weeklyMenuGrid');
    if (!grid) return;

    grid.innerHTML = data.days.map(day => `
      <div class="day-card ${day.closed ? 'day-card--closed' : ''} animate-fadein">
        <div class="day-card__header">
          <div class="day-card__name">${day.day}</div>
          <div class="day-card__date">${day.date}</div>
        </div>
        <div class="day-card__menu">
          ${day.dishes && day.dishes.length > 0 ? day.dishes.map(dish => `
            <div class="dish-item">
              ${dish.tag ? `<span class="dish-item__tag">${dish.tag}</span>` : ''}
              <div class="dish-item__name">${dish.name}</div>
              ${dish.description ? `<div class="dish-item__desc">${dish.description}</div>` : ''}
              ${dish.price ? `<div class="dish-item__price">${dish.price} €</div>` : ''}
            </div>
          `).join('') : '<div class="dish-item__desc">Fermé</div>'}
        </div>
      </div>
    `).join('');
    
    // Observe the newly added cards
    if (scrollObserver) {
      grid.querySelectorAll('.animate-fadein').forEach(el => scrollObserver.observe(el));
    }
  }

  // ═══════════════════════════════════════════════
  // ANIMATION UTILS
  // ═══════════════════════════════════════════════
  function initScrollAnimations() {
    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    const animEls = $$('.animate-fadein');
    animEls.forEach(el => {
      scrollObserver.observe(el);
      // Fallback: If not visible in 2s, force it
      setTimeout(() => el.classList.add('visible'), 2000);
    });
  }

  // ═══════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════
  function init() {
    ensureAdminPanelUI();
    initNavigation();
    initScrollAnimations();
    loadMenuImage();
    renderGallery();
    setupAdminEvents();
    fetchWeeklyMenu();

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
