# Completion

<details open>
<summary><strong>Project Scope (30% Completion)</strong></summary>

---

## 1. HTML Structure & Semantic Elements

The site uses standard HTML elements for layout and content. Key structural components include:

### Header and Navigation (Simulated)
- A top section displaying a **“Welcome Back G!”** title.
![Alt text](assets/md%20images/top%20section.png)
- Login/progress form interface.
![Alt text](assets/md%20images/desktoplogin.png)
![Alt text](assets/md%20images/desktoplogin1.png)
- Navigation bar visible after simulated login.
![Alt text](assets/md%20images/navbar.png)
![Alt text](assets/md%20images/navbarm.png)
### Navigation Bar
- Tabs labeled:
  - Home
  - Inbox
  - Activity
  - Profile

### Main Content Sections
![Alt text](assets/md%20images/cashin.png)
- Wallet balance display and quick actions:
  - Cash In
  - Send
  - Load
  - Transfer
  - Bills
- Service categories:
  - GSave
  - Cards
  - Tap to Pay
  - Commute
- Secondary dashboard information:
  - GCredit
  - Portfolio values

### Footer / Secondary Navigation
- Persistent navigation menu for switching between main views.

---

## 2. CSS Fundamentals

### Types of CSS Used
- **External CSS** — Linked stylesheet |style.css| for layout and components.
- **Internal CSS** — `<style>` blocks for specific adjustments.
- **Inline CSS** — Minimal usage.

### CSS Selectors Implemented
- Element selectors (`div`, `h1`, `img`)
- Class selectors (`.navbar`, `.balance-display`)
- ID selectors (`#login-form`)

---

### Color Value Formats

#### Named Colors
- `white`
- `transparent`

#### Hexadecimal
- `#007CFF` — `--gcash-blue`
- `#F4F7FA` — `--bg-gray`
- `#e6e9ee`
- `#f4f6f9`
- `#ef4444`
- `#111`
- `#fff`

#### RGB / RGBA
- `rgba(0, 124, 255, 0.1)`
- `rgba(0, 124, 255, 0.4)`
- `rgba(0, 0, 0, 0.5)`
- `rgba(255, 255, 255, 0.3)`
- `rgba(239, 68, 68, 0.12)`
- `rgba(0, 0, 0, 0.7)`
- `rgba(255, 255, 255, 0.9)`
- `rgba(255, 0, 0, 0.85)`

---

## 3. Layout and Styling Details

### Background Properties
The interface uses background styling to differentiate UI sections:
- Header / login area
- Navigation bar
- Wallet and feature cards

CSS properties applied:
- `background-color`
- `background-image`
- `background-position`
- `background-size`

---

### Text and Font Properties
- `font-size` for visual hierarchy
- `text-align` for centered elements
- `color` for readability
- `text-decoration` for navigation styling

---

### CSS Box Model Implementation
demonstrates correct usage of:
- Content areas for text and images
- `padding` and `margin` for spacing
- `border` styling for buttons and cards
- `width` and `height` control for UI elements

````
:root {
    --gcash-blue: #007CFF;
    --bg-gray: #F4F7FA;
}
body { font-family: 'Inter', sans-serif; background-color: var(--bg-gray); overscroll-behavior: none; min-width: 360px; }
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

/* Flow Modal Styles */
.flow-modal {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 500;
    background: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
    padding: 1rem;
}
.flow-modal.active { display: flex; }

/* Loading Spinner */
@keyframes spin {
    to { transform: rotate(360deg); }
}
.spinner {
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

/* Slide animations */
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
.slide-in { animation: slideInRight 0.3s ease-out; }
/* Skeleton loader */
.skeleton-overlay { position: absolute; inset: 0; z-index: 400; display:flex; align-items:flex-start; justify-content:center; padding:2rem; }
.skeleton-card { width:100%; max-width:720px; background:transparent; }
.skeleton-box { height:20px; background:linear-gradient(90deg,#e6e9ee 25%, #f4f6f9 50%, #e6e9ee 75%); background-size:200% 100%; animation: shimmer 1s linear infinite; border-radius:8px; margin-bottom:12px; }
.skeleton-hero { height:120px; border-radius:20px; margin-bottom:16px; }
@keyframes shimmer { from { background-position:200% 0 } to { background-position:-200% 0 } }
/* Inbox badge */
[data-nav="inbox"].has-unread::after,
/*.sidebar-link[data-nav="inbox"].has-unread::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 12px;
    width: 10px;
    height: 10px;
    background: #ef4444;
    border-radius: 999px;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
}*/
/* Scanner overlay */
.scanner-overlay { position: fixed; inset: 0; z-index: 700; pointer-events: auto; }
.scanner-overlay .mask { position: absolute; inset: 0; }
.scanner-overlay .mask::before { content: ''; position: absolute; left: 50%; top: 45%; width: 320px; height: 320px; transform: translate(-50%, -50%); box-shadow: 0 0 0 9999px rgba(0,0,0,0.7); border: 2px solid rgba(255,255,255,0.9); border-radius: 12px; }
.scanner-overlay .viewfinder { position: absolute; left: 50%; top: 45%; width: 320px; height: 320px; transform: translate(-50%, -50%); pointer-events: none; display: flex; align-items: center; justify-content: center; }
.scanner-overlay .scan-line { position: absolute; left: calc(50% - 150px); top: calc(45% - 150px); width: 300px; height: 2px; background: rgba(255,0,0,0.85); transform-origin: left; animation: scanMove 2s linear infinite; }
@keyframes scanMove { 0% { transform: translateY(0); } 50% { transform: translateY(300px); } 100% { transform: translateY(0); } }
.scanner-overlay .scanner-controls { position: absolute; bottom: 6rem; left: 50%; transform: translateX(-50%); color: white; text-align: center; }

/* Barcode placeholder */
.barcode-placeholder { width: 220px; height: 80px; background: repeating-linear-gradient(90deg, #111 0 6px, #fff 6px 10px); border-radius: 6px; box-shadow: inset 0 0 0 3px #fff; }
````
---

## 4. Basic HTML Elements Used

- Headings (`<h1>`, `<h2>`, etc.)
- Images (`<img>`)
- Navigation lists
- Buttons
- Divisions (`<div>`) for grouping UI components

---

</details>