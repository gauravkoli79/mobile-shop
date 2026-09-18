"""
Shree Sai Mobile & Electronics
Custom HTTP Server with Fast2SMS Real SMS OTP Gateway Integration
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.error
import urllib.parse
import os
import sys
import time
import datetime

# Configure UTF-8 encoding for stdout/stderr to prevent Windows cp1252 charmap encoding errors
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(DIRECTORY, "sms_config.json")
UPI_CONFIG_FILE = os.path.join(DIRECTORY, "upi_config.json")
ORDERS_FILE = os.path.join(DIRECTORY, "orders.json")
NOTIFS_FILE = os.path.join(DIRECTORY, "notifications.json")
POS_INVOICES_FILE = os.path.join(DIRECTORY, "pos_invoices.json")
CUSTOMERS_FILE = os.path.join(DIRECTORY, "customers.json")

def load_customers():
    if os.path.exists(CUSTOMERS_FILE):
        try:
            with open(CUSTOMERS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            safe_print("Error loading customers:", e)
    return []

def save_customers(customers):
    try:
        with open(CUSTOMERS_FILE, "w", encoding="utf-8") as f:
            json.dump(customers, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        safe_print("Error saving customers:", e)
        return False

def load_pos_invoices():
    if os.path.exists(POS_INVOICES_FILE):
        try:
            with open(POS_INVOICES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            safe_print("Error loading pos invoices:", e)
    return []

def save_pos_invoices(invoices):
    try:
        with open(POS_INVOICES_FILE, "w", encoding="utf-8") as f:
            json.dump(invoices, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        safe_print("Error saving pos invoices:", e)
        return False

def safe_print(*args, **kwargs):
    try:
        print(*args, **kwargs)
    except Exception:
        try:
            safe_args = [str(a).encode('ascii', 'backslashreplace').decode('ascii') for a in args]
            print(*safe_args, **kwargs)
        except Exception:
            pass

def load_orders():
    if os.path.exists(ORDERS_FILE):
        try:
            with open(ORDERS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return []

def save_orders(orders):
    try:
        with open(ORDERS_FILE, "w", encoding="utf-8") as f:
            json.dump(orders, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        safe_print("Error saving orders:", e)
        return False

def load_notifs():
    if os.path.exists(NOTIFS_FILE):
        try:
            with open(NOTIFS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return []

def save_notifs(notifs):
    try:
        with open(NOTIFS_FILE, "w", encoding="utf-8") as f:
            json.dump(notifs, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        safe_print("Error saving notifications:", e)
        return False

PRODUCTS_FILE = os.path.join(DIRECTORY, "products.json")

def load_products():
    if os.path.exists(PRODUCTS_FILE):
        try:
            with open(PRODUCTS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            safe_print("Error loading products:", e)
    return []

def save_products(products):
    try:
        with open(PRODUCTS_FILE, "w", encoding="utf-8") as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        safe_print("Error saving products:", e)
        return False

def load_sms_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "fast2sms_api_key": ""
    }

def save_sms_config(cfg):
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(cfg, f, indent=2)
        return True
    except Exception as e:
        print("Error saving sms config:", e)
        return False

def load_upi_config():
    if os.path.exists(UPI_CONFIG_FILE):
        try:
            with open(UPI_CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "upi_id": "7972296879@ybl",
        "payee_name": "Devendra Koli - Shree Sai Mobile",
        "phone": "7972296879"
    }

def save_upi_config(cfg):
    try:
        with open(UPI_CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(cfg, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        safe_print("Error saving upi config:", e)
        return False

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        # 1. API: Send Real OTP via Fast2SMS
        if self.path == "/api/send-otp":
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                data = json.loads(post_body.decode('utf-8'))
                phone = str(data.get("phone", "")).strip()
                otp = str(data.get("otp", "")).strip()

                if len(phone) != 10 or not phone.isdigit():
                    self.send_json_response(400, {"success": False, "message": "Invalid 10-digit mobile number."})
                    return

                cfg = load_sms_config()
                api_key = cfg.get("fast2sms_api_key", "").strip()

                if not api_key:
                    # No API key configured yet - return fallback notice
                    self.send_json_response(200, {
                        "success": True,
                        "real_sms": False,
                        "message": "Fast2SMS API key not yet configured in Admin Settings. Simulated OTP used.",
                        "otp": otp
                    })
                    return

                # Send SMS via Fast2SMS Quick SMS (route 'q' does not require domain verification)
                headers = {
                    "authorization": api_key,
                    "Cache-Control": "no-cache",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                }

                # We first try Route 'q' (Quick SMS), which works without domain verification
                msg_text = f"Your Shree Sai Mobile OTP verification code is {otp}. Valid for 5 minutes."
                params_q = urllib.parse.urlencode({
                    "authorization": api_key,
                    "route": "q",
                    "message": msg_text,
                    "language": "english",
                    "flash": "0",
                    "numbers": phone
                })
                url_q = f"https://www.fast2sms.com/dev/bulkV2?{params_q}"

                success = False
                res_json = {}
                err_detail = ""

                # Attempt Route 'q'
                try:
                    req = urllib.request.Request(url_q, headers=headers, method="GET")
                    with urllib.request.urlopen(req, timeout=12) as resp:
                        res_data = resp.read().decode('utf-8')
                        res_json = json.loads(res_data)
                        if res_json.get("return") is True:
                            success = True
                except urllib.error.HTTPError as he:
                    err_body = he.read().decode('utf-8', errors='ignore')
                    try:
                        err_parsed = json.loads(err_body)
                        status_code = err_parsed.get("status_code", 0)
                        raw_msg = err_parsed.get("message", "")
                        if status_code == 999 or "100 INR" in raw_msg:
                            err_detail = "Fast2SMS API सक्रिय करने के लिए Fast2SMS खाते में ₹100 का एक बार रिचार्ज आवश्यक है (One-time ₹100 recharge required in Fast2SMS wallet)."
                        elif status_code == 996:
                            err_detail = "Fast2SMS वेबसाइट वेरिफिकेशन या DLT आवश्यक है।"
                        else:
                            err_detail = f"Fast2SMS error ({status_code}): {raw_msg}"
                    except Exception:
                        err_detail = f"HTTP {he.code}: {err_body}"
                except Exception as ex:
                    err_detail = str(ex)

                # If Route 'q' didn't succeed and didn't fail due to 999 recharge, attempt Route 'otp'
                if not success and "100 INR" not in err_detail:
                    params_otp = urllib.parse.urlencode({
                        "authorization": api_key,
                        "route": "otp",
                        "variables_values": otp,
                        "numbers": phone
                    })
                    url_otp = f"https://www.fast2sms.com/dev/bulkV2?{params_otp}"
                    try:
                        req2 = urllib.request.Request(url_otp, headers=headers, method="GET")
                        with urllib.request.urlopen(req2, timeout=12) as resp2:
                            res_data2 = resp2.read().decode('utf-8')
                            res_json2 = json.loads(res_data2)
                            if res_json2.get("return") is True:
                                success = True
                                res_json = res_json2
                    except urllib.error.HTTPError as he2:
                        err_body2 = he2.read().decode('utf-8', errors='ignore')
                        try:
                            err_parsed2 = json.loads(err_body2)
                            status_code2 = err_parsed2.get("status_code", 0)
                            raw_msg2 = err_parsed2.get("message", "")
                            if status_code2 == 999 or "100 INR" in raw_msg2:
                                err_detail = "Fast2SMS API सक्रिय करने के लिए Fast2SMS खाते में ₹100 का एक बार रिचार्ज आवश्यक है (One-time ₹100 recharge required in Fast2SMS wallet)."
                            elif status_code2 == 996:
                                err_detail = "Fast2SMS: OTP API requires domain verification or ₹100 recharge on Quick SMS route."
                        except Exception:
                            pass
                    except Exception:
                        pass

                if success:
                    safe_print(f"[Fast2SMS] REAL SMS sent successfully to {phone} (OTP: {otp})")
                    self.send_json_response(200, {
                        "success": True,
                        "real_sms": True,
                        "message": f"Real SMS sent to {phone} successfully!",
                        "response": res_json
                    })
                else:
                    safe_print(f"[Fast2SMS] SMS dispatch failed: {err_detail}")
                    self.send_json_response(200, {
                        "success": True,
                        "real_sms": False,
                        "message": err_detail or "SMS dispatch failed on gateway",
                        "otp": otp
                    })

            except Exception as e:
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # 2. API: Save Fast2SMS API Key from Admin Dashboard
        elif self.path == "/api/save-sms-key":
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                data = json.loads(post_body.decode('utf-8'))
                new_key = data.get("api_key", "").strip()
                cfg = load_sms_config()
                cfg["fast2sms_api_key"] = new_key
                if save_sms_config(cfg):
                    self.send_json_response(200, {
                        "success": True, 
                        "message": "Fast2SMS API Key saved successfully!"
                    })
                else:
                    self.send_json_response(500, {"success": False, "message": "Failed to write config file."})
            except Exception as e:
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # 3. API: Get Current SMS Key Status
        elif self.path == "/api/get-sms-status":
            cfg = load_sms_config()
            key = cfg.get("fast2sms_api_key", "").strip()
            masked = (key[:6] + "..." + key[-4:]) if len(key) > 10 else ("Configured" if key else "")
            self.send_json_response(200, {
                "success": True,
                "is_configured": bool(key),
                "masked_key": masked
            })
            return

        # 3b. API: Save UPI Payment Configuration
        elif self.path == "/api/save-upi-config":
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                data = json.loads(post_body.decode('utf-8'))
                upi_id = str(data.get("upi_id", "")).strip()
                payee_name = str(data.get("payee_name", "")).strip()
                if not upi_id:
                    self.send_json_response(400, {"success": False, "message": "UPI ID cannot be empty."})
                    return
                cfg = {
                    "upi_id": upi_id,
                    "payee_name": payee_name or "Devendra Koli - Shree Sai Mobile",
                    "phone": "7972296879"
                }
                if save_upi_config(cfg):
                    self.send_json_response(200, {
                        "success": True,
                        "message": "UPI Configuration saved successfully!",
                        "config": cfg
                    })
                else:
                    self.send_json_response(500, {"success": False, "message": "Failed to save UPI config."})
            except Exception as e:
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # 3c. API: Submit Payment Proof / UTR for Online Order
        elif self.path == "/api/submit-payment-proof":
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                data = json.loads(post_body.decode('utf-8'))
                order_id = data.get("orderId")
                utr = str(data.get("utrNumber", "")).strip()
                app = str(data.get("paymentApp", "PhonePe / GPay")).strip()
                orders = load_orders()
                target_order = None
                for o in orders:
                    if o.get("orderId") == order_id:
                        o["paymentMethod"] = f"Paid Online via {app}"
                        o["paymentStatus"] = "Paid (Pending Verification)"
                        o["utrNumber"] = utr
                        target_order = o
                        break
                if target_order:
                    save_orders(orders)
                    # Notify Admin Dashboard
                    notifs = load_notifs()
                    notif = {
                        "id": f"notif-{int(time.time() * 1000)}",
                        "type": "PAYMENT_RECEIVED",
                        "orderId": order_id,
                        "title": f"💰 Online Payment: {order_id}",
                        "message": f"{target_order.get('customerName')} paid ₹{target_order.get('totalAmount', 0):,} via {app} (UTR: {utr or 'Not Provided'})",
                        "customerName": target_order.get("customerName"),
                        "customerPhone": target_order.get("customerPhone"),
                        "customerAddress": target_order.get("deliveryAddress"),
                        "totalAmount": target_order.get("totalAmount"),
                        "timestamp": datetime.datetime.now().isoformat(),
                        "displayTime": datetime.datetime.now().strftime("%I:%M %p"),
                        "read": False
                    }
                    notifs.insert(0, notif)
                    save_notifs(notifs)
                    self.send_json_response(200, {"success": True, "message": "Payment recorded successfully!"})
                else:
                    self.send_json_response(404, {"success": False, "message": "Order not found"})
            except Exception as e:
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # 4. API: Create New Order (from Storefront on ANY device / phone)
        elif self.path == "/api/create-order":
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                order_data = json.loads(post_body.decode('utf-8'))
                order_id = order_data.get("orderId")
                if not order_id:
                    self.send_json_response(400, {"success": False, "message": "Missing orderId"})
                    return

                orders = load_orders()
                # Deduplicate by orderId
                orders = [o for o in orders if o.get("orderId") != order_id]
                orders.insert(0, order_data)
                save_orders(orders)

                # Create real-time notification for Admin Dashboard
                notifs = load_notifs()
                first_item = (order_data.get("items") or [{}])[0].get("name", "Mobile / Item")
                item_count = len(order_data.get("items") or [])
                more_text = f" + {item_count - 1} more" if item_count > 1 else ""
                
                order_date_str = f"{order_data.get('displayDate', datetime.datetime.now().strftime('%d %b %Y'))} at {order_data.get('displayTime', datetime.datetime.now().strftime('%I:%M %p'))}"
                notif = {
                    "id": f"notif-{int(time.time() * 1000)}",
                    "type": "NEW_ORDER",
                    "orderId": order_id,
                    "title": f"🚨 New Order ({order_data.get('displayTime', '')}): {order_id}",
                    "message": f"{order_data.get('customerName')} ordered {first_item}{more_text} (Total: ₹{order_data.get('totalAmount', 0):,}) on {order_date_str} via {order_data.get('paymentMethod')}",
                    "customerName": order_data.get("customerName"),
                    "customerPhone": order_data.get("customerPhone"),
                    "customerAddress": order_data.get("deliveryAddress"),
                    "totalAmount": order_data.get("totalAmount"),
                    "orderDate": order_date_str,
                    "timestamp": datetime.datetime.now().isoformat(),
                    "displayTime": datetime.datetime.now().strftime("%I:%M %p"),
                    "read": False
                }
                notifs.insert(0, notif)
                save_notifs(notifs)

                safe_print(f"[Order] New Online Order {order_id} ({order_date_str}) from {order_data.get('customerName')} saved to server!")

                # Attempt Fast2SMS SMS Notification to Proprietor (7972296879)
                proprietor_phone = "7972296879"
                sms_sent = False
                try:
                    sms_cfg = load_sms_config()
                    api_key = sms_cfg.get("fast2sms_api_key", "").strip()
                    if api_key:
                        sms_msg = f"Shree Sai Mobile: New Order {order_id} from {order_data.get('customerName')} ({order_data.get('customerPhone')}). Total: Rs.{order_data.get('totalAmount')}. Time: {order_date_str}. Check Admin Panel."
                        params_sms = urllib.parse.urlencode({
                            "authorization": api_key,
                            "route": "q",
                            "message": sms_msg,
                            "language": "english",
                            "flash": "0",
                            "numbers": proprietor_phone
                        })
                        headers = {"authorization": api_key, "Cache-Control": "no-cache", "User-Agent": "Mozilla/5.0"}
                        req_sms = urllib.request.Request(f"https://www.fast2sms.com/dev/bulkV2?{params_sms}", headers=headers, method="GET")
                        with urllib.request.urlopen(req_sms, timeout=6) as sms_resp:
                            safe_print(f"[SMS] Proprietor order notification dispatched to {proprietor_phone} via Fast2SMS")
                            sms_sent = True
                except urllib.error.HTTPError as he:
                    err_txt = he.read().decode('utf-8', errors='ignore')
                    safe_print(f"[SMS Note] Fast2SMS gateway status ({he.code}): {err_txt}")
                except Exception as ex:
                    safe_print(f"[SMS Note] SMS gateway: {ex}")

                self.send_json_response(200, {
                    "success": True,
                    "message": "Order created and synced to server successfully!",
                    "order": order_data,
                    "sms_dispatched": sms_sent
                })
            except Exception as e:
                safe_print("Error creating order:", e)
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # 5. API: Update Order Status (Pending -> Confirmed -> Delivered, Cancelled, Replacement Requested, etc.)
        elif self.path == "/api/update-order-status":
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                data = json.loads(post_body.decode('utf-8'))
                order_id = data.get("orderId")
                new_status = data.get("status")
                reason = data.get("reason", "")
                orders = load_orders()
                found = False
                matched_order = None
                now_str = datetime.datetime.now().strftime("%d %b %Y, %I:%M %p")
                for o in orders:
                    if o.get("orderId") == order_id:
                        o["status"] = new_status
                        if new_status == "Cancelled":
                            o["cancelledAt"] = now_str
                            if reason:
                                o["cancelReason"] = reason
                        elif new_status == "Replacement Requested":
                            o["replaceRequestedAt"] = now_str
                            if reason:
                                o["replaceReason"] = reason
                        found = True
                        matched_order = o
                        break
                if found:
                    save_orders(orders)
                    # Push rich alert notification to admin dashboard
                    if new_status in ["Cancelled", "Replacement Requested"]:
                        notifs = load_notifs()
                        notif_icon = "⚠️" if new_status == "Cancelled" else "🔄"
                        action_label = "Cancelled" if new_status == "Cancelled" else "Replacement Requested"
                        notif = {
                            "id": f"notif-{int(time.time() * 1000)}",
                            "type": "ORDER_STATUS_UPDATE",
                            "orderId": order_id,
                            "title": f"{notif_icon} Order {action_label}: {order_id}",
                            "message": f"Customer {matched_order.get('customerName')} marked order {order_id} as {action_label} on {now_str}. Reason: {reason or 'Not specified'}",
                            "customerName": matched_order.get("customerName"),
                            "customerPhone": matched_order.get("customerPhone"),
                            "timestamp": datetime.datetime.now().isoformat(),
                            "displayTime": datetime.datetime.now().strftime("%I:%M %p"),
                            "read": False
                        }
                        notifs.insert(0, notif)
                        save_notifs(notifs)

                    safe_print(f"[Order] Status for {order_id} updated to {new_status} (Reason: {reason})")
                    self.send_json_response(200, {"success": True, "message": f"Order {order_id} updated"})
                else:
                    self.send_json_response(404, {"success": False, "message": "Order not found"})
            except Exception as e:
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # 6. API: Mark All Notifications Read
        elif self.path == "/api/mark-notifications-read":
            try:
                notifs = load_notifs()
                for n in notifs:
                    n["read"] = True
                save_notifs(notifs)
                self.send_json_response(200, {"success": True})
            except Exception as e:
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # 7. API: Save or Update Product
        elif self.path == "/api/save-product":
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                item = json.loads(post_body.decode('utf-8'))
                pid = str(item.get("id") or f"prod-{int(time.time()*1000)}")
                item["id"] = pid
                prods = load_products()
                exists = False
                for i, p in enumerate(prods):
                    if str(p.get("id")) == str(pid):
                        prods[i] = item
                        exists = True
                        break
                if not exists:
                    prods.insert(0, item)
                save_products(prods)
                safe_print(f"[Product] Saved to store: {item.get('name')} ({item.get('brand')}, {item.get('category')})")
                self.send_json_response(200, {
                    "success": True,
                    "message": "Product saved successfully!",
                    "product": item,
                    "products": prods
                })
            except Exception as e:
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # 8. API: Delete Product
        elif self.path == "/api/delete-product":
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                data = json.loads(post_body.decode('utf-8'))
                pid = str(data.get("id") or data.get("productId") or "")
                prods = load_products()
                prods = [p for p in prods if str(p.get("id")) != pid]
                save_products(prods)
                safe_print(f"[Product] Deleted from store: {pid}")
                self.send_json_response(200, {
                    "success": True,
                    "message": "Product removed successfully!",
                    "products": prods
                })
            except Exception as e:
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # 9. API: Save POS Billing Invoice (Permanent Storage)
        elif self.path == "/api/save-pos-invoice":
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                inv_data = json.loads(post_body.decode('utf-8'))
                inv_num = inv_data.get("invNumber")
                if not inv_num:
                    self.send_json_response(400, {"success": False, "message": "Missing invNumber"})
                    return
                invoices = load_pos_invoices()
                # Deduplicate by invNumber
                invoices = [i for i in invoices if i.get("invNumber") != inv_num]
                invoices.insert(0, inv_data)
                save_pos_invoices(invoices)
                safe_print(f"[POS] Saved bill {inv_num} for {inv_data.get('custName')}")
                self.send_json_response(200, {
                    "success": True,
                    "message": "POS invoice saved to server permanently!",
                    "invoices": invoices
                })
            except Exception as e:
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # 10. API: Delete POS Invoice (Admin Explicit Action)
        elif self.path == "/api/delete-pos-invoice":
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                data = json.loads(post_body.decode('utf-8'))
                inv_num = data.get("invNumber")
                if not inv_num:
                    self.send_json_response(400, {"success": False, "message": "Missing invNumber"})
                    return
                invoices = load_pos_invoices()
                invoices = [i for i in invoices if i.get("invNumber") != inv_num]
                save_pos_invoices(invoices)
                safe_print(f"[POS] Admin deleted bill {inv_num}")
                self.send_json_response(200, {
                    "success": True,
                    "message": f"Invoice {inv_num} deleted from server!",
                    "invoices": invoices
                })
            except Exception as e:
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # 11. API: Clear All POS Invoices (Admin Explicit Action)
        elif self.path == "/api/clear-pos-invoices":
            save_pos_invoices([])
            safe_print("[POS] Admin cleared all POS invoices history")
            self.send_json_response(200, {
                "success": True,
                "message": "All POS invoices history cleared from server!",
                "invoices": []
            })
            return

        # 12. API: Save Customers List (Khata CRM)
        elif self.path == "/api/save-customers":
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                data = json.loads(post_body.decode('utf-8'))
                cust_list = data if isinstance(data, list) else data.get("customers", [])
                save_customers(cust_list)
                safe_print(f"[Customers] Saved {len(cust_list)} customers to customers.json")
                self.send_json_response(200, {
                    "success": True,
                    "message": f"Saved {len(cust_list)} customers successfully!",
                    "customers": cust_list
                })
            except Exception as e:
                self.send_json_response(500, {"success": False, "message": str(e)})
            return

        # Fallback to default handler
        super().do_POST()

    def do_GET(self):
        if self.path == "/api/get-customers":
            custs = load_customers()
            self.send_json_response(200, {
                "success": True,
                "customers": custs
            })
            return
        elif self.path == "/api/get-pos-invoices":
            invoices = load_pos_invoices()
            self.send_json_response(200, {
                "success": True,
                "invoices": invoices
            })
            return
        elif self.path == "/api/get-products":
            prods = load_products()
            self.send_json_response(200, {
                "success": True,
                "products": prods
            })
            return
        elif self.path == "/api/get-sms-status":
            cfg = load_sms_config()
            key = cfg.get("fast2sms_api_key", "").strip()
            masked = (key[:6] + "..." + key[-4:]) if len(key) > 10 else ("Configured" if key else "")
            self.send_json_response(200, {
                "success": True,
                "is_configured": bool(key),
                "masked_key": masked
            })
            return
        elif self.path == "/api/get-orders":
            orders = load_orders()
            self.send_json_response(200, {
                "success": True,
                "orders": orders
            })
            return
        elif self.path == "/api/get-notifications":
            notifs = load_notifs()
            self.send_json_response(200, {
                "success": True,
                "notifications": notifs
            })
            return
        elif self.path == "/api/get-upi-config":
            cfg = load_upi_config()
            self.send_json_response(200, {
                "success": True,
                "config": cfg
            })
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, authorization')
        self.end_headers()

    def send_json_response(self, status_code, data):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, authorization')
        self.end_headers()
        self.wfile.write(body)

if __name__ == "__main__":
    # Allow port reuse to avoid 'Address already in use'
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Server started at http://localhost:{PORT}/ serving {DIRECTORY}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Server stopped.")
