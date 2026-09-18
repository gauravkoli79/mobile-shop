"""
==========================================================
श्री साई मोबाइल शॉप (Shree Sai Mobile Shop)
मासिक सेल्स एवं प्रॉफिट एनालिटिक्स इंजन (NumPy Analytics)
==========================================================
यह स्क्रिप्ट डेटाबेस से प्राप्त महीने भर के सेल्स डेटा को 
NumPy वेक्टराइज्ड ऑपरेशंस द्वारा सुपर-फास्ट प्रोसेस करती है।
"""

import sys
import numpy as np

# Windows कंसोल पर हिंदी और इमोजी प्रिंटिंग के लिए UTF-8 एनकोडिंग
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except (AttributeError, io.UnsupportedOperation):
        pass

def analyze_monthly_sales(daily_sales_data, product_sales_data):
    """
    मासिक सेल्स और मुनाफे का विस्तृत विश्लेषण करना
    """
    
    # ---------------------------------------------------------
    # 1. दैनिक सेल्स विश्लेषण (Daily Sales Analysis)
    # ---------------------------------------------------------
    # 30 दिनों की दैनिक बिक्री (₹ में)
    daily_sales = np.array(daily_sales_data['sales'], dtype=np.float64)
    # 30 दिनों की लागत मूल्य (Cost of Goods Sold ₹ में)
    daily_costs = np.array(daily_sales_data['costs'], dtype=np.float64)
    
    # कुल मासिक बिक्री (Total Monthly Sales)
    total_sales = np.sum(daily_sales)
    
    # कुल लागत एवं शुद्ध मुनाफा (Total Cost & Net Profit)
    total_cost = np.sum(daily_costs)
    daily_profits = daily_sales - daily_costs
    total_profit = np.sum(daily_profits)
    profit_margin_percent = (total_profit / total_sales) * 100 if total_sales > 0 else 0
    
    # औसत दैनिक बिक्री (Average Daily Sale)
    avg_daily_sale = np.mean(daily_sales)
    
    # औसत दैनिक मुनाफा (Average Daily Profit)
    avg_daily_profit = np.mean(daily_profits)
    
    # सबसे ज्यादा बिक्री वाला दिन (Peak Sales Day)
    best_day_index = np.argmax(daily_sales)
    best_day_number = best_day_index + 1
    best_day_amount = daily_sales[best_day_index]
    
    # सबसे कम बिक्री वाला दिन (Lowest Sales Day)
    worst_day_index = np.argmin(daily_sales)
    worst_day_number = worst_day_index + 1
    worst_day_amount = daily_sales[worst_day_index]

    # ---------------------------------------------------------
    # 2. प्रोडक्ट-वाइज परफॉर्मेंस (Product Performance Analysis)
    # ---------------------------------------------------------
    product_names = np.array(product_sales_data['names'])
    units_sold = np.array(product_sales_data['units_sold'], dtype=np.int32)
    selling_prices = np.array(product_sales_data['selling_prices'], dtype=np.float64)
    cost_prices = np.array(product_sales_data['cost_prices'], dtype=np.float64)

    # प्रत्येक प्रोडक्ट का कुल रेवेन्यू (Revenue = Units * Selling Price)
    product_revenues = units_sold * selling_prices
    
    # प्रत्येक प्रोडक्ट का शुद्ध मुनाफा (Profit = Units * (Selling Price - Cost Price))
    product_profits = units_sold * (selling_prices - cost_prices)

    # (A) सबसे ज्यादा यूनिट्स बिकने वाला प्रोडक्ट (Highest Selling by Volume)
    top_volume_idx = np.argmax(units_sold)
    top_volume_product = {
        'name': product_names[top_volume_idx],
        'units': int(units_sold[top_volume_idx]),
        'revenue': float(product_revenues[top_volume_idx])
    }

    # (B) सबसे ज्यादा कमाई (Revenue) देने वाला प्रोडक्ट (Highest Grossing Product)
    top_revenue_idx = np.argmax(product_revenues)
    top_revenue_product = {
        'name': product_names[top_revenue_idx],
        'revenue': float(product_revenues[top_revenue_idx]),
        'units': int(units_sold[top_revenue_idx])
    }

    # (C) सबसे ज्यादा मुनाफा देने वाला प्रोडक्ट (Most Profitable Product)
    top_profit_idx = np.argmax(product_profits)
    top_profit_product = {
        'name': product_names[top_profit_idx],
        'profit': float(product_profits[top_profit_idx]),
        'units': int(units_sold[top_profit_idx])
    }

    # परिणाम डिक्शनरी
    return {
        'total_sales': total_sales,
        'total_profit': total_profit,
        'profit_margin_percent': profit_margin_percent,
        'avg_daily_sale': avg_daily_sale,
        'avg_daily_profit': avg_daily_profit,
        'best_day': (best_day_number, best_day_amount),
        'worst_day': (worst_day_number, worst_day_amount),
        'top_volume_product': top_volume_product,
        'top_revenue_product': top_revenue_product,
        'top_profit_product': top_profit_product
    }


