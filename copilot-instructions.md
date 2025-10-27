# Copilot Instructions — Redolent Fragrances (Site Overview)

Purpose: give a future coding agent everything needed to start implementing the Redolent Fragrances website (pages, routes, components, data models, APIs, assets, design tokens, accessibility rules, acceptance criteria, and sample payloads).

---

## Quick summary

- Project: Redolent Fragrances — a small e-commerce site for perfumes with: shop, product detail, customizer, cart & checkout, blog, account, and a "Find Your Scent" quiz.
- Tech expectations: static site HTML/CSS/JS front-end with JavaScript for client logic; REST API endpoints for product/user/order operations. Agent can adapt to frameworks (Vanilla JS, React, Vue) but keep component boundaries and routes consistent.
- File conventions: store images under `assets/images/...`, icons under `assets/icons/`, logos under `assets/logo/`. Put page files under `src/pages` or project root pages if framework-less. Create `src/components` for reusable UI.

---

## Current repo status — scaffolded files (what's already implemented)

The following items have been scaffolded in this repository during the current session. Update or expand them as needed when implementing features.

- `data/products.json` — sample product fixtures (6 products). Used by the Shop page for local development.
- `src/cart.js` — small, localStorage-backed cart module exposing: loadCart, saveCart, getCart, addItem, removeItem, updateQty, clearCart, getCount. It updates the DOM element with id `cart-count` when possible.
- `shop.html` — a lightweight Shop page that renders a product grid and includes sort control.
- `src/shop.js` — client script that fetches `data/products.json`, renders `ProductCard`-like cards, and calls `Cart.addItem()` for quick-add.

Notes:
- `product.html`, `customizer.html`, and `/checkout` routes are not scaffolded yet. `shop.js` links to `product.html?slug=...` for the product detail page; you'll need to scaffold `product.html` to enable full product detail flows.
- The cart module uses localStorage key `rf_cart_v1`. If you change key names, update references across pages.

How to run the Shop locally (quick):

1. From project root, run a static server e.g. Python 3's http.server:

```powershell
python -m http.server 5500
# open http://localhost:5500/shop.html
```

2. The Shop page will fetch `./data/products.json` and render the grid. Quick Add will persist to localStorage and increment the header `#cart-count`.

---

---

## Top-level routes / pages (required)

- `/` — Homepage
- `/shop` — Product listing & filters
- `/product/:slug` — Product detail (with customization CTA)
- `/customizer` — Multi-step perfume customizer (choose notes, intensity, bottle)
- `/cart` — Cart page
- `/checkout` — Checkout flow (shipping, payment, review)
- `/order-confirmation/:orderId` — Order confirmation
- `/account/login` and `/account/signup` — Auth flows
- `/account` — Profile / Order history / Preferences
- `/about` — Brand and mission
- `/blog` and `/blog/:slug` — Blog list and detail
- `/contact` — Contact & support
- `/quiz` — "Find Your Scent" quiz and results

Notes:
- Pages should be reachable via header navigation and internal links described in the LAB06 content. Use human-friendly slugs for products and blog posts.

---

## Page responsibilities and major UI elements

1) Homepage
- Hero banner, headline "Discover Your Signature Scent", Shop Now CTA
- Featured product carousel / featured grid
- Best Sellers (3–4) and newsletter signup
- Quick link to quiz and customizer

Acceptance: hero loads, featured products render from product dataset, newsletter form validates email.

2) Shop (/shop)
- Product grid with sorting (Featured, Newest, Best Selling, Price Low–High, Price High–Low)
- Filters: notes, mood, intensity, price range, availability
- Pagination or infinite scroll

Acceptance: filters & sort combine correctly; product click goes to `/product/:slug`.

3) Product detail (/product/:slug)
- Product images, name, price, size variants, description (top/middle/base notes), reviews, Add to Cart, Customize link
- Customization options: link to `/customizer?base=<slug>` (if customizing from a base)

