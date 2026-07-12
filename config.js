/**
 * Digital Signage Configuration
 * Edit this file to connect your Google Sheet and customize the display.
 * No code changes needed elsewhere — just update prices in Google Sheets.
 */

const CONFIG = {
  // ─── Google Sheets ───────────────────────────────────────────────
  GOOGLE_SHEET_ID: '1glfjqrOq777-GP4dMoJJe3VhRBveg9Xt4J3U1ipE-Bg',
  OFFERS_SHEET_NAME: 'Offer',

  // How often to check Google Sheets for price updates (milliseconds)
  REFRESH_INTERVAL_MS: 30000,

  // Set to true to automatically cycle pages, false to stay on the selected page (manually route)
  AUTO_ROTATE: false,

  // How long each menu page shows before switching (milliseconds)
  PAGE_ROTATION_MS: 15000,

  // ─── Store Branding ──────────────────────────────────────────────
  STORE_NAME: 'AL MADINA FOOD STORE',
  OPEN_HOURS: '8AM - 10PM',
  SUBTITLE: 'Fresh • Quality • Halal',

  // ─── Menu Pages (auto-rotate on TV) ──────────────────────────────
  // Each page loads from its own Google Sheet tab.
  // Optional column C in sheet = image filename (e.g. "leg.jpg")
  PAGES: [
    {
      id: 'chicken',
      title: 'CHICKEN',
      sheetName: 'Sheet1',
      subtitle: 'List PRICE!',
      silhouette: 'chicken',
      imageFolder: 'assets/chicken',
      cornerImages: [],
      fallback: [
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
    },
    {
      id: 'lamb',
      title: 'LAMB',
      sheetName: 'Lamb ',
      subtitle: 'List PRICE!',
      silhouette: 'lamb',
      imageFolder: 'assets/lamb',
      cornerImages: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg'],
      fallback: [
        { product: 'Leg', price: '£11.99/kg' },
        { product: 'Shoulder', price: '£11.49/kg' },
        { product: 'Chops', price: '£12.99/kg' },
        { product: 'Neck', price: '£9.99/kg' },
        { product: 'Back', price: '£10.99/kg' },
        { product: 'Ribs', price: '£8.99/kg' },
        { product: 'Mince', price: '£8.99/kg' },
        { product: 'Mix', price: '£9.99/kg' },
        { product: 'Sheep Leg', price: '£9.99/kg' },
        { product: 'Sheep Shoulder', price: '£9.49/kg' },
        { product: 'Sheep Boneless', price: '£11.99/kg' },
        { product: 'Sheep Mix', price: '£8.99/kg' },
        { product: 'Lamb Boneless', price: '£14.99/kg' }
      ]
    },
    {
      id: 'beef',
      title: 'BEEF',
      sheetName: 'Beef ',
      subtitle: 'List PRICE!',
      silhouette: 'beef',
      imageFolder: 'assets/beef',
      cornerImages: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg'],
      fallback: [
        { product: 'Neck', price: '£9.49/kg' },
        { product: 'Boneless', price: '£11.99/kg' },
        { product: 'Brisket', price: '£8.99/kg' },
        { product: 'Oxtail', price: '£11.99/kg' },
        { product: 'Stomach/Abodi/Skin', price: '£4.49/kg' },
        { product: 'Cow Foot', price: '£3.99/kg' },
        { product: 'Mince', price: '£9.99/kg' }
      ]
    }
  ],

  // ─── Promotional Banner ──────────────────────────────────────────
  PROMO_BANNER_ENABLED: false,
  PROMO_BANNER_TEXT: '★ Fresh Halal Meat — Quality You Can Taste ★',

  // ─── Today's Offer Section ───────────────────────────────────────
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
  BACKGROUND_IMAGES: ['assets/background.jpg'],
  SLIDESHOW_INTERVAL_MS: 15000
};
