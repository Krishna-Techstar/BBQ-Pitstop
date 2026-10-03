# 🔥 BBQ Pit Stop — Street-Food Smoker Web App

> **"Come hungry, leave happy!"**  
> Custom Smoker Sidecar Motorcycle (**MH.03.PT.741**) • Live at **Interdepartmental Cup 2.0**, Bharati Vidyapeeth Deemed to be University, Sector 3, Belpada, Kharghar, Navi Mumbai.  
> Instagram: [@barbequepitstop](https://instagram.com/barbequepitstop) • Hotline: **+91 8291794227**

---

## 🌟 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons
- **Routing & Visuals**: React Router v7, Recharts (analytics & Cup leaderboard), Framer Motion, Canvas Confetti
- **QR & Payments**: Dynamic UPI QR codes (`qrcode.react`) with instant mobile intent links for GPay / PhonePe / Paytm
- **Sound Alerts**: Web Audio API tone synthesis for live kitchen chimes (no missing MP3 files)
- **Real-time Sync**: Built-in multi-tab `BroadcastChannel` & reactive `localStorage` store with zero setup required, plus optional Firebase Firestore / Auth integration ready via `.env`.

---

## 🍗 Seeded Menu Card (INR)

| Category | Item Name | Options / Portions | Price (₹) |
|---|---|---|---|
| **Chicken** | Half Tandoori Chicken Breast | 1 Breast | ₹180 |
| | Full Tandoori Chicken Breast | 2 Breasts | ₹340 |
| | Half BBQ Chicken Breast | 1 Breast | ₹160 |
| | Full BBQ Chicken Breast | 2 Breasts | ₹300 |
| | Grilled Chicken Sausages | 2 pc / 3 pc | ₹100 / ₹150 |
| **Wings (6 pcs)** | Tandoori Wings | 6 pcs | ₹180 |
| | Sweet Chilli Wings | 6 pcs | ₹160 |
| | Peri Peri Wings | 6 pcs | ₹150 |
| | BBQ Wings | 6 pcs | ₹150 |
| **Drumsticks (2 pcs)** | Tandoori Drumsticks | 2 pcs | ₹200 |
| | Sweet Chilli Drumsticks | 2 pcs | ₹180 |
| | Peri Peri Drumsticks | 2 pcs | ₹160 |
| | BBQ Drumsticks | 2 pcs | ₹160 |
| **Full Leg (Tangdi Kebab)** | Tandoori Leg | 1 Full Leg | ₹260 |
| | Sweet Chilli Leg | 1 Full Leg | ₹240 |
| | Peri Peri Leg | 1 Full Leg | ₹220 |
| | BBQ Leg | 1 Full Leg | ₹220 |
| **Wraps** | BBQ Wrap | Regular / Cheese | ₹130 / ₹160 |
| | Peri Peri Wrap | Regular / Cheese | ₹150 / ₹180 |
| | Tandoori Wrap | Regular / Cheese | ₹170 / ₹200 |
| | Sausage Wrap | Regular / Cheese | ₹150 / ₹180 |
| **Hotdogs** | Cheese Hotdog | Smoked Frank | ₹130 |
| | Peri Peri Hotdog | Smoked Frank | ₹120 |
| | Cheese Peri Peri Hotdog | Smoked Frank | ₹150 |
| **Extras** | Extra Cheese | Molten Melt | ₹40 |
| | Smoky Sauce Dip | Pitmaster Concoction | ₹20 |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 Features

### Customer Experience (No Login Required)
1. **Dark Hero Landing**: Fire-red accents, custom smoker sidecar specs (MH.03.PT.741), live event badge with pulsing indicator.
2. **Interactive Menu**: Category tabs, live search, flavour filter chips (Tandoori, Peri Peri, BBQ, Sweet Chilli).
3. **Customisation Modal**: Choose portions (e.g. 2 pc vs 3 pc sausages), flavour marinade, add-ons (Extra Cheese +₹40, Sauce Dip +₹20), notes, and dynamic price total.
4. **Cart Drawer & Sticky Bar**: Mobile bottom bar, upsells, coupon discount engine (`CUP50`, `STUDENT10`).
5. **Fast Checkout**: Name, phone, college department (for Cup 2.0 leaderboard), pickup counter point, and payment method (Cash or dynamic UPI QR).
6. **Live Order Tracker (`/track/:id`)**: Realtime 4-step progress: *Received → Smoking on Grill → Ready for Pickup → Collected*.
7. **Post-Pickup Feedback**: Star rating, review tags, and 1-click reorder.

### Admin Dashboard (`/admin`)
- **Default Passcode**: `bbq2026` (or click **"1-Tap Quick Demo Access"**)
- **Live Kanban Board**: Real-time multi-tab order pipeline with Web Audio chime, delay timer alerts, 1-tap status advance, and printable kitchen receipts.
- **"Simulate Order" Button**: Injects random incoming student orders into the live board for instant demoing.
- **Analytics & Leaderboard (Recharts)**:
  - Interdepartmental Cup 2.0 Leaderboard (Department ranking by volume and spend)
  - Revenue & order volume over time (hourly/daily)
  - Top-selling dishes
  - Flavour popularity distribution
  - Add-on attach rate (Cheese & Sauce dips)
  - Payment method split (UPI vs Cash)
- **Menu Manager**: Full CRUD, live prices, and instant *Sold Out / In Stock* toggles.
- **Customer Directory**: CRM showing students, orders, lifetime spend, and direct WhatsApp promo links.
- **Offers & Coupons**: Create discount codes with min-order thresholds.
- **Operations & Settings**: Stall Open/Closed master switch, CSV export, and WhatsApp End-of-Day report generator.

---

## 🌐 Deployment Instructions

### Deploy to Vercel
1. Install Vercel CLI or connect your Git repository to [Vercel](https://vercel.com).
2. Set Framework to **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting` (Choose `dist` as public directory, configure as single-page app `Yes`).
4. Build and deploy:
```bash
npm run build
firebase deploy --only hosting
```

---
*BBQ Pit Stop • Bharati Vidyapeeth, Navi Mumbai • +91 8291794227*
