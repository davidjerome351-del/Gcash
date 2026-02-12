// ==================== STATE MANAGEMENT ====================
const DEFAULT_STATE = {
    balance: 12564.00,
    saveBalance: 0.00,
    investBalance: 0.00,
    inbox: [
        {
            id: 'welcome-1',
            title: 'Welcome to GCash Demo',
            body: 'You will receive transaction receipts here.',
            timestamp: new Date().toISOString(),
            unread: true
        }
    ],
    userProfile: {
        name: "Young' Stunna G. SixSeven",
        phone: "+63 969 169 4200"
    },
    transactions: [
        {
            id: 'init-1',
            type: 'cash-in',
            title: 'Cash In',
            description: 'Initial Balance',
            amount: 12564.00,
            timestamp: new Date('2024-02-05T10:00:00').toISOString(),
            status: 'success',
            reference: 'INIT2024020510000'
        }
    ]
};

let state = loadState();
// ensure inbox exists and backward-compat fields
if (!Array.isArray(state.inbox)) state.inbox = [];
if (!state.gcredit) state.gcredit = { limit: 300000, used: 0 };
if (!('saveBalance' in state)) state.saveBalance = 0.00;
if (!('investBalance' in state)) state.investBalance = 0.00;
let balanceVisible = true;
let currentActivityFilter = 'all';
let currentFlowData = {};

function loadState() {
    const saved = localStorage.getItem('gcash_state');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error loading state:', e);
            return { ...DEFAULT_STATE };
        }
    }
    return { ...DEFAULT_STATE };
}

function saveState() {
    try {
        localStorage.setItem('gcash_state', JSON.stringify(state));
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

function renderBalance() {
    const balanceEl = document.getElementById('wallet-balance');
    if (balanceVisible) {
        balanceEl.textContent = formatCurrency(state.balance);
    } else {
        balanceEl.textContent = '••••••';
    }
}

// ==================== INBOX / NOTIFICATIONS ====================
function addInboxMessage(msg) {
    const message = {
        id: generateReference(),
        title: msg.title || 'Notification',
        body: msg.body || '',
        timestamp: new Date().toISOString(),
        unread: msg.unread !== false,
        txRef: msg.txRef || null
    };
    state.inbox.unshift(message);
    saveState();
    renderInbox();
    updateInboxBadge();
}

function renderInbox() {
    const container = document.getElementById('view-inbox');
    if (!container) return;
    if (!state.inbox || state.inbox.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-[2rem] p-12 text-center border">
                <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📩</div>
                <h3 class="text-2xl font-black text-blue-950">Inbox Empty</h3>
                <p class="text-slate-500 font-medium">No messages yet.</p>
            </div>
        `;
        updateInboxBadge();
        return;
    }

    let html = `<div class="space-y-4">`;
    html += `<div class="flex justify-between items-center"><h4 class="font-black text-blue-950 text-lg">Inbox</h4><button onclick="markAllRead()" class="text-xs font-black text-slate-500">Mark all read</button></div>`;
    state.inbox.forEach(msg => {
        html += `
            <div class="bg-white rounded-[1rem] p-4 border flex items-start justify-between">
                <div class="min-w-0">
                    <button onclick='openInboxMessage(${JSON.stringify(msg).replace(/'/g, "\\'")})' class="text-left w-full">
                        <h5 class="font-black text-blue-950 text-sm">${msg.title}${msg.unread ? ' <span class="inline-block ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">New</span>' : ''}</h5>
                        <p class="text-xs text-slate-500 truncate max-w-[28rem]">${msg.body}</p>
                        <p class="text-[10px] text-slate-400 font-bold mt-1">${new Date(msg.timestamp).toLocaleString()}</p>
                    </button>
                </div>
                <div>
                    ${msg.unread ? `<button onclick="event.stopPropagation(); markRead('${msg.id}')" class="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-black">Mark</button>` : `<button onclick="event.stopPropagation(); removeMessage('${msg.id}')" class="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-black">Remove</button>`}
                </div>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
    updateInboxBadge();
}

function openInboxMessage(msg) {
    // mark read and show modal
    markRead(msg.id);
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
            <div class="p-6">
                <h3 class="text-xl font-black mb-2">${msg.title}</h3>
                <p class="text-sm text-slate-600 mb-4">${msg.body}</p>
                <p class="text-xs text-slate-400">${new Date(msg.timestamp).toLocaleString()}</p>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="w-full bg-blue-600 text-white py-4 font-black active:scale-95 transition-transform">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function markRead(id) {
    const msg = state.inbox.find(m => m.id === id);
    if (msg) { msg.unread = false; saveState(); renderInbox(); updateInboxBadge(); }
}

function markAllRead() {
    state.inbox.forEach(m => m.unread = false);
    saveState(); renderInbox(); updateInboxBadge();
}

function removeMessage(id) {
    state.inbox = state.inbox.filter(m => m.id !== id);
    saveState(); renderInbox(); updateInboxBadge();
}

function updateInboxBadge() {
    const hasUnread = state.inbox && state.inbox.some(m => m.unread);
    document.querySelectorAll('[data-nav="inbox"]').forEach(el => {
        if (hasUnread) el.classList.add('has-unread'); else el.classList.remove('has-unread');
    });
}

function renderSaveBalance() {
    const el = document.querySelector('#save-content .fluid-balance span:last-child');
    if (el) el.textContent = formatCurrency(state.saveBalance);
}

function renderInvestBalance() {
    const el = document.getElementById('portfolio-value');
    if (el) el.textContent = formatCurrency(state.investBalance || 0);
}

function toggleBalanceVisibility() {
    balanceVisible = !balanceVisible;
    const eyeIcon = document.getElementById('balance-eye-icon');
    if (balanceVisible) {
        eyeIcon.innerHTML = '<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>';
    } else {
        eyeIcon.innerHTML = '<path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>';
    }
    renderBalance();
}

function updateProfile() {
    const headerUsername = document.getElementById('header-username');
    const profileName = document.getElementById('profile-name');
    const profilePhone = document.getElementById('profile-phone');
    const headerAvatar = document.getElementById('header-avatar');
    const profileAvatar = document.getElementById('profile-avatar');
    if (headerUsername) headerUsername.textContent = (state.userProfile.name || 'User').split(' ')[0];
    if (profileName) profileName.textContent = state.userProfile.name || 'User';
    if (profilePhone) profilePhone.textContent = state.userProfile.phone || '';

    const initials = (state.userProfile.name || 'User').split(' ').map(n => n[0]).join('');
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=007CFF&color=fff&size=128`;
    if (headerAvatar) headerAvatar.src = avatarUrl;
    if (profileAvatar) profileAvatar.src = avatarUrl;
}

// ==================== UTILITY FUNCTIONS ====================
function formatCurrency(amount) {
    return amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPhoneNumber(phone) {
    // Format: 09XX XXX XXXX
    if (typeof phone !== 'string') phone = String(phone || '');
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
        return `${digits.slice(0,4)} ${digits.slice(4,7)} ${digits.slice(7)}`;
    }
    return phone;
}

function generateReference() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `TXN${dateStr}${random}`;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-24 left-1/2 -translate-x-1/2 bg-blue-950 text-white px-6 py-4 rounded-2xl shadow-2xl z-[200] font-bold text-sm flex items-center gap-3';
    toast.innerHTML = `
        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
    document.getElementById('loading-overlay').classList.add('flex');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
    document.getElementById('loading-overlay').classList.remove('flex');
}

// ==================== NAVIGATION ====================
let pin = "";
let lastLoginDigits = '';
const loginPhoneInput = document.getElementById('login-phone');

function switchTab(tabId) {
    // Validate tabId
    if (!['home', 'inbox', 'activity', 'profile'].includes(tabId)) {
        tabId = 'home';
    }

    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`view-${tabId}`).classList.add('active');

    document.querySelectorAll('[data-nav]').forEach(el => {
        const target = el.getAttribute('data-nav');
        if (target === tabId) {
            el.classList.add('active');
            el.classList.remove('text-slate-400', 'text-slate-500');
        } else {
            el.classList.remove('active');
            if (el.classList.contains('sidebar-link')) el.classList.add('text-slate-500');
            else el.classList.add('text-slate-400');
        }
    });

    const headers = {
        home: `Hello, ${state.userProfile.name.split(' ')[0]}!`,
        inbox: 'Inbox',
        activity: 'Activity',
        profile: 'Profile'
    };
    document.getElementById('page-title').innerHTML = tabId === 'home'
        ? `Hello, <span id="header-username">${state.userProfile.name.split(' ')[0]}</span>!`
        : headers[tabId];

    if (tabId === 'activity') {
        renderTransactions();
    }

    // Update URL without reloading
    history.pushState(null, '', `/${tabId}`);
}

