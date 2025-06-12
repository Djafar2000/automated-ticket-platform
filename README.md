# Automated Ticket Purchasing Platform

## Overview
An ethical ticket purchasing platform with admin dashboard, automated bots, and real-time transaction tracking. Targeted at high-demand event platforms like Ticketmaster.

## Features
The system architecture follows a three-tier structure: frontend interface, backend API, and bot automation layer, all interfaced through RESTful services.
•	Backend API: Built with Flask and SQL Alchemy, the backend manages user authentication, bot session tracking, transaction logging, and administrative operations. JWT (JSON Web Tokens) are used for secure, stateless user sessions.
•	Bot Automation Layer: Implemented using Selenium WebDriver, the bot simulates human interaction with ticketing platforms such as Ticketmaster. It performs event searching, ticket selection, and purchase attempts based on user-defined preferences.
•	Administrative Dashboard: A web interface that enables authorized administrators to monitor active bot sessions, inspect user transactions, and manually suspend or restart bot processes when anomalies are detected.
