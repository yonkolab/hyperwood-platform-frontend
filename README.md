# Hyperwood Trader Frontend

Trader-facing web application for the Hyperwood prediction market platform.

## Stack

- TanStack Start
- TanStack Router + TanStack Query
- Tailwind CSS
- shadcn/ui primitives
- React Hook Form + Zod
- Recharts
- react-i18next
- Storybook
- Vitest
- Playwright

## What this app covers

- public market discovery
- market detail with live chart and order book
- login, registration, email verification, MFA verification
- portfolio summary and historical account views
- wallet funding flows
- account security: sessions, TOTP, API keys

Internal operator workflows are intentionally out of scope here.

## Local setup

1. Start the Hyperwood backend API.
2. Copy the env file:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
npm install
```

4. Start the frontend:

```bash
npm run dev
```

Default local URLs:

- trader frontend: `http://localhost:3002`
- backend API: `http://localhost:3000`

## Environment

Required:

- `VITE_API_BASE_URL`

Optional:

- `VITE_APP_TITLE`
- `VITE_DEFAULT_LOCALE`
- `PLAYWRIGHT_BASE_URL`
- `E2E_MARKET_ID`
- `E2E_USER_EMAIL`
- `E2E_USER_PASSWORD`

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run check
npm run check:types
npm run test
npm run storybook
npm run build-storybook
npm run test:e2e
npm run generate:api
```

## API integration model

This app does not expose backend bearer tokens to browser code.

- login and registration happen through TanStack Start server functions
- the backend opaque session token is stored in an HttpOnly cookie
- authenticated loaders and actions call the backend server-to-server
- private SSE for `/api/v1/portfolio/stream` is proxied through the frontend

The API types are generated from the backend OpenAPI spec:

```bash
npm run generate:api
```

## Storybook

Storybook is configured for the trader UI components and uses app-level providers so links, query hooks, and i18n work inside stories.

Run:

```bash
npm run storybook
```

Build:

```bash
npm run build-storybook
```

## Playwright

The smoke tests assume the backend is running and optionally use seeded credentials.

Configured smoke coverage:

- homepage shell
- login/register routes
- market detail route for a known market id
- authenticated portfolio and wallet access

If you want the full smoke suite:

```bash
E2E_MARKET_ID=<market-id> \
E2E_USER_EMAIL=<email> \
E2E_USER_PASSWORD=<password> \
npm run test:e2e
```

If those values are missing, the backend-dependent cases are skipped.

## Project structure

```text
src/
  components/
  features/
    auth/
    funding/
    markets/
    orders/
    portfolio/
  lib/
    api/
    realtime/
    session/
  locales/
  routes/
```

## Notes

- PT-BR is the default locale
- EN is available as a secondary locale
- UI is intentionally dark and trading-oriented
- the backend remains the system of record for trading, funding, settlement, and security state
