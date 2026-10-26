# poopfartporker

## Tony Montana's Terminal

`tony-montanas-terminal.html` is a Bloomberg-style dashboard for the Tony Montana portfolio (AMD, CELH, ELF, ORCL) and its watchlist.

- `terminal/portfolio.json`: share counts, watchlist groups, market instruments.
- `terminal/events.json`: upcoming earnings and macro dates (from Tony Montana's Schedule).
- `terminal/build.py`: pulls prices, charts and headlines from Yahoo Finance, plus valuation ratios from Nasdaq, for every stock (holdings and watchlist get the same set), and bakes them into the page. Standard library only. To add a stock, put its ticker in a `watchlist` group in `portfolio.json`.

Refresh by hand:

```
python3 terminal/build.py
```

A scheduled task runs it every weekday before 8:00 AM ET and republishes the artifact. It does not commit, so the data baked into the copy here is whatever was last committed by hand.
