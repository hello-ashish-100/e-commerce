# Nua Shop

A small React e-commerce app built with Vite, TypeScript, React Router, Sass modules,
the Fake Store API, and persistent cart state.

## Features

- Product listing from `https://fakestoreapi.com`
- Product detail route with deep-linkable `color` and `size` URL params
- Local product metadata for brands, sale pricing, variants, stock states, and quantity caps
- Responsive product grid and two-column product detail layout
- Cart drawer with add, remove, quantity update, subtotal, and grand total
- Cart persistence through `localStorage`
- SCSS modules for component styles

## Setup

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Project Structure

- `src/pages` - route-level screens
- `src/components` - reusable UI components
- `src/stores` - cart state and context
- `src/api` - Fake Store API calls
- `src/data` - local product metadata and variant logic
- `src/styles` - global SCSS
- `src/types` - shared TypeScript types
- `src/utils` - small formatting helpers

## Notes

Fake Store API only provides basic product data, so variant-specific data is modeled
locally in `src/data/productMeta.ts`. The app tries Fake Store first for product title,
description, category, image, and base price. If the API is blocked or unavailable, it
falls back to a small local catalog in `src/data/fallbackProducts.ts` so the store still
runs end to end.
