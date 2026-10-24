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