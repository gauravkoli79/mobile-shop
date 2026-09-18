/**
 * Shree Sai Mobile Shop
 * Professional Management Script with Multilingual i18n Support (English & Hindi)
 */

// ==========================================================
// 1. Language State & Switcher Logic (i18n)
// ==========================================================
let currentLang = localStorage.getItem('shree_sai_lang') || 'en';
const API_BASE = (window.location.protocol === "file:") ? "http://localhost:8000" : "";

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('shree_sai_lang', lang);

    // 1. Update pill button active states
    const btnEn = document.getElementById("btnAdminLangEn");
    const btnHi = document.getElementById("btnAdminLangHi");
    if (btnEn && btnHi) {
        if (lang === 'hi') {
            btnHi.className = "btn btn-sm py-1 px-3 fw-bold btn-primary text-white";
            btnEn.className = "btn btn-sm py-1 px-3 fw-bold btn-light text-dark";
        } else {
            btnEn.className = "btn btn-sm py-1 px-3 fw-bold btn-primary text-white";
            btnHi.className = "btn btn-sm py-1 px-3 fw-bold btn-light text-dark";
        }
    }

    const label = document.getElementById("currentLangLabel");
    if (label) {
        label.textContent = lang === 'hi' ? 'हिन्दी (Hindi)' : 'English';
    }

    // 2. Translate all static elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // 3. Translate all placeholders with data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // 4. Update document title & html lang attribute
    document.documentElement.lang = lang;
    document.title = lang === 'hi' 
        ? "श्री साई मोबाइल शॉप | रिटेल मैनेजमेंट एवं POS सिस्टम"
        : "Shree Sai Mobile Shop | Retail Management & POS System";

    // 5. Re-render dynamic tables to reflect language
    renderInventoryTable(inventory);
    renderCustomersTable(customers);
    renderRepairsTable(repairs);
    renderPosCart();
    if (typeof renderPosInvoicesHistory === "function") renderPosInvoicesHistory();
    if (typeof renderReportsView === "function") renderReportsView();

    // 6. Update chart label
    updateChartLanguage();

    // 7. Update dynamic live clock immediately
    updateAdminLiveClock();
}

function t(key, fallback = '') {
    return (translations[currentLang] && translations[currentLang][key]) ? translations[currentLang][key] : fallback;
}

// Live Dynamic Day, Date & Clock for Admin Header (Next to Language Switcher)
function updateAdminLiveClock() {
    const el = document.getElementById("adminLiveClockText");
    if (!el) return;
    const now = new Date();
    
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const daysHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
    const monthsHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let displayHours = hours % 12;
    displayHours = displayHours ? displayHours : 12;
    const hoursStr = String(displayHours).padStart(2, '0');
    const timeFormatted = `${hoursStr}:${minutes}`;

    if (currentLang === 'hi') {
        el.textContent = `${daysHi[now.getDay()]}, ${now.getDate()} ${monthsHi[now.getMonth()]} ${now.getFullYear()} • ${timeFormatted}`;
    } else {
        el.textContent = `${daysEn[now.getDay()]}, ${now.getDate()} ${monthsEn[now.getMonth()]} ${now.getFullYear()} • ${timeFormatted}`;
    }
}

let adminClockInterval = null;
function startAdminLiveClock() {
    updateAdminLiveClock();
    if (!adminClockInterval) {
        adminClockInterval = setInterval(updateAdminLiveClock, 1000);
    }
}

// Start immediately if DOM elements already parsed
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startAdminLiveClock();
} else {
    document.addEventListener("DOMContentLoaded", startAdminLiveClock);
}

// ==========================================================
// 2. Product Photo Resolution Dictionary & Stock State
// ==========================================================
const PRODUCT_PHOTO_CATALOG = {
    chargers: {
        Xiaomi: "images/products/xiaomi_power_bank.jpg",
        Mi: "images/products/xiaomi_power_bank.jpg",
        Boat: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60",
        Apple: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60",
        Samsung: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60",
        OnePlus: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60",
        Realme: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60",
        default: "images/products/xiaomi_power_bank.jpg"
    },
    mobiles: {
        Samsung: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60",
        Apple: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60",
        Xiaomi: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60",
        Redmi: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60",
        Vivo: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=60",
        Oppo: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=60",
        OnePlus: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=60",
        Realme: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60",
        Sony: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60",
        default: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60"
    },
    tvs: {
        Sony: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=60",
        Samsung: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500&auto=format&fit=crop&q=60",
        LG: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=60",
        Xiaomi: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=60",
        OnePlus: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=60",
        default: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=60"
    },
    washing_machines: {
        LG: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&auto=format&fit=crop&q=60",
        Samsung: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=500&auto=format&fit=crop&q=60",
        Whirlpool: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&auto=format&fit=crop&q=60",
        default: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&auto=format&fit=crop&q=60"
    },
    audio: {
        Sony: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        Boat: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&auto=format&fit=crop&q=60",
        OnePlus: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
        Apple: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        JBL: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&auto=format&fit=crop&q=60",
        default: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
    },
    accessories: {
        Apple: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop&q=60",
        Samsung: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop&q=60",
        Xiaomi: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop&q=60",
        default: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop&q=60"
    }
};

function getAutoProductPhoto(category, brand, modelName) {
    const m = (modelName || "").toLowerCase();
    const b = (brand || "").toLowerCase();
    
    // Explicit check for Power Bank (Xiaomi / Any brand)
    if (m.includes("power bank") || m.includes("powerbank")) {
        return "images/products/xiaomi_power_bank.jpg";
    }
    if (b.includes("xiaomi") || b.includes("mi")) {
        if (category === "chargers" || m.includes("charger") || m.includes("power")) {
            return "images/products/xiaomi_power_bank.jpg";
        }
    }
    
    const catObj = PRODUCT_PHOTO_CATALOG[category] || PRODUCT_PHOTO_CATALOG.chargers;
    for (const key in catObj) {
        if (key.toLowerCase() === b) {
            return catObj[key];
        }
    }
    return catObj.default || "images/products/xiaomi_power_bank.jpg";
}

function updateModalImgPreview(url) {
    const img = document.getElementById("modalImgPreview");
    if (img) {
        img.src = url || "images/products/xiaomi_power_bank.jpg";
        img.onerror = () => { img.src = "images/products/xiaomi_power_bank.jpg"; };
    }
}

function autoMatchProductPhoto() {
    const cat = document.getElementById("modalCategory")?.value || "chargers";
    const brandSel = document.getElementById("modalBrand")?.value || "Xiaomi";
    const customBrand = document.getElementById("modalCustomBrand")?.value?.trim();
    const finalBrand = (brandSel === "OTHER" && customBrand) ? customBrand : brandSel;
    const model = document.getElementById("modalModelName")?.value || "";
    
    const matchedUrl = getAutoProductPhoto(cat, finalBrand, model);
    const imgInput = document.getElementById("modalProductImage");
    if (imgInput) {
        imgInput.value = matchedUrl;
        updateModalImgPreview(matchedUrl);
    }
}

function onModalCategoryOrBrandChange() {
    const catSel = document.getElementById("modalCategory");
    const brandSel = document.getElementById("modalBrand");
    const customBrandWrapper = document.getElementById("customBrandWrapper");
    const phoneFields = document.getElementById("phoneSpecificFields");

    if (brandSel && customBrandWrapper) {
        if (brandSel.value === "OTHER") {
            customBrandWrapper.classList.remove("d-none");
        } else {
            customBrandWrapper.classList.add("d-none");
        }
    }

    if (catSel && phoneFields) {
        phoneFields.style.display = (catSel.value === "mobiles") ? "block" : "none";
    }

    autoMatchProductPhoto();
    updateModalMargins();
}

function onModalModelInput() {
    autoMatchProductPhoto();
}

function updateModalMargins() {
    const purchaseInput = document.getElementById("modalPurchasePrice");
    const sellingInput = document.getElementById("modalSellingPrice");
    const mrpInput = document.getElementById("modalOriginalPrice");
    const profitBadge = document.getElementById("calculatedProfit");
    const discountBadge = document.getElementById("storeDiscountBadge");

    const p = parseFloat(purchaseInput?.value) || 0;
    const s = parseFloat(sellingInput?.value) || 0;
    const mrp = parseFloat(mrpInput?.value) || Math.round(s * 1.25);
    const profit = s - p;
    const marginPercent = p > 0 ? ((profit / p) * 100).toFixed(1) : 0;

    if (profitBadge) {
        const marginText = t('modalMargin', 'Estimated Gross Margin:');
        profitBadge.textContent = `${marginText} ₹${profit.toLocaleString('en-IN')} (${marginPercent > 0 ? '+' : ''}${marginPercent}%)`;
        profitBadge.className = profit >= 0 ? "text-success fw-bold small" : "text-danger fw-bold small";
    }

    if (discountBadge && mrp > s && mrp > 0) {
        const discountPercent = Math.round(((mrp - s) / mrp) * 100);
        discountBadge.textContent = `Store Discount: ${discountPercent}% OFF`;
        discountBadge.className = "badge bg-success-subtle text-success border border-success-subtle px-2 py-1 small";
    }
}

// Global Inventory State (Loaded from products-data.js / backend / localStorage)
let inventory = (function() {
    try {
        const stored = localStorage.getItem('shree_sai_store_products');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.map(p => normalizeProductToInventory(p));
            }
        }
    } catch(e) {}
    if (typeof window !== 'undefined' && Array.isArray(window.defaultProductsData) && window.defaultProductsData.length > 0) {
        return window.defaultProductsData.map(p => normalizeProductToInventory(p));
    }
    return [];
})();
// Customer CRM list initialized cleanly (no dummy data)
let customers = JSON.parse(localStorage.getItem('shree_sai_customers_list') || '[]');

let repairs = [
    {
        id: "r1",
        jobNo: "SSM-JOB-101",
        custName: "Rajesh Verma",
        phone: "9829445566",
        model: "Vivo Y20",
        fault: "Shattered display combo, touch unresponsive",
        pattern: "L-Pattern",
        estimate: 1800,
        advance: 500,
        status: "READY"
    },
    {
        id: "r2",
        jobNo: "SSM-JOB-102",
        custName: "Dinesh Saini",
        phone: "9414556677",
        model: "Redmi Note 10",
        fault: "Type-C charging port broken, no power intake",
        pattern: "1234",
        estimate: 450,
        advance: 0,
        status: "INSPECTING"
    },
    {
        id: "r3",
        jobNo: "SSM-JOB-103",
        custName: "Kavita Sharma",
        phone: "9928334455",
        model: "Samsung M31",
        fault: "Swollen battery, rapid drainage (under 1 hr)",
        pattern: "No PIN",
        estimate: 1400,
        advance: 500,
        status: "READY"
    },
    {
        id: "r4",
        jobNo: "SSM-JOB-104",
        custName: "Ashok Meena",
        phone: "9785998877",
        model: "iPhone 11",
        fault: "Muffled ear-speaker output during phone calls",
        pattern: "FaceID",
        estimate: 1200,
        advance: 1200,
        status: "DELIVERED"
    }
];

let posCart = [];
let salesChartInstance = null;

// ==========================================================
// 3. Initialization on DOM Load
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initInventoryTable();
    initSearchAndFilter();
    initStockModal();
    initCustomersView();
    initRepairsView();
    initPosBilling();
    initSalesChart();
    initMobileSidebar();
    initOnlineOrdersSystem();
    loadSmsStatus();
    loadAdminUpiConfig();

    // Set saved language (or default English)
    setLanguage(currentLang);
    startAdminLiveClock();

    // Auto-detect URL Hash
    handleUrlHash();
    window.addEventListener("hashchange", handleUrlHash);

    // Show notice if viewing admin panel via file:/// protocol
    if (window.location.protocol === "file:") {
        const fileNotice = document.getElementById("fileProtocolNotice");
        if (fileNotice) fileNotice.classList.remove("d-none");
    }
});

// ==========================================================
// 4. Multi-View Navigation Router
// ==========================================================
const viewMapping = {
    "dashboard-link": "dashboard-view",
    "inventory-link": "inventory-view",
    "pos-link": "pos-view",
    "online-orders-link": "online-orders-view",
    "customers-link": "customers-view",
    "repairs-link": "repairs-view",
    "reports-link": "reports-view",
    "settings-link": "settings-view"
};

const hashMapping = {
    "#dashboard": "dashboard-link",
    "#inventory": "inventory-link",
    "#pos": "pos-link",
    "#online-orders": "online-orders-link",
    "#customers": "customers-link",
    "#repairs": "repairs-link",
    "#reports": "reports-link",
    "#settings": "settings-link"
};

function switchView(linkId) {
    const targetViewId = viewMapping[linkId];
    if (!targetViewId) return;

    document.querySelectorAll(".nav-link-custom").forEach(l => l.classList.remove("active"));
    const targetLink = document.getElementById(linkId);
    if (targetLink) targetLink.classList.add("active");

    if (linkId === "online-orders-link") {
        renderOnlineOrdersView();
    }
    if (linkId === "settings-link") {
        loadSmsStatus();
        loadAdminUpiConfig();
    }
    if (linkId === "pos-link" || linkId === "dashboard-link") {
        if (typeof renderPosInvoicesHistory === "function") renderPosInvoicesHistory();
        if (typeof updateDashboardMetrics === "function") updateDashboardMetrics();
    }
    if (linkId === "customers-link") {
        if (typeof syncCustomersFromPosInvoices === "function") syncCustomersFromPosInvoices();
    }
    if (linkId === "reports-link") {
        if (typeof renderReportsView === "function") renderReportsView();
    }

    Object.values(viewMapping).forEach(viewId => {
        const sec = document.getElementById(viewId);
        if (sec) sec.classList.add("d-none");
    });

    const activeSection = document.getElementById(targetViewId);
    if (activeSection) activeSection.classList.remove("d-none");

    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("show");

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleUrlHash() {
    const hash = window.location.hash || "#dashboard";
    const linkId = hashMapping[hash] || "dashboard-link";
    switchView(linkId);
}

function initNavigation() {
    Object.keys(viewMapping).forEach(linkId => {
        const link = document.getElementById(linkId);
        if (link) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const hash = Object.keys(hashMapping).find(k => hashMapping[k] === linkId);
                if (hash) history.pushState(null, null, hash);
                switchView(linkId);
            });
        }
    });
}

// ==========================================================
// 5. Inventory Management Logic
// ==========================================================
// ==========================================================
// 5. Inventory Management Logic
// ==========================================================
function getCategoryIcon(cat) {
    switch ((cat || '').toLowerCase()) {
        case 'mobiles':
        case 'phone':
            return '<i class="fa-solid fa-mobile-screen text-primary"></i>';
        case 'tvs':
            return '<i class="fa-solid fa-tv text-danger"></i>';
        case 'washing_machines':
            return '<i class="fa-solid fa-soap text-info"></i>';
        case 'audio':
            return '<i class="fa-solid fa-headphones text-purple"></i>';
        case 'chargers':
            return '<i class="fa-solid fa-bolt text-warning"></i>';
        case 'accessories':
        case 'accessory':
            return '<i class="fa-solid fa-shield-halved text-success"></i>';
        default:
            return '<i class="fa-solid fa-box text-secondary"></i>';
    }
}

