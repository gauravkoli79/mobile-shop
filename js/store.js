/**
 * Shree Sai Mobile & Electronics - Storefront Script
 * Interactive E-Commerce Logic (Product Catalog, Filters, Search, Cart & WhatsApp Checkout)
 */

// ==========================================================
// 1. Full Electronics & Appliances Catalog
// ==========================================================
const API_BASE = (window.location.protocol === "file:") ? "http://localhost:8000" : "";

const defaultProductsData = [
    // 1. Mobiles (Smartphones)
    {
        id: "m1",
        name: "Samsung Galaxy S24 Ultra 5G",
        category: "mobiles",
        brand: "Samsung",
        specs: "12GB RAM • 256GB Storage • AI Features • S-Pen",
        price: 109999,
        originalPrice: 129999,
        discount: "15% OFF",
        rating: "4.8",
        reviews: "3,410",
        emi: "₹4,583/m",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "m2",
        name: "Apple iPhone 15 Pro",
        category: "mobiles",
        brand: "Apple",
        specs: "128GB • Natural Titanium • A17 Pro Chip",
        price: 124900,
        originalPrice: 134900,
        discount: "7% OFF",
        rating: "4.9",
        reviews: "5,820",
        emi: "₹5,204/m",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "m3",
        name: "Redmi Note 13 5G",
        category: "mobiles",
        brand: "Xiaomi",
        specs: "6GB RAM • 128GB • 108MP 3X Zoom Camera",
        price: 16999,
        originalPrice: 20999,
        discount: "19% OFF",
        rating: "4.4",
        reviews: "8,920",
        emi: "₹1,416/m",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "m4",
        name: "Vivo V30 5G",
        category: "mobiles",
        brand: "Vivo",
        specs: "8GB RAM • 128GB • Smart Aura Light Portrait",
        price: 32999,
        originalPrice: 38999,
        discount: "15% OFF",
        rating: "4.5",
        reviews: "2,190",
        emi: "₹2,749/m",
        image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "m5",
        name: "OnePlus Nord CE4 5G",
        category: "mobiles",
        brand: "OnePlus",
        specs: "8GB RAM • 128GB • 100W SUPERVOOC Charge",
        price: 24999,
        originalPrice: 27999,
        discount: "11% OFF",
        rating: "4.6",
        reviews: "4,300",
        emi: "₹2,083/m",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "m6",
        name: "Realme 12 Pro 5G",
        category: "mobiles",
        brand: "Realme",
        specs: "8GB RAM • 256GB • Submarine Periscope Portrait",
        price: 25999,
        originalPrice: 29999,
        discount: "13% OFF",
        rating: "4.3",
        reviews: "1,870",
        emi: "₹2,166/m",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60"
    },

    // 2. Smart TVs
    {
        id: "tv1",
        name: "Sony Bravia 55-Inch 4K Ultra HD Smart Google TV",
        category: "tvs",
        brand: "Sony",
        specs: "4K HDR • Dolby Atmos • Google TV with Voice Search",
        price: 58990,
        originalPrice: 79900,
        discount: "26% OFF",
        rating: "4.8",
        reviews: "1,240",
        emi: "₹2,458/m",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "tv2",
        name: "Samsung 43-Inch Crystal 4K Vivid Pro Smart TV",
        category: "tvs",
        brand: "Samsung",
        specs: "Crystal Processor 4K • PurColor • Voice Assistant",
        price: 28990,
        originalPrice: 44900,
        discount: "35% OFF",
        rating: "4.5",
        reviews: "3,890",
        emi: "₹1,208/m",
        image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "tv3",
        name: "LG 50-Inch 4K UHD Smart AI ThinQ TV",
        category: "tvs",
        brand: "LG",
        specs: "AI α5 Gen6 Processor • WebOS 23 • Magic Remote",
        price: 38490,
        originalPrice: 59990,
        discount: "36% OFF",
        rating: "4.6",
        reviews: "2,150",
        emi: "₹1,604/m",
        image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=60"
    },

    // 3. Washing Machines
    {
        id: "wm1",
        name: "LG 8 Kg 5-Star Inverter Front Load Washing Machine",
        category: "washing_machines",
        brand: "LG",
        specs: "Direct Drive Motor • Steam Wash • 6 Motion DD",
        price: 34990,
        originalPrice: 47990,
        discount: "27% OFF",
        rating: "4.7",
        reviews: "4,680",
        emi: "₹1,458/m",
        image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "wm2",
        name: "Samsung 7 Kg Fully-Automatic Top Load Washing Machine",
        category: "washing_machines",
        brand: "Samsung",
        specs: "Digital Inverter • Ecobubble™ • Soft Closing Door",
        price: 15490,
        originalPrice: 21500,
        discount: "28% OFF",
        rating: "4.4",
        reviews: "9,120",
        emi: "₹775/m",
        image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "wm3",
        name: "Whirlpool 7.5 Kg 5-Star Semi-Automatic Machine",
        category: "washing_machines",
        brand: "Whirlpool",
        specs: "SuperSoak Technology • Turbodry • Lint Filter",
        price: 10990,
        originalPrice: 14750,
        discount: "25% OFF",
        rating: "4.3",
        reviews: "6,410",
        emi: "₹550/m",
        image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&auto=format&fit=crop&q=60"
    },

    // 4. Audio & Headphones
    {
        id: "a1",
        name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        category: "audio",
        brand: "Sony",
        specs: "Auto NC Optimizer • 30hr Battery • Crystal Clear Hands-Free",
        price: 26990,
        originalPrice: 34990,
        discount: "23% OFF",
        rating: "4.9",
        reviews: "1,520",
        emi: "₹1,125/m",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "a2",
        name: "OnePlus Bullets Wireless Z2 Bluetooth Earphones",
        category: "audio",
        brand: "OnePlus",
        specs: "12.4mm Drivers • 30hr Battery Life • Fast Charge",
        price: 1699,
        originalPrice: 2299,
        discount: "26% OFF",
        rating: "4.5",
        reviews: "18,400",
        emi: "Standard EMI",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "a3",
        name: "Boat Airdopes 141 ANC TWS Earbuds",
        category: "audio",
        brand: "Boat",
        specs: "Active Noise Cancellation • 42hr Playtime • Beast Mode",
        price: 1499,
        originalPrice: 4490,
        discount: "67% OFF",
        rating: "4.2",
        reviews: "24,500",
        emi: "Standard EMI",
        image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&auto=format&fit=crop&q=60"
    },

    // 5. Chargers & Accessories
    {
        id: "c1",
        name: "Boat 65W GaN Dual Port Fast Wall Charger",
        category: "chargers",
        brand: "Boat",
        specs: "GaN Fast Tech • Type-C & USB-A • Laptop & Phone Safe",
        price: 1499,
        originalPrice: 2999,
        discount: "50% OFF",
        rating: "4.6",
        reviews: "5,300",
        emi: "Standard EMI",
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: "c2",
        name: "Xiaomi 20000mAh 18W Fast Charging Power Bank",
        category: "chargers",
        brand: "Xiaomi",
        specs: "Triple Output Ports • Dual Input • Matte Metallic Finish",
        price: 1999,
        originalPrice: 2499,
        discount: "20% OFF",
        rating: "4.8",
        reviews: "14,200",
        emi: "Standard EMI",
        image: "images/products/xiaomi_power_bank.jpg"
    },
    {
        id: "c3",
        name: "9D Curved Edge Tempered Glass + Matte Case Combo",
        category: "accessories",
        brand: "Apple",
        specs: "9H Hardness • Anti-Fingerprint • Fits All Major Models",
        price: 299,
        originalPrice: 699,
        discount: "57% OFF",
        rating: "4.4",
        reviews: "7,800",
        emi: "Instant Dispatch",
        image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop&q=60"
    }
];

// Dynamically initialized product store state
let productsData = (function() {
    try {
        const saved = localStorage.getItem('shree_sai_store_products');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch(e) {}
    return defaultProductsData;
})();

// ==========================================================
// 2. State & Cart Management & Language Switcher
// ==========================================================
let customerCart = JSON.parse(localStorage.getItem('shree_sai_cart') || '[]');
let activeCategory = "all";
let activeBrand = "all";
let currentLang = localStorage.getItem('shree_sai_lang') || 'en';

function setStoreLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('shree_sai_lang', lang);

    // 1. Update header button active classes
    const btnHeaderEn = document.getElementById("btnHeaderLangEn");
    const btnHeaderHi = document.getElementById("btnHeaderLangHi");
    if (btnHeaderEn && btnHeaderHi) {
        if (lang === 'hi') {
            btnHeaderHi.className = "btn btn-sm py-1 px-2 fw-bold btn-primary text-white";
            btnHeaderEn.className = "btn btn-sm py-1 px-2 fw-bold btn-light text-dark";
        } else {
            btnHeaderEn.className = "btn btn-sm py-1 px-2 fw-bold btn-primary text-white";
            btnHeaderHi.className = "btn btn-sm py-1 px-2 fw-bold btn-light text-dark";
        }
    }

    // 2. Translate all elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // 4. Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // 5. Update title & lang
    document.documentElement.lang = lang;
    document.title = lang === 'hi'
        ? "श्री साई मोबाइल एवं इलेक्ट्रॉनिक्स | ऑनलाइन स्टोर"
        : "Shree Sai Mobile & Electronics | Online Store";

    // 6. Re-render product cards and cart drawer
    renderProducts();
    renderCartDrawer();
    checkLoggedInUser();
}

window.setLanguage = setStoreLanguage;
window.setStoreLanguage = setStoreLanguage;

function fetchStoreProducts() {
    fetch(`${API_BASE}/api/get-products`)
        .then(res => res.json())
        .then(data => {
            if (data.success && Array.isArray(data.products) && data.products.length > 0) {
                productsData = data.products;
                try {
                    localStorage.setItem('shree_sai_store_products', JSON.stringify(productsData));
                } catch(e) {}
                renderProducts();
            }
        })
        .catch(err => {
            console.warn("Products sync notice (offline mode active):", err);
        });
}

// Cross-tab real-time sync with Admin panel
try {
    const storeSyncChannel = new BroadcastChannel('shree_sai_store_channel');
    storeSyncChannel.onmessage = (event) => {
        if (event.data?.type === 'PRODUCT_SAVED' && event.data?.product) {
            const incoming = event.data.product;
            const existingIdx = productsData.findIndex(p => p.id === incoming.id);
            if (existingIdx >= 0) {
                productsData[existingIdx] = incoming;
            } else {
                productsData.unshift(incoming);
            }
            try {
                localStorage.setItem('shree_sai_store_products', JSON.stringify(productsData));
            } catch(e) {}
            renderProducts();
        } else if (event.data?.type === 'PRODUCT_DELETED' && event.data?.productId) {
            productsData = productsData.filter(p => p.id !== event.data.productId);
            try {
                localStorage.setItem('shree_sai_store_products', JSON.stringify(productsData));
            } catch(e) {}
            renderProducts();
        }
    };
} catch(e) {}

