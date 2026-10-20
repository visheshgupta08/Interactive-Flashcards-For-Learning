// Sample decks data
var decksData = [
  {
    id: 1,
    title: "HTML5 & Semantic Tags",
    category: "Web Development",
    description: "Learn essential tags, structural elements, and forms.",
    cardCount: 5
  },
  {
    id: 2,
    title: "CSS Flexbox & Box Model",
    category: "Web Development",
    description: "Master margin, padding, flex-direction, and alignment.",
    cardCount: 4
  },
  {
    id: 3,
    title: "Basics of Programming",
    category: "Programming",
    description: "Variables, conditions, loops, and function syntax.",
    cardCount: 4
  },
  {
    id: 4,
    title: "Internet & Networking",
    category: "Core CS",
    description: "HTTP, DNS, IP addressing, and client-server concepts.",
    cardCount: 4
  }
];

window.onload = function() {
  checkUserSession();
  renderDecks(decksData);
};

// Check logged in user
function checkUserSession() {
  var userAccount = localStorage.getItem("userAccount");
  var welcomeText = document.getElementById("welcomeUser");

  if (userAccount) {
    var user = JSON.parse(userAccount);
    welcomeText.innerText = "Welcome back, " + user.name + "!";
  }
}

// Render deck cards into container
function renderDecks(list) {
  var container = document.getElementById("decksContainer");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No decks found matching your criteria.</p>";
    return;
  }

  for (var i = 0; i < list.length; i++) {
    var deck = list[i];

    var cardDiv = document.createElement("div");
    cardDiv.className = "deck-card";

    cardDiv.innerHTML = 
      "<span class='deck-tag'>" + deck.category + "</span>" +
      "<h3>" + deck.title + "</h3>" +
      "<p>" + deck.description + "</p>" +
      "<div class='deck-footer'>" +
        "<span class='card-count'>" + deck.cardCount + " Cards</span>" +
        "<button class='btn btn-primary' onclick='startStudySession(" + deck.id + ")'>Study Now</button>" +
      "</div>";

    container.appendChild(cardDiv);
  }
}

// Search and category filter
function filterDecks() {
  var searchValue = document.getElementById("searchInput").value.toLowerCase();
  var selectedCategory = document.getElementById("categoryFilter").value;

  var filteredList = [];

  for (var i = 0; i < decksData.length; i++) {
    var deck = decksData[i];
    var matchesSearch = deck.title.toLowerCase().indexOf(searchValue) > -1;
    var matchesCategory = (selectedCategory === "All") || (deck.category === selectedCategory);

    if (matchesSearch && matchesCategory) {
      filteredList.push(deck);
    }
  }

  renderDecks(filteredList);
}

// Save active deck ID and redirect to study page
function startStudySession(deckId) {
  localStorage.setItem("activeDeckId", deckId);
  window.location.href = "study.html";
}

// Logout user
function handleLogout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "auth.html";
}