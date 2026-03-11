/* =========================
   GLOBAL ADMIN SYSTEM
========================= */

const ADMIN_USER_KEY = "adminUsername";
const ADMIN_PASS_KEY = "adminPassword";

/* default login */
if(!localStorage.getItem(ADMIN_USER_KEY)){
  localStorage.setItem(ADMIN_USER_KEY,"admin");
}

if(!localStorage.getItem(ADMIN_PASS_KEY)){
  localStorage.setItem(ADMIN_PASS_KEY,"purple123");
}

/* OPEN LOGIN */
function openAdminLogin(){
  document.getElementById("adminLoginModal").style.display="block";
}

/* CLOSE LOGIN */
function closeAdminLogin(){
  document.getElementById("adminLoginModal").style.display="none";
}

/* LOGIN */
function loginAdmin(){

  const user =
    document.getElementById("adminUserInput").value;

  const pass =
    document.getElementById("adminPassInput").value;

  const savedUser =
    localStorage.getItem(ADMIN_USER_KEY);

  const savedPass =
    localStorage.getItem(ADMIN_PASS_KEY);

  if(user === savedUser && pass === savedPass){

    closeAdminLogin();

    if(typeof enableAdmin === "function"){
      enableAdmin();
    }

  }else{

    alert("Incorrect username or password");

  }

}

/* PASSWORD CHANGE */

function openChangePassword(){
  document.getElementById("changePasswordModal").style.display="block";
}

function closeChangePassword(){
  document.getElementById("changePasswordModal").style.display="none";
}

function updateAdminCredentials(){

  const newUser =
    document.getElementById("newUsername").value.trim();

  const currentPass =
    document.getElementById("currentPassword").value;

  const newPass =
    document.getElementById("newPassword").value;

  const confirmPass =
    document.getElementById("confirmPassword").value;

  const savedPass =
    localStorage.getItem(ADMIN_PASS_KEY);

  if(currentPass !== savedPass){
    alert("Current password incorrect");
    return;
  }

  if(newPass !== confirmPass){
    alert("New password and confirm password do not match");
    return;
  }

  if(newPass.length < 4){
    alert("Password must be at least 4 characters");
    return;
  }

  if(newUser !== ""){
    localStorage.setItem(ADMIN_USER_KEY,newUser);
  }

  if(newPass !== ""){
    localStorage.setItem(ADMIN_PASS_KEY,newPass);
  }

  alert("Admin credentials updated");

  closeChangePassword();
}