document.addEventListener("DOMContentLoaded", () => {
    initCategoryTabs();
    initBrandClicks();
    initStoreSearch();
    updateCartBadges();
    checkLoggedInUser();
    initStoreCarousel();
    fetchUpiConfig();
    fetchStoreProducts();
    
    // Initialize Language
    setStoreLanguage(currentLang);
});

function initStoreCarousel() {
    const carouselEl = document.getElementById('heroPromoCarousel');
    if (carouselEl && typeof bootstrap !== 'undefined') {
        const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
            interval: 2000,
            ride: 'carousel',
            pause: 'hover',
            wrap: true
        });
        carouselInstance.cycle();
    }
}

function checkLoggedInUser() {
    const userStr = localStorage.getItem('shree_sai_user');
    const chip = document.getElementById("userAccountTopChip");
    const savedCard = document.getElementById("checkoutSavedProfileState");
    const editCard = document.getElementById("checkoutEditState");
    const savedName = document.getElementById("checkoutSavedName");
    const savedPhone = document.getElementById("checkoutSavedPhone");
    const savedAddr = document.getElementById("checkoutSavedAddress");
    const nameInp = document.getElementById("checkoutName");
    const phoneInp = document.getElementById("checkoutPhone");
    const addrInp = document.getElementById("checkoutAddress");

    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.role === 'CUSTOMER' || user.phone) {
                if (chip) {
                    chip.innerHTML = `
                        <div class="dropdown d-inline-block">
                            <button class="btn btn-light btn-sm border rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-2 shadow-xs dropdown-toggle" type="button" id="customerDropdownBtn" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 0.8rem;">
                                <i class="fa-solid fa-circle-user text-primary fa-lg"></i>
                                <span class="text-dark fw-bold" id="topCustomerName">${user.name || 'My Account'}</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 p-2" aria-labelledby="customerDropdownBtn" style="min-width: 240px; font-size: 0.85rem; z-index: 1060;">
                                <li class="px-3 py-2 bg-light rounded-3 mb-2">
                                    <div class="fw-bold text-dark text-truncate" style="max-width: 210px;">${user.name || 'Valued Customer'}</div>
                                    <small class="text-muted"><i class="fa-solid fa-phone text-success me-1"></i>${user.phone}</small>
                                </li>
                                <li>
                                    <a class="dropdown-item py-2 fw-semibold rounded-2 d-flex align-items-center gap-2" href="javascript:void(0)" onclick="openCustomerProfileModal()">
                                        <i class="fa-solid fa-id-badge text-primary"></i>
                                        <span data-i18n="myProfileDetails">${currentLang === 'hi' ? 'मेरी प्रोफाइल / विवरण' : 'About Details / My Profile'}</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item py-2 fw-semibold rounded-2 d-flex align-items-center gap-2" href="javascript:void(0)" onclick="openCustomerOrdersModal()">
                                        <i class="fa-solid fa-box-open text-success"></i>
                                        <span data-i18n="myOrdersLabel">${currentLang === 'hi' ? 'मेरे पिछले ऑर्डर्स' : 'My Orders'}</span>
                                    </a>
                                </li>
                                <li><hr class="dropdown-divider my-1"></li>
                                <li>
                                    <a class="dropdown-item py-2 fw-semibold text-danger rounded-2 d-flex align-items-center gap-2" href="javascript:void(0)" onclick="logoutCustomer()">
                                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                        <span data-i18n="logoutLabel">${currentLang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    `;
                }

                // Setup checkout delivery state: Show saved profile card
                if (savedCard && editCard) {
                    savedCard.classList.remove("d-none");
                    editCard.classList.add("d-none");
                    if (savedName) savedName.textContent = user.name || 'Valued Customer';
                    if (savedPhone) savedPhone.textContent = user.phone || '';
                    if (savedAddr) savedAddr.textContent = user.address || (currentLang === 'hi' ? 'पता दर्ज नहीं है' : 'Address not specified');
                }

                // Prefill inputs
                if (nameInp && user.name) nameInp.value = user.name;
                if (phoneInp && user.phone) phoneInp.value = user.phone;
                if (addrInp && user.address) addrInp.value = user.address;
                return;
            }
        } catch(e) {}
    }

    // Default: Guest (Not Logged In)
    if (chip) {
        chip.innerHTML = `
            <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1 shadow-xs" style="font-size: 0.8rem;" onclick="openCustomerAuthModal()">
                <i class="fa-regular fa-circle-user"></i>
                <span data-i18n="accountGuest">${currentLang === 'hi' ? 'मेरा खाता' : 'My Account'}</span>
            </button>
        `;
    }

    if (savedCard && editCard) {
        savedCard.classList.add("d-none");
        editCard.classList.remove("d-none");
    }
}

function toggleEditCheckoutDetails(showEdit) {
    const savedCard = document.getElementById("checkoutSavedProfileState");
    const editCard = document.getElementById("checkoutEditState");
    if (!savedCard || !editCard) return;

    if (showEdit) {
        savedCard.classList.add("d-none");
        editCard.classList.remove("d-none");
        const nameInp = document.getElementById("checkoutName");
        if (nameInp) nameInp.focus();
    } else {
        savedCard.classList.remove("d-none");
        editCard.classList.add("d-none");
    }
}

