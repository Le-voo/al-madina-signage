/**
 * Al Madina Food Store — Digital Signage Script
 * Fetches menu data from Google Sheets and updates the display automatically.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'alMadinaMenuCache';
  const STORAGE_OFFER_KEY = 'alMadinaOfferCache';

  let currentMenu = [];
  let refreshTimer = null;
  let slideshowTimer = null;
  let slideshowIndex = 0;

  // ─── DOM References ────────────────────────────────────────────────

  const els = {
    storeName: document.getElementById('storeName'),
    mainTitle: document.getElementById('mainTitle'),
    subtitle: document.getElementById('subtitle'),
    menuGrid: document.getElementById('menuGrid'),
    statusIndicator: document.getElementById('statusIndicator'),
    promoBanner: document.getElementById('promoBanner'),
    promoBannerText: document.getElementById('promoBannerText'),
    offerCard: document.getElementById('offerCard'),
    offerProduct: document.getElementById('offerProduct'),
    offerPrice: document.getElementById('offerPrice'),
    offerNote: document.getElementById('offerNote'),
    qrCard: document.getElementById('qrCard'),
    qrImage: document.getElementById('qrImage'),
    weatherWidget: document.getElementById('weatherWidget'),
    weatherTemp: document.getElementById('weatherTemp'),
    weatherDesc: document.getElementById('weatherDesc'),
    footerDate: document.getElementById('footerDate'),
    footerClock: document.getElementById('footerClock'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    slideshowBg: document.getElementById('slideshowBg')
  };

  // ─── Initialization ──────────────────────────────────────────────

  function init() {
    applyBranding();
    setupPromoBanner();
    setupWhatsAppQR();
    setupWeather();
    setupSlideshow();
    setupFullscreen();
    startClock();

    const cached = loadFromStorage(STORAGE_KEY);
    if (cached && cached.length) {
      renderMenu(cached, false);
      setStatus('Cached menu', 'offline');
    } else {
      renderMenu(CONFIG.FALLBACK_MENU, false);
      setStatus('Using default menu', 'offline');
    }

    fetchAndUpdate();
    refreshTimer = setInterval(fetchAndUpdate, CONFIG.REFRESH_INTERVAL_MS);
  }

  function applyBranding() {
    els.storeName.textContent = CONFIG.STORE_NAME;
    els.mainTitle.textContent = CONFIG.MAIN_TITLE;
    els.subtitle.textContent = CONFIG.SUBTITLE;
  }

  // ─── Google Sheets Fetching ──────────────────────────────────────

  function buildSheetUrl(sheetName) {
    const id = CONFIG.GOOGLE_SHEET_ID;
    const sheet = encodeURIComponent(sheetName);
    return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${sheet}`;
  }

  async function fetchSheet(sheetName) {
    const url = buildSheetUrl(sheetName);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Sheet fetch failed: ${response.status}`);
    }

    const text = await response.text();
    return parseGvizResponse(text);
  }

  function parseGvizResponse(text) {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Invalid Google Sheets response');
    }

    const data = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    const rows = data.table?.rows || [];

    return rows
      .map(row => {
        const cells = row.c || [];
        const product = cells[0]?.v;
        const price = cells[1]?.v;
        const note = cells[2]?.v;
        if (!product || !price) return null;
        const productStr = String(product).trim();
        const priceStr = String(price).trim();

        // Skip header / label rows from the sheet
        if (productStr.toLowerCase() === 'product' || priceStr.toLowerCase() === 'price') return null;
        if (productStr.startsWith('A (') || productStr.startsWith('B (')) return null;

        const item = {
          product: productStr,
          price: priceStr
        };
        if (note) item.note = String(note).trim();
        return item;
      })
      .filter(Boolean);
  }

  async function fetchAndUpdate() {
    if (CONFIG.GOOGLE_SHEET_ID === 'YOUR_SHEET_ID_HERE') {
      setStatus('Set your Sheet ID in config.js', 'offline');
      return;
    }

    try {
      const menu = await fetchSheet(CONFIG.SHEET_NAME);

      if (menu.length > 0) {
        const changed = hasMenuChanged(menu, currentMenu);
        renderMenu(menu, changed);
        saveToStorage(STORAGE_KEY, menu);
        currentMenu = menu;
        setStatus('Live — updated ' + formatTime(new Date()), 'live');
      }

      if (CONFIG.OFFERS_ENABLED) {
        await fetchOffer();
      }
    } catch (err) {
      console.warn('Menu fetch error:', err.message);
      const cached = loadFromStorage(STORAGE_KEY);
      if (cached && cached.length) {
        renderMenu(cached, false);
        setStatus('Offline — showing cached menu', 'offline');
      } else {
        renderMenu(CONFIG.FALLBACK_MENU, false);
        setStatus('Offline — using default menu', 'offline');
      }
    }
  }

  async function fetchOffer() {
    try {
      const offers = await fetchSheet(CONFIG.OFFERS_SHEET_NAME);
      if (offers.length > 0) {
        const offer = offers[0];
        displayOffer({
          product: offer.product,
          price: offer.price,
          note: offer.note || "Today's Special"
        });
        saveToStorage(STORAGE_OFFER_KEY, offer);
        return;
      }
    } catch (_) {
      const cached = loadFromStorage(STORAGE_OFFER_KEY);
      if (cached) {
        displayOffer({
          product: cached.product,
          price: cached.price,
          note: cached.note || "Today's Special"
        });
        return;
      }
    }

    displayOffer(CONFIG.OFFER_FALLBACK);
  }

  // ─── Menu Rendering ──────────────────────────────────────────────

  function hasMenuChanged(newMenu, oldMenu) {
    if (newMenu.length !== oldMenu.length) return true;
    return newMenu.some((item, i) =>
      item.product !== oldMenu[i]?.product ||
      item.price !== oldMenu[i]?.price
    );
  }

  function renderMenu(items, animate) {
    const existingCards = els.menuGrid.querySelectorAll('.menu-card');
    const existingMap = new Map();

    existingCards.forEach(card => {
      existingMap.set(card.dataset.product, card);
    });

    els.menuGrid.innerHTML = '';

    items.forEach((item, index) => {
      const oldCard = existingMap.get(item.product);
      const priceChanged = oldCard && oldCard.dataset.price !== item.price;

      const card = document.createElement('div');
      card.className = 'menu-card';
      card.setAttribute('role', 'listitem');
      card.dataset.product = item.product;
      card.dataset.price = item.price;

      if (animate) {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.05}s`;
      }

      if (priceChanged) {
        card.classList.add('price-updated');
      }

      card.innerHTML = `
        <p class="product-name">${escapeHtml(item.product)}</p>
        <p class="product-price">${escapeHtml(item.price)}</p>
      `;

      els.menuGrid.appendChild(card);
    });
  }

  function displayOffer(offer) {
    els.offerCard.classList.remove('hidden');
    els.offerProduct.textContent = offer.product;
    els.offerPrice.textContent = offer.price;
    els.offerNote.textContent = offer.note || '';
  }

  // ─── Promo Banner ────────────────────────────────────────────────

  function setupPromoBanner() {
    if (!CONFIG.PROMO_BANNER_ENABLED || !CONFIG.PROMO_BANNER_TEXT) return;
    els.promoBanner.classList.remove('hidden');
    els.promoBannerText.textContent = CONFIG.PROMO_BANNER_TEXT;
  }

  // ─── WhatsApp QR Code ────────────────────────────────────────────

  function setupWhatsAppQR() {
    if (!CONFIG.WHATSAPP_ENABLED || CONFIG.WHATSAPP_NUMBER === '44XXXXXXXXXX') return;

    const message = encodeURIComponent(CONFIG.WHATSAPP_MESSAGE);
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${message}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000`;

    els.qrImage.src = qrUrl;
    els.qrCard.classList.remove('hidden');
  }

  // ─── Weather Widget ──────────────────────────────────────────────

  function setupWeather() {
    if (!CONFIG.WEATHER_ENABLED) return;
    els.weatherWidget.classList.remove('hidden');
    fetchWeather();
    setInterval(fetchWeather, 600000);
  }

  async function fetchWeather() {
    try {
      const { WEATHER_LAT: lat, WEATHER_LON: lon } = CONFIG;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      const temp = Math.round(data.current.temperature_2m);
      const code = data.current.weather_code;

      els.weatherTemp.textContent = `${temp}°C`;
      els.weatherDesc.textContent = weatherCodeToText(code);
    } catch (_) {
      els.weatherTemp.textContent = '--°';
      els.weatherDesc.textContent = CONFIG.WEATHER_LOCATION;
    }
  }

  function weatherCodeToText(code) {
    const map = {
      0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Foggy', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
      61: 'Rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Snow', 73: 'Snow',
      80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 95: 'Thunderstorm'
    };
    return map[code] || '—';
  }

  // ─── Background Slideshow ────────────────────────────────────────

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

  // ─── Fullscreen ──────────────────────────────────────────────────

  function setupFullscreen() {
    els.fullscreenBtn.addEventListener('click', toggleFullscreen);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  // ─── Clock & Date ────────────────────────────────────────────────

  function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
  }

  function updateClock() {
    const now = new Date();
    els.footerClock.textContent = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    els.footerDate.textContent = now.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // ─── Status Indicator ────────────────────────────────────────────

  function setStatus(text, state) {
    const dot = els.statusIndicator.querySelector('.status-dot');
    const label = els.statusIndicator.querySelector('.status-text');
    dot.className = 'status-dot ' + (state || '');
    label.textContent = text;
  }

  // ─── Local Storage Helpers ───────────────────────────────────────

  function saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (_) { /* quota exceeded — ignore */ }
  }

  function loadFromStorage(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  // ─── Utilities ───────────────────────────────────────────────────

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatTime(date) {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  // ─── Start ───────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