Acceptance: add-to-cart updates cart state; product data loads via product slug.

4) Customizer (/customizer)
- Multi-step UI: Choose Notes → Select Intensity → Bottle Style → Review & Add to Cart
- Live preview (image/text) and compatibility helper (suggest pairings)

Acceptance: builds a `CustomBlend` object that can be added to cart like a product variant.

5) Cart (/cart)
- Lists line items: product/custom-blend name, quantity, price, remove/update quantity
- Subtotal, estimated shipping/tax, discount code field, proceed to checkout CTA

Acceptance: cart persisted in `localStorage`; server-backed cart optional. Removing items updates subtotal.

6) Checkout (/checkout)
- Shipping address form, delivery method, payment method (card/wallet stubs for v1), review order
- Show secure checkout assurance and links to privacy/returns

Acceptance: validate required fields; on success navigate to `/order-confirmation/:orderId`.

7) Order Confirmation, Account pages, Blog, About, Contact — implement simple, static content based on the content inventory in `LAB06.md` and the asset naming conventions.

---

## Components (reusable) and contracts

- `Header` (props: currentUser, cartCount) — logo, nav links, search input, cart & profile icons
- `Footer` — copyright, newsletter signup
- `ProductCard` (props: product) — image, title, price, quick-add button
- `ProductGrid` (props: products, onLoadMore) — grid layout + pagination
- `ProductDetail` (props: product) — main detail area + thumbnails
- `CartItem` (props: lineItem) — quantity controls, remove
- `CartSummary` — subtotal, shipping estimate, discount input
- `CheckoutForm` — shipping and payment sections (inputs & validation hooks)
- `Quiz` — multi-step quiz component returning recommended product slugs
- `Customizer` — multi-step builder returning a `CustomBlend` payload
- `Modal` / `Toast` — for quick view, confirmations, error messages

Component responsibilities are intentionally small and testable. Keep pure rendering separate from data fetching and state management.

---

## Data models (example JSON shapes)

Product (minimal):

```json
{
  "id": "p_001",
  "slug": "amber-blossom",
  "name": "Amber Blossom",
  "price": 49.0,
  "currency": "USD",
  "images": ["/assets/images/products/rf-prod-amber-blossom-01.jpg"],
  "badges": ["featured","new"],
  "notes": {"top": ["bergamot"], "middle": ["amber"], "base": ["vanilla"]},
  "tags": ["luxurious","spicy"],
  "variants": [{"id":"p_001_v1","size":"50ml","price":49.0}],
  "inventory": 12,
  "rating": 4.6
}
```

Variant: include SKU, size, price, inventory.

User:

```json
{
  "id":"u_001",
  "email":"user@example.com",
  "name":"Amna Sheik",
  "preferences": {"favoriteNotes": ["floral","vanilla"]}
}
```

Cart (client-side):

```json
{
  "items": [
    {"lineId":"c_1","productId":"p_001","variantId":"p_001_v1","quantity":2,"price":49.0},
    {"lineId":"c_2","customBlend": {"name":"My Blend","notes":["rose","musk"],"intensity":"medium"},"price":65.0}
  ],
  "subtotal": 163.0,
  "currency":"USD"
}
```

Order (server): include order id, items, shipping address, payment status, createdAt.

Review:

```json
{
  "productId":"p_001",
  "userId":"u_001",
  "rating":5,
  "title":"Lovely!",
  "body":"Long-lasting and warm",
  "createdAt":"2025-10-01T12:00:00Z"
}
```

---

## Example API endpoints (suggested REST routes)

- GET /api/products?page=1&filter[]=spicy&sort=price_asc — listing
- GET /api/products/:slug — product detail
- GET /api/products/:slug/reviews — reviews
- POST /api/cart (body: {items: [...]}) — create/update server-side cart (optional)
- POST /api/checkout — payload: order data; returns orderId and status
- POST /api/auth/login, POST /api/auth/signup, GET /api/auth/me — auth
- GET /api/blog, GET /api/blog/:slug — blog endpoints
- POST /api/quiz — accepts quiz answers and returns recommended product slugs

