#!/usr/bin/env python3
"""Refresh the market data baked into blade-runner-terminal.html.

Pulls prices, intraday bars, a year of daily closes and headlines from Yahoo
Finance's public chart and search endpoints, and the same valuation ratios and
analyst buy/hold/sell counts from Nasdaq for every stock (holdings and watchlist
alike), plus the sector ETFs, then rewrites the JSON block inside the page.
Standard library only. Meant to run once a day at 8:00 AM ET.

    python3 terminal/build.py
"""
import datetime as dt
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
PAGE = HERE.parent / "blade-runner-terminal.html"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64)"}
NASDAQ_UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
             "Accept": "application/json"}
NQ = "https://api.nasdaq.com/api"
YF = "https://query1.finance.yahoo.com"
DATA_RE = re.compile(r'(<script id="tm-data" type="application/json">)(.*?)(</script>)', re.S)


def log(*a):
    print(*a, file=sys.stderr)


def get(url, tries=4, headers=UA):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=25) as r:
                return json.load(r)
        except Exception as e:  # network blips, 429s
            if i == tries - 1:
                raise
            log(f"retry {url}: {e}")
            time.sleep(2 ** (i + 1))


def chart(sym, rng, interval, events=""):
    q = urllib.parse.quote(sym, safe="")
    res = get(f"{YF}/v8/finance/chart/{q}?range={rng}&interval={interval}&includePrePost=false&events={events}")["chart"]["result"][0]
    quote = res["indicators"]["quote"][0]
    closes, vols = quote.get("close") or [], quote.get("volume") or []
    bars = []
    for i, t in enumerate(res.get("timestamp") or []):
        c = closes[i] if i < len(closes) else None
        if c is None:
            continue
        v = vols[i] if i < len(vols) and vols[i] is not None else 0
        bars.append([t, round(c, 4), int(v)])
    meta = dict(res["meta"], dividends=list(((res.get("events") or {}).get("dividends") or {}).values()))
    return meta, bars


def to_daily(meta, bars):
    """Daily bars keyed by exchange-local date."""
    off = meta.get("gmtoffset", 0)
    return [[dt.datetime.fromtimestamp(t + off, dt.timezone.utc).strftime("%Y-%m-%d"), c, v] for t, c, v in bars]


def last_prev(meta, daily):
    last = meta["regularMarketPrice"]
    pct = meta.get("regularMarketChangePercent")
    if pct is not None:
        prev = last / (1 + pct / 100)
    elif len(daily) >= 2:
        prev = daily[-2][1]
    else:
        prev = meta.get("chartPreviousClose", last)
    return round(last, 4), round(prev, 4)


def security(sym, stock=True):
    """Everything the page shows for one stock or ETF: quote, 1D/5D intraday, a year of daily closes, fundamentals."""
    meta, d1y = chart(sym, "1y", "1d", events="div")
    daily = to_daily(meta, d1y)
    _, i5d = chart(sym, "5d", "15m")
    _, i1d = chart(sym, "1d", "5m")
    last, prev = last_prev(meta, daily)
    fund = (safe(fundamentals, sym) or {}) if stock else {}
    # Dividends and average volume come from Yahoo's own history so every ticker gets them the same way
    # (Nasdaq leaves both blank for many names): trailing-12-month cash dividends, 3-month average volume.
    cutoff = time.time() - 365 * 86400
    fund["div"] = round(sum(x["amount"] for x in meta["dividends"] if x.get("date", 0) >= cutoff), 4)
    vols = [v for _, _, v in daily[-63:] if v]
    fund["avgVol"] = round(sum(vols) / len(vols)) if vols else None
    return {
        "t": sym,
        "name": meta.get("longName") or meta.get("shortName") or sym,
        "exch": meta.get("fullExchangeName", ""),
        "ccy": meta.get("currency", "USD"),
        "last": last, "prev": prev,
        "dayHigh": meta.get("regularMarketDayHigh"), "dayLow": meta.get("regularMarketDayLow"),
        "vol": meta.get("regularMarketVolume"),
        "hi52": meta.get("fiftyTwoWeekHigh"), "lo52": meta.get("fiftyTwoWeekLow"),
        "time": meta.get("regularMarketTime"),
        "daily": daily, "i5d": i5d, "i1d": i1d,
        "fund": fund,
    }


def holding(h):
    return dict(security(h["t"]), shares=h["shares"], cost=h.get("cost"))


def num(v):
    """'$650.00' / '840,332,852,620' / 'N/A' -> float or None."""
    try:
        return float(str(v).replace("$", "").replace(",", ""))
    except (TypeError, ValueError):
        return None


def fundamentals(sym):
    """Street (adjusted) EPS and valuation inputs from Nasdaq. The page divides by the day's price.
    Each piece is fetched on its own so one missing table doesn't blank the rest."""
    nq = lambda path: get(f"{NQ}/{path}", headers=NASDAQ_UA)["data"]
    summ = safe(lambda _: nq(f"quote/{sym}/summary?assetclass=stocks")["summaryData"], sym) or {}
    past = safe(lambda _: nq(f"company/{sym}/earnings-surprise")["earningsSurpriseTable"]["rows"][:4], sym) or []
    fc = safe(lambda _: nq(f"analyst/{sym}/earnings-forecast"), sym) or {}
    ahead = ((fc.get("quarterlyForecast") or {}).get("rows") or [])[:4]
    years = (fc.get("yearlyForecast") or {}).get("rows") or []
    peg = safe(lambda _: (nq(f"analyst/{sym}/peg-ratio").get("pegr") or {}).get("pegValue"), sym)
    tp = safe(lambda _: nq(f"analyst/{sym}/targetprice"), sym) or {}
    votes = tp.get("consensusOverview") or {}
    hist = tp.get("historicalConsensus") or []
    eps = [num(r.get("eps")) for r in past]
    est = [num(r.get("consensusEPSForecast")) for r in ahead]
    if len(est) < 4 or None in est:  # thinly covered names: fall back to next fiscal year's consensus
        est = [num(years[min(1, len(years) - 1)].get("consensusEPSForecast"))] if years else []
    field = lambda k: num((summ.get(k) or {}).get("value"))
    return {
        "epsTTM": round(sum(eps), 4) if len(eps) == 4 and None not in eps else None,
        "epsNTM": round(sum(est), 4) if est and None not in est else None,
        "peg": num(peg),
        "mktCap": field("MarketCap"),
        "target": field("OneYrTarget"),
        "sector": (summ.get("Sector") or {}).get("value"),
        # Wall Street consensus (Buy / Hold / Sell) and how many analysts sit in each camp.
        "rec": ((hist[-1].get("z") or {}).get("consensus") if hist else None),
        "nBuy": votes.get("buy"), "nHold": votes.get("hold"), "nSell": votes.get("sell"),
    }


