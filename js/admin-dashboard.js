/*=========================================
admin-dashboard.js
=========================================*/

const API_URL = "http://localhost:8080/api/admin";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || user.role !== "ADMIN") {
    window.location.href = "login.html";
}

let bookings = [];

/*==================================
Load Dashboard
==================================*/

async function loadDashboard() {

    try {

        const response = await fetch(API_URL + "/dashboard", {

            method: "GET",

            headers: {

                "Authorization": "Bearer " + token

            }

        });

        if (!response.ok) {

            throw new Error("Failed to load dashboard");

        }

        const data = await response.json();

        document.getElementById("userCount").innerText =
            data.totalUsers;

        document.getElementById("driverCount").innerText =
            data.totalDrivers;

        document.getElementById("bookingCount").innerText =
            data.totalBookings;

        document.getElementById("revenue").innerText =
            "₹" + data.totalRevenue;

        bookings = data.recentBookings || [];

        renderBookings();

    } catch (error) {

        console.log(error);

        alert("Unable to load dashboard.");

    }

}

/*==================================
Render Recent Bookings
==================================*/

function renderBookings() {

    const tbody = document.getElementById("bookingTable");

    tbody.innerHTML = "";

    bookings.forEach(booking => {

        let statusClass = "pending";

        if (booking.status === "IN_TRANSIT") {

            statusClass = "transit";

        }

        if (booking.status === "COMPLETED") {

            statusClass = "completed";

        }

        if (booking.status === "CANCELLED") {

            statusClass = "cancelled";

        }

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${booking.id}</td>

            <td>${booking.customerName}</td>

            <td>${booking.driverName || "-"}</td>

            <td>${booking.vehicleType}</td>

            <td>

                <span class="status ${statusClass}">

                    ${booking.status}

                </span>

            </td>

            <td>₹${booking.totalAmount}</td>

        `;

        tbody.appendChild(row);

    });

}

/*==================================
Quick Actions
==================================*/

document.getElementById("manageUsers")
.addEventListener("click", () => {

    window.location.href = "users.html";

});

document.getElementById("manageDrivers")
.addEventListener("click", () => {

    window.location.href = "drivers.html";

});

document.getElementById("manageBookings")
.addEventListener("click", () => {

    window.location.href = "bookings.html";

});

document.getElementById("managePayments")
.addEventListener("click", () => {

    window.location.href = "payments.html";

});

/*==================================
Logout
==================================*/

const logout = document.querySelector(
'a[href="login.html"]'
);

if (logout) {

    logout.addEventListener("click", () => {

        localStorage.clear();

    });

}

/*==================================
Initialize
==================================*/

loadDashboard();

console.log("Admin Dashboard Loaded");