#!/usr/bin/env python3
"""Phone alerts for the Blade Runner terminal. Run right after build.py, before publishing.

Looks at the freshly built data in blade-runner-terminal.html and prints one line per alert:
  - a holding moves MOVE_PCT% or more today (once per stock per day)
  - a holding reports earnings within EARN_DAYS days (once when it comes into range, once on the day)
  - Wall Street's consensus rating on a holding changes (e.g. Hold -> Buy)

What was already sent, and the last ratings seen, live in a small JSON block at the top of the page
(<script id="tm-state">), so the published page carries them from one run to the next. Pass the block
from the live page with --prev; the script writes the updated block back into the local page.
Prints "No alerts." when nothing triggers. Standard library only.

    python3 terminal/alerts.py --prev /tmp/prev_state.json
"""
import argparse
import datetime as dt
import json
import re
import sys
from pathlib import Path
from zoneinfo import ZoneInfo

MOVE_PCT = 5.0
EARN_DAYS = 3
KEEP_DAYS = 10  # forget sent alerts after this long
ET = ZoneInfo("America/New_York")
HERE = Path(__file__).resolve().parent
PAGE = HERE.parent / "blade-runner-terminal.html"
DATA_RE = re.compile(r'(<script id="tm-data" type="application/json">)(.*?)(</script>)', re.S)
STATE_RE = re.compile(r'(<script id="tm-state" type="application/json">)(.*?)(</script>)', re.S)


def load_json(text, default):
    try:
        v = json.loads(text)
        return v if isinstance(v, dict) else default
    except (TypeError, ValueError):
        return default


def check(data, prev, today):
    """Returns (alert lines, new state)."""
    sent = {k: v for k, v in (prev.get("sent") or {}).items()
            if (today - dt.date.fromisoformat(v)).days <= KEEP_DAYS}
    old_rec = prev.get("rec") or {}
    alerts, rec = [], {}

    def once(key, line):
        if key not in sent:
            sent[key] = today.isoformat()
            alerts.append(line)

    for h in data.get("holdings", []):
        t, last, prevc = h["t"], h.get("last"), h.get("prev")
        # Big move, only if the quote is from today (no alerts off Friday's numbers on a weekend run).
        traded = h.get("time") and dt.datetime.fromtimestamp(h["time"], ET).date() == today
        if traded and last and prevc:
            pct = (last / prevc - 1) * 100
            if abs(pct) >= MOVE_PCT:
                once(f"move:{t}:{today}", f"{t} is {'up' if pct > 0 else 'down'} {abs(pct):.1f}% today, at ${last:,.2f}.")
        # Rating change: compare with the consensus seen on the previous run.
        f = h.get("fund") or {}
        r = f.get("rec")
        if r:
            rec[t] = r
            if old_rec.get(t) and old_rec[t] != r:
                votes = f" ({f.get('nBuy')} buy · {f.get('nHold')} hold · {f.get('nSell')} sell)" if f.get("nBuy") is not None else ""
                alerts.append(f"Analysts' consensus on {t} changed: {old_rec[t]} → {r}{votes}.")

    held = {h["t"] for h in data.get("holdings", [])}
    for e in data.get("events", []):
        if e.get("tk") not in held or "earnings" not in e.get("t", "").lower():
            continue
        days = (dt.date.fromisoformat(e["d"]) - today).days
        when = (e.get("when") or "").split(" · ")[0].lower()
        when = f", {when}" if when else ""
        if days == 0:
            once(f"earnday:{e['tk']}:{e['d']}", f"{e['tk']} reports earnings today{when}.")
        elif 0 < days <= EARN_DAYS:
            day = dt.date.fromisoformat(e["d"])
            once(f"earn:{e['tk']}:{e['d']}", f"{e['tk']} reports earnings in {days} day{'s' if days > 1 else ''} ({day:%a %b} {day.day}{when}).")
    return alerts, {"v": 1, "rec": rec, "sent": sent}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prev", help="JSON from the live page's tm-state block (omit on the first run)")
    ap.add_argument("--page", default=str(PAGE))
    ap.add_argument("--today", help="YYYY-MM-DD, for testing")
    a = ap.parse_args()
    page = Path(a.page)
    html = page.read_text()
    m = DATA_RE.search(html)
    if not m:
        sys.exit(f"no tm-data block in {page}")
    data = json.loads(m.group(2))
    sm = STATE_RE.search(html)
    if a.prev and Path(a.prev).exists():
        prev = load_json(Path(a.prev).read_text(), {})
    else:
        prev = load_json(sm.group(2), {}) if sm else {}
    today = dt.date.fromisoformat(a.today) if a.today else dt.datetime.now(ET).date()
    alerts, state = check(data, prev, today)
    blob = json.dumps(state, separators=(",", ":"))
    if sm:
        html = STATE_RE.sub(lambda mo: mo.group(1) + blob + mo.group(3), html, count=1)
    else:
        sys.exit(f"no tm-state block in {page}")
    page.write_text(html)
    print("\n".join(alerts) if alerts else "No alerts.")


if __name__ == "__main__":
    main()