function renderInventoryTable(items) {
    const tbody = document.getElementById("inventoryTableBody");
    const countBadge = document.getElementById("totalItemsCount");
    if (countBadge) countBadge.textContent = items.length;
    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5 text-muted">
                    <i class="fa-solid fa-box-open fa-3x mb-3 d-block opacity-25"></i>
                    ${t('noInventoryFound', 'No inventory items matched your criteria.')}
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = items.map(item => {
        const purchase = item.purchasePrice || Math.round((item.sellingPrice || item.price || 1000) * 0.75);
        const selling = item.sellingPrice || item.price || 1000;
        const margin = selling - purchase;
        const marginPercent = purchase > 0 ? ((margin / purchase) * 100).toFixed(1) : 0;
        const stockQty = (typeof item.stock === 'number') ? item.stock : 5;

        let statusBadge = '';
        if (stockQty > 2) {
            statusBadge = `<span class="badge-status badge-in-stock"><i class="fa-solid fa-circle-check me-1"></i>${t('statusInStock', 'In Stock')} (${stockQty})</span>`;
        } else if (stockQty > 0) {
            statusBadge = `<span class="badge-status badge-low-stock"><i class="fa-solid fa-triangle-exclamation me-1"></i>${t('statusLowStock', 'Low Stock')} (${stockQty})</span>`;
        } else {
            statusBadge = `<span class="badge-status badge-sold"><i class="fa-solid fa-ban me-1"></i>${t('statusSold', 'Sold Out')}</span>`;
        }

        const fallbackImg = (item.name && item.name.toLowerCase().includes('power bank'))
            ? 'images/products/xiaomi_power_bank.jpg'
            : getAutoProductPhoto(item.category, item.brand, item.name);

        const imgSrc = item.image || fallbackImg;

        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-3 bg-white border p-1 d-flex align-items-center justify-content-center flex-shrink-0 shadow-xs" style="width: 48px; height: 48px;">
                            <img src="${imgSrc}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='images/products/xiaomi_power_bank.jpg'">
                        </div>
                        <div style="min-width: 0;">
                            <div class="fw-bold text-dark text-truncate" style="max-width: 240px;" title="${item.name}">${item.name}</div>
                            <small class="text-muted d-block text-truncate" style="max-width: 240px;">
                                ${getCategoryIcon(item.category)} <span class="ms-1">${item.specs || item.brand}</span>
                            </small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-light text-dark border fw-semibold">${item.brand}</span>
                </td>
                <td>
                    <div class="imei-badge">
                        <span>${item.imei1 || 'BAR-' + (item.id || '000000')}</span>
                        <button class="imei-copy-btn" onclick="copyToClipboard('${item.imei1 || item.id}')" title="Copy Identifier">
                            <i class="fa-regular fa-copy"></i>
                        </button>
                    </div>
                </td>
                <td class="fw-semibold text-secondary">₹${purchase.toLocaleString('en-IN')}</td>
                <td class="fw-bold text-dark">₹${selling.toLocaleString('en-IN')}</td>
                <td>
                    <span class="text-success fw-bold">+₹${margin.toLocaleString('en-IN')}</span>
                    <small class="text-muted d-block font-monospace">(${marginPercent}%)</small>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-light border text-danger" title="Remove from Inventory & Store" onclick="deleteItem('${item.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function normalizeProductToInventory(p) {
    const selling = p.price || p.sellingPrice || 1000;
    const purchase = p.purchasePrice || Math.round(selling * 0.75);
    const stockQty = (typeof p.stock === 'number') ? p.stock : 5;
    return {
        id: p.id || ("prod_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4)),
        name: p.name || "Product",
        brand: p.brand || "General",
        category: p.category || "chargers",
        specs: p.specs || "",
        imei1: p.imei1 || (p.category === "mobiles" ? "860" + Math.floor(100000000000 + Math.random() * 900000000000) : "BAR-" + Math.floor(100000 + Math.random() * 900000)),
        imei2: p.imei2 || "",
        purchasePrice: purchase,
        sellingPrice: selling,
        originalPrice: p.originalPrice || Math.round(selling * 1.25),
        discount: p.discount || "20% OFF",
        rating: p.rating || "4.8",
        reviews: p.reviews || "1",
        emi: p.emi || `₹${Math.round(selling / 6)}/m`,
        stock: stockQty,
        status: p.status || (stockQty > 2 ? "IN_STOCK" : (stockQty > 0 ? "LOW_STOCK" : "OUT_OF_STOCK")),
        image: p.image || getAutoProductPhoto(p.category, p.brand, p.name)
    };
}

function initInventoryTable() {
    // 1. Immediately render current inventory (from products-data.js or localStorage)
    if (!inventory || inventory.length === 0) {
        loadInventoryFromStorage();
    } else {
        renderInventoryTable(inventory);
    }

    // 2. Fetch live products or static products.json (works seamlessly on Netlify!)
    const url = API_BASE ? `${API_BASE}/api/get-products` : 'products.json';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const prods = Array.isArray(data) ? data : (data.products || []);
            if (Array.isArray(prods) && prods.length > 0) {
                inventory = prods.map(p => normalizeProductToInventory(p));
                try {
                    localStorage.setItem('shree_sai_store_products', JSON.stringify(prods));
                } catch(e) {}
                renderInventoryTable(inventory);
            } else {
                loadInventoryFromStorage();
            }
        })
        .catch(() => {
            loadInventoryFromStorage();
        });
}

function loadInventoryFromStorage() {
    try {
        const saved = localStorage.getItem('shree_sai_store_products');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                inventory = parsed.map(p => normalizeProductToInventory(p));
                renderInventoryTable(inventory);
                return;
            }
        }
    } catch(e) {}

    // Fallback directly to central catalog data
    if (typeof window !== 'undefined' && Array.isArray(window.defaultProductsData) && window.defaultProductsData.length > 0) {
        inventory = window.defaultProductsData.map(p => normalizeProductToInventory(p));
        try {
            localStorage.setItem('shree_sai_store_products', JSON.stringify(window.defaultProductsData));
        } catch(e) {}
    }
    renderInventoryTable(inventory);
}

// Listen for cross-tab updates via BroadcastChannel
try {
    const inventoryChannel = new BroadcastChannel('shree_sai_store_channel');
    inventoryChannel.onmessage = (event) => {
        if (event.data?.type === 'PRODUCT_SAVED' || event.data?.type === 'PRODUCT_DELETED') {
            initInventoryTable();
        }
    };
} catch(e) {}

function initSearchAndFilter() {
    const searchInput = document.getElementById("inventorySearch");
    const brandFilter = document.getElementById("brandFilter");
    const categoryTabs = document.querySelectorAll(".category-filter-btn");

    let currentCategory = "ALL";

    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const selectedBrand = brandFilter ? brandFilter.value.toLowerCase() : "all";

        const filtered = inventory.filter(item => {
            const nameStr = (item.name || "").toLowerCase();
            const brandStr = (item.brand || "").toLowerCase();
            const imeiStr = (item.imei1 || "").toLowerCase();
            const catStr = (item.category || "").toLowerCase();

            const matchesSearch = nameStr.includes(query) ||
                                  brandStr.includes(query) ||
                                  imeiStr.includes(query);

            const matchesBrand = (selectedBrand === "all") || (brandStr === selectedBrand) || (selectedBrand === "xiaomi" && brandStr === "mi");
            
            let matchesCategory = (currentCategory === "ALL");
            if (!matchesCategory) {
                const c = currentCategory.toLowerCase();
                if (c === catStr) matchesCategory = true;
                if (c === "mobiles" && (catStr === "phone" || catStr === "mobiles")) matchesCategory = true;
                if (c === "accessories" && (catStr === "accessory" || catStr === "accessories")) matchesCategory = true;
            }

            return matchesSearch && matchesBrand && matchesCategory;
        });

        renderInventoryTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (brandFilter) brandFilter.addEventListener("change", applyFilters);

    categoryTabs.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryTabs.forEach(b => b.classList.remove("active", "btn-primary"));
            categoryTabs.forEach(b => b.classList.add("btn-outline-secondary"));
            btn.classList.add("active", "btn-primary");
            btn.classList.remove("btn-outline-secondary");

            currentCategory = btn.getAttribute("data-category");
            applyFilters();
        });
    });
}

function initStockModal() {
    const purchaseInput = document.getElementById("modalPurchasePrice");
    const sellingInput = document.getElementById("modalSellingPrice");
    const mrpInput = document.getElementById("modalOriginalPrice");
    const form = document.getElementById("addStockForm");

    if (purchaseInput) purchaseInput.addEventListener("input", updateModalMargins);
    if (sellingInput) sellingInput.addEventListener("input", updateModalMargins);
    if (mrpInput) mrpInput.addEventListener("input", updateModalMargins);

    // Initial setup for modal
    updateModalMargins();

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const category = document.getElementById("modalCategory")?.value || "chargers";
            const brandSelect = document.getElementById("modalBrand")?.value || "Xiaomi";
            const customBrand = document.getElementById("modalCustomBrand")?.value?.trim();
            const brand = (brandSelect === "OTHER" && customBrand) ? customBrand : brandSelect;

            const modelName = document.getElementById("modalModelName")?.value?.trim() || "";
            const stockQty = parseInt(document.getElementById("modalStockQuantity")?.value) || 5;
            const specs = document.getElementById("modalSpecs")?.value?.trim() || "";
            
            const purchasePrice = parseFloat(purchaseInput?.value) || 0;
            const sellingPrice = parseFloat(sellingInput?.value) || 0;
            let mrp = parseFloat(mrpInput?.value) || Math.round(sellingPrice * 1.25);
            if (mrp < sellingPrice) mrp = Math.round(sellingPrice * 1.2);

            const discountPercent = Math.round(((mrp - sellingPrice) / mrp) * 100);
            const discountStr = discountPercent > 0 ? `${discountPercent}% OFF` : "Best Deal";

            // Resolve authentic product image
            let imageUrl = document.getElementById("modalProductImage")?.value?.trim();
            if (!imageUrl) {
                imageUrl = getAutoProductPhoto(category, brand, modelName);
            }

            const isPhone = (category === "mobiles");
            const imei1 = isPhone ? (document.getElementById("modalImei1")?.value?.trim() || ("860" + Math.floor(100000000000 + Math.random() * 900000000000))) : ("BAR-" + Math.floor(100000 + Math.random() * 900000));
            const imei2 = isPhone ? (document.getElementById("modalImei2")?.value?.trim() || "") : "";

            const newProduct = {
                id: "prod_" + Date.now(),
                name: modelName,
                category: category,
                brand: brand,
                specs: specs || `${brand} ${modelName}`,
                price: sellingPrice,
                originalPrice: mrp,
                discount: discountStr,
                rating: "4.8",
                reviews: "1,250",
                emi: `₹${Math.round(sellingPrice / 6).toLocaleString('en-IN')}/m`,
                image: imageUrl,
                purchasePrice: purchasePrice,
                sellingPrice: sellingPrice,
                stock: stockQty,
                status: stockQty > 2 ? "IN_STOCK" : (stockQty > 0 ? "LOW_STOCK" : "OUT_OF_STOCK"),
                imei1: imei1,
                imei2: imei2
            };

            // 1. Add to Admin inventory in memory
            inventory.unshift(newProduct);
            renderInventoryTable(inventory);

            // 2. Persist to server backend API (/api/save-product)
            fetch(`${API_BASE}/api/save-product`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            }).then(r => r.json()).then(res => {
                console.log("Server product save response:", res);
            }).catch(err => {
                console.warn("Server save error (offline mode active):", err);
            });

            // 3. Persist to localStorage for zero-latency customer storefront sync
            try {
                let currentStoreProducts = JSON.parse(localStorage.getItem('shree_sai_store_products') || '[]');
                if (!Array.isArray(currentStoreProducts) || currentStoreProducts.length === 0) {
                    currentStoreProducts = [...inventory];
                } else {
                    currentStoreProducts.unshift(newProduct);
                }
                localStorage.setItem('shree_sai_store_products', JSON.stringify(currentStoreProducts));
            } catch(e) {
                console.error("Local storage error:", e);
            }

            // 4. Notify open store tabs via BroadcastChannel
            try {
                const bc = new BroadcastChannel('shree_sai_store_channel');
                bc.postMessage({ type: 'PRODUCT_SAVED', product: newProduct });
            } catch(e) {}

            // Close modal & reset form
            const modalElement = document.getElementById('addStockModal');
            if (modalElement && typeof bootstrap !== 'undefined') {
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();
            }
            form.reset();
            updateModalMargins();

            const successMsg = (currentLang === 'hi')
                ? `सफलता! '${newProduct.name}' इन्वेंटरी में जुड़ गया है और स्टोर में असली फोटो के साथ लाइव हो गया है! ✅`
                : `Success! '${newProduct.name}' added to inventory and published to online store with authentic photo! ✅`;
            alert(successMsg);
        });
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(currentLang === 'hi' ? `IMEI/बारकोड कॉपी हो गया: ${text}` : `Identifier copied to clipboard: ${text}`);
    });
}

function deleteItem(id) {
    const msg = currentLang === 'hi' 
        ? "क्या आप इस आइटम को इन्वेंटरी और ऑनलाइन स्टोर दोनों से हटाना चाहते हैं?" 
        : "Are you sure you want to remove this item from both inventory and online store?";
    if (confirm(msg)) {
        inventory = inventory.filter(item => item.id !== id);
        renderInventoryTable(inventory);

        // Delete from server backend API
        fetch(`${API_BASE}/api/delete-product`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: id })
        }).catch(err => console.warn("Error deleting product from server:", err));

        // Delete from localStorage
        try {
            let currentStoreProducts = JSON.parse(localStorage.getItem('shree_sai_store_products') || '[]');
            currentStoreProducts = currentStoreProducts.filter(p => p.id !== id);
            localStorage.setItem('shree_sai_store_products', JSON.stringify(currentStoreProducts));
        } catch(e) {}

        // Notify open store tabs
        try {
            const bc = new BroadcastChannel('shree_sai_store_channel');
            bc.postMessage({ type: 'PRODUCT_DELETED', productId: id });
        } catch(e) {}
    }
}

