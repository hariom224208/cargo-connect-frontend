/*=========================================
payment.js
=========================================*/

const API_URL = "http://localhost:8080/api/payments";
const BOOKING_API = "http://localhost:8080/api/bookings";

const token = localStorage.getItem("token");
const bookingId = localStorage.getItem("bookingId");

/*==================================
Load Booking Details
==================================*/

async function loadBooking() {

    if (!bookingId) return;

    try {

        const response = await fetch(`${BOOKING_API}/${bookingId}`, {

            headers: {
                "Authorization": "Bearer " + token
            }

        });

        if (!response.ok) return;

        const booking = await response.json();

        document.getElementById("bookingId").innerText = booking.id;
        document.getElementById("vehicleName").innerText = booking.vehicleType;
        document.getElementById("pickupLocation").innerText = booking.pickupLocation;
        document.getElementById("dropLocation").innerText = booking.dropLocation;
        document.getElementById("amount").innerText = "₹" + booking.totalAmount;

    } catch (error) {

        console.log(error);

    }

}

/*==================================
Card Number Formatting
==================================*/

const cardNumber = document.getElementById("cardNumber");

cardNumber.addEventListener("input", function () {

    let value = this.value.replace(/\D/g, "");

    value = value.substring(0,16);

    value = value.replace(/(.{4})/g,"$1 ").trim();

    this.value = value;

});

/*==================================
Payment
==================================*/

document.getElementById("payNow").addEventListener("click", async () => {

    const paymentMethod = document.querySelector(
        'input[name="payment"]:checked'
    ).value;

    const holder = document.getElementById("cardHolder").value.trim();

    const number = document.getElementById("cardNumber")
        .value.replace(/\s/g,"");

    const expiry = document.getElementById("expiryDate").value;

    const cvv = document.getElementById("cvv").value;

    if (paymentMethod === "CARD") {

        if (
            holder === "" ||
            number.length !== 16 ||
            expiry === "" ||
            cvv.length !== 3
        ) {

            alert("Enter valid card details.");

            return;

        }

    }

    try {

        const response = await fetch(API_URL, {

            method:"POST",

            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+token
            },

            body:JSON.stringify({

                bookingId: bookingId,

                paymentMethod: paymentMethod,

                amount: document
                    .getElementById("amount")
                    .innerText
                    .replace("₹","")

            })

        });

        if(response.ok){

            document
                .getElementById("successModal")
                .classList
                .add("show");

        }else{

            alert("Payment Failed");

        }

    }catch(error){

        console.log(error);

        alert("Server Error");

    }

});

/*==================================
Go Tracking
==================================*/

document.getElementById("goTracking")
.addEventListener("click",()=>{

    window.location.href="tracking.html";

});

/*==================================
Logout
==================================*/

const logout=document.querySelector(
'a[href="login.html"]'
);

if(logout){

    logout.addEventListener("click",()=>{

        localStorage.clear();

    });

}

/*==================================
Initialize
==================================*/

loadBooking();

console.log("Payment Module Loaded");