# ==========================================================
# उदाहरण डेटा एवं रिपोर्ट प्रिंटिंग (Sample Execution)
# ==========================================================
if __name__ == '__main__':
    # 30 दिनों का दैनिक सेल्स डेटा (डेटाबेस से आया हुआ)
    daily_sales_data = {
        'sales': [
            45000, 38000, 52000, 48000, 61000, 75000, 89000,  # सप्ताह 1
            42000, 39000, 47000, 51000, 58000, 82000, 91000,  # सप्ताह 2
            44000, 41000, 49000, 53000, 64000, 78000, 86000,  # सप्ताह 3
            40000, 37000, 46000, 50000, 62000, 94000, 105000, # सप्ताह 4
            55000, 68000                                       # दिन 29-30
        ],
        'costs': [
            39000, 33000, 45000, 41000, 53000, 65000, 77000,
            36000, 34000, 41000, 44000, 50000, 71000, 79000,
            38000, 35000, 42000, 46000, 55000, 67000, 74000,
            35000, 32000, 40000, 43000, 53000, 81000, 90000,
            47000, 58000
        ]
    }

    # महीने भर में बिके हुए मुख्य प्रोडक्ट्स का रिकॉर्ड
    product_sales_data = {
        'names': [
            'Redmi Note 13 5G',
            'Samsung Galaxy S24 Ultra',
            'Vivo V30 5G',
            'iPhone 15 (128GB)',
            'OnePlus Nord CE4',
            'Boat 65W Fast Charger',
            'Boult Bluetooth Earbuds',
            '9D Tempered Glass (All)'
        ],
        'units_sold': [42, 8, 26, 11, 29, 65, 48, 180],
        'cost_prices': [14500, 98000, 28000, 62000, 21000, 850, 950, 45],
        'selling_prices': [16999, 109999, 32999, 71999, 24999, 1499, 1599, 150]
    }

    # एनालिटिक्स प्रोसेस करें
    results = analyze_monthly_sales(daily_sales_data, product_sales_data)

    # आकर्षक हिंदी रिपोर्ट
    print("=" * 65)
    print("📊 श्री साई मोबाइल शॉप - मासिक बिक्री एवं लाभ रिपोर्ट (NumPy)")
    print("=" * 65)
    print(f"💰 कुल मासिक बिक्री (Total Sales)      : ₹{results['total_sales']:,.2f}")
    print(f"📈 कुल शुद्ध मुनाफा (Total Net Profit) : ₹{results['total_profit']:,.2f} ({results['profit_margin_percent']:.2f}% Margin)")
    print(f"📅 दैनिक औसत बिक्री (Avg Daily Sale)   : ₹{results['avg_daily_sale']:,.2f}")
    print(f"💵 दैनिक औसत मुनाफा (Avg Daily Profit) : ₹{results['avg_daily_profit']:,.2f}")
    print("-" * 65)
    print(f"🔥 सबसे अधिक बिक्री वाला दिन (Peak Day) : तारीख {results['best_day'][0]} (₹{results['best_day'][1]:,.2f})")
    print(f"📉 सबसे कम बिक्री वाला दिन (Low Day)   : तारीख {results['worst_day'][0]} (₹{results['worst_day'][1]:,.2f})")
    print("-" * 65)
    print(f"📦 सर्वाधिक बिकने वाला आइटम (By Units) : {results['top_volume_product']['name']}")
    print(f"   └─ कुल बिकी मात्रा                  : {results['top_volume_product']['units']} यूनिट्स (₹{results['top_volume_product']['revenue']:,.2f})")
    print(f"🏆 सर्वाधिक राजस्व देने वाला फोन (Revenue): {results['top_revenue_product']['name']}")
    print(f"   └─ कुल राजस्व (Turnover)            : ₹{results['top_revenue_product']['revenue']:,.2f} ({results['top_revenue_product']['units']} पीस)")
    print(f"💎 सर्वाधिक मुनाफा देने वाला फोन (Profit) : {results['top_profit_product']['name']}")
    print(f"   └─ कुल शुद्ध मुनाफा                 : ₹{results['top_profit_product']['profit']:,.2f}")
    print("=" * 65)