// ==========================================================
// 6. Customers CRM & Khata Ledger
// ==========================================================
function saveCustomersLocallyAndServer() {
    try {
        localStorage.setItem('shree_sai_customers_list', JSON.stringify(customers));
    } catch (e) {}
    try {
        fetch(`${API_BASE}/api/save-customers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customers)
        }).catch(() => {});
    } catch (e) {}
}

function renderCustomersTable(items) {
    const tbody = document.getElementById("customersTableBody");
    const countBadge = document.getElementById("totalCustomersCount");
    const totalDueBadge = document.getElementById("totalOutstandingUdhar");

    if (!tbody) return;

    const list = Array.isArray(items) ? items : customers;
    const totalDue = customers.reduce((sum, c) => sum + (Number(c.dueAmount) || 0), 0);
    if (totalDueBadge) totalDueBadge.textContent = `₹${Math.round(totalDue).toLocaleString('en-IN')}`;
    if (countBadge) countBadge.textContent = customers.length;

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5 text-muted">
                    <i class="fa-solid fa-users-slash fa-3x mb-3 d-block opacity-25"></i>
                    <div class="fw-semibold text-dark fs-6">${currentLang === 'hi' ? 'कोई ग्राहक रिकॉर्ड नहीं मिला।' : 'No customer records found.'}</div>
                    <small class="text-muted">${currentLang === 'hi' ? 'POS काउंटर पर उधार बिल बनाएं या ऊपर "नया ग्राहक जोड़ें" पर क्लिक करें।' : 'Create credit/udhar bills at POS or click "Add New Customer" above.'}</small>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = list.map(c => {
        const due = Number(c.dueAmount) || 0;
        const purchases = Number(c.totalPurchases) || 0;
        const limit = Number(c.creditLimit) || 50000;
        const hasDue = due > 0;
        const statusBadge = hasDue 
            ? `<span class="badge bg-danger">₹${due.toLocaleString('en-IN')} ${t('statusDue', 'Due')}</span>` 
            : `<span class="badge bg-success">${t('statusClear', 'Settled / Clear')}</span>`;

        return `
            <tr>
                <td>
                    <div class="fw-bold text-dark">${escapeHtml(c.name || 'Customer')}</div>
                    <small class="text-muted">Limit: ₹${limit.toLocaleString('en-IN')}</small>
                </td>
                <td>
                    <span class="font-monospace fw-semibold text-dark">${escapeHtml(c.phone || '-')}</span>
                </td>
                <td class="text-muted">${escapeHtml(c.address || 'Jalgaon')}</td>
                <td class="fw-bold">₹${purchases.toLocaleString('en-IN')}</td>
                <td>
                    <span class="fw-bold ${hasDue ? 'text-danger fs-6' : 'text-success'}">
                        ₹${due.toLocaleString('en-IN')}
                    </span>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="d-flex gap-2">
                        ${hasDue ? `
                            <button class="btn btn-sm btn-success" onclick="openPayUdharModal('${escapeHtml(c.id)}')" title="Record Due Payment">
                                <i class="fa-solid fa-hand-holding-dollar me-1"></i>${t('payBtn', 'Pay')}
                            </button>
                            <button class="btn btn-sm btn-outline-success" onclick="sendWhatsAppReminder('${escapeHtml(c.phone)}', '${escapeHtml(c.name)}', ${due})" title="Send WhatsApp Reminder">
                                <i class="fa-brands fa-whatsapp"></i>
                            </button>
                        ` : `
                            <span class="text-muted small">${t('noBalance', 'No Balance')}</span>
                        `}
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function syncCustomersFromPosInvoices() {
    let invoices = [];
    try {
        invoices = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
    } catch (e) {
        invoices = [];
    }

    // Always sanitize in-memory customers list
    customers.forEach(c => {
        if (c) {
            c.dueAmount = Number(c.dueAmount) || 0;
            c.totalPurchases = Number(c.totalPurchases) || 0;
            c.creditLimit = Number(c.creditLimit) || 50000;
            if (!Array.isArray(c.billedInvoiceIds)) c.billedInvoiceIds = [];
        }
    });

    if (!Array.isArray(invoices) || invoices.length === 0) {
        renderCustomersTable(customers);
        return;
    }

    let updated = false;
    // Process invoices in chronological order (oldest to newest)
    const reversedInvoices = invoices.slice().reverse();

    reversedInvoices.forEach(inv => {
        if (!inv || !inv.invNumber) return;
        const phone = (inv.custPhone || '').trim();
        const name = (inv.custName || '').trim();
        if (!phone && !name) return;

        const amount = Number(inv.finalAmount) || 0;
        const isUdhar = String(inv.mode || '').toUpperCase() === 'UDHAR';

        let cust = customers.find(c => {
            const phoneMatch = phone && c.phone && c.phone.trim() === phone;
            const nameMatch = name && c.name && c.name.trim().toLowerCase() === name.toLowerCase();
            return phoneMatch || nameMatch;
        });

        if (!cust) {
            cust = {
                id: "c_" + (phone ? phone.slice(-6) : Date.now()) + "_" + Math.floor(Math.random() * 1000),
                name: name || "Customer",
                phone: phone || "-",
                address: "Jalgaon Local Counter",
                totalPurchases: amount,
                dueAmount: isUdhar ? amount : 0,
                creditLimit: Math.max(50000, (isUdhar ? amount : 0) * 1.5),
                billedInvoiceIds: [inv.invNumber]
            };
            customers.push(cust);
            updated = true;
        } else {
            cust.dueAmount = Number(cust.dueAmount) || 0;
            cust.totalPurchases = Number(cust.totalPurchases) || 0;
            cust.creditLimit = Number(cust.creditLimit) || 50000;
            if (!Array.isArray(cust.billedInvoiceIds)) {
                cust.billedInvoiceIds = [];
            }
            if (!cust.billedInvoiceIds.includes(inv.invNumber)) {
                cust.billedInvoiceIds.push(inv.invNumber);
                cust.totalPurchases += amount;
                if (isUdhar) {
                    cust.dueAmount += amount;
                    cust.creditLimit = Math.max(cust.creditLimit, cust.dueAmount * 1.5);
                }
                updated = true;
            }
        }
    });

    if (updated) {
        saveCustomersLocallyAndServer();
    }
    renderCustomersTable(customers);
}

async function loadCustomersFromServer() {
    try {
        const res = await fetch(`${API_BASE}/api/get-customers`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.customers) && data.customers.length > 0) {
            let local = [];
            try {
                local = JSON.parse(localStorage.getItem('shree_sai_customers_list') || '[]');
            } catch (e) {}

            const custMap = new Map();
            data.customers.forEach(c => {
                if (c && (c.phone || c.name)) {
                    const key = (c.phone || c.name).trim().toLowerCase();
                    custMap.set(key, c);
                }
            });
            local.forEach(c => {
                if (c && (c.phone || c.name)) {
                    const key = (c.phone || c.name).trim().toLowerCase();
                    if (!custMap.has(key)) {
                        custMap.set(key, c);
                    } else {
                        const existing = custMap.get(key);
                        existing.dueAmount = Math.max(Number(existing.dueAmount) || 0, Number(c.dueAmount) || 0);
                        existing.totalPurchases = Math.max(Number(existing.totalPurchases) || 0, Number(c.totalPurchases) || 0);
                        if (Array.isArray(c.billedInvoiceIds)) {
                            if (!Array.isArray(existing.billedInvoiceIds)) existing.billedInvoiceIds = [];
                            c.billedInvoiceIds.forEach(id => {
                                if (!existing.billedInvoiceIds.includes(id)) existing.billedInvoiceIds.push(id);
                            });
                        }
                    }
                }
            });

            customers = Array.from(custMap.values());
            saveCustomersLocallyAndServer();
            syncCustomersFromPosInvoices();
        }
    } catch (e) {
        // Fallback to local storage
    }
}

function initCustomersView() {
    syncCustomersFromPosInvoices();
    loadCustomersFromServer();

    const searchInput = document.getElementById("customerSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const q = searchInput.value.toLowerCase().trim();
            const filtered = customers.filter(c => 
                (c.name && c.name.toLowerCase().includes(q)) || (c.phone && c.phone.includes(q))
            );
            renderCustomersTable(filtered);
        });
    }

    const filterBtns = document.querySelectorAll(".customer-filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => {
                b.classList.remove("active");
                if (b.dataset.filter === 'ALL') { b.className = "btn btn-outline-primary btn-sm customer-filter-btn"; }
                else if (b.dataset.filter === 'DUE') { b.className = "btn btn-outline-danger btn-sm customer-filter-btn"; }
                else { b.className = "btn btn-outline-success btn-sm customer-filter-btn"; }
            });

            btn.classList.add("active");
            if (btn.dataset.filter === 'ALL') btn.className = "btn btn-primary btn-sm customer-filter-btn active";
            if (btn.dataset.filter === 'DUE') btn.className = "btn btn-danger btn-sm customer-filter-btn active";
            if (btn.dataset.filter === 'CLEAR') btn.className = "btn btn-success btn-sm customer-filter-btn active";

            const filter = btn.dataset.filter;
            if (filter === 'DUE') {
                renderCustomersTable(customers.filter(c => (Number(c.dueAmount) || 0) > 0));
            } else if (filter === 'CLEAR') {
                renderCustomersTable(customers.filter(c => (Number(c.dueAmount) || 0) === 0));
            } else {
                renderCustomersTable(customers);
            }
        });
    });

    const addCustForm = document.getElementById("addCustomerForm");
    if (addCustForm) {
        addCustForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const newCust = {
                id: "c_" + Date.now(),
                name: (document.getElementById("custNameInput")?.value || "").trim(),
                phone: (document.getElementById("custPhoneInput")?.value || "").trim(),
                address: (document.getElementById("custAddressInput")?.value || "").trim() || "Jalgaon Local Counter",
                totalPurchases: 0,
                dueAmount: 0,
                creditLimit: parseFloat(document.getElementById("custCreditLimitInput")?.value) || 50000,
                billedInvoiceIds: []
            };
            customers.unshift(newCust);
            saveCustomersLocallyAndServer();
            renderCustomersTable(customers);

            const modalEl = document.getElementById("addCustomerModal");
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }
            addCustForm.reset();
            alert(currentLang === 'hi' ? `नया ग्राहक '${newCust.name}' खाता में जुड़ गया है!` : `Customer record '${newCust.name}' successfully created!`);
        });
    }

    const payUdharForm = document.getElementById("payUdharForm");
    if (payUdharForm) {
        payUdharForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const custId = document.getElementById("payUdharCustId").value;
            const amount = parseFloat(document.getElementById("payUdharAmountInput").value) || 0;
            const cust = customers.find(c => c.id === custId);

            if (cust) {
                const currentDue = Number(cust.dueAmount) || 0;
                if (amount <= 0) {
                    alert(currentLang === 'hi' ? "कृपया वैध भुगतान राशि दर्ज करें!" : "Please enter a valid payment amount!");
                    return;
                }
                if (amount > currentDue) {
                    alert(currentLang === 'hi' ? "जमा राशि बाकी उधारी से अधिक नहीं हो सकती!" : "Payment amount cannot exceed outstanding balance!");
                    return;
                }
                cust.dueAmount = Math.max(0, currentDue - amount);
                saveCustomersLocallyAndServer();
                renderCustomersTable(customers);

                const modalEl = document.getElementById("payUdharModal");
                if (modalEl) {
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                }
                alert(currentLang === 'hi' 
                    ? `सफलतापूर्वक ₹${amount.toLocaleString('en-IN')} जमा हुए! ${cust.name} का शेष बकाया: ₹${cust.dueAmount.toLocaleString('en-IN')}`
                    : `Payment of ₹${amount.toLocaleString('en-IN')} recorded! ${cust.name}'s remaining balance: ₹${cust.dueAmount.toLocaleString('en-IN')}`);
            }
        });
    }
}

function openPayUdharModal(custId) {
    const cust = customers.find(c => c.id === custId);
    if (!cust) return;

    const due = Number(cust.dueAmount) || 0;
    const idInput = document.getElementById("payUdharCustId");
    const nameSpan = document.getElementById("payUdharCustName");
    const dueSpan = document.getElementById("payUdharCurrentDue");
    const amtInput = document.getElementById("payUdharAmountInput");

    if (idInput) idInput.value = cust.id;
    if (nameSpan) nameSpan.textContent = `${cust.name || 'Customer'} (${cust.phone || '-'})`;
    if (dueSpan) dueSpan.textContent = `₹${due.toLocaleString('en-IN')}`;
    if (amtInput) {
        amtInput.value = due;
        amtInput.max = due;
    }

    const modalEl = document.getElementById("payUdharModal");
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
}

function sendWhatsAppReminder(phone, name, amount) {
    let text = "";
    const cleanPhone = (phone || "").replace(/[^0-9]/g, '').slice(-10);
    const amtStr = Number(amount || 0).toLocaleString('en-IN');
    if (currentLang === 'hi') {
        text = encodeURIComponent(`नमस्ते ${name} जी 🙏,\n\nश्री साई मोबाइल शॉप पर आपकी ₹${amtStr} की उधारी बकाया है।\nकृपया समय पर भुगतान करें।\n\n- देवेंद्र कोली (श्री साई मोबाइल शॉप)\nसंपर्क: 7972296879`);
    } else {
        text = encodeURIComponent(`Dear ${name},\n\nGreetings from Shree Sai Mobile Shop! 🙏\nThis is a polite reminder regarding your pending balance of ₹${amtStr}.\nKindly settle the dues at your earliest convenience.\n\nThank you,\nDevendra Koli (Owner, Shree Sai Mobile Shop)\nContact: 7972296879`);
    }
    const url = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${text}`;
    window.open(url, '_blank');
}

// ==========================================================
// 7. Repair & Service Center Logic
// ==========================================================
function renderRepairsTable(items) {
    const tbody = document.getElementById("repairsTableBody");
    const badge = document.getElementById("activeRepairsBadge");
    if (!tbody) return;

    const activeCount = repairs.filter(r => r.status !== 'DELIVERED').length;
    if (badge) badge.textContent = activeCount;

    document.getElementById("repairCountTotal").textContent = repairs.length;
    document.getElementById("repairCountInProgress").textContent = repairs.filter(r => r.status === 'INSPECTING').length;
    document.getElementById("repairCountReady").textContent = repairs.filter(r => r.status === 'READY').length;
    document.getElementById("repairCountDelivered").textContent = repairs.filter(r => r.status === 'DELIVERED').length;

    tbody.innerHTML = items.map(r => {
        let statusBadge = '';
        if (r.status === 'READY') {
            statusBadge = `<span class="badge bg-success py-2 px-3"><i class="fa-solid fa-check-circle me-1"></i>${t('statusReady', 'Ready for Delivery')}</span>`;
        } else if (r.status === 'INSPECTING') {
            statusBadge = `<span class="badge bg-warning text-dark py-2 px-3"><i class="fa-solid fa-gears me-1"></i>${t('statusInspecting', 'Under Inspection')}</span>`;
        } else if (r.status === 'RECEIVED') {
            statusBadge = `<span class="badge bg-info py-2 px-3">${t('statusReceived', 'Received')}</span>`;
        } else {
            statusBadge = `<span class="badge bg-secondary py-2 px-3">${t('statusDelivered', 'Delivered')}</span>`;
        }

        return `
            <tr>
                <td>
                    <span class="badge bg-light text-primary border font-monospace fs-6">${r.jobNo}</span>
                </td>
                <td>
                    <div class="fw-bold">${r.custName}</div>
                    <small class="text-muted">${r.phone}</small>
                </td>
                <td>
                    <span class="fw-semibold text-dark">${r.model}</span>
                </td>
                <td>
                    <span class="text-secondary small d-block" style="max-width: 200px;">${r.fault}</span>
                </td>
                <td>
                    <code class="bg-light px-2 py-1 border rounded text-dark">${r.pattern || 'None'}</code>
                </td>
                <td>
                    <div class="fw-bold">₹${r.estimate}</div>
                    <small class="text-success">${t('advancePrefix', 'Advance:')} ₹${r.advance}</small>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="d-flex gap-1">
                        ${r.status !== 'DELIVERED' ? `
                            <button class="btn btn-sm btn-outline-success" onclick="markRepairReady('${r.id}')" title="Mark as Ready">
                                <i class="fa-solid fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-primary" onclick="markRepairDelivered('${r.id}')" title="Mark as Delivered">
                                <i class="fa-solid fa-box"></i>
                            </button>
                        ` : `
                            <span class="text-muted small">${t('completed', 'Completed')}</span>
                        `}
                        <button class="btn btn-sm btn-light border" onclick="alert('Printing Job Sheet Token #${r.jobNo}...')" title="Print Token">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function initRepairsView() {
    renderRepairsTable(repairs);

    const form = document.getElementById("newRepairForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const newJob = {
                id: "r_" + Date.now(),
                jobNo: "SSM-JOB-" + (repairs.length + 101),
                custName: document.getElementById("repairCustName").value,
                phone: document.getElementById("repairCustPhone").value,
                model: document.getElementById("repairModel").value,
                fault: document.getElementById("repairFault").value,
                pattern: document.getElementById("repairPattern").value || "None",
                estimate: parseFloat(document.getElementById("repairEstimate").value) || 0,
                advance: parseFloat(document.getElementById("repairAdvance").value) || 0,
                status: "INSPECTING"
            };

            repairs.unshift(newJob);
            renderRepairsTable(repairs);

            const modal = bootstrap.Modal.getInstance(document.getElementById("newRepairModal"));
            if (modal) modal.hide();
            form.reset();
            alert(currentLang === 'hi' ? `जॉब शीट #${newJob.jobNo} दर्ज हो गई!` : `Job Sheet #${newJob.jobNo} created successfully!`);
        });
    }
}

function markRepairReady(id) {
    const r = repairs.find(job => job.id === id);
    if (r) {
        r.status = 'READY';
        renderRepairsTable(repairs);
        alert(currentLang === 'hi' 
            ? `जॉब #${r.jobNo} (${r.model}) तैयार मार्क हो गया!`
            : `Job #${r.jobNo} (${r.model}) is now marked as Ready.`);
    }
}

function markRepairDelivered(id) {
    const r = repairs.find(job => job.id === id);
    if (r) {
        r.status = 'DELIVERED';
        renderRepairsTable(repairs);
        alert(currentLang === 'hi' 
            ? `जॉब #${r.jobNo} ग्राहक को डिलीवर मार्क हो गया!`
            : `Job #${r.jobNo} marked as Delivered to customer.`);
    }
}

// ==========================================================
// 8. POS Fast Billing Engine
// ==========================================================
function initPosBilling() {
    const barcodeInput = document.getElementById("posBarcodeScanInput");
    const discountInput = document.getElementById("posDiscountInput");
    const exchangeInput = document.getElementById("posExchangeInput");

    if (barcodeInput) {
        barcodeInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handlePosBarcodeSubmit();
            }
        });
    }

    if (discountInput) discountInput.addEventListener("input", updatePosTotals);
    if (exchangeInput) exchangeInput.addEventListener("input", updatePosTotals);
    if (typeof renderPosInvoicesHistory === "function") renderPosInvoicesHistory();
    if (typeof loadPosInvoicesFromServer === "function") loadPosInvoicesFromServer();
}

let currentActivePosInvoice = null;

function quickAddImeiToPos(imei) {
    const input = document.getElementById("posBarcodeScanInput");
    if (input) {
        input.value = imei;
        handlePosBarcodeSubmit();
    }
}

function openPosStockPickerModal() {
    const modalEl = document.getElementById("posStockPickerModal");
    if (!modalEl) return;
    
    // Ensure inventory has items
    if (!inventory || inventory.length === 0) {
        loadInventoryFromStorage();
    }

    const searchInput = document.getElementById("posPickerSearchInput");
    if (searchInput) searchInput.value = "";
    
    renderPosStockPickerTable(inventory);
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
}

function filterPosStockPicker(query) {
    const q = (query || "").toLowerCase().trim();
    if (!q) {
        renderPosStockPickerTable(inventory);
        return;
    }
    const filtered = inventory.filter(item => {
        const name = (item.name || "").toLowerCase();
        const brand = (item.brand || "").toLowerCase();
        const imei = (item.imei1 || "").toLowerCase();
        const cat = (item.category || "").toLowerCase();
        return name.includes(q) || brand.includes(q) || imei.includes(q) || cat.includes(q);
    });
    renderPosStockPickerTable(filtered);
}

