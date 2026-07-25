/*=========================================
driver-dashboard.js
=========================================*/

const API_URL = "http://localhost:8080/api/driver";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || user.role !== "DRIVER") {
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

            throw new Error("Dashboard Load Failed");

        }

        const data = await response.json();

        bookings = data.bookings || [];

        document.getElementById("assignedCount").innerText =
            data.assignedBookings;

        document.getElementById("activeCount").innerText =
            data.activeBookings;

        document.getElementById("completedCount").innerText =
            data.completedBookings;

        document.getElementById("earning").innerText =
            "₹" + data.totalEarnings;

        document.getElementById("driverLocation").innerText =
            data.currentLocation;

        document.getElementById("vehicleNumber").innerText =
            data.vehicleNumber;

        renderBookings();

    } catch (error) {

        console.log(error);

        alert("Unable to load dashboard.");

    }

}

/*==================================
Render Bookings
==================================*/

function renderBookings() {

    const tbody = document.getElementById("bookingTable");

    tbody.innerHTML = "";

    bookings.forEach(booking => {

        let statusClass = "pending";

        if (booking.status === "IN_TRANSIT")
            statusClass = "transit";

        if (booking.status === "COMPLETED")
            statusClass = "completed";

        row = document.createElement("tr");

        row.innerHTML = `

            <td>${booking.id}</td>

            <td>${booking.pickupLocation}</td>

            <td>${booking.dropLocation}</td>

            <td>${booking.customerName}</td>

            <td>

                <span class="status ${statusClass}">

                    ${booking.status}

                </span>

            </td>

            <td>

                ${actionButton(booking)}

            </td>

        `;

        tbody.appendChild(row);

    });

}

/*==================================
Action Button
==================================*/

function actionButton(booking) {

    if (booking.status === "ASSIGNED") {

        return `
        <button
            class="action-btn"
            onclick="startDelivery('${booking.id}')">
            Start
        </button>
        `;

    }

    if (booking.status === "IN_TRANSIT") {

        return `
        <button
            class="action-btn"
            onclick="completeDelivery('${booking.id}')">
            Complete
        </button>
        `;

    }

    return "-";

}

/*==================================
Start Delivery
==================================*/

async function startDelivery(id) {

    try {

        const response = await fetch(

            API_URL + "/start/" + id,

            {

                method: "PUT",

                headers: {

                    "Authorization": "Bearer " + token

                }

            }

        );

        if (response.ok) {

            alert("Delivery Started");

            loadDashboard();

        }

    } catch (error) {

        console.log(error);

    }

}

/*==================================
Complete Delivery
==================================*/

async function completeDelivery(id) {

    try {

        const response = await fetch(

            API_URL + "/complete/" + id,

            {

                method: "PUT",

                headers: {

                    "Authorization": "Bearer " + token

                }

            }

        );

        if (response.ok) {

            alert("Delivery Completed");

            loadDashboard();

        }

    } catch (error) {

        console.log(error);

    }

}

/*==================================
Availability
==================================*/

document
.getElementById("availabilityToggle")
.addEventListener("change", async function () {

    const available = this.checked;

    document.getElementById("driverStatus").innerText =
        available ? "Online" : "Offline";

    document.getElementById("driverStatus").className =
        available ? "online" : "offline";

    try {

        await fetch(

            API_URL + "/availability",

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": "Bearer " + token

                },

                body: JSON.stringify({

                    available: available

                })

            }

        );

    } catch (error) {

        console.log(error);

    }

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

console.log("Driver Dashboard Loaded");