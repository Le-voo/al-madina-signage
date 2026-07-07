/**
 * Digital Signage Configuration
 * Edit this file to connect your Google Sheet and customize the display.
 * No code changes needed elsewhere — just update prices in Google Sheets.
 */

const CONFIG = {
  // ─── Google Sheets ───────────────────────────────────────────────
  GOOGLE_SHEET_ID: '1glfjqrOq777-GP4dMoJJe3VhRBveg9Xt4J3U1ipE-Bg',
  SHEET_NAME: 'Sheet1',
  OFFERS_SHEET_NAME: 'Offer',

  // How often to check for updated prices (milliseconds)
  REFRESH_INTERVAL_MS: 30000,

  // ─── Store Branding ──────────────────────────────────────────────
  STORE_NAME: 'AL MADINA FOOD STORE',
  MAIN_TITLE: 'CHICKEN',
  SUBTITLE: 'Fresh • Quality • Halal',

  // ─── Promotional Banner ──────────────────────────────────────────
  PROMO_BANNER_ENABLED: true,
  PROMO_BANNER_TEXT: '★ Fresh Halal Chicken — Quality You Can Taste ★',

  // ─── Today's Offer Section ───────────────────────────────────────
  // Loads from the "Offers" sheet tab (columns: Product, Price, Note)
  // Falls back to OFFER_FALLBACK if the sheet tab is empty or missing
  OFFERS_ENABLED: true,
  OFFER_FALLBACK: {
    product: 'Whole Chicken',
    price: '£4.99/kg',
    note: "Today's Special"
  },

  // ─── WhatsApp QR Code ────────────────────────────────────────────
  WHATSAPP_ENABLED: true,
  WHATSAPP_NUMBER: '44XXXXXXXXXX',
  WHATSAPP_MESSAGE: 'Hello, I would like to place an order from Al Madina Food Store',

  // ─── Weather Widget (optional) ─────────────────────────────────
  WEATHER_ENABLED: false,
  WEATHER_LAT: 51.5074,
  WEATHER_LON: -0.1278,
  WEATHER_LOCATION: 'London',

  // ─── Background Slideshow (optional) ─────────────────────────────
  BACKGROUND_SLIDESHOW: false,
  BACKGROUND_IMAGES: [
    'assets/background.jpg'
  ],
  SLIDESHOW_INTERVAL_MS: 15000,

  // ─── Offline Fallback Menu ───────────────────────────────────────
  // Used when Google Sheets is unreachable (also cached after first load)
  FALLBACK_MENU: [
    { product: 'Legs', price: '£3.29/kg' },
    { product: 'Drumsticks', price: '£3.29/kg' },
    { product: 'Wings', price: '£3.49/kg' },
    { product: 'Breast', price: '£5.99/kg' },
    { product: 'Mince', price: '£5.99/kg' },
    { product: 'Baby Chicken', price: '£4.00/kg' },
    { product: 'Medium Chicken', price: '£5.00/kg' },
    { product: 'Boneless Thighs', price: '£5.99/kg' },
    { product: 'Gizzard/Liver/Heart', price: '£2.99/kg' }
  ]
};
