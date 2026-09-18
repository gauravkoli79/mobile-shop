-- ==========================================================
-- प्रोजेक्ट: श्री साई मोबाइल शॉप (Shree Sai Mobile Shop)
-- डेटाबेस: PostgreSQL Relational Database Schema (Idempotent / Re-runnable)
-- ==========================================================

-- 1. UUID एक्सटेंशन (यूनिक आईडी के लिए)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- चरण 1: पुरानी टेबल्स और Enums को सुरक्षित रूप से हटाना (Clean Reset)
-- ताकि "relation already exists" एरर कभी न आए
-- ==========================================================
DROP TABLE IF EXISTS repair_orders CASCADE;
DROP TABLE IF EXISTS old_phone_exchanges CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS product_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS repair_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS payment_mode CASCADE;
DROP TYPE IF EXISTS item_status CASCADE;
DROP TYPE IF EXISTS product_category CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ==========================================================
-- चरण 2: कस्टम ENUM प्रकार बनाना
-- ==========================================================
CREATE TYPE user_role AS ENUM ('ADMIN', 'CASHIER', 'TECHNICIAN');
CREATE TYPE product_category AS ENUM ('MOBILE', 'ACCESSORY', 'SPARE_PART');
CREATE TYPE item_status AS ENUM ('IN_STOCK', 'SOLD', 'RETURNED', 'REPAIRING', 'DEFECTIVE');
CREATE TYPE payment_mode AS ENUM ('CASH', 'UPI', 'CARD', 'FINANCE', 'UDHAR');
CREATE TYPE invoice_status AS ENUM ('PAID', 'PARTIAL', 'UNPAID', 'CANCELLED');
CREATE TYPE repair_status AS ENUM ('RECEIVED', 'INSPECTING', 'WAITING_PARTS', 'REPAIRED', 'DELIVERED', 'CANCELLED');

-- ==========================================================
-- टेबल 1: यूज़र्स एवं स्टाफ (Users & Staff)
-- ==========================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CASHIER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- टेबल 2: ग्राहक एवं उधारी प्रोफाइल (Customers CRM & Credit Ledger)
-- ==========================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,          -- ग्राहक का प्राथमिक मोबाइल नंबर
    alt_phone VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    gstin VARCHAR(15),                          -- B2B फर्म हेतु
    credit_limit NUMERIC(10, 2) DEFAULT 0.00,   -- अधिकतम उधारी सीमा
    current_balance NUMERIC(10, 2) DEFAULT 0.00,-- वर्तमान बाकी राशि (+ve मतलब उधारी है)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- टेबल 3: सप्लायर्स / डिस्ट्रीब्यूटर्स (Suppliers / Vendors)
-- ==========================================================
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(15) NOT NULL,
    gstin VARCHAR(15),
    address TEXT,
    outstanding_balance NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- टेबल 4: प्रोडक्ट्स मास्टर कैटलॉग (Products Master Catalog)
-- ==========================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,                 -- e.g. "Redmi Note 13 5G" या "Type-C 65W Fast Charger"
    brand VARCHAR(50) NOT NULL,                 -- e.g. "Xiaomi", "Apple", "Boat"
    category product_category NOT NULL,
    model_number VARCHAR(50),
    hsn_code VARCHAR(10) DEFAULT '8517',        -- HSN कोड (मोबाइल हेतु 8517)
    gst_rate NUMERIC(4, 2) DEFAULT 18.00,       -- GST प्रतिशत (18.00%)
    purchase_price NUMERIC(10, 2) NOT NULL,     -- थोक खरीद मूल्य
    selling_price NUMERIC(10, 2) NOT NULL,      -- बिक्री मूल्य
    min_stock_alert INT DEFAULT 2,              -- कम स्टॉक होने पर चेतावनी
    stock_quantity INT DEFAULT 0,               -- एक्सेसरीज के लिए सीधे संख्या
    barcode VARCHAR(50),                        -- बारकोड
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- टेबल 5: व्यक्तिगत फोन एवं IMEI ट्रैकिंग (Product Items / IMEI)
-- ==========================================================
CREATE TABLE product_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    imei1 VARCHAR(18) UNIQUE NOT NULL,          -- यूनिक प्राइमरी IMEI (15 अंक)
    imei2 VARCHAR(18) UNIQUE,                   -- सेकेंडरी सिम IMEI
    serial_no VARCHAR(50),
    color VARCHAR(30),                          -- e.g. "Midnight Black"
    ram_storage VARCHAR(30),                    -- e.g. "8GB / 128GB"
    status item_status NOT NULL DEFAULT 'IN_STOCK',
    purchase_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- टेबल 6: सेल्स एवं इनवॉइसेस (Sales & Invoices)
