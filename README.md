# Time Unlimited

**A luxury watch marketplace with an AI-assisted admin panel.** Buyers browse and request watches; the shop owner photographs a watch, and Gemini fills in the product form — brand, model, reference, condition, case material, dial — from the image alone.

🔗 **Live:** [timeunlimited.co](https://www.timeunlimited.co/) · 🔐 **Admin panel:** `/admin` (credentials on request)

---

## Stack

`Next.js 16` · `React 19` · `TypeScript (strict)` · `Tailwind CSS 4` · `PostgreSQL` · `Supabase Storage` · `Google Gemini 2.5 Flash` · `Motion` · `dnd-kit` · `Radix UI`

---

## Features

**Storefront**
- Inventory with server-side filtering — brand, condition, case material, dial colour, size, price range — and sorting/pagination
- Watch detail pages with an image gallery and prev/next navigation across the collection
- Two multi-step request flows: *"I know what I want"* and *"help me find it"*, plus a sell-your-watch flow
- Animated, fully responsive marketing pages (mobile-first — the storefront is built for phones)

**Admin panel**
- **AI product intake** — upload a watch photo, Gemini returns structured attributes and auto-fills the form
- **AI copywriting** — generates the product description from the filled-in specs
- Product CRUD with multi-image upload to Supabase Storage, main-image selection, and archive/restore
- Drag-and-drop ordering of featured products shown on the homepage
- Request inbox with filtering by budget, timeframe, brand, material, and region
- JWT auth with an admin-role gate on every mutating endpoint

---

## Architecture notes

Things worth a look if you're reading the code:

**Constrained-vocabulary AI extraction** — `app/api/analyze-watch/route.ts`
The Gemini prompt is built at request time from the app's own reference data (`ALL_BRANDS`, `BRAND_MODELS`, `CONDITIONS`, `CASE_MATERIALS`, `SIZES`, `DIAL_COLORS`) and instructs the model to answer *only* with values from those lists. The result drops straight into the form's select inputs — no fuzzy-matching layer, no free-text values that fail validation later. Images are capped at 5 MB and MIME-checked before they reach the model.

**Composable SQL filtering** — `app/api/inventary/route.ts`
Storefront filters are assembled into a parameterised `WHERE` clause with a running placeholder index, so any combination of the eight filters produces one query with correctly numbered `$n` bindings. Count and page queries run in parallel via `Promise.all`, and images are fetched in a single `ANY($1::uuid[])` round trip and mapped in memory — no N+1.

**Auth as a route-level guard** — `lib/authHelpers.ts`
`requireAuth()` returns either the decoded token payload or a ready-to-return `Response`, so a protected handler starts with two lines and TypeScript narrows the payload for the rest of the body. Role is checked in the same place as the signature, which keeps "authenticated" and "authorised" from drifting apart across 20-odd endpoints.

**Typed database boundary** — `lib/db.ts`, `lib/mapProduct.ts`
`pool.query<T>()` is parameterised with row interfaces (`DBProduct`, `ProductImage`, `RequestRow`), and `mapProduct.ts` is the single place where snake_case database rows become the camelCase shapes the UI renders. Query parameters use a shared `SqlValue` type rather than `any[]`.

---

## Running locally

```bash
git clone https://github.com/k-jdev/timeUnlimited.git
cd timeUnlimited
npm install
cp .env.example .env    # fill in your own values
npm run dev             # http://localhost:3000
```

Requires Node 20+, a PostgreSQL database, a Supabase project (Storage only), and a Google AI Studio API key.

| Variable | Purpose |
|---|---|
| `CONNECTION_STRING` | PostgreSQL connection string |
| `JWT_SECRET` | Signing secret for auth tokens |
| `SUPABASE_URL` / `SUPABASE_KEY` | Supabase project used for product image storage |
| `GEMINI_API_KEY` | Google AI Studio key for photo analysis and description generation |

Scripts: `npm run dev` · `build` · `start` · `lint` · `typecheck` · `format`

---

## API

**Public**

| Method | Path | |
|---|---|---|
| `GET` | `/api/inventary` | Filtered, sorted, paginated inventory |
| `GET` | `/api/inventary/home` | Featured products for the homepage |
| `GET` | `/api/inventary/brands` | Brand facet list |
| `GET` | `/api/inventory/[id]` | Single product |
| `POST` | `/api/requests` | Submit a buy or sell request |

**Admin** — all require `Authorization: Bearer <jwt>` with an `admin` role

| Method | Path | |
|---|---|---|
| `GET` `POST` | `/api/products`, `/api/products/add` | List / create |
| `GET` `PUT` `DELETE` | `/api/products/[id]` | Read / update / delete |
| `POST` | `/api/products/[id]/status` | Archive or restore |
| `GET` `POST` `DELETE` | `/api/products/[id]/categories[/...]` | Category links |
| `GET` `POST` `DELETE` | `/api/categories[/...]` | Categories |
| `GET` `POST` `DELETE` | `/api/images[/...]` | Product images |
| `GET` `PUT` `DELETE` | `/api/requests[/...]` | Request inbox |
| `POST` | `/api/analyze-watch` | Gemini photo analysis |
| `POST` | `/api/generate-description` | Gemini description generation |

**Auth** — `POST /api/auth/login`, `/register`, `/logout`, `/forgot-password`, `/reset-password` · `GET /api/auth/me`

---

## Project layout

```
app/
  (marketing)/ (shop)/ (auth)/ (admin)/ (legal)/   route groups, one layout each
  api/                                             route handlers
components/
  home/ inventory/ watches/ admin/ auth/ layout/   feature components
  ui/                                              shadcn/Radix primitives
hooks/ lib/ types/ data/ constants/
```

---

## What I'd do differently

- **Session storage.** The token lives in `localStorage` and the client redirects unauthenticated users. It works, but an httpOnly cookie plus a middleware check would put the gate on the server instead of relying on the client to enforce it.
- **Route-handler validation.** Request bodies are destructured and checked ad hoc. A Zod schema per endpoint would give one validation path and free request/response types.
- **`<img>` → `next/image`.** ~20 raw `<img>` tags remain in the storefront where I was iterating quickly on layout. They cost real LCP on the image-heavy inventory grid.
- **`react-hooks/set-state-in-effect`.** Four hooks still fetch-then-`setState` inside an effect, which React 19's compiler flags as cascading renders. They belong in Server Components or a proper data-fetching layer.
- **Email delivery.** Password reset generates and stores a code but does not send it yet — the transactional email provider is the missing piece.
- **Tests.** No test suite. The SQL filter builder and `mapProduct` are pure functions with clear contracts and would be the honest place to start.

**Next up:** search across brand and reference with Postgres full-text, saved searches with email alerts, and Stripe deposits on reserved watches.