Error handling:
- Return JSON with `{error: string, code: number}`; use 400/401/404/500 as appropriate. Include helpful error messages for client to map to UI toasts.

---

## Client-side state and persistence

- Cart: keep primary cart in `localStorage` for guests. If user logs in, merge local cart with server cart via `/api/cart`.
- Auth: store short-lived JWT in an httpOnly cookie if possible; for front-end testing, a simple token in memory or localStorage is acceptable.
- Product cache: cache product lists in memory; revalidate on navigation.

Optimistic UI: when adding to cart, show immediate local update; reconcile with server response and revert on error.

---

## Assets & naming conventions (from LAB06)

- Logos: `assets/logo/rf-logo-primary.svg`, `rf-logo-reverse.svg`, `rf-logomark.svg`
- Icons: `assets/icons/cart.svg`, `search.svg`, `user.svg`, etc.
- Product images: `assets/images/products/rf-prod-<slug>-01.jpg` (primary), `-02.jpg` (alternate), `-thumb.jpg` (thumbnail)
- Customizer images: `assets/images/customizer/...`

Use these names so designers / content editors can swap assets without changing references in code.

---

## Design tokens & CSS variables (starter)

Use a single source of truth for colors and fonts via CSS variables. Example tokens (from LAB06 monochrome palette):

- `--bg-color: #C7B59B` (main background)
- `--heading-color: #332715`
- `--text-color: #33220B`
- `--accent-color: #61523C`
- `--highlight-color: #948979`
- Fonts: `Playfair Display` for headings, `Lato` for body (import from Google Fonts)

Accessibility note: verify contrast against background; keep body text at least 16px base font-size and ensure buttons have a 3:1 focus outline and at least 4.5:1 contrast for text on background.

---

## Accessibility & UX rules

- All images must include meaningful alt text from asset inventory.
- Keyboard navigation: header nav, product grid, modals, quiz and customizer steps must be keyboard operable.
- ARIA: provide role and aria-labels for interactive elements (search input, cart button, close on modals).
- Forms: use semantic HTML, label elements, and client-side validation with accessible error messages.

---

## Testing & acceptance criteria

Automated tests to implement (suggestions):

1) Unit: ProductCard renders product and responds to quick-add click.
2) Integration/E2E: Add product to cart from Shop page, go to checkout, submit mock payment, get redirected to order confirmation (simulate network responses).
3) Customizer: create a custom blend, add to cart, verify cart contains customBlend line.
4) Quiz: take quiz, verify recommended slugs returned by API and linked products open.
5) Accessibility: run axe/core checks on Homepage and Product page.

Acceptance criteria (high level):

- Homepage hero and featured products display and are clickable.
- Filters and sort on `/shop` work together and update results.
- Add-to-cart flow works without page reload (cart persisted in localStorage).
- Checkout validates required fields and shows a confirmation page on success.

---

## Edge cases & business rules

- Out of stock: product with inventory 0 shows "Out of Stock" and prevents add-to-cart.
- Price changes: cart line should show price at time of add; on checkout, warn user if price changed and require confirmation.
- Payment failures: show retry with clear error messaging.

---

## Developer notes and assumptions

- This repository currently contains `index.html`, `main.js`, `styles.css`, and `LAB06.md`. Use those as the base if the project remains framework-less. If starting a framework (React/Vue), keep routes and components aligned to this document.
- Assume no production payment gateway yet; stub the payment step and return a mock order id. When ready, replace with a secure gateway integration.
- For MVP, server-side APIs may be implemented as static JSON files or a simple Express server. Keep the front-end decoupled so the backend can be swapped.

---

## Example quick tasks for a new agent

