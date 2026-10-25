#!/usr/bin/env python3
"""Refresh the market data baked into tony-montanas-terminal.html.

Pulls prices, intraday bars, a year of daily closes and headlines from Yahoo
Finance's public chart and search endpoints, then rewrites the JSON block
inside the page. Standard library only. Meant to run once a day at 8:00 AM ET.

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
PAGE = HERE.parent / "tony-montanas-terminal.html"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64)"}
YF = "https://query1.finance.yahoo.com"
DATA_RE = re.compile(r'(<script id="tm-data" type="application/json">)(.*?)(</script>)', re.S)


def log(*a):
    print(*a, file=sys.stderr)


def get(url, tries=4):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=25) as r:
                return json.load(r)
        except Exception as e:  # network blips, 429s
            if i == tries - 1:
                raise
            log(f"retry {url}: {e}")
            time.sleep(2 ** (i + 1))


def chart(sym, rng, interval):
    q = urllib.parse.quote(sym, safe="")
    res = get(f"{YF}/v8/finance/chart/{q}?range={rng}&interval={interval}&includePrePost=false")["chart"]["result"][0]
    quote = res["indicators"]["quote"][0]
    closes, vols = quote.get("close") or [], quote.get("volume") or []
    bars = []
    for i, t in enumerate(res.get("timestamp") or []):
        c = closes[i] if i < len(closes) else None
        if c is None:
            continue
        v = vols[i] if i < len(vols) and vols[i] is not None else 0
        bars.append([t, round(c, 4), int(v)])
    return res["meta"], bars


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


def holding(h):
    sym = h["t"]
    meta, d1y = chart(sym, "1y", "1d")
    daily = to_daily(meta, d1y)
    _, i5d = chart(sym, "5d", "15m")
    _, i1d = chart(sym, "1d", "5m")
    last, prev = last_prev(meta, daily)
    return {
        "t": sym,
        "name": meta.get("longName") or meta.get("shortName") or sym,
        "exch": meta.get("fullExchangeName", ""),
        "ccy": meta.get("currency", "USD"),
        "shares": h["shares"], "cost": h.get("cost"),
        "last": last, "prev": prev,
        "dayHigh": meta.get("regularMarketDayHigh"), "dayLow": meta.get("regularMarketDayLow"),
        "vol": meta.get("regularMarketVolume"),
        "hi52": meta.get("fiftyTwoWeekHigh"), "lo52": meta.get("fiftyTwoWeekLow"),
        "time": meta.get("regularMarketTime"),
        "daily": daily, "i5d": i5d, "i1d": i1d,
    }


def watch(sym, group):
    meta, bars = chart(sym, "1mo", "1d")
    daily = to_daily(meta, bars)
    last, prev = last_prev(meta, daily)
    return {
        "t": sym, "g": group,
        "name": meta.get("shortName") or meta.get("longName") or sym,
        "last": last, "prev": prev,
        "hi52": meta.get("fiftyTwoWeekHigh"), "lo52": meta.get("fiftyTwoWeekLow"),
        "daily": daily,
    }


def market(sym, name):
    meta, bars = chart(sym, "1mo", "1d")
    daily = to_daily(meta, bars)
    last, prev = last_prev(meta, daily)
    return {"t": sym, "name": name, "last": last, "prev": prev, "daily": daily}


def news(sym, universe):
    q = urllib.parse.quote(sym)
    items = get(f"{YF}/v1/finance/search?q={q}&newsCount=10&quotesCount=0").get("news", [])
    out = []
    for n in items:
        link = n.get("link", "")
        if not link.startswith("https://"):
            continue
        rel = [t for t in (n.get("relatedTickers") or []) if t in universe]
        if sym not in rel:
            rel.insert(0, sym)
        out.append({"id": n.get("uuid") or link, "title": n.get("title", "").strip(), "pub": n.get("publisher", ""),
                    "link": link, "time": n.get("providerPublishTime", 0), "tk": rel[:4]})
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
    universe = {h["t"] for h in cfg["holdings"]} | {t for g in groups.values() for t in g}

    with ThreadPoolExecutor(max_workers=6) as ex:
        hold = list(ex.map(holding, cfg["holdings"]))  # any failure here aborts: no half-built page
        w = [x for x in ex.map(lambda p: safe(watch, *p), [(t, g) for g, ts in groups.items() for t in ts]) if x]
        m = [x for x in ex.map(lambda p: safe(market, *p), cfg["markets"]) if x]
        raw = [x for x in ex.map(lambda t: safe(news, t, universe), [h["t"] for h in cfg["holdings"]]) if x]

    seen, headlines = set(), []
    for n in sorted((n for lst in raw for n in lst), key=lambda n: -n["time"]):
        if n["id"] in seen or not n["title"]:
            continue
        seen.add(n["id"])
        headlines.append(n)

    data = {
        "generated": int(time.time()),
        "asOf": max(h["time"] or 0 for h in hold),
        "holdings": hold,
        "watch": w,
        "markets": m,
        "news": headlines[:24],
        "events": events,
    }
    blob = json.dumps(data, separators=(",", ":")).replace("</", "<\\/")
    html = PAGE.read_text()
    if not DATA_RE.search(html):
        sys.exit(f"no tm-data block in {PAGE}")
    PAGE.write_text(DATA_RE.sub(lambda mo: mo.group(1) + blob + mo.group(3), html, count=1))
    log(f"ok: {len(hold)} holdings, {len(w)} watchlist, {len(m)} markets, {len(data['news'])} headlines, "
        f"{len(blob) // 1024} KB, as of {dt.datetime.fromtimestamp(data['asOf'], dt.timezone.utc):%Y-%m-%d %H:%M} UTC")


if __name__ == "__main__":
    main()
