# LiveCare Website

> Trusted Care, Till Infinity — A structured home care platform for families in Nigeria.

## 🎨 Brand

| Property | Value |
|----------|-------|
| Primary Blue | `#387afc` |
| Dark Navy | `#0d1157` |
| Accent Orange | `#c0440a` |
| Font | Poppins (Google Fonts) |

---

## 📁 Project Structure

```
src/
├── index.js                    # React entry point
├── index.css                   # Global design tokens + base styles
├── App.js                      # Router with 5 routes
│
├── assets/
│   └── icons/
│       └── Logo.js             # SVG brand logo component
│
├── hooks/
│   └── useInView.js            # Intersection Observer for scroll animations
│
├── components/
│   ├── layout/
│   │   ├── Navbar.js           # Responsive navbar (transparent on hero)
│   │   ├── Navbar.css
│   │   ├── Footer.js           # 5-column footer with social links
│   │   └── Footer.css
│   │
│   ├── sections/               # Homepage sections (reusable)
│   │   ├── Hero.js             # Animated hero with live care card
│   │   ├── WhatIsLiveCare.js   # Mission + 4 pillars
│   │   ├── CareTiers.js        # Tabbed: Basic & Specialized care
│   │   ├── HowItWorks.js       # 4-step process + CTA strip
│   │   ├── WhyChoose.js        # Stats banner + 6 reasons + testimonials
│   │   ├── AppDownload.js      # Phone mockup + App Store / Google Play
│   │   ├── WaitlistForm.js     # Validated waitlist signup form
│   │   └── CaregiverCTA.js     # Caregiver recruitment CTA
│   │
│   └── ui/
│       ├── PageHero.js         # Reusable inner-page hero banner
│       └── ScrollToTop.js      # Scroll-to-top on route change
│
└── pages/
    ├── HomePage.js             # All sections assembled
    ├── AboutPage.js            # Mission, values, timeline, location
    ├── ServicesPage.js         # Interactive tabbed service explorer
    ├── CaregiverPage.js        # Apply form, benefits, FAQ
    └── ContactPage.js          # Contact form, channels, FAQ
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

---

## 📄 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Full landing page with all sections |
| `/about` | About | Mission, values, timeline, contact info |
| `/services` | Services | Interactive tabbed service explorer |
| `/caregivers` | Caregivers | Recruitment page with apply form |
| `/contact` | Contact | Contact form + FAQ |

---

## ✅ Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Scroll-triggered animations (IntersectionObserver)
- ✅ Transparent navbar that becomes solid on scroll
- ✅ Animated hero with floating live care status card
- ✅ Tabbed care service explorer
- ✅ Interactive waitlist & caregiver application forms with validation
- ✅ Phone mockup UI for app section
- ✅ Accordion FAQ sections
- ✅ CSS custom properties for easy theming
- ✅ Poppins font via Google Fonts

---

## 🎨 Customisation

### Change brand colours
Edit CSS variables in `src/index.css`:

```css
:root {
  --blue:  #387afc;   /* Primary blue */
  --navy:  #0d1157;   /* Dark navy */
  --orange: #c0440a;  /* Accent / medical cross */
}
```

### Add real form submission
Replace the `setTimeout` stubs in `WaitlistForm.js`, `CaregiverPage.js`, and `ContactPage.js` with your actual API call:

```js
// Example with fetch
const res = await fetch('https://your-api.com/waitlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});
```

### Replace app store links
Update the `href` values in `AppDownload.js` with your actual App Store and Google Play URLs.

### Update contact details
Search for `hello@livecare.ng` and `+234 000 000 0000` across the codebase and replace with real details.

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `react` `react-dom` | Core React |
| `react-router-dom` | Client-side routing |
| `react-scripts` | CRA build tooling |

No heavy UI libraries — all components are hand-built for full design control.

---

## 🌍 Deployment

Works with any static host:

- **Vercel**: `vercel deploy`
- **Netlify**: drag `build/` folder
- **GitHub Pages**: use `gh-pages` package

---

Built with ❤️ for LiveCare, Ibadan, Nigeria.