function renderPosStockPickerTable(items) {
    const tbody = document.getElementById("posStockPickerTableBody");
    if (!tbody) return;

    if (!items || items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">
                    <i class="fa-solid fa-box-open fa-2x mb-2 d-block opacity-25"></i>
                    ${currentLang === 'hi' ? 'कोई स्टॉक आइटम नहीं मिला।' : 'No matching stock items found.'}
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = items.map(item => {
        const price = item.sellingPrice || item.price || 1000;
        const imei = item.imei1 || ('BAR-' + item.id);
        const stockQty = (typeof item.stock === 'number') ? item.stock : 5;
        const isSold = item.status === 'SOLD' || stockQty <= 0;

        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <img src="${item.image || 'images/products/xiaomi_power_bank.jpg'}" alt="${item.name}" style="width: 36px; height: 36px; object-fit: contain;" class="rounded border p-1 bg-white flex-shrink-0" onerror="this.src='images/products/xiaomi_power_bank.jpg'">
                        <div>
                            <div class="fw-bold text-dark small text-truncate" style="max-width: 220px;" title="${item.name}">${item.name}</div>
                            <small class="text-muted">${item.category || 'General'}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-light text-dark border small">${item.brand || 'General'}</span></td>
                <td><code class="bg-light px-2 py-1 border rounded text-dark small">${imei}</code></td>
                <td class="fw-bold text-dark">₹${price.toLocaleString('en-IN')}</td>
                <td>
                    ${isSold 
                        ? `<span class="badge bg-danger-subtle text-danger border border-danger-subtle">Sold Out</span>` 
                        : `<span class="badge bg-success-subtle text-success border border-success-subtle">Stock (${stockQty})</span>`
                    }
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-primary-custom py-1 px-3 fw-semibold" onclick="addStockItemToPosCart('${item.id}')" ${isSold ? 'disabled' : ''}>
                        <i class="fa-solid fa-cart-plus me-1"></i> ${currentLang === 'hi' ? 'जोड़ें' : 'Add'}
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function addStockItemToPosCart(itemId) {
    let found = inventory.find(i => String(i.id) === String(itemId));
    if (!found) {
        try {
            const stored = JSON.parse(localStorage.getItem('shree_sai_store_products') || '[]');
            found = stored.find(i => String(i.id) === String(itemId));
            if (found) found = normalizeProductToInventory(found);
        } catch (e) {}
    }

    if (!found) {
        alert(currentLang === 'hi' ? "उत्पाद विवरण नहीं मिला!" : "Product not found in stock!");
        return;
    }

    const price = found.sellingPrice || found.price || 1000;
    const imei = found.imei1 || ('BAR-' + found.id);

    posCart.push({
        id: found.id,
        name: found.name,
        imei1: imei,
        price: price,
        gstRate: 18,
        quantity: 1
    });

    renderPosCart();

    // Close modal
    const modalEl = document.getElementById("posStockPickerModal");
    if (modalEl) {
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
    }
}

function handlePosBarcodeSubmit() {
    const input = document.getElementById("posBarcodeScanInput");
    if (!input) return;
    const query = input.value.trim();
    if (!query) {
        alert(currentLang === 'hi' ? "कृपया कोई 15-अंकों का IMEI नंबर, बारकोड या मॉडल नाम दर्ज करें!" : "Please enter or scan a 15-digit IMEI, barcode, or model name.");
        return;
    }

    const qLower = query.toLowerCase();

    // 1. Exact or partial IMEI / barcode / ID match
    let foundItem = inventory.find(item => 
        (item.imei1 && (item.imei1 === query || item.imei1.toLowerCase().includes(qLower))) ||
        (item.imei2 && (item.imei2 === query || item.imei2.toLowerCase().includes(qLower))) ||
        (String(item.id) === query)
    );

    // 2. Search by Product Name or Brand
    if (!foundItem) {
        foundItem = inventory.find(item => 
            (item.name && item.name.toLowerCase().includes(qLower)) ||
            (item.brand && item.brand.toLowerCase() === qLower)
        );
    }

    // 3. Fallback search from localStorage store products
    if (!foundItem) {
        try {
            const stored = JSON.parse(localStorage.getItem('shree_sai_store_products') || '[]');
            const matchedStored = stored.find(p => 
                (p.imei1 && (p.imei1 === query || p.imei1.toLowerCase().includes(qLower))) ||
                (p.name && p.name.toLowerCase().includes(qLower)) ||
                (String(p.id) === query)
            );
            if (matchedStored) {
                foundItem = normalizeProductToInventory(matchedStored);
            }
        } catch (e) {}
    }

    if (foundItem) {
        const price = foundItem.sellingPrice || foundItem.price || 1000;
        const imei = foundItem.imei1 || ('BAR-' + foundItem.id);

        posCart.push({
            id: foundItem.id,
            name: foundItem.name,
            imei1: imei,
            price: price,
            gstRate: 18,
            quantity: 1
        });

        input.value = "";
        renderPosCart();
        return;
    }

    // If item was NOT found in inventory, don't just throw a blocking dead end!
    // Provide a smart prompt to either quick-add this new item on the spot or pick from stock.
    const promptMsg = currentLang === 'hi'
        ? `स्कैन किया गया कोड/IMEI '${query}' वर्तमान स्टॉक में नहीं मिला।\n\nक्या आप इसे तुरंत 'नया आइटम' बनाकर बिल में जोड़ना चाहते हैं?\n• OK दबाएं = नया आइटम नाम व रेट डालकर जोड़ें\n• Cancel दबाएं = उपलब्ध स्टॉक में से चुनें`
        : `The code/IMEI '${query}' was not found in active inventory.\n\nDo you want to quick-bill it as a new on-the-spot item?\n• Click OK = Enter Name & Selling Price\n• Click Cancel = Select from available stock`;

    if (confirm(promptMsg)) {
        const defaultName = isNaN(query) ? query : `Smartphone / Electronics (${query.slice(-4)})`;
        const customName = prompt(
            currentLang === 'hi' ? "आइटम का नाम / मॉडल दर्ज करें:" : "Enter Item / Model Name:",
            defaultName
        );
        if (customName) {
            const customPriceStr = prompt(
                currentLang === 'hi' ? "विक्रय मूल्य (Selling Price ₹) दर्ज करें:" : "Enter Selling Price (₹):",
                "15000"
            );
            const customPrice = parseFloat(customPriceStr) || 15000;
            posCart.push({
                id: "pos_custom_" + Date.now(),
                name: customName,
                imei1: query,
                price: customPrice,
                gstRate: 18,
                quantity: 1
            });
            input.value = "";
            renderPosCart();
        }
    } else {
        openPosStockPickerModal();
    }
}

function renderPosCart() {
    const tbody = document.getElementById("posCartTableBody");
    const badge = document.getElementById("posItemsBadge");
    if (!tbody) return;

    if (badge) badge.textContent = `${posCart.length} ${currentLang === 'hi' ? 'आइटम्स' : 'Items'}`;

    if (posCart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5 text-muted">
                    <i class="fa-solid fa-cart-shopping fa-3x mb-3 d-block opacity-25"></i>
                    ${t('cartEmpty', 'Cart is currently empty. Scan an IMEI above.')}
                </td>
            </tr>
        `;
        updatePosTotals();
        return;
    }

    tbody.innerHTML = posCart.map((item, idx) => {
        const taxable = (item.price / 1.18);
        const gst = item.price - taxable;

        return `
            <tr>
                <td>
                    <div class="fw-bold">${item.name}</div>
                </td>
                <td>
                    <code class="bg-light px-2 py-1 border rounded text-dark">${item.imei1}</code>
                </td>
                <td>₹${taxable.toFixed(2)}</td>
                <td><span class="badge bg-light text-dark border">18% (₹${gst.toFixed(2)})</span></td>
                <td class="fw-bold text-dark">₹${item.price.toLocaleString('en-IN')}</td>
                <td>
                    <button class="btn btn-sm btn-light text-danger border" onclick="removeFromPosCart(${idx})" title="Remove">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    updatePosTotals();
}

function updatePosTotals() {
    const subtotalEl = document.getElementById("posSubtotal");
    const gstEl = document.getElementById("posGst");
    const grandTotalEl = document.getElementById("posGrandTotal");
    const discount = parseFloat(document.getElementById("posDiscountInput")?.value) || 0;
    const exchange = parseFloat(document.getElementById("posExchangeInput")?.value) || 0;

    const grossTotal = posCart.reduce((sum, item) => sum + item.price, 0);
    const taxableTotal = grossTotal / 1.18;
    const gstTotal = grossTotal - taxableTotal;

    let finalAmount = grossTotal - discount - exchange;
    if (finalAmount < 0) finalAmount = 0;

    if (subtotalEl) subtotalEl.textContent = `₹${taxableTotal.toFixed(2)}`;
    if (gstEl) gstEl.textContent = `₹${gstTotal.toFixed(2)}`;
    if (grandTotalEl) grandTotalEl.textContent = `₹${Math.round(finalAmount).toLocaleString('en-IN')}`;
}

function removeFromPosCart(index) {
    posCart.splice(index, 1);
    renderPosCart();
}

function clearPosCart() {
    posCart = [];
    renderPosCart();
}

function generateAndPrintBill() {
    if (posCart.length === 0) {
        alert(currentLang === 'hi' ? "कार्ट खाली है! पहले बारकोड या IMEI स्कैन करें या 'स्टॉक से चुनें' पर क्लिक करें।" : "Cart is empty! Please scan an IMEI or choose 'Select from Stock'.");
        return;
    }

    const custName = document.getElementById("posCustomerName")?.value.trim() || (currentLang === 'hi' ? "नकद ग्राहक (Walk-in)" : "Walk-in Customer");
    const custPhone = document.getElementById("posCustomerPhone")?.value.trim() || "9829102938";
    const mode = document.getElementById("posPaymentMode")?.value || "CASH";
    const discount = parseFloat(document.getElementById("posDiscountInput")?.value) || 0;
    const exchange = parseFloat(document.getElementById("posExchangeInput")?.value) || 0;

    const grossTotal = posCart.reduce((sum, item) => sum + item.price, 0);
    const taxableTotal = grossTotal / 1.18;
    const gstTotal = grossTotal - taxableTotal;
    const cgst = gstTotal / 2;
    const sgst = gstTotal / 2;
    const finalAmount = Math.max(0, Math.round(grossTotal - discount - exchange));

    // Generate Invoice Number
    let invSeq = parseInt(localStorage.getItem('shree_sai_inv_seq') || '1001', 10);
    const invNumber = `SSM-2026-INV-${invSeq}`;
    localStorage.setItem('shree_sai_inv_seq', (invSeq + 1).toString());

    // Current Date & Time
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + 
        ", " + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Store active invoice object
    currentActivePosInvoice = {
        invNumber,
        dateTime: dateFormatted,
        custName,
        custPhone,
        mode,
        items: JSON.parse(JSON.stringify(posCart)),
        grossTotal,
        taxableTotal,
        gstTotal,
        cgst,
        sgst,
        discount: discount + exchange,
        finalAmount
    };

    // Save to local POS invoice history (permanent until deleted)
    try {
        const history = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
        // Prevent duplicates
        const filtered = history.filter(h => h.invNumber !== currentActivePosInvoice.invNumber);
        filtered.unshift(currentActivePosInvoice);
        localStorage.setItem('shree_sai_pos_invoices', JSON.stringify(filtered));
    } catch (e) {}

    // Permanently sync bill to server pos_invoices.json
    try {
        fetch(`${API_BASE}/api/save-pos-invoice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentActivePosInvoice)
        }).catch(() => {});
    } catch (e) {}

    // Populate Modal Elements & Update History UI
    populatePosInvoiceModal(currentActivePosInvoice);
    renderPosInvoicesHistory();
    if (typeof syncCustomersFromPosInvoices === "function") {
        syncCustomersFromPosInvoices();
    }
    if (typeof renderReportsView === "function") {
        renderReportsView();
    }
    if (typeof updateDashboardMetrics === "function") {
        updateDashboardMetrics();
    }

    // Mark items as sold or reduce inventory stock
    posCart.forEach(cartItem => {
        const invItem = inventory.find(i => String(i.id) === String(cartItem.id) || i.imei1 === cartItem.imei1);
        if (invItem) {
            if (typeof invItem.stock === 'number' && invItem.stock > 1) {
                invItem.stock -= 1;
            } else {
                invItem.status = 'SOLD';
                invItem.stock = 0;
            }
        }
    });
    renderInventoryTable(inventory);

    // Clear POS cart
    clearPosCart();

    // Show Invoice Modal
    const modalEl = document.getElementById("posInvoiceModal");
    if (modalEl) {
        const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
        bsModal.show();
    }
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function populatePosInvoiceModal(inv) {
    if (!inv) return;
    currentActivePosInvoice = inv;

    const invModalNumber = document.getElementById("invModalNumber");
    const invModalDateTime = document.getElementById("invModalDateTime");
    const invModalCustName = document.getElementById("invModalCustName");
    const invModalCustPhone = document.getElementById("invModalCustPhone");
    const invModalPayMode = document.getElementById("invModalPayMode");
    const invModalItemsRows = document.getElementById("invModalItemsRows");
    const invModalTaxable = document.getElementById("invModalTaxable");
    const invModalCgst = document.getElementById("invModalCgst");
    const invModalSgst = document.getElementById("invModalSgst");
    const invModalDiscountRow = document.getElementById("invModalDiscountRow");
    const invModalDiscount = document.getElementById("invModalDiscount");
    const invModalGrandTotal = document.getElementById("invModalGrandTotal");

    if (invModalNumber) invModalNumber.textContent = inv.invNumber || 'N/A';
    if (invModalDateTime) invModalDateTime.textContent = inv.dateTime || '';
    if (invModalCustName) invModalCustName.textContent = inv.custName || 'Walk-in';
    if (invModalCustPhone) invModalCustPhone.textContent = inv.custPhone || 'N/A';
    if (invModalPayMode) {
        const mode = inv.mode || 'CASH';
        invModalPayMode.textContent = mode;
        invModalPayMode.className = (mode === 'CASH' || mode === 'UPI') 
            ? "badge bg-success-subtle text-success border border-success-subtle fw-bold" 
            : "badge bg-primary-subtle text-primary border border-primary-subtle fw-bold";
    }

    if (invModalItemsRows) {
        const items = inv.items || [];
        invModalItemsRows.innerHTML = items.map((item, idx) => {
            const itemPrice = item.price || 0;
            const itemQty = item.quantity || 1;
            const itemTaxable = itemPrice / 1.18;
            const itemGst = itemPrice - itemTaxable;
            return `
                <tr>
                    <td class="text-center">${idx + 1}</td>
                    <td>
                        <div class="fw-bold text-dark">${escapeHtml(item.name || 'Product')}</div>
                        <small class="text-muted">IMEI/SN: <code class="bg-light px-1 border rounded text-dark">${escapeHtml(item.imei1 || 'N/A')}</code></small>
                    </td>
                    <td class="text-center">${itemQty}</td>
                    <td class="text-end">₹${itemPrice.toLocaleString('en-IN')}</td>
                    <td class="text-end">₹${itemTaxable.toFixed(2)}</td>
                    <td class="text-end">₹${itemGst.toFixed(2)}</td>
                    <td class="text-end fw-bold text-dark">₹${itemPrice.toLocaleString('en-IN')}</td>
                </tr>
            `;
        }).join("");
    }

    const taxable = inv.taxableTotal != null ? inv.taxableTotal : ((inv.finalAmount || 0) / 1.18);
    const cgst = inv.cgst != null ? inv.cgst : (inv.gstTotal ? inv.gstTotal / 2 : 0);
    const sgst = inv.sgst != null ? inv.sgst : (inv.gstTotal ? inv.gstTotal / 2 : 0);

    if (invModalTaxable) invModalTaxable.textContent = `₹${taxable.toFixed(2)}`;
    if (invModalCgst) invModalCgst.textContent = `₹${cgst.toFixed(2)}`;
    if (invModalSgst) invModalSgst.textContent = `₹${sgst.toFixed(2)}`;

    const totalDisc = inv.discount || 0;
    if (invModalDiscountRow && invModalDiscount) {
        if (totalDisc > 0) {
            invModalDiscountRow.style.display = "flex";
            invModalDiscount.textContent = `-₹${totalDisc.toLocaleString('en-IN')}`;
        } else {
            invModalDiscountRow.style.display = "none";
        }
    }

    if (invModalGrandTotal) invModalGrandTotal.textContent = `₹${(inv.finalAmount || 0).toLocaleString('en-IN')}`;
}

function viewPastPosInvoice(invNumber) {
    try {
        const history = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
        const inv = history.find(b => b.invNumber === invNumber);
        if (!inv) {
            alert(currentLang === 'hi' ? "बिल नहीं मिला!" : "Invoice not found!");
            return;
        }
        populatePosInvoiceModal(inv);
        const modalEl = document.getElementById("posInvoiceModal");
        if (modalEl) {
            const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
            bsModal.show();
        }
    } catch (e) {
        console.error("Error opening past invoice:", e);
    }
}

function sendPastPosInvoiceWhatsApp(invNumber) {
    try {
        const history = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
        const inv = history.find(b => b.invNumber === invNumber);
        if (!inv) return;
        currentActivePosInvoice = inv;
        sendPosInvoiceWhatsApp();
    } catch (e) {}
}

function filterPosInvoices(query) {
    renderPosInvoicesHistory(query);
}

async function deletePosInvoice(invNumber) {
    if (!invNumber) return;
    const confirmMsg = currentLang === 'hi'
        ? `क्या आप वाकई बिल #${invNumber} को हमेशा के लिए हटाना (Delete) चाहते हैं?\n(यह बिल इतिहास से स्थायी रूप से मिट जाएगा)`
        : `Are you sure you want to permanently delete Invoice #${invNumber}?\n(This will be removed permanently from billing history)`;
    
    if (!confirm(confirmMsg)) return;

    try {
        let history = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
        const targetInv = history.find(inv => inv.invNumber === invNumber);
        history = history.filter(inv => inv.invNumber !== invNumber);
        localStorage.setItem('shree_sai_pos_invoices', JSON.stringify(history));
        renderPosInvoicesHistory();
        if (typeof renderReportsView === "function") renderReportsView();
        if (typeof updateDashboardMetrics === "function") updateDashboardMetrics();

        // Also adjust customer ledger if this invoice was billed to them
        if (targetInv) {
            const phone = (targetInv.custPhone || '').trim();
            const name = (targetInv.custName || '').trim();
            const amt = Number(targetInv.finalAmount) || 0;
            const isUdhar = String(targetInv.mode || '').toUpperCase() === 'UDHAR';

            const cust = customers.find(c => (phone && c.phone === phone) || (name && c.name && c.name.toLowerCase() === name.toLowerCase()));
            if (cust) {
                if (Array.isArray(cust.billedInvoiceIds)) {
                    cust.billedInvoiceIds = cust.billedInvoiceIds.filter(id => id !== invNumber);
                }
                cust.totalPurchases = Math.max(0, (Number(cust.totalPurchases) || 0) - amt);
                if (isUdhar) {
                    cust.dueAmount = Math.max(0, (Number(cust.dueAmount) || 0) - amt);
                }
                saveCustomersLocallyAndServer();
                renderCustomersTable(customers);
            }
        }

        try {
            await fetch(`${API_BASE}/api/delete-pos-invoice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invNumber })
            });
        } catch (err) {}

        alert(currentLang === 'hi' ? `✅ बिल #${invNumber} सफलतापूर्वक हटा दिया गया!` : `✅ Invoice #${invNumber} deleted successfully!`);
    } catch (e) {
        console.error("Error deleting invoice:", e);
    }
}

async function clearAllPosInvoices() {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
    } catch (e) {}

    if (history.length === 0) {
        alert(currentLang === 'hi' ? "इतिहास में कोई बिल नहीं है।" : "No invoices found in history.");
        return;
    }

    const confirmMsg = currentLang === 'hi'
        ? `⚠️ क्या आप वाकई सभी (${history.length}) बिलों का इतिहास हटाना चाहते हैं?\nयह क्रिया वापस (Undo) नहीं की जा सकती!`
        : `⚠️ Are you sure you want to clear all (${history.length}) invoices from history?\nThis action cannot be undone!`;

    if (!confirm(confirmMsg)) return;

    try {
        localStorage.removeItem('shree_sai_pos_invoices');
        renderPosInvoicesHistory();
        if (typeof renderReportsView === "function") renderReportsView();
        if (typeof updateDashboardMetrics === "function") updateDashboardMetrics();

        try {
            await fetch(`${API_BASE}/api/clear-pos-invoices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {}

        alert(currentLang === 'hi' ? "✅ सभी बिल इतिहास सफलतापूर्वक साफ़ कर दिया गया!" : "✅ All invoice history cleared successfully!");
    } catch (e) {
        console.error("Error clearing invoice history:", e);
    }
}

async function loadPosInvoicesFromServer() {
    try {
        const res = await fetch(`${API_BASE}/api/get-pos-invoices`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.invoices)) {
            let local = [];
            try {
                local = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
            } catch (e) {}

            const map = new Map();
            data.invoices.forEach(inv => {
                if (inv && inv.invNumber) map.set(inv.invNumber, inv);
            });
            local.forEach(inv => {
                if (inv && inv.invNumber) map.set(inv.invNumber, inv);
            });

            const merged = Array.from(map.values());
            localStorage.setItem('shree_sai_pos_invoices', JSON.stringify(merged));
            renderPosInvoicesHistory();
            if (typeof syncCustomersFromPosInvoices === 'function') {
                syncCustomersFromPosInvoices();
            }
            if (typeof renderReportsView === 'function') {
                renderReportsView();
            }
            if (typeof updateDashboardMetrics === 'function') {
                updateDashboardMetrics();
            }

            if (merged.length > data.invoices.length) {
                merged.forEach(inv => {
                    if (!data.invoices.some(si => si.invNumber === inv.invNumber)) {
                        fetch(`${API_BASE}/api/save-pos-invoice`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(inv)
                        }).catch(() => {});
                    }
                });
            }
        }
    } catch (e) {
        // Fallback to local storage
    }
}

function renderPosInvoicesHistory(filterText = '') {
    const tableBody = document.getElementById("posInvoicesTableBody");
    const badgeEl = document.getElementById("posInvoicesCountBadge");
    const dashContainer = document.getElementById("dashboardRecentInvoicesContainer");

    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
    } catch (e) {
        history = [];
    }

    if (badgeEl) {
        badgeEl.textContent = `${history.length} ${currentLang === 'hi' ? 'बिल' : 'Bills'}`;
    }

    // Filter if search query is present
    const q = (filterText || '').toLowerCase().trim();
    const filtered = q ? history.filter(inv => {
        const matchNum = (inv.invNumber || '').toLowerCase().includes(q);
        const matchName = (inv.custName || '').toLowerCase().includes(q);
        const matchPhone = (inv.custPhone || '').includes(q);
        const matchItems = (inv.items || []).some(it => (it.name || '').toLowerCase().includes(q) || (it.imei1 || '').includes(q));
        return matchNum || matchName || matchPhone || matchItems;
    }) : history;

    // Render POS Counter History Table
    if (tableBody) {
        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-5 text-muted">
                        <i class="fa-solid fa-receipt fa-2x mb-2 opacity-25"></i>
                        <div class="fw-semibold text-dark fs-6">${q ? (currentLang === 'hi' ? 'कोई मेल खाता बिल नहीं मिला' : 'No matching invoices found') : (currentLang === 'hi' ? 'अभी कोई बिल इतिहास नहीं है' : 'No Invoices Generated Yet')}</div>
                        <small class="text-muted">${q ? (currentLang === 'hi' ? 'कृपया अन्य नाम, बिल नंबर या मोबाइल नंबर खोजें।' : 'Try searching by customer name, phone or invoice #.') : (currentLang === 'hi' ? 'ऊपर दिए गए काउंटर से सामान जोड़ें और बिल बनाएं। बिल की पूरी हिस्ट्री यहाँ दिखेगी।' : 'Items billed at the counter will appear here with one-click re-print and WhatsApp.')}</small>
                    </td>
                </tr>
            `;
        } else {
            tableBody.innerHTML = filtered.map(inv => {
                const itemsSummary = (inv.items || []).map(it => `${escapeHtml(it.name || 'Item')} <span class="text-muted small">(x${it.quantity || 1})</span>`).join(", ");
                const modeClass = (inv.mode === 'CASH' || inv.mode === 'UPI')
                    ? "badge bg-success-subtle text-success border border-success-subtle"
                    : "badge bg-primary-subtle text-primary border border-primary-subtle";
                return `
                    <tr>
                        <td>
                            <span class="fw-bold text-primary font-monospace" role="button" style="cursor: pointer;" onclick="viewPastPosInvoice('${escapeHtml(inv.invNumber)}')">
                                <i class="fa-solid fa-file-invoice me-1"></i>${escapeHtml(inv.invNumber)}
                            </span>
                        </td>
                        <td>
                            <div class="small fw-semibold text-dark">${escapeHtml(inv.dateTime || '')}</div>
                        </td>
                        <td>
                            <div class="fw-semibold text-dark">${escapeHtml(inv.custName || 'Walk-in')}</div>
                            <small class="text-muted"><i class="fa-solid fa-phone me-1" style="font-size:0.75rem;"></i>${escapeHtml(inv.custPhone || 'N/A')}</small>
                        </td>
                        <td style="max-width: 260px;">
                            <div class="small text-truncate" title="${escapeHtml((inv.items || []).map(i => i.name).join(', '))}">${itemsSummary || '<span class="text-muted">No items</span>'}</div>
                            <small class="text-muted">${(inv.items || []).length} ${currentLang === 'hi' ? 'आइटम' : 'item(s)'}</small>
                        </td>
                        <td>
                            <span class="${modeClass} fw-semibold">${escapeHtml(inv.mode || 'CASH')}</span>
                        </td>
                        <td class="text-end">
                            <span class="fw-bold text-success fs-6">₹${(inv.finalAmount || 0).toLocaleString('en-IN')}</span>
                        </td>
                        <td class="text-end">
                            <div class="btn-group btn-group-sm">
                                <button type="button" class="btn btn-outline-primary" onclick="viewPastPosInvoice('${escapeHtml(inv.invNumber)}')" title="${currentLang === 'hi' ? 'बिल देखें और PDF प्रिंट करें' : 'View Bill & Print PDF'}">
                                    <i class="fa-solid fa-print me-1"></i>${currentLang === 'hi' ? 'देखें / PDF' : 'View / PDF'}
                                </button>
                                <button type="button" class="btn btn-outline-success" onclick="sendPastPosInvoiceWhatsApp('${escapeHtml(inv.invNumber)}')" title="${currentLang === 'hi' ? 'व्हाट्सएप पर भेजें' : 'Send on WhatsApp'}">
                                    <i class="fa-brands fa-whatsapp"></i>
                                </button>
                                <button type="button" class="btn btn-outline-danger" onclick="deletePosInvoice('${escapeHtml(inv.invNumber)}')" title="${currentLang === 'hi' ? 'बिल हमेशा के लिए हटाएं (Delete)' : 'Delete Bill'}">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join("");
        }
    }

    // Render Dashboard Recent Invoices Container
    if (dashContainer) {
        if (history.length === 0) {
            dashContainer.innerHTML = `
                <div class="d-flex flex-column align-items-center justify-content-center py-4 text-muted text-center">
                    <i class="fa-solid fa-receipt fa-3x mb-3 opacity-25"></i>
                    <div class="fw-bold text-dark fs-6">${currentLang === 'hi' ? 'अभी कोई बिल नहीं बनाया गया' : 'No Invoices Yet'}</div>
                    <small class="text-muted mb-3">${currentLang === 'hi' ? 'फ्रेश काउंटर तैयार है। बिल बनाने के लिए नीचे क्लिक करें!' : 'Fresh counter ready. Click below to bill items!'}</small>
                    <button class="btn btn-sm btn-primary-custom" onclick="switchView('pos-link')">
                        <i class="fa-solid fa-plus me-1"></i> ${currentLang === 'hi' ? 'पहला बिल बनाएं' : 'Create First Bill'}
                    </button>
                </div>
            `;
        } else {
            const recent = history.slice(0, 5);
            dashContainer.innerHTML = `
                <div class="list-group list-group-flush mb-2">
                    ${recent.map(inv => `
                        <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom">
                            <div class="d-flex align-items-center gap-2">
                                <div class="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; min-width: 32px;">
                                    <i class="fa-solid fa-file-invoice" style="font-size: 0.85rem;"></i>
                                </div>
                                <div>
                                    <div class="fw-semibold text-dark" style="font-size: 0.85rem;">
                                        <span class="font-monospace text-primary">${escapeHtml(inv.invNumber)}</span> - ${escapeHtml(inv.custName || 'Walk-in')}
                                    </div>
                                    <small class="text-muted" style="font-size: 0.75rem;">${escapeHtml(inv.dateTime || '')} • <span class="badge bg-light text-dark border">${escapeHtml(inv.mode || 'CASH')}</span></small>
                                </div>
                            </div>
                            <div class="text-end">
                                <div class="fw-bold text-success" style="font-size: 0.88rem;">₹${(inv.finalAmount || 0).toLocaleString('en-IN')}</div>
                                <button class="btn btn-xs btn-link text-primary p-0 text-decoration-none fw-semibold" onclick="viewPastPosInvoice('${escapeHtml(inv.invNumber)}')" style="font-size: 0.75rem;">
                                    <i class="fa-solid fa-print me-1"></i>${currentLang === 'hi' ? 'प्रिंट / देखें' : 'View / PDF'}
                                </button>
                            </div>
                        </div>
                    `).join("")}
                </div>
                <div class="text-center pt-2">
                    <button class="btn btn-sm btn-outline-primary w-100" onclick="switchView('pos-link')">
                        <i class="fa-solid fa-receipt me-1"></i> ${currentLang === 'hi' ? 'POS काउंटर और सभी बिल देखें' : 'Go to POS Counter & All Invoices'}
                    </button>
                </div>
            `;
        }
    }
}

function sendPosInvoiceWhatsApp() {
    const inv = currentActivePosInvoice;
    const phone = inv ? inv.custPhone : document.getElementById("posCustomerPhone")?.value;
    const custName = inv ? inv.custName : (document.getElementById("posCustomerName")?.value || "Customer");
    const total = inv ? `₹${inv.finalAmount.toLocaleString('en-IN')}` : document.getElementById("posGrandTotal")?.textContent;
    const invNumber = inv ? inv.invNumber : `SSM-2026-INV-1001`;

    if (!phone) {
        alert(currentLang === 'hi' ? "कृपया ग्राहक का 10-अंकों का मोबाइल नंबर दर्ज करें!" : "Please enter customer's 10-digit mobile number!");
        return;
    }

    let itemsText = "";
    if (inv && inv.items && inv.items.length > 0) {
        itemsText = inv.items.map(it => `• *${it.name}* (IMEI: ${it.imei1}) - ₹${it.price.toLocaleString('en-IN')}`).join("\n");
    } else {
        itemsText = `• Purchased Electronics & Smartphone Items`;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

    const message = 
`*SHREE SAI MOBILE & ELECTRONICS*
Main Market, Station Road, Jalgaon (Maharashtra)
Proprietor: Devendra Koli (Mo: +91 7972296879)
GSTIN: 27AABCS1429B1Z8
----------------------------------------
🧾 *GST TAX INVOICE:* ${invNumber}
👤 *Customer:* ${custName}
💳 *Payment Mode:* ${inv ? inv.mode : 'CASH'}
📅 *Date:* ${inv ? inv.dateTime : new Date().toLocaleDateString('en-IN')}
----------------------------------------
📦 *Billed Items:*
${itemsText}
----------------------------------------
💰 *Grand Total Paid: ${total}* (18% GST Included)
----------------------------------------
✨ *Warranty:* 1-Year Official Brand Warranty.
🙏 श्री साई मोबाइल शॉप से खरीदारी करने के लिए आपका धन्यवाद!
फिर अवश्य पधारें!`;

    window.open(`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(message)}`, '_blank');
}

function sendInvoiceOnWhatsApp() {
    sendPosInvoiceWhatsApp();
}

window.quickAddImeiToPos = quickAddImeiToPos;
window.openPosStockPickerModal = openPosStockPickerModal;
window.filterPosStockPicker = filterPosStockPicker;
window.renderPosStockPickerTable = renderPosStockPickerTable;
window.addStockItemToPosCart = addStockItemToPosCart;
window.handlePosBarcodeSubmit = handlePosBarcodeSubmit;
window.generateAndPrintBill = generateAndPrintBill;
window.sendPosInvoiceWhatsApp = sendPosInvoiceWhatsApp;
window.sendInvoiceOnWhatsApp = sendInvoiceOnWhatsApp;
window.renderPosInvoicesHistory = renderPosInvoicesHistory;
window.viewPastPosInvoice = viewPastPosInvoice;
window.sendPastPosInvoiceWhatsApp = sendPastPosInvoiceWhatsApp;
window.filterPosInvoices = filterPosInvoices;
window.populatePosInvoiceModal = populatePosInvoiceModal;
window.deletePosInvoice = deletePosInvoice;
window.clearAllPosInvoices = clearAllPosInvoices;
window.loadPosInvoicesFromServer = loadPosInvoicesFromServer;
window.renderCustomersTable = renderCustomersTable;
window.syncCustomersFromPosInvoices = syncCustomersFromPosInvoices;
window.loadCustomersFromServer = loadCustomersFromServer;
window.openPayUdharModal = openPayUdharModal;
window.sendWhatsAppReminder = sendWhatsAppReminder;

// ==========================================================
// 8.1 Sales & GST Compliance Reports Engine
// ==========================================================
function renderReportsView() {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
    } catch(e) {
        history = [];
    }

    const taxableEl = document.getElementById("reportTotalTaxableSales");
    const gstEl = document.getElementById("reportTotalGstOutput");
    const cgstSgstEl = document.getElementById("reportCgstSgstBreakdown");
    const turnoverEl = document.getElementById("reportGrossTurnover");
    const tbody = document.getElementById("reportReconciliationTableBody");

    let totalTaxable = 0;
    let totalGst = 0;
    let totalGross = 0;

    // Date grouping map
    const dayMap = {};

    history.forEach(inv => {
        if (!inv) return;
        const amt = Number(inv.finalAmount) || 0;
        const tax = (inv.taxableTotal != null && !isNaN(Number(inv.taxableTotal))) ? Number(inv.taxableTotal) : (amt / 1.18);
        const gst = (inv.gstTotal != null && !isNaN(Number(inv.gstTotal))) ? Number(inv.gstTotal) : (amt - tax);
        const mode = String(inv.mode || 'CASH').toUpperCase();

        totalGross += amt;
        totalTaxable += tax;
        totalGst += gst;

        // Extract date part from dateTime (e.g. "18 Sept 2026" from "18 Sept 2026, 11:45 pm")
        let dStr = (inv.dateTime || '').split(',')[0].trim() || new Date().toLocaleDateString('en-IN');
        if (!dayMap[dStr]) {
            dayMap[dStr] = {
                date: dStr,
                invoicesCount: 0,
                cash: 0,
                upi: 0,
                card: 0,
                udhar: 0,
                total: 0
            };
        }
        dayMap[dStr].invoicesCount += 1;
        dayMap[dStr].total += amt;
        if (mode === 'CASH') dayMap[dStr].cash += amt;
        else if (mode === 'UPI') dayMap[dStr].upi += amt;
        else if (mode === 'CARD') dayMap[dStr].card += amt;
        else if (mode === 'UDHAR') dayMap[dStr].udhar += amt;
        else dayMap[dStr].cash += amt;
    });

    const cgst = totalGst / 2;
    const sgst = totalGst / 2;

    if (taxableEl) taxableEl.textContent = `₹${Math.round(totalTaxable).toLocaleString('en-IN')}`;
    if (gstEl) gstEl.textContent = `₹${Math.round(totalGst).toLocaleString('en-IN')}`;
    if (cgstSgstEl) cgstSgstEl.textContent = `CGST (9%): ₹${Math.round(cgst).toLocaleString('en-IN')} | SGST (9%): ₹${Math.round(sgst).toLocaleString('en-IN')}`;
    if (turnoverEl) turnoverEl.textContent = `₹${Math.round(totalGross).toLocaleString('en-IN')}`;

    if (tbody) {
        const days = Object.values(dayMap);
        if (days.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-muted">
                        <i class="fa-solid fa-chart-line fa-2x mb-2 d-block opacity-25"></i>
                        ${currentLang === 'hi' ? 'अभी कोई सेल्स डेटा उपलब्ध नहीं है। POS काउंटर पर बिल बनाएं।' : 'No sales data recorded yet. Create bills at POS.'}
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = days.map(d => `
                <tr>
                    <td class="fw-semibold text-dark">${escapeHtml(d.date)}</td>
                    <td><span class="badge bg-light text-dark border">${d.invoicesCount} ${currentLang === 'hi' ? 'बिल' : 'Bills'}</span></td>
                    <td class="text-success fw-semibold">₹${d.cash.toLocaleString('en-IN')}</td>
                    <td class="text-primary fw-semibold">₹${d.upi.toLocaleString('en-IN')}</td>
                    <td class="text-secondary fw-semibold">₹${d.card.toLocaleString('en-IN')}</td>
                    <td class="text-danger fw-semibold">₹${d.udhar.toLocaleString('en-IN')}</td>
                    <td class="fw-bold text-dark fs-6">₹${d.total.toLocaleString('en-IN')}</td>
                </tr>
            `).join("");
        }
    }
}

function exportGstr1Csv() {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
    } catch(e) {
        history = [];
    }

    if (history.length === 0) {
        alert(currentLang === 'hi' ? 'एक्सपोर्ट करने के लिए कोई बिल नहीं है।' : 'No invoices found to export.');
        return;
    }

    const headers = [
        "Invoice Number",
        "Invoice Date",
        "Customer Name",
        "Customer Phone",
        "HSN / SAC Code",
        "Item Descriptions",
        "Payment Mode",
        "Taxable Value (INR)",
        "GST Rate (%)",
        "CGST (INR)",
        "SGST (INR)",
        "Total GST (INR)",
        "Invoice Total (INR)"
    ];

    const rows = history.map(inv => {
        const amt = Number(inv.finalAmount) || 0;
        const taxable = (inv.taxableTotal != null && !isNaN(Number(inv.taxableTotal))) ? Number(inv.taxableTotal) : (amt / 1.18);
        const gst = (inv.gstTotal != null && !isNaN(Number(inv.gstTotal))) ? Number(inv.gstTotal) : (amt - taxable);
        const cgst = gst / 2;
        const sgst = gst / 2;
        const items = (inv.items || []).map(i => `${i.name || 'Item'} (Qty: ${i.quantity || 1})`).join("; ");

        return [
            `"${inv.invNumber || ''}"`,
            `"${inv.dateTime || ''}"`,
            `"${(inv.custName || 'Walk-in Customer').replace(/"/g, '""')}"`,
            `"${inv.custPhone || ''}"`,
            `"8517"`,
            `"${items.replace(/"/g, '""')}"`,
            `"${inv.mode || 'CASH'}"`,
            taxable.toFixed(2),
            "18%",
            cgst.toFixed(2),
            sgst.toFixed(2),
            gst.toFixed(2),
            amt.toFixed(2)
        ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GSTR1_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.renderReportsView = renderReportsView;
window.exportGstr1Csv = exportGstr1Csv;


// ==========================================================
// 9. Mobile Sidebar & Analytics Chart
// ==========================================================
function openMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar) sidebar.classList.add("show");
    if (backdrop) backdrop.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar) sidebar.classList.remove("show");
    if (backdrop) backdrop.classList.remove("show");
    document.body.style.overflow = "";
}
window.openMobileSidebar = openMobileSidebar;
window.closeMobileSidebar = closeMobileSidebar;

function initMobileSidebar() {
    const toggleBtn = document.getElementById("sidebarToggle");
    const closeBtn = document.getElementById("sidebarCloseBtn");
    const backdrop = document.getElementById("sidebarBackdrop");

    if (toggleBtn) {
        toggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const sidebar = document.getElementById("sidebar");
            if (sidebar && sidebar.classList.contains("show")) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeMobileSidebar);
    }

    if (backdrop) {
        backdrop.addEventListener("click", closeMobileSidebar);
    }

    // Auto-close sidebar on mobile when any navigation item is clicked
    document.querySelectorAll(".sidebar-menu .nav-link-custom").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth < 992) {
                closeMobileSidebar();
            }
        });
    });
}

function updateDashboardSalesChart() {
    if (!salesChartInstance) return;
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
    } catch(e) {}

    const brands = {
        'Apple': 0,
        'Samsung': 0,
        'Sony / TV': 0,
        'OnePlus': 0,
        'Xiaomi': 0,
        'Other / Acc': 0
    };

    history.forEach(inv => {
        (inv.items || []).forEach(item => {
            const name = (item.name || '').toLowerCase();
            const price = Number(item.price) || 0;
            if (name.includes('apple') || name.includes('iphone')) brands['Apple'] += price;
            else if (name.includes('samsung') || name.includes('galaxy')) brands['Samsung'] += price;
            else if (name.includes('sony') || name.includes('tv') || name.includes('bravia')) brands['Sony / TV'] += price;
            else if (name.includes('oneplus')) brands['OnePlus'] += price;
            else if (name.includes('xiaomi') || name.includes('redmi') || name.includes('mi ')) brands['Xiaomi'] += price;
            else brands['Other / Acc'] += price;
        });
    });

    salesChartInstance.data.labels = Object.keys(brands);
    salesChartInstance.data.datasets[0].data = Object.values(brands).map(v => Math.round(v / 1000));
    salesChartInstance.data.datasets[0].label = currentLang === 'hi' ? 'ब्रांड बिक्री (₹ हजार में)' : 'Brand Sales (in ₹ Thousands)';
    salesChartInstance.update();
}

function updateDashboardMetrics() {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('shree_sai_pos_invoices') || '[]');
    } catch(e) {}

    let todayTotal = 0;
    let cashTotal = 0;
    let upiTotal = 0;

    history.forEach(inv => {
        const amt = Number(inv.finalAmount) || 0;
        const mode = String(inv.mode || 'CASH').toUpperCase();
        if (mode === 'CASH') cashTotal += amt;
        if (mode === 'UPI') upiTotal += amt;
        todayTotal += amt;
    });

    const todayEl = document.getElementById("dashTodayTotalSales");
    const cashEl = document.getElementById("dashCashInDrawer");
    const upiEl = document.getElementById("dashUpiCollections");

    if (todayEl) todayEl.textContent = `₹${Math.round(todayTotal).toLocaleString('en-IN')}`;
    if (cashEl) cashEl.textContent = `₹${Math.round(cashTotal).toLocaleString('en-IN')}`;
    if (upiEl) upiEl.textContent = `₹${Math.round(upiTotal).toLocaleString('en-IN')}`;

    updateDashboardSalesChart();
}

function initSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    salesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Apple', 'Samsung', 'Sony / TV', 'OnePlus', 'Xiaomi', 'Other / Acc'],
            datasets: [{
                label: currentLang === 'hi' ? 'ब्रांड बिक्री (₹ हजार में)' : 'Brand Sales (in ₹ Thousands)',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: ['#0f172a', '#3b82f6', '#10b981', '#ef4444', '#f97316', '#8b5cf6'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ₹${(context.parsed.y * 1000).toLocaleString('en-IN')}`;
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        callback: function(value) {
                            return `₹${value}k`;
                        }
                    }
                },
                x: { grid: { display: false } }
            }
        }
    });

    updateDashboardMetrics();
}

function updateChartLanguage() {
    if (!salesChartInstance) return;
    salesChartInstance.data.datasets[0].label = currentLang === 'hi' ? 'ब्रांड बिक्री (₹ हजार में)' : 'Brand Sales (in ₹ Thousands)';
    salesChartInstance.update();
}

function logoutUser() {
    localStorage.removeItem('shree_sai_user');
    window.location.href = "login.html";
}

// ==========================================================
// 10. Online Store Orders & Live Notifications Engine
// ==========================================================
let currentOrderFilter = "ALL";
let lastKnownNotifCount = 0;

async function initOnlineOrdersSystem() {
    // 1. Initial check & render
    await checkNewOrdersNotification(false);
    renderOnlineOrdersView(true);

    // 2. Request browser notification permission for store proprietor
    try {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission().catch(() => {});
        }
    } catch(e) {}

    // 3. Real-time BroadcastChannel for instant 0ms notification across tabs
    try {
        const bc = new BroadcastChannel('shree_sai_store_channel');
        bc.onmessage = async (event) => {
            const data = event.data;
            if (data && (data.type === 'NEW_ORDER' || data.type === 'ORDER_CANCELLED' || data.type === 'ORDER_REPLACEMENT')) {
                playNotificationSound();
                await checkNewOrdersNotification(true);
                renderOnlineOrdersView(true);

                // Trigger Desktop Push Notification if allowed
                if ("Notification" in window && Notification.permission === "granted") {
                    let notifTitle = "🚨 New Online Order Received!";
                    let notifBody = "A customer placed a new order.";
                    if (data.type === 'ORDER_CANCELLED') {
                        notifTitle = "⚠️ Order Cancelled!";
                        notifBody = `Order ${data.orderId} was cancelled by customer. Reason: ${data.reason || 'None'}`;
                    } else if (data.type === 'ORDER_REPLACEMENT') {
                        notifTitle = "🔄 Order Replacement Requested!";
                        notifBody = `Customer requested replacement for ${data.orderId}. Reason: ${data.reason || 'None'}`;
                    } else if (data.order) {
                        notifBody = `${data.order.customerName} ordered ₹${data.order.totalAmount.toLocaleString('en-IN')} via ${data.order.paymentMethod}`;
                    }
                    try {
                        new Notification(notifTitle, { body: notifBody, icon: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png" });
                    } catch(e) {}
                }
            }
        };
    } catch(e) {}

    // 4. Real-time storage listener (triggers when customer places order in store.html)
    window.addEventListener("storage", async (e) => {
        if (e.key === "shree_sai_notifications" || e.key === "shree_sai_online_orders") {
            await checkNewOrdersNotification(true);
            renderOnlineOrdersView(true);
        }
    });

    // 5. Fast polling interval for instant update
    setInterval(() => {
        checkNewOrdersNotification(false);
    }, 2500);
}

// Pleasant 2-Tone Ding-Dong Chime using Web Audio API with Autoplay Unlock
let globalAudioCtx = null;

function unlockAudioContext() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        if (!globalAudioCtx) {
            globalAudioCtx = new AudioCtx();
        }
        if (globalAudioCtx.state === 'suspended') {
            globalAudioCtx.resume().catch(() => {});
        }
        return globalAudioCtx;
    } catch(e) {
        return null;
    }
}

// Automatically unlock audio context on ANY user click, touch, key, or scroll
['click', 'touchstart', 'keydown', 'scroll'].forEach(evt => {
    window.addEventListener(evt, () => {
        unlockAudioContext();
    }, { passive: true });
});

function playNotificationSound(force = false) {
    try {
        const ctx = unlockAudioContext();
        if (!ctx) return;

        // Note 1: 587.33 Hz (D5)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
        gain1.gain.setValueAtTime(0.35, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.38);

        // Note 2: 880.00 Hz (A5)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(880.0, ctx.currentTime + 0.16);
        gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.16);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime + 0.16);
        osc2.stop(ctx.currentTime + 0.75);
    } catch(e) {
        console.warn("Audio chime skipped:", e);
    }
}

function testNotificationAlert() {
    unlockAudioContext();
    playNotificationSound(true);
    showLiveOrderToast({
        title: "🔔 Test Live Alert (टेस्ट नोटिफिकेशन)",
        displayTime: "Live Test",
        message: "साउंड और लाइव नोटिफिकेशन बिल्कुल सही काम कर रहे हैं! जब भी ग्राहक ऑर्डर देगा, ऐसा ही अलर्ट आएगा।"
    });
    triggerTabAlert();
}

let titleBlinkTimer = null;
const originalAdminTitle = document.title;
function triggerTabAlert(text) {
    if (titleBlinkTimer) clearInterval(titleBlinkTimer);
    let blink = false;
    let count = 0;
    titleBlinkTimer = setInterval(() => {
        document.title = blink ? `🚨 NEW ORDER! - Shree Sai Mobile` : originalAdminTitle;
        blink = !blink;
        count++;
        if (count > 24) {
            clearInterval(titleBlinkTimer);
            document.title = originalAdminTitle;
        }
    }, 800);
}

window.addEventListener('focus', () => {
    if (titleBlinkTimer) {
        clearInterval(titleBlinkTimer);
        document.title = originalAdminTitle;
    }
});

let isFetchingServerOrders = false;
let lastSeenNotifId = localStorage.getItem('last_seen_notif_id') || null;

async function checkNewOrdersNotification(triggerAlert = false) {
    // 1. Sync live orders & notifications from central server (works across mobile, PC, WiFi, file://)
    if (!isFetchingServerOrders) {
        isFetchingServerOrders = true;
        try {
            const [ordersRes, notifsRes] = await Promise.all([
                fetch(`${API_BASE}/api/get-orders`),
                fetch(`${API_BASE}/api/get-notifications`)
            ]);
            if (ordersRes.ok) {
                const oData = await ordersRes.json();
                if (oData.success && Array.isArray(oData.orders)) {
                    // Sort descending by date so latest order is always first
                    oData.orders.sort((a, b) => new Date(b.date || b.timestamp || 0) - new Date(a.date || a.timestamp || 0));
                    localStorage.setItem('shree_sai_online_orders', JSON.stringify(oData.orders));
                }
            }
            if (notifsRes.ok) {
                const nData = await notifsRes.json();
                if (nData.success && Array.isArray(nData.notifications)) {
                    localStorage.setItem('shree_sai_notifications', JSON.stringify(nData.notifications));
                }
            }
        } catch(e) {
            // Offline or fallback to localStorage
        } finally {
            isFetchingServerOrders = false;
        }
    }

    const notifs = JSON.parse(localStorage.getItem('shree_sai_notifications') || '[]');
    const unreadList = notifs.filter(n => !n.read);
    const unreadCount = unreadList.length;

    // Badges in Topbar & Sidebar
    const badge = document.getElementById("notifBadge");
    const sidebarBadge = document.getElementById("sidebarOrdersBadge");
    const countLabel = document.getElementById("notifCountLabel");

    if (badge) {
        if (unreadCount > 0) {
            badge.style.display = "inline-block";
            badge.textContent = unreadCount > 9 ? "9+" : unreadCount;
        } else {
            badge.style.display = "none";
        }
    }

    if (sidebarBadge) {
        if (unreadCount > 0) {
            sidebarBadge.style.display = "inline-block";
            sidebarBadge.textContent = unreadCount;
        } else {
            sidebarBadge.style.display = "none";
        }
    }

    if (countLabel) {
        countLabel.textContent = `${unreadCount} ${currentLang === 'hi' ? 'नई' : 'New'}`;
    }

    // Check if new notification arrived by unique ID
    if (notifs.length > 0) {
        const latest = notifs[0];
        if (lastSeenNotifId === null) {
            // First run on page load: record current latest ID without spamming
            lastSeenNotifId = latest.id;
            localStorage.setItem('last_seen_notif_id', latest.id);
            if (triggerAlert) {
                playNotificationSound();
                showLiveOrderToast(latest);
                triggerTabAlert();
            }
        } else if (latest.id !== lastSeenNotifId || triggerAlert) {
            // Brand new notification arrived!
            lastSeenNotifId = latest.id;
            localStorage.setItem('last_seen_notif_id', latest.id);
            playNotificationSound();
            showLiveOrderToast(latest);
            triggerTabAlert();
        }
    }
    lastKnownNotifCount = unreadCount;

    // Render list in dropdown
    renderNotifDropdown(notifs);

    // Update Dashboard Alert Banner
    const orders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
    orders.sort((a, b) => new Date(b.date || b.timestamp || 0) - new Date(a.date || a.timestamp || 0));
    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const dashAlert = document.getElementById("dashboardOrdersAlert");
    const dashAlertText = document.getElementById("dashboardOrdersAlertText");
    const pendingBadge = document.getElementById("ordersPendingCountBadge");

    if (pendingBadge) {
        pendingBadge.textContent = `${pendingOrders.length} ${currentLang === 'hi' ? 'लंबित' : 'Pending'}`;
    }

    if (dashAlert) {
        if (pendingOrders.length > 0) {
            dashAlert.classList.remove("d-none");
            if (dashAlertText) {
                const latest = pendingOrders[0];
                dashAlertText.textContent = currentLang === 'hi'
                    ? `${latest.customerName} ने ₹${latest.totalAmount.toLocaleString('en-IN')} का नया ऑर्डर दिया (${latest.paymentMethod})। कुल ${pendingOrders.length} ऑर्डर पुष्टि के लिए तैयार हैं।`
                    : `${latest.customerName} placed order for ₹${latest.totalAmount.toLocaleString('en-IN')} via ${latest.paymentMethod}. Total ${pendingOrders.length} pending orders.`;
            }
        } else {
            dashAlert.classList.add("d-none");
        }
    }

    // Auto-refresh orders table if the Online Orders view is currently visible
    const ordersView = document.getElementById("online-orders-view");
    if (ordersView && !ordersView.classList.contains("d-none")) {
        renderOnlineOrdersView(true);
    }
}

function dismissLiveToast() {
    const toastEl = document.getElementById('liveOrderToast');
    if (!toastEl) return;
    toastEl.classList.remove("show");
    toastEl.classList.add("hide");
    if (typeof bootstrap !== 'undefined') {
        const instance = bootstrap.Toast.getInstance(toastEl);
        if (instance) instance.hide();
    }
}

function showLiveOrderToast(notif) {
    const toastEl = document.getElementById('liveOrderToast');
    if (!toastEl) return;

    const titleEl = document.getElementById("toastTitle");
    const timeEl = document.getElementById("toastTime");
    const msgEl = document.getElementById("toastMessage");

    if (titleEl) titleEl.textContent = notif.title || "🚨 New Online Order Received!";
    if (timeEl) timeEl.textContent = notif.displayTime || "Just now";
    if (msgEl) msgEl.textContent = notif.message;

    // Shake bell button on header
    const bellBtn = document.getElementById("notifDropdownBtn");
    if (bellBtn) {
        bellBtn.classList.add("fa-shake");
        setTimeout(() => bellBtn.classList.remove("fa-shake"), 4000);
    }

    toastEl.classList.remove("hide");
    toastEl.classList.add("show");

    if (typeof bootstrap !== 'undefined') {
        const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { autohide: false });
        toast.show();
    }
}

function renderNotifDropdown(notifs) {
    const container = document.getElementById("notifListContainer");
    if (!container) return;

    if (!notifs || notifs.length === 0) {
        container.innerHTML = `
            <div class="p-4 text-center text-muted small">
                <i class="fa-regular fa-bell-slash fa-2x mb-2 text-secondary"></i>
                <div>${currentLang === 'hi' ? 'कोई नया नोटिफिकेशन नहीं है' : 'No new notifications'}</div>
            </div>
        `;
        return;
    }

    container.innerHTML = notifs.slice(0, 8).map(n => `
        <div class="list-group-item list-group-item-action p-3 border-bottom ${n.read ? 'bg-white opacity-75' : 'bg-primary-subtle'}" onclick="handleNotifClick('${n.id}', '${n.orderId}')" style="cursor: pointer;">
            <div class="d-flex justify-content-between align-items-start mb-1">
                <span class="fw-bold small text-dark d-flex align-items-center gap-1">
                    <i class="fa-solid fa-cart-shopping text-primary"></i> ${n.title}
                </span>
                <small class="text-muted" style="font-size: 0.72rem;">${n.displayTime || ''}</small>
            </div>
            <p class="mb-1 text-secondary" style="font-size: 0.82rem; line-height: 1.35;">${n.message}</p>
            <div class="d-flex justify-content-between align-items-center mt-2">
                <span class="badge ${n.read ? 'bg-light text-secondary border' : 'bg-danger'}">${n.read ? 'Seen' : 'New Order'}</span>
                <span class="text-primary fw-bold small">View Order <i class="fa-solid fa-chevron-right ms-1" style="font-size: 0.65rem;"></i></span>
            </div>
        </div>
    `).join("");
}

function handleNotifClick(notifId, orderId) {
    const notifs = JSON.parse(localStorage.getItem('shree_sai_notifications') || '[]');
    const item = notifs.find(n => n.id === notifId);
    if (item) item.read = true;
    localStorage.setItem('shree_sai_notifications', JSON.stringify(notifs));
    checkNewOrdersNotification(false);
    switchView('online-orders-link');
}

function markAllNotificationsRead() {
    const notifs = JSON.parse(localStorage.getItem('shree_sai_notifications') || '[]');
    notifs.forEach(n => n.read = true);
    localStorage.setItem('shree_sai_notifications', JSON.stringify(notifs));
    checkNewOrdersNotification(false);

    fetch(`${API_BASE}/api/mark-notifications-read`, { method: "POST" }).catch(e => {});
}

// ----------------------------------------------------------
// Online Store Orders Table & Management
// ----------------------------------------------------------
async function renderOnlineOrdersView(skipServerFetch = false) {
    const tbody = document.getElementById("onlineOrdersTableBody");
    if (!tbody) return;

    if (!skipServerFetch) {
        try {
            const res = await fetch(`${API_BASE}/api/get-orders`);
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.orders)) {
                    data.orders.sort((a, b) => new Date(b.date || b.timestamp || 0) - new Date(a.date || a.timestamp || 0));
                    localStorage.setItem('shree_sai_online_orders', JSON.stringify(data.orders));
                }
            }
        } catch(e) {}
    }

    const orders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
    // Sort all orders by date descending so the newest order is ALWAYS at the top!
    orders.sort((a, b) => new Date(b.date || b.timestamp || 0) - new Date(a.date || a.timestamp || 0));

    // Update Counter Badges
    const countAll = orders.length;
    const countPending = orders.filter(o => o.status === 'Pending').length;
    const countConfirmed = orders.filter(o => o.status === 'Confirmed').length;
    const countDelivered = orders.filter(o => o.status === 'Delivered').length;
    const countCancelled = orders.filter(o => o.status === 'Cancelled').length;
    const countReplacement = orders.filter(o => o.status === 'Replacement Requested').length;

    if (document.getElementById("countOrdersAll")) document.getElementById("countOrdersAll").textContent = countAll;
    if (document.getElementById("countOrdersPending")) document.getElementById("countOrdersPending").textContent = countPending;
    if (document.getElementById("countOrdersConfirmed")) document.getElementById("countOrdersConfirmed").textContent = countConfirmed;
    if (document.getElementById("countOrdersDelivered")) document.getElementById("countOrdersDelivered").textContent = countDelivered;
    if (document.getElementById("countOrdersCancelled")) document.getElementById("countOrdersCancelled").textContent = countCancelled;
    if (document.getElementById("countOrdersReplacement")) document.getElementById("countOrdersReplacement").textContent = countReplacement;

    const filtered = (currentOrderFilter === "ALL") 
        ? orders 
        : orders.filter(o => o.status.toLowerCase() === currentOrderFilter.toLowerCase());

    const mobileCards = document.getElementById("onlineOrdersMobileCards");

    if (filtered.length === 0) {
        const emptyHtml = `
            <div class="text-center py-5 text-muted">
                <i class="fa-solid fa-cart-arrow-down fa-3x mb-3 text-secondary opacity-25"></i>
                <h6 class="fw-bold mb-1">${currentLang === 'hi' ? 'कोई ऑनलाइन ऑर्डर नहीं मिला' : 'No online orders found'}</h6>
                <p class="small mb-3">${currentLang === 'hi' ? 'जब भी ग्राहक स्टोर पेज से कोई ऑर्डर देगा, वह तुरंत यहाँ लाइव दिखेगा।' : 'When a customer places an order from the online store, it will appear here instantly.'}</p>
                <a href="index.html" target="_blank" class="btn btn-sm btn-primary rounded-pill px-3">
                    <i class="fa-solid fa-store me-1"></i> Open Customer Store
                </a>
            </div>
        `;
        tbody.innerHTML = `<tr><td colspan="7">${emptyHtml}</td></tr>`;
        if (mobileCards) mobileCards.innerHTML = emptyHtml;
        return;
    }

    // 1. Render Desktop Table Rows
    tbody.innerHTML = filtered.map(order => {
        let statusBadge = "";
        if (order.status === "Pending") statusBadge = `<span class="badge bg-warning text-dark px-2 py-1"><i class="fa-solid fa-clock me-1"></i>Pending</span>`;
        else if (order.status === "Confirmed") statusBadge = `<span class="badge bg-info px-2 py-1"><i class="fa-solid fa-check me-1"></i>Confirmed</span>`;
        else if (order.status === "Delivered") statusBadge = `<span class="badge bg-success px-2 py-1"><i class="fa-solid fa-circle-check me-1"></i>Delivered</span>`;
        else if (order.status === "Cancelled") statusBadge = `<span class="badge bg-danger px-2 py-1"><i class="fa-solid fa-circle-xmark me-1"></i>Cancelled</span>`;
        else if (order.status === "Replacement Requested") statusBadge = `<span class="badge bg-warning text-dark px-2 py-1"><i class="fa-solid fa-arrows-rotate me-1"></i>Replace Req</span>`;
        else statusBadge = `<span class="badge bg-secondary px-2 py-1">${order.status}</span>`;

        if (order.cancelledAt) {
            statusBadge += `<div class="small text-danger mt-1" style="font-size:0.7rem;"><i class="fa-solid fa-ban me-1"></i>${order.cancelledAt}${order.cancelReason ? `<br><em>${order.cancelReason}</em>` : ''}</div>`;
        }
        if (order.replaceRequestedAt) {
            statusBadge += `<div class="small text-warning-emphasis mt-1" style="font-size:0.7rem;"><i class="fa-solid fa-arrows-rotate me-1"></i>${order.replaceRequestedAt}${order.replaceReason ? `<br><em>${order.replaceReason}</em>` : ''}</div>`;
        }

        const itemsList = (order.items || []).map(i => `
            <div class="d-flex align-items-center gap-2 mb-1">
                <span class="badge bg-light text-dark border">x${i.qty}</span>
                <span class="text-dark fw-semibold text-truncate" style="max-width: 200px;" title="${i.name}">${i.name}</span>
                <small class="text-muted ms-auto">₹${(i.price * i.qty).toLocaleString('en-IN')}</small>
            </div>
        `).join("");

        const waMsg = encodeURIComponent(
            `Hello ${order.customerName} ji! Devendra Koli here from Shree Sai Mobile Shop.\nRegarding your online order (${order.orderId}) for ₹${order.totalAmount.toLocaleString('en-IN')}.\nWe have received your order and are confirming dispatch details with you.`
        );

        return `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold text-primary font-monospace">${order.orderId}</div>
                    <small class="text-muted"><i class="fa-regular fa-calendar me-1"></i>${order.displayDate || ''} ${order.displayTime || ''}</small>
                </td>
                <td>
                    <div class="fw-bold text-dark">${order.customerName}</div>
                    <div class="small text-muted"><i class="fa-solid fa-phone text-success me-1"></i><a href="tel:${order.customerPhone}" class="text-decoration-none">${order.customerPhone}</a></div>
                    <small class="text-muted d-block text-truncate" style="max-width: 220px;" title="${order.deliveryAddress}">
                        <i class="fa-solid fa-location-dot text-danger me-1"></i>${order.deliveryAddress}
                    </small>
                </td>
                <td style="min-width: 220px;">
                    ${itemsList}
                </td>
                <td>
                    <div class="fw-bold text-dark fs-6">₹${order.totalAmount.toLocaleString('en-IN')}</div>
                    <small class="text-success fw-semibold"><i class="fa-solid fa-truck me-1"></i>Free Delivery</small>
                </td>
                <td>
                    ${(() => {
                        let method = order.paymentMethod || "COD";
                        let badge = `<span class="badge bg-light text-dark border">${method}</span>`;
                        if (method.toLowerCase().includes("online") || method.toLowerCase().includes("phonepe") || method.toLowerCase().includes("gpay") || method.toLowerCase().includes("upi")) {
                            badge = `<span class="badge bg-primary-subtle text-primary border border-primary-subtle"><i class="fa-solid fa-qrcode me-1"></i>${method}</span>`;
                        } else if (method.toLowerCase().includes("whatsapp")) {
                            badge = `<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="fa-brands fa-whatsapp me-1"></i>WhatsApp Order</span>`;
                        }
                        if (order.utrNumber) {
                            badge += `<div class="small text-success font-monospace mt-1" style="font-size:0.73rem;"><i class="fa-solid fa-receipt me-1"></i>UTR: <strong>${order.utrNumber}</strong></div>`;
                        }
                        return badge;
                    })()}
                </td>
                <td>
                    <div class="mb-1">${statusBadge}</div>
                    <select class="form-select form-select-sm" style="font-size: 0.75rem; width: 120px;" onchange="updateOrderStatus('${order.orderId}', this.value)">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>🟡 Pending</option>
                        <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>🔵 Confirmed</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>🟢 Delivered</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>🔴 Cancelled</option>
                        <option value="Replacement Requested" ${order.status === 'Replacement Requested' ? 'selected' : ''}>🔄 Replace Req</option>
                        <option value="Replacement Done" ${order.status === 'Replacement Done' ? 'selected' : ''}>✅ Replace Done</option>
                    </select>
                </td>
                <td class="pe-4 text-end">
                    <div class="btn-group btn-group-sm">
                        <a href="tel:${order.customerPhone}" class="btn btn-outline-success" title="Call Customer">
                            <i class="fa-solid fa-phone"></i>
                        </a>
                        <a href="https://api.whatsapp.com/send?phone=91${order.customerPhone}&text=${waMsg}" target="_blank" class="btn btn-outline-success" title="WhatsApp Customer">
                            <i class="fa-brands fa-whatsapp"></i>
                        </a>
                        <button class="btn btn-outline-secondary" onclick="printOrderSlip('${order.orderId}')" title="Print Dispatch Slip">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    // 2. Render Mobile Cards View (for Phones & Small Screens)
    if (mobileCards) {
        mobileCards.innerHTML = filtered.map(order => {
            let statusBadge = "";
            if (order.status === "Pending") statusBadge = `<span class="badge bg-warning text-dark px-2 py-1"><i class="fa-solid fa-clock me-1"></i>Pending</span>`;
            else if (order.status === "Confirmed") statusBadge = `<span class="badge bg-info px-2 py-1"><i class="fa-solid fa-check me-1"></i>Confirmed</span>`;
            else if (order.status === "Delivered") statusBadge = `<span class="badge bg-success px-2 py-1"><i class="fa-solid fa-circle-check me-1"></i>Delivered</span>`;
            else if (order.status === "Cancelled") statusBadge = `<span class="badge bg-danger px-2 py-1"><i class="fa-solid fa-circle-xmark me-1"></i>Cancelled</span>`;
            else if (order.status === "Replacement Requested") statusBadge = `<span class="badge bg-warning text-dark px-2 py-1"><i class="fa-solid fa-arrows-rotate me-1"></i>Replace Req</span>`;
            else statusBadge = `<span class="badge bg-secondary px-2 py-1">${order.status}</span>`;

            if (order.cancelledAt) {
                statusBadge += `<div class="small text-danger mt-1" style="font-size:0.68rem;"><i class="fa-solid fa-ban me-1"></i>${order.cancelledAt}${order.cancelReason ? `<br><em>${order.cancelReason}</em>` : ''}</div>`;
            }
            if (order.replaceRequestedAt) {
                statusBadge += `<div class="small text-warning-emphasis mt-1" style="font-size:0.68rem;"><i class="fa-solid fa-arrows-rotate me-1"></i>${order.replaceRequestedAt}${order.replaceReason ? `<br><em>${order.replaceReason}</em>` : ''}</div>`;
            }

            const waMsg = encodeURIComponent(
                `Hello ${order.customerName} ji! Devendra Koli here from Shree Sai Mobile Shop.\nRegarding your online order (${order.orderId}) for ₹${order.totalAmount.toLocaleString('en-IN')}.\nWe have received your order and are confirming dispatch details with you.`
            );

            let method = order.paymentMethod || "COD";
            let paymentBadge = `<span class="badge bg-light text-dark border">${method}</span>`;
            if (method.toLowerCase().includes("online") || method.toLowerCase().includes("phonepe") || method.toLowerCase().includes("gpay") || method.toLowerCase().includes("upi")) {
                paymentBadge = `<span class="badge bg-primary-subtle text-primary border border-primary-subtle"><i class="fa-solid fa-qrcode me-1"></i>${method}</span>`;
            } else if (method.toLowerCase().includes("whatsapp")) {
                paymentBadge = `<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="fa-brands fa-whatsapp me-1"></i>WhatsApp</span>`;
            }
            if (order.utrNumber) {
                paymentBadge += `<div class="small text-success font-monospace mt-1" style="font-size:0.7rem;"><i class="fa-solid fa-receipt me-1"></i>UTR: <strong>${order.utrNumber}</strong></div>`;
            }

            const itemsListMobile = (order.items || []).map(i => `
                <div class="d-flex align-items-center justify-content-between py-1 border-bottom border-light">
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-primary-subtle text-primary font-monospace" style="font-size: 0.7rem;">x${i.qty}</span>
                        <span class="fw-semibold text-dark small" style="font-size: 0.82rem;">${i.name}</span>
                    </div>
                    <span class="fw-bold text-dark small" style="font-size: 0.82rem;">₹${(i.price * i.qty).toLocaleString('en-IN')}</span>
                </div>
            `).join("");

            return `
                <div class="mobile-order-card">
                    <div class="mobile-order-header">
                        <div>
                            <span class="fw-bold text-primary font-monospace" style="font-size: 0.88rem;">${order.orderId}</span>
                            <div class="text-muted" style="font-size: 0.72rem;">
                                <i class="fa-regular fa-calendar me-1"></i>${order.displayDate || ''} ${order.displayTime || ''}
                            </div>
                        </div>
                        <div class="text-end">${statusBadge}</div>
                    </div>
                    <div class="mobile-order-body">
                        <!-- Customer Details & Direct Phone/WhatsApp Actions -->
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <div class="fw-bold text-dark" style="font-size: 0.94rem;">${order.customerName}</div>
                                <div class="small text-muted"><i class="fa-solid fa-phone text-success me-1"></i><a href="tel:${order.customerPhone}" class="text-decoration-none text-dark">${order.customerPhone}</a></div>
                            </div>
                            <div class="btn-group btn-group-sm shadow-xs">
                                <a href="tel:${order.customerPhone}" class="btn btn-outline-success px-2 py-1" title="Call Customer">
                                    <i class="fa-solid fa-phone"></i>
                                </a>
                                <a href="https://api.whatsapp.com/send?phone=91${order.customerPhone}&text=${waMsg}" target="_blank" class="btn btn-outline-success px-2 py-1" title="WhatsApp Customer">
                                    <i class="fa-brands fa-whatsapp"></i>
                                </a>
                                <button class="btn btn-outline-secondary px-2 py-1" onclick="printOrderSlip('${order.orderId}')" title="Print Slip">
                                    <i class="fa-solid fa-print"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Delivery Address -->
                        <div class="p-2 bg-light rounded-2 small text-muted mb-2" style="font-size: 0.75rem;">
                            <i class="fa-solid fa-location-dot text-danger me-1"></i>${order.deliveryAddress}
                        </div>

                        <!-- Items Ordered -->
                        <div class="mb-2">
                            <div class="text-muted small fw-bold mb-1" style="font-size: 0.68rem; letter-spacing: 0.04em;">ITEMS ORDERED:</div>
                            ${itemsListMobile}
                        </div>

                        <!-- Price & Payment Badge -->
                        <div class="d-flex justify-content-between align-items-center bg-light p-2 rounded-2 mb-2">
                            <div>
                                <small class="text-muted d-block" style="font-size: 0.68rem;">TOTAL AMOUNT</small>
                                <span class="fw-bold text-primary fs-6">₹${order.totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div class="text-end">
                                <small class="text-muted d-block" style="font-size: 0.68rem;">PAYMENT</small>
                                ${paymentBadge}
                            </div>
                        </div>

                        <!-- Status Changer Dropdown -->
                        <div class="d-flex align-items-center gap-2 pt-2 border-top">
                            <label class="small fw-bold text-dark mb-0 text-nowrap" style="font-size: 0.76rem;">Update Status:</label>
                            <select class="form-select form-select-sm fw-semibold flex-grow-1" style="font-size: 0.8rem;" onchange="updateOrderStatus('${order.orderId}', this.value)">
                                <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>🟡 Pending</option>
                                <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>🔵 Confirmed</option>
                                <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>🟢 Delivered</option>
                                <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>🔴 Cancelled</option>
                                <option value="Replacement Requested" ${order.status === 'Replacement Requested' ? 'selected' : ''}>🔄 Replace Req</option>
                                <option value="Replacement Done" ${order.status === 'Replacement Done' ? 'selected' : ''}>✅ Replace Done</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }
}

function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('shree_sai_online_orders', JSON.stringify(orders));
        renderOnlineOrdersView();
        checkNewOrdersNotification(false);

        fetch(`${API_BASE}/api/update-order-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, status: newStatus })
        }).catch(e => console.warn("Failed to sync order status to server:", e));
    }
}

