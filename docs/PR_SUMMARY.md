# Pull Request Summary: feature/project-setup

## Project organization
- Split the original single-file prototype into `index.html`, `css/styles.css`, `js/app.js`, reusable `data/` modules, and `docs/`.
- Added `assets/` as the home for future visual and downloadable assets.

## Code improvements
- Externalized state court metadata, jurisdiction seed data, and procedural business rules.
- Added safer localStorage helpers and startup restoration.
- Preserved existing inline behavior by intentionally exposing module functions on `window` for backward compatibility.

## Bug fixes
- Added guarded JSON parsing for corrupted localStorage values.
- Added date and email validation for key user flows.
- Escaped user-entered blog notes and calendar notes before rendering.

## New features
- Dashboard jurisdiction selector supports all 50 U.S. states through statewide federal/state/local fallback resources.
- Case setup, procedural fields, calendar events, email alert queue, blog drafts, and memorial names persist in localStorage.
- Filing-date rules generate procedural milestones and carry selected court links into calendar cards and procedural pages.

## Recommendations
- Replace prototype login with real authentication and server-side account storage before launch.
- Replace search-link fallbacks with verified official rule/form URLs state by state.
- Add automated browser tests once a package/tooling setup is introduced.
- Move email alerts to a backend scheduler and transactional email provider.
