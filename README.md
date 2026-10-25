# poopfartporker

## Tony Montana's Terminal

`tony-montanas-terminal.html` is a Bloomberg-style dashboard for the Tony Montana portfolio (AMD, CELH, ELF, ORCL) and its watchlist.

- `terminal/portfolio.json`: share counts, watchlist groups, market instruments.
- `terminal/events.json`: upcoming earnings and macro dates (from Tony Montana's Schedule).
- `terminal/build.py`: pulls prices, charts and headlines from Yahoo Finance and bakes them into the page. Standard library only.

Refresh by hand:

```
python3 terminal/build.py
```

A scheduled task runs it every morning before 8:00 AM ET and republishes the artifact.
