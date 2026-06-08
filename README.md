# Automated Ticket Purchasing Platform

This repository contains a working prototype for a Final Year Project focused on fairer access to high-demand ticket sales. The project demonstrates a monitored ticket-purchasing workflow for legitimate users, including preference setup, simulated purchase execution, transaction tracking, and an administrative dashboard.

## What is included

Two implementation paths are included:

- `demo/` — the recommended assessment build. This is a self-contained browser demo with no install step and no backend dependency.
- `app/`, `templates/`, `static/` — the original Flask-based prototype source code created during development.

## Recommended marker path

For assessment and demonstration, use the static browser demo in `demo/`.

It supports:

- user registration and login
- ticket preference management
- simulated end-to-end purchase session
- transaction history
- admin dashboard with session and alert visibility

## Quick start

1. Open `demo/index.html` in a web browser.
2. Register a user account.
3. Save ticket preferences.
4. Start a purchase session.
5. View the session progress and resulting transaction.
6. Open the admin view to inspect all recorded sessions and alerts.

## Submission support files

- `USER_GUIDE.md` — step-by-step marker instructions


## Notes

The browser demo is the most reliable build snapshot for marking because it runs locally without Python, package installation, or third-party ticketing dependencies. The Flask source is preserved as part of the development history and technical design, but the static build is the recommended artefact for the Assignment 3 demonstration.