1. Add `/shop` page that reads `data/products.json` and renders `ProductCard` grid.
2. Implement `cart` module with `localStorage` persistence and header cart count.
3. Implement `product/:slug` page using the product slug to render details and Add to Cart.
4. Stub `/api/checkout` to return `{orderId: 'ORD_123456'}` and route to `/order-confirmation/ORD_123456`.

---

## Where to find content from this project

- See `LAB06.md` (this repository) for the content inventory and color/typography choices.
- Use images and filenames listed in `LAB06.md` when creating placeholder assets.

---

## Next steps (recommended for the agent implementing work)

1. Create a `data/products.json` from the sample product JSON and wire `/shop` to it.
2. Implement client cart with add/update/remove functionality and header cart count.
3. Add basic checkout stub and order confirmation flow.
4. Add customizer skeleton and persist created blends to the cart.
5. Add tests for critical flows listed above.

---

If you need clarification on any content or additional sample data (product list, blog posts, or image placeholders), open `LAB06.md` for the authoritative content inventory and copy the assets/filenames listed there.

Happy building — keep component contracts small and data models explicit.

---

## Detailed sample data models (JSON Schema + examples)

Below are JSON Schema-like interfaces and example payloads suitable for both front-end validation and backend API contracts. Use these as the canonical shapes when creating `data/*.json` fixtures or backend endpoints.

1) Product (JSON Schema-ish / TypeScript)

```json
{
  "$id": "#/definitions/product",
  "type": "object",
  "required": ["id","slug","name","price","currency","images"],
  "properties": {
    "id": {"type":"string"},
    "slug": {"type":"string"},
    "name": {"type":"string"},
    "description": {"type":"string"},
    "price": {"type":"number"},
    "currency": {"type":"string"},
    "images": {"type":"array","items":{"type":"string"}},
    "badges": {"type":"array","items":{"type":"string"}},
    "notes": {
      "type":"object",
      "properties": {
        "top": {"type":"array","items":{"type":"string"}},
        "middle": {"type":"array","items":{"type":"string"}},
        "base": {"type":"array","items":{"type":"string"}}
      }
    },
    "tags": {"type":"array","items":{"type":"string"}},
    "variants": {"type":"array","items":{"$ref":"#/definitions/variant"}},
    "inventory": {"type":"integer"},
    "rating": {"type":"number"}
  }
}
```

Example product (concrete object):

```json
{
  "id": "p_001",
  "slug": "amber-blossom",
  "name": "Amber Blossom",
  "description": "A warm amber-forward scent with vanilla and bergamot in the top notes.",
  "price": 49.0,
  "currency": "USD",
  "images": ["/assets/images/products/rf-prod-amber-blossom-01.jpg","/assets/images/products/rf-prod-amber-blossom-02.jpg"],
  "badges": ["featured","new"],
  "notes": {"top":["bergamot"],"middle":["amber"],"base":["vanilla"]},
  "tags": ["luxurious","evening"],
  "variants": [{"id":"p_001_v1","size":"50ml","price":49.0,"sku":"RF-AB-50"}],
  "inventory": 12,
  "rating": 4.6
}
```

2) Variant (embedded in Product)

```json
{
  "id":"p_001_v1",
  "size":"50ml",
  "price":49.0,
  "sku":"RF-AB-50",
  "inventory":12
}
```

3) User

```json
{
  "id":"u_001",
  "email":"amna@example.com",
  "name":"Amna Sheik",
  "addresses":[{"id":"addr_1","label":"Home","line1":"123 Main St","city":"OKC","postalCode":"73102","country":"US"}],
  "preferences":{"favoriteNotes":["floral","vanilla"]}
}
```

4) Cart (client-side persisted shape)

```json
{
  "id":"cart_1",
  "items":[
    {"lineId":"c_1","productId":"p_001","variantId":"p_001_v1","quantity":2,"unitPrice":49.0},
    {"lineId":"c_2","customBlend":{"id":"cb_1","name":"My Blend","notes":["rose","musk"],"intensity":"medium"},"quantity":1,"unitPrice":65.0}
  ],
  "currency":"USD",
  "subtotal":163.0
}
```

