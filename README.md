# poopfartporker

## Tony Montana's Terminal

`tony-montanas-terminal.html` is a Bloomberg-style dashboard for the Tony Montana portfolio (AMD, CELH, ELF, ORCL) and its watchlist. It has five pages (tabs, or `#terminal`, `#watchlist`, `#news`, `#schedule`, `#sectors` in the URL):

- **Portfolio**: holdings with a card per stock (next earnings, its sector fund today, how it did against that fund last month, analyst target), price chart, holdings news, upcoming dates, markets.
- **Watchlist**: the 88-stock watchlist with the same price chart. Every stock (holdings and watchlist) shows a Street rating (analyst Buy/Hold/Sell consensus) and a Trend signal (price vs its 50- and 200-day averages).
- **News**: headlines for the holdings and for each sector (semis, software, biotech, regional banks, homebuilders, market), filterable, with a sector check on the side.
- **Schedule**: earnings, Fed and macro dates, grouped by week.
- **Sectors**: how each sector is doing, through 25 ETFs including yours (QQQ, SMH, SOXX, IGV, XBI, KRE, XHB, ITB): a heat map, a relative chart, stock-vs-sector, spreads and a scoreboard of 25 ETFs.

Files:

- `terminal/portfolio.json`: share counts, watchlist groups, market instruments, ETFs (with descriptions), spread pairs and news feeds.
- `terminal/events.json`: upcoming earnings and macro dates shown on the Schedule page.
- `terminal/build.py`: pulls prices, charts and headlines from Yahoo Finance, plus valuation ratios and analyst ratings from Nasdaq, for every stock (holdings and watchlist get the same set) and ETF, and bakes them into the page. Standard library only. To add a stock, put its ticker in a `watchlist` group in `portfolio.json`; to add an ETF, add a row to `etfs`.

Refresh by hand:

```
python3 terminal/build.py
```

A scheduled task runs it every weekday at 7:45 AM ET (done by 8:00) and republishes the artifact. It does not commit, so the data baked into the copy here is whatever was last committed by hand.
