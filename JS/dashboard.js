// Auth Guard
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "auth.html";
}

function getLocalDateString(d) {
  var date = d || new Date();
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Default system decks
var defaultDecks = [
  { id: "1", title: "HTML Fundamentals", category: "Web Development", desc: "Tags, semantic structure, links, forms, and attributes.", cardCount: 5, isCustom: false },
  { id: "2", title: "CSS Box Model & Flexbox", category: "Web Development", desc: "Margin, padding, flex container, alignment, and grid.", cardCount: 4, isCustom: false },
  { id: "3", title: "JavaScript Core Concepts", category: "Programming", desc: "Variables, data types, loops, functions, and events.", cardCount: 4, isCustom: false },
  { id: "4", title: "Computer Networking Basics", category: "Core CS", desc: "Protocols, IP addressing, HTTP/HTTPS, and ports.", cardCount: 4, isCustom: false },
  { id: "5", title: "Data Structures Basics", category: "Programming", desc: "Arrays, linked lists, stacks, queues, and time complexity.", cardCount: 4, isCustom: false },
  { id: "6", title: "SQL & Database Essentials", category: "Core CS", desc: "RDBMS, primary keys, SQL queries, and normalization.", cardCount: 4, isCustom: false }
];

var allDecksList = [];

window.onload = function() {
  loadUserProfile();
  initDeckData();
  updateDashboardStats();
  setupFilterEvents();
};

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

// System + Custom Decks Sync
function initDeckData() {
  var storedUserDecks = JSON.parse(localStorage.getItem("userDecksList") || "[]");
  allDecksList = defaultDecks.concat(storedUserDecks);

  // Sync card counts from customFlashcards
  var storedCustomCards = localStorage.getItem("customFlashcards");
  if (storedCustomCards) {
    try {
      var parsedCards = JSON.parse(storedCustomCards);
      allDecksList.forEach(function(deck) {
        if (parsedCards[deck.id] && Array.isArray(parsedCards[deck.id])) {
          deck.cardCount = parsedCards[deck.id].length;
        }
      });
    } catch (e) {
      console.error("Card sync error:", e);
    }
  }

  renderDecks(allDecksList);
}

function updateDashboardStats() {
  var activeUser = JSON.parse(localStorage.getItem("userAccount") || "{}");
  var userKey = activeUser.email ? "_" + activeUser.email : "";

  var totalDecksEl = document.getElementById("totalDecksStat");
  if (totalDecksEl) {
    totalDecksEl.innerText = allDecksList.length;
  }

  var reviewedEl = document.getElementById("totalReviewedStat");
  var reviewedCount = localStorage.getItem("cardsReviewed" + userKey) || "0";
  if (reviewedEl) {
    reviewedEl.innerText = reviewedCount;
  }

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

    var activeUser = JSON.parse(localStorage.getItem("userAccount") || "{}");
    var userKey = activeUser.email ? "_" + activeUser.email : "";
    var deckStatus = localStorage.getItem("progress_" + deck.id + userKey) || "Not Started";

    // Status ke hisaab se color
    var badgeColor = "#64748b"; // gray for Not Started
    var badgeBg = "#f1f5f9";
    if (deckStatus === "In Progress") {
      badgeColor = "#d97706"; // amber
      badgeBg = "#fef3c7";
    } else if (deckStatus === "Completed") {
      badgeColor = "#16a34a"; // green
      badgeBg = "#dcfce7";
    }

    var deleteBtnHtml = deck.isCustom 
      ? `<button onclick="deleteDeck('${deck.id}')" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; margin-left: auto;">🗑 Delete</button>`
      : "";

    cardDiv.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
        <span class="deck-tag">${deck.category}</span>
        <span style="font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 9999px; background: ${badgeBg}; color: ${badgeColor};">${deckStatus}</span>
        ${deleteBtnHtml}
      </div>
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

function setupFilterEvents() {
  var searchInput = document.getElementById("searchInput");
  var categoryFilter = document.getElementById("categoryFilter");

  function applyFilter() {
    var query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    var selectedCategory = categoryFilter ? categoryFilter.value : "All";

    var filtered = allDecksList.filter(function(deck) {
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

// Modal Handlers
function openCreateDeckModal() {
  var modal = document.getElementById("createDeckModal");
  if (modal) modal.classList.remove("hidden");
}

function closeCreateDeckModal() {
  var modal = document.getElementById("createDeckModal");
  if (modal) modal.classList.add("hidden");
  document.getElementById("newDeckTitle").value = "";
  document.getElementById("newDeckDesc").value = "";
}

function handleCreateDeck(event) {
  event.preventDefault();

  var title = document.getElementById("newDeckTitle").value.trim();
  var category = document.getElementById("newDeckCategory").value;
  var desc = document.getElementById("newDeckDesc").value.trim();

  if (!title || !desc) return;

  var newDeck = {
    id: "deck_" + Date.now(),
    title: title,
    category: category,
    desc: desc,
    cardCount: 0,
    isCustom: true
  };

  var userDecks = JSON.parse(localStorage.getItem("userDecksList") || "[]");
  userDecks.push(newDeck);
  localStorage.setItem("userDecksList", JSON.stringify(userDecks));

  // Initialize empty cards list for this new deck
  var storedCards = JSON.parse(localStorage.getItem("customFlashcards") || "{}");
  storedCards[newDeck.id] = [];
  localStorage.setItem("customFlashcards", JSON.stringify(storedCards));

  closeCreateDeckModal();
  initDeckData();
  updateDashboardStats();
}

function deleteDeck(deckId) {
  if (!confirm("Are you sure you want to delete this custom deck?")) return;

  var userDecks = JSON.parse(localStorage.getItem("userDecksList") || "[]");
  userDecks = userDecks.filter(function(deck) {
    return deck.id !== deckId;
  });
  localStorage.setItem("userDecksList", JSON.stringify(userDecks));

  // Remove cards belonging to this deck
  var storedCards = JSON.parse(localStorage.getItem("customFlashcards") || "{}");
  delete storedCards[deckId];
  localStorage.setItem("customFlashcards", JSON.stringify(storedCards));

  initDeckData();
  updateDashboardStats();
}

function startStudy(deckId, deckTitle) {
  localStorage.setItem("activeDeckId", deckId);
  localStorage.setItem("activeDeckTitle", deckTitle || "Flashcard Session");
  window.location.href = "study.html";
}

function handleLogout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userAccount");
  window.location.href = "auth.html";
}