5) CustomBlend (from Customizer)

```json
{
  "id":"cb_1",
  "name":"My Blend",
  "baseProductId":"p_001", // optional link to product used as base
  "notes":["rose","sandalwood","musk"],
  "intensity":"medium", // low | medium | high
  "bottleStyle":"glass-amber",
  "price":65.0
}
```

6) Order (server-side canonical)

```json
{
  "orderId":"ORD_20251027_0001",
  "userId":"u_001",
  "items":[{"productId":"p_001","variantId":"p_001_v1","quantity":2,"unitPrice":49.0},{"customBlendId":"cb_1","quantity":1,"unitPrice":65.0}],
  "shipping": {"addressId":"addr_1","method":"standard","cost":5.0},
  "subtotal":163.0,
  "tax":13.0,
  "total":181.0,
  "currency":"USD",
  "paymentStatus":"paid",
  "createdAt":"2025-10-27T12:00:00Z"
}
```

7) Review

```json
{
  "reviewId":"r_001",
  "productId":"p_001",
  "userId":"u_001",
  "rating":5,
  "title":"Lovely!",
  "body":"Long-lasting and warm — perfect for evenings.",
  "createdAt":"2025-10-01T12:00:00Z"
}
```

---

## UI components: expanded props, outputs, and behaviors

Use these component contracts when scaffolding front-end components so they have predictable inputs/outputs and are easy to test.

- Header
  - Props: { currentUser: User|null, cartCount: number }
  - Events: onNavigate(route), onOpenCart()
  - Behavior: mobile-first nav collapse, search input with debounced query callback

- Footer
  - Props: none (static) or {newsletterSubscribe(url)}
  - Behavior: renders site links, social icons, newsletter form with client validation

- ProductCard
  - Props: { product: Product }
  - Events: onQuickAdd(productId, variantId), onOpenProduct(slug)
  - Behavior: show primary image, price, badges; quick-add button triggers optimistic cart update and a small toast

- ProductGrid
  - Props: { products: Product[], columns?: number }
  - Events: onLoadMore(), onProductClick(slug)

- ProductDetail
  - Props: { product: Product }
  - Events: onAddToCart(lineItem), onCustomize(baseProductId)
  - Behavior: image carousel, variant selector, add-to-cart with validation (inventory)

- CartItem
  - Props: { lineItem }
  - Events: onQuantityChange(lineId, newQty), onRemove(lineId)

- CartSummary
  - Props: { subtotal, shippingEstimate, discounts }
  - Events: onApplyDiscount(code)

- CheckoutForm
  - Props: { cart, user? }
  - Events: onSubmit(orderPayload)
  - Behavior: split into steps, validate each step, show inline accessible error messages

- Quiz
  - Props: none
  - Events: onComplete({answers}) returns array of recommended product slugs

- Customizer
  - Props: { baseProduct?: Product }
  - Events: onBuild(customBlend) — emits a CustomBlend object for adding to cart

- Modal / Toast
  - Props: { open:boolean, title?:string, onClose }
  - Behavior: trap focus, return focus to opener on close

---

## API endpoints (detailed examples)

Design the API to be stable and simple. Example request/response shapes below.

1) GET /api/products?page=1&tag=spicy&sort=price_asc

Response (200):

```json
{
  "page":1,
  "pageSize":24,
  "total":128,
  "products":[ /* Product objects as above */ ]
}
```

2) GET /api/products/:slug

Response (200): { product }
Response (404): { error:"Product not found", code:404 }

3) POST /api/cart
Request: { items: [ {productId, variantId, quantity, customBlend? } ] }
Response (200): { cart }

4) POST /api/checkout
Request (example):