function filterOnlineOrders(status) {
    currentOrderFilter = status;
    document.querySelectorAll(".order-filter-btn").forEach(btn => {
        const isCurrent = btn.dataset.status === status;
        btn.classList.toggle("active", isCurrent);
        if (isCurrent) {
            btn.classList.remove("btn-outline-warning", "btn-outline-info", "btn-outline-success", "btn-outline-danger", "btn-outline-secondary");
            btn.classList.add("btn-dark");
        } else {
            btn.classList.remove("btn-dark");
            if (btn.dataset.status === "Pending") btn.classList.add("btn-outline-warning");
            else if (btn.dataset.status === "Confirmed") btn.classList.add("btn-outline-info");
            else if (btn.dataset.status === "Delivered") btn.classList.add("btn-outline-success");
            else if (btn.dataset.status === "Cancelled") btn.classList.add("btn-outline-danger");
            else btn.classList.add("btn-outline-secondary");
        }
    });
    renderOnlineOrdersView();
}

function printOrderSlip(orderId) {
    const orders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return;

    const printWin = window.open('', '_blank', 'width=450,height=600');
    if (!printWin) return;

    printWin.document.write(`
        <html>
        <head>
            <title>Order Slip - ${order.orderId}</title>
            <style>
                body { font-family: monospace; padding: 20px; font-size: 13px; line-height: 1.4; color: #000; }
                .text-center { text-align: center; }
                .hr { border-bottom: 1px dashed #000; margin: 10px 0; }
                .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
                .fw-bold { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="text-center">
                <h3 style="margin: 0;">SHREE SAI MOBILE</h3>
                <div>Online Store Dispatch Slip</div>
                <div>Owner: Devendra Koli (7972296879)</div>
            </div>
            <div class="hr"></div>
            <div class="row"><span>Order ID:</span><strong>${order.orderId}</strong></div>
            <div class="row"><span>Date:</span><span>${order.displayDate} ${order.displayTime}</span></div>
            <div class="row"><span>Customer:</span><span>${order.customerName}</span></div>
            <div class="row"><span>Phone:</span><span>${order.customerPhone}</span></div>
            <div class="row"><span>Address:</span><span>${order.deliveryAddress}</span></div>
            <div class="row"><span>Payment:</span><strong>${order.paymentMethod}</strong></div>
            <div class="hr"></div>
            <div><strong>ITEMS:</strong></div>
            ${(order.items || []).map(i => `<div class="row"><span>${i.name} x ${i.qty}</span><span>₹${(i.price * i.qty).toLocaleString('en-IN')}</span></div>`).join("")}
            <div class="hr"></div>
            <div class="row" style="font-size: 15px;"><strong>TOTAL AMOUNT:</strong><strong>₹${order.totalAmount.toLocaleString('en-IN')}</strong></div>
            <div class="hr"></div>
            <div class="text-center" style="font-size: 11px;">Thank you for shopping with Shree Sai Mobile!</div>
            <script>window.onload = function() { window.print(); window.close(); }<\/script>
        </body>
        </html>
    `);
    printWin.document.close();
}

