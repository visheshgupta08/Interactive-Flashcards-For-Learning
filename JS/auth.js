// Function to switch to Login tab
function showLogin() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginTabBtn").classList.add("active");
  document.getElementById("signupTabBtn").classList.remove("active");
  clearMessage();
}

// Function to switch to Signup tab
function showSignup() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");
  document.getElementById("loginTabBtn").classList.remove("active");
  document.getElementById("signupTabBtn").classList.add("active");
  clearMessage();
}

function clearMessage() {
  var msg = document.getElementById("authMessage");
  msg.innerText = "";
  msg.style.color = "";
}

// Signup function
function handleSignup(event) {
  event.preventDefault(); // page reload hone se rokta hai

  var name = document.getElementById("signupName").value.trim();
  var email = document.getElementById("signupEmail").value.trim();
  var pass = document.getElementById("signupPass").value;
  var msg = document.getElementById("authMessage");

  // Basic validation check
  if (pass.length < 6) {
    msg.innerText = "Password must be at least 6 characters!";
    msg.style.color = "red";
    return;
  }

  // User object
  var user = {
    name: name,
    email: email,
    password: pass
  };

  // localStorage mein save karna
  localStorage.setItem("userAccount", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");

  msg.innerText = "Account created successfully! Redirecting...";
  msg.style.color = "green";

  setTimeout(function() {
    window.location.href = "dashboard.html";
  }, 1200);
}

// Login function
function handleLogin(event) {
  event.preventDefault();

  var email = document.getElementById("loginEmail").value.trim();
  var pass = document.getElementById("loginPass").value;
  var msg = document.getElementById("authMessage");

  // LocalStorage se saved user nikalna
  var savedUserData = localStorage.getItem("userAccount");

  if (!savedUserData) {
    msg.innerText = "No account found. Please sign up first!";
    msg.style.color = "red";
    return;
  }

  var savedUser = JSON.parse(savedUserData);

  // Match email and password
  if (savedUser.email === email && savedUser.password === pass) {
    localStorage.setItem("isLoggedIn", "true");
    msg.innerText = "Login successful! Redirecting...";
    msg.style.color = "green";

    setTimeout(function() {
      window.location.href = "dashboard.html";
    }, 1200);
  } else {
    msg.innerText = "Invalid email or password!";
    msg.style.color = "red";
  }
}