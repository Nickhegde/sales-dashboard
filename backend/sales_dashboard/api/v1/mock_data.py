import random
from datetime import datetime, timedelta

REGIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East"]
PRODUCTS = ["Enterprise Plan", "Pro Plan", "Starter Plan", "Add-on Services", "Professional Services", "Support & Maintenance", "Custom Integration"]
REPS = ["Alex Chen", "Maria Santos", "James Okafor", "Priya Patel", "Tom Wheeler"]

def get_seed_and_scale(days: int):
    """Returns a seed and scale factor based on the date range."""
    if days <= 30:
        return 30, 0.08
    elif days <= 90:
        return 90, 0.25
    else:
        return 42, 1.0

def generate_summary(days: int = 365):
    seed, scale = get_seed_and_scale(days)
    random.seed(seed)
    return {
        "total_revenue": round(48_720_500 * scale),
        "revenue_change_pct": round(random.uniform(8, 18), 1),
        "total_deals": round(3847 * scale),
        "deals_change_pct": round(random.uniform(4, 12), 1),
        "avg_deal_size": round(12_665 * random.uniform(0.95, 1.05)),
        "avg_deal_change_pct": round(random.uniform(1, 6), 1),
        "win_rate": round(random.uniform(30, 38), 1),
        "win_rate_change_pct": round(random.uniform(0.5, 3.5), 1),
        "as_of": datetime.now().strftime("%Y-%m-%d"),
        "period_days": days,
    }

def generate_revenue_trend(period="monthly", days: int = 365):
    seed, scale = get_seed_and_scale(days)
    random.seed(seed)
    base = 3_200_000 * scale

    if period == "monthly":
        if days <= 30:
            labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
        elif days <= 90:
            labels = ["Month 1", "Month 2", "Month 3"]
        else:
            labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    else:
        labels = ["Q1","Q2","Q3","Q4"]

    current, previous = [], []
    for i in range(len(labels)):
        noise = random.uniform(0.85, 1.15)
        current.append(round(base * noise * (1 + i * 0.02)))
        previous.append(round(base * noise * 0.88))
    return {"labels": labels, "current_year": current, "previous_year": previous, "period": period}

def generate_revenue_by_region(days: int = 365):
    seed, scale = get_seed_and_scale(days)
    random.seed(seed)
    totals = [round(v * scale) for v in [18_400_000, 12_300_000, 9_800_000, 5_200_000, 3_020_500]]
    total = sum(totals)
    return [{"region": r, "revenue": t, "share_pct": round(t/total*100, 1), "change_pct": round(random.uniform(-5, 18), 1)}
            for r, t in zip(REGIONS, totals)]

def generate_top_products(limit=5, days: int = 365):
    seed, scale = get_seed_and_scale(days)
    random.seed(seed)
    data = [{"product": p, "revenue": round(random.randint(3_000_000, 14_000_000) * scale), "units": round(random.randint(200, 2000) * scale)}
            for p in PRODUCTS]
    data.sort(key=lambda x: x["revenue"], reverse=True)
    for d in data:
        d["avg_price"] = round(d["revenue"] / max(d["units"], 1))
    return data[:limit]

def generate_sales_funnel(days: int = 365):
    seed, scale = get_seed_and_scale(days)
    random.seed(seed)
    stages = ["Leads","Qualified","Proposal","Negotiation","Closed Won"]
    counts = [round(v * scale) for v in [10000, 4200, 2100, 980, 420]]
    return [{"stage": s, "count": c, "conversion_pct": round(counts[i+1]/max(c,1)*100,1) if i<len(counts)-1 else None}
            for i,(s,c) in enumerate(zip(stages,counts))]

def generate_transactions(page=1, days: int = 365):
    seed, scale = get_seed_and_scale(days)
    random.seed(seed + page)
    per_page = 10
    end = datetime.now()
    start = end - timedelta(days=days)
    txns = []
    for i in range((page-1)*per_page, page*per_page):
        date = start + timedelta(seconds=random.randint(0, int((end-start).total_seconds())))
        txns.append({
            "id": f"TXN-{10000+i}",
            "date": date.strftime("%Y-%m-%d"),
            "customer": f"Customer {random.randint(100,999)}",
            "product": random.choice(PRODUCTS),
            "region": random.choice(REGIONS),
            "rep": random.choice(REPS),
            "amount": random.randint(8000, 120000),
            "status": random.choice(["Closed Won","Closed Won","Closed Lost","In Progress"]),
        })
    txns.sort(key=lambda x: x["date"], reverse=True)
    total = round(500 * scale)
    return {"page": page, "per_page": per_page, "total": total, "results": txns}

def generate_all_transactions(days: int = 365):
    """Returns all transactions for CSV export."""
    seed, scale = get_seed_and_scale(days)
    random.seed(seed)
    total = round(500 * scale)
    end = datetime.now()
    start = end - timedelta(days=days)
    txns = []
    for i in range(total):
        date = start + timedelta(seconds=random.randint(0, int((end-start).total_seconds())))
        txns.append({
            "id": f"TXN-{10000+i}",
            "date": date.strftime("%Y-%m-%d"),
            "customer": f"Customer {random.randint(100,999)}",
            "product": random.choice(PRODUCTS),
            "region": random.choice(REGIONS),
            "rep": random.choice(REPS),
            "amount": random.randint(8000, 120000),
            "status": random.choice(["Closed Won","Closed Won","Closed Lost","In Progress"]),
        })
    txns.sort(key=lambda x: x["date"], reverse=True)
    return txns