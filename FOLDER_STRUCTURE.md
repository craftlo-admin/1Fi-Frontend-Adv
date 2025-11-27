# Visual Project Structure

```
AdvFrontend/
│
├── src/
│   │
│   ├── 📁 pages/                    # Route Components (Thin wrappers)
│   │   ├── HomePage.tsx            → Route: /
│   │   ├── DashboardPage.tsx       → Route: /dashboard
│   │   ├── ApplicationsPage.tsx    → Route: /applications
│   │   ├── CollateralPage.tsx      → Route: /collateral
│   │   └── RepaymentPage.tsx       → Route: /repayment
│   │
│   ├── 📁 components/               # Feature Components (Business Logic)
│   │   │
│   │   ├── 📁 home/                # Landing Page (/)
│   │   │   ├── Hero.tsx
│   │   │   ├── Hero.css
│   │   │   ├── Features.tsx
│   │   │   ├── Features.css
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── HowItWorks.css
│   │   │   ├── Calculator.tsx
│   │   │   ├── Calculator.css
│   │   │   ├── Benefits.tsx
│   │   │   └── Benefits.css
│   │   │
│   │   ├── 📁 dashboard/           # Dashboard Page (/dashboard)
│   │   │   ├── Dashboard.tsx
│   │   │   └── Dashboard.css
│   │   │
│   │   ├── 📁 applications/        # Applications Page (/applications)
│   │   │   ├── Applications.tsx
│   │   │   └── Applications.css
│   │   │
│   │   ├── 📁 collateral/          # Collateral Page (/collateral)
│   │   │   ├── Collateral.tsx
│   │   │   └── Collateral.css
│   │   │
│   │   ├── 📁 repayment/           # Repayment Page (/repayment)
│   │   │   ├── Repayment.tsx
│   │   │   └── Repayment.css
│   │   │
│   │   └── 📁 shared/              # Shared Components
│   │       ├── Footer.tsx
│   │       └── Footer.css
│   │
│   ├── 📁 context/
│   │   └── ThemeContext.tsx       # Dark mode theme
│   │
│   ├── App.tsx                     # Route definitions
│   ├── App.css
│   ├── index.tsx                   # Entry point with Router
│   └── index.css
│
├── public/
├── package.json
└── PROJECT_STRUCTURE.md            # This file
```

## Quick Reference

### 🏠 Home Route (`/`)
- **Page:** `HomePage.tsx`
- **Components:** 
  - `home/Hero.tsx` - Hero section with CTA
  - `home/Features.tsx` - Key features
  - `home/HowItWorks.tsx` - Process explanation
  - `home/Calculator.tsx` - EMI calculator
  - `home/Benefits.tsx` - Benefits section
  - `shared/Footer.tsx` - Footer

### 📊 Dashboard Route (`/dashboard`)
- **Page:** `DashboardPage.tsx`
- **Components:**
  - `dashboard/Dashboard.tsx` - Metrics cards & quick actions

### 📋 Applications Route (`/applications`)
- **Page:** `ApplicationsPage.tsx`
- **Components:**
  - `applications/Applications.tsx` - Loan applications & bank accounts CRUD

### 🔐 Collateral Route (`/collateral`)
- **Page:** `CollateralPage.tsx`
- **Components:**
  - `collateral/Collateral.tsx` - Collateral management & LTV tracking

### 💰 Repayment Route (`/repayment`)
- **Page:** `RepaymentPage.tsx`
- **Components:**
  - `repayment/Repayment.tsx` - Payment recording & tracking

## Component Responsibilities

### 📄 Page Components (`pages/`)
- Handle routing with `useNavigate()`
- Manage navigation between routes
- Scroll to top on navigation
- Pass callbacks to feature components

### 🎨 Feature Components (`components/[feature]/`)
- Contain all business logic
- Handle API calls
- Manage component state
- Include modals, forms, tables
- Co-located with CSS files

### 🔄 Shared Components (`components/shared/`)
- Reusable across multiple routes
- Currently: Footer
- Future: Common UI elements

## Benefits

✅ **Clear Separation:** Pages vs Components
✅ **Easy Navigation:** Find code by URL path
✅ **Scalability:** Add new routes easily
✅ **Maintainability:** Each feature is isolated
✅ **Co-location:** Component + CSS together
