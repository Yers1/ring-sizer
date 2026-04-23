# 💍 Ring Sizer

A browser-based ring size finder — no app, no install, works offline.  
Place your ring on the screen and match the circle to find your size.

**[→ Live Demo on GitHub Pages](https://YOUR_USERNAME.github.io/ring-sizer/)**

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

## 💡 Similar Ideas — Useful Browser-Based Tools

Here are 12 ideas for web apps that use device hardware to provide real value, with no native app required:

---

### 📏 1. Screen Ruler
**What:** A virtual ruler across the full screen  
**How:** Screen calibration → mm/cm/inch markings  
**Value:** Measure objects without a physical ruler  
**Tech:** `screen.width`, `devicePixelRatio`, Canvas API

---

### 👟 2. Shoe Size Finder
**What:** User stands on a tablet or places a shoe insole on screen  
**How:** Touch outline + calibration → foot length in mm → size table  
**Value:** Buy shoes online with confidence  
**Tech:** `touchstart`, Canvas, EU/US/UK size tables

---

### 🌡️ 3. Level & Protractor
**What:** Digital spirit level and angle measurer  
**How:** `DeviceOrientationEvent` (accelerometer) → tilt angle  
**Value:** Hang shelves, align furniture  
**Tech:** `DeviceOrientationEvent`, Canvas

---

### 🔊 4. Sound Level Meter
**What:** Measure ambient noise in dB  
**How:** Web Audio API → microphone → amplitude analysis → dB  
**Value:** Check noise at work, home, or events  
**Tech:** `getUserMedia`, `AudioContext`, `AnalyserNode`

---

### 💓 5. Heart Rate Monitor (approximate)
**What:** Place finger over rear camera + flash  
**How:** Camera detects brightness changes from blood pulsing (PPG)  
**Value:** Quick pulse check without a pulse oximeter  
**Tech:** `getUserMedia` (rear camera + torch), Canvas pixel analysis  
> ⚠️ Not a medical device!

---

### 🎨 6. Colour Picker
**What:** Point camera at any surface — get its HEX/RGB colour  
**How:** Camera → Canvas → `getImageData` → centre pixel analysis  
**Value:** Designers, paint matching, outfit coordination  
**Tech:** `getUserMedia`, Canvas, `getImageData`

---

### 💡 7. Light Meter (Lux Meter)
**What:** Measure room brightness  
**How:** `AmbientLightSensor` API or camera brightness analysis  
**Value:** Check if lighting meets workplace standards  
**Tech:** `AmbientLightSensor`, `getUserMedia`

---

### 🎵 8. Metronome & BPM Tapper
**What:** Precise metronome + detect tempo by tapping  
**How:** Web Audio API for accurate ticks; tap timing → average → BPM  
**Value:** Musicians at rehearsal without an app  
**Tech:** `AudioContext`, `OscillatorNode`, `touchstart`

---

### 👁️ 9. Vision Test (simplified)
**What:** Snellen chart with calibrated letter sizes  
**How:** Letter size in arc-minutes at a set viewing distance  
**Value:** Preliminary vision check  
**Tech:** CSS sizing + screen calibration  
> ⚠️ Not a substitute for an optometrist!

---

### ⚡ 10. Reaction Time Tester
**What:** Press as fast as possible after a signal  
**How:** Random delay → visual/audio stimulus → `Date.now()` delta  
**Value:** Gaming training, sports prep, fun self-knowledge  
**Tech:** `Date.now()`, `setTimeout`, Web Audio API

---

### 🧲 11. Compass & Magnetometer
**What:** Digital compass + magnetic field strength  
**How:** `DeviceOrientationEvent.webkitCompassHeading` (iOS) / `AbsoluteOrientationSensor`  
**Value:** Navigation, detecting electromagnetic interference  
**Tech:** `DeviceOrientationEvent`, `AbsoluteOrientationSensor`

---

### 📶 12. Internet Speed Analyser
**What:** Download/upload speed + latency test  
**How:** Fetch a test file → measure time → `navigator.connection`  
**Value:** Compare network quality in different rooms or locations  
**Tech:** `fetch`, `navigator.connection`, `performance.now()`

---

## 📄 License

MIT — free to use, including commercially.

---

*Built with plain HTML/CSS/JS — zero dependencies.*
