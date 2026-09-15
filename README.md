ICT461 Course Registration Interface

A one-page, static registration form for ICT461 — Web Systems and Technology. Built with plain HTML, CSS, and JavaScript (no frameworks, no build step).

Files
index.html — semantic page structure (header, main, form with fieldsets, footer)
styles.css — responsive, mobile-first styling with visible keyboard focus states
script.js — the page's one JavaScript interaction (a live fee/seat summary) plus accessible form validation
Design

Cream page background with sage-green and terracotta accents, soft shadows, and rounded cards. The header and summary panel carry a quiet, network-themed decoration built entirely from CSS (radial gradients and layered box-shadows standing in for connected nodes) rather than a stock photo or clip art, to keep the visuals tied to the subject without adding external assets.

Features
Semantic HTML: <header>, <main>, <footer>, <fieldset>/<legend> groupings, and a <label> tied to every form control via for/id.
Responsive layout: fluid single-column layout that reflows for narrow viewports; no horizontal scrolling down to ~320px.
One JS interaction: selecting a lab session or an optional add-on updates a live "Registration summary" panel (session, fees, total) with no page reload.
Validation: required fields, a student-ID pattern check, and an email format check are validated on submit. Each invalid field gets an inline, screen-reader-announced message (role="alert"), and focus moves to the first problem field.
Keyboard friendly: every control is a native input/select/textarea/radio/checkbox, so Tab, Space, and arrow keys work without extra script; a visible focus ring is styled for all interactive elements.
Reduced motion respected: hover lifts and transitions are disabled under prefers-reduced-motion: reduce.
Running it

No build step required. Clone the repo and open index.html in a browser, or serve the folder locally:

bash
python3 -m http.server 8000

Then visit http://localhost:8000.

Notes

This is a front-end demo only — the submit handler shows a success message in the UI but does not send data anywhere; no email is actually sent. Seat counts and fees are hardcoded sample data for ICT461.
