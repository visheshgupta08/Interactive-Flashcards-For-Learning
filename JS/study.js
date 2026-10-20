// Sample flashcards array
var sampleCards = [
  {
    question: "What does HTML stand for?",
    answer: "HyperText Markup Language"
  },
  {
    question: "Which tag is used to create a hyperlink in HTML?",
    answer: "<a> (Anchor tag)"
  },
  {
    question: "What is the correct CSS syntax to change text color?",
    answer: "color: blue;"
  },
  {
    question: "What does DOM stand for in JavaScript?",
    answer: "Document Object Model"
  },
  {
    question: "Which property controls space inside an element's border?",
    answer: "padding"
  }
];

var currentIndex = 0;
var isFlipped = false;
var masteredCount = 0;

// Initialize on page load
window.onload = function() {
  loadCard(currentIndex);
};

// Load card data
function loadCard(index) {
  var cardElement = document.getElementById("flashcardElement");
  cardElement.classList.remove("is-flipped");
  isFlipped = false;

  var currentCard = sampleCards[index];
  document.getElementById("cardQuestion").innerText = currentCard.question;
  document.getElementById("cardAnswer").innerText = currentCard.answer;

  // Update progress text & bar
  var currentDisplay = index + 1;
  var totalDisplay = sampleCards.length;
  document.getElementById("cardIndicator").innerText = "Card " + currentDisplay + " of " + totalDisplay;

  var progressPercent = (currentDisplay / totalDisplay) * 100;
  document.getElementById("progressBarFill").style.width = progressPercent + "%";

  // Handle previous button state
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

// Next card function
function nextCard() {
  if (currentIndex < sampleCards.length - 1) {
    currentIndex = currentIndex + 1;
    loadCard(currentIndex);
  } else {
    showSummary();
  }
}

// Previous card function
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

// Show session completion summary
function showSummary() {
  document.querySelector(".flashcard-scene").classList.add("hidden");
  document.querySelector(".difficulty-controls").classList.add("hidden");
  document.querySelector(".nav-controls").classList.add("hidden");

  var summaryModal = document.getElementById("summaryModal");
  summaryModal.classList.remove("hidden");

  document.getElementById("summaryScore").innerText = 
    "You completed all " + sampleCards.length + " cards! Mastered: " + masteredCount;
}

// Restart study session
function restartSession() {
  currentIndex = 0;
  masteredCount = 0;

  document.querySelector(".flashcard-scene").classList.remove("hidden");
  document.querySelector(".difficulty-controls").classList.remove("hidden");
  document.querySelector(".nav-controls").classList.remove("hidden");
  document.getElementById("summaryModal").classList.add("hidden");

  loadCard(currentIndex);
}