/*=========================================
tracking.js
=========================================*/

const API_URL = "http://localhost:8080/api/tracking";

/*==================================
Map Initialization
==================================*/

const pickup = [28.6139, 77.2090];       // Delhi
const destination = [28.4595, 77.0266];  // Gurugram
let driverLocation = [28.5600, 77.1600];

const map = L.map("map").setView(driverLocation, 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{

    attribution:"© OpenStreetMap"

}).addTo(map);

/*==================================
Markers
==================================*/

const pickupMarker = L.marker(pickup)
.addTo(map)
.bindPopup("Pickup Location");

const destinationMarker = L.marker(destination)
.addTo(map)
.bindPopup("Destination");

const driverMarker = L.marker(driverLocation)
.addTo(map)
.bindPopup("Driver");

/*==================================
Route Line
==================================*/

const route = L.polyline(

    [

        pickup,

        driverLocation,

        destination

    ],

    {

        color:"blue",

        weight:5

    }

).addTo(map);

map.fitBounds(route.getBounds());

/*==================================
Live Driver Movement
==================================*/

let progress = 70;

function moveDriver(){

    if(progress>=100){

        document.getElementById("status").innerText="Delivered";

        document.getElementById("eta").innerText="Delivered";

        document.getElementById("distance").innerText="0 KM";

        document.getElementById("progressFill").style.width="100%";

        document.getElementById("progressText").innerText="100% Completed";

        return;

    }

    progress++;

    driverLocation[0]+=0.001;
    driverLocation[1]-=0.001;

    driverMarker.setLatLng(driverLocation);

    route.setLatLngs([

        pickup,

        driverLocation,

        destination

    ]);

    document.getElementById("progressFill").style.width=progress+"%";

    document.getElementById("progressText").innerText=
        progress+"% Completed";

    document.getElementById("distance").innerText=
        (100-progress)+" KM";

    document.getElementById("eta").innerText=
        Math.max(0,100-progress)+" Minutes";

}

setInterval(moveDriver,3000);

/*==================================
Refresh Button
==================================*/

document.getElementById("refreshBtn")
.addEventListener("click",()=>{

    alert("Latest Location Updated");

});

/*==================================
Driver Buttons
==================================*/

document.getElementById("callDriver")
.addEventListener("click",()=>{

    alert("Calling Driver...");

});

document.getElementById("messageDriver")
.addEventListener("click",()=>{

    alert("Opening Chat...");

});

document.getElementById("shareTracking")
.addEventListener("click",()=>{

    navigator.clipboard.writeText(window.location.href);

    alert("Tracking Link Copied");

});

/*==================================
Backend Tracking API
==================================*/

async function loadTracking(){

    const bookingId=localStorage.getItem("bookingId");

    if(!bookingId){

        return;

    }

    try{

        const response=await fetch(

            API_URL+"/"+bookingId,

            {

                headers:{

                    "Authorization":
                    "Bearer "+localStorage.getItem("token")

                }

            }

        );

        if(response.ok){

            const data=await response.json();

            console.log(data);

            // Later connect API values
            // driver location
            // ETA
            // booking status

        }

    }

    catch(error){

        console.log(error);

    }

}

loadTracking();

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

console.log("Tracking Loaded Successfully");