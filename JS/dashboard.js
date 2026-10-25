// Auth Guard: Agar user login nahi hai toh login page bhej do
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "auth.html";
}

// Helper function: Local Timezone date
function getLocalDateString(d) {
  var date = d || new Date();
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// 6 Decks ka data array (Dynamically inject karne ke liye)
var availableDecks = [
  {
    id: "1",
    title: "HTML Fundamentals",
    category: "Web Development",
    desc: "Tags, semantic structure, links, forms, and attributes.",
    cardCount: 5
  },
  {
    id: "2",
    title: "CSS Box Model & Flexbox",
    category: "Web Development",
    desc: "Margin, padding, flex container, alignment, and grid.",
    cardCount: 4
  },
  {
    id: "3",
    title: "JavaScript Core Concepts",
    category: "Programming",
    desc: "Variables, data types, loops, functions, and events.",
    cardCount: 4
  },
  {
    id: "4",
    title: "Computer Networking Basics",
    category: "Core CS",
    desc: "Protocols, IP addressing, HTTP/HTTPS, and ports.",
    cardCount: 4
  },
  {
    id: "5",
    title: "Data Structures Basics",
    category: "Programming",
    desc: "Arrays, linked lists, stacks, queues, and time complexity.",
    cardCount: 4
  },
  {
    id: "6",
    title: "SQL & Database Essentials",
    category: "Core CS",
    desc: "RDBMS, primary keys, SQL queries, and normalization.",
    cardCount: 4
  }
];

window.onload = function() {
  loadUserProfile();
  syncCustomDeckCounts(); // Custom cards add hone par count update karega
  updateDashboardStats(); // User-specific dynamic stats calculate aur render karega
  renderDecks(availableDecks);
  setupFilterEvents();
};

// 1. Dynamic Greeting
function loadUserProfile() {
  var savedUser = localStorage.getItem("userAccount");
  var greetingElement = document.getElementById("userGreeting");
  if (savedUser && greetingElement) {
    var user = JSON.parse(savedUser);
    if (user && user.name) {
      greetingElement.innerText = "Welcome back, " + user.name + "!";
    }
  }
}

// Custom added cards check karke real cardCount update karna
function syncCustomDeckCounts() {
  var storedCustomDecks = localStorage.getItem("customFlashcards");
  if (storedCustomDecks) {
    try {
      var parsedDecks = JSON.parse(storedCustomDecks);
      availableDecks.forEach(function(deck) {
        if (parsedDecks[deck.id] && Array.isArray(parsedDecks[deck.id])) {
          deck.cardCount = parsedDecks[deck.id].length;
        }
      });
    } catch (e) {
      console.error("Could not sync custom flashcards", e);
    }
  }
}

// 2. User-specific Dynamic Stats Handler (Total Decks, Reviewed, Streak)
function updateDashboardStats() {
  // Current logged-in user nikalo taaki har user ka apna alag data load ho
  var activeUser = JSON.parse(localStorage.getItem("userAccount") || "{}");
  var userKey = activeUser.email ? "_" + activeUser.email : "";

  // A. Total Decks count
  var totalDecksEl = document.getElementById("totalDecksStat");
  if (totalDecksEl) {
    totalDecksEl.innerText = availableDecks.length;
  }

  // B. User-specific Cards Reviewed count
  var reviewedEl = document.getElementById("totalReviewedStat");
  var reviewedCount = localStorage.getItem("cardsReviewed" + userKey) || "0";
  if (reviewedEl) {
    reviewedEl.innerText = reviewedCount;
  }

  // C. User-specific Daily Study Streak (Date-based dynamic tracking)
  var streakEl = document.getElementById("studyStreakStat");
  if (streakEl) {
    var lastDateKey = "lastStudyDate" + userKey;
    var streakKey = "studyStreak" + userKey;

    var lastStudyDate = localStorage.getItem(lastDateKey);
    var currentStreak = parseInt(localStorage.getItem(streakKey) || "0", 10);
    var today = getLocalDateString();

    if (lastStudyDate) {
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      var yesterdayStr = getLocalDateString(yesterday);

      // Agar streak break ho gayi hai
      if (lastStudyDate !== today && lastStudyDate !== yesterdayStr) {
        currentStreak = 0;
        localStorage.setItem(streakKey, "0");
      }
    } else {
      currentStreak = 0;
    }

    streakEl.innerText = currentStreak + (currentStreak === 1 ? " Day" : " Days");
  }
}

// 3. Dynamic Deck Renderer
function renderDecks(decksToDisplay) {
  var container = document.getElementById("decksContainer");
  if (!container) return;

  container.innerHTML = "";

  if (decksToDisplay.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 2rem;">No matching decks found.</p>';
    return;
  }

  decksToDisplay.forEach(function(deck) {
    var cardDiv = document.createElement("div");
    cardDiv.className = "deck-card";
    cardDiv.setAttribute("data-category", deck.category);

    cardDiv.innerHTML = `
      <span class="deck-tag">${deck.category}</span>
      <h3>${deck.title}</h3>
      <p>${deck.desc}</p>
      <div class="deck-footer">
        <span class="card-count">${deck.cardCount} Cards</span>
        <button class="btn btn-primary" onclick="startStudy('${deck.id}', '${deck.title}')">Study Now</button>
      </div>
    `;

    container.appendChild(cardDiv);
  });
}

// 4. Search & Category Filter Logic
function setupFilterEvents() {
  var searchInput = document.getElementById("searchInput");
  var categoryFilter = document.getElementById("categoryFilter");

  function applyFilter() {
    var query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    var selectedCategory = categoryFilter ? categoryFilter.value : "All";

    var filtered = availableDecks.filter(function(deck) {
      var matchesSearch = deck.title.toLowerCase().includes(query) || deck.desc.toLowerCase().includes(query);
      var matchesCategory = selectedCategory === "All" || deck.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    renderDecks(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilter);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFilter);
  }
}

// 5. Study Page Redirect with Deck ID and Title
function startStudy(deckId, deckTitle) {
  localStorage.setItem("activeDeckId", deckId);
  localStorage.setItem("activeDeckTitle", deckTitle || "Flashcard Session");
  window.location.href = "study.html";
}

// 6. Logout Handler
function handleLogout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userAccount");
  window.location.href = "auth.html";
}