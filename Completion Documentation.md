# Completion

<details close>
<summary><strong>Project Scope (30% Completion - Finished February 12, 2026)</strong></summary>
# Frontend Completion Report — 30%

> **Project:** GCash Demo Web App  
> **Files:** `index.html` · `style.css`  
> **Status:** 🔴 30% Complete — Structural foundation laid, most features not yet implemented

---

## Table of Contents

1. [Project Structure Overview](#project-structure-overview)
2. [HTML Structure & Semantic Elements](#html-structure--semantic-elements)
3. [CSS Fundamentals Implemented](#css-fundamentals-implemented)
4. [Layout and Styling Details](#layout-and-styling-details)
5. [Color System](#color-system)
6. [Basic HTML Elements Used](#basic-html-elements-used)
7. [What Is Done vs. Not Done](#what-is-done-vs-not-done)
8. [Completion Summary Table](#completion-summary-table)

---

## Project Structure Overview

At this stage, the project has its foundational files in place. The HTML document defines the page skeleton and references external assets, while `style.css` establishes the design system. No JavaScript logic is active yet — the interface is static and non-interactive beyond what the browser provides by default.

```
index.html          — Page structure, sections, and static content
style.css           — Custom styles, CSS variables, and component rules
assets/img/         — GCash logo SVGs and screenshot references
script.js           — Not yet connected / not yet implemented
```

---

## HTML Structure & Semantic Elements

### Authentication Screen

The page opens with a simulated login interface. This is the first thing visible to the user before any session exists.

- A welcome heading — **"Welcome Back G!"** — is displayed at the top of the auth screen
- A phone number input field styled with a `+63` country code prefix
- A login progress form structure is in place with a Next button

![Login Screen](assets/md%20images/desktoplogin.png)
![Login Screen MPIN](assets/md%20images/desktoplogin1.png)

### Navigation Bar

After the simulated login step, a navigation bar becomes visible. It contains the primary tab links for the app.

**Desktop sidebar navigation:**

![Desktop Navbar](assets/md%20images/navbar.png)

**Mobile bottom navigation:**

![Mobile Navbar](assets/md%20images/navbarm.png)

Tabs present in the navigation:
- Home
- Inbox
- Activity
- Profile

### Main Content Sections

The home view contains a wallet balance area and a set of quick-action service buttons.

![Wallet / Cash In area](assets/md%20images/cashin.png)

**Wallet card quick actions (HTML buttons present):**
- Cash In
- Send
- Load
- Transfer
- Bills

**Service category buttons (HTML buttons present):**
- GSave
- Cards
- Tap to Pay
- Commute

**Secondary dashboard panels (HTML shells present):**
- GCredit limit and available balance display
- Portfolio value display

### Top Section

A persistent header sits above the main content area. It contains the page title and a greeting.

![Top Section](assets/md%20images/top%20section.png)

### Footer / Secondary Navigation

A persistent bottom navigation bar exists at mobile widths for switching between the four main views: Home, Inbox, Activity, and Profile.

---

## CSS Fundamentals Implemented

### Types of CSS Used

Three types of CSS are applied across the project at this stage:

**External CSS** — The primary `style.css` file is linked in the `<head>` and handles all custom component and layout rules outside of Tailwind.

**Internal CSS** — Minor `<style>` blocks are used within the HTML for specific page-level adjustments where utility classes are insufficient.

**Inline CSS** — Used sparingly for cases where a single property override is needed directly on an element.

### CSS Selectors Implemented

The stylesheet uses a mix of selector types:

- Element selectors targeting base HTML tags — `div`, `h1`, `img`
- Class selectors for reusable components — `.navbar`, `.balance-display`
- ID selectors for unique page elements — `#login-form`

---

## Layout and Styling Details

### Background Properties

Background styling is applied to visually separate different UI sections. The following CSS properties are in use:

- `background-color` — solid fills for cards, nav, and body
- `background-image` — gradient overlays on the wallet header and banner areas
- `background-position` — used for gradient and pattern alignment
- `background-size` — controls coverage of background gradients

### Text and Font Properties

Typography is set through a combination of Tailwind utility classes and the following CSS properties in `style.css`:

- `font-size` — establishes visual hierarchy between headings, labels, and body text
- `text-align` — centers content in cards, modals, and the auth screen
- `color` — applied for brand color, muted text, and state colors
- `text-decoration` — used on navigation link elements

### CSS Box Model Implementation

The box model is applied consistently across cards, buttons, and layout containers:

- **Content areas** — defined widths and heights for text blocks and images
- `padding` — inner spacing for card panels, button labels, and input fields
- `margin` — outer spacing between sections and grouped elements
- `border` — used for card outlines, input field focus rings, and separator lines
- `width` and `height` — constrain button sizes, avatar images, and icon containers

```css
:root {
    --gcash-blue: #007CFF;
    --bg-gray: #F4F7FA;
}

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-gray);
    overscroll-behavior: none;
    min-width: 360px;
}

.gcash-bg { background-color: var(--gcash-blue); }
.gcash-text { color: var(--gcash-blue); }

main { min-width: 360px; max-width: 100vw; }

.view-section { display: none; }
.view-section.active { display: block; }

.nav-item.active { color: var(--gcash-blue); }
.nav-item.active svg { stroke: var(--gcash-blue); fill: rgba(0, 124, 255, 0.1); }

.sidebar-link.active {
    background-color: rgba(0, 124, 255, 0.1);
    color: var(--gcash-blue);
    border-right: 4px solid var(--gcash-blue);
}

.fluid-balance {
    font-size: clamp(2.5rem, 10vw, 3.75rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1;
    display: flex;
    align-items: center;
}
.fluid-balance .peso { margin-right: 0.15rem; }

.qr-fab {
    transform: translateY(-25px);
    box-shadow: 0 10px 25px -5px rgba(0, 124, 255, 0.4);
}

.no-scrollbar::-webkit-scrollbar { display: none; }

@media (max-width: 1023px) {
    main { padding-bottom: 80px; }
}
```

---

## Color System

The color system is established through CSS custom properties and direct values across `style.css`. All color formats in use at this stage are documented below.

### CSS Custom Properties

```css
--gcash-blue: #007CFF
--bg-gray:    #F4F7FA
```

### Named Colors

- `white`
- `transparent`

### Hexadecimal

| Value | Usage |
|---|---|
| `#007CFF` | Primary brand blue (`--gcash-blue`) |
| `#F4F7FA` | Page background gray (`--bg-gray`) |
| `#e6e9ee` | Skeleton loader base color |
| `#f4f6f9` | Skeleton loader shimmer highlight |
| `#ef4444` | Inbox unread badge red |
| `#111` | Barcode placeholder dark bars |
| `#fff` | White fills and overlays |

### RGB / RGBA

| Value | Usage |
|---|---|
| `rgba(0, 124, 255, 0.1)` | Active nav item SVG fill tint |
| `rgba(0, 124, 255, 0.4)` | QR FAB button drop shadow |
| `rgba(0, 0, 0, 0.5)` | Flow modal backdrop |
| `rgba(255, 255, 255, 0.3)` | Spinner track ring |
| `rgba(239, 68, 68, 0.12)` | Inbox badge glow ring |
| `rgba(0, 0, 0, 0.7)` | Loading overlay background |
| `rgba(255, 255, 255, 0.9)` | Scanner viewfinder border |
| `rgba(255, 0, 0, 0.85)` | Scanner red scan line |

---

## Basic HTML Elements Used

The following standard HTML elements are present in `index.html` at this stage:

- **Headings** — `<h1>` through `<h4>` for page title, section headers, card titles, and labels
- **Images** — `<img>` for the GCash logo, avatar placeholder, and asset references
- **Navigation lists** — `<nav>` with `<button>` elements for tab switching
- **Buttons** — `<button>` throughout for service actions, form submission, and navigation
- **Divisions** — `<div>` as the primary grouping container for all UI component layouts
- **Inputs** — `<input>` for phone number entry and MPIN field
- **Sections** — `<section>` as the semantic wrapper for each named view panel
- **Aside** — `<aside>` for the desktop sidebar navigation

---

## What Is Done vs. Not Done

### Done at 30%

- Page `<head>` setup — charset, viewport, title, Tailwind CDN, Google Fonts, `style.css` link
- CSS custom properties (`--gcash-blue`, `--bg-gray`)
- Base `body` styles — font family, background color, overscroll behavior, min-width
- `.view-section` show/hide system via `display: none / block`
- Active state styles for `.nav-item` and `.sidebar-link`
- `.fluid-balance` responsive font scaling with `clamp()`
- `.qr-fab` elevated floating button style
- `.no-scrollbar` scrollbar suppression
- Mobile bottom padding media query (`padding-bottom: 80px`)
- `.flow-modal` overlay shell and `.flow-modal.active` display rule
- `@keyframes spin` and `.spinner` loading animation
- `@keyframes slideInRight` and `.slide-in` entry animation
- Skeleton loader CSS (`.skeleton-box`, `.skeleton-hero`, `@keyframes shimmer`)
- Scanner overlay CSS (`.scanner-overlay`, `.scan-line`, `@keyframes scanMove`)
- Barcode placeholder CSS (`.barcode-placeholder`)
- Auth overlay HTML structure — login card and MPIN card shells
- Desktop sidebar HTML with nav button stubs
- Mobile bottom nav HTML with 5 tab buttons
- Top header HTML with title, Help button, and avatar
- Wallet card section with 4 sub-tab buttons (Wallet, Save, Borrow, Invest)
- Services grid buttons (8 items) — HTML and icons present
- Static balance display placeholder text
- Profile section HTML with avatar, name, phone, and action buttons

### Not Done at 30%

- No JavaScript — nothing is interactive, flows do not open, tabs do not switch
- No dynamic balance rendering — balance values are hardcoded placeholder text
- No transaction list — `#activity-list` container is empty
- No inbox messages — `#view-inbox` shows only the static empty state
- No form validation — phone input and MPIN entry have no feedback logic
- Inbox unread badge CSS is commented out — badge is invisible even when class is present
- Skeleton loader has no HTML targets to animate
- No service hub screens — all Explore buttons lead nowhere
- No modal content — `#flow-modal` container is an empty shell
- No profile data binding — name, phone, and avatar are placeholder defaults
- No responsive fine-tuning beyond the single mobile media query

---

## Completion Summary Table

| Area | Completion | Notes |
|---|---|---|
| HTML document structure | 70% | All shells exist, content areas are empty |
| Auth screen HTML | 60% | Structure done, no validation or logic |
| Navigation HTML | 80% | All tabs and links present |
| Home section HTML | 50% | Buttons exist, no flows wired |
| Inbox section HTML | 30% | Empty state only |
| Activity section HTML | 20% | Container only, no list content |
| Profile section HTML | 60% | Static layout done, no data binding |
| CSS custom properties | 100% | Color variables fully defined |
| CSS layout rules | 70% | Core rules in place |
| CSS animations | 80% | Defined, some have no HTML targets yet |
| CSS responsive design | 40% | Single breakpoint, no fine-tuning |
| Interactivity / JS | 0% | Not yet connected |
| **Overall** | **~30%** | Foundation set, no working features yet |

---

*Frontend built with Tailwind CSS (CDN), custom `style.css`, and standard HTML5. JavaScript not yet integrated at this stage.*

</details>





<details close>
<summary><strong>60% completion - Finished february 22, 2026</strong></summary>
# Frontend Completion Report — 60%

> **Project:** GCash Demo Web App  
> **Files:** `index.html` · `style.css`  
> **Status:** 🟡 60% Complete — Core UI done, secondary features pending

---

## Table of Contents

1. [Project Structure Overview](#project-structure-overview)
2. [What Is Done (Completed Features)](#what-is-done-completed-features)
3. [What Is Partially Done](#what-is-partially-done)
4. [What Is Not Yet Done (Pending Features)](#what-is-not-yet-done-pending-features)
5. [Page-by-Page Breakdown](#page-by-page-breakdown)
6. [CSS & Styling Status](#css--styling-status)
7. [Responsive Design Status](#responsive-design-status)
8. [Completion Summary Table](#completion-summary-table)

---

## Project Structure Overview

The app is a single-page application (SPA) with all views living inside `index.html`. Navigation between views is done purely through CSS class toggling — no routing library is used. Styling is split between Tailwind CSS utility classes (loaded via CDN) and a custom `style.css` for app-specific rules.

```
index.html          — All views, all structural HTML (421 lines)
style.css           — Custom rules, animations, component overrides
assets/img/         — GCash logo SVGs (referenced but not included here)
script.js           — All interactivity (handled separately)
```

The layout follows a two-column pattern on desktop (sidebar + main content) that collapses to a single-column layout with a bottom navigation bar on mobile.

---

## What Is Done (Completed Features)

### Authentication Screen

- Login card with phone number input field (`+63` prefix, 11-digit validation UI)
- 4-digit MPIN entry card with dot indicators and a numeric keypad
- Keypad generated dynamically via inline `<script>` with digits 1–9, 0, and backspace
- Transition between login card and MPIN card using `.hidden` toggling
- Full-screen overlay layer with white background (`z-[100]`)

### App Shell & Layout

- Fixed desktop sidebar (`w-72`) with GCash logo, nav links, and sticky positioning
- Mobile bottom navigation bar with 5 tabs: Home, Inbox, QR, Activity, Profile
- Floating QR button centered in the mobile nav with a lifted FAB effect (`.qr-fab`)
- Persistent top header with page title, Help button, and avatar icon
- Scrollable main content area with hidden scrollbar (`.no-scrollbar`)
- Max-width constraint (`max-w-2xl`) to center content on wide screens

### Home Section — Wallet Tab

- Wallet card with 4 sub-tabs: Wallet, Save, Borrow, Invest
- Active tab underline indicator and font-weight toggle via Tailwind classes
- GCash blue header panel with available balance display in large fluid typography
- Balance visibility toggle button (eye icon with open/closed SVG paths)
- Cash In button in the wallet header
- Services grid (8 buttons): Send, Load, Transfer, Bills, GSave, Cards, Tap to Pay, Commute
  - Send, Load, Transfer, Bills, GSave are wired to functional flows
  - Cards, Tap to Pay, Commute display a toast placeholder

### Home Section — Save Tab

- GSave balance display with Deposit and Withdraw action buttons
- Two informational tiles: Auto Save and Learn More

### Home Section — Borrow Tab

- GCredit header panel with Credit Limit and Available balance display (dynamic via JS)
- GCredit Used tile and Pay Bills tile with dual payment option buttons (Wallet / GCredit)

### Home Section — Invest Tab

- Portfolio value display (`#portfolio-value`) with fluid balance typography
- Invest action button
- Static SVG market trend chart (polyline graph, simulated data)
- "As of" date label

### Explore Section

- Horizontal scrollable row of 5 service icons: GInsure, A+ Rewards, Food Hub, Travel, GForest
- All wired to `showToast()` placeholder function

### Promotional Banner

- Full-width gradient banner card ("Spin to Win" promo)
- Aspect ratio 16:9, italic bold headline, localized copy
- "Extended until Feb 28!" pill badge in top-right corner
- "Spin Now" CTA button

### Inbox Section

- Static empty-state UI: icon, heading, subtext (serves as the placeholder before JS renders messages)
- JS dynamically replaces this content when messages exist

### Activity Section

- Search input with icon for filtering transactions
- Horizontal scrollable filter pills: All, Cash In, Sent, Received, Bills
- Empty `#activity-list` container — populated entirely by `script.js`

### Profile Section

- Gradient header with dynamic avatar (`<img id="profile-avatar">`)
- Name and phone number display (`#profile-name`, `#profile-phone`)
- Verified and Gold Member badge pills
- Account Details button → triggers `openAccountDetails()` modal
- Security & Privacy button → triggers `openChangePin()` modal
- Edit profile pencil button in top-right of header → triggers `openEditProfile()` modal
- Logout button with red styling

### Overlays & Modals (HTML Shells)

- `#loading-overlay` — spinner with "Processing..." text, hidden by default
- `#flow-modal` — empty container shell for all transaction flows, toggled by JS

---

## What Is Partially Done

### Inbox Badge

The CSS rule for the unread notification dot exists in `style.css` but is **commented out**:

```css
/* [data-nav="inbox"].has-unread::after { ... } */
```

The `has-unread` class is still added and removed by JavaScript, but the visual red dot does not appear because the `::after` pseudo-element rule is disabled. The badge logic is fully wired — only the CSS is suppressed.

### QR Scanner

The `showScanner()` function is called by the QR button in the mobile nav. The CSS for the scanner overlay is fully written in `style.css`:

- Dark mask with cut-out viewfinder window (`.scanner-overlay .mask::before`)
- Animated red scan line (`.scan-line`, `@keyframes scanMove`)
- Scanner controls area at the bottom

However, the scanner HTML is generated dynamically by `script.js` — there is no static scanner view in `index.html`. The overlay CSS is ready; the JS rendering implementation defines whether it is complete.

### Service Buttons (Cards, Tap to Pay, Commute)

These three buttons in the services grid exist in the HTML with proper icons and labels, but they only call `showToast()` with a text message. They have no dedicated flow or screen behind them — they are UI placeholders.

---

## What Is Not Yet Done (Pending Features)

### Missing Screens / Views

The following features are referenced in the app but have no dedicated `<section>` or view built in `index.html`:

| Feature | Status | Notes |
|---|---|---|
| QR Code Pay screen | ❌ Not built | Only the scanner CSS overlay exists |
| GInsure screen | ❌ Not built | Calls `openServiceHub()` — JS stub only |
| A+ Rewards screen | ❌ Not built | Calls `openServiceHub()` — JS stub only |
| Food Hub screen | ❌ Not built | Calls `openServiceHub()` — JS stub only |
| Travel screen | ❌ Not built | Calls `openServiceHub()` — JS stub only |
| GForest screen | ❌ Not built | Calls `openServiceHub()` — JS stub only |
| Cards management screen | ❌ Not built | Toast placeholder only |
| Tap to Pay screen | ❌ Not built | Toast placeholder only |
| Commute screen | ❌ Not built | Toast placeholder only |

### Incomplete Styling

- Inbox unread badge dot (`.has-unread::after`) is written but commented out in `style.css`
- Skeleton loader CSS (`.skeleton-overlay`, `.skeleton-box`, `.skeleton-hero`, `@keyframes shimmer`) is defined but the skeleton HTML elements are not present in `index.html` — the shimmer animation has no target to render on
- No dark mode support — CSS variables and Tailwind config do not include a dark theme
- No error state styling — invalid input states rely on a single JS-added `border-red-500` class with no permanent CSS definition for form error feedback

### Non-functional Interactions

- **Help button** in the header calls `showToast('Help & Support')` — no Help screen or modal
- **Auto Save tile** in the Save tab has no interactivity
- **Learn More tile** in the Save tab has no interactivity
- **View All link** in the Explore section calls `showToast('View All Features')` — no full features screen
- **Spin to Win banner** calls `showToast('Spin to Win Promo')` — no promo flow or screen
- **Learn More button** in the Borrow tab calls `showToast(...)` — no informational screen

---

## Page-by-Page Breakdown

### Home (`#view-home`)

```
[██████████░░░] ~75% complete

✅ Wallet tab — fully functional
✅ Save tab — UI complete, flows wired
✅ Borrow tab — UI complete, GCredit display wired
✅ Invest tab — UI complete, chart rendered, flow wired
✅ Explore section — UI complete, icons rendered
✅ Banner — UI complete
❌ Explore items have no destination screens
❌ Service shortcuts (Cards, Tap to Pay, Commute) have no screens
```

### Inbox (`#view-inbox`)

```
[████████░░░░░] ~60% complete

✅ Static empty state rendered in HTML
✅ Dynamic rendering by JS when messages exist
✅ Unread badge class toggling works
❌ Unread badge CSS dot is commented out — badge is invisible
❌ No push notification or real-time support
```

### Activity (`#view-activity`)

```
[████████░░░░░] ~60% complete

✅ Search input with filter pills rendered
✅ Filter buttons styled and wired
✅ Transaction list container exists
❌ No static fallback content — entirely JS-dependent
❌ No pagination or load-more UI
```

### Profile (`#view-profile`)

```
[████████████░] ~90% complete

✅ Avatar, name, phone, badges displayed
✅ Edit profile button and modal wired
✅ Account details button and modal wired
✅ Change MPIN button and modal wired
✅ Logout button wired
❌ No settings section (notifications, language, theme)
❌ No transaction limit or KYC status display
```

### Authentication (`#auth-overlay`)

```
[████████████░] ~90% complete

✅ Phone input with country code
✅ MPIN keypad fully rendered
✅ Dot indicator display
✅ Validation feedback (red border flash on bad input)
❌ No biometric / Face ID UI
❌ No "Forgot MPIN" flow
```

---

## CSS & Styling Status

### Completed in `style.css`

| Rule / Feature | Status |
|---|---|
| CSS custom properties (`--gcash-blue`, `--bg-gray`) | ✅ Done |
| `.view-section` show/hide system | ✅ Done |
| `.nav-item.active` and `.sidebar-link.active` styles | ✅ Done |
| `.fluid-balance` responsive font scaling (`clamp`) | ✅ Done |
| `.qr-fab` elevated floating button style | ✅ Done |
| `.no-scrollbar` cross-browser scrollbar hide | ✅ Done |
| `.flow-modal` and `.flow-modal.active` overlay | ✅ Done |
| `@keyframes spin` loading spinner | ✅ Done |
| `.slide-in` entry animation (`slideInRight`) | ✅ Done |
| `.skeleton-box`, `.skeleton-hero`, `@keyframes shimmer` | ⚠️ Defined, no HTML targets |
| `.has-unread::after` inbox badge dot | ⚠️ Written but commented out |
| `.scanner-overlay` + scan line animation | ⚠️ CSS ready, HTML generated by JS |
| `.barcode-placeholder` | ✅ Done (used in QR flow) |
| Dark mode | ❌ Not implemented |

---

## Responsive Design Status

| Breakpoint | Layout Behavior | Status |
|---|---|---|
| Mobile (`< 1024px`) | Single column, bottom nav, no sidebar | ✅ Working |
| Desktop (`≥ 1024px`) | Sidebar visible, bottom nav hidden | ✅ Working |
| Content max-width | `max-w-2xl` center constraint on main area | ✅ Working |
| Fluid balance font | `clamp(2.5rem, 10vw, 3.75rem)` | ✅ Working |
| Bottom padding for mobile nav | `main { padding-bottom: 80px }` | ✅ Working |
| Tablet (`768px–1023px`) | Falls into mobile layout | ✅ Acceptable |
| Landscape mobile | No specific adjustments | ⚠️ Not tested/addressed |
| Viewport lock | `maximum-scale=1.0, user-scalable=no` | ✅ Set |

---

## Completion Summary Table

| Section | Completion | Blocker |
|---|---|---|
| Auth overlay | 90% | Missing forgot MPIN, biometrics |
| Home — Wallet tab | 95% | Cards/Tap to Pay/Commute have no screens |
| Home — Save tab | 85% | Auto Save and Learn More unclickable |
| Home — Borrow tab | 80% | No loan application flow |
| Home — Invest tab | 80% | Chart is static/dummy data |
| Home — Explore section | 50% | All service hubs stub only |
| Home — Banner | 70% | No promo flow behind it |
| Inbox | 60% | Badge dot commented out |
| Activity | 60% | Fully JS-dependent, no static fallback |
| Profile | 90% | Missing settings, no KYC display |
| CSS/Styling | 75% | Skeleton and badge CSS not active |
| Responsive layout | 85% | Landscape/tablet not fine-tuned |
| **Overall** | **~60%** | Service hub screens are the largest gap |

---

## Next Steps to Reach 100%

1. **Uncomment the inbox badge CSS** — one line change to make `has-unread` visually active
2. **Build the 5 service hub screens** — GInsure, A+ Rewards, Food Hub, Travel, GForest each need a `<section>` view or modal
3. **Build Cards, Tap to Pay, Commute screens** — or replace toast stubs with real flows
4. **Activate skeleton loader HTML** — add skeleton markup so the shimmer CSS has a target during load
5. **Add a Help screen or modal** — the Help button in the header should go somewhere
6. **Wire the Explore "View All" link** — either a new section or expand the grid
7. **Add Forgot MPIN flow** — a link below the keypad with a reset screen
8. **Polish landscape and tablet layouts** — test and tweak between `768px` and `1023px`

---

*Frontend built with Tailwind CSS (CDN), custom `style.css`, vanilla HTML, and zero component frameworks.*
</details>

<details close>
<summary><strong>100% completion - Finished Febrruary 27,2026</strong></summary>
# DOM Manipulation — Implementation Documentation

> **Project:** GCash Demo Web App  
> **File:** `script.js`  
> **Total Lines:** ~1,818  
> **Status:** ✅ 100% Complete

---

## Table of Contents

1. [Overview](#overview)
2. [State Management & Persistence](#state-management--persistence)
3. [Initialization & DOMContentLoaded](#initialization--domcontentloaded)
4. [Balance Rendering & Visibility Toggle](#balance-rendering--visibility-toggle)
5. [Navigation & Tab Switching](#navigation--tab-switching)
6. [Modal System (Dynamic Creation & Removal)](#modal-system-dynamic-creation--removal)
7. [Flow System (Multi-Step Forms)](#flow-system-multi-step-forms)
8. [Transaction Rendering](#transaction-rendering)
9. [Inbox System](#inbox-system)
10. [Toast Notifications](#toast-notifications)
11. [Loading Overlay](#loading-overlay)
12. [Profile Management](#profile-management)
13. [Authentication Overlay](#authentication-overlay)
14. [Input Formatting & Validation](#input-formatting--validation)
15. [DOM Patterns Summary](#dom-patterns-summary)

---

## Overview

The application is a single-page GCash-inspired wallet demo. All UI changes, including navigation, modals, transaction history, inbox messages, and balance updates, are handled entirely through JavaScript DOM manipulation without any front-end framework. The HTML shell provides named containers (`id`-based), and `script.js` populates, replaces, and removes content dynamically at runtime.

---

## State Management & Persistence

**How it works:**

All application data lives in a single `state` object. This object is loaded from `localStorage` on startup and written back after every mutation.

```js
function loadState() {
    const saved = localStorage.getItem('gcash_state');
    if (saved) {
        try { return JSON.parse(saved); }
        catch (e) { return { ...DEFAULT_STATE }; }
    }
    return { ...DEFAULT_STATE };
}

function saveState() {
    localStorage.setItem('gcash_state', JSON.stringify(state));
}
```

**DOM impact:** Every render function reads from `state` directly. There is no virtual DOM or diffing — the relevant container's `innerHTML` is fully replaced whenever state changes. This keeps DOM output always in sync with state.

---

## Initialization & DOMContentLoaded

**Implementation:**

```js
window.addEventListener('DOMContentLoaded', () => {
    const authed = localStorage.getItem('gcash_authed') === 'true';
    if (authed) {
        document.getElementById('auth-overlay').style.display = 'none';
        initializeApp();
        switchTab('home');
        switchWalletTab('wallet');
    } else {
        document.getElementById('auth-overlay').style.display = 'flex';
        document.getElementById('login-card').classList.remove('hidden');
        document.getElementById('mpin-card').classList.add('hidden');
    }
});
```

**`initializeApp()` calls on startup:**

```js
function initializeApp() {
    switchTab('home');
    switchWalletTab('wallet');
    renderBalance();
    updateProfile();
    renderTransactions();
    renderSaveBalance();
    renderBorrowDashboard();
    renderInvestBalance();
    renderInbox();
}
```

All DOM rendering is centralized here. On load, every panel is populated from state before the user interacts with anything.

---

## Balance Rendering & Visibility Toggle

**How it works:**

The balance display is controlled by a `balanceVisible` boolean flag. The function `renderBalance()` reads the flag and either shows the formatted amount or a masked placeholder.

```js
function renderBalance() {
    const balanceEl = document.getElementById('wallet-balance');
    balanceEl.textContent = balanceVisible
        ? formatCurrency(state.balance)
        : '••••••';
}
```

**Toggling:**

```js
function toggleBalanceVisibility() {
    balanceVisible = !balanceVisible;
    const eyeIcon = document.getElementById('balance-eye-icon');
    eyeIcon.innerHTML = balanceVisible
        ? '<path d="...eye open SVG..."/>'
        : '<path d="...eye closed SVG..."/>';
    renderBalance();
}
```

Clicking the eye icon swaps the SVG path data inline and re-renders the balance text — no separate image assets or CSS classes needed.

---

## Navigation & Tab Switching

**`switchTab(tabId)` — Main navigation**

```js
function switchTab(tabId) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`view-${tabId}`).classList.add('active');

    document.querySelectorAll('[data-nav]').forEach(el => {
        const target = el.getAttribute('data-nav');
        if (target === tabId) {
            el.classList.add('active');
            el.classList.remove('text-slate-400', 'text-slate-500');
        } else {
            el.classList.remove('active');
            el.classList.add('text-slate-400');
        }
    });

    document.getElementById('page-title').innerHTML = tabId === 'home'
        ? `Hello, <span id="header-username">${state.userProfile.name.split(' ')[0]}</span>!`
        : headers[tabId];

    history.pushState(null, '', `/${tabId}`);
}
```

**What it manipulates:**
- Removes `active` class from all `.view-section` panels, then adds it to the target panel.
- Iterates all `[data-nav]` elements (both bottom nav and sidebar links) to highlight the active tab.
- Updates the page title `innerHTML` dynamically, injecting a `<span>` tag for the username when on Home.
- Pushes a URL change without a page reload via the History API.

**`switchWalletTab(tabId)` — Wallet sub-navigation**

```js
function switchWalletTab(tabId) {
    document.querySelectorAll('.wallet-tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(`${tabId}-content`).classList.remove('hidden');

    document.querySelectorAll('.wallet-tab-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-wallet-tab') === tabId;
        btn.classList.toggle('text-blue-600', isActive);
        btn.classList.toggle('font-black', isActive);
        btn.classList.toggle('border-b-4', isActive);
        btn.classList.toggle('border-blue-600', isActive);
        btn.classList.toggle('text-slate-400', !isActive);
    });
}
```

Controls which of the three wallet panels (Wallet, GSave, Invest) is shown using `hidden` class toggling.

---

## Modal System (Dynamic Creation & Removal)

Modals are not pre-existing HTML elements — they are created, appended, and removed from `document.body` on demand.

**Pattern:**

```js
const modal = document.createElement('div');
modal.className = 'fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4';
modal.innerHTML = `...content...`;
document.body.appendChild(modal);
```

**Closing pattern:**

Modals are dismissed by calling `.remove()` on the element itself:

```js
// Via close button inside the modal
onclick="this.closest('.fixed').remove()"

// Via backdrop click
modal.onclick = (e) => { if (e.target === modal) modal.remove(); }

// Via explicit ID reference
const modal = document.getElementById('edit-profile-modal');
if (modal) modal.remove();
```

**Modals implemented this way:**
- Transaction Details (`viewTransactionDetails`)
- Edit Profile (`openEditProfile`)
- Account Details (`openAccountDetails`)
- Change MPIN (`openChangePin`)
- Inbox Message Viewer (`openInboxMessage`)

Each modal is independently created per invocation and destroyed on close, keeping the DOM clean at all times.

---

## Flow System (Multi-Step Forms)

Transaction flows (Send Money, Buy Load, Pay Bills, Bank Transfer, Cash In, Invest, GSave) use a single persistent `#flow-modal` element whose `innerHTML` is replaced at each step.

**Opening a flow:**

```js
function openFlow(flowType) {
    currentFlowData = { type: flowType, step: 1 };
    // delegates to the correct render function
    document.getElementById('flow-modal').classList.add('active');
}
```

**Step-based rendering (example: Send Money):**

```js
function renderSendFlow() {
    const modal = document.getElementById('flow-modal');

    if (currentFlowData.step === 1) {
        modal.innerHTML = `...phone and amount inputs...`;
    } else if (currentFlowData.step === 2) {
        modal.innerHTML = `...confirmation screen...`;
    } else if (currentFlowData.step === 3) {
        modal.innerHTML = `...success receipt...`;
    }
}
```

Advancing steps mutates `currentFlowData.step` and re-calls the render function, replacing the modal's entire `innerHTML`. Going back follows the same pattern in reverse.

**Closing:**

```js
function closeFlow() {
    document.getElementById('flow-modal').classList.remove('active');
    document.getElementById('flow-modal').innerHTML = '';
    currentFlowData = {};
}
```

The modal is emptied and deactivated — not removed — since it is a permanent shell in the HTML.

**Flows implemented:**
| Flow | Steps | Key DOM Actions |
|---|---|---|
| Send Money | 3 | Phone input → Confirm → Receipt |
| Buy Load | 3 | Provider + amount → Confirm → Receipt |
| Pay Bills | 5 | Category → Biller → Details → Confirm → Receipt |
| Bank Transfer | 3 | Account details → Confirm → Receipt |
| Cash In | 2 | Amount → Receipt |
| Invest (Buy/Sell) | 3 | Action select + amount → Confirm → Receipt |
| GSave (Deposit/Withdraw) | 1 | Amount → immediate confirm |

---

## Transaction Rendering

**`renderTransactions()`** reads `state.transactions`, applies the active filter, groups entries by date, and builds an HTML string that is set as the `innerHTML` of `#transaction-list`.

```js
function renderTransactions() {
    const listContainer = document.getElementById('transaction-list');
    // ... filter and group logic ...
    let html = '';
    Object.keys(grouped).forEach(dateKey => {
        html += `<div class="p-4 border-b bg-slate-50"><h4 ...>${dateKey}</h4></div>`;
        grouped[dateKey].forEach(t => {
            html += renderTransactionItem(t);
        });
    });
    listContainer.innerHTML = html;
}
```

**`renderTransactionItem(t)`** returns an HTML string for a single transaction row, including a dynamically chosen icon (SVG), color-coded amount prefix (`+` or `-`), and an `onclick` that passes the transaction object (JSON stringified) to `viewTransactionDetails()`.

**`renderBorrowDashboard()`** targets three specific elements by ID and sets their `textContent` to formatted credit values:

```js
document.getElementById('gcredit-limit').textContent = formatCurrency(state.gcredit.limit);
document.getElementById('gcredit-available').textContent = formatCurrency(available);
document.getElementById('gcredit-used').textContent = `₱${formatCurrency(state.gcredit.used)}`;
```

---

## Inbox System

The inbox panel (`#view-inbox`) is fully re-rendered by `renderInbox()` on every change. If the inbox is empty, a placeholder card is shown. Otherwise, it builds a list of message cards.

**Unread badge on nav icon:**

```js
function updateInboxBadge() {
    const hasUnread = state.inbox.some(m => m.unread);
    document.querySelectorAll('[data-nav="inbox"]').forEach(el => {
        if (hasUnread) el.classList.add('has-unread');
        else el.classList.remove('has-unread');
    });
}
```

`has-unread` is a CSS class that displays a red dot indicator on the inbox nav icon. This is called after every inbox mutation (add, mark read, remove).

**Adding a message (`addInboxMessage`)** pushes to the top of `state.inbox` with `unshift`, saves state, then calls `renderInbox()` and `updateInboxBadge()` — the DOM update chain is always the same.

---

## Toast Notifications

`showToast(message)` creates a floating notification element, appends it to `document.body`, then removes it after a short delay with a fade-out animation applied inline.

```js
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-24 left-1/2 -translate-x-1/2 bg-blue-950 text-white ...';
    toast.innerHTML = `<svg>...</svg><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
```

The toast lives in the DOM for ~2.3 seconds total, then self-removes. No CSS animation classes are needed — the transition is applied directly to `style` properties.

---

## Loading Overlay

A pre-existing `#loading-overlay` element is shown/hidden using class toggling:

```js
function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
    document.getElementById('loading-overlay').classList.add('flex');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
    document.getElementById('loading-overlay').classList.remove('flex');
}
```

This overlay is displayed during simulated async operations (e.g., `setTimeout` calls in `confirmSend`, `confirmLoad`, `confirmBillPayment`) to mimic a network request.

---

## Profile Management

**`updateProfile()`** reads `state.userProfile` and pushes values into multiple DOM targets:

```js
function updateProfile() {
    document.getElementById('header-username').textContent = state.userProfile.name.split(' ')[0];
    document.getElementById('profile-name').textContent   = state.userProfile.name;
    document.getElementById('profile-phone').textContent  = state.userProfile.phone;

    const initials = state.userProfile.name.split(' ').map(n => n[0]).join('');
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&...`;
    document.getElementById('header-avatar').src = avatarUrl;
    document.getElementById('profile-avatar').src = avatarUrl;
}
```

Avatars are generated dynamically via the `ui-avatars.com` API using the user's initials. The `src` attribute of both `<img>` elements is set directly.

**`saveProfile()`** reads values from modal inputs by ID, validates phone format, updates `state.userProfile`, calls `saveState()`, calls `updateProfile()` to reflect changes immediately, then removes the edit modal.

---

## Authentication Overlay

On load, authentication state is checked via `localStorage`. The auth overlay is shown or hidden by directly setting `style.display`:

```js
document.getElementById('auth-overlay').style.display = 'none'; // authenticated
document.getElementById('auth-overlay').style.display = 'flex'; // not authenticated
```

Inside the auth flow, the login card and MPIN card are toggled with `.hidden` class:

```js
// Show MPIN entry
document.getElementById('login-card').classList.add('hidden');
document.getElementById('mpin-card').classList.remove('hidden');

// Reset back to login
document.getElementById('login-card').classList.remove('hidden');
document.getElementById('mpin-card').classList.add('hidden');
```

The MPIN dot indicators are updated via `updateDots()`, which reads the `pin` string length and fills or empties circular dot elements accordingly.

---

## Input Formatting & Validation

**`formatAmountInput(input)`** formats a currency text field in real time:

```js
function formatAmountInput(input) {
    let raw = input.value.replace(/[^\d.]/g, '');
    // handle decimals, strip leading zeros, add commas
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    input.value = decPart.length ? `${intPart}.${decPart}` : intPart;
}
```

Directly mutates `input.value` on every keystroke via the `oninput` event, providing live comma-separated formatting.

**Form validation** (e.g., `validateSendForm`, `validateLoadForm`, `validateInvestForm`) reads input values, evaluates rules, and enables or disables submit buttons by setting `btn.disabled`:

```js
const btn = document.getElementById('send-next-btn');
btn.disabled = !isValid;
```

---

## DOM Patterns Summary

| Pattern | Where Used |
|---|---|
| `innerHTML` full replacement | All render functions (inbox, transactions, flows) |
| `classList.add/remove` | Tab switching, badge states, active states, visibility |
| `classList.toggle` | Wallet tab active styles |
| `textContent` assignment | Balance, profile name, phone, credit amounts |
| `document.createElement` + `appendChild` | Modals (transaction detail, edit profile, toast) |
| `.remove()` on element | All dynamic modal dismissal |
| `style.display` assignment | Auth overlay show/hide |
| `src` attribute assignment | Avatar image updates |
| `disabled` property | Form submit button enable/disable |
| `querySelectorAll` + `forEach` | Batch class operations on nav links, buttons |
| `document.getElementById` | Single targeted element reads and writes |
| `history.pushState` | URL update on tab switch |
| Inline `onclick` in `innerHTML` | Flow step navigation, modal close buttons |

---

*All DOM manipulation is vanilla JavaScript — no jQuery, React, or other libraries are used. The app relies entirely on browser-native DOM APIs.*
</details>
