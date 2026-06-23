# Decisions

The biggest product decision was how to handle data that Fake Store API does not expose.
The API is useful for basic product information, but it does not include brand names,
colors, sizes, sale prices, stock counts, or product galleries. I considered three
options: hard-code full products locally, generate every missing field dynamically, or
combine API products with a small local metadata layer.

I chose the local metadata layer in `src/data/productMeta.ts`. The app still tries to
fetch titles, descriptions, images, categories, and prices from Fake Store API, while
local helpers provide deterministic brands, sale prices, color swatches, sizes, stock
states, and quantity caps. I also added a small fallback catalog because the public API
can be blocked by Cloudflare in some environments. This keeps the app close to a real
API-backed flow without pretending Fake Store has variant support that it does not
actually provide.

The trade-off is that variant data is not authored per product in a CMS or database.
Instead, the current implementation derives it from the product id so every product has
stable, repeatable variants. That is good enough for a small demo and makes refreshes and
deep links predictable, but it would not be enough for a real store where stock and
pricing need backend ownership. The fallback catalog is also intentionally small, so it
is a resilience layer rather than a replacement for a proper product service.

With more time, I would move the metadata into a typed product fixture file or a mock API
that behaves more like a real catalog service. I would also add unit tests around variant
selection, quantity caps, sold-out behavior, and cart persistence because those are the
parts most likely to regress as the app grows.
