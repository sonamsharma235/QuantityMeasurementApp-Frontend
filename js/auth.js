// Get users from localStorage or empty array
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// ---------------- SIGNUP ----------------
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let users = getUsers();

        // Check if user already exists
        const userExists = users.find(user => user.email === email);

        if (userExists) {
            alert("User already exists! Please login.");
            return;
        }

        // Add new user
        users.push({ name, email, password });
        saveUsers(users);

        alert("Signup successful! Please login.");
        window.location.href = "index.html";
    });
}

// ---------------- LOGIN ----------------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let users = getUsers();

        const validUser = users.find(
            user => user.email === email && user.password === password
        );

        if (!validUser) {
            alert("Invalid email or password!");
            return;
        }

        // Save logged-in user
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));

        alert("Login successful!");
        window.location.href = "dashboard.html";
    });
}