function switchWalletTab(tabId) {
    document.querySelectorAll('.wallet-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    const contentEl = document.getElementById(`${tabId}-content`);
    if (contentEl) contentEl.classList.remove('hidden');
    
    document.querySelectorAll('.wallet-tab-btn').forEach(btn => {
        const btnTab = btn.getAttribute('data-wallet-tab');
        if (btnTab === tabId) {
            btn.classList.remove('text-slate-400', 'font-bold');
            btn.classList.add('text-blue-600', 'font-black', 'border-b-4', 'border-blue-600');
        } else {
            btn.classList.remove('text-blue-600', 'font-black', 'border-b-4', 'border-blue-600');
            btn.classList.add('text-slate-400', 'font-bold');
        }
    });
    // extra: when showing invest tab, update invest balance view
    if (tabId === 'invest') {
        try { renderInvestBalance(); } catch (e) {}
    }
}

function showMPIN() {
    // normalize input by removing non-digits
    const digits = (loginPhoneInput.value || '').replace(/\D/g, '');
    // require 11 digits (09XX...)
    if (/^\d{11}$/.test(digits)) {
        lastLoginDigits = digits;
        loginPhoneInput.value = digits;
        document.getElementById('login-card').classList.add('hidden');
        document.getElementById('mpin-card').classList.remove('hidden');
    } else {
        loginPhoneInput.parentElement.parentElement.classList.add('border-red-500');
        setTimeout(() => loginPhoneInput.parentElement.parentElement.classList.remove('border-red-500'), 1000);
    }
}

function handlePin(num) {
    if(pin.length < 4) {
        pin += num;
        updateDots();
        if(pin.length === 4) {
            setTimeout(() => { 
                            // mark as authenticated and proceed
                            try { localStorage.setItem('gcash_authed', 'true'); } catch(e) {}
                            // persist phone into profile so header/profile update
                            // persist phone into profile so header/profile update (expect 11 digits)
                            if (lastLoginDigits && lastLoginDigits.length === 11) {
                                const formatted = `${lastLoginDigits.slice(0,4)} ${lastLoginDigits.slice(4,7)} ${lastLoginDigits.slice(7)}`;
                                state.userProfile.phone = `+63 ${formatted}`;
                                try { saveState(); } catch(e) {}
                            }
                            document.getElementById('auth-overlay').style.opacity = '0';
                            setTimeout(() => {
                                document.getElementById('auth-overlay').style.display = 'none';
                                initializeApp();
                                // ensure user lands on Home after login
                                try { switchTab('home'); switchWalletTab('wallet'); } catch(e) {}
                            }, 300);
                }, 200);
        }
    }
}

function clearPin() {
    pin = pin.slice(0, -1);
    updateDots();
}

function updateDots() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, i) => {
        if(i < pin.length) {
            dot.classList.add('gcash-bg', 'scale-125');
            dot.classList.remove('border-slate-300');
        } else {
            dot.classList.remove('gcash-bg', 'scale-125');
            dot.classList.add('border-slate-300');
        }
    });
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try { localStorage.removeItem('gcash_authed'); } catch(e) {}
        // show auth overlay and reset login UI
        const overlay = document.getElementById('auth-overlay');
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
        document.getElementById('login-card').classList.remove('hidden');
        document.getElementById('mpin-card').classList.add('hidden');
        pin = '';
        updateDots();
        showToast('Logged out');
    }
}

// ==================== ACTIVITY / TRANSACTIONS ====================
function addTransaction(transaction) {
    state.transactions.unshift({
        ...transaction,
        id: generateReference(),
        timestamp: new Date().toISOString(),
        status: 'success'
    });
    saveState();
    renderTransactions();
    // create inbox receipt
    const t = state.transactions[0];
    const title = 'Transaction Receipt';
    const body = `${t.title} • ₱${formatCurrency(t.amount)} • Ref: ${t.reference}`;
    addInboxMessage({ title, body, txRef: t.reference });
}

