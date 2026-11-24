# PesaDeals Kenya 🇰🇪

A fast, mobile-first platform for discovering verified digital side gigs, remote tasks, and money-making deals in Kenya with **built-in link click tracking**, **admin CMS**, and **Meta Ads compliance architecture**.

---

## 🏗 Architecture & Folder Structure

```
Victor/pesadeals/
├── backend/                  # Node.js + Express + SQLite API (Hosted on this server)
│   ├── server.js             # API server, click logging, Meta crawler detection & admin
│   ├── db.js                 # SQLite schema (deals, clicks, indexes)
│   ├── seed.js               # Initial verified Kenyan side-gig deals
│   ├── .env                  # Port (5060) & Admin secret key
│   └── package.json
├── frontend/                 # React 18 + Vite + Tailwind CSS (Deployable to Cloudflare Pages)
│   ├── src/
│   │   ├── components/       # Mobile-first cards, Deal modal, Admin control, Compliance modals
│   │   ├── api.js            # Click beacon tracking & dynamic API client
│   │   ├── App.jsx           # Clean deals feed & category filtering
│   │   └── main.jsx
│   ├── public/
│   │   └── _redirects        # Cloudflare Pages SPA client-side routing
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🎯 Meta Ads Strategy & Policy Compliance

### The Challenge with Meta Ads:
Meta strictly regulates ads related to:
1. **Employment & Work from Home** (Policy on Unacceptable Business Practices): Any page making deceptive or guaranteed income claims ("Earn Ksh 50,000 every day guaranteed from home") will cause immediate ad account bans.
2. **Gambling & Betting Bonuses**: Prohibited without prior written permission from Meta.
3. **Dating & Social Apps**: Requires prior written approval from Meta.

### How PesaDeals Solves It Compliantly:
1. **Meta Safe Filtering (`is_meta_safe`)**:
   - Each deal in the backend has an `is_meta_safe` flag.
   - When Meta crawlers (`facebookexternalhit`, `Facebot`) or visitors arriving from Facebook/Instagram ads (`fbclid` or `utm_source=meta`) visit, **restricted or gated categories are automatically filtered out**.
   - Only 100% verified, educational, and compliant microtasks, AI annotation, transcription, and official partner programs (Outlier, Premise, Jumia, ySense) are visible.
2. **Mandatory Meta Legal Compliance**:
   - Direct access in the footer to **Earnings Disclaimer** ("Results vary based on individual effort; no income is guaranteed"), **Privacy Policy**, and **Terms of Service**.
3. **Third-Party Transparency**:
   - Every deal clearly states that registration is free and payments are governed by the respective platform.

---

## 📊 Click Tracking Architecture

Whenever a visitor clicks any deal on the mobile site or uses a direct redirect link (`/r/:slug`), the backend captures:

- **Deal ID & Title**
- **Visitor ID** (persistent UUID across sessions)
- **Device Type** (Mobile, Tablet, Desktop)
- **Browser & OS** (e.g. Chrome Mobile, Android 14)
- **IP Address & Timestamp**
- **UTM Source, Campaign, Medium, Content, Term**
- **Referrer** (Facebook, Instagram, WhatsApp, TikTok, Direct)

### Real-Time Admin Analytics
Victor can access the admin dashboard directly:
1. Visit the platform and click the **Lock icon** in the navbar (or visit with `?admin=1`).
2. Enter the Admin Secret Key: `victor_deals_2026!`
3. View:
   - **Total Clicks, Unique Visitors, Today's Clicks**
   - **Deal Conversion Leaderboard**
   - **Traffic Attribution** (Meta Ads vs Organic vs WhatsApp)
   - **Device Breakdown**
   - **Live Real-Time Click Log**

---

## 🚀 Deployment Instructions

### 1. Backend (Already running on this server via PM2)
```bash
cd /home/opc/Victor/pesadeals/backend
npm install
node seed.js
pm2 start server.js --name "pesadeals-backend"
pm2 save
```
- Port: `5060`
- Nginx reverse-proxy sample:
```nginx
server {
    listen 80;
    server_name api.yourdomain.co.ke;

    location / {
        proxy_pass http://127.0.0.1:5060;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Frontend (Cloudflare Pages)
1. Push this repository to GitHub (`kem6oi/pesadeals`).
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select `kem6oi/pesadeals`:
   - **Framework preset**: Vite
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Environment variable**: `VITE_API_BASE_URL` = `https://api.yourdomain.co.ke` (or your server backend IP/domain)
4. Click **Save and Deploy**. Cloudflare automatically serves the static bundle globally with ultra-low latency.
