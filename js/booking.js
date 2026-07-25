/*=========================================
booking.js
=========================================*/

const API_URL = "http://localhost:8080/api/bookings";

let selectedVehicle = "";

/*==================================
Vehicle Selection
==================================*/

const vehicleButtons = document.querySelectorAll(".vehicle-card button");

vehicleButtons.forEach(button => {

    button.addEventListener("click", function () {

        document.querySelectorAll(".vehicle-card").forEach(card => {
            card.style.border = "2px solid transparent";
        });

        const card = this.parentElement;

        card.style.border = "2px solid #2563eb";

        selectedVehicle = card.querySelector("h3").innerText;

        document.getElementById("selectedVehicle").innerText = selectedVehicle;

    });

});

/*==================================
Price Estimation
==================================*/

const estimateBtn = document.getElementById("estimateBtn");

estimateBtn.addEventListener("click", () => {

    const weight = parseFloat(document.getElementById("weight").value);

    if (isNaN(weight) || weight <= 0) {

        alert("Enter valid weight.");
        return;

    }

    let base = 3000 + (weight * 5);
    let gst = Math.round(base * 0.18);
    let platform = 150;
    let total = base + gst + platform;

    document.getElementById("baseFare").innerText = "₹" + base;
    document.getElementById("gst").innerText = "₹" + gst;
    document.getElementById("platformFee").innerText = "₹" + platform;
    document.getElementById("totalAmount").innerText = "₹" + total;

});

/*==================================
Negotiation
==================================*/

document.getElementById("sendOffer").addEventListener("click", () => {

    const offer = document.getElementById("offerPrice").value;

    if (offer === "") {

        alert("Enter your offer.");
        return;

    }

    alert("Offer of ₹" + offer + " sent successfully.");

});

/*==================================
Confirm Booking
==================================*/

document.getElementById("bookNow").addEventListener("click", async () => {

    const pickup = document.getElementById("pickup").value.trim();
    const drop = document.getElementById("drop").value.trim();
    const date = document.getElementById("date").value;
    const weight = parseFloat(document.getElementById("weight").value);
    const goods = document.getElementById("goods").value.trim();

    if (
        pickup === "" ||
        drop === "" ||
        date === "" ||
        isNaN(weight) ||
        selectedVehicle === ""
    ) {

        alert("Please fill all details.");
        return;

    }

    const totalText = document.getElementById("totalAmount").innerText;

    if (totalText === "" || totalText === "₹0") {

        alert("Please click 'Estimate Price' first.");
        return;

    }

    const totalAmount = parseFloat(
        totalText.replace("₹", "")
    );

    const booking = {

        pickupLocation: pickup,
        dropLocation: drop,
        vehicleType: selectedVehicle,
        weight: weight,
        distance: 10,              // Temporary
        goodsType: goods,
        price: totalAmount

    };

    try {

        const token = localStorage.getItem("token");

        if (!token) {

            alert("Please login first.");
            window.location.href = "login.html";
            return;

        }

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": "Bearer " + token

            },

            body: JSON.stringify(booking)

        });

        if (response.ok) {

            const data = await response.json();

            console.log("Booking Response:", data);

            alert("Booking Successful");

            localStorage.setItem("bookingId", data.id);

            window.location.href = "payment.html";

        }

        else {

            const error = await response.text();

            console.log(error);

            alert(error);

        }

    }

    catch (error) {

        console.log(error);

        alert("Server not available.");

    }

});

/*==================================
Today's Date
==================================*/

const dateField = document.getElementById("date");

const today = new Date().toISOString().split("T")[0];

dateField.min = today;

/*==================================
Logout
==================================*/

const logout = document.querySelector('a[href="login.html"]');

if (logout) {

    logout.addEventListener("click", () => {

        localStorage.clear();

    });

}

console.log("Booking Page Loaded Successfully");