function renderTransactions() {
    const listContainer = document.getElementById('activity-list');
    const searchTerm = document.getElementById('activity-search').value.toLowerCase();
    
    let filtered = state.transactions.filter(t => {
        const matchesFilter = currentActivityFilter === 'all' || t.type === currentActivityFilter;
        const matchesSearch = !searchTerm || 
            t.title.toLowerCase().includes(searchTerm) ||
            t.description.toLowerCase().includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="p-12 text-center">
                <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🧾</div>
                <h3 class="text-lg font-black text-blue-950">No Transactions</h3>
                <p class="text-slate-500 text-sm font-medium">Your transaction history will appear here</p>
            </div>
        `;
        return;
    }

    // Group by date
    const grouped = {};
    filtered.forEach(t => {
        const date = new Date(t.timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let dateKey;
        if (date.toDateString() === today.toDateString()) {
            dateKey = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            dateKey = 'Yesterday';
        } else {
            dateKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        }

        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(t);
    });

    let html = '';
    Object.keys(grouped).forEach(dateKey => {
        html += `<div class="p-4 border-b bg-slate-50"><h4 class="font-black text-blue-950 text-sm">${dateKey}</h4></div>`;
        grouped[dateKey].forEach(t => {
            html += renderTransactionItem(t);
        });
    });

    listContainer.innerHTML = html;
}

function renderBorrowDashboard() {
    const limitEl = document.getElementById('gcredit-limit');
    const availEl = document.getElementById('gcredit-available');
    const usedEl = document.getElementById('gcredit-used');
    if (limitEl) limitEl.textContent = formatCurrency(state.gcredit.limit || 0);
    if (usedEl) usedEl.textContent = `₱${formatCurrency(state.gcredit.used || 0)}`;
    if (availEl) availEl.textContent = formatCurrency((state.gcredit.limit || 0) - (state.gcredit.used || 0));
}

function renderTransactionItem(t) {
    const icons = {
        'cash-in': '<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>',
        'sent': '<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>',
        'received': '<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 16l-4-4m0 0l4-4m-4 4h18"></path></svg>',
        'bills': '<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
        'load': '<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>'
    };

    const colors = {
        'cash-in': 'green',
        'sent': 'red',
        'received': 'green',
        'bills': 'purple',
        'load': 'blue'
    };

    const color = colors[t.type] || 'blue';
    const amountColor = ['cash-in', 'received'].includes(t.type) ? 'green' : 'blue';
    const amountPrefix = ['cash-in', 'received'].includes(t.type) ? '+' : '-';
    
    const time = new Date(t.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return `
        <button onclick='viewTransactionDetails(${JSON.stringify(t).replace(/'/g, "\\'")})'  class="w-full p-4 border-b hover:bg-slate-50 transition-colors text-left flex items-center gap-4 active:scale-[0.99]">
            <div class="w-12 h-12 bg-${color}-100 rounded-2xl flex items-center justify-center shrink-0">
                ${icons[t.type] || icons['cash-in']}
            </div>
            <div class="flex-1 min-w-0">
                <h5 class="font-black text-blue-950 text-sm">${t.title}</h5>
                <p class="text-xs text-slate-500 font-medium truncate">${t.description}</p>
                <p class="text-[10px] text-slate-400 font-bold mt-0.5">${time}</p>
            </div>
            <div class="text-right">
                <p class="font-black text-${amountColor}-600 text-sm">${amountPrefix}₱${formatCurrency(t.amount)}</p>
                <span class="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black">${t.status}</span>
            </div>
        </button>
    `;
}

function viewTransactionDetails(transaction) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-center text-white">
                <h3 class="text-xl font-black mb-2">${transaction.title}</h3>
                <p class="text-3xl font-black">${(['cash-in', 'received'].includes(transaction.type) ? '+' : '-')}₱${formatCurrency(transaction.amount)}</p>
            </div>
            <div class="p-6">
                <div class="bg-slate-50 rounded-2xl p-4 mb-4 space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-slate-500 font-medium">Description:</span>
                        <span class="font-black text-blue-950">${transaction.description}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-slate-500 font-medium">Reference:</span>
                        <span class="font-black text-blue-950">${transaction.reference}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-slate-500 font-medium">Date & Time:</span>
                        <span class="font-black text-blue-950">${new Date(transaction.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-slate-500 font-medium">Status:</span>
                        <span class="font-black text-green-600 uppercase">${transaction.status}</span>
                    </div>
                </div>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="w-full bg-blue-600 text-white py-4 font-black active:scale-95 transition-transform">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
}

function setActivityFilter(filter) {
    currentActivityFilter = filter;
    document.querySelectorAll('.activity-filter-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-white', 'text-slate-600', 'border');
    });
    event.target.classList.remove('bg-white', 'text-slate-600', 'border');
    event.target.classList.add('bg-blue-600', 'text-white');
    renderTransactions();
}

function filterTransactions() {
    renderTransactions();
}

// ==================== FLOWS ====================
function openFlow(flowType) {
    currentFlowData = { type: flowType, step: 1 };
    
    switch(flowType) {
        case 'send':
            renderSendFlow();
            break;
        case 'load':
            renderLoadFlow();
            break;
        case 'bank':
            renderBankFlow();
            break;
        case 'cashin':
            renderCashInFlow();
            break;
        case 'invest':
            renderInvestFlow();
            break;
        case 'bills':
            renderBillsFlow();
            break;
    }
    
    document.getElementById('flow-modal').classList.add('active');
}

function closeFlow() {
    document.getElementById('flow-modal').classList.remove('active');
    document.getElementById('flow-modal').innerHTML = '';
    currentFlowData = {};
}

// SEND MONEY FLOW
function renderSendFlow() {
    const modal = document.getElementById('flow-modal');
    
    if (currentFlowData.step === 1) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="closeFlow()" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Send Money</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Mobile Number</label>
                        <div class="bg-slate-50 rounded-xl p-4 border-2 border-transparent focus-within:border-blue-500 transition-all">
                            <div class="flex items-center">
                                <span class="text-lg font-bold pr-3 border-r border-slate-300">+63</span>
                                <input id="send-phone" type="tel" placeholder="09XX XXX XXXX" maxlength="11" class="bg-transparent text-lg font-bold w-full px-3 outline-none" oninput="validateSendForm()">
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Amount</label>
                        <div class="bg-slate-50 rounded-xl p-4 border-2 border-transparent focus-within:border-blue-500 transition-all">
                            <div class="flex items-center">
                                <span class="text-lg font-bold pr-3">₱</span>
                                <input id="send-amount" type="text" placeholder="0.00" class="bg-transparent text-lg font-bold w-full outline-none" oninput="formatAmountInput(this); validateSendForm()">
                            </div>
                        </div>
                        <p class="text-xs text-slate-500 font-medium mt-2">Available: ₱${formatCurrency(state.balance)}</p>
                    </div>
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Message (Optional)</label>
                        <textarea id="send-message" placeholder="Add a message..." class="w-full bg-slate-50 rounded-xl p-4 outline-none resize-none font-medium text-sm" rows="3"></textarea>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button id="send-next-btn" disabled onclick="proceedSendConfirm()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform">Next</button>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 2) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="currentFlowData.step = 1; renderSendFlow();" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Confirm Send</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div class="bg-slate-50 rounded-2xl p-6 text-center">
                        <p class="text-sm font-black text-slate-500 mb-2">Amount to Send</p>
                        <p class="text-4xl font-black text-blue-950">₱${formatCurrency(currentFlowData.amount)}</p>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-sm text-slate-500 font-medium">To:</span>
                            <span class="text-sm font-black text-blue-950">+63 ${formatPhoneNumber(currentFlowData.phone)}</span>
                        </div>
                        ${currentFlowData.message ? `
                        <div class="flex justify-between">
                            <span class="text-sm text-slate-500 font-medium">Message:</span>
                            <span class="text-sm font-black text-blue-950">${currentFlowData.message}</span>
                        </div>
                        ` : ''}
                        <div class="flex justify-between border-t pt-3">
                            <span class="text-sm text-slate-500 font-medium">New Balance:</span>
                            <span class="text-sm font-black text-green-600">₱${formatCurrency(state.balance - currentFlowData.amount)}</span>
                        </div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button onclick="confirmSend()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Confirm & Send</button>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 3) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-green-500 p-8 text-center text-white">
                    <div class="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 class="text-2xl font-black mb-2">Transfer Successful!</h3>
                    <p class="text-xl font-black">₱${formatCurrency(currentFlowData.amount)}</p>
                </div>
                <div class="p-6">
                    <div class="bg-slate-50 rounded-2xl p-4 space-y-2 mb-4">
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 font-medium">To:</span>
                            <span class="font-black text-blue-950">+63 ${formatPhoneNumber(currentFlowData.phone)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 font-medium">Reference:</span>
                            <span class="font-black text-blue-950">${currentFlowData.reference}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 font-medium">Date & Time:</span>
                            <span class="font-black text-blue-950">${new Date().toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button onclick="closeFlow(); switchTab('activity');" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Done</button>
                </div>
            </div>
        `;
    }
}

function validateSendForm() {
    const phone = document.getElementById('send-phone').value.replace(/\D/g, '');
    const amountStr = document.getElementById('send-amount').value.replace(/,/g, '');
    const amount = parseFloat(amountStr);
    // require 11 digits (09XX...)
    const isValid = /^\d{11}$/.test(phone) && amount > 0 && amount <= state.balance;
    document.getElementById('send-next-btn').disabled = !isValid;
}

