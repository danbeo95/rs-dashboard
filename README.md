# RS Dashboard — Angular Nx Workspace

> **⚠️ MANDATORY READING — Every team member MUST read and follow this document before writing any code.**

A modular Angular 21 dashboard application built on the **Nx monorepo** architecture. The workspace uses a strict library taxonomy (`feature`, `ui`, `data-access`) with enforced module boundaries to guarantee separation of concerns at build time.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Project Structure — STRICT](#project-structure--strict)
5. [Library Taxonomy — STRICT](#library-taxonomy--strict)
6. [Module Boundary Rules — ENFORCED BY LINT](#module-boundary-rules--enforced-by-lint)
7. [Naming Conventions — MANDATORY](#naming-conventions--mandatory)
8. [Coding Standards — MANDATORY](#coding-standards--mandatory)
9. [How to Add a New Feature](#how-to-add-a-new-feature)
10. [How to Add a New UI Component](#how-to-add-a-new-ui-component)
11. [How to Add a New Data Model / Service](#how-to-add-a-new-data-model--service)
12. [Routing Convention](#routing-convention)
13. [Styling Guidelines](#styling-guidelines)
14. [Testing](#testing)
15. [Linting & Formatting](#linting--formatting)
16. [Deployment](#deployment)
---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Angular | 21.2 |
| Monorepo | Nx | 22.6.4 |
| UI Components | Angular Material | 21.2 |
| Styling | TailwindCSS + SCSS | 3.x |
| Language | TypeScript | 5.9 |
| State / Reactive | RxJS + Angular Signals | 7.8 |
| Linting | ESLint + angular-eslint | 9.x |
| Formatting | Prettier | 3.6 |
| Unit Tests | Jest + Vitest | 30.x / 4.x |
| E2E Tests | Cypress | 15.x |
| Hosting | Firebase Hosting | — |

---

## Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **Nx CLI** (optional, installed via `npx`):  `npm i -g nx@latest`

---

## Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>
cd angular-nx-workspace

# 2. Install dependencies
npm install

# 3. Start the dev server
npm start          # or: npx nx serve

# 4. Open in browser
open http://localhost:4200
```

---

## Project Structure 

```
angular-nx-workspace/
├── src/                              # Application shell (MINIMAL code here)
│   ├── main.ts                       # Bootstrap entry point
│   ├── index.html                    # Root HTML
│   ├── styles.scss                   # Global styles only
│   └── app/
│       ├── app.ts                    # Root component
│       ├── app.html                  # Root template (<router-outlet> only)
│       ├── app.scss                  # Root component styles
│       ├── app.config.ts             # Application providers config
│       ├── app.routes.ts             # Top-level route definitions
│       └── app.spec.ts               # Root component test
│
├── libs/                             # ALL business logic lives here
│   ├── feature-dashboard/            # type:feature — Shell layout with sidebar
│   ├── feature-port/                 # type:feature — Port listing page
│   ├── feature-port-detail/          # type:feature — Port detail page
│   ├── feature-customer/             # type:feature — Customer page
│   ├── feature-home/                 # type:feature — Home page
│   ├── feature-setting/              # type:feature — Settings page
│   ├── ui-page-layout/              # type:ui     — Reusable page layout shell
│   └── data-access/                  # type:data-access — API services & models
│
├── e2e/                              # Cypress E2E tests
├── public/                           # Static assets
│
├── eslint.base.config.mjs            # ⛔ Module boundary rules defined here
├── eslint.config.mjs                 # App-level ESLint (selector prefix rules)
├── nx.json                           # Nx workspace config & generators
├── project.json                      # App project config (tags: type:app)
├── tsconfig.base.json                # Path aliases for library imports
├── tailwind.config.js                # TailwindCSS config
├── firebase.json                     # Firebase Hosting config
└── .prettierrc                       # Prettier config (singleQuote: true)
```

### Rules

1. **`src/app/`** contains ONLY the root component, config, and routes. **No feature code, no services, no models.**
2. **`libs/`** is the ONLY location for feature logic, UI components, and data services.
3. Each library has its own `project.json`, `eslint.config.mjs`, `tsconfig.json`, and test configuration. **Do not share config files between libraries.**
4. Every library MUST export its public API through `src/index.ts`. **Do not import from internal paths.**

---

## Library rule

Every library in `libs/` MUST be classified with exactly ONE of these tags in its `project.json`:

| Tag | Prefix | Purpose | Can Depend On |
|---|---|---|---|
| `type:feature` | `feature-` | Smart components, pages, route-level views. Contains business logic and orchestration. | `type:ui`, `type:data-access` |
| `type:ui` | `ui-` | Dumb/presentational components. Reusable across features. **Zero business logic.** | ❌ Nothing |
| `type:data-access` | `data-access` | API services, data models, state management. | ❌ Nothing |
| `type:app` | — | The application shell (`src/`). | `type:feature`, `type:ui`, `type:data-access` |

### Library Internal Structure — STRICT

Every library MUST follow this exact internal structure:

```
libs/<library-name>/
├── project.json                      # Must include correct "tags" array
├── eslint.config.mjs
├── jest.config.cts
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.spec.json
└── src/
    ├── index.ts                      # Public API barrel — ONLY exports
    ├── test-setup.ts
    └── lib/
        └── <library-name>/           # Component directory (matches lib name)
            ├── <library-name>.ts     # Component class
            ├── <library-name>.html   # Component template
            ├── <library-name>.css    # Component styles
            └── <library-name>.spec.ts # Component tests
```

For `data-access`, the structure includes a `models/` subdirectory:

```
libs/data-access/
└── src/
    ├── index.ts                      # Exports service + all models
    └── lib/
        ├── data-access.ts            # DataAccessService (@Injectable)
        └── models/
            ├── port.model.ts         # Port interface
            └── vessel-voyage.model.ts # VesselVoyage interface
```

---

## Module Boundary Rules — ENFORCED BY LINT

> **These rules are enforced by `@nx/enforce-module-boundaries` in `eslint.base.config.mjs`. Violations will FAIL the lint step and block your PR.**

```
┌─────────────────────────────────────────────────────┐
│                    type:app                          │
│               (src/ — app shell)                     │
│  Can import: feature, ui, data-access                │
└───────┬──────────────┬───────────────┬──────────────┘
        │              │               │
        ▼              ▼               ▼
┌───────────────┐ ┌──────────┐ ┌──────────────────┐
│ type:feature  │ │ type:ui  │ │ type:data-access │
│ (feature-*)   │ │ (ui-*)   │ │ (data-access)    │
│               │ │          │ │                   │
│ Can import:   │ │ Can NOT  │ │ Can NOT import    │
│ ui,           │ │ import   │ │ any other lib     │
│ data-access   │ │ anything │ │                   │
└───────┬───┬───┘ └──────────┘ └──────────────────┘
        │   │          ▲               ▲
        │   └──────────┘               │
        └──────────────────────────────┘
```

### Examples

| Scenario | Allowed? |
|---|---|
| `feature-port` imports from `data-access` | ✅ Yes |
| `feature-port` imports from `ui-page-layout` | ✅ Yes |
| `feature-port` imports from `feature-dashboard` | ❌ **NO — feature → feature is FORBIDDEN** |
| `ui-page-layout` imports from `data-access` | ❌ **NO — ui → data-access is FORBIDDEN** |
| `data-access` imports from `feature-port` | ❌ **NO — data-access → feature is FORBIDDEN** |
| `app.routes.ts` imports from `feature-port` | ✅ Yes (app → feature) |

### How to Verify

```bash
npx nx lint                          # Lint the app
npx nx run-many -t lint              # Lint all projects
```

---

## Naming Conventions

### Library Names

| Type | Format | Examples |
|---|---|---|
| Feature | `feature-<domain>` | `feature-port`, `feature-customer`, `feature-dashboard` |
| Feature sub-page | `feature-<domain>-<sub>` | `feature-port-detail` |
| UI | `ui-<component-name>` | `ui-page-layout`, `ui-data-table`, `ui-card` |
| Data Access | `data-access` | `data-access` (single shared library) |

### Import Alias

All library imports MUST use the workspace path alias, never relative paths:

```typescript
// ✅ CORRECT — use workspace alias
import { DataAccessService, Port } from '@angular-nx-workspace/data-access';
import { UiPageLayout } from '@angular-nx-workspace/ui-page-layout';

// ❌ WRONG — never use relative path to another library
import { DataAccessService } from '../../data-access/src/lib/data-access';
```

---

## Coding Standards

### Angular Component Rules

1. **Standalone components ONLY** — every component must be `standalone: true` (or omit it; Angular 21 defaults to standalone).
2. **Use `inject()` function** — never use constructor injection.
   ```typescript
   // ✅ CORRECT
   private dataAccess = inject(DataAccessService);

   // ❌ WRONG
   constructor(private dataAccess: DataAccessService) {}
   ```
3. **Use Angular Signals** for component state — prefer `signal()`, `computed()`, `effect()` over BehaviorSubject.
   ```typescript
   ports = signal<Port[]>([]);
   isLoading = signal(true);
   averageStayDays = computed(() => calculateAverageStayDays(this.vesselVoyages()));
   ```
4. **Use `toSignal()`** to bridge RxJS observables to signals when appropriate.
5. **Lazy-load all feature routes** using `loadComponent`:
   ```typescript
   {
     path: 'ports',
     loadComponent: () =>
       import('@angular-nx-workspace/feature-port').then(m => m.FeaturePort),
   }
   ```
6. **Template files** — always use `templateUrl` (separate `.html` file), never inline templates.
7. **Style files** — always use `styleUrl` (separate `.css` file), never inline styles.
8. **One component per library** for feature libraries. If a feature grows, extract sub-components into the same library directory.

### TypeScript Rules

1. **Strict typing** — no `any` unless absolutely unavoidable (and must be commented with reason).
2. **Interfaces for data models** — use `interface`, not `class`, for DTOs and API response shapes.
   ```typescript
   // ✅ CORRECT
   export interface Port {
     id: number;
     name: string;
     country: string;
   }

   // ❌ WRONG
   export class Port { ... }
   ```
3. **Use `const` by default** — only use `let` when reassignment is necessary. Never use `var`.
4. **Explicit access modifiers** — use `private` for injected services and internal methods.
5. **No console.log in production code** — only allowed in error handlers (use `console.error`).

### RxJS Rules

1. **Always handle errors** in `subscribe()`:
   ```typescript
   this.dataAccess.getPorts().subscribe({
     next: data => { ... },
     error: () => this.isLoading.set(false),
   });
   ```
2. **Unsubscribe** — use `takeUntilDestroyed()`, `toSignal()`, or `async` pipe. Manual `.unsubscribe()` is discouraged.

### Public API Rules

1. Every library MUST have an `index.ts` barrel file at `src/index.ts`.
2. Export ONLY what consumers need. **Do not export internal helpers, private types, or test utilities.**
3. When adding a new model or service, update `index.ts` immediately.

---

## How to Add a New Feature

> Follow these steps exactly. Skipping any step will result in PR rejection.

### Step 1 — Generate the library

```bash
npx nx generate @nx/angular:library \
  --name=feature-<name> \
  --directory=libs \
  --tags=type:feature \
  --prefix=lib \
  --style=css \
  --standalone
```

### Step 2 — Verify `project.json` tags

```json
// libs/feature-<name>/project.json
{
  "tags": ["type:feature"]
}
```

### Step 3 — Verify `tsconfig.base.json` path alias

```json
// tsconfig.base.json → compilerOptions.paths
"@angular-nx-workspace/feature-<name>": ["libs/feature-<name>/src/index.ts"]
```

### Step 4 — Add the route in `src/app/app.routes.ts`

```typescript
{
  path: '<name>',
  loadComponent: () =>
    import('@angular-nx-workspace/feature-<name>').then(m => m.Feature<Name>),
}
```

### Step 5 — Run lint to verify boundaries

```bash
npx nx lint
npx nx run-many -t lint
```

---

## How to Add a New UI Component

```bash
npx nx generate @nx/angular:library \
  --name=ui-<name> \
  --directory=libs \
  --tags=type:ui \
  --prefix=lib \
  --style=css \
  --standalone
```

**Rules for UI libraries:**
- ❌ Must NOT inject any service
- ❌ Must NOT import from `data-access` or any `feature-*`
- ✅ Use `@Input()` / `input()` and `@Output()` / `output()` for data flow
- ✅ Use `<ng-content>` for content projection

---

## How to Add a New Data Model / Service

### Add a model

1. Create the file: `libs/data-access/src/lib/models/<entity>.model.ts`
2. Define the interface:
   ```typescript
   export interface Customer {
     id: number;
     name: string;
     email: string;
   }
   ```
3. Export from `libs/data-access/src/index.ts`:
   ```typescript
   export * from './lib/models/customer.model';
   ```

### Add a service method

Add methods to the existing `DataAccessService` in `libs/data-access/src/lib/data-access.ts`:

```typescript
getCustomers(): Observable<Customer[]> {
  return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
}
```

> **Do NOT create separate service files per entity.** All API calls go through `DataAccessService`.

---

## Routing Convention

All routes are defined in `src/app/app.routes.ts` and follow this pattern:

| Route Path | Library | Component |
|---|---|---|
| `/` | `feature-dashboard` | `FeatureDashboard` (layout shell) |
| `/ports` | `feature-port` | `FeaturePort` |
| `/ports/:id` | `feature-port-detail` | `FeaturePortDetail` |
| `/customers` | `feature-customer` | `FeatureCustomer` |
| `/settings` | `feature-setting` | `FeatureSetting` |
| `/home` | `feature-home` | `FeatureHome` |

**Rules:**
- Route paths use **lowercase kebab-case**: `customers`, `port-detail`
- All feature routes are **children** of the dashboard layout route
- All routes use **lazy loading** via `loadComponent`
- Default route (`''`) redirects to `ports`

---

## Styling Guidelines

1. **Global styles** go in `src/styles.scss` only — theme imports, resets, Tailwind directives.
2. **Component styles** go in the component's own `.css` file — never in global styles.
3. **TailwindCSS** is available for utility classes in templates.
4. **Angular Material** theme: `azure-blue` (imported in `styles.scss`).
5. **Font**: Roboto (set in `styles.scss` body rule).
6. **SCSS** is used at the app level (`inlineStyleLanguage: 'scss'`). Library components use plain **CSS**.

---

## Testing

```bash
# Run all tests
npx nx run-many -t test

# Run tests for a specific library
npx nx test feature-port
npx nx test data-access

# Run E2E tests
npx nx e2e e2e

# Run tests with coverage
npx nx run-many -t test -- --coverage
```

**Test file rules:**
- Every component MUST have a `.spec.ts` file
- Test files live alongside the component (co-located)
- Use `jest-preset-angular` for component testing

---

## Linting & Formatting

```bash
# Lint everything (includes module boundary checks)
npx nx run-many -t lint

# Format with Prettier
npx prettier --write "**/*.{ts,html,scss,css,json}"

# Check formatting
npx prettier --check "**/*.{ts,html,scss,css,json}"
```

**Prettier config** (`.prettierrc`):
```json
{
  "singleQuote": true
}
```

**ESLint enforces:**
- `@nx/enforce-module-boundaries` — library dependency graph
- `@angular-eslint/component-selector` — prefix `app` (app) / `lib` (libraries), kebab-case
- `@angular-eslint/directive-selector` — prefix `app`, camelCase

---

## Deployment

The app is deployed to **Firebase Hosting**.

```bash
# Build for production
npx nx build --configuration=production

# Deploy to Firebase
npx firebase deploy
```

**Build output**: `dist/angular-nx-workspace/browser`

**Production budgets** (enforced):
| Type | Warning | Error |
|---|---|---|
| Initial bundle | 500 KB | 1 MB |
| Any component style | 4 KB | 8 KB |

---