-- ==========================================================
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. "SSM/2026-27/001"
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    biller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    invoice_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- वित्तीय गणनाएं (Financials)
    subtotal NUMERIC(12, 2) NOT NULL,            -- बिना टैक्स की राशि
    gst_amount NUMERIC(12, 2) NOT NULL,          -- कुल GST टैक्स
    discount_amount NUMERIC(10, 2) DEFAULT 0.00, -- कुल छूट
    exchange_amount NUMERIC(10, 2) DEFAULT 0.00, -- पुराने फोन का एक्सचेंज मूल्य
    grand_total NUMERIC(12, 2) NOT NULL,         -- अंतिम देय राशि
    paid_amount NUMERIC(12, 2) NOT NULL,          -- ग्राहक द्वारा दी गई राशि
    due_amount NUMERIC(12, 2) DEFAULT 0.00,      -- बाकी उधारी राशि
    
    payment_status invoice_status NOT NULL DEFAULT 'PAID',
    is_gst_invoice BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- टेबल 7: इनवॉइस लाइन आइटम्स (Invoice Items)
-- ==========================================================
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_item_id UUID REFERENCES product_items(id) ON DELETE SET NULL, -- यदि फोन बिका है तो IMEI लिंक
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    tax_rate NUMERIC(4, 2) NOT NULL DEFAULT 18.00,
    tax_amount NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- टेबल 8: मल्टीपल पेमेंट्स एवं स्प्लिट पेमेंट्स (Payments Breakdown)
-- ==========================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL,
    payment_mode payment_mode NOT NULL,
    transaction_ref VARCHAR(100),                -- UPI Ref / Cheque No / Loan ID
    notes VARCHAR(255),
    collected_by UUID NOT NULL REFERENCES users(id),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- टेबल 9: ओल्ड फोन एक्सचेंज रिकॉर्ड (Used Phone Buyback)
-- ==========================================================
CREATE TABLE old_phone_exchanges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    brand_model VARCHAR(100) NOT NULL,
    imei VARCHAR(18) NOT NULL,
    condition_description TEXT,
    exchange_value NUMERIC(10, 2) NOT NULL,
    id_proof_type VARCHAR(50),                   -- e.g. "Aadhar Card"
    id_proof_number VARCHAR(50),
    id_proof_url TEXT,                           -- आधार कार्ड फोटो
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- टेबल 10: मोबाइल रिपेयरिंग सेंटर (Repair Orders / Job Sheet)
-- ==========================================================
CREATE TABLE repair_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_sheet_no VARCHAR(50) UNIQUE NOT NULL,    -- e.g. "JOB-2026-001"
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
    device_model VARCHAR(100) NOT NULL,
    imei_or_serial VARCHAR(50),
    lock_pattern_or_pin VARCHAR(50),             -- स्क्रीन पासवर्ड/पैटर्न
    reported_issue TEXT NOT NULL,                -- स्क्रीन कॉम्बो/चार्जिंग फॉल्ट
    physical_condition TEXT,                     -- स्क्रैच/डेंट
    estimated_cost NUMERIC(10, 2) NOT NULL,
    final_amount NUMERIC(10, 2),
    advance_paid NUMERIC(10, 2) DEFAULT 0.00,
    status repair_status NOT NULL DEFAULT 'RECEIVED',
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- फास्ट सर्च और बारकोड स्कैनर के लिए इंडेक्स (Performance Indexes)
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_product_items_imei1 ON product_items(imei1);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_repair_orders_job_sheet_no ON repair_orders(job_sheet_no);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