// ==========================================================
// Fast2SMS Real OTP Gateway Management
// ==========================================================
async function loadSmsStatus() {
    try {
        const res = await fetch(`${API_BASE}/api/get-sms-status`);
        const data = await res.json();
        const badge = document.getElementById("smsGatewayStatusBadge");
        const keyInfo = document.getElementById("currentMaskedKeyText");
        if (data.is_configured) {
            if (badge) {
                badge.className = "badge bg-success";
                badge.innerHTML = '<i class="fa-solid fa-circle-check me-1"></i> Connected (Active)';
            }
            if (keyInfo) {
                keyInfo.innerHTML = `<span class="text-success fw-semibold"><i class="fa-solid fa-key me-1"></i> Active Key: ${data.masked_key}</span>`;
            }
        } else {
            if (badge) {
                badge.className = "badge bg-warning text-dark";
                badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation me-1"></i> Not Configured';
            }
            if (keyInfo) {
                keyInfo.innerHTML = `<span class="text-secondary"><i class="fa-solid fa-circle-info me-1"></i> No API key entered yet. Free demo fallback active.</span>`;
            }
        }
    } catch (e) {
        console.warn("Could not load SMS gateway status from server:", e);
        const cached = localStorage.getItem("fast2sms_api_key");
        const keyInfo = document.getElementById("currentMaskedKeyText");
        const badge = document.getElementById("smsGatewayStatusBadge");
        if (cached && keyInfo) {
            const masked = cached.slice(0, 6) + "..." + cached.slice(-4);
            keyInfo.innerHTML = `<span class="text-primary fw-semibold"><i class="fa-solid fa-key me-1"></i> Cached Key: ${masked}</span>`;
            if (badge) {
                badge.className = "badge bg-info text-dark";
                badge.innerHTML = '<i class="fa-solid fa-cloud me-1"></i> Cached Locally';
            }
        }
    }
}

