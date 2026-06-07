# User Guide

## What the software does

This prototype demonstrates a monitored ticket-purchasing platform for legitimate users. It allows a user to register, save event preferences, run a simulated ticket-purchase flow, and review the result, while an administrator can monitor sessions, transactions, and alerts.

## Core features implemented

- User registration and login
- Ticket preference configuration
- Simulated end-to-end purchase session
- Real-time status progression during a purchase attempt
- Transaction history
- Admin dashboard with active sessions, alerts, and recent transactions

## Recommended version to run

Use the browser demo in the `demo/` folder.

## Setup and run instructions

### Option A: simplest path

1. Open the folder `demo/`.
2. Double-click `index.html`, or right-click it and open it in a browser.
3. The application runs entirely in the browser and stores demo data in local storage.

### Option B: optional local web server

If your browser blocks local file access in your environment, serve the folder with a simple static server and open `index.html`.

## How to use the system

### End user flow

1. On the login page, choose **Create account**.
2. Register with any username and password.
3. Log in with the new account.
4. On the dashboard, complete the preference form:
   - event name
   - seat type
   - quantity
   - budget cap
5. Click **Save Preferences**.
6. Click **Start Purchase Session**.
7. Watch the status timeline update through the workflow.
8. When the session finishes, review the transaction result.

### Admin flow

1. From the top navigation, open the **Admin** view.
2. Review:
   - active or completed sessions
   - alerts
   - recent transaction log
3. Use this to demonstrate administrative monitoring and oversight.

## Test credentials or sample inputs

You can create any demo account.

Suggested demo input:

- Username: `djafar`
- Password: `demo123`
- Event: `Champions League Final`
- Seat type: `Standard`
- Quantity: `2`
- Budget cap: `180`

## Known limitations

- The purchase flow is simulated rather than connected to a live ticketing platform.
- No real payment, queue integration, or CAPTCHA solving is implemented.
- Data is stored in browser local storage for demo purposes only.
- The original Flask codebase is preserved in the repository, but the browser demo is the recommended markable snapshot because it runs reliably without external setup.

## What the marker should assess

The most meaningful end-to-end feature is:

**register/login -> save preferences -> start purchase session -> see status updates -> receive a transaction result -> inspect session in admin view**
