/**
 * Al Madina Food Store — Digital Signage Script v2
 * Multi-page menu board with Google Sheets CMS and manual page routing.
 */

(function () {
  'use strict';

  const STORAGE_PREFIX = 'alMadina_';

  const SILHOUETTES = {
    chicken: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <path d="M120 30 C140 10 170 20 175 45 C180 65 165 80 150 85 L155 100 C160 115 150 130 135 135 L130 150 C125 158 110 160 100 155 L85 150 C70 145 60 130 65 115 L70 100 C55 95 40 80 45 60 C50 35 80 25 100 35 C105 32 112 30 120 30 Z" fill="currentColor"/>
    </svg>`,
    lamb: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="85" rx="70" ry="40" fill="currentColor"/>
      <circle cx="165" cy="55" r="28" fill="currentColor"/>
      <path d="M50 90 L30 110 M55 95 L35 120 M60 100 L45 125" stroke="currentColor" stroke-width="4" fill="none"/>
      <path d="M140 50 L155 30 M160 55 L178 38" stroke="currentColor" stroke-width="3" fill="none"/>
    </svg>`,
    beef: `<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="120" cy="90" rx="80" ry="45" fill="currentColor"/>
      <ellipse cx="175" cy="60" rx="30" ry="22" fill="currentColor"/>
      <path d="M45 85 L25 105 M50 92 L28 115 M55 98 L38 122" stroke="currentColor" stroke-width="4" fill="none"/>
      <path d="M60 75 Q50 55 65 45" stroke="currentColor" stroke-width="3" fill="none"/>
    </svg>`
  };

  let pageData = {};
  let currentPageIndex = 0;
  let refreshTimer = null;
  let rotationTimer = null;
  let slideshowTimer = null;
  let slideshowIndex = 0;
  let isTransitioning = false;

  const els = {
    storeName:      document.getElementById('storeName'),
    mainTitle:      document.getElementById('mainTitle'),
    pageSubtitle:   document.getElementById('pageSubtitle'),
    openHours:      document.getElementById('openHours'),
    menuGrid:       document.getElementById('menuGrid'),
    pageNav:        document.getElementById('pageNav'),
    statusIndicator:document.getElementById('statusIndicator'),
    animalSilhouette:document.getElementById('animalSilhouette'),
    cornerPhotos:   document.getElementById('cornerPhotos'),
    promoBanner:    document.getElementById('promoBanner'),
    promoBannerText:document.getElementById('promoBannerText'),
    footerDate:     document.getElementById('footerDate'),
    footerClock:    document.getElementById('footerClock'),
    fullscreenBtn:  document.getElementById('fullscreenBtn'),
    slideshowBg:    document.getElementById('slideshowBg'),
    app:            document.getElementById('app')
  };

  // ─── Init ───────────────────────────────────────────────────────────

  function init() {
    applyBranding();
    setupNavigation();
    setupPromoBanner();
    setupSlideshow();
    setupFullscreen();
    startClock();

    CONFIG.PAGES.forEach(page => {
      const cached = loadFromStorage(STORAGE_PREFIX + page.id);
      pageData[page.id] = cached && cached.length ? cached : page.fallback;
    });

    let startPage = 0;
    const initialHash = window.location.hash.substring(1).toLowerCase();
    const hashIndex = CONFIG.PAGES.findIndex(p => p.id === initialHash);
    if (hashIndex !== -1) {
      startPage = hashIndex;
    } else {
      history.replaceState(null, '', '#' + CONFIG.PAGES[0].id);
    }

    showPage(startPage, false);
    fetchAllPages();

    refreshTimer = setInterval(fetchAllPages, CONFIG.REFRESH_INTERVAL_MS);

    if (CONFIG.AUTO_ROTATE) {
      rotationTimer = setInterval(() => {
        const next = (currentPageIndex + 1) % CONFIG.PAGES.length;
        window.location.hash = CONFIG.PAGES[next].id;
      }, CONFIG.PAGE_ROTATION_MS);
    }
  }

  // ─── Branding ───────────────────────────────────────────────────────

  function applyBranding() {
    els.storeName.textContent = CONFIG.STORE_NAME;
    els.openHours.textContent = CONFIG.OPEN_HOURS;
  }

  // ─── Navigation & Routing ───────────────────────────────────────────

  function setupNavigation() {
    window.addEventListener('hashchange', handleHashRoute);
  }

  function handleHashRoute() {
    const hash = window.location.hash.substring(1).toLowerCase();
    const pageIndex = CONFIG.PAGES.findIndex(p => p.id === hash);
    if (pageIndex !== -1 && pageIndex !== currentPageIndex) {
      showPage(pageIndex, true);
    }
  }

  function getCurrentPage() {
    return CONFIG.PAGES[currentPageIndex];
  }

  function showPage(index, animate) {
    if (isTransitioning && animate) return;
    currentPageIndex = index;
    const page = CONFIG.PAGES[index];
    const items = pageData[page.id] || page.fallback;

    const apply = () => {
      els.mainTitle.textContent = page.title;
      els.pageSubtitle.textContent = page.subtitle || CONFIG.SUBTITLE;
      els.animalSilhouette.innerHTML = SILHOUETTES[page.silhouette] || '';
      els.animalSilhouette.dataset.animal = page.silhouette;
      renderCornerPhotos(page);
      renderMenu(items, page, animate);
      updateNavigation(index);
      document.title = `${CONFIG.STORE_NAME} — ${page.title}`;
    };

    if (animate) {
      isTransitioning = true;
      els.app.classList.add('page-fade-out');
      setTimeout(() => {
        apply();
        els.app.classList.remove('page-fade-out');
        els.app.classList.add('page-fade-in');
        setTimeout(() => {
          els.app.classList.remove('page-fade-in');
          isTransitioning = false;
        }, 600);
      }, 400);
    } else {
      apply();
    }
  }

  function updateNavigation(index) {
    const page = CONFIG.PAGES[index];
    els.pageNav.querySelectorAll('.nav-item').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page.id);
    });
  }

  // ─── Corner Photos ──────────────────────────────────────────────────

  function renderCornerPhotos(page) {
    els.cornerPhotos.innerHTML = '';
    if (!page.cornerImages || !page.cornerImages.length) return;
    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    page.cornerImages.forEach((filename, i) => {
      if (!filename) return;
      const img = document.createElement('img');
      img.src = `${page.imageFolder}/${filename}`;
      img.className = `corner-photo ${positions[i] || ''}`;
      img.alt = '';
      img.onerror = () => { img.style.display = 'none'; };
      els.cornerPhotos.appendChild(img);
    });
  }

  // ─── Google Sheets ──────────────────────────────────────────────────

  function buildSheetUrl(sheetName) {
    const id = CONFIG.GOOGLE_SHEET_ID;
    return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  }

  async function fetchSheet(sheetName) {
    const response = await fetch(buildSheetUrl(sheetName));
    if (!response.ok) throw new Error(`Sheet fetch failed: ${response.status}`);
    return parseGvizResponse(await response.text());
  }

  function parseGvizResponse(text) {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1) throw new Error('Invalid Google Sheets response');

    const data = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    const rows = data.table?.rows || [];

    return rows.map(row => {
      const cells = row.c || [];
      const product = cells[0]?.v;
      const price   = cells[1]?.v;
      const image   = cells[2]?.v;
      if (!product || !price) return null;

      const productStr = String(product).trim();
      const priceStr   = String(price).trim();
      if (productStr.toLowerCase() === 'product' || priceStr.toLowerCase() === 'price') return null;
      if (productStr.startsWith('A (') || productStr.startsWith('B (')) return null;

      const item = { product: productStr, price: priceStr };
      if (image) item.image = String(image).trim();
      return item;
    }).filter(Boolean);
  }

  async function fetchAllPages() {
    if (CONFIG.GOOGLE_SHEET_ID === 'YOUR_SHEET_ID_HERE') {
      setStatus('Set your Sheet ID in config.js', 'offline');
      return;
    }

    let anyLive = false;

    for (const page of CONFIG.PAGES) {
      try {
        const menu = await fetchSheet(page.sheetName);
        if (menu.length > 0) {
          const old = pageData[page.id] || [];
          const changed = hasMenuChanged(menu, old);
          pageData[page.id] = menu;
          saveToStorage(STORAGE_PREFIX + page.id, menu);
          anyLive = true;

          if (page.id === getCurrentPage().id) {
            renderMenu(menu, page, changed);
          }
        }
      } catch (err) {
        console.warn(`Fetch error (${page.sheetName}):`, err.message);
      }
    }

    setStatus(
      anyLive
        ? 'Live — updated ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
        : 'Offline — showing cached menu',
      anyLive ? 'live' : 'offline'
    );
  }

  // ─── Rendering ──────────────────────────────────────────────────────

  function hasMenuChanged(newMenu, oldMenu) {
    if (newMenu.length !== oldMenu.length) return true;
    return newMenu.some((item, i) =>
      item.product !== oldMenu[i]?.product ||
      item.price   !== oldMenu[i]?.price   ||
      item.image   !== oldMenu[i]?.image
    );
  }

  function renderMenu(items, page, animate) {
    els.menuGrid.innerHTML = '';
    els.menuGrid.dataset.page  = page.id;
    els.menuGrid.dataset.count = items.length;

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.setAttribute('role', 'listitem');
      card.dataset.product = item.product;

      if (animate) {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.04}s`;
      }

      let imageHtml = '';
      if (item.image) {
        const src = `${page.imageFolder}/${item.image}`;
        imageHtml = `<img class="card-image" src="${escapeHtml(src)}" alt="" onerror="this.style.display='none'">`;
      }

      card.innerHTML = `
        ${imageHtml}
        <p class="product-name">${escapeHtml(item.product).replace(/\//g, '/&#8203;')}</p>
        <p class="product-price">${escapeHtml(item.price)}</p>
      `;

      els.menuGrid.appendChild(card);
    });
  }

  // ─── Promo Banner ───────────────────────────────────────────────────

  function setupPromoBanner() {
    if (!CONFIG.PROMO_BANNER_ENABLED || !CONFIG.PROMO_BANNER_TEXT) return;
    els.promoBanner.classList.remove('hidden');
    els.promoBannerText.textContent = CONFIG.PROMO_BANNER_TEXT;
  }

  // ─── Background Slideshow ───────────────────────────────────────────

  function setupSlideshow() {
    if (!CONFIG.BACKGROUND_SLIDESHOW || CONFIG.BACKGROUND_IMAGES.length < 2) return;
    slideshowIndex = 0;
    setBackgroundImage(CONFIG.BACKGROUND_IMAGES[0]);
    slideshowTimer = setInterval(() => {
      slideshowIndex = (slideshowIndex + 1) % CONFIG.BACKGROUND_IMAGES.length;
      setBackgroundImage(CONFIG.BACKGROUND_IMAGES[slideshowIndex]);
    }, CONFIG.SLIDESHOW_INTERVAL_MS);
  }

  function setBackgroundImage(src) {
    els.slideshowBg.style.opacity = '0';
    setTimeout(() => {
      els.slideshowBg.style.backgroundImage = `url('${src}')`;
      els.slideshowBg.style.opacity = '1';
    }, 800);
  }

  // ─── Fullscreen ─────────────────────────────────────────────────────

  function setupFullscreen() {
    els.fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('keydown', e => {
      if (e.key === 'F11') { e.preventDefault(); toggleFullscreen(); }
    });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  // ─── Clock ──────────────────────────────────────────────────────────

  function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
  }

  function updateClock() {
    const now = new Date();
    els.footerClock.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    els.footerDate.textContent  = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  // ─── Status ─────────────────────────────────────────────────────────

  function setStatus(text, state) {
    const dot   = els.statusIndicator.querySelector('.status-dot');
    const label = els.statusIndicator.querySelector('.status-text');
    dot.className  = 'status-dot ' + (state || '');
    label.textContent = text;
  }

  // ─── Storage ────────────────────────────────────────────────────────

  function saveToStorage(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {}
  }

  function loadFromStorage(key) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (_) { return null; }
  }

  // ─── Utilities ──────────────────────────────────────────────────────

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Start ──────────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
