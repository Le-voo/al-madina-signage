# Al Madina Food Store — Digital Signage

A professional digital menu board for Smart TVs. Prices are managed entirely through **Google Sheets** — no code changes needed.

![Tech Stack](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## Features

- **3 rotating pages** — Chicken, Lamb, Beef (auto-switch every 15 seconds)
- Automatically loads menu from Google Sheets
- Updates every 30 seconds (configurable)
- Smooth fade animation when pages and prices change
- Full-screen friendly for Smart TVs
- No scrolling — everything fits on one screen
- Product photos support (corner images + per-item images)
- Offline fallback with cached data
- Today's Offer, WhatsApp QR code
- Full-screen toggle button

---

## Quick Start

1. Clone or download this project
2. Create your Google Sheet with 3 tabs (see below)
3. Paste your Sheet ID into `config.js`
4. Upload product photos to `assets/lamb/` and `assets/beef/`
5. Deploy to GitHub Pages, Netlify, or Vercel
6. Open the URL on your Smart TV in full-screen mode

---

## 1. Create Your Google Sheet

Create **3 tabs** in one Google Sheet:

### Tab: `Sheet1` (Chicken)

| Product | Price |
|---------|-------|
| Legs | £3.29/kg |
| Drumsticks | £3.29/kg |
| Wings | £3.49/kg |
| Breast | £5.99/kg |
| Mince | £5.99/kg |
| Baby Chicken | £4.00/kg |
| Medium Chicken | £5.00/kg |
| Boneless Thighs | £5.99/kg |
| Gizzard/Liver/Heart | £2.99/kg |

### Tab: `Lamb`

| Product | Price |
|---------|-------|
| Leg | £11.99/kg |
| Shoulder | £11.49/kg |
| Chops | £12.99/kg |
| Neck | £9.99/kg |
| Back | £10.99/kg |
| Ribs | £8.99/kg |
| Mince | £8.99/kg |
| Mix | £9.99/kg |
| Sheep Leg | £9.99/kg |
| Sheep Shoulder | £9.49/kg |
| Sheep Boneless | £11.99/kg |
| Sheep Mix | £8.99/kg |
| Lamb Boneless | £14.99/kg |

### Tab: `Beef`

| Product | Price |
|---------|-------|
| Neck | £9.49/kg |
| Boneless | £11.99/kg |
| Brisket | £8.99/kg |
| Oxtail | £11.99/kg |
| Stomach/Abodi/Skin | £4.49/kg |
| Cow Foot | £3.99/kg |
| Mince | £9.99/kg |

### Tab: `Offer` (optional — Today's Special)

| Product | Price | Note |
|---------|-------|------|
| Whole Chicken | £4.99/kg | Today's Special |

- Row 1 = headers (`Product`, `Price`)
- Data starts from row 2
- Optional column C = image filename (e.g. `leg.jpg`)

---

## Upload Product Photos

Add photos to these folders, then push to GitHub:

```
assets/
├── lamb/
│   ├── photo1.jpg   ← top-left corner
│   ├── photo2.jpg   ← top-right corner
│   ├── photo3.jpg   ← bottom-left corner
│   └── photo4.jpg   ← bottom-right corner
└── beef/
    ├── photo1.jpg
    ├── photo2.jpg
    ├── photo3.jpg
    └── photo4.jpg
```

After uploading photos, run:

```powershell
git add assets/
git commit -m "Add product photos"
git push
```

To change rotation speed, edit `PAGE_ROTATION_MS` in `config.js` (default: 15000 = 15 seconds per page).

---

## 2. Make the Sheet Public

1. Open your Google Sheet
2. Click **Share** (top right)
3. Click **General access** → change to **Anyone with the link**
4. Set role to **Viewer**
5. Click **Done**

> The sheet must be publicly viewable so the website can read it without a login.

---

## 3. Configure the Application

Open `config.js` and update these values:

```javascript
GOOGLE_SHEET_ID: 'YOUR_SHEET_ID_HERE',  // ← Paste your Sheet ID here
SHEET_NAME: 'Menu',
REFRESH_INTERVAL_MS: 30000,             // 30 seconds
```

### Finding Your Sheet ID

Your Sheet ID is the long string in the URL:

```
https://docs.google.com/spreadsheets/d/1ABC123xyz_SHEET_ID_HERE/edit
                                        ↑________________________↑
                                        This is your Sheet ID
```

### Other Settings in `config.js`

| Setting | Description |
|---------|-------------|
| `STORE_NAME` | Header store name |
| `MAIN_TITLE` | Large title (e.g. CHICKEN) |
| `PROMO_BANNER_TEXT` | Scrolling promotional message |
| `WHATSAPP_NUMBER` | WhatsApp number for QR orders (e.g. `447123456789`) |
| `WEATHER_ENABLED` | Set `true` to show weather widget |
| `BACKGROUND_SLIDESHOW` | Set `true` for rotating backgrounds |

---

## 4. Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Push this project:

```bash
git add .
git commit -m "Add digital signage menu board"
git remote add origin https://github.com/YOUR_USERNAME/al-madina-signage.git
git push -u origin main
```

3. Go to your repo → **Settings** → **Pages**
4. Under **Source**, select **Deploy from a branch**
5. Choose `main` branch and `/ (root)` folder
6. Click **Save**
7. Your site will be live at: `https://YOUR_USERNAME.github.io/al-madina-signage/`

---

## 5. Deploy to Netlify

### Option A: Drag & Drop

1. Go to [netlify.com](https://www.netlify.com) and sign in
2. Drag the project folder onto the Netlify dashboard
3. Your site is live instantly

### Option B: Git Integration

1. Push your project to GitHub (see above)
2. In Netlify, click **Add new site** → **Import an existing project**
3. Connect your GitHub repo
4. Build settings: leave blank (static site, no build step)
5. Click **Deploy**

---

## 6. Deploy to Vercel

1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **Add New Project** → import your repo
4. Framework preset: **Other** (no build command needed)
5. Click **Deploy**

---

## 7. Open on a Smart TV

### Samsung / LG / Android TV

1. Open the **web browser** on your TV
2. Navigate to your deployed URL
3. Press the **full-screen button** on the page (bottom-right), or press **F11** on a connected keyboard
4. Bookmark the URL for easy access

### Amazon Fire TV / Chromecast

Use the **Silk Browser** (Fire TV) or **Chrome** (Chromecast with Google TV) to open your URL.

### Tips for 24/7 Display

- Disable screen saver and sleep mode in TV settings
- Enable **auto-start browser** if your TV supports it
- Use a streaming stick permanently plugged in for reliability
- Keep the TV connected to Wi-Fi

---

## Project Structure

```
al-madina-signage/
├── index.html          Main page
├── style.css           Premium TV-optimized styles
├── script.js           Google Sheets fetch & display logic
├── config.js           All configuration (edit this!)
├── README.md           This file
└── assets/
    ├── logo.png        Store logo
    └── background.jpg  Wooden background texture
```

---

## Customization

### Replace Logo & Background

Replace `assets/logo.png` and `assets/background.jpg` with your own images. Recommended sizes:

- **Logo:** 200×200 px, PNG with transparent background
- **Background:** 1920×1080 px, JPG

### Change Colors

Edit CSS variables at the top of `style.css`:

```css
:root {
  --gold: #c9a227;
  --wood-dark: #1a0f0a;
  /* ... */
}
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Menu shows default prices | Check `GOOGLE_SHEET_ID` in `config.js` |
| "Sheet fetch failed" error | Make sure the sheet is public (Anyone with link → Viewer) |
| Sheet tab not found | Ensure tab is named exactly `Menu` (case-sensitive) |
| QR code not showing | Set a real `WHATSAPP_NUMBER` in `config.js` |
| Prices don't update | Wait for refresh interval, or check sheet is saved |
| Layout scrolls on TV | Reduce number of menu items or use a larger TV |

---

## License

Free to use for Al Madina Food Store and similar businesses.
