# timeUnlimited

Next.js watch inventory app. The public-facing inventory merges products from two databases:

| | DB1 | DB2 |
|---|---|---|
| **What** | `products` table (your main shop) | `watches` table (WatchFunder) |
| **Access** | Full read/write | Read-only |
| **How** | `pg.Pool` (direct Postgres) | Supabase JS client |

DB1 products and DB2 watches are fetched in parallel and combined in the response. The frontend receives them in the same shape — no changes needed to UI components.

---

## Environment variables

```dotenv
# DB1 — primary Postgres database
CONNECTION_STRING=postgresql://...

JWT_SECRET=...

# DB1 Supabase — image storage only
SUPABASE_URL=https://klgeaepragkplvmhbapf.supabase.co
SUPABASE_KEY=<service_role_key>

# DB2 — WatchFunder (read-only, watches merged into inventory)
DB2_SUPABASE_URL=https://fdyvorhfnjqzkiwnbrhx.supabase.co
DB2_SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

---

## How the merge works

**Routes affected:**
- `GET /api/inventary` — public inventory list with filters
- `GET /api/inventary/home` — homepage featured products
- `GET /api/inventory/[id]` — single product detail

Both DB1 and DB2 are queried in parallel with `Promise.all`. Results are tagged with `_source: "db1"` or `_source: "db2"` so the frontend can tell them apart if needed.

**ID routing for single product:**
- DB1 products use plain UUIDs: `/watch/550e8400-...`
- DB2 watches are prefixed: `/watch/db2-550e8400-...`

The single product route checks the `db2-` prefix and queries the right database automatically.

**Mapping DB2 watches to the UI shape** is handled in `lib/mapProduct.ts` via `mapDB2WatchToInventoryWatch()`. DB2 `market_price` is used as the display price (falls back to `purchase_price`). Images come from `photo_urls` or `photos` columns.

---

## No setup needed on DB2

Unlike the previous approach, this does **not** require any SQL migration to run on DB2. It uses the Supabase Data API (`db2.from("watches").select(...)`) directly — no custom Postgres functions needed.

---

## API reference

### Public inventory
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/inventary` | Merged product list. Supports `?search=&brand=&condition=&caseMaterial=&dialColor=&size=&minPrice=&maxPrice=&sort=&page=&limit=` |
| GET | `/api/inventary/home` | Featured DB1 products + latest 4 DB2 watches |
| GET | `/api/inventory/[id]` | Single product (DB1 or DB2 based on id prefix) |

### Admin (require JWT)
| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/products` | Products list / add |
| GET/PUT/DELETE | `/api/products/[id]` | Single product |
| POST | `/api/products/[id]/status` | Toggle active/archived |
| GET/POST | `/api/products/[id]/categories` | Product categories |
| DELETE | `/api/products/[id]/categories/[categoryId]` | Remove category link |
| GET/POST | `/api/categories` | Categories |
| GET/DELETE | `/api/categories/[id]` | Single category |
| GET/POST | `/api/requests` | Watch requests |
| PUT/DELETE | `/api/requests/[id]` | Single request |
| POST/GET | `/api/images` | Upload / list product images |
| DELETE | `/api/images/[id]` | Delete image |

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/auth/me` | Current user |
| POST | `/api/auth/forgot-password` | Request reset code |
| POST | `/api/auth/reset-password` | Reset password |
