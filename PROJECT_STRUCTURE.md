# Project Structure

## Overview
This project is organized by routes/pages for easy navigation and maintenance.

## Folder Structure

```
src/
├── pages/                          # Route-based page components
│   ├── HomePage.tsx               # Route: /
│   ├── DashboardPage.tsx          # Route: /dashboard
│   ├── ApplicationsPage.tsx       # Route: /applications
│   ├── CollateralPage.tsx         # Route: /collateral
│   └── RepaymentPage.tsx          # Route: /repayment
│
├── components/                     # Feature-based components
│   ├── home/                      # Homepage components (/)
│   │   ├── Hero.tsx              # Landing hero section
│   │   ├── Hero.css
│   │   ├── Features.tsx          # Features section
│   │   ├── Features.css
│   │   ├── HowItWorks.tsx        # How it works section
│   │   ├── HowItWorks.css
│   │   ├── Calculator.tsx        # Loan calculator
│   │   ├── Calculator.css
│   │   ├── Benefits.tsx          # Benefits section
│   │   └── Benefits.css
│   │
│   ├── dashboard/                 # Dashboard page (/dashboard)
│   │   ├── Dashboard.tsx         # Main dashboard with metrics
│   │   └── Dashboard.css
│   │
│   ├── applications/              # Applications page (/applications)
│   │   ├── Applications.tsx      # Loan applications & accounts management
│   │   └── Applications.css
│   │
│   ├── collateral/                # Collateral page (/collateral)
│   │   ├── Collateral.tsx        # Collateral management & LTV tracking
│   │   └── Collateral.css
│   │
│   ├── repayment/                 # Repayment page (/repayment)
│   │   ├── Repayment.tsx         # Repayment tracking & payment recording
│   │   └── Repayment.css
│   │
│   └── shared/                    # Shared components across routes
│       ├── Footer.tsx
│       └── Footer.css
│
├── context/                        # React Context providers
│   └── ThemeContext.tsx          # Dark mode theme context
│
├── App.tsx                        # Main app with route definitions
├── App.css
└── index.tsx                      # Entry point with Router setup
```

## Route Mapping

| Route            | Page Component      | Main Component Used | Description                          |
|------------------|---------------------|---------------------|--------------------------------------|
| `/`              | HomePage            | Hero, Features, etc | Landing page with company info       |
| `/dashboard`     | DashboardPage       | Dashboard           | Metrics & quick actions dashboard    |
| `/applications`  | ApplicationsPage    | Applications        | Loan applications & accounts CRUD    |
| `/collateral`    | CollateralPage      | Collateral          | Collateral management & LTV tracking |
| `/repayment`     | RepaymentPage       | Repayment           | Repayment tracking & payments        |

## Component Organization

### Page Components (`src/pages/`)
- Thin wrapper components that handle routing logic
- Use `useNavigate()` hook from react-router-dom
- Pass navigation handlers to feature components
- Handle scroll-to-top on navigation

### Feature Components (`src/components/[feature]/`)
- Main business logic and UI for each feature
- Organized by route/page for easy maintenance
- Each component has its own CSS file in the same folder
- Self-contained with all modals, forms, and subcomponents

### Shared Components (`src/components/shared/`)
- Components used across multiple pages
- Currently contains Footer (used on homepage)
- Add any cross-cutting UI components here

## Navigation Flow

```
HomePage (/)
    └─ Click "Get Started"
        └─ DashboardPage (/dashboard)
            ├─ Click "Applications" → ApplicationsPage (/applications)
            ├─ Click "Collateral" → CollateralPage (/collateral)
            └─ Click "Repayment" → RepaymentPage (/repayment)
```

All operational pages can navigate back to Dashboard, which can navigate back to Homepage.

## Adding New Routes

1. Create page component in `src/pages/[NewPage].tsx`
2. Create feature component in `src/components/[feature]/[Feature].tsx`
3. Add route in `src/App.tsx`:
   ```tsx
   <Route path="/new-route" element={<NewPage />} />
   ```
4. Add navigation handlers in parent components

## Benefits of This Structure

✅ **Route-based organization**: Easy to find components by URL
✅ **Feature isolation**: Each feature has its own folder
✅ **Scalability**: Easy to add new routes/features
✅ **Maintainability**: Clear separation of concerns
✅ **Co-location**: Components and styles are together
