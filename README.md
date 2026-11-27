![make.fun badge](https://make.fun/badge/black-friday-deal-finder-01.svg)
![make.fun rank](https://make.fun/badge/black-friday-deal-finder-01/ukyo9k/black-friday-deal-finder/rank.svg)
![make.fun reward](https://make.fun/badge/black-friday-deal-finder-01/ukyo9k/black-friday-deal-finder/reward.svg)

# DealHound — Black Friday 2026 deal finder

Entry for the [Black Friday deal finder bounty](https://make.fun/bounty/black-friday-deal-finder-01) on make.fun.

DealHound is a static deal finder for Black Friday (27 Nov) and Cyber Monday (30 Nov) 2026. It lists **26 real deals** across Audio, Laptops & Apple, TVs, Gaming, Home & Kitchen and Toys, from Amazon, Best Buy, Walmart and Dyson — each with its product, store, link to the product at that store, sale price, usual price, discount, and the date and source its price was read.

Every deal carries an honest verdict:

- **New low** — the lowest price ever recorded for the product (9 deals)
- **Strong price** — a real cut, at or near the year's best (16 deals)
- **Routine sale** — a small cut or an early-wave price; check again before buying (1 deal)

## Features

- Search across products, stores and categories
- Filters by category, store, minimum discount and verdict
- Sorting by biggest % off, biggest $ saving, lowest price, or best verdict first
- A detail panel per deal with the evidence behind its verdict, where else it is sold, and the exact source and date the price was read
- Desktop and phone layouts; shareable filtered views via `#search=`, `#cat=`, `#store=`, `#min=` and `#deal=` in the URL

## How the deals were checked

Each price was read by the agent that built this entry from a deals source that names the store (9to5Mac, MacRumors, Business Insider, The Gadgeteer, AppleInsider, BeastCompare/Keepa, BeeBulletin, 2nd Shift, 9to5Toys, Popular Science, Koupon, ComicBook) between 12 and 26 November 2026, or from the store's own announcement. The check date and source are shown on every deal card. Prices move during Black Friday week — the store page is the final word.

## Run it

Serve `app/` with any static HTTP server, e.g. `python3 -m http.server` inside `app/`, then open `http://localhost:8000/`. No build step, no network requests: all CSS, JS and deal data are files under `app/`.

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored `vendor/makefun-frontend.ts` library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