async function saveFast2SmsKey() {
    const input = document.getElementById("fast2smsApiKeyInput");
    const key = input ? input.value.trim() : "";
    if (!key) {
        alert("कृपया Fast2SMS API Key दर्ज करें!");
        return;
    }

    // Always cache in localStorage as well
    localStorage.setItem("fast2sms_api_key", key);

    try {
        const res = await fetch(`${API_BASE}/api/save-sms-key`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_key: key })
        });
        const data = await res.json();
        if (data.success) {
            alert("✅ Fast2SMS API Key सफलतापूर्वक सेव हो गई!\nअब ग्राहक जब भी ऑर्डर करेंगे, उनके मोबाइल पर असली SMS OTP जाएगा।");
            if (input) input.value = "";
            loadSmsStatus();
        } else {
            alert("Error saving API key: " + (data.message || "Unknown error"));
        }
    } catch (err) {
        alert("⚠️ Key आपके इस ब्राउज़र में सुरक्षित सेव हो गई है!");
        loadSmsStatus();
    }
}

function toggleSmsKeyVisibility() {
    const inp = document.getElementById("fast2smsApiKeyInput");
    const icon = document.getElementById("toggleSmsKeyIcon");
    if (!inp) return;
    if (inp.type === "password") {
        inp.type = "text";
        if (icon) {
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        }
    } else {
        inp.type = "password";
        if (icon) {
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    }
}

async function sendTestSmsOtp() {
    const phoneInp = document.getElementById("testSmsPhoneInput");
    const phone = phoneInp ? phoneInp.value.trim() : "";
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        alert("कृपया टेस्ट करने के लिए 10-अंकों का वैध मोबाइल नंबर दर्ज करें!");
        return;
    }

    const btn = document.getElementById("btnSendTestSms");
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';
    }

    const testOtp = String(Math.floor(1000 + Math.random() * 9000));
    try {
        const res = await fetch(`${API_BASE}/api/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: phone, otp: testOtp })
        });
        const data = await res.json();
        if (data.real_sms) {
            alert(`✅ असली SMS सफलता से भेजा गया!\nमोबाइल नंबर: +91 ${phone}\nटेस्ट OTP: ${testOtp}\nकृपया अपने मोबाइल का SMS इनबॉक्स चेक करें।`);
        } else {
            alert(`⚠️ Fast2SMS Status: ${data.message}\n(अगर API Key नहीं डाली है, तो ऊपर Fast2SMS API Key डालकर Save करें)`);
        }
    } catch (e) {
        alert("SMS भेजने में त्रुटि: " + e.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-paper-plane me-1"></i> Test SMS';
        }
    }
}

// ==========================================================
// UPI & Online Payment Configuration (Admin Settings)
// ==========================================================
async function loadAdminUpiConfig() {
    const upiInp = document.getElementById("adminUpiIdInput");
    const payeeInp = document.getElementById("adminUpiPayeeInput");
    if (!upiInp || !payeeInp) return;

    try {
        const res = await fetch(`${API_BASE}/api/get-upi-config`);
        const data = await res.json();
        if (data && data.success && data.config) {
            upiInp.value = data.config.upi_id || "7972296879@ybl";
            payeeInp.value = data.config.payee_name || "Devendra Koli - Shree Sai Mobile";
            localStorage.setItem("shree_sai_upi_config", JSON.stringify(data.config));
        }
    } catch (e) {
        const localUpi = localStorage.getItem("shree_sai_upi_config");
        if (localUpi) {
            try {
                const parsed = JSON.parse(localUpi);
                upiInp.value = parsed.upi_id || "7972296879@ybl";
                payeeInp.value = parsed.payee_name || "Devendra Koli - Shree Sai Mobile";
            } catch (err) {}
        }
    }
    previewAdminQrCode();
}

async function saveAdminUpiConfig() {
    const upiInp = document.getElementById("adminUpiIdInput");
    const payeeInp = document.getElementById("adminUpiPayeeInput");
    const upiId = upiInp ? upiInp.value.trim() : "";
    const payee = payeeInp ? payeeInp.value.trim() : "Devendra Koli - Shree Sai Mobile";

    if (!upiId || !upiId.includes("@")) {
        alert("कृपया एक वैध UPI ID दर्ज करें! (उदाहरण: 7972296879@ybl)");
        return;
    }

    const cfg = { upi_id: upiId, payee_name: payee, phone: "7972296879" };
    localStorage.setItem("shree_sai_upi_config", JSON.stringify(cfg));

    try {
        const res = await fetch(`${API_BASE}/api/save-upi-config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cfg)
        });
        const data = await res.json();
        if (data.success) {
            alert("✅ UPI विवरण सफलतापूर्वक सेव हो गए!\nअब ग्राहक PhonePe, Google Pay या इस QR कोड से भुगतान कर सकेंगे।");
            previewAdminQrCode();
        } else {
            alert("Error: " + (data.message || "Failed to save UPI config"));
        }
    } catch (e) {
        alert("✅ UPI विवरण लोकल ब्राउज़र में सेव हो गए!");
        previewAdminQrCode();
    }
}

function previewAdminQrCode() {
    const upiInp = document.getElementById("adminUpiIdInput");
    const payeeInp = document.getElementById("adminUpiPayeeInput");
    const qrImg = document.getElementById("adminQrPreviewImg");
    const upiText = document.getElementById("adminQrPreviewUpiText");

    const upiId = upiInp ? upiInp.value.trim() || "7972296879@ybl" : "7972296879@ybl";
    const payee = payeeInp ? payeeInp.value.trim() || "Devendra Koli - Shree Sai Mobile" : "Devendra Koli - Shree Sai Mobile";

    const testUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payee)}&am=100&cu=INR`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=6&data=${encodeURIComponent(testUri)}`;

    if (qrImg) qrImg.src = qrUrl;
    if (upiText) upiText.textContent = upiId;
}