```json
{
  "cartId":"cart_1",
  "shipping":{"address":{...}},
  "payment":{"method":"card","token":"tok_XXXX"}
}
```

Response (200): { orderId: "ORD_...", status: "paid" }
Response (400): { error: "validation failed", fields: { ... }, code:400 }

5) POST /api/quiz
Request: { answers: {occasion:"evening",mood:"confident",preferredNotes:["spicy"]} }
Response (200): { recommendations: ["amber-blossom","spice-noir"] }

6) Auth endpoints
- POST /api/auth/signup — returns { token, user }
- POST /api/auth/login — returns { token, user }
- GET /api/auth/me — returns { user }

Error shape standardization

```json
{ "error": "string message", "code": 400, "details": { /* optional */ } }
```

Use appropriate HTTP status codes: 200, 201 (create), 204 (no content), 400, 401, 403, 404, 422 (validation), 500.

---

## Design tokens, CSS variables, and accessibility rules (concrete)

Place tokens in a single file (`styles/tokens.css` or `:root` in `styles.css`). Example variables (from LAB06's monochrome palette):

```css
:root {
  --bg-color: #C7B59B;
  --heading-color: #332715;
  --text-color: #33220B;
  --accent-color: #61523C;
  --highlight-color: #948979;
  --radius-sm: 6px;
  --shadow-soft: 0 6px 20px rgba(51,39,21,0.08);
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Lato', sans-serif;
}
```

Accessibility rules (apply project-wide):
- Minimum body font-size 16px (desktop baseline). Scale responsively for mobile.
- Text contrast: ensure headings/body text pass 4.5:1 against their background; smaller text at 4.5:1 for body and 3:1 for large headings where applicable.
- Focus states: all interactive elements must have visible focus (outline >= 3px) and not rely on color alone.
- Keyboard support: tab order must be logical; modals trap focus and return focus on close.
- Forms: use <label for> pairing and aria-invalid attributes for errors.

---

## Acceptance tests & checklist (practical tasks)

Implement these as unit/E2E tests (Jest + Testing Library / Playwright or Cypress) depending on the stack.

Critical flows (automated test ideas):

1) Shop -> Add-to-cart -> Cart
- Render shop page with fixture `data/products.json`.
- Click quick-add on first ProductCard and assert cartCount increases and `localStorage.cart` contains expected line.

2) Product detail -> variant selection -> add to cart
- Render product detail for `amber-blossom`, select a size variant, add to cart, and verify cart contains correct variantId and price.

3) Customizer -> Add custom blend to cart
- Fill customizer steps, create `CustomBlend`, add to cart, verify cart contains `customBlend` entry.

4) Checkout validation
- Simulate checkout with missing shipping fields; assert validation errors prevent submission; fill fields and assert success stub returns an `orderId` and navigation to confirmation.

5) Quiz -> Recommendations
- Run quiz with test answers; assert API returns at least one recommended slug and clicking a recommendation opens the product detail page.

Accessibility tests
- Run axe-core against Homepage and Product detail pages and assert zero critical violations.

---

## Implementation notes and quick scaffolding snippets

- `data/products.json` should be an array of product objects (use the example product above); place it in `data/` for easy dev-serving (e.g., `fetch('/data/products.json')`).
- Cart module (sketch): export functions: `loadCart()`, `saveCart(cart)`, `addItem(item)`, `removeItem(lineId)`, `updateQty(lineId, qty)`; keep these functions small and unit-testable.
- Payment: stub `POST /api/checkout` to return `{orderId:'ORD_TEST_1'}` and 200 to allow front-end development without a gateway.

---

## Final todo status (progress)

Completed in this pass:
- Added detailed sample data models
- Expanded component contracts
- Provided detailed API examples
- Added concrete design tokens & accessibility rules
- Wrote acceptance tests and E2E/unit test ideas

Remaining: commit & notify team (todo #7). After you confirm the content, I can create a short README update or a commit message and run the final commit step.