function proceedSendConfirm() {
    currentFlowData.phone = document.getElementById('send-phone').value;
    currentFlowData.amount = parseFloat(document.getElementById('send-amount').value.replace(/,/g, ''));
    currentFlowData.message = document.getElementById('send-message').value.trim();
    currentFlowData.step = 2;
    renderSendFlow();
}

function confirmSend() {
    showLoading();
    currentFlowData.reference = generateReference();
    
    setTimeout(() => {
        state.balance -= currentFlowData.amount;
        addTransaction({
            type: 'sent',
            title: 'Send Money',
            description: `To: +63 ${formatPhoneNumber(currentFlowData.phone)}`,
            amount: currentFlowData.amount,
            reference: currentFlowData.reference
        });
        
        renderBalance();
        hideLoading();
        currentFlowData.step = 3;
        renderSendFlow();
    }, 1500);
}

// BUY LOAD FLOW
function renderLoadFlow() {
    const modal = document.getElementById('flow-modal');
    
    if (currentFlowData.step === 1) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="closeFlow()" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Buy Load</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Mobile Number</label>
                        <div class="bg-slate-50 rounded-xl p-4 border-2 border-transparent focus-within:border-blue-500 transition-all">
                            <div class="flex items-center">
                                <span class="text-lg font-bold pr-3 border-r border-slate-300">+63</span>
                                <input id="load-phone" type="tel" placeholder="09XX XXX XXXX" maxlength="11" class="bg-transparent text-lg font-bold w-full px-3 outline-none" oninput="validateLoadForm()">
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Network Provider</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button onclick="selectProvider('Globe')" data-provider="globe" class="provider-btn bg-slate-50 border-2 border-transparent p-4 rounded-xl font-black text-blue-950 hover:border-blue-500 transition-all">
                                <div class="text-2xl mb-2">🌐</div>
                                Globe
                            </button>
                            <button onclick="selectProvider('Smart')" data-provider="smart" class="provider-btn bg-slate-50 border-2 border-transparent p-4 rounded-xl font-black text-blue-950 hover:border-blue-500 transition-all">
                                <div class="text-2xl mb-2">📱</div>
                                Smart
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Select Amount</label>
                        <div class="grid grid-cols-3 gap-2">
                            ${[10, 15, 20, 30, 50, 100, 150, 300, 500].map(amt => `
                                <button onclick="selectLoadAmount(${amt})" data-amount="${amt}" class="load-amount-btn bg-slate-50 p-3 rounded-xl font-black text-blue-950 hover:bg-blue-50 transition-all">₱${amt}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button id="load-next-btn" disabled onclick="proceedLoadConfirm()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform">Next</button>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 2) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="currentFlowData.step = 1; renderLoadFlow();" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Confirm Load</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div class="bg-slate-50 rounded-2xl p-6 text-center">
                        <p class="text-sm font-black text-slate-500 mb-2">Load Amount</p>
                        <p class="text-4xl font-black text-blue-950">₱${currentFlowData.amount}.00</p>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-sm text-slate-500 font-medium">Mobile Number:</span>
                            <span class="text-sm font-black text-blue-950">+63 ${formatPhoneNumber(currentFlowData.phone)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-slate-500 font-medium">Network:</span>
                            <span class="text-sm font-black text-blue-950">${currentFlowData.provider}</span>
                        </div>
                        <div class="flex justify-between border-t pt-3">
                            <span class="text-sm text-slate-500 font-medium">New Balance:</span>
                            <span class="text-sm font-black text-green-600">₱${formatCurrency(state.balance - currentFlowData.amount)}</span>
                        </div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button onclick="confirmLoad()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Confirm & Buy</button>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 3) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-green-500 p-8 text-center text-white">
                    <div class="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 class="text-2xl font-black mb-2">Load Purchase Successful!</h3>
                    <p class="text-xl font-black">₱${currentFlowData.amount}.00</p>
                </div>
                <div class="p-6">
                    <div class="bg-slate-50 rounded-2xl p-4 space-y-2 mb-4">
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 font-medium">Mobile Number:</span>
                            <span class="font-black text-blue-950">+63 ${formatPhoneNumber(currentFlowData.phone)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 font-medium">Network:</span>
                            <span class="font-black text-blue-950">${currentFlowData.provider}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 font-medium">Reference:</span>
                            <span class="font-black text-blue-950">${currentFlowData.reference}</span>
                        </div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button onclick="closeFlow(); switchTab('activity');" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Done</button>
                </div>
            </div>
        `;
    }
}

// GSave deposit / withdraw
function openSave(action) {
    currentFlowData = { action, step: 1 };
    renderSaveFlow();
    document.getElementById('flow-modal').classList.add('active');
}

// ==================== INVEST FLOW ====================
function renderInvestFlow() {
    const modal = document.getElementById('flow-modal');
    if (!currentFlowData.step) currentFlowData.step = 1;

    if (currentFlowData.step === 1) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="closeFlow()" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Invest</h3>
                </div>
                <div class="p-6 space-y-4">
                    <p class="text-sm text-slate-500">Move funds between Wallet and Invest portfolio.</p>
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="selectInvestAction('buy')" data-action="buy" class="invest-action-btn w-full p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 font-black">Buy</button>
                        <button onclick="selectInvestAction('sell')" data-action="sell" class="invest-action-btn w-full p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 font-black">Sell</button>
                    </div>
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Amount</label>
                        <div class="bg-slate-50 rounded-xl p-4">
                            <div class="flex items-center">
                                <span class="text-lg font-bold pr-3">₱</span>
                                <input id="invest-amount" type="text" placeholder="0.00" class="bg-transparent text-lg font-bold w-full outline-none" oninput="formatAmountInput(this); validateInvestForm()">
                            </div>
                        </div>
                        <p class="text-xs text-slate-500 font-medium mt-2">Wallet: ₱${formatCurrency(state.balance)} | Portfolio: ₱${formatCurrency(state.investBalance || 0)}</p>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button id="invest-next-btn" disabled onclick="proceedInvestConfirm()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform">Next</button>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 2) {
        const actionLabel = currentFlowData.action === 'buy' ? 'Buy Investment' : 'Sell Investment';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="currentFlowData.step = 1; renderInvestFlow();" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Confirm ${actionLabel}</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div class="bg-slate-50 rounded-2xl p-6 text-center">
                        <p class="text-sm font-black text-slate-500 mb-2">Amount</p>
                        <p class="text-4xl font-black text-blue-950">₱${formatCurrency(currentFlowData.amount)}</p>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between"><span class="text-sm text-slate-500 font-medium">Action:</span><span class="text-sm font-black text-blue-950">${currentFlowData.action}</span></div>
                        <div class="flex justify-between border-t pt-3"><span class="text-sm text-slate-500 font-medium">New Wallet Balance:</span><span class="text-sm font-black text-green-600">₱${formatCurrency(state.balance - (currentFlowData.action === 'buy' ? currentFlowData.amount : 0) + (currentFlowData.action === 'sell' ? currentFlowData.amount : 0))}</span></div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button onclick="confirmInvest()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Confirm</button>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 3) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-green-500 p-8 text-center text-white">
                    <div class="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 class="text-2xl font-black mb-2">${currentFlowData.action === 'buy' ? 'Investment Purchased!' : 'Investment Sold!'}</h3>
                    <p class="text-xl font-black">₱${formatCurrency(currentFlowData.amount)}</p>
                </div>
                <div class="p-6">
                    <div class="bg-slate-50 rounded-2xl p-4 space-y-2 mb-4">
                        <div class="flex justify-between text-sm"><span class="text-slate-500 font-medium">Reference:</span><span class="font-black text-blue-950">${currentFlowData.reference}</span></div>
                        <div class="flex justify-between text-sm"><span class="text-slate-500 font-medium">Date:</span><span class="font-black text-blue-950">${new Date().toLocaleString()}</span></div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button onclick="closeFlow(); switchTab('activity');" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Done</button>
                </div>
            </div>
        `;
    }
}

function selectInvestAction(action) {
    currentFlowData.action = action;
    document.querySelectorAll('.invest-action-btn').forEach(btn => btn.classList.remove('bg-blue-600','text-white'));
    try { event.target.classList.add('bg-blue-600','text-white'); } catch(e) {}
    validateInvestForm();
}

function validateInvestForm() {
    const amtStr = (document.getElementById('invest-amount') && document.getElementById('invest-amount').value.replace(/,/g, '')) || '';
    const amt = parseFloat(amtStr) || 0;
    let ok = amt > 0 && (currentFlowData.action === 'buy' ? amt <= state.balance : amt <= (state.investBalance || 0));
    ok = ok && !!currentFlowData.action;
    const btn = document.getElementById('invest-next-btn');
    if (btn) btn.disabled = !ok;
}

function proceedInvestConfirm() {
    currentFlowData.amount = parseFloat((document.getElementById('invest-amount').value || '').replace(/,/g, '')) || 0;
    currentFlowData.step = 2;
    renderInvestFlow();
}

function confirmInvest() {
    showLoading();
    currentFlowData.reference = generateReference();
    setTimeout(() => {
        const amt = currentFlowData.amount || 0;
        if (currentFlowData.action === 'buy') {
            state.balance -= amt;
            state.investBalance = (state.investBalance || 0) + amt;
            addTransaction({ type: 'invest', title: 'Invest (Buy)', description: 'Bought investment units', amount: amt, reference: currentFlowData.reference });
        } else {
            state.investBalance = (state.investBalance || 0) - amt;
            state.balance += amt;
            addTransaction({ type: 'invest', title: 'Invest (Sell)', description: 'Sold investment units', amount: amt, reference: currentFlowData.reference });
        }
        saveState();
        renderBalance();
        renderInvestBalance();
        renderTransactions();
        hideLoading();
        currentFlowData.step = 3;
        renderInvestFlow();
    }, 800);
}

function renderSaveFlow() {
    const modal = document.getElementById('flow-modal');
    const action = currentFlowData.action;
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                <button onclick="closeFlow()" class="mr-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h3 class="text-xl font-black">${action === 'deposit' ? 'Deposit to GSave' : 'Withdraw from GSave'}</h3>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Amount</label>
                    <div class="bg-slate-50 rounded-xl p-4">
                        <div class="flex items-center">
                            <span class="text-lg font-bold pr-3">₱</span>
                            <input id="save-amount" type="text" placeholder="0.00" class="bg-transparent text-lg font-bold w-full outline-none" oninput="formatAmountInput(this)">
                        </div>
                    </div>
                    <p class="text-xs text-slate-500 font-medium mt-2">Available: ₱${formatCurrency(state.balance)} | GSave: ₱${formatCurrency(state.saveBalance)}</p>
                </div>
            </div>
            <div class="p-6 pt-0">
                <button onclick="confirmSaveAction()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">${action === 'deposit' ? 'Deposit' : 'Withdraw'}</button>
            </div>
        </div>
    `;
}

function confirmSaveAction() {
    const amount = parseFloat((document.getElementById('save-amount').value || '').replace(/,/g, '')) || 0;
    if (amount <= 0) { showToast('Enter a valid amount'); return; }
    if (currentFlowData.action === 'deposit') {
        if (amount > state.balance) { showToast('Insufficient wallet balance'); return; }
        state.balance -= amount;
        state.saveBalance += amount;
        addTransaction({ type: 'cash-in', title: 'GSave Deposit', description: `Deposit to GSave`, amount });
    } else {
        if (amount > state.saveBalance) { showToast('Insufficient GSave balance'); return; }
        state.saveBalance -= amount;
        state.balance += amount;
        addTransaction({ type: 'received', title: 'GSave Withdraw', description: `Withdraw from GSave`, amount });
    }
    saveState();
    renderBalance();
    renderSaveBalance();
    closeFlow();
    showToast('Completed');
}

function selectProvider(provider) {
    document.querySelectorAll('.provider-btn').forEach(btn => {
        btn.classList.remove('border-blue-500', 'bg-blue-50');
    });
    event.target.closest('.provider-btn').classList.add('border-blue-500', 'bg-blue-50');
    currentFlowData.provider = provider;
    validateLoadForm();
}

function selectLoadAmount(amount) {
    document.querySelectorAll('.load-amount-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-slate-50', 'text-blue-950');
    });
    event.target.classList.remove('bg-slate-50', 'text-blue-950');
    event.target.classList.add('bg-blue-600', 'text-white');
    currentFlowData.amount = amount;
    validateLoadForm();
}

