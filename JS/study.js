// 1. Auth Protection: Agar login nahi hai toh Login page bhej do
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "auth.html";
}

// Analytics Tracker: Review counts aur daily streak localStorage mein update karna
function trackCardReview() {
  // 1. Cards Reviewed count increment
  var count = parseInt(localStorage.getItem("cardsReviewed") || "0", 10);
  localStorage.setItem("cardsReviewed", (count + 1).toString());

  // 2. Study Streak update (Date-based tracking)
  var today = new Date().toISOString().split("T")[0];
  var lastDate = localStorage.getItem("lastStudyDate");

  if (lastDate !== today) {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayStr = yesterday.toISOString().split("T")[0];

    var currentStreak = parseInt(localStorage.getItem("studyStreak") || "0", 10);

    if (lastDate === yesterdayStr) {
      currentStreak += 1;
    } else {
      currentStreak = 1; // Streak fresh start
    }

    localStorage.setItem("studyStreak", currentStreak.toString());
    localStorage.setItem("lastStudyDate", today);
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

  // 2. Study page par Deck ka Title dikhana
  var savedTitle = localStorage.getItem("activeDeckTitle") || "Flashcard Session";
  var headingElement = document.getElementById("currentDeckHeading");
  if (headingElement) {
    headingElement.innerText = "Studying: " + savedTitle;
  }

  // Check if custom deck cards exist in localStorage
  var storedCustomDecks = localStorage.getItem("customFlashcards");
  var allDecks = defaultCards;

  if (storedCustomDecks) {
    allDecks = JSON.parse(storedCustomDecks);
  } else {
    localStorage.setItem("customFlashcards", JSON.stringify(defaultCards));
  }

  currentDeckCards = allDecks[currentDeckId] || defaultCards[1];
  currentIndex = 0;
  masteredCount = 0;
  loadCard(currentIndex);
}

// Display Card on UI
function loadCard(index) {
  var cardElement = document.getElementById("flashcardElement");
  cardElement.classList.remove("is-flipped");
  isFlipped = false;

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

  // Har baar jab card reveal hota hai tab review track karo
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

// Har card ka recall status track krna
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
  if (!isFlipped) {
    trackCardReview();
  }

  nextCard();
}

// 3. Keyboard Shortcuts (Spacebar se flip, Arrow keys se Next/Prev)
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
}

// Restart Session
function restartSession() {
  currentIndex = 0;
  masteredCount = 0;
  cardProgress = {}; // Reset Tracking
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

// 4. Toast Notification popup
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

  // 5. Success Popup message trigger
  showToast("Flashcard added successfully!");
}