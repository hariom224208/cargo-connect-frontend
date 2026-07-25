/*=========================================
dashboard.js
=========================================*/

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
    window.location.href = "login.html";
}

if (user && user.name) {

    const userNameHeading = document.querySelector(".user h4");

    if (userNameHeading) {
        userNameHeading.innerText = user.name;
    }

}

// Logout
const logoutLink = document.querySelector('a[href="login.html"]');

logoutLink.addEventListener("click", function () {

    localStorage.clear();

});

// Search Vehicle
const searchInput = document.querySelector(".search-box input");

searchInput.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const vehicles = document.querySelectorAll(".vehicle-card");

    vehicles.forEach(vehicle => {

        const name = vehicle.querySelector("h3").innerText.toLowerCase();

        if (name.includes(value)) {

            vehicle.style.display = "block";

        } else {

            vehicle.style.display = "none";

        }

    });

});

// Select Vehicle
const vehicleButtons = document.querySelectorAll(".vehicle-card button");

vehicleButtons.forEach(button => {

    button.addEventListener("click", function () {

        const vehicle = this.parentElement.querySelector("h3").innerText;

        alert(vehicle + " Selected Successfully.");

    });

});

// Notification Bell
const bell = document.querySelector(".notification");

bell.addEventListener("click", function () {

    alert("You have 4 new notifications.");

});

// Dashboard Cards Animation
const cards = document.querySelectorAll(".card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-8px) scale(1.03)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0) scale(1)";

    });

});

// Vehicle Card Animation
const vehicleCards = document.querySelectorAll(".vehicle-card");

vehicleCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.boxShadow = "0 20px 40px rgba(37,99,235,.25)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.boxShadow = "0 10px 25px rgba(0,0,0,.08)";

    });

});

// Statistics Counter
const stats = document.querySelectorAll(".stat-box h2");

stats.forEach(stat => {

    const text = stat.innerText;

    const number = parseInt(text.replace(/\D/g, ""));

    if (isNaN(number)) return;

    let count = 0;

    const interval = setInterval(() => {

        count += Math.ceil(number / 50);

        if (count >= number) {

            clearInterval(interval);

            stat.innerText = text;

        } else {

            if (text.includes("%")) {

                stat.innerText = count + "%";

            } else if (text.includes("+")) {

                stat.innerText = count + "+";

            } else {

                stat.innerText = count;

            }

        }

    }, 30);

});

// Welcome Button
const bookButton = document.querySelector(".book-btn");

bookButton.addEventListener("click", () => {

    window.location.href = "booking.html";

});

// Table Row Hover
const rows = document.querySelectorAll("tbody tr");

rows.forEach(row => {

    row.addEventListener("mouseenter", () => {

        row.style.background = "#eff6ff";

    });

    row.addEventListener("mouseleave", () => {

        row.style.background = "#fff";

    });

});

// Greeting
const hour = new Date().getHours();

const welcomeHeading = document.querySelector(".welcome h1");

if (hour < 12) {

    welcomeHeading.innerHTML = "Good Morning ☀️";

} else if (hour < 17) {

    welcomeHeading.innerHTML = "Good Afternoon 🌤️";

} else {

    welcomeHeading.innerHTML = "Good Evening 🌙";

}

console.log("Dashboard Loaded Successfully");