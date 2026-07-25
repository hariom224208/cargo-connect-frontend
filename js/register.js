const API_URL="http://localhost:8080/api/auth";

const registerForm=document.getElementById("registerForm");

registerForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const name=document.getElementById("name").value.trim();

    const email=document.getElementById("email").value.trim();

    const phone=document.getElementById("phone").value.trim();

    const password=document.getElementById("password").value.trim();

    const role=document.getElementById("role").value;

    if(name===""||email===""||phone===""||password===""){

        alert("Please fill all fields.");

        return;

    }

    if(password.length<6){

        alert("Password should contain at least 6 characters.");

        return;

    }

    const requestBody={

        name:name,

        email:email,

        phone:phone,

        password:password,

        role:role

    };

    try{

        const response=await fetch(API_URL+"/register",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(requestBody)

        });

        if(response.ok){

            alert("Registration Successful");

            window.location.href="login.html";

        }

        else{

            const error=await response.text();

            alert(error);

        }

    }

    catch(error){

        console.log(error);

        alert("Server not responding.");

    }

});