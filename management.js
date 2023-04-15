//Main page attributes
const mainDiv = document.getElementById("mainDiv");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const configDiv = document.getElementById("configDiv");

//Login page attributes
const loginDiv = document.getElementById("loginDiv");
const loginBackButton = document.getElementById("backFromLoginButton");
var loginUsername = document.getElementById("loginUsername");
var loginPassword = document.getElementById("loginPassword");
const loginSubmit = document.getElementById("loginSubmit");

//Register page attributes
const registerDiv = document.getElementById("registerDiv");
const registerBackButton = document.getElementById("backFromRegisterButton");
var registerUsername = document.getElementById("registerUsername");
var registerPassword = document.getElementById("registerPassword");
var registerRepeatPassword = document.getElementById("repeat-password");
const registerSubmit = document.getElementById("registerSubmit");


//Users dictionary
var users = {"s" : "s"};

function giveFocusToDiv(divToFocus) {
  appDivs = ["loginDiv", "registerDiv", "mainDiv", "configDiv"] //ADD MORE DIVS WHEN THEY ARE ADDED TO THE APP!!
  for(let i=0; i<appDivs.length; i++) {
      document.getElementById(appDivs[i]).style.display = "none"
  }
  divToFocus.style.display="block"
}

//Main page methods
loginButton.addEventListener("click", function() {giveFocusToDiv(loginDiv)}, false);
registerButton.addEventListener("click", function() {giveFocusToDiv(registerDiv)}, false);

//Login page methods
loginBackButton.addEventListener("click", function() {giveFocusToDiv(mainDiv)}, false);
loginSubmit.addEventListener("click", function() {loginUser(loginUsername.value, loginPassword.value)})

function loginUser(username, password) {
  if (users[username] && users[username] === password) {
    console.log("Login successful.");
    giveFocusToDiv(configDiv);
  } else {
    console.log("Invalid username or password.");
    alert("Invalid username or password. Please try again.");
    loginUsername.value = "";
    loginPassword.value = "";
  }
}

//Register page methods
registerBackButton.addEventListener("click", function() {giveFocusToDiv(mainDiv)}, false);
registerSubmit.addEventListener("click", function() {registerUser(registerUsername.value, registerPassword.value, registerRepeatPassword.value)})

function registerUser(username, password, repeat) {
  if (users[username]) {
    console.log("User already exists.");
    alert("User already exists. Please try again.");
    registerUsername.value = ""
    registerPassword.value = ""
    registerRepeatPassword.value = ""
  } else if (password != repeat){
    console.log("Password is incorrect.")
    alert("Password is incorrect. Please try again.");
    registerUsername.value = ""
    registerPassword.value = ""
    registerRepeatPassword.value = ""
  }
  else{
    users[username] = password
    console.log("User registered successfully.");
    for (const key of Object.keys(users)) {
      console.log(key + ":" + users[key])
    }
    giveFocusToDiv(mainDiv)
  }
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}