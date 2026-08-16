# WashFlow

WashFlow is a zero-cost, mobile-first progressive web app for solo and very small pressure-washing businesses.

## V0.1 objective

Provide the shortest reliable path from customer inquiry to paid job while keeping business data local and portable.

Core workflow:

`Customer → Property → Quote → Schedule → Before/After Photos → Complete → Invoice → Paid`

## Architecture

- **Foolish Service Core**: reusable domain and persistence layer for service-business workflows.
- **WashFlow vertical**: pressure-washing terminology, service templates, and UI.

## Development constraints

- $0 operating/development-services budget
- No paid APIs
- No required cloud backend
- Offline-first local persistence
- Mobile-first PWA
- Feature freeze until V0.1 validation

## Day 1 gate

Day 1 is complete when a user can create a customer, property, lead, and estimate; close the app; reopen it; and retain the data locally.
