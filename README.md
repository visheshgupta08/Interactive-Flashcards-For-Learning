# ⚡ FlashLearn - Interactive Flashcards Web Application

An interactive, responsive client-side web application designed to enhance learning and active recall through flashcards. Built using pure vanilla web technologies with client-side persistence.

---

## 🌐 Live Demo
- **Live Deployment:** https://visheshgupta08.github.io/Interactive-Flashcards-For-Learning/
- **Repository:** https://github.com/visheshgupta08/Interactive-Flashcards-For-Learning

---

## 👥 Team Information (WebNova)
- **Course Code:** CSE326 - Internet Programming
- **Section:** K3P26EM
- **Team Members:**
  1. **Vishesh Gupta** - 12607787
  2. **Vibhor Gupta** - 12607790
  3. **Tanmay Thakur** - 12607393

---

## 🚀 Key Features

- **Dynamic Greeting & User Onboarding:** Personalizes the dashboard using `localStorage` user profile sessions.
- **6 Domain-Specific Decks:** Covers core topics including HTML, CSS Box Model, JavaScript, Networking Basics, Data Structures, and SQL.
- **Deck Management (Create,View,Delete,Add Cards):** Create new custom decks via modal and delete them anytime with dynamic UI updates.
- **Deck-Wise Persistent Progress:** Live status badges on each deck card (`Not Started`, `In Progress`, `Completed`) saved across reloads.
- **Study Streak Tracker:** Calculates continuous daily study streak based on local calendar dates.
- **User Profile Page:** Dedicated profile view displaying account information, study statistics, and in-place name editing.
- **Interactive 3D Flip Cards:** Smooth 3D flip card animations powered by CSS `transform`, `perspective`, and `backface-visibility`.
- **Keyboard-First Navigation:**
  - `Spacebar`: Instant flip front/back.
  - `Arrow Right`: Next flashcard.
  - `Arrow Left`: Previous flashcard.
- **Custom Flashcard Creation:** Add custom flashcard questions and answers dynamically with persistent storage, character limits (`maxlength`), and toast feedback.
- **Self-Evaluation & Mastery Tracker:** Record difficulty (`Easy` / `Hard`) to monitor session completion without duplicate mastered increments.
- **Responsive Layout:** Adaptive user interface for mobile, tablet, and desktop viewports.

---

## 🔑 Account Roles & Admin Setup

The application uses client-side role management:
- **Admin Provisioning:** The first user who signs up on a fresh browser instance is automatically assigned the `admin` role.
- **Regular User:** All subsequent registrations are assigned the `user` role.

> **Testing Tip:** To register a fresh admin account, clear site data via DevTools (`localStorage.clear()`) and sign up on the registration page.

---

## 💾 LocalStorage Data Structure

All application data is managed locally using the browser's `localStorage` API:

| Storage Key | Type | Description |
| :--- | :--- | :--- |
| `usersList` | `Array<Object>` | Stores all registered accounts (`name`, `email`, `password`, `role`). |
| `userAccount` | `Object` | Stores current active session data (`name`, `email`, `role`) without sensitive fields. |
| `isLoggedIn` | `String` | Auth state flag (`"true"` / `"false"`). |
| `userDecksList` | `Array<Object>` | Stores user-created custom decks (`id`, `title`, `category`, `desc`, `cardCount`). |
| `customFlashcards` | `Object` | Key-value store mapping `deckId` to an array of added card objects. |
| `cardsReviewed_<email>` | `Number` | Total cards reviewed by the specific user. |
| `studyStreak_<email>` | `Number` | Current daily streak count for the specific user. |
| `lastStudyDate_<email>` | `String` | Last active study date in `YYYY-MM-DD` format. |
| `progress_<deckId>_<email>` | `String` | Tracks completion status (`"Not Started"`, `"In Progress"`, `"Completed"`). |

---

## ⚠️ Project Limitations

Since this is a client-side project built strictly within the scope of the CSE326 front-end syllabus (HTML, CSS, JavaScript, LocalStorage) without a back-end server:

1. **Client-Side Passwords:** Passwords in `usersList` are stored on the browser locally without backend hashing algorithms like bcrypt. However, passwords are never stored inside the active session (`userAccount`).
2. **Device Isolation:** Data is tied to the specific browser and device being used; there is no cross-device sync.
3. **Browser Cache Dependency:** Clearing browser cache or site data will reset custom decks and progression metrics back to default.

---

## 🛠️ Tech Stack

- **Markup:** HTML5 (Semantic Structure)
- **Styling:** CSS3 (Flexbox, 3D Transforms, Responsive Design)
- **Scripting:** Vanilla JavaScript (ES6, DOM Manipulation, Event Listeners)
- **Storage:** Web Storage API (`localStorage`)

---

## 📂 Project Directory Structure

```text
Interactive-Flashcards/
│
├── index.html            # Landing / Marketing Page
├── dashboard.html        # Decks selection, stats, search, and deck creation modal
├── study.html            # Interactive 3D flashcard study session and card modal
├── profile.html          # User profile and stats management
├── auth.html             # Login and Registration interface
│
├── CSS/                  # Stylesheets
│   ├── style.css         # Global design system and layout
│   ├── flashcard.css     # 3D flip cards, progress bars, and toasts
│   └── responsive.css    # Media queries for mobile & tablet screens
│
├── JS/                   # Client-side scripts
│   ├── app.js           # Landing page navigation and global auth status toggle
│   ├── auth.js           # Registration & session validation
│   ├── dashboard.js      # Deck filters, custom deck management & stats
│   ├── study.js          # Flashcard engine, keyboard logic & modal handlers
│   └── profile.js        # Profile metrics and name updating
│
└── README.md             # Project documentation and submission details
```
---

## 💻 How to Run Locally

1. **Clone the repository:**
    ```bash
    git clone https://github.com/visheshgupta08/Interactive-Flashcards-For-Learning.git
    ```
2. **Navigate to the project folder:**
    ```bash
    cd Interactive-Flashcards-For-Learning
    ```
3. **Run the Project:**
    
    Open index.html in your browser.

    Alternatively, use the VS Code Live Server extension for local testing.