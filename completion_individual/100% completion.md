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