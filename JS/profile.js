// 1. Auth Guard: Check agar user login hai
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "auth.html";
}

window.onload = function() {
  loadProfileData();
};

function loadProfileData() {
  var activeUser = JSON.parse(localStorage.getItem("userAccount") || "{}");
  var userKey = activeUser.email ? "_" + activeUser.email : "";

  // 1. Basic Info Populate Karna
  var nameEl = document.getElementById("profileDisplayName");
  var emailInput = document.getElementById("profileEmail");
  var nameInput = document.getElementById("profileNameInput");
  var initialEl = document.getElementById("avatarInitial");
  var roleText = document.getElementById("profileRoleText");

  var displayName = activeUser.name || "Learner";
  var displayEmail = activeUser.email || "user@example.com";
  var displayRole = activeUser.role || "user";

  if (nameEl) nameEl.innerText = displayName;
  if (emailInput) emailInput.value = displayEmail;
  if (nameInput) nameInput.value = displayName;
  if (initialEl) initialEl.innerText = displayName.charAt(0).toUpperCase();
  if (roleText) roleText.innerText = displayRole === "admin" ? "Administrator" : "Learner Account";

  // 2. Personal Analytics Load Karna
  var reviewedCount = localStorage.getItem("cardsReviewed" + userKey) || "0";
  var streakCount = localStorage.getItem("studyStreak" + userKey) || "0";

  var reviewedEl = document.getElementById("userCardsReviewed");
  var streakEl = document.getElementById("userStreak");

  if (reviewedEl) reviewedEl.innerText = reviewedCount;
  if (streakEl) streakEl.innerText = streakCount + (streakCount === "1" ? " Day" : " Days");
}

// 3. Name update karne ka handler
function handleUpdateProfile(event) {
  event.preventDefault();

  var newName = document.getElementById("profileNameInput").value.trim();
  if (!newName) return;

  var activeUser = JSON.parse(localStorage.getItem("userAccount") || "{}");
  activeUser.name = newName;

  // Local user update
  localStorage.setItem("userAccount", JSON.stringify(activeUser));

  // Registered usersList array mein bhi update karo
  var usersList = JSON.parse(localStorage.getItem("usersList") || "[]");
  for (var i = 0; i < usersList.length; i++) {
    if (usersList[i].email === activeUser.email) {
      usersList[i].name = newName;
      break;
    }
  }
  localStorage.setItem("usersList", JSON.stringify(usersList));

  // UI reload
  loadProfileData();

  // Toast message dikhao
  var toast = document.getElementById("profileToast");
  if (toast) {
    toast.style.display = "block";
    setTimeout(function() {
      toast.style.display = "none";
    }, 2500);
  }
}

// 4. Logout handler
function handleLogout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userAccount");
  window.location.href = "auth.html";
}