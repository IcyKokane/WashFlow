# WashFlow

WashFlow is a zero-cost, mobile-first progressive web app for solo and very small pressure-washing businesses.

## V0.1 objective

Provide the shortest reliable path from customer inquiry to paid job while keeping business data local and portable.

`Customer → Property → Quote → Accept → Schedule → Before/After Photos → Complete → Invoice → Paid`

## V0.1 features

- Customer and property records
- Pressure-washing service templates with flat, square-foot, linear-foot, and custom pricing modes
- Lead-to-quote workflow
- Quote sent/accepted/declined states
- Accepted quote → job conversion
- Job scheduling and lifecycle tracking
- Browser-side compressed before/after photos
- Property job/photo history
- Invoice generation and paid/unpaid tracking
- Needs Attention queue for stale quotes, unscheduled accepted jobs, and unpaid/overdue invoices
- Customers and Money views
- Full JSON backup/restore
- Customer and invoice CSV export
- Built-in demo dataset
- IndexedDB local persistence
- Installable/offline-capable PWA shell

## Architecture

- **Foolish Service Core (`src/core`)**: reusable service-business domain, persistence, workflow, photo, attention, and backup utilities.
- **WashFlow vertical (`src/washflow`)**: pressure-washing defaults and demo data.

The split is intentional so reusable Service Core IP is not inseparable from the WashFlow vertical.

## Development constraints

- $0 operating/development-services budget
- No paid APIs
- No required cloud backend
- No Stripe/Twilio/Maps/AI dependency
- Offline/local-first core functionality
- Mobile-first PWA

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
```

GitHub Actions runs the production build for every branch/PR change.

## Hands-on V0.1 validation

1. Create a customer/property and choose one or more pressure-washing services.
2. Build a quote and mark it sent.
3. Accept it and confirm a job is created.
4. Schedule the job.
5. Add before/after photos.
6. Start and complete the job.
7. Generate an invoice and mark it paid.
8. Close/reopen WashFlow between steps and confirm records persist.
9. Download a full backup, load demo data, then restore the backup.
10. Verify the mobile layout and PWA installation on Android over HTTPS.

## Data ownership

WashFlow does not require a hosted account or proprietary cloud to retain core business records. Full backups are portable JSON and table exports are standard CSV. Photo data is included in the full backup as compressed data URLs.

## Current commercialization gate

V0.1 is intended for real-operator validation, not feature expansion. After the build and hands-on device gates pass, the next objective is a small pressure-washing tester cohort and evidence of repeated usage before deciding whether to sell the vertical asset or continue improving it.
