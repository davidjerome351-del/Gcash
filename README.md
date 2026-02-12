# GCash Group 1
**Authors:** Jerome David, Airon Gabrielle Urbano, Kyla Quite

**Current status:**
\Coffee taken: 16
\hours spent: 29
\bugs: hahaha aray
\buhay pa: N/A

**current progess** in the way:
>implementing better responsiveness for mobile
>fixing dom-manipulation error that occasionally shows in console().
>website being flagged as dangerous by other browsers
>documentation pictures and updates that are required for the completion, turnover, of the project.

**use of ai:** for finding explanation and debugging of errors. used tools: gpt5 and claude 

**Contributions**
- Jerome David: implemented all application code and JavaScript logic for the prototype.
- Kyla Quite: implemented the design concept and visual assets; supported wireframe creation.
- Airon Gabrielle Urbano: implemented the design concept and assisted with wireframe and process coordination.

**Challenges & Positive Gains**

- Challenges (Individual):
  - Jerome David: balancing feature scope vs. time — implementing many interactive flows (transactions, inbox, modal flows) required prioritization and iterative debugging; dealing with persisted state shape changes (backwards-compatibility) caused runtime issues that needed defensive coding.
  - Kyla Quite: translating visual concepts into responsive layout constraints and keeping consistent spacing/typography across screens required repeated refinements.
  - Airon Gabrielle Urbano: coordinating design iterations with the implemented UI surface and ensuring the wireframes matched functional behavior was time-consuming and required compromises.

- Challenges (Group):
  - Aligning priorities (which flows to build first) and merging design changes into a single-file prototype led to occasional conflicts and regressions.
  - Testing across browsers and handling persisted state migrations (older saved states lacking new fields) required extra coordination.

- Positive Gains (Individual):
  - Jerome David: strengthened practical JavaScript skills (state management, DOM manipulation, defensive programming) and learned to iterate features quickly while maintaining persistence.
  - Kyla Quite: improved UX/design fluency by adapting wireframes to real constraints and gaining experience with responsive patterns.
  - Airon Gabrielle Urbano: gained experience coordinating design and development, improving communication and documentation practices.

- Positive Gains (Group):
  - Improved collaboration: we practiced dividing responsibilities (code vs. design), reviewing changes, and synchronizing tasks to deliver a functioning prototype.
  - Real-world problem solving: handling persisted state, user flows, and error recovery gave us a practical workflow for prototyping fintech interfaces under time constraints.


**Subject** CC 106

**Purpose**
- Simple, single-page prototype of a GCash-like UI for functional demonstration of wireframe and user flows.
- Built as a client-side HTML/CSS/JS mock to exercise authentication, payments, wallet features, and messaging (inbox).

**How to run**
- Open `index.html` in your browser. No build step required.
- For a local HTTP server (recommended e.g. Live Server or Python), run:

```bash
# Python 3 (from project folder)
python -m http.server 5500
# then open http://localhost:5500/index.html
```

**Main features**
- Login with phone + 4-digit MPIN (persisted authentication).
- Wallet: shows available balance and quick actions (Send, Load, Transfer, Cash In, GSave, Invest).
- Send money, Buy load, Pay bills, Bank transfers, Cash In via partner barcode (simulated).
- GSave: deposit/withdraw flows moving funds between wallet and savings balance.
- Invest: simple buy/sell flow that updates `investBalance` and persists state.
- GCredit: borrow dashboard and pay-bills-with-credit option.
- Inbox: transaction receipts generated for performed transactions; mark-as-read and remove messages.
- QR Scanner overlay and Services Hub modal for Explore icons.
- Skeleton loader and input formatting (amount commas, phone normalization).

**Interactivity and Responsiveness**

The website is built as a highly interactive single-page application with responsive design that adapts to different screen sizes.

**Interactivity Features:**
- **Authentication Flow**: Secure login with phone number and 4-digit MPIN, with persisted authentication state.
- **Tab Navigation**: Smooth switching between Home, Inbox, Activity, and Profile sections.
- **Wallet Management**: Interactive tabs for Wallet, Save, Borrow, and Invest with dynamic balance updates.
- **Transaction Flows**: Modal-based flows for sending money, buying load, paying bills, bank transfers, and cash-in operations.
- **GSave Operations**: Deposit and withdraw functionality with real-time balance updates.
- **Invest Features**: Buy/sell interface with portfolio tracking.
- **GCredit Integration**: Borrowing dashboard with credit limit management and bill payment options.
- **Inbox Management**: Transaction receipts with mark-as-read and delete functionality.
- **Profile Editing**: Update user information and change MPIN.
- **QR Scanner**: Overlay for scanning QR codes.
- **Services Hub**: Modal for exploring additional services.
- **Balance Visibility**: Toggle to show/hide balance amounts.
- **Transaction Filtering**: Search and filter transaction history by type.
- **Input Formatting**: Automatic formatting for phone numbers and amounts.

**Responsiveness:**
- **Mobile-First Design**: Optimized for mobile devices with touch-friendly interfaces.
- **Adaptive Layouts**: Desktop sidebar navigation for large screens, bottom tab bar for mobile.
- **Responsive Grids**: Flexible grid systems that adjust to screen size.
- **Fluid Typography**: Scalable text sizes using Tailwind's responsive utilities.
- **Touch Interactions**: Active scale animations and hover effects for interactive elements.
- **Cross-Device Compatibility**: Works seamlessly across phones, tablets, and desktops.

The application uses Tailwind CSS for responsive utilities and custom CSS for animations and transitions, ensuring a smooth user experience across all devices.

**Files**
- `index.html` — main HTML markup and references to CSS/JS.
- `style.css` — extracted CSS for layout and components.
- `script.js` — application logic, state management, and UI flows.

**Project Structure**
```
gcash/
├── index.html              # Main HTML file for the single-page application
├── style.css               # Stylesheet for the UI layout and components
├── script.js               # JavaScript file containing application logic, state management, and UI interactions
├── README.md               # Project documentation and instructions
└── assets/
    ├── barcode.svg         # Barcode image used for cash-in functionality
    └── img/
        └── GCash_logo.svg  # GCash logo image
```

**State & persistence**
- App state is stored in `localStorage` under the key `gcash_state` and includes:
  - `balance` — main wallet balance
  - `saveBalance` — GSave balance
  - `investBalance` — Invest portfolio balance
  - `inbox` — array of messages/receipts
  - `transactions` — transaction history
  - `userProfile` — name and phone
- Auth flag stored as `gcash_authed` (string `'true'` when logged in).
- MPIN (if changed) stored in localStorage as `gcash_mpin`.

**Notes for grading (CC 106)**
- The prototype focuses on UI flows rather than backend integration; all data is client-side and persisted in the browser.
- Transaction receipts are generated programmatically and appear in Inbox.
- To reset the app state, clear `localStorage` for keys `gcash_state`, `gcash_authed`, and `gcash_mpin`.

**Testing checklist**
- Log in with an 11-digit phone (09XXXXXXXXX) and enter 4-digit MPIN.
- Perform Send, Load, Cash In, Bank Transfer, and GSave/Invest operations and confirm balances update.
- Check Inbox for generated receipts and mark messages as read.
- Edit profile (name/phone) and change MPIN via Profile → Security.

**Contact**
- Authors: Jerome David, Airon Gabrielle Urbano, Kyla Quite
- For questions or issues, open the `index.html` and check the browser console for errors; paste errors to the project maintainers.

---
prepared for submission to CC 106. 
