# WashFlow V0.1 Validation Script

Use this script before inviting outside operators.

## Device gate

Test on an Android phone in a secure HTTPS context.

1. Open WashFlow in Chrome.
2. Install/add the PWA to the home screen if offered.
3. Launch from the home-screen icon.
4. Confirm the interface fits without horizontal scrolling.
5. Put the phone in airplane mode after the first load and confirm the app shell still opens.

## Quote-to-paid gate

1. Create a new customer and property.
2. Select at least two pressure-washing services.
3. Enter realistic square-foot/linear-foot quantities and confirm the quote total.
4. Mark the quote sent.
5. Accept the quote and confirm exactly one job is created.
6. Schedule the job.
7. Add one before photo and one after photo from the phone camera/gallery.
8. Start the job and then complete it.
9. Generate an invoice.
10. Confirm the unpaid invoice appears in Money and Needs Attention.
11. Mark the invoice paid and confirm outstanding balance decreases.

## Persistence gate

Close and reopen the PWA after each major stage. Customer, property, quote, job, photos, schedule, invoice, and payment state must remain.

## Portability gate

1. Download a full JSON backup.
2. Export Customers CSV.
3. Export Invoices CSV.
4. Load the built-in demo dataset.
5. Restore the full backup.
6. Confirm the original records and photos return.

## Failure criteria

Do not invite outside testers if any of the following occurs:

- data disappears after closing/reopening;
- accepting one quote can create duplicate jobs;
- invoice totals differ from the accepted quote without explicit editing;
- photo capture crashes the PWA or makes it unusably slow;
- backup restore loses records/photos;
- the production build fails;
- core screens are unusable at normal Android phone width.

## Validation outcome

Once all gates pass, freeze V0.1 features and begin the small real-operator validation cohort. Bugs may be fixed during validation; new features require repeated user evidence rather than speculation.