function openCustomerAuthModal() {
    const userStr = localStorage.getItem('shree_sai_user');
    if (userStr) {
        openCustomerProfileModal();
        return;
    }
    const modalEl = document.getElementById('customerAuthModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
}

function promptReturningCustomerLookup() {
    openCustomerAuthModal();
}

function handleCustomerLookupSubmit(e) {
    e.preventDefault();
    const phoneInput = document.getElementById("lookupCustomerPhone");
    const phone = phoneInput?.value.trim() || '';

    if (phone.length < 10) {
        alert(currentLang === 'hi' ? "कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें!" : "Please enter a valid 10-digit mobile number!");
        return;
    }

    const registry = JSON.parse(localStorage.getItem('shree_sai_registered_customers') || '[]');
    const existing = registry.find(c => c.phone === phone);

    const allOrders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
    const customerOrder = allOrders.find(o => o.customerPhone === phone);

    if (existing || customerOrder) {
        const customerData = {
            role: 'CUSTOMER',
            name: existing ? existing.name : (customerOrder ? customerOrder.customerName : 'Valued Customer'),
            phone: phone,
            address: existing ? (existing.address || '') : (customerOrder ? (customerOrder.deliveryAddress || '') : ''),
            registeredDateDisplay: existing ? existing.registeredDateDisplay : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            registeredAt: existing ? existing.registeredAt : new Date().toISOString(),
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('shree_sai_user', JSON.stringify(customerData));
        checkLoggedInUser();

        // Close auth modal
        const authModalEl = document.getElementById('customerAuthModal');
        if (authModalEl && typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getInstance(authModalEl);
            if (modal) modal.hide();
        }

        alert(currentLang === 'hi' ? `नमस्ते ${customerData.name} जी! आपका खाता लोड हो गया है। ✅` : `Welcome back, ${customerData.name}! Your account has been loaded. ✅`);
        openCustomerProfileModal();
    } else {
        alert(currentLang === 'hi' 
            ? "इस नंबर पर कोई पुराना रिकॉर्ड नहीं मिला। चिंता न करें! आप सीधे खरीदारी कर सकते हैं, ऑर्डर करते ही आपका खाता अपने आप बन जाएगा।" 
            : "No previous account found for this number. Don't worry! You can browse and order freely; your account will be created automatically at checkout.");
    }
}

function handleCustomerAccountClick() {
    openCustomerAuthModal();
}

function openCustomerProfileModal() {
    const userStr = localStorage.getItem('shree_sai_user');
    if (!userStr) {
        openCustomerAuthModal();
        return;
    }

    try {
        const user = JSON.parse(userStr);
        // Look up persistent registry for registration details
        const registry = JSON.parse(localStorage.getItem('shree_sai_registered_customers') || '[]');
        const existing = registry.find(c => c.phone === user.phone) || user;

        // Calculate total orders placed by this customer phone
        const allOrders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
        const myOrders = allOrders.filter(o => o.customerPhone === user.phone);

        // Populate modal fields
        const nameField = document.getElementById("profCustName");
        const phoneField = document.getElementById("profCustPhone");
        const addrField = document.getElementById("profCustAddress");
        const dateLabel = document.getElementById("profCustRegisteredDate");
        const ordersCountLabel = document.getElementById("profCustTotalOrders");

        if (nameField) nameField.value = existing.name || user.name || '';
        if (phoneField) phoneField.value = user.phone || '';
        if (addrField) addrField.value = existing.address || user.address || '';
        if (dateLabel) dateLabel.textContent = existing.registeredDateDisplay || (user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Active Customer');
        if (ordersCountLabel) ordersCountLabel.textContent = myOrders.length;

        const modalEl = document.getElementById('customerProfileModal');
        if (modalEl && typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
            modal.show();
        }
    } catch(e) {
        console.error("Error opening customer profile:", e);
    }
}

function saveCustomerProfile(e) {
    e.preventDefault();
    const userStr = localStorage.getItem('shree_sai_user');
    if (!userStr) return;

    try {
        const user = JSON.parse(userStr);
        const newName = document.getElementById("profCustName").value.trim();
        const newAddress = document.getElementById("profCustAddress").value.trim();

        if (!newName) {
            alert(currentLang === 'hi' ? "कृपया अपना पूरा नाम दर्ज करें!" : "Please enter your full name!");
            return;
        }

        user.name = newName;
        user.address = newAddress;
        localStorage.setItem('shree_sai_user', JSON.stringify(user));

        // Update persistent registry
        const registry = JSON.parse(localStorage.getItem('shree_sai_registered_customers') || '[]');
        const idx = registry.findIndex(c => c.phone === user.phone);
        if (idx >= 0) {
            registry[idx].name = newName;
            registry[idx].address = newAddress;
            localStorage.setItem('shree_sai_registered_customers', JSON.stringify(registry));
        }

        // Update checkout inputs if present
        const nameInp = document.getElementById("checkoutName");
        const addrInp = document.getElementById("checkoutAddress");
        if (nameInp) nameInp.value = newName;
        if (addrInp) addrInp.value = newAddress;

        // Re-check logged in user to update top chip
        checkLoggedInUser();

        alert(currentLang === 'hi' ? "आपकी प्रोफाइल जानकारी सफलतापूर्वक अपडेट कर दी गई है! ✅" : "Your profile details have been updated successfully! ✅");

        const modalEl = document.getElementById('customerProfileModal');
        if (modalEl && typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
    } catch(err) {
        console.error("Error saving profile:", err);
    }
}

function openCustomerOrdersModal() {
    const userStr = localStorage.getItem('shree_sai_user');
    if (!userStr) {
        openCustomerAuthModal();
        return;
    }

    try {
        const user = JSON.parse(userStr);
        const allOrders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
        const myOrders = allOrders.filter(o => o.customerPhone === user.phone);
        const container = document.getElementById("customerOrdersListContainer");

        if (!container) return;

        if (myOrders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="fa-solid fa-box-open fa-3x mb-3 text-secondary opacity-25"></i>
                    <h6 class="fw-bold">${currentLang === 'hi' ? 'अभी तक कोई पिछला ऑर्डर नहीं है' : 'No past orders found'}</h6>
                    <p class="small mb-0">${currentLang === 'hi' ? 'जब आप स्टोर से कोई सामान ऑर्डर करेंगे, तो उसकी पूरी रसीद यहाँ दिखेगी।' : 'When you place orders on the store, your receipt and status will show up here.'}</p>
                </div>
            `;
        } else {
            container.innerHTML = myOrders.map(order => {
                let badgeClass = "bg-warning text-dark";
                let statusIcon = "fa-clock";
                let statusLabel = order.status;

                if (order.status === "Confirmed") {
                    badgeClass = "bg-info text-white";
                    statusIcon = "fa-check";
                } else if (order.status === "Delivered") {
                    badgeClass = "bg-success text-white";
                    statusIcon = "fa-circle-check";
                } else if (order.status === "Cancelled") {
                    badgeClass = "bg-danger text-white";
                    statusIcon = "fa-circle-xmark";
                    statusLabel = currentLang === 'hi' ? 'रद्द हुआ (Cancelled)' : 'Cancelled';
                } else if (order.status === "Replacement Requested") {
                    badgeClass = "bg-warning text-dark";
                    statusIcon = "fa-arrows-rotate";
                    statusLabel = currentLang === 'hi' ? 'रिप्लेसमेंट अनुरोध' : 'Replacement Requested';
                }

                const canCancel = (order.status === "Pending" || order.status === "Confirmed");
                const canReplace = (order.status !== "Cancelled" && order.status !== "Replacement Requested");

                return `
                    <div class="card border rounded-3 mb-3 shadow-xs overflow-hidden">
                        <div class="card-header bg-light d-flex justify-content-between align-items-center py-2 px-3">
                            <div>
                                <span class="fw-bold text-primary font-monospace">${order.orderId}</span>
                                <small class="text-muted ms-2"><i class="fa-regular fa-calendar me-1"></i>${order.displayDate || ''} ${order.displayTime || ''}</small>
                            </div>
                            <span class="badge ${badgeClass} px-2 py-1"><i class="fa-solid ${statusIcon} me-1"></i>${statusLabel}</span>
                        </div>
                        <div class="card-body p-3">
                            <div class="mb-2">
                                ${(order.items || []).map(i => `
                                    <div class="d-flex justify-content-between small mb-1">
                                        <span>${i.name} <strong>x${i.qty}</strong></span>
                                        <span class="text-dark fw-bold">₹${(i.price * i.qty).toLocaleString('en-IN')}</span>
                                    </div>
                                `).join("")}
                            </div>
                            <hr class="my-2">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="text-muted text-truncate" style="max-width: 250px;" title="${order.deliveryAddress}">
                                    <i class="fa-solid fa-location-dot me-1 text-danger"></i>${order.deliveryAddress}
                                </small>
                                <div class="fw-bold text-dark fs-6">₹${order.totalAmount.toLocaleString('en-IN')}</div>
                            </div>

                            ${order.cancelledAt ? `
                                <div class="alert alert-danger py-1 px-2 small mb-2" style="font-size:0.75rem;">
                                    <i class="fa-solid fa-circle-xmark me-1"></i><strong>${currentLang === 'hi' ? 'रद्द हुआ:' : 'Cancelled on:'}</strong> ${order.cancelledAt} ${order.cancelReason ? `— <em>${order.cancelReason}</em>` : ''}
                                </div>
                            ` : ''}

                            ${order.replaceRequestedAt ? `
                                <div class="alert alert-warning py-1 px-2 small mb-2" style="font-size:0.75rem;">
                                    <i class="fa-solid fa-arrows-rotate me-1"></i><strong>${currentLang === 'hi' ? 'रिप्लेसमेंट अनुरोध दर्ज:' : 'Replacement Requested:'}</strong> ${order.replaceRequestedAt} ${order.replaceReason ? `— <em>${order.replaceReason}</em>` : ''}
                                </div>
                            ` : ''}

                            <!-- Action Buttons: Cancel Order, Replace / Return, Send WhatsApp Receipt -->
                            <div class="d-flex flex-wrap gap-2 pt-2 border-top align-items-center justify-content-end">
                                ${canCancel ? `
                                    <button type="button" class="btn btn-sm btn-outline-danger py-1 px-3 rounded-pill fw-semibold" onclick="requestCancelCustomerOrder('${order.orderId}')">
                                        <i class="fa-solid fa-ban me-1"></i> ${currentLang === 'hi' ? 'ऑर्डर रद्द करें (Cancel)' : 'Cancel Order'}
                                    </button>
                                ` : ''}

                                ${canReplace ? `
                                    <button type="button" class="btn btn-sm btn-outline-warning text-dark py-1 px-3 rounded-pill fw-semibold" onclick="requestReplaceCustomerOrder('${order.orderId}')">
                                        <i class="fa-solid fa-arrows-rotate me-1"></i> ${currentLang === 'hi' ? 'एक्सचेंज / रिप्लेसमेंट (Replace)' : 'Replace / Exchange'}
                                    </button>
                                ` : ''}

                                <button type="button" class="btn btn-sm btn-outline-success py-1 px-3 rounded-pill fw-semibold" onclick="sendOrderReceiptWhatsApp('${order.orderId}')">
                                    <i class="fa-brands fa-whatsapp me-1"></i> ${currentLang === 'hi' ? 'WhatsApp रसीद' : 'WhatsApp Receipt'}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");
        }

        // Close profile modal if open, then open orders modal
        const profModalEl = document.getElementById('customerProfileModal');
        if (profModalEl && typeof bootstrap !== 'undefined') {
            const profModal = bootstrap.Modal.getInstance(profModalEl);
            if (profModal) profModal.hide();
        }

        const ordersModalEl = document.getElementById('customerOrdersModal');
        if (ordersModalEl && typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getOrCreateInstance(ordersModalEl);
            modal.show();
        }
    } catch(e) {
        console.error("Error opening orders modal:", e);
    }
}

// Customer Order Cancellation
function requestCancelCustomerOrder(orderId) {
    const allOrders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
    const order = allOrders.find(o => o.orderId === orderId);
    if (!order) return;

    const confirmMsg = currentLang === 'hi' 
        ? `क्या आप वाकई ऑर्डर ${orderId} को रद्द (Cancel) करना चाहते हैं?` 
        : `Are you sure you want to cancel order ${orderId}?`;
    if (!confirm(confirmMsg)) return;

    const reasonPrompt = currentLang === 'hi'
        ? "कृपया रद्द करने का कारण बताएं (जैसे: गलती से ऑर्डर हो गया, पता बदलना है, आदि):"
        : "Please enter reason for cancellation:";
    const defaultReason = currentLang === 'hi' ? "गलती से ऑर्डर हो गया" : "Ordered by mistake";
    const reason = prompt(reasonPrompt, defaultReason);
    if (reason === null) return;

    const now = new Date();
    const cancelTimestamp = `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    order.status = "Cancelled";
    order.cancelledAt = cancelTimestamp;
    order.cancelReason = reason || defaultReason;

    localStorage.setItem('shree_sai_online_orders', JSON.stringify(allOrders));

    // Sync with central server
    fetch(`${API_BASE}/api/update-order-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            orderId: orderId,
            status: "Cancelled",
            reason: reason || defaultReason
        })
    }).catch(e => console.warn("Status update sync error:", e));

    // Save alert for Admin in notifications
    const existingNotifs = JSON.parse(localStorage.getItem('shree_sai_notifications') || '[]');
    existingNotifs.unshift({
        id: "notif-" + Date.now(),
        type: "ORDER_CANCELLED",
        orderId: orderId,
        title: `⚠️ Order Cancelled: ${orderId}`,
        message: `${order.customerName} cancelled order ${orderId} on ${cancelTimestamp}. Reason: ${reason || defaultReason}`,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        timestamp: now.toISOString(),
        displayTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        read: false
    });
    localStorage.setItem('shree_sai_notifications', JSON.stringify(existingNotifs));

    // Instant cross-tab notification via BroadcastChannel
    try {
        const bc = new BroadcastChannel('shree_sai_store_channel');
        bc.postMessage({ type: 'ORDER_CANCELLED', orderId: orderId, reason: reason || defaultReason });
    } catch(e) {}

    showToast(currentLang === 'hi' ? "ऑर्डर सफलतापूर्वक रद्द कर दिया गया है!" : "Order cancelled successfully!");
    openCustomerOrdersModal();

    // Option to notify proprietor on WhatsApp
    setTimeout(() => {
        const waAsk = currentLang === 'hi'
            ? "क्या आप दुकानदार (प्रोपराइटर) को भी WhatsApp पर कैंसलेशन सूचना भेजना चाहते हैं?"
            : "Would you like to send cancellation notice to the shop owner on WhatsApp?";
        if (confirm(waAsk)) {
            const waMsg = encodeURIComponent(
`*⚠️ ORDER CANCELLATION NOTICE: SHREE SAI MOBILE*
----------------------------------
*Order ID:* ${order.orderId}
*Customer Name:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Order Date:* ${order.displayDate || ''} at ${order.displayTime || ''}
*Cancellation Time:* ${cancelTimestamp}
*Reason:* ${reason || defaultReason}
----------------------------------
Customer requested cancellation for this order. Please update dispatch records.`
            );
            window.open(`https://api.whatsapp.com/send?phone=917972296879&text=${waMsg}`, '_blank');
        }
    }, 400);
}

