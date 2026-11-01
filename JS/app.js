// Global logout handler
function handleLogout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userAccount");
  localStorage.removeItem("activeDeckId");
  window.location.href = "index.html";
}

// Global navbar updater
function updateNavbar() {
  var isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  var profileLink = document.getElementById("navProfileLink");
  var authBtn = document.getElementById("navAuthLink");

  if (!authBtn) return;

  if (isLoggedIn) {
    if (profileLink) profileLink.style.display = "inline-block";
    authBtn.textContent = "Logout";
    authBtn.href = "#";
    authBtn.className = "btn btn-primary";
    authBtn.onclick = handleLogout;
  } else {
    // Guest mode: Profile link chupao
    if (profileLink) profileLink.style.display = "none";
    authBtn.textContent = "Login / Sign Up";
    authBtn.href = "auth.html";
    authBtn.className = "btn btn-primary";
    authBtn.onclick = null;
  }
}

// Page load hone par aur script execute hote hi navbar update karo
document.addEventListener("DOMContentLoaded", updateNavbar);
updateNavbar();