// Navbar: login ke baad "Login / Sign Up" ki jagah "Logout" dikhao
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

function updateNavbar() {
  var isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  var profileLink = document.getElementById("navProfileLink");
  var authBtn = document.getElementById("navAuthLink");

  if (isLoggedIn) {
    if (profileLink) profileLink.style.display = "inline-block";
    if (authBtn) {
      authBtn.textContent = "Logout";
      authBtn.href = "#";
      authBtn.onclick = function () {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userAccount");
        window.location.reload();
      };
    }
  } else {
    // Guest mode: Profile ko chupao
    if (profileLink) profileLink.style.display = "none";
    if (authBtn) {
      authBtn.textContent = "Login / Sign Up";
      authBtn.href = "auth.html";
      authBtn.onclick = null;
    }
  }
}

// Dono tareeqe se trigger karo taaki miss na ho:
document.addEventListener("DOMContentLoaded", updateNavbar);
updateNavbar();