// Customer Replacement / Return Request
function requestReplaceCustomerOrder(orderId) {
    const allOrders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
    const order = allOrders.find(o => o.orderId === orderId);
    if (!order) return;

    const reasonPrompt = currentLang === 'hi'
        ? "कृपया रिप्लेसमेंट / एक्सचेंज का कारण बताएं (जैसे: डिफेक्टिव पीस, गलत रंग/मॉडल, स्क्रीन/बैटरी समस्या):"
        : "Please enter reason for replacement / exchange (e.g. Defective piece, wrong model/color):";
    const defaultReason = currentLang === 'hi' ? "सामान बदलना या एक्सचेंज करना है" : "Want to exchange/replace item";
    const reason = prompt(reasonPrompt, defaultReason);
    if (reason === null) return;

    const now = new Date();
    const replaceTimestamp = `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    order.status = "Replacement Requested";
    order.replaceRequestedAt = replaceTimestamp;
    order.replaceReason = reason || defaultReason;

    localStorage.setItem('shree_sai_online_orders', JSON.stringify(allOrders));

    // Sync with central server
    fetch(`${API_BASE}/api/update-order-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            orderId: orderId,
            status: "Replacement Requested",
            reason: reason || defaultReason
        })
    }).catch(e => console.warn("Status update sync error:", e));

    // Save alert for Admin in notifications
    const existingNotifs = JSON.parse(localStorage.getItem('shree_sai_notifications') || '[]');
    existingNotifs.unshift({
        id: "notif-" + Date.now(),
        type: "ORDER_REPLACEMENT",
        orderId: orderId,
        title: `🔄 Replacement Requested: ${orderId}`,
        message: `${order.customerName} requested replacement for ${orderId} on ${replaceTimestamp}. Reason: ${reason || defaultReason}`,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        timestamp: now.toISOString(),
        displayTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        read: false
    });
    localStorage.setItem('shree_sai_notifications', JSON.stringify(existingNotifs));

    // Instant cross-tab notification via BroadcastChannel
    try {
        const bc = new BroadcastChannel('shree_sai_store_channel');
        bc.postMessage({ type: 'ORDER_REPLACEMENT', orderId: orderId, reason: reason || defaultReason });
    } catch(e) {}

    showToast(currentLang === 'hi' ? "रिप्लेसमेंट का अनुरोध दर्ज हो गया है!" : "Replacement request submitted!");
    openCustomerOrdersModal();

    // Auto open WhatsApp with pre-filled message to proprietor
    setTimeout(() => {
        let itemsText = (order.items || []).map((item, idx) => 
            `${idx + 1}. *${item.name}* (Qty: ${item.qty})`
        ).join("\n");

        const waMsg = encodeURIComponent(
`*🔄 REPLACEMENT / EXCHANGE REQUEST: SHREE SAI MOBILE*
----------------------------------
*Order ID:* ${order.orderId}
*Customer Name:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Order Date:* ${order.displayDate || ''} at ${order.displayTime || ''}
*Replacement Request Time:* ${replaceTimestamp}

*Items for Replacement:*
${itemsText}

*Reason for Replacement:*
👉 ${reason || defaultReason}
----------------------------------
Hello Devendra ji, I have requested replacement/exchange for my order. Please guide on pickup/exchange process.`
        );
        window.open(`https://api.whatsapp.com/send?phone=917972296879&text=${waMsg}`, '_blank');
    }, 400);
}

// Send Order Receipt on WhatsApp
function sendOrderReceiptWhatsApp(orderId) {
    const allOrders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
    const order = allOrders.find(o => o.orderId === orderId);
    if (!order) return;
    sendProprietorOrderNotificationWhatsApp(order);
}

// Send Full Structured Notification to Proprietor on WhatsApp with Date & Time
function sendProprietorOrderNotificationWhatsApp(order) {
    if (!order) return;
    let itemsText = (order.items || []).map((item, idx) => 
        `${idx + 1}. *${item.name}* (Qty: ${item.qty}) - ₹${(item.price * item.qty).toLocaleString('en-IN')}`
    ).join("\n");

    const dateStr = order.displayDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = order.displayTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const upiId = currentUpiConfig.upi_id || "7972296879@ybl";
    const payeeName = currentUpiConfig.payee_name || "Devendra Koli - Shree Sai Mobile";
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${order.totalAmount}&cu=INR&tn=${encodeURIComponent(order.orderId)}`;
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(upiLink)}`;

    const msg = encodeURIComponent(
`🛒 *NEW ONLINE ORDER ALERT: SHREE SAI MOBILE & ELECTRONICS*
----------------------------------
📅 *Order Date & Time:* ${dateStr} at ${timeStr}
🆔 *Order ID:* ${order.orderId}
👤 *Customer Name:* ${order.customerName}
📞 *Customer Phone:* ${order.customerPhone}
📍 *Delivery Address:* ${order.deliveryAddress}

📦 *Ordered Products:*
${itemsText}

💰 *Total Bill Amount:* ₹${order.totalAmount.toLocaleString('en-IN')}
💳 *Payment Mode:* ${order.paymentMethod}${order.utrNumber ? `\n🔢 *UTR/UPI Ref No:* ${order.utrNumber}` : ''}
⚡ *Current Status:* ${order.status || 'Pending Dispatch'}
----------------------------------
👉 *Quick UPI Pay Link (If not paid):*
${upiLink}

📸 *QR Code Link:*
${qrLink}

🆔 *Shop UPI ID:* ${upiId} (${payeeName})

🔔 *Proprietor Notification:* New order received via Online Store. Please confirm dispatch details!`
    );

    const waUrl = `https://api.whatsapp.com/send?phone=917972296879&text=${msg}`;
    try {
        const w = window.open(waUrl, '_blank');
        if (!w || w.closed || typeof w.closed === 'undefined') {
            // Popup blocked by browser policy, open directly
            window.location.href = waUrl;
        }
    } catch(e) {
        window.location.href = waUrl;
    }
}

function logoutCustomer() {
    localStorage.removeItem('shree_sai_user');
    checkLoggedInUser();
    alert(currentLang === 'hi' ? "आप सफलतापूर्वक लॉगआउट हो गए हैं।" : "You have been logged out successfully.");
}

