# GCash Prototype --- Group 1

![Status](https://img.shields.io/badge/status-academic%20prototype-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![Subject](https://img.shields.io/badge/course-CC%20106-orange)

------------------------------------------------------------------------

## Overview

This project is a single-page GCash-like web application prototype
developed for CC 106.

It simulates core fintech application flows including authentication,
wallet management, transactions, savings, investment tracking, credit
features, and messaging. The system is entirely client-side and focuses
on UI behavior and functional interaction.

No backend integration is implemented.

------------------------------------------------------------------------

## Authors

-   Jerome E. David
-   Airon Gabrielle Urbano
-   Kyla Quite

------------------------------------------------------------------------

## Purpose

-   Demonstrate front-end development competencies using HTML, CSS, and
    JavaScript.
-   Simulate real-world fintech user flows.
-   Implement state persistence using browser storage.
-   Apply responsive design principles.
-   Translate wireframes into a functioning UI prototype.

------------------------------------------------------------------------

## Tech Stack

-   HTML5
-   Tailwind CSS
-   Custom CSS
-   Vanilla JavaScript
-   localStorage (Client-Side Persistence)

------------------------------------------------------------------------

## Features

### Authentication

-   Login with 11-digit phone number
-   4-digit MPIN verification
-   Persistent authentication state

### Wallet System

-   Real-time balance updates
-   Quick action buttons:
    -   Send
    -   Load
    -   Transfer
    -   Cash In
    -   GSave
    -   Invest

### Transactions

-   Send Money
-   Buy Load
-   Pay Bills
-   Bank Transfers
-   Cash-In via simulated barcode

### GSave

-   Deposit funds
-   Withdraw funds
-   Synchronized wallet updates

### Invest

-   Buy/Sell simulation
-   Persistent investment balance

### GCredit

-   Borrow dashboard
-   Bill payment via credit

### Inbox

-   Auto-generated transaction receipts
-   Mark-as-read functionality
-   Delete messages

------------------------------------------------------------------------

## Application Architecture

-   Single-Page Application (SPA)
-   Dynamic DOM manipulation
-   Modal-based transaction flows
-   Client-side state container
-   Defensive programming for state migration handling

------------------------------------------------------------------------

## State Management & Persistence

Application state is stored in `localStorage`.

### gcash_state

Contains: - balance - saveBalance - investBalance - inbox -
transactions - userProfile

### Additional Keys

-   gcash_authed
-   gcash_mpin

### Resetting the Application

Clear the following keys in browser storage: - gcash_state -
gcash_authed - gcash_mpin

------------------------------------------------------------------------

## Project Structure

gcash/ ├── index.html ├── style.css ├── script.js ├── README.md └──
assets/ ├── barcode.svg └── img/ └── GCash_logo.svg

------------------------------------------------------------------------

## Installation & Usage

### Option 1 --- Direct Execution

Open: index.html

### Option 2 --- Local Server (Recommended)

From project directory:

python -m http.server 5500

Then open: http://localhost:5500/index.html

------------------------------------------------------------------------

## Testing Checklist

-   Login using 09XXXXXXXXX format
-   Enter 4-digit MPIN
-   Perform Send, Load, Cash In, Transfer
-   Confirm wallet balance updates
-   Verify Inbox receipt generation
-   Edit profile details
-   Change MPIN
-   Test on mobile and desktop screen sizes

------------------------------------------------------------------------

## Known Issues

-   Some browsers may temporarily flag the project when hosted via
    GitHub Pages.
-   Console warnings may appear during rapid state transitions.
-   Older saved states may require migration handling if structure
    changes.

------------------------------------------------------------------------

## License

This project is developed for academic purposes under CC 106. Not
affiliated with or endorsed by GCash.
