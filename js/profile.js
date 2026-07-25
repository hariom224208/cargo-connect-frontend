/*=========================================
profile.js
=========================================*/

const API_BASE_URL = "http://localhost:8080/api/users";

const token = localStorage.getItem("token");

/*==================================
Load Profile
==================================*/

async function loadProfile() {

    try {

        const response = await fetch(API_BASE_URL + "/profile", {

            method: "GET",

            headers: {

                "Authorization": "Bearer " + token

            }

        });

        if (!response.ok) {

            throw new Error("Unable to load profile");

        }

        const user = await response.json();

        document.getElementById("name").value = user.name || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("phone").value = user.phone || "";
        document.getElementById("city").value = user.city || "";
        document.getElementById("address").value = user.address || "";

        document.getElementById("userName").innerText = user.name || "User";

        if (user.profileImage) {

            document.getElementById("profileImage").src = user.profileImage;

        }

    } catch (error) {

        console.log(error);

    }

}

/*==================================
Edit Button
==================================*/

document.getElementById("editBtn").addEventListener("click", () => {

    document.querySelectorAll("input, textarea").forEach(field => {

        field.removeAttribute("readonly");

        field.removeAttribute("disabled");

    });

});

/*==================================
Save Profile
==================================*/

document.getElementById("saveProfile").addEventListener("click", async () => {

    const body = {

        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        city: document.getElementById("city").value,
        address: document.getElementById("address").value

    };

    try {

        const response = await fetch(API_BASE_URL + "/profile", {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",
                "Authorization": "Bearer " + token

            },

            body: JSON.stringify(body)

        });

        if (response.ok) {

            alert("Profile Updated Successfully");

            loadProfile();

        } else {

            alert("Unable to update profile");

        }

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

});

/*==================================
Change Password
==================================*/

document.getElementById("changePasswordBtn").addEventListener("click", async () => {

    const currentPassword = document.getElementById("currentPassword").value;

    const newPassword = document.getElementById("newPassword").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {

        alert("Passwords do not match");

        return;

    }

    try {

        const response = await fetch(API_BASE_URL + "/change-password", {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",
                "Authorization": "Bearer " + token

            },

            body: JSON.stringify({

                currentPassword,
                newPassword

            })

        });

        if (response.ok) {

            alert("Password Changed Successfully");

            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";

        } else {

            alert("Current Password is incorrect");

        }

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

});

/*==================================
Profile Image Preview
==================================*/

document.getElementById("changePhoto").addEventListener("click", () => {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = "image/*";

    input.onchange = function () {

        const file = input.files[0];

        if (!file) {

            return;

        }

        const reader = new FileReader();

        reader.onload = function (event) {

            document.getElementById("profileImage").src = event.target.result;

        };

        reader.readAsDataURL(file);

    };

    input.click();

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

loadProfile();

console.log("Profile Loaded Successfully");