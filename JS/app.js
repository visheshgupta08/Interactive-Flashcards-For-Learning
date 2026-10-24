// Navbar: login ke baad "Login / Sign Up" ki jagah "Logout" dikhao
var navAuth = document.getElementById("navAuthLink");
if (navAuth && typeof getCurrentUser === "function" && getCurrentUser()) {
  navAuth.innerText = "Logout";
  navAuth.href = "#";
  navAuth.onclick = function() {
    logoutUser();
    window.location.href = "auth.html";
  };
}