// ==========================================================
// 3. Render Product Cards Grid
// ==========================================================
function renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    const searchQuery = (document.getElementById("storeSearchInput")?.value || "").toLowerCase().trim();

    const filtered = productsData.filter(item => {
        const itemCat = (item.category || "").toLowerCase();
        const itemBrand = (item.brand || "").toLowerCase();
        const selCat = (activeCategory || "all").toLowerCase();
        const selBrand = (activeBrand || "all").toLowerCase();

        const matchesCategory = (selCat === "all") || (itemCat === selCat);
        const isXiaomiMatch = (selBrand === "xiaomi" && itemBrand === "mi") || (selBrand === "mi" && itemBrand === "xiaomi");
        const matchesBrand = (selBrand === "all") || (itemBrand === selBrand) || isXiaomiMatch;
        const matchesSearch = !searchQuery ||
                              (item.name && item.name.toLowerCase().includes(searchQuery)) ||
                              (item.specs && item.specs.toLowerCase().includes(searchQuery)) ||
                              (item.brand && item.brand.toLowerCase().includes(searchQuery)) ||
                              (item.category && item.category.toLowerCase().includes(searchQuery));

        return matchesCategory && matchesBrand && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-box-open fa-3x text-muted mb-3 opacity-25"></i>
                <h5 class="fw-bold text-dark">No products found</h5>
                <p class="text-muted small">Try adjusting your search or category filters.</p>
                <button class="btn btn-primary btn-sm rounded-pill px-4" onclick="resetFilters()">View All Products</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(product => {
        const fallbackImg = (product.name && product.name.toLowerCase().includes('power bank'))
            ? 'images/products/xiaomi_power_bank.jpg'
            : 'images/products/xiaomi_power_bank.jpg';
        return `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="product-card">
                    <span class="discount-tag">${product.discount || 'Special Offer'}</span>
                    
                    <div class="product-img-box">
                        <img src="${product.image || fallbackImg}" alt="${product.name}" loading="lazy" onerror="this.src='${fallbackImg}'">
                    </div>

                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="rating-pill">${product.rating} <i class="fa-solid fa-star" style="font-size: 0.65rem;"></i></span>
                        <small class="text-muted">(${product.reviews})</small>
                    </div>

                    <h6 class="product-title" title="${product.name}">${product.name}</h6>
                    <div class="product-specs-sub text-truncate">${product.specs}</div>

                    <div class="price-row">
                        <span class="current-price">₹${product.price.toLocaleString('en-IN')}</span>
                        <span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                    </div>

                    <div class="d-flex gap-2">
                        <button class="btn-add-cart" onclick="addToCart('${product.id}')">
                            <i class="fa-solid fa-cart-plus"></i> ${(typeof translations !== 'undefined' && translations[currentLang]?.addBtn) || 'Add'}
                        </button>
                        <button class="btn-buy-now" onclick="quickBuy('${product.id}')">
                            ${(typeof translations !== 'undefined' && translations[currentLang]?.buyBtn) || 'Buy'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    // Update Products Count
    const countEl = document.getElementById("productsGridCount");
    if (countEl) {
        countEl.textContent = `${filtered.length} ${currentLang === 'hi' ? 'सामान उपलब्ध' : 'Items Available'}`;
    }

    // Update Section Title & Active Filter Badge Banner
    const titleEl = document.getElementById("productsGridHeaderTitle");
    const filterBanner = document.getElementById("activeFilterBadgeBanner");
    const filterText = document.getElementById("activeFilterText");

    if (searchQuery.length > 0) {
        if (titleEl) {
            titleEl.textContent = currentLang === 'hi'
                ? `खोज परिणाम: "${document.getElementById("storeSearchInput")?.value.trim()}"`
                : `Search Results for "${document.getElementById("storeSearchInput")?.value.trim()}"`;
        }
    } else {
        if (titleEl) {
            titleEl.textContent = (typeof translations !== 'undefined' && translations[currentLang]?.featuredTitle) || 'Featured Products & Appliances';
        }
    }

    if (filterBanner && filterText) {
        if (activeCategory !== "all" || activeBrand !== "all" || searchQuery.length > 0) {
            filterBanner.classList.remove("d-none");
            let labels = [];
            if (searchQuery.length > 0) {
                labels.push(`${currentLang === 'hi' ? '🔍 खोज:' : '🔍 Search:'} "${document.getElementById("storeSearchInput")?.value.trim()}"`);
            }
            if (activeCategory !== "all") {
                const catNames = {
                    mobiles: currentLang === 'hi' ? "स्मार्टफोन (Mobiles)" : "Mobiles & Smartphones",
                    tvs: currentLang === 'hi' ? "स्मार्ट 4K टीवी (Smart TVs)" : "Smart 4K TVs",
                    washing_machines: currentLang === 'hi' ? "वाशिंग मशीन (Washing Machines)" : "Washing Machines",
                    audio: currentLang === 'hi' ? "ईयरबड्स और ऑडियो (Audio & Earbuds)" : "Audio & Earbuds",
                    chargers: currentLang === 'hi' ? "फास्ट चार्जर्स (Fast Chargers)" : "Fast Chargers",
                    accessories: currentLang === 'hi' ? "कवर्स और एक्सेसरीज (Accessories)" : "Accessories & Covers"
                };
                labels.push(`${currentLang === 'hi' ? 'कैटेगरी: ' : 'Category: '} ${catNames[activeCategory] || activeCategory}`);
            }
            if (activeBrand !== "all") {
                labels.push(`${currentLang === 'hi' ? 'ब्रांड: ' : 'Brand: '} ${activeBrand}`);
            }
            filterText.textContent = labels.join(" • ");
        } else {
            filterBanner.classList.add("d-none");
        }
    }
}

// ==========================================================
// 4. Filter & Search Controls & Meesho-Style Category Explorer
// ==========================================================
function openCategoriesOffcanvas() {
    const offcanvasEl = document.getElementById('categoriesOffcanvas');
    if (offcanvasEl && typeof bootstrap !== 'undefined') {
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
        offcanvas.show();
    }
}
window.openCategoriesModal = openCategoriesOffcanvas;
window.openCategoriesOffcanvas = openCategoriesOffcanvas;

function showMeeshoCategoryDetail(catKey) {
    // 1. Update active rail item on left
    document.querySelectorAll(".meesho-rail-item").forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-meesho-cat") === catKey);
    });

    // 2. Show corresponding panel in right content area
    document.querySelectorAll(".meesho-category-panel").forEach(panel => {
        const isTarget = panel.getAttribute("data-panel-cat") === catKey;
        panel.classList.toggle("d-none", !isTarget);
        panel.classList.toggle("d-block", isTarget);
    });
}
window.showMeeshoCategoryDetail = showMeeshoCategoryDetail;

function selectCategory(catKey) {
    activeCategory = catKey;
    activeBrand = "all"; // Reset brand filter on category change
    
    // Close offcanvas if open
    const offcanvasEl = document.getElementById('categoriesOffcanvas');
    if (offcanvasEl && typeof bootstrap !== 'undefined') {
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvas) offcanvas.hide();
    }

    // Update horizontal category tabs
    document.querySelectorAll(".cat-tab").forEach(tab => {
        if (!tab.classList.contains("btn-all-cats")) {
            tab.classList.toggle("active", tab.dataset.category === catKey);
        }
    });

    // Update homepage quick cards
    document.querySelectorAll(".category-quick-card").forEach(card => {
        const cardCat = card.getAttribute("data-category");
        card.classList.toggle("active-category-card", cardCat === catKey);
    });

    // Sync Meesho left rail state
    document.querySelectorAll(".meesho-rail-item").forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-meesho-cat") === catKey);
    });

    renderProducts();

    // Smooth scroll to products grid
    document.getElementById("productsGridSection")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.selectCategory = selectCategory;

function selectBrandFromMeesho(brandName, catKey) {
    activeBrand = brandName;
    activeCategory = catKey || "all";

    // Close offcanvas if open
    const offcanvasEl = document.getElementById('categoriesOffcanvas');
    if (offcanvasEl && typeof bootstrap !== 'undefined') {
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvas) offcanvas.hide();
    }

    document.querySelectorAll(".cat-tab").forEach(tab => {
        if (!tab.classList.contains("btn-all-cats")) {
            tab.classList.toggle("active", tab.dataset.category === activeCategory);
        }
    });

    renderProducts();
    document.getElementById("productsGridSection")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.selectBrandFromMeesho = selectBrandFromMeesho;

function initCategoryTabs() {
    const tabs = document.querySelectorAll(".cat-tab");
    tabs.forEach(tab => {
        if (tab.classList.contains("btn-all-cats")) return;
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            activeCategory = tab.dataset.category || "all";
            activeBrand = "all"; // Reset brand filter on category change
            
            // Sync homepage quick cards
            document.querySelectorAll(".category-quick-card").forEach(card => {
                const cardCat = card.getAttribute("data-category");
                card.classList.toggle("active-category-card", cardCat === activeCategory);
            });

            renderProducts();
        });
    });
}

function initBrandClicks() {
    const brandLinks = document.querySelectorAll(".brand-circle-item");
    brandLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const brand = link.dataset.brand;
            activeBrand = brand;
            activeCategory = "all"; // Show all products for this brand
            
            // Highlight All category tab
            document.querySelectorAll(".cat-tab").forEach(t => {
                t.classList.toggle("active", t.dataset.category === "all");
            });
            document.querySelectorAll(".category-quick-card").forEach(c => {
                c.classList.remove("active-category-card");
            });

            renderProducts();
            // Smooth scroll to product grid
            document.getElementById("productsGridSection")?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function scrollToSearchResults() {
    const section = document.getElementById("productsGridSection");
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.scrollToSearchResults = scrollToSearchResults;

function triggerStoreSearch() {
    const searchInput = document.getElementById("storeSearchInput");
    if (searchInput) {
        renderProducts();
        scrollToSearchResults();
    }
}
window.triggerStoreSearch = triggerStoreSearch;

function clearStoreSearch() {
    const searchInput = document.getElementById("storeSearchInput");
    const clearBtn = document.getElementById("storeSearchClearBtn");
    if (searchInput) {
        searchInput.value = "";
        if (clearBtn) clearBtn.classList.add("d-none");
        renderProducts();
        searchInput.focus();
    }
}
window.clearStoreSearch = clearStoreSearch;

let searchScrollDebounce = null;

function initStoreSearch() {
    const searchInput = document.getElementById("storeSearchInput");
    const clearBtn = document.getElementById("storeSearchClearBtn");
    if (!searchInput) return;

    function handleSearchState() {
        const val = searchInput.value.trim();
        if (clearBtn) {
            if (val.length > 0) {
                clearBtn.classList.remove("d-none");
            } else {
                clearBtn.classList.add("d-none");
            }
        }
    }

    searchInput.addEventListener("input", () => {
        handleSearchState();
        renderProducts();

        const query = searchInput.value.trim();
        if (query.length > 0) {
            clearTimeout(searchScrollDebounce);
            searchScrollDebounce = setTimeout(() => {
                scrollToSearchResults();
            }, 300);
        }
    });

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            clearTimeout(searchScrollDebounce);
            renderProducts();
            scrollToSearchResults();
            searchInput.blur(); // Dismiss virtual keyboard on mobile so user sees the product results directly
        }
    });
}

function resetFilters() {
    activeCategory = "all";
    activeBrand = "all";
    const searchInput = document.getElementById("storeSearchInput");
    if (searchInput) searchInput.value = "";
    const clearBtn = document.getElementById("storeSearchClearBtn");
    if (clearBtn) clearBtn.classList.add("d-none");

    document.querySelectorAll(".cat-tab").forEach(t => {
        t.classList.toggle("active", t.dataset.category === "all");
    });
    document.querySelectorAll(".category-quick-card").forEach(c => {
        c.classList.remove("active-category-card");
    });
    renderProducts();
}

// ==========================================================
// 5. Shopping Cart System
// ==========================================================
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = customerCart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        customerCart[existingIndex].qty += 1;
    } else {
        customerCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 1
        });
    }

    saveCart();
    renderCartDrawer();
    showToast(`Added '${product.name}' to cart!`);
}

function quickBuy(productId) {
    addToCart(productId);
    openCartDrawer();
}

function updateCartQty(productId, change) {
    const item = customerCart.find(i => i.id === productId);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
        customerCart = customerCart.filter(i => i.id !== productId);
    }

    saveCart();
    renderCartDrawer();
}

function removeCartItem(productId) {
    customerCart = customerCart.filter(i => i.id !== productId);
    saveCart();
    renderCartDrawer();
}

function saveCart() {
    localStorage.setItem('shree_sai_cart', JSON.stringify(customerCart));
    updateCartBadges();
}

function updateCartBadges() {
    const totalItems = customerCart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll(".cart-count-badge").forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? "inline-block" : "none";
    });
}

function renderCartDrawer() {
    const container = document.getElementById("cartItemsContainer");
    const subtotalEl = document.getElementById("cartSubtotalPrice");
    const totalEl = document.getElementById("cartTotalPrice");
    if (!container) return;

    if (customerCart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fa-solid fa-cart-shopping fa-3x text-muted mb-3 opacity-25"></i>
                <p class="text-muted fw-semibold">Your shopping cart is empty.</p>
                <button class="btn btn-outline-primary btn-sm rounded-pill px-4" data-bs-dismiss="offcanvas">Start Shopping</button>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = "₹0";
        if (totalEl) totalEl.textContent = "₹0";
        return;
    }

    const subtotal = customerCart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    container.innerHTML = customerCart.map(item => `
        <div class="cart-item-row">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="flex-grow-1">
                <div class="fw-bold small text-dark line-clamp-1">${item.name}</div>
                <div class="text-primary fw-bold small">₹${item.price.toLocaleString('en-IN')}</div>
                
                <div class="d-flex align-items-center gap-2 mt-1">
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
                    <span class="small fw-bold px-1">${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>

                    <button class="btn btn-sm text-danger ms-auto p-0" onclick="removeCartItem('${item.id}')" title="Delete">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (totalEl) totalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
}

function openCartDrawer() {
    const drawerEl = document.getElementById('cartOffcanvas');
    if (drawerEl) {
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(drawerEl);
        offcanvas.show();
    }
}

// ==========================================================
// 6. Online Orders, Notifications & WhatsApp Integration
// ==========================================================
// ==========================================================
// 6. Online Orders, OTP Verification & WhatsApp Integration
// ==========================================================
let currentGeneratedOtp = null;
let isPhoneVerified = false;
let isRealSmsActive = false;
let otpTimerInterval = null;
let pendingOrderPaymentMethod = "Cash on Delivery / UPI";

// Central UPI & Online Payment Configuration
let currentUpiConfig = {
    upi_id: "7972296879@ybl",
    payee_name: "Devendra Koli - Shree Sai Mobile",
    phone: "7972296879"
};
let currentActiveUpiOrder = null;

function fetchUpiConfig() {
    fetch(`${API_BASE}/api/get-upi-config`)
        .then(r => r.json())
        .then(data => {
            if (data && data.success && data.config) {
                currentUpiConfig = data.config;
            }
        })
        .catch(e => console.log("UPI config using defaults"));
}

function startUpiOnlinePayment() {
    placeOnlineOrder("PhonePe / GPay UPI (Online)");
}

function placeOnlineOrder(paymentMethod = "Cash on Delivery / UPI") {
    if (customerCart.length === 0) {
        alert(currentLang === 'hi' ? "आपकी कार्ट खाली है! कृपया पहले कोई प्रोडक्ट जोड़ें।" : "Your cart is empty! Please add products before placing an order.");
        return;
    }

    // Check if customer already has a saved & verified profile in session
    const userStr = localStorage.getItem('shree_sai_user');
    let loggedUser = null;
    if (userStr) {
        try { loggedUser = JSON.parse(userStr); } catch(e) {}
    }
    const isSavedCustomer = loggedUser && loggedUser.name && loggedUser.phone && loggedUser.phone.length === 10 && loggedUser.address;

    if (isSavedCustomer) {
        // Already verified! Place order directly without asking again
        executeOrderPlacement(loggedUser.name, loggedUser.phone, loggedUser.address, paymentMethod);
        return;
    }

    // New/Unverified Customer: Pop up Customer Login / Registration with 10-digit OTP
    pendingOrderPaymentMethod = paymentMethod;

    // 1. Close cart offcanvas drawer
    const drawerEl = document.getElementById('cartOffcanvas');
    if (drawerEl && typeof bootstrap !== 'undefined') {
        const offcanvas = bootstrap.Offcanvas.getInstance(drawerEl);
        if (offcanvas) offcanvas.hide();
    }

    // 2. Reset OTP & modal state
    isPhoneVerified = false;
    currentGeneratedOtp = null;
    if (otpTimerInterval) clearInterval(otpTimerInterval);

    const nameInp = document.getElementById("orderCustName");
    const phoneInp = document.getElementById("orderCustPhone");
    const addrInp = document.getElementById("orderCustAddress");
    const btnVerify = document.getElementById("btnSendPhoneOtp");
    const badge = document.getElementById("phoneVerifiedBadge");
    const otpSec = document.getElementById("otpSection");
    const otpTimerDisplay = document.getElementById("otpTimerDisplay");
    const helpText = document.getElementById("phoneHelpText");

    if (nameInp) nameInp.value = '';
    if (phoneInp) {
        phoneInp.value = '';
        phoneInp.readOnly = false;
    }
    if (addrInp) addrInp.value = '';
    if (btnVerify) btnVerify.classList.add("d-none");
    if (badge) badge.classList.add("d-none");
    if (otpSec) otpSec.classList.add("d-none");
    if (otpTimerDisplay) otpTimerDisplay.textContent = '';
    if (helpText) {
        helpText.textContent = currentLang === 'hi' 
            ? '10-digit mobile number enter karte hi Verify button aayega.' 
            : 'Enter 10-digit mobile number to see Verify button.';
    }

    // 3. Open Registration / Login Modal
    const modalEl = document.getElementById('orderAuthModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
        setTimeout(() => {
            if (nameInp) nameInp.focus();
        }, 400);
    }
}

// 10-Digit Mobile Listener: Shows "Verify" button as soon as 10th digit is typed
function handlePhoneInputChange(inputEl) {
    // Only allow digits up to 10 characters
    inputEl.value = inputEl.value.replace(/\D/g, '').slice(0, 10);
    const phone = inputEl.value;
    const btnVerify = document.getElementById("btnSendPhoneOtp");
    const badge = document.getElementById("phoneVerifiedBadge");
    const helpText = document.getElementById("phoneHelpText");
    const otpSec = document.getElementById("otpSection");

    if (phone.length === 10) {
        if (isPhoneVerified) {
            if (btnVerify) btnVerify.classList.add("d-none");
            if (badge) badge.classList.remove("d-none");
        } else {
            if (btnVerify) {
                btnVerify.classList.remove("d-none");
            }
            if (badge) badge.classList.add("d-none");
        }
        if (helpText) {
            helpText.innerHTML = `<span class="text-success fw-bold"><i class="fa-solid fa-arrow-right me-1"></i>${currentLang === 'hi' ? 'अब "सत्यापित करें (Verify)" बटन दबाएं' : 'Now click "Verify" button'}</span>`;
        }
    } else {
        isPhoneVerified = false;
        if (btnVerify) btnVerify.classList.add("d-none");
        if (badge) badge.classList.add("d-none");
        if (otpSec) otpSec.classList.add("d-none");
        if (helpText) {
            helpText.textContent = currentLang === 'hi' 
                ? '10-digit mobile number enter karte hi Verify button aayega.' 
                : 'Enter 10-digit mobile number to see Verify button.';
        }
    }
}

// Send Real OTP to user via Fast2SMS
async function sendOrderPhoneOtp() {
    const phoneInput = document.getElementById("orderCustPhone");
    const phone = phoneInput?.value.trim() || '';
    if (phone.length !== 10) {
        alert(currentLang === 'hi' ? "कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें!" : "Please enter a valid 10-digit mobile number!");
        return;
    }

    const btnVerify = document.getElementById("btnSendPhoneOtp");
    if (btnVerify) {
        btnVerify.disabled = true;
        btnVerify.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-1"></i> ${currentLang === 'hi' ? 'भेज रहे हैं...' : 'Sending...'}`;
    }

    // Generate 4-digit numeric OTP
    currentGeneratedOtp = String(Math.floor(1000 + Math.random() * 9000));
    isRealSmsActive = false;

    // Call Backend API to send real SMS via Fast2SMS
    let realSmsSent = false;
    let apiMsg = '';
    try {
        const resp = await fetch(`${API_BASE}/api/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: phone, otp: currentGeneratedOtp })
        });
        const resJson = await resp.json();
        if (resJson.real_sms) {
            realSmsSent = true;
            isRealSmsActive = true;
        }
        apiMsg = resJson.message || '';
    } catch(err) {
        console.warn("Fast2SMS server call error:", err);
    }

    if (btnVerify) {
        btnVerify.disabled = false;
        btnVerify.innerHTML = `<i class="fa-solid fa-shield-halved me-1"></i> <span data-i18n="verifyBtn">${currentLang === 'hi' ? 'सत्यापित करें' : 'Verify'}</span>`;
    }

    // Reveal OTP input section
    const otpSec = document.getElementById("otpSection");
    if (otpSec) otpSec.classList.remove("d-none");

    // Display banner
    const banner = document.getElementById("smsNotificationBanner");
    const bannerText = document.getElementById("smsBannerText");
    if (banner) {
        if (realSmsSent) {
            if (bannerText) {
                bannerText.innerHTML = currentLang === 'hi'
                    ? `📲 <strong class="text-success">असली SMS भेजा गया:</strong> आपके मोबाइल <strong>+91 ${phone}</strong> पर 4-अंकों का OTP भेजा गया है। कृपया अपना SMS इनबॉक्स देखें।`
                    : `📲 <strong class="text-success">Real SMS Sent:</strong> Verification code has been sent to <strong>+91 ${phone}</strong> via SMS. Please check your phone.`;
            }
        } else {
            if (bannerText) {
                bannerText.innerHTML = currentLang === 'hi'
                    ? `⚠️ <strong class="text-primary">डेमो OTP:</strong> <span class="badge bg-primary fs-6 px-2 py-1 font-monospace" id="smsOtpCodeBadge">${currentGeneratedOtp}</span> <span class="text-muted d-block small mt-1">(असली SMS पाने के लिए Admin Settings में Fast2SMS Key सेव करें)</span>`
                    : `⚠️ <strong class="text-primary">Demo OTP:</strong> <span class="badge bg-primary fs-6 px-2 py-1 font-monospace" id="smsOtpCodeBadge">${currentGeneratedOtp}</span> <span class="text-muted d-block small mt-1">(Add Fast2SMS API Key in Admin Settings to receive real SMS)</span>`;
            }
        }
        banner.classList.remove("d-none");
        setTimeout(() => {
            if (banner) banner.classList.add("d-none");
        }, 14000);
    }

    // Start 30s resend timer
    startOtpResendTimer(30);

    // Focus OTP input box
    const otpInp = document.getElementById("orderOtpInput");
    if (otpInp) {
        otpInp.value = '';
        otpInp.classList.remove("is-invalid");
        otpInp.focus();
    }

    // Play SMS sound chime
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        }
    } catch(e) {}

    if (realSmsSent) {
        alert(currentLang === 'hi' 
            ? `📲 आपके मोबाइल नंबर (+91 ${phone}) पर असली SMS भेज दिया गया है!\nकृपया अपना SMS इनबॉक्स चेक करें और 4-अंकों का OTP दर्ज करें।` 
            : `📲 Real SMS has been sent to your mobile (+91 ${phone})!\nPlease check your SMS inbox and enter the 4-digit OTP.`);
    }
}

function dismissSmsBanner() {
    const banner = document.getElementById("smsNotificationBanner");
    if (banner) banner.classList.add("d-none");
}

function startOtpResendTimer(seconds) {
    const timerDisplay = document.getElementById("otpTimerDisplay");
    const resendBtn = document.getElementById("btnResendOtp");
    if (resendBtn) resendBtn.disabled = true;

    if (otpTimerInterval) clearInterval(otpTimerInterval);

    let remaining = seconds;
    if (timerDisplay) timerDisplay.textContent = `(${remaining}s)`;

    otpTimerInterval = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(otpTimerInterval);
            if (timerDisplay) timerDisplay.textContent = '';
            if (resendBtn) resendBtn.disabled = false;
        } else {
            if (timerDisplay) timerDisplay.textContent = `(${remaining}s)`;
        }
    }, 1000);
}

// Verify OTP
function verifyOrderPhoneOtp() {
    const otpInput = document.getElementById("orderOtpInput");
    const enteredOtp = otpInput?.value.trim() || '';

    if (!currentGeneratedOtp) {
        alert(currentLang === 'hi' ? "कृपया पहले OTP भेजें!" : "Please click Verify to receive OTP first!");
        return;
    }

    if (enteredOtp === currentGeneratedOtp) {
        isPhoneVerified = true;
        if (otpTimerInterval) clearInterval(otpTimerInterval);

        const btnVerify = document.getElementById("btnSendPhoneOtp");
        const badge = document.getElementById("phoneVerifiedBadge");
        const otpSec = document.getElementById("otpSection");
        const phoneInput = document.getElementById("orderCustPhone");
        const helpText = document.getElementById("phoneHelpText");

        if (btnVerify) btnVerify.classList.add("d-none");
        if (otpSec) otpSec.classList.add("d-none");
        if (badge) badge.classList.remove("d-none");
        if (phoneInput) phoneInput.readOnly = true;
        if (helpText) {
            helpText.innerHTML = `<span class="text-success fw-bold"><i class="fa-solid fa-circle-check me-1"></i>${currentLang === 'hi' ? 'मोबाइल नंबर सफलतापूर्वक सत्यापित हो गया!' : 'Mobile number verified successfully!'}</span>`;
        }
        dismissSmsBanner();

        // Move cursor to delivery address
        const addrField = document.getElementById("orderCustAddress");
        if (addrField && !addrField.value) addrField.focus();
    } else {
        if (isRealSmsActive) {
            alert(currentLang === 'hi' 
                ? "गलत OTP दर्ज किया गया है!\nकृपया अपने मोबाइल पर SMS में आया 4-अंकों का सही OTP दर्ज करें।" 
                : "Invalid OTP!\nPlease enter the 4-digit code received on your mobile phone via SMS.");
        } else {
            alert(currentLang === 'hi' 
                ? `गलत OTP दर्ज किया गया है!\n(डेमो मोड OTP: ${currentGeneratedOtp})` 
                : `Invalid OTP!\n(Demo OTP: ${currentGeneratedOtp})`);
        }
        if (otpInput) {
            otpInput.classList.add("is-invalid");
            otpInput.focus();
        }
    }
}

// Optional: Send OTP via WhatsApp
function sendOtpViaWhatsApp() {
    const phoneInput = document.getElementById("orderCustPhone");
    const phone = phoneInput?.value.trim() || '';
    if (phone.length !== 10) return;

    if (!currentGeneratedOtp) {
        sendOrderPhoneOtp();
    }

    const msg = encodeURIComponent(`*Shree Sai Mobile & Electronics*\nYour Verification OTP is: *${currentGeneratedOtp}*\nValid for 5 minutes.`);
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
}

// Handle Order Auth Form Submit
function handleOrderAuthSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("orderCustName")?.value.trim() || '';
    const phone = document.getElementById("orderCustPhone")?.value.trim() || '';
    const address = document.getElementById("orderCustAddress")?.value.trim() || '';

    if (!isPhoneVerified) {
        alert(currentLang === 'hi' 
            ? "कृपया पहले मोबाइल नंबर के बगल में 'सत्यापित करें (Verify)' बटन दबाकर OTP वेरिफाई करें!" 
            : "Please verify your mobile number with OTP first!");
        const btnVerify = document.getElementById("btnSendPhoneOtp");
        if (btnVerify) btnVerify.focus();
        return;
    }

    if (!name || !address) {
        alert(currentLang === 'hi' ? "कृपया अपना नाम और डिलीवरी का पूरा पता दर्ज करें!" : "Please enter your name and delivery address!");
        return;
    }

    // Save customer profile if checked
    const chkSave = document.getElementById("chkOrderSaveProfile");
    if (!chkSave || chkSave.checked) {
        const customerData = {
            role: 'CUSTOMER',
            name: name,
            phone: phone,
            address: address,
            registeredDateDisplay: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            registeredAt: new Date().toISOString(),
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('shree_sai_user', JSON.stringify(customerData));

        const registry = JSON.parse(localStorage.getItem('shree_sai_registered_customers') || '[]');
        const idx = registry.findIndex(c => c.phone === phone);
        if (idx >= 0) {
            registry[idx] = { ...registry[idx], ...customerData };
        } else {
            registry.push(customerData);
        }
        localStorage.setItem('shree_sai_registered_customers', JSON.stringify(registry));
        checkLoggedInUser();
    }

    // Close Order Auth Modal
    const modalEl = document.getElementById('orderAuthModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    }

    // Execute order placement!
    executeOrderPlacement(name, phone, address, pendingOrderPaymentMethod);
}

// Core Order Placement Logic
function executeOrderPlacement(name, phone, address, paymentMethod) {
    const total = customerCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date();

    const orderData = {
        orderId: orderId,
        date: orderDate.toISOString(),
        displayDate: orderDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        displayTime: orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        customerName: name,
        customerPhone: phone,
        deliveryAddress: address,
        items: JSON.parse(JSON.stringify(customerCart)),
        itemCount: customerCart.reduce((sum, i) => sum + i.qty, 0),
        totalAmount: total,
        paymentMethod: paymentMethod,
        status: "Pending", // Pending, Confirmed, Dispatched, Delivered, Cancelled
        isNew: true
    };

    // 1. Save to online orders list in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
    existingOrders.unshift(orderData);
    localStorage.setItem('shree_sai_online_orders', JSON.stringify(existingOrders));

    // 1b. Sync order to central server so Admin Dashboard sees it LIVE from ANY phone or device!
    try {
        fetch(`${API_BASE}/api/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        }).then(r => r.json()).then(res => {
            console.log("[Store] Order synced to backend server successfully:", res);
        }).catch(err => {
            console.warn("[Store] Could not sync order to backend server:", err);
        });
    } catch(err) {
        console.warn("[Store] Fetch order error:", err);
    }

    // 2. Save Live Notification for Admin Dashboard in localStorage
    const existingNotifs = JSON.parse(localStorage.getItem('shree_sai_notifications') || '[]');
    const firstItemName = customerCart[0]?.name || "Item";
    const moreText = customerCart.length > 1 ? ` + ${customerCart.length - 1} more` : '';
    const orderDateFormatted = `${orderData.displayDate} at ${orderData.displayTime}`;

    const newNotif = {
        id: "notif-" + Date.now(),
        type: "NEW_ORDER",
        orderId: orderId,
        title: `🚨 New Order (${orderData.displayTime}): ${orderId}`,
        message: `${name} ordered ${firstItemName}${moreText} (Total: ₹${total.toLocaleString('en-IN')}) on ${orderDateFormatted} via ${paymentMethod}`,
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        totalAmount: total,
        orderDate: orderDateFormatted,
        timestamp: new Date().toISOString(),
        displayTime: orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        read: false
    };
    existingNotifs.unshift(newNotif);
    localStorage.setItem('shree_sai_notifications', JSON.stringify(existingNotifs));

    // Broadcast instant real-time event to Admin Dashboard
    try {
        const bc = new BroadcastChannel('shree_sai_store_channel');
        bc.postMessage({ type: 'NEW_ORDER', order: orderData });
    } catch(e) {}

    // 3. Save customer into customers list
    try {
        const custs = JSON.parse(localStorage.getItem('shree_sai_customers_list') || '[]');
        const existingIdx = custs.findIndex(c => c.phone === phone);
        if (existingIdx >= 0) {
            custs[existingIdx].totalOrders = (custs[existingIdx].totalOrders || 1) + 1;
            custs[existingIdx].lastOrder = orderDate.toISOString();
        } else {
            custs.push({
                id: "CUST-" + Math.floor(1000 + Math.random() * 9000),
                name: name,
                phone: phone,
                address: address,
                balance: 0,
                totalOrders: 1,
                lastOrder: orderDate.toISOString()
            });
        }
        localStorage.setItem('shree_sai_customers_list', JSON.stringify(custs));
    } catch(e) {}

    // 4. Hide cart offcanvas if open
    const drawerEl = document.getElementById('cartOffcanvas');
    if (drawerEl && typeof bootstrap !== 'undefined') {
        const offcanvas = bootstrap.Offcanvas.getInstance(drawerEl);
        if (offcanvas) offcanvas.hide();
    }

    // 5. Clear cart
    customerCart = [];
    saveCart();
    renderCartDrawer();

    // 6. Show Success or UPI Payment Modal
    currentActiveUpiOrder = orderData;
    if (paymentMethod === 'PhonePe / GPay UPI (Online)') {
        setTimeout(() => {
            openUpiPaymentModal(orderData);
        }, 300);
    } else {
        showOrderSuccessModal(orderData);
    }

    // 7. If paymentMethod is WhatsApp, trigger WhatsApp immediately in current user gesture
    if (paymentMethod === 'WhatsApp Order') {
        try {
            triggerWhatsAppMessage(orderData);
        } catch(e) {
            console.warn("Direct WhatsApp trigger note:", e);
        }
    }
}

function triggerWhatsAppMessage(order) {
    sendProprietorOrderNotificationWhatsApp(order);
}

function openUpiPaymentModal(order) {
    if (!order) return;
    currentActiveUpiOrder = order;

    const upiId = currentUpiConfig.upi_id || "7972296879@ybl";
    const payeeName = currentUpiConfig.payee_name || "Devendra Koli - Shree Sai Mobile";
    const amount = order.totalAmount;
    const orderId = order.orderId;

    // Standard NPCI UPI URI Scheme
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderId)}`;

    // High resolution Dynamic QR Code URL using QR Server API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(upiUri)}`;

    // Update DOM elements
    const payeeEl = document.getElementById("upiPayeeNameDisplay");
    const amountEl = document.getElementById("upiPayableAmount");
    const orderIdEl = document.getElementById("upiOrderIdDisplay");
    const qrImgEl = document.getElementById("upiQrCodeImg");
    const upiIdEl = document.getElementById("upiIdDisplay");
    const utrInput = document.getElementById("upiUtrNumberInput");

    if (payeeEl) payeeEl.textContent = payeeName;
    if (amountEl) amountEl.textContent = `₹${amount.toLocaleString('en-IN')}`;
    if (orderIdEl) orderIdEl.textContent = `Order ID: ${orderId}`;
    if (upiIdEl) upiIdEl.textContent = upiId;
    if (utrInput) utrInput.value = '';

    if (qrImgEl) {
        qrImgEl.src = qrUrl;
    }

    // Show modal
    const modalEl = document.getElementById("upiPaymentModal");
    if (modalEl && typeof bootstrap !== 'undefined') {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
}

// Interactive UPI App Click Handler (Mobile Direct Launch vs Desktop QR Guidance)
function payWithUpi(appName) {
    const upiId = currentUpiConfig.upi_id || "7972296879@ybl";
    const payeeName = currentUpiConfig.payee_name || "Devendra Koli - Shree Sai Mobile";
    
    // Determine amount and order ID
    let amount = 0;
    let orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    if (currentActiveUpiOrder) {
        amount = currentActiveUpiOrder.totalAmount;
        orderId = currentActiveUpiOrder.orderId;
    } else if (customerCart.length > 0) {
        amount = customerCart.reduce((s, i) => s + (i.price * i.qty), 0);
    }

    const baseParams = `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderId)}`;
    const genericUpiUri = `upi://pay?${baseParams}`;

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);

    if (!isMobile) {
        // Desktop / Laptop PC Experience:
        // Automatically copy UPI ID so customer can paste or use it
        copyShopUpiId();

        // Highlight QR code on screen
        const qrImg = document.getElementById("upiQrCodeImg");
        if (qrImg) {
            qrImg.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
            qrImg.style.transform = "scale(1.05)";
            qrImg.style.boxShadow = "0 0 20px rgba(37, 99, 235, 0.6)";
            setTimeout(() => {
                qrImg.style.transform = "scale(1)";
                qrImg.style.boxShadow = "none";
            }, 1800);
        }

        const appLabel = appName === 'phonepe' ? 'PhonePe' : (appName === 'gpay' ? 'Google Pay' : (appName === 'paytm' ? 'Paytm' : 'UPI'));
        const alertMsg = currentLang === 'hi'
            ? `📱 ${appLabel} ऐप केवल मोबाइल फोन में खुलता है!\n\n👉 भुगतान करने के लिए:\n1. अपने मोबाइल फोन में ${appLabel} खोलें।\n2. ऊपर दिया गया QR कोड स्कैन करें और ₹${amount.toLocaleString('en-IN')} का भुगतान करें।\n\n(दुकान की UPI ID: ${upiId} आपके क्लिपबोर्ड पर कॉपी कर दी गई है)`
            : `📱 ${appLabel} only opens on mobile phones!\n\n👉 To complete payment:\n1. Open ${appLabel} on your mobile phone.\n2. Scan the QR code shown on screen for ₹${amount.toLocaleString('en-IN')}.\n\n(Shop UPI ID: ${upiId} copied to clipboard)`;
        
        alert(alertMsg);
        return;
    }

    // MOBILE PHONE EXPERIENCE (Android or iOS)
    let appUri = genericUpiUri;
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
        if (appName === 'phonepe') {
            appUri = `intent://pay?${baseParams}#Intent;scheme=upi;package=com.phonepe.app;end`;
        } else if (appName === 'gpay') {
            appUri = `intent://pay?${baseParams}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
        } else if (appName === 'paytm') {
            appUri = `intent://pay?${baseParams}#Intent;scheme=upi;package=net.one97.paytm;end`;
        } else {
            appUri = genericUpiUri;
        }
    } else if (isIOS) {
        if (appName === 'phonepe') {
            appUri = `phonepe://pay?${baseParams}`;
        } else if (appName === 'gpay') {
            appUri = `gpay://upi/pay?${baseParams}`;
        } else if (appName === 'paytm') {
            appUri = `paytmmp://pay?${baseParams}`;
        } else {
            appUri = genericUpiUri;
        }
    }

    // Try launching the chosen app
    try {
        window.location.href = appUri;
    } catch(err) {
        window.location.href = genericUpiUri;
    }

    // Fallback: If app didn't open within 1.8s (e.g. app not installed), notify customer
    setTimeout(() => {
        showToast(currentLang === 'hi' 
            ? "अगर ऐप नहीं खुला, तो QR कोड स्कैन करें या WhatsApp पर पे करें।" 
            : "If app did not open, please scan the QR code or pay on WhatsApp.");
    }, 1800);
}

