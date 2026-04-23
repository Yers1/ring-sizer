# 💍 Ring Sizer

A browser-based ring size finder — no app, no install, works offline.  
Place your ring on the screen and match the circle to find your size.



---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💍 **By Ring** | Place your ring on screen, adjust the slider to match |
| ☝️ **By Finger** | Touch the screen — the app estimates your size |
| 📐 **Calibration** | Calibrate to your exact screen using a credit card |
| 🌍 **Multi-standard** | Shows RU / EU / US sizes simultaneously |
| 📋 **Size Chart** | Interactive table for all sizes (14–23 mm) |
| 📱 **Mobile-first** | Responsive design, optimized for touchscreens |

---

## 🚀 Getting Started

### Run Locally
```bash
git clone https://github.com/YOUR_USERNAME/ring-sizer.git
cd ring-sizer
# No dependencies — just open index.html in your browser
open index.html
```

### Deploy to GitHub Pages
1. Push the repository to GitHub
2. Go to **Settings → Pages → Source**: `main` branch, `/ (root)`
3. Your site will be live in ~30 seconds

---

## 📐 How to Use

### "By Ring" Mode (recommended)
1. *(Optional)* Calibrate your screen using the "Calibrate" button
2. Place your ring flat on the screen
3. Move the slider until the on-screen circle matches the inner hole of your ring
4. Read your size — RU, EU, or US

### "By Finger" Mode (approximate)
1. Switch to the "By Finger" tab
2. Press your **ring finger** against the circle and hold
3. Get an estimated size

> ⚠️ **Why "By Finger" is not accurate:**
> - The screen measures the contact area of your **fingertip**, not the base
> - Rings are worn at the **base** of the finger, which is always wider
> - Different devices report touch contact data differently
> - Pressure and angle both affect the contact area reading
>
> Always use "By Ring" for a precise measurement.

### Screen Calibration
Place a credit card next to the rectangle in the calibration modal and drag the bottom edge until the height matches the card (54 mm). This corrects for your screen's actual pixel density.

---

## 📊 Size Standards

| Standard | Basis | Adult Range |
|----------|-------|-------------|
| **RU (Russia)** | Inner diameter in mm | 14–22 |
| **EU (Europe)** | Inner circumference in mm | ~44–69 |
| **US (USA)** | Proprietary scale | 2–13 |

---

## 🛠 Technical Details

### Pixels to Millimetres
Default: `96 / 25.4 ≈ 3.779 px/mm` (standard CSS pixels at 96 dpi).  
CSS pixels are normalised by `devicePixelRatio`, so physical size is consistent.  
For maximum accuracy, use the calibration feature.

### Finger Detection (touch.radiusX)
```
Estimated diameter ≈ max(touch.radiusX, touch.radiusY) × 2 × 1.55 / pxPerMm
```
Support varies: iOS Safari ✓ / Android Chrome — partial.

### File Structure
```
ring-sizer/
├── index.html   — markup
├── style.css    — styles (CSS variables, responsive)
├── script.js    — logic (calibration, rendering, conversion)
└── README.md    — documentation
```

---


## 📄 License

MIT — free to use, including commercially.

---

*Built with plain HTML/CSS/JS — zero dependencies.*
