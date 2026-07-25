/*=========================================
history.js
=========================================*/

const API_URL = "http://localhost:8080/api/bookings";
const token = localStorage.getItem("token");

let bookings = [];

/*==================================
Load Booking History
==================================*/

async function loadBookings() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("Unable to load bookings");
        }

        bookings = await response.json();
        console.log(JSON.stringify(bookings, null, 2));
        renderTable(bookings);

    } catch (error) {
        console.log(error);
        alert("Failed to load booking history.");
    }
}

/*==================================
Render Table
==================================*/

function renderTable(data) {
    const tbody = document.getElementById("historyBody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    No Bookings Found
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(booking => {
        const status = booking.status ?? "PENDING";
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.pickupLocation}</td>
            <td>${booking.dropLocation}</td>
            <td>${booking.vehicleType}</td>
            <td>${booking.bookingDate}</td>
            <td>₹${booking.price}</td>
            <td>
                <span class="status ${status.toLowerCase()}">
                    ${status}
                </span>
            </td>
            <td>
                <button class="view-btn" onclick="openBooking('${booking.id}')">
                    View
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

/*==================================
Search Booking
==================================*/

document.getElementById("searchBooking")
    .addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        const filtered = bookings.filter(b =>
            b.id.toString().toLowerCase().includes(value)
        );
        renderTable(filtered);
    });

/*==================================
Open Booking
==================================*/

function openBooking(id) {
    const booking = bookings.find(b => b.id == id);

    if (!booking) return;

    document.getElementById("modalBookingId").innerText = booking.id;
    document.getElementById("modalPickup").innerText = booking.pickupLocation;
    document.getElementById("modalDrop").innerText = booking.dropLocation;
    document.getElementById("modalVehicle").innerText = booking.vehicleType;
    document.getElementById("modalWeight").innerText = booking.weight + " KG";
    document.getElementById("modalGoods").innerText = booking.goodsType;
    document.getElementById("modalAmount").innerText = "₹" + booking.price;
    document.getElementById("modalStatus").innerText = booking.status;

    localStorage.setItem("bookingId", booking.id);

    document
        .getElementById("bookingModal")
        .classList
        .add("show");
}

/*==================================
Close Modal
==================================*/

document
    .getElementById("closeModal")
    .addEventListener("click", () => {
        document
            .getElementById("bookingModal")
            .classList
            .remove("show");
    });

/*==================================
Track Booking
==================================*/

document
    .getElementById("trackBooking")
    .addEventListener("click", () => {
        window.location.href = "tracking.html";
    });

/*==================================
Close Modal Outside
==================================*/

window.addEventListener("click", function (e) {
    const modal = document.getElementById("bookingModal");

    if (e.target === modal) {
        modal.classList.remove("show");
    }
});

/*==================================
Logout
==================================*/

const logout = document.querySelector('a[href="login.html"]');

if (logout) {
    logout.addEventListener("click", () => {
        localStorage.clear();
    });
}

/*==================================
Initialize
==================================*/

loadBookings();

console.log("Booking History Loaded Successfully");
