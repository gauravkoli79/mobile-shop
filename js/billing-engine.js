/**
 * ==========================================================
 * श्री साई मोबाइल शॉप (Shree Sai Mobile Shop)
 * बिलिंग इंजन एवं स्टॉक डिडक्शन लॉजिक (Billing & Stock Engine)
 * ==========================================================
 */

/**
 * 1. बिल की वित्तीय गणना करना (Tax, Discount & Grand Total Calculation)
 * @param {Array} cartItems - कार्ट में मौजूद प्रोडक्ट्स की लिस्ट
 * @param {Object} options - डिस्काउंट, एक्सचेंज वैल्यू आदि
 * @returns {Object} पूरी इनवॉइस समरी (CGST, SGST, Grand Total)
 */
function calculateInvoiceSummary(cartItems, options = {}) {
    const discountAmount = Number(options.discountAmount || 0);
    const oldPhoneExchangeValue = Number(options.oldPhoneExchangeValue || 0);

    let subTotal = 0;       // बिना टैक्स की शुद्ध राशि (Taxable Value)
    let totalCgst = 0;      // 9% केंद्र सरकार टैक्स
    let totalSgst = 0;      // 9% राज्य सरकार टैक्स
    let totalGst = 0;       // 18% कुल टैक्स

    // प्रत्येक आइटम पर टैक्स और कुल मूल्य की गणना
    const processedItems = cartItems.map(item => {
        const qty = Number(item.quantity || 1);
        const unitPrice = Number(item.price || 0);
        const gstRate = Number(item.gstRate || 18); // डिफ़ॉल्ट 18% GST

        const itemSubtotal = unitPrice * qty;
        
        // GST की गणना (18% = 9% CGST + 9% SGST)
        const itemGst = (itemSubtotal * gstRate) / 100;
        const itemCgst = itemGst / 2;
        const itemSgst = itemGst / 2;
        const itemTotal = itemSubtotal + itemGst;

        subTotal += itemSubtotal;
        totalCgst += itemCgst;
        totalSgst += itemSgst;
        totalGst += itemGst;

        return {
            ...item,
            quantity: qty,
            unitPrice: unitPrice,
            itemSubtotal: round2(itemSubtotal),
            cgstRate: gstRate / 2,
            cgstAmount: round2(itemCgst),
            sgstRate: gstRate / 2,
            sgstAmount: round2(itemSgst),
            totalGst: round2(itemGst),
            itemTotal: round2(itemTotal)
        };
    });

    // ग्रॉस टोटल (सबटोटल + टैक्स)
    const grossTotal = subTotal + totalGst;

    // अंतिम देय राशि (Grand Total = ग्रॉस - डिस्काउंट - पुराना फोन एक्सचेंज)
    let grandTotal = grossTotal - discountAmount - oldPhoneExchangeValue;
    if (grandTotal < 0) grandTotal = 0; // कुल राशि शून्य से कम नहीं हो सकती

    return {
        items: processedItems,
        totalItemsCount: cartItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0),
        subTotal: round2(subTotal),
        totalCgst: round2(totalCgst),
        totalSgst: round2(totalSgst),
        totalGst: round2(totalGst),
        discountAmount: round2(discountAmount),
        oldPhoneExchangeValue: round2(oldPhoneExchangeValue),
        grandTotal: round2(Math.round(grandTotal)), // राउंड ऑफ (e.g. ₹16,999)
        roundOff: round2(Math.round(grandTotal) - grandTotal)
    };
}

/**
 * 2. स्टॉक कटौती लॉजिक (Stock Deduction Logic)
 * मोबाइल शॉप में 2 प्रकार के स्टॉक होते हैं:
 * (A) स्मार्टफोन: विशिष्ट IMEI नंबर का स्टेटस 'IN_STOCK' से 'SOLD' होगा।
 * (B) एक्सेसरी: कुल संख्या (quantity) में से घटेगा।
 * 
 * @param {Array} cartItems - बिकने वाले आइटम्स
 * @param {Array} currentInventory - दुकान का वर्तमान इन्वेंटरी एरे
 * @returns {Object} सफलता या असफलता का स्टेटस
 */
function processStockDeduction(cartItems, currentInventory) {
    // 1. पहले स्टॉक की उपलब्धता जांचें (Validation Phase)
    for (const cartItem of cartItems) {
        if (cartItem.category === 'PHONE') {
            // फोन के लिए IMEI चेक करें
            const phoneInStock = currentInventory.find(inv => 
                inv.imei1 === cartItem.imei1 && inv.status === 'IN_STOCK'
            );
            if (!phoneInStock) {
                return {
                    success: false,
                    message: `त्रुटि: फोन '${cartItem.name}' (IMEI: ${cartItem.imei1}) पहले ही बिक चुका है या स्टॉक में नहीं है!`
                };
            }
        } else {
            // एक्सेसरी के लिए पर्याप्त क्वांटिटी चेक करें
            const accessory = currentInventory.find(inv => inv.id === cartItem.productId);
            if (!accessory || accessory.stock < cartItem.quantity) {
                return {
                    success: false,
                    message: `त्रुटि: '${cartItem.name}' का पर्याप्त स्टॉक नहीं है! (उपलब्ध: ${accessory ? accessory.stock : 0})`
                };
            }
        }
    }

    // 2. स्टॉक कम करने का चरण (Deduction Phase)
    cartItems.forEach(cartItem => {
        if (cartItem.category === 'PHONE') {
            // स्मार्टफोन का स्टेटस SOLD मार्क करें
            const phone = currentInventory.find(inv => inv.imei1 === cartItem.imei1);
            if (phone) {
                phone.status = 'SOLD';
                phone.stock = 0;
                phone.soldDate = new Date().toISOString();
            }
        } else {
            // एक्सेसरी की क्वांटिटी घटाएं
            const accessory = currentInventory.find(inv => inv.id === cartItem.productId);
            if (accessory) {
                accessory.stock -= cartItem.quantity;
                if (accessory.stock <= 0) {
                    accessory.status = 'OUT_OF_STOCK';
                } else if (accessory.stock <= 2) {
                    accessory.status = 'LOW_STOCK';
                }
            }
        }
    });

    return {
        success: true,
        message: "स्टॉक सफलतापूर्वक अपडेट हो गया!"
    };
}

// 2 दशमलव अंकों तक राउंड करने के लिए हेल्पर
function round2(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

// ==========================================================
// 3. टेस्ट रन और उपयोग का उदाहरण (Example Usage)
// ==========================================================
/*
// उदाहरण कार्ट: ग्राहक 1 Redmi Note 13 और 2 Boat चार्जर ले रहा है
const sampleCart = [
    {
        productId: "p1",
        category: "PHONE",
        name: "Redmi Note 13 5G",
        imei1: "861928374619284",
        price: 14405.93, // बिना टैक्स की कीमत
        gstRate: 18,
        quantity: 1
    },
    {
        productId: "p2",
        category: "ACCESSORY",
        name: "Boat 65W Charger",
        price: 1000.00,
        gstRate: 18,
        quantity: 2
    }
];

const bill = calculateInvoiceSummary(sampleCart, {
    discountAmount: 200,          // ₹200 की छूट
    oldPhoneExchangeValue: 1500   // पुराने फोन का ₹1500 माइनस
});

console.log("=== इनवॉइस सारांश ===");
console.log(bill);
*/
