const API_URL = "http://localhost:8080/api/auth";

const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
    if(passwordInput.type==="password"){
        passwordInput.type="text";
        togglePassword.innerHTML='<i class="fa-solid fa-eye-slash"></i>';
    }else{
        passwordInput.type="password";
        togglePassword.innerHTML='<i class="fa-solid fa-eye"></i>';
    }
});

loginForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const email=document.getElementById("email").value.trim();
    const password=document.getElementById("password").value.trim();

    if(email===""||password===""){
        alert("Please fill all fields.");
        return;
    }

    try{
        const response=await fetch(API_URL+"/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        });

        if(response.ok){
            const data=await response.json();
            localStorage.setItem("token",data.token);
            localStorage.setItem("user",JSON.stringify(data));
            alert("Login Successful");

            if (data.role === "ADMIN") {
                window.location.href = "admin-dashboard.html";
            } else if (data.role === "DRIVER") {
                window.location.href = "driver-dashboard.html";
            } else {
                window.location.href = "dashboard.html";
            }
        }else{
            const error=await response.json();
            alert(error.message || "Login failed");
        }
    }
    catch(err){
        alert("Unable to connect to server.");
        console.log(err);
    }
});