function validateLoadForm() {
    const phone = document.getElementById('load-phone').value.replace(/\D/g, '');
    // require 11 digits (09XX...)
    const isValid = /^\d{11}$/.test(phone) && currentFlowData.provider && currentFlowData.amount && currentFlowData.amount <= state.balance;
    document.getElementById('load-next-btn').disabled = !isValid;
}

function proceedLoadConfirm() {
    currentFlowData.phone = document.getElementById('load-phone').value;
    currentFlowData.step = 2;
    renderLoadFlow();
}

function confirmLoad() {
    showLoading();
    currentFlowData.reference = generateReference();
    
    setTimeout(() => {
        state.balance -= currentFlowData.amount;
        addTransaction({
            type: 'load',
            title: 'Buy Load',
            description: `${currentFlowData.provider} - +63 ${formatPhoneNumber(currentFlowData.phone)}`,
            amount: currentFlowData.amount,
            reference: currentFlowData.reference
        });
        
        renderBalance();
        hideLoading();
        currentFlowData.step = 3;
        renderLoadFlow();
    }, 1500);
}

// PAY BILLS FLOW
const billCategories = {
    electric: [
        { name: 'Meralco', code: 'MER' },
        { name: 'Manila Electric', code: 'MEL' }
    ],
    water: [
        { name: 'Maynilad', code: 'MAY' },
        { name: 'Manila Water', code: 'MW' }
    ],
    internet: [
        { name: 'PLDT Home', code: 'PLDT' },
        { name: 'Converge ICT', code: 'CONV' }
    ]
};

