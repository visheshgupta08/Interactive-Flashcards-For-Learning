// Flashcards database mapped by Deck ID
var deckCardsData = {
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
  ]
};

var currentDeckCards = [];
var currentIndex = 0;
var isFlipped = false;
var masteredCount = 0;

// Initialize on page load
window.onload = function() {
  loadActiveDeck();
};

// Find and load cards for active deck
function loadActiveDeck() {
  var savedDeckId = localStorage.getItem("activeDeckId");

  if (!savedDeckId || !deckCardsData[savedDeckId]) {
    savedDeckId = "1";
  }

  currentDeckCards = deckCardsData[savedDeckId];
  currentIndex = 0;
  masteredCount = 0;
  loadCard(currentIndex);
}

// Display card data on UI
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

// Flip card toggle
function flipCard() {
  var cardElement = document.getElementById("flashcardElement");
  cardElement.classList.toggle("is-flipped");
  isFlipped = !isFlipped;
}

// Next card
function nextCard() {
  if (currentIndex < currentDeckCards.length - 1) {
    currentIndex = currentIndex + 1;
    loadCard(currentIndex);
  } else {
    showSummary();
  }
}

// Previous card
function prevCard() {
  if (currentIndex > 0) {
    currentIndex = currentIndex - 1;
    loadCard(currentIndex);
  }
}

// Record recall difficulty
function recordRecall(level) {
  if (level === "easy") {
    masteredCount = masteredCount + 1;
  }
  nextCard();
}

// Session completion summary
function showSummary() {
  document.querySelector(".flashcard-scene").classList.add("hidden");
  document.querySelector(".difficulty-controls").classList.add("hidden");
  document.querySelector(".nav-controls").classList.add("hidden");

  var summaryModal = document.getElementById("summaryModal");
  summaryModal.classList.remove("hidden");

  document.getElementById("summaryScore").innerText = 
    "You completed all " + currentDeckCards.length + " cards! Mastered: " + masteredCount;
}

// Restart session
function restartSession() {
  currentIndex = 0;
  masteredCount = 0;

  document.querySelector(".flashcard-scene").classList.remove("hidden");
  document.querySelector(".difficulty-controls").classList.remove("hidden");
  document.querySelector(".nav-controls").classList.remove("hidden");
  document.getElementById("summaryModal").classList.add("hidden");

  loadCard(currentIndex);
}