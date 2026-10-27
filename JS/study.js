// 1. Auth Protection: Agar login nahi hai toh Login page bhej do
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "auth.html";
}

// Session mein kaunse cards padhe ja chuke hain unko track karne ke liye
var reviewedCardIndices = [];

// Helper function: Local Indian Timezone (YYYY-MM-DD) date string
function getLocalDateString(d) {
  var date = d || new Date();
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Analytics Tracker: User-specific review counts aur streak localStorage mein update karna
function trackCardReview() {
  // 1. Check karo ki yeh card is session mein pehle review hua ya nahi
  if (reviewedCardIndices.indexOf(currentIndex) !== -1) {
    return; // Already counted, dobara count mat badhao
  }
  reviewedCardIndices.push(currentIndex);

  // 2. Active logged-in user nikalo
  var activeUser = JSON.parse(localStorage.getItem("userAccount") || "{}");
  var userKey = activeUser.email ? "_" + activeUser.email : "";

  // 3. User-specific cards reviewed count update
  var countKey = "cardsReviewed" + userKey;
  var count = parseInt(localStorage.getItem(countKey) || "0", 10);
  localStorage.setItem(countKey, (count + 1).toString());

  // Deck progress update (In Progress)
  var progressKey = "progress_" + currentDeckId + userKey;
  if (localStorage.getItem(progressKey) !== "Completed") {
    localStorage.setItem(progressKey, "In Progress");
  }

  // 4. User-specific daily streak update (Date-based tracking)
  var today = getLocalDateString();
  var lastDateKey = "lastStudyDate" + userKey;
  var streakKey = "studyStreak" + userKey;
  var lastDate = localStorage.getItem(lastDateKey);

  if (lastDate !== today) {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayStr = getLocalDateString(yesterday);

    var currentStreak = parseInt(localStorage.getItem(streakKey) || "0", 10);

    if (lastDate === yesterdayStr) {
      currentStreak += 1;
    } else {
      currentStreak = 1; // Streak fresh start
    }

    localStorage.setItem(streakKey, currentStreak.toString());
    localStorage.setItem(lastDateKey, today);
  }
}

// Default seed flashcards mapped by Deck ID (Ab poore 6 Decks)
var defaultCards = {
  1: [
    { question: "What does HTML stand for?", answer: "HyperText Markup Language" },
    { question: "Which tag is used for the largest heading?", answer: "<h1>" },
    { question: "Which tag creates an unordered list?", answer: "<ul>" },
    { question: "What attribute is used to provide image alternate text?", answer: "alt attribute" },
    { question: "Which tag is used to create a hyperlink?", answer: "<a> (Anchor tag)" }
  ],
  2: [
    { question: "What are the components of the CSS Box Model?", answer: "Content, Padding, Border, and Margin" },
    { question: "Which CSS display property enables Flexbox?", answer: "display: flex;" },
    { question: "Which property aligns flex items along the main axis?", answer: "justify-content" },
    { question: "Which property creates space inside the element border?", answer: "padding" }
  ],
  3: [
    { question: "Which keyword declares a variable in JavaScript?", answer: "var, let, or const" },
    { question: "Which symbol is used for single line comments in JS?", answer: "//" },
    { question: "What will 5 + '5' evaluate to in JavaScript?", answer: "'55' (String concatenation)" },
    { question: "Which loop runs at least once before checking condition?", answer: "do...while loop" }
  ],
  4: [
    { question: "What does HTTP stand for?", answer: "HyperText Transfer Protocol" },
    { question: "What is the standard port for HTTPS?", answer: "Port 443" },
    { question: "What is the role of DNS in networking?", answer: "Translates domain names to IP addresses" },
    { question: "What does IP stand for?", answer: "Internet Protocol" }
  ],
  5: [
    { question: "Which data structure works on LIFO principle?", answer: "Stack (Last In First Out)" },
    { question: "Which data structure works on FIFO principle?", answer: "Queue (First In First Out)" },
    { question: "What is the time complexity of array index access?", answer: "O(1) - Constant Time" },
    { question: "In which list does each node point to next and previous?", answer: "Doubly Linked List" }
  ],
  6: [
    { question: "What does SQL stand for?", answer: "Structured Query Language" },
    { question: "Which command retrieves data from a database?", answer: "SELECT statement" },
    { question: "What uniquely identifies each record in a table?", answer: "Primary Key" },
    { question: "Which clause is used to filter records in SQL?", answer: "WHERE clause" }
  ]
};

var currentDeckCards = [];
var currentDeckId = "1";
var currentIndex = 0;
var isFlipped = false;
var masteredCount = 0;

window.onload = function() {
  loadActiveDeck();
  setupKeyboardNavigation(); // Keyboard controls ON

  // Navbar Login/Logout toggle logic
  var navAuth = document.getElementById("navAuthLink");
  if (navAuth && localStorage.getItem("isLoggedIn") === "true") {
    navAuth.innerText = "Logout";
    navAuth.href = "#";
    navAuth.onclick = function() {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userAccount");
      window.location.href = "auth.html";
    };
  }
};

// Load cards from LocalStorage or Fallback to Default Seeds
function loadActiveDeck() {
  var savedDeckId = localStorage.getItem("activeDeckId");
  if (savedDeckId) {
    currentDeckId = savedDeckId;
  }

  // Title ID se dhoondho (Apostrophe ya direct click issue solve)
  var defaultTitles = {
    "1": "HTML Fundamentals",
    "2": "CSS Box Model & Flexbox",
    "3": "JavaScript Core Concepts",
    "4": "Computer Networking Basics",
    "5": "Data Structures Basics",
    "6": "SQL & Database Essentials"
  };

  var userDecks = JSON.parse(localStorage.getItem("userDecksList") || "[]");
  var userDeck = userDecks.find(function(d) { return d.id === currentDeckId; });

  var resolvedTitle = defaultTitles[currentDeckId] || (userDeck ? userDeck.title : "Flashcard Session");

  var headingElement = document.getElementById("currentDeckHeading");
  if (headingElement) {
    headingElement.innerText = "Studying: " + resolvedTitle;
  }

  // Check if custom deck cards exist in localStorage
  var storedCustomDecks = localStorage.getItem("customFlashcards");
  var allDecks = defaultCards;

  if (storedCustomDecks) {
    allDecks = JSON.parse(storedCustomDecks);
  } else {
    localStorage.setItem("customFlashcards", JSON.stringify(defaultCards));
  }

  currentDeckCards = allDecks[currentDeckId] || defaultCards[currentDeckId] || [];
  currentIndex = 0;
  masteredCount = 0;
  reviewedCardIndices = []; // Naye deck ya session ke liye reset
  loadCard(currentIndex);
}

// Display Card on UI
function loadCard(index) {
  var cardElement = document.getElementById("flashcardElement");
  cardElement.classList.remove("is-flipped");
  isFlipped = false;
  // Empty deck guard
    if (!currentDeckCards || currentDeckCards.length === 0) {
      document.getElementById("cardQuestion").innerText = "Is deck mein abhi koi card nahi hai.";
      document.getElementById("cardAnswer").innerText = "Neeche '+ Add Card' daba kar naya card jodiye.";
      document.getElementById("cardIndicator").innerText = "Card 0 of 0";
      return;
    }

  var currentCard = currentDeckCards[index];
  document.getElementById("cardQuestion").innerText = currentCard.question;
  document.getElementById("cardAnswer").innerText = currentCard.answer;

  var currentDisplay = index + 1;
  var totalDisplay = currentDeckCards.length;
  document.getElementById("cardIndicator").innerText = "Card " + currentDisplay + " of " + totalDisplay;

  var progressPercent = (currentDisplay / totalDisplay) * 100;
  document.getElementById("progressBarFill").style.width = progressPercent + "%";

  var prevBtn = document.getElementById("prevBtn");
  if (index === 0) {
    prevBtn.disabled = true;
    prevBtn.style.opacity = "0.5";
  } else {
    prevBtn.disabled = false;
    prevBtn.style.opacity = "1";
  }
}

// Flip Card Action
function flipCard() {
  var cardElement = document.getElementById("flashcardElement");
  cardElement.classList.toggle("is-flipped");
  isFlipped = !isFlipped;

  // Jab card reveal hota hai tab uniquely review track karo
  if (isFlipped) {
    trackCardReview();
  }
}

// Next Card smoothly handle flipping
function nextCard() {
  if (currentIndex < currentDeckCards.length - 1) {
    var cardElement = document.getElementById("flashcardElement");

    if (isFlipped) {
      cardElement.classList.remove("is-flipped");
      isFlipped = false;
      setTimeout(function() {
        currentIndex = currentIndex + 1;
        loadCard(currentIndex);
      }, 300);
    } else {
      currentIndex = currentIndex + 1;
      loadCard(currentIndex);
    }
  } else {
    showSummary();
  }
}

// Previous Card smoothly handle flipping
function prevCard() {
  if (currentIndex > 0) {
    var cardElement = document.getElementById("flashcardElement");

    if (isFlipped) {
      cardElement.classList.remove("is-flipped");
      isFlipped = false;
      setTimeout(function() {
        currentIndex = currentIndex - 1;
        loadCard(currentIndex);
      }, 300);
    } else {
      currentIndex = currentIndex - 1;
      loadCard(currentIndex);
    }
  }
}

// Har card ka recall status track karna
var cardProgress = {};

function recordRecall(level) {
  cardProgress[currentIndex] = level;

  // Har card index par sirf ek baar mastered count hoga
  masteredCount = 0;
  for (var key in cardProgress) {
    if (cardProgress[key] === "easy") {
      masteredCount++;
    }
  }

  // Answer submit hone par bhi count track karo agar flip nahi kiya ho
  trackCardReview();

  nextCard();
}

// Keyboard Shortcuts (Spacebar se flip, Arrow keys se Next/Prev)
function setupKeyboardNavigation() {
  document.addEventListener("keydown", function(e) {
    var modal = document.getElementById("addCardModal");
    if (modal && !modal.classList.contains("hidden")) return;

    if (e.code === "Space") {
      e.preventDefault();
      flipCard();
    } else if (e.code === "ArrowRight") {
      nextCard();
    } else if (e.code === "ArrowLeft") {
      prevCard();
    }
  });
}

// Summary Modal
function showSummary() {
  document.querySelector(".flashcard-scene").classList.add("hidden");
  document.querySelector(".difficulty-controls").classList.add("hidden");
  document.querySelector(".nav-controls").classList.add("hidden");

  var summaryModal = document.getElementById("summaryModal");
  summaryModal.classList.remove("hidden");

  document.getElementById("summaryScore").innerText = 
    "You completed all " + currentDeckCards.length + " cards! Mastered: " + masteredCount;

  var activeUser = JSON.parse(localStorage.getItem("userAccount") || "{}");
  var userKey = activeUser.email ? "_" + activeUser.email : "";
  localStorage.setItem("progress_" + currentDeckId + userKey, "Completed");
}

// Restart Session
function restartSession() {
  currentIndex = 0;
  masteredCount = 0;
  cardProgress = {}; // Reset tracking
  reviewedCardIndices = []; // Reset reviewed cards tracking
  document.querySelector(".flashcard-scene").classList.remove("hidden");
  document.querySelector(".difficulty-controls").classList.remove("hidden");
  document.querySelector(".nav-controls").classList.remove("hidden");
  document.getElementById("summaryModal").classList.add("hidden");

  loadCard(currentIndex);
}

// Modal Controls
function openAddCardModal() {
  document.getElementById("addCardModal").classList.remove("hidden");
}

function closeAddCardModal() {
  document.getElementById("addCardModal").classList.add("hidden");
  document.getElementById("newQuestion").value = "";
  document.getElementById("newAnswer").value = "";
}

// Toast Notification popup
function showToast(message) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = message;
  toast.classList.remove("hidden");
  setTimeout(function() {
    toast.classList.add("hidden");
  }, 2200);
}

// Add New Card and Persist in LocalStorage
function handleAddNewCard(event) {
  event.preventDefault();

  var questionInput = document.getElementById("newQuestion").value.trim();
  var answerInput = document.getElementById("newAnswer").value.trim();

  if (!questionInput || !answerInput) return;

  var newCard = { question: questionInput, answer: answerInput };

  var storedCustomDecks = JSON.parse(localStorage.getItem("customFlashcards")) || defaultCards;

  if (!storedCustomDecks[currentDeckId]) {
    storedCustomDecks[currentDeckId] = [];
  }

  storedCustomDecks[currentDeckId].push(newCard);
  localStorage.setItem("customFlashcards", JSON.stringify(storedCustomDecks));

  currentDeckCards = storedCustomDecks[currentDeckId];

  closeAddCardModal();
  loadCard(currentDeckCards.length - 1);
  currentIndex = currentDeckCards.length - 1;

  showToast("Flashcard added successfully!");
}