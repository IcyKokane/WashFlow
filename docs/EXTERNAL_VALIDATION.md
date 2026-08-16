# WashFlow V0.1 — External Validation Protocol

## Objective
Validate that solo and very small pressure-washing operators can use WashFlow's quote-to-paid workflow quickly enough that the product is preferable to ad-hoc contacts, notes, spreadsheets, and calendars.

No feature expansion is authorized during this gate unless a defect blocks testing or repeated tester feedback identifies the same critical omission.

## Internal device gate — PASSED

- Production build: passed GitHub Actions.
- HTTPS/PWA deployment: passed GitHub Pages.
- Android local persistence: passed after closing and reopening Chrome.
- Full quote-to-paid workflow: passed on Android.
- Observed internal completion time: approximately 30 seconds for the primary workflow.

## Target cohort
Recruit 5–10 owner-operated or very small pressure-washing businesses. Prefer operators who currently use a mixture of phone contacts, notes, spreadsheets, calendar apps, generic invoicing tools, or a CRM they consider too expensive/heavy.

Do not require testers to pay during the initial validation period.

## Tester task
1. Open WashFlow on a phone.
2. Create a real or representative customer/property.
3. Create a quote using one or more service templates.
4. Accept the quote and convert it to a job.
5. Schedule the job.
6. Add representative before/after photos.
7. Complete the job.
8. Generate the invoice and mark it paid.
9. Close and reopen the app/site and confirm the record remains.
10. Use WashFlow for additional jobs during the test period when practical.

## Measurements
For each tester record only non-sensitive product-validation data:

- Could they complete the workflow without assistance? yes/no
- Approximate first-run completion time
- Did they use it again? yes/no
- Number of jobs/quotes they chose to manage in WashFlow
- Most confusing step
- Most useful feature
- Feature they expected but could not find
- Current workflow/tool category
- Would they continue using WashFlow? yes/no/maybe
- Would they pay $10–$20/month for a maintained version? yes/no/maybe
- Would they recommend it to another solo operator? yes/no/maybe

Do not collect customer names, addresses, photos, invoice contents, or other tester business data for validation analytics.

## Success gate
External validation is considered strong enough for acquisition packaging when:

- 5+ operators test the product;
- 3+ voluntarily use it beyond the first guided workflow;
- no recurring data-loss or workflow-blocking defect appears;
- at least 2 operators indicate willingness to pay or clear replacement value versus their current workflow;
- repeated feedback does not reveal a missing feature that prevents the core quote-to-paid use case.

## Decision after validation

### Sell/Package
Choose this path when the success gate passes and the product has credible usage evidence. Prepare a transferable WashFlow vertical package, validation summary, screenshots/demo, roadmap, and acquisition listing while explicitly excluding reusable Foolish Service Core IP from the asset sale unless separately negotiated.

### One focused revision
Choose this path when demand is credible but one or two repeated workflow problems prevent continued use. Fix only those repeated blockers and rerun the affected validation tasks.

### Pivot vertical
Choose this path when operators can use the software but show weak interest or no replacement value. Preserve Foolish Service Core and adapt the vertical layer to the next researched service-business niche rather than expanding WashFlow indefinitely.