def watch(sym, group):
    return dict(security(sym), g=group)


def etf(sym, group, about, rel):
    return dict(security(sym, stock=False), g=group, about=about, rel=rel)


def market(sym, name):
    meta, bars = chart(sym, "1mo", "1d")
    daily = to_daily(meta, bars)
    last, prev = last_prev(meta, daily)
    return {"t": sym, "name": name, "last": last, "prev": prev, "daily": daily}


NEWS_PER_FEED = 40
NEWS_DAYS = 14  # older search hits are dropped; ETF searches return a lot of evergreen "should you buy" pieces


def news(sym, universe, cat):
    q = urllib.parse.quote(sym)
    items = get(f"{YF}/v1/finance/search?q={q}&newsCount=20&quotesCount=0").get("news", [])
    out, cutoff = [], time.time() - NEWS_DAYS * 86400
    for n in items:
        link = n.get("link", "")
        if not link.startswith("https://") or n.get("providerPublishTime", 0) < cutoff:
            continue
        rel = [t for t in (n.get("relatedTickers") or []) if t in universe]
        if sym not in rel:
            rel.insert(0, sym)
        out.append({"id": n.get("uuid") or link, "title": n.get("title", "").strip(), "pub": n.get("publisher", ""),
                    "link": link, "time": n.get("providerPublishTime", 0), "tk": rel[:4], "cat": [cat]})
    return out


def safe(fn, *a):
    try:
        return fn(*a)
    except Exception as e:
        log(f"skipped {a[0]}: {e}")
        return None


def main():
    cfg = json.loads((HERE / "portfolio.json").read_text())
    events = json.loads((HERE / "events.json").read_text())
    groups = cfg["watchlist"]
    universe = ({h["t"] for h in cfg["holdings"]} | {t for g in groups.values() for t in g}
                | {e[0] for e in cfg.get("etfs", [])} | {t for ts in cfg.get("news", {}).values() for t in ts})
    # Headlines: each holding, then each sector feed's ETFs and its biggest stocks.
    feeds = [(h["t"], "hold") for h in cfg["holdings"]] + [(t, c) for c, ts in cfg.get("news", {}).items() for t in ts]

    with ThreadPoolExecutor(max_workers=6) as ex:
        hold = list(ex.map(holding, cfg["holdings"]))  # any failure here aborts: no half-built page
        w = [x for x in ex.map(lambda p: safe(watch, *p), [(t, g) for g, ts in groups.items() for t in ts]) if x]
        funds = [x for x in ex.map(lambda p: safe(etf, *p), cfg.get("etfs", [])) if x]
        m = [x for x in ex.map(lambda p: safe(market, *p), cfg["markets"]) if x]
        raw = [x for x in ex.map(lambda p: safe(news, p[0], universe, p[1]), feeds) if x]

    # The same story often comes back from several searches: keep one copy, tagged with every feed that found it.
    byid, headlines, per = {}, [], {}
    for n in sorted((n for lst in raw for n in lst), key=lambda n: -n["time"]):
        key = n["title"].lower()
        if not n["title"]:
            continue
        if key in byid:
            seen = byid[key]
            seen["cat"] += [c for c in n["cat"] if c not in seen["cat"]]
            seen["tk"] += [t for t in n["tk"] if t not in seen["tk"]][:max(0, 4 - len(seen["tk"]))]
            continue
        if per.get(n["cat"][0], 0) >= NEWS_PER_FEED:
            continue
        per[n["cat"][0]] = per.get(n["cat"][0], 0) + 1
        byid[key] = n
        headlines.append(n)

    data = {
        "generated": int(time.time()),
        "asOf": max(h["time"] or 0 for h in hold),
        "holdings": hold,
        "watch": w,
        "markets": m,
        "news": headlines,
        "events": events,
        "etfs": funds,
        "pairs": cfg.get("pairs", []),
        "vs": cfg.get("vs", []),
    }
    blob = json.dumps(data, separators=(",", ":")).replace("</", "<\\/")
    html = PAGE.read_text()
    if not DATA_RE.search(html):
        sys.exit(f"no tm-data block in {PAGE}")
    PAGE.write_text(DATA_RE.sub(lambda mo: mo.group(1) + blob + mo.group(3), html, count=1))
    log(f"ok: {len(hold)} holdings, {len(w)} watchlist, {len(funds)} ETFs, {len(m)} markets, {len(data['news'])} headlines, "
        f"{len(blob) // 1024} KB, as of {dt.datetime.fromtimestamp(data['asOf'], dt.timezone.utc):%Y-%m-%d %H:%M} UTC")


if __name__ == "__main__":
    main()
