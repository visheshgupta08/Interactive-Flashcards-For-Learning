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
  if (msg) {
    msg.innerText = "";
    msg.style.color = "";
  }
}

// Signup function (Multi-User Support)
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

  // 1. Existing users list fetch karo ya empty array initialize karo
  var users = JSON.parse(localStorage.getItem("usersList")) || [];

  // 2. Check duplicate email
  var isEmailTaken = users.some(function(u) {
    return u.email.toLowerCase() === email.toLowerCase();
  });

  if (isEmailTaken) {
    msg.innerText = "This email is already registered! Please login.";
    msg.style.color = "red";
    return;
  }

  // 3. Naya user create karo (Pehla user automatic admin)
  var newUser = {
    name: name,
    email: email,
    password: pass,
    role: "user"
  };

  // 4. Array mein push karo aur save karo
  users.push(newUser);
  localStorage.setItem("usersList", JSON.stringify(users));

  // 5. Active session set karo (backward compatibility ke sath)
  localStorage.setItem("userAccount", JSON.stringify(newUser));
  localStorage.setItem("isLoggedIn", "true");

  msg.innerText = "Account created successfully! Redirecting...";
  msg.style.color = "green";

  setTimeout(function() {
    window.location.href = "dashboard.html";
  }, 1200);
}

// Login function (Multi-User Authentication)
function handleLogin(event) {
  event.preventDefault();

  var email = document.getElementById("loginEmail").value.trim();
  var pass = document.getElementById("loginPass").value;
  var msg = document.getElementById("authMessage");

  // Users list fetch karo
  var users = JSON.parse(localStorage.getItem("usersList")) || [];

  // Fallback: agar kisi purane single user ka data "userAccount" mein ho aur list mein na ho
  if (users.length === 0) {
    var legacyUser = localStorage.getItem("userAccount");
    if (legacyUser) {
      users.push(JSON.parse(legacyUser));
      localStorage.setItem("usersList", JSON.stringify(users));
    }
  }

  if (users.length === 0) {
    msg.innerText = "No account found. Please sign up first!";
    msg.style.color = "red";
    return;
  }

  // Check matching credentials
  var foundUser = users.find(function(u) {
    return u.email.toLowerCase() === email.toLowerCase() && u.password === pass;
  });

  if (foundUser) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userAccount", JSON.stringify(foundUser)); // active session user
    msg.innerText = "Welcome back, " + foundUser.name + "! Redirecting...";
    msg.style.color = "green";

    setTimeout(function() {
      window.location.href = "dashboard.html";
    }, 1200);
  } else {
    msg.innerText = "Invalid email or password!";
    msg.style.color = "red";
  }
}