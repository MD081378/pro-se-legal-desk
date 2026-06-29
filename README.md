# Pro Se Legal Desk

A static public website and procedural workspace prototype for Pro Se Legal Desk, a project that helps self-represented litigants understand civil court procedure, court resources, deadlines, and educational checklists.

## Structure

- `index.html` - public homepage for GitHub Pages
- `index-basic.html` - public homepage backup copy
- `app.html` - interactive procedural workspace prototype
- `pages/` - public About, Contact, Accessibility, Terms, Privacy, and Submit pages
- `css/public.css` - public website styling
- `css/styles.css` - app workspace styling
- `js/site.js` - shared public header, footer, forms, and cookie notice
- `js/app.js` - app UI controller, persistence, validation, and rendering
- `js/business-rules.js` - reusable procedural reminder rules
- `data/states.js` - 50-state court-system metadata
- `data/jurisdictions.js` - detailed jurisdiction seed data plus fallback support
- `assets/` - logos, icons, and public image assets
- `data/spreadsheets/` - starter CSV records for newsletter, contact, and blog submissions
- `uploads/blog-submissions/` - reserved folder for submitted blog/story upload storage
- `docs/PR_SUMMARY.md` - PR-ready summary for `feature/project-setup`

## Run locally

To preview the public site locally, serve it from the project folder:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

The interactive workspace prototype is available at `http://localhost:8000/app.html`.

## Legal disclaimer

This application provides procedural education and organization only. It does not provide legal advice, calculate legally binding deadlines, or create an attorney-client relationship.