function confirmUpiPaymentSubmission() {
    if (!currentActiveUpiOrder) {
        alert(currentLang === 'hi' ? "कोई सक्रिय ऑर्डर नहीं मिला।" : "No active order found.");
        return;
    }

    const utrInput = document.getElementById("upiUtrNumberInput");
    const utr = utrInput ? utrInput.value.trim() : "";

    currentActiveUpiOrder.utrNumber = utr;
    currentActiveUpiOrder.paymentMethod = "Paid Online via PhonePe/GPay";
    currentActiveUpiOrder.paymentStatus = "Paid (Pending Verification)";

    // Update in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('shree_sai_online_orders') || '[]');
    const idx = existingOrders.findIndex(o => o.orderId === currentActiveUpiOrder.orderId);
    if (idx >= 0) {
        existingOrders[idx].utrNumber = utr;
        existingOrders[idx].paymentMethod = "Paid Online via PhonePe/GPay";
        existingOrders[idx].paymentStatus = "Paid (Pending Verification)";
        localStorage.setItem('shree_sai_online_orders', JSON.stringify(existingOrders));
    }

    // Submit payment proof to server
    fetch(`${API_BASE}/api/submit-payment-proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            orderId: currentActiveUpiOrder.orderId,
            utrNumber: utr,
            paymentApp: "PhonePe / Google Pay"
        })
    }).catch(e => console.log("Payment proof sync error:", e));

    // Hide UPI modal
    const upiModalEl = document.getElementById("upiPaymentModal");
    if (upiModalEl && typeof bootstrap !== 'undefined') {
        const upiModal = bootstrap.Modal.getInstance(upiModalEl);
        if (upiModal) upiModal.hide();
    }

    // Show Success Modal
    setTimeout(() => {
        showOrderSuccessModal(currentActiveUpiOrder);
        showToast(currentLang === 'hi' 
            ? "ऑनलाइन पेमेंट विवरण सफलतापूर्वक दर्ज हो गया!" 
            : "Online payment details submitted successfully!");
    }, 400);
}

function sendUpiPaymentProofOnWhatsApp() {
    if (!currentActiveUpiOrder) return;
    const utrInput = document.getElementById("upiUtrNumberInput");
    const utr = utrInput ? utrInput.value.trim() : "";
    const now = new Date();
    const dateStr = currentActiveUpiOrder.displayDate || now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = currentActiveUpiOrder.displayTime || now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    let itemsText = (currentActiveUpiOrder.items || []).map((item, idx) => 
        `${idx + 1}. *${item.name}* (Qty: ${item.qty})`
    ).join("\n");

    const msg = encodeURIComponent(
`*💰 ONLINE PAYMENT RECEIPT: SHREE SAI MOBILE*
----------------------------------
📅 *Payment Date & Time:* ${dateStr} at ${timeStr}
🆔 *Order ID:* ${currentActiveUpiOrder.orderId}
👤 *Customer Name:* ${currentActiveUpiOrder.customerName}
📞 *Phone:* ${currentActiveUpiOrder.customerPhone}
📍 *Delivery Address:* ${currentActiveUpiOrder.deliveryAddress}

📦 *Ordered Items:*
${itemsText}

💰 *Total Paid:* ₹${currentActiveUpiOrder.totalAmount.toLocaleString('en-IN')}
💳 *Payment Mode:* PhonePe / Google Pay UPI
🔢 *12-Digit UTR / Ref No:* ${utr || "Attaching payment screenshot below"}
----------------------------------
🔔 I have completed online payment for my order. Please verify and confirm dispatch!`
    );

    window.open(`https://api.whatsapp.com/send?phone=917972296879&text=${msg}`, '_blank');
}

function copyShopUpiId() {
    const upiId = currentUpiConfig.upi_id || "7972296879@ybl";
    navigator.clipboard.writeText(upiId).then(() => {
        const btnText = document.getElementById("copyUpiBtnText");
        if (btnText) {
            const oldText = btnText.textContent;
            btnText.textContent = currentLang === 'hi' ? "कॉपी हो गया! ✓" : "Copied! ✓";
            setTimeout(() => {
                btnText.textContent = oldText;
            }, 2000);
        }
        showToast(currentLang === 'hi' ? "UPI ID कॉपी हो गई!" : "UPI ID copied to clipboard!");
    }).catch(() => {
        showToast(upiId);
    });
}

function openUpiModalForCurrentOrder() {
    if (currentActiveUpiOrder) {
        // Hide success modal first
        const succModalEl = document.getElementById('orderSuccessModal');
        if (succModalEl && typeof bootstrap !== 'undefined') {
            const sm = bootstrap.Modal.getInstance(succModalEl);
            if (sm) sm.hide();
        }
        setTimeout(() => {
            openUpiPaymentModal(currentActiveUpiOrder);
        }, 300);
    }
}

function showOrderSuccessModal(order) {
    const modalEl = document.getElementById('orderSuccessModal');
    if (!modalEl) return;

    const isPaidOnline = order.paymentMethod && (
        order.paymentMethod.toLowerCase().includes("online") || 
        order.paymentMethod.toLowerCase().includes("phonepe") || 
        order.paymentMethod.toLowerCase().includes("gpay") || 
        order.paymentMethod.toLowerCase().includes("paid")
    );

    const titleEl = document.getElementById("orderSuccessModalLabel");
    if (titleEl) {
        if (isPaidOnline) {
            titleEl.textContent = currentLang === 'hi' ? "🎉 भुगतान एवं ऑर्डर सफल!" : "🎉 Payment & Order Successful!";
        } else {
            titleEl.textContent = currentLang === 'hi' ? "ऑर्डर सफलतापूर्वक दर्ज हुआ! 🎉" : "Order Placed Successfully! 🎉";
        }
    }

    document.getElementById("successOrderId").textContent = order.orderId;
    document.getElementById("successOrderItemsSummary").textContent = order.items.map(i => `${i.name} (x${i.qty})`).join(", ");
    document.getElementById("successOrderTotal").textContent = `₹${order.totalAmount.toLocaleString('en-IN')}`;
    document.getElementById("successCustomerName").textContent = order.customerName;
    document.getElementById("successCustomerPhone").textContent = order.customerPhone;
    document.getElementById("successCustomerAddress").textContent = order.deliveryAddress;
    
    const payMethodEl = document.getElementById("successPaymentMethod");
    if (payMethodEl) {
        if (isPaidOnline) {
            payMethodEl.className = "badge bg-success";
            payMethodEl.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i>${order.paymentMethod}${order.utrNumber ? `<br><span class="font-monospace text-white-50" style="font-size:0.7rem;">UTR: ${order.utrNumber}</span>` : ''}`;
        } else {
            payMethodEl.className = "badge bg-primary";
            payMethodEl.textContent = order.paymentMethod;
        }
    }

    // Update alert description
    const descEl = document.getElementById("orderSuccessDescText") || modalEl.querySelector(".alert span");
    if (descEl) {
        if (isPaidOnline) {
            descEl.textContent = currentLang === 'hi'
                ? `आपका ₹${order.totalAmount.toLocaleString('en-IN')} का ऑनलाइन भुगतान और ऑर्डर सफलतापूर्वक स्वीकार कर लिया गया है! दुकान टीम इसे जल्द पैक करके रवाना करेगी।`
                : `Your online payment of ₹${order.totalAmount.toLocaleString('en-IN')} and order have been received successfully! Our team will dispatch your items shortly.`;
        } else {
            descEl.textContent = currentLang === 'hi'
                ? "आपका ऑर्डर सफलतापूर्वक दर्ज हो गया है! दुकान टीम पुष्टि करके आपका सामान रवाना करेगी।"
                : "Your order has been placed successfully! The store team will confirm and dispatch your items.";
        }
    }

    const waBtn = document.getElementById("successWhatsAppBtn");
    if (waBtn) {
        waBtn.onclick = () => sendProprietorOrderNotificationWhatsApp(order);
    }

    // Hide or adjust the "Pay Online" button if already paid
    const payUpiBtn = document.getElementById("successPayUpiBtn");
    if (payUpiBtn) {
        if (isPaidOnline) {
            payUpiBtn.innerHTML = '<i class="fa-solid fa-receipt me-1"></i> <span>View Payment Details</span>';
        } else {
            payUpiBtn.innerHTML = '<i class="fa-solid fa-qrcode fa-lg me-1"></i> <span>Pay Online / View QR Code</span>';
        }
    }

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

function checkoutViaWhatsApp() {
    placeOnlineOrder('WhatsApp Order');
}

// Simple Toast Notification
function showToast(msg) {
    const toast = document.createElement("div");
    toast.className = "position-fixed bottom-0 start-50 translate-middle-x mb-5 bg-dark text-white py-2 px-4 rounded-pill shadow-lg";
    toast.style.zIndex = "9999";
    toast.style.fontSize = "0.85rem";
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-success me-2"></i>${msg}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2200);
}
