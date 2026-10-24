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
- **Interactive 3D Flip Cards:** Smooth 3D flip card animations powered by CSS `transform`, `perspective`, and `backface-visibility`.
- **Keyboard-First Navigation:**
  - `Spacebar`: Instant flip front/back.
  - `Arrow Right`: Next flashcard.
  - `Arrow Left`: Previous flashcard.
- **Custom Flashcard Creation:** Add custom flashcard questions and answers dynamically with persistent storage and toast feedback.
- **Self-Evaluation & Mastery Tracker:** Record difficulty (`Easy` / `Hard`) to monitor session completion without duplicate mastered increments.
- **Responsive Layout:** Adaptive user interface for mobile, tablet, and desktop viewports.

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
├── dashboard.html        # Decks selection, stats, and search interface
├── study.html            # Interactive 3D flashcard study session
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
│   ├── dashboard.js      # Deck filters and user greeting
│   └── study.js          # Flashcard engine, keyboard logic & modal handlers
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