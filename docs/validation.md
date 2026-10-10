# Validation record

Checked on 10 October 2026 against a production build without service credentials.

- TypeScript: passed.
- ESLint: no errors; one informational React Compiler warning for TanStack Table.
- Input regression tests: 4 passed.
- Next.js production build: passed.
- Chrome: title search, existing URL filters, role details, mobile navigation and blocked API writes passed; no page errors or horizontal overflow at 390px.
- axe WCAG 2 A/AA and WCAG 2.1 AA scan: no violations detected on home, sample listings, sample role details and setup. Automated scans do not establish complete accessibility conformance.
- Production dependency audit: no known vulnerabilities. Full audit: five high-severity development-tool advisories in ESLint's globbing dependency chain. No compatible automated fix was available; forced remediation would downgrade Next.js lint tooling.

Not validated: connected Clerk authentication, MongoDB writes and transactions, email delivery, AI provider responses, Safari or Firefox. Configure a development account/database and exercise these flows before a production rollout.

Documentation screenshots contain fictional preview data.