function renderBillsFlow() {
    const modal = document.getElementById('flow-modal');
    
    if (currentFlowData.step === 1) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="closeFlow()" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Pay Bills</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 block">Select Category</label>
                        <div class="space-y-2">
                                <button onclick="selectBillCategory('electric')" class="bill-category-btn w-full flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all">
                                <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">⚡</div>
                                <div class="text-left flex-1">
                                    <h4 class="font-black text-blue-950">Electric</h4>
                                    <p class="text-xs text-slate-500 font-medium">Power bills</p>
                                </div>
                                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                            </button>
                            <button onclick="selectBillCategory('water')" class="bill-category-btn w-full flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all">
                                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">💧</div>
                                <div class="text-left flex-1">
                                    <h4 class="font-black text-blue-950">Water</h4>
                                    <p class="text-xs text-slate-500 font-medium">Water bills</p>
                                </div>
                                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                            </button>
                            <button onclick="selectBillCategory('internet')" class="bill-category-btn w-full flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all">
                                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">🌐</div>
                                <div class="text-left flex-1">
                                    <h4 class="font-black text-blue-950">Internet</h4>
                                    <p class="text-xs text-slate-500 font-medium">Internet & Cable</p>
                                </div>
                                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 2) {
        const billers = billCategories[currentFlowData.category];
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="currentFlowData.step = 1; renderBillsFlow();" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Select Biller</h3>
                </div>
                <div class="p-6 space-y-3">
                    ${billers.map(biller => `
                        <button onclick="selectBiller('${biller.name}', '${biller.code}')" class="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all">
                            <span class="font-black text-blue-950">${biller.name}</span>
                            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 3) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="currentFlowData.step = 2; renderBillsFlow();" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">${currentFlowData.biller}</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Account Number</label>
                        <input id="bill-account" type="text" placeholder="Enter account number" class="w-full bg-slate-50 rounded-xl p-4 outline-none font-bold" oninput="validateBillForm()">
                    </div>
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Amount to Pay</label>
                        <div class="bg-slate-50 rounded-xl p-4">
                            <div class="flex items-center">
                                <span class="text-lg font-bold pr-3">₱</span>
                                <input id="bill-amount" type="text" placeholder="0.00" class="bg-transparent text-lg font-bold w-full outline-none" oninput="formatAmountInput(this); validateBillForm()">
                            </div>
                        </div>
                        <p class="text-xs text-slate-500 font-medium mt-2">Available: ₱${formatCurrency(state.balance)}</p>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button id="bill-next-btn" disabled onclick="proceedBillConfirm()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform">Next</button>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 4) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="currentFlowData.step = 3; renderBillsFlow();" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Confirm Payment</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div class="bg-slate-50 rounded-2xl p-6 text-center">
                        <p class="text-sm font-black text-slate-500 mb-2">Amount to Pay</p>
                        <p class="text-4xl font-black text-blue-950">₱${formatCurrency(currentFlowData.amount)}</p>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-sm text-slate-500 font-medium">Biller:</span>
                            <span class="text-sm font-black text-blue-950">${currentFlowData.biller}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-slate-500 font-medium">Account:</span>
                            <span class="text-sm font-black text-blue-950">${currentFlowData.account}</span>
                        </div>
                        <div class="flex justify-between border-t pt-3">
                            <span class="text-sm text-slate-500 font-medium">New Balance:</span>
                            <span class="text-sm font-black text-green-600">₱${formatCurrency(state.balance - currentFlowData.amount)}</span>
                        </div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button onclick="confirmBillPayment()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Confirm & Pay</button>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 5) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-green-500 p-8 text-center text-white">
                    <div class="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 class="text-2xl font-black mb-2">Payment Successful!</h3>
                    <p class="text-xl font-black">₱${formatCurrency(currentFlowData.amount)}</p>
                </div>
                <div class="p-6">
                    <div class="bg-slate-50 rounded-2xl p-4 space-y-2 mb-4">
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 font-medium">Biller:</span>
                            <span class="font-black text-blue-950">${currentFlowData.biller}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 font-medium">Account:</span>
                            <span class="font-black text-blue-950">${currentFlowData.account}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 font-medium">Reference:</span>
                            <span class="font-black text-blue-950">${currentFlowData.reference}</span>
                        </div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button onclick="closeFlow(); switchTab('activity');" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Done</button>
                </div>
            </div>
        `;
    }
}

function payBillsWithGcredit() {
    // open bills flow and mark to use GCredit
    currentFlowData = { useGcredit: true, step: 1 };
    renderBillsFlow();
    document.getElementById('flow-modal').classList.add('active');
}

// ==================== BANK TRANSFER FLOW ====================
function renderBankFlow() {
    const modal = document.getElementById('flow-modal');
    if (!currentFlowData.step) currentFlowData.step = 1;

    if (currentFlowData.step === 1) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="closeFlow()" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Bank Transfer</h3>
                </div>
                <div class="p-6 space-y-4">
                    <p class="text-sm text-slate-500">Select destination bank</p>
                    <div class="grid grid-cols-2 gap-3">
                        ${['BDO','BPI','Landbank','Metrobank','UnionBank'].map(b => `
                            <button onclick="selectBank('${b}')" class="w-full p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 font-black">${b}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 2) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="currentFlowData.step = 1; renderBankFlow();" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">${currentFlowData.bank} Transfer</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Account Number</label>
                        <input id="bank-account" type="text" placeholder="Enter account number" class="w-full bg-slate-50 rounded-xl p-4 outline-none font-bold" oninput="validateBankForm()">
                    </div>
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Account Name</label>
                        <input id="bank-account-name" type="text" placeholder="Account name" class="w-full bg-slate-50 rounded-xl p-4 outline-none font-bold" oninput="validateBankForm()">
                    </div>
                    <div>
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Amount</label>
                        <div class="bg-slate-50 rounded-xl p-4">
                            <div class="flex items-center">
                                <span class="text-lg font-bold pr-3">₱</span>
                                <input id="bank-amount" type="text" placeholder="0.00" class="bg-transparent text-lg font-bold w-full outline-none" oninput="formatAmountInput(this); validateBankForm()">
                            </div>
                        </div>
                        <p class="text-xs text-slate-500 font-medium mt-2">Available: ₱${formatCurrency(state.balance)}</p>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button id="bank-next-btn" disabled onclick="proceedBankConfirm()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform">Next</button>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 3) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="currentFlowData.step = 2; renderBankFlow();" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Confirm Transfer</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div class="bg-slate-50 rounded-2xl p-6 text-center">
                        <p class="text-sm font-black text-slate-500 mb-2">Amount to Transfer</p>
                        <p class="text-4xl font-black text-blue-950">₱${formatCurrency(currentFlowData.amount)}</p>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between"><span class="text-sm text-slate-500 font-medium">Bank:</span><span class="text-sm font-black text-blue-950">${currentFlowData.bank}</span></div>
                        <div class="flex justify-between"><span class="text-sm text-slate-500 font-medium">Account:</span><span class="text-sm font-black text-blue-950">${currentFlowData.account}</span></div>
                        <div class="flex justify-between"><span class="text-sm text-slate-500 font-medium">Name:</span><span class="text-sm font-black text-blue-950">${currentFlowData.name}</span></div>
                        <div class="flex justify-between border-t pt-3"><span class="text-sm text-slate-500 font-medium">New Balance:</span><span class="text-sm font-black text-green-600">₱${formatCurrency(state.balance - currentFlowData.amount)}</span></div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button onclick="confirmBankTransfer()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Confirm & Transfer</button>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 4) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-green-500 p-8 text-center text-white">
                    <div class="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 class="text-2xl font-black mb-2">Transfer Successful!</h3>
                    <p class="text-xl font-black">₱${formatCurrency(currentFlowData.amount)}</p>
                </div>
                <div class="p-6">
                    <div class="bg-slate-50 rounded-2xl p-4 space-y-2 mb-4">
                        <div class="flex justify-between text-sm"><span class="text-slate-500 font-medium">To:</span><span class="font-black text-blue-950">${currentFlowData.bank} • ${currentFlowData.account}</span></div>
                        <div class="flex justify-between text-sm"><span class="text-slate-500 font-medium">Reference:</span><span class="font-black text-blue-950">${currentFlowData.reference}</span></div>
                        <div class="flex justify-between text-sm"><span class="text-slate-500 font-medium">Receipt:</span><span class="font-black text-blue-950">${currentFlowData.receipt}</span></div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button onclick="closeFlow(); switchTab('activity');" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Done</button>
                </div>
            </div>
        `;
    }
}

function selectBank(bank) { currentFlowData = { bank, step: 2 }; renderBankFlow(); }

function validateBankForm() {
    const acc = document.getElementById('bank-account').value.trim();
    const name = document.getElementById('bank-account-name').value.trim();
    const amountStr = document.getElementById('bank-amount').value.replace(/,/g, '');
    const amount = parseFloat(amountStr);
    const ok = acc.length > 4 && name.length > 2 && amount > 0 && amount <= state.balance;
    document.getElementById('bank-next-btn').disabled = !ok;
}

function proceedBankConfirm() {
    currentFlowData.account = document.getElementById('bank-account').value.trim();
    currentFlowData.name = document.getElementById('bank-account-name').value.trim();
    currentFlowData.amount = parseFloat(document.getElementById('bank-amount').value.replace(/,/g, ''));
    currentFlowData.step = 3;
    renderBankFlow();
}

function confirmBankTransfer() {
    showLoading();
    currentFlowData.reference = generateReference();
    currentFlowData.receipt = 'BT' + generateReference();
    setTimeout(() => {
        state.balance -= currentFlowData.amount;
        addTransaction({ type: 'sent', title: 'Bank Transfer', description: `${currentFlowData.bank} • ${currentFlowData.account}`, amount: currentFlowData.amount, reference: currentFlowData.reference });
        renderBalance();
        hideLoading();
        currentFlowData.step = 4;
        renderBankFlow();
    }, 1200);
}

// ==================== CASH IN FLOW (Partners + Barcode) ====================
function renderCashInFlow() {
    const modal = document.getElementById('flow-modal');
    if (!currentFlowData.step) currentFlowData.step = 1;

    if (currentFlowData.step === 1) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="closeFlow()" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">Cash In Partners</h3>
                </div>
                <div class="p-6 space-y-4">
                    <p class="text-sm text-slate-500">Select a partner to generate a barcode</p>
                    <div class="grid grid-cols-1 gap-3">
                        ${['7-Eleven','Palawan Pawnshop','TouchPay'].map(p => `
                            <button onclick="selectCashInPartner('${p}')" class="w-full p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 font-black">${p}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    } else if (currentFlowData.step === 2) {
        // show barcode and allow entering amount
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                    <button onclick="currentFlowData.step = 1; renderCashInFlow();" class="mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h3 class="text-xl font-black">${currentFlowData.partner} - Barcode</h3>
                </div>
                <div class="p-6 space-y-4 text-center">
                    <div class="barcode-placeholder mx-auto mb-4"></div>
                    <p class="text-sm text-slate-500">Present this barcode at the ${currentFlowData.partner} cashier to pay. Use the reference shown below.</p>
                    <div class="bg-slate-50 rounded-2xl p-4 mt-4 font-black">Reference: ${generateReference()}</div>
                    <div class="mt-4">
                        <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Amount (simulate)</label>
                        <div class="bg-slate-50 rounded-xl p-2 inline-block">
                            <div class="flex items-center">
                                <span class="text-lg font-bold pr-3">₱</span>
                                <input id="cashin-amount" type="text" placeholder="0.00" class="bg-transparent text-lg font-bold w-40 outline-none" oninput="formatAmountInput(this)">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button onclick="simulateCashIn()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Simulate Payment</button>
                </div>
            </div>
        `;
    }
}

function selectCashInPartner(partner) { currentFlowData = { partner, step: 2 }; renderCashInFlow(); }

function simulateCashIn() {
    const amount = parseFloat((document.getElementById('cashin-amount').value || '').replace(/,/g, '')) || 0;
    if (amount <= 0) { showToast('Enter amount to simulate'); return; }
    showLoading();
    setTimeout(() => {
        const ref = generateReference();
        state.balance += amount;
        addTransaction({ type: 'cash-in', title: 'Cash In', description: `${currentFlowData.partner} - Cash In`, amount, reference: ref });
        saveState();
        renderBalance();
        hideLoading();
        closeFlow();
        showToast('Cash In completed');
    }, 1200);
}

// ==================== QR SCANNER VIEW ====================
function showScanner() {
    const existing = document.getElementById('scanner-overlay');
    if (existing) return;
    const overlay = document.createElement('div');
    overlay.id = 'scanner-overlay';
    overlay.className = 'scanner-overlay';
    overlay.innerHTML = `
        <div class="mask" onclick="document.getElementById('scanner-overlay')?.remove()"></div>
        <div class="viewfinder"></div>
        <div class="scan-line"></div>
        <div class="scanner-controls"><div class="text-sm font-black">Scanner active</div><div class="text-xs">Align QR inside frame</div><div style="margin-top:8px"><button onclick="document.getElementById('scanner-overlay')?.remove()" class="bg-white text-blue-600 px-4 py-2 rounded-full font-black">Close</button></div></div>
    `;
    document.body.appendChild(overlay);
}

// ==================== SERVICES HUB ====================
function openServiceHub(name) {
    currentFlowData = { service: name };
    renderServiceHub(name);
    document.getElementById('flow-modal').classList.add('active');
}

function renderServiceHub(name) {
    const modal = document.getElementById('flow-modal');
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                <button onclick="closeFlow()" class="mr-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h3 class="text-xl font-black">${name}</h3>
            </div>
            <div class="p-6 text-center">
                <div class="w-28 h-28 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center text-4xl mb-4">${serviceIcon(name)}</div>
                <h4 class="text-lg font-black text-blue-950">Welcome to ${name}</h4>
                <p class="text-sm text-slate-500 mt-2">This feature is coming soon — we're building a great experience for ${name}.</p>
                <div class="mt-6 bg-slate-50 p-4 rounded-2xl text-left">
                    <p class="text-xs font-black text-slate-600">About</p>
                    <p class="text-xs text-slate-500 mt-2">${name} will be available in a future release. Stay tuned for updates.</p>
                </div>
            </div>
            <div class="p-6 pt-0">
                <button onclick="closeFlow()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Close</button>
            </div>
        </div>
    `;
}

function serviceIcon(name) {
    const map = {
        'GInsure': '🛡️',
        'A+ Rewards': '🎁',
        'Food Hub': '🍔',
        'Travel': '✈️',
        'GForest': '🌳'
    };
    return map[name] || '✨';
}

function selectBillCategory(category) {
    currentFlowData.category = category;
    currentFlowData.step = 2;
    renderBillsFlow();
}

function selectBiller(name, code) {
    currentFlowData.biller = name;
    currentFlowData.billerCode = code;
    currentFlowData.step = 3;
    renderBillsFlow();
}

function validateBillForm() {
    const account = document.getElementById('bill-account').value;
    const amountStr = document.getElementById('bill-amount').value.replace(/,/g, '');
    const amount = parseFloat(amountStr);
    let available = state.balance;
    if (currentFlowData && currentFlowData.useGcredit) {
        available = (state.gcredit.limit || 0) - (state.gcredit.used || 0);
    }
    const isValid = account.length > 0 && amount > 0 && amount <= available;
    document.getElementById('bill-next-btn').disabled = !isValid;
}

function proceedBillConfirm() {
    currentFlowData.account = document.getElementById('bill-account').value;
    currentFlowData.amount = parseFloat(document.getElementById('bill-amount').value.replace(/,/g, ''));
    currentFlowData.step = 4;
    renderBillsFlow();
}

function confirmBillPayment() {
    showLoading();
    currentFlowData.reference = generateReference();
    
    setTimeout(() => {
        if (currentFlowData.useGcredit) {
            const available = (state.gcredit.limit || 0) - (state.gcredit.used || 0);
            if (currentFlowData.amount > available) {
                hideLoading();
                showToast('Insufficient GCredit');
                return;
            }
            state.gcredit.used = (state.gcredit.used || 0) + currentFlowData.amount;
            addTransaction({
                type: 'bills',
                title: 'Pay Bills (GCredit)',
                description: `${currentFlowData.biller} - ${currentFlowData.account} (GCredit)`,
                amount: currentFlowData.amount,
                reference: currentFlowData.reference
            });
        } else {
            state.balance -= currentFlowData.amount;
            addTransaction({
                type: 'bills',
                title: 'Pay Bills',
                description: `${currentFlowData.biller} - ${currentFlowData.account}`,
                amount: currentFlowData.amount,
                reference: currentFlowData.reference
            });
        }
        
        saveState();
        renderBalance();
        renderBorrowDashboard();
        hideLoading();
        currentFlowData.step = 5;
        renderBillsFlow();
    }, 1500);
}

// INPUT FORMATTING
function formatAmountInput(input) {
    let raw = input.value.replace(/[^\d.]/g, '');
    const parts = raw.split('.');
    let intPart = parts[0] || '0';
    let decPart = parts[1] || '';
    if (decPart.length > 2) decPart = decPart.substring(0,2);
    // remove leading zeros
    intPart = intPart.replace(/^0+(\d)/, '$1');
    // format integer with commas
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    input.value = decPart.length ? `${intPart}.${decPart}` : intPart;
}

// EDIT PROFILE
function openEditProfile() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                <button onclick="this.closest('.fixed').remove()" class="mr-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h3 class="text-xl font-black">Edit Profile</h3>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Display Name</label>
                    <input id="edit-name" type="text" value="${state.userProfile.name}" class="w-full bg-slate-50 rounded-xl p-4 outline-none font-bold border-2 border-transparent focus:border-blue-500 transition-all">
                </div>
                <div>
                    <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Mobile Number</label>
                    <input id="edit-phone" type="text" value="${state.userProfile.phone}" class="w-full bg-slate-50 rounded-xl p-4 outline-none font-bold border-2 border-transparent focus:border-blue-500 transition-all">
                    <p class="text-xs text-slate-500 mt-2">Edit your mobile number (11 digits). We will format it to +63 on save.</p>
                </div>
            </div>
                    <div class="p-6 pt-0">
                        <button onclick="saveProfile()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Save Changes</button>
                    </div>
        </div>
    `;
            // mark modal for easy removal
            modal.id = 'edit-profile-modal';
            document.body.appendChild(modal);
}

function saveProfile() {
    const newName = document.getElementById('edit-name').value.trim();
    const newPhoneRaw = (document.getElementById('edit-phone') && document.getElementById('edit-phone').value) || '';
    const digits = newPhoneRaw.replace(/\D/g, '');
    if (newName) state.userProfile.name = newName;
    if (digits.length === 11) {
        const formatted = `${digits.slice(0,4)} ${digits.slice(4,7)} ${digits.slice(7)}`;
        state.userProfile.phone = `+63 ${formatted}`;
    } else if (digits.length > 0) {
        state.userProfile.phone = `+63 ${digits}`;
    }
    saveState();
    updateProfile();
    showToast('Profile updated successfully!');
    const modal = document.getElementById('edit-profile-modal');
    if (modal) modal.remove();
}

function openAccountDetails() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                <button onclick="this.closest('.fixed').remove()" class="mr-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h3 class="text-xl font-black">Account Details</h3>
            </div>
            <div class="p-6 space-y-4">
                <div class="text-left">
                    <div class="text-xs text-slate-500">Display Name</div>
                    <div class="font-black text-blue-950 text-lg">${state.userProfile.name}</div>
                </div>
                <div class="text-left">
                    <div class="text-xs text-slate-500">Mobile Number</div>
                    <div class="font-black text-blue-950 text-lg">${state.userProfile.phone}</div>
                </div>
                <div class="text-left">
                    <div class="text-xs text-slate-500">Member Since</div>
                    <div class="font-black text-blue-950 text-lg">${new Date().toLocaleDateString()}</div>
                </div>
            </div>
            <div class="p-6 pt-0">
                <button onclick="this.closest('.fixed').remove()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openChangePin() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4';
    modal.id = 'change-pink-modal';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden slide-in">
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex items-center text-white">
                <button onclick="this.closest('.fixed').remove()" class="mr-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h3 class="text-xl font-black">Change MPIN</h3>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">New 4-digit MPIN</label>
                    <input id="new-mpin" type="password" maxlength="4" pattern="\d{4}" class="w-full bg-slate-50 rounded-xl p-4 outline-none font-bold" placeholder="Enter new 4-digit MPIN">
                </div>
                <div>
                    <label class="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">Confirm MPIN</label>
                    <input id="confirm-mpin" type="password" maxlength="4" class="w-full bg-slate-50 rounded-xl p-4 outline-none font-bold" placeholder="Confirm new MPIN">
                </div>
            </div>
            <div class="p-6 pt-0">
                <button onclick="saveNewPin()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform">Save MPIN</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveNewPin() {
    const a = document.getElementById('new-mpin').value.trim();
    const b = document.getElementById('confirm-mpin').value.trim();
    if (!/^[0-9]{4}$/.test(a) || a !== b) { showToast('MPIN must be 4 digits and match'); return; }
    try { localStorage.setItem('gcash_mpin', a); } catch(e) {}
    const modal = document.getElementById('change-pink-modal');
    if (modal) modal.remove();
    showToast('MPIN updated');
}

// ==================== INITIALIZATION ====================
function initializeApp() {
    // ensure Home is visible on initialize
    try { switchTab('home'); switchWalletTab('wallet'); } catch(e) {}
    renderBalance();
    updateProfile();
    renderTransactions();
    renderSaveBalance();
    renderBorrowDashboard();
    renderInvestBalance();
    renderInbox();
}

// Auto-initialize on page load if already authenticated
window.addEventListener('DOMContentLoaded', () => {
    const authed = (() => { try { return localStorage.getItem('gcash_authed') === 'true'; } catch(e) { return false; } })();
    if (authed) {
        document.getElementById('auth-overlay').style.display = 'none';
        initializeApp();
        // make sure we show Home on load when already authenticated
        try { switchTab('home'); switchWalletTab('wallet'); } catch(e) {}
    } else {
        document.getElementById('auth-overlay').style.display = 'flex';
        document.getElementById('login-card').classList.remove('hidden');
        document.getElementById('mpin-card').classList.add('hidden');
        pin = '';
        updateDots();
    }
});
