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

//Users dictionary
const users = {
  defaultUser: {
    username: "defaultUser",
    password: "password"
  }
};

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
// loginSubmit.addEventListener("click", function() {console.log("hi hi")});


function loginUser(username, password) {
  if (users[username] && users[username].password === password) {
    console.log("Login successful.");
    giveFocusToDiv(configDiv);
  } else {
    console.log("Invalid username or password.");
    alert("Invalid username or password. Please try again.");
    loginUsername.value = "";
    loginPassword.value = "";
  }
  sleep(2000);
}

//Register page methods
registerBackButton.addEventListener("click", function() {giveFocusToDiv(mainDiv)}, false);

function registerUser(username, password) {
  if (users[username]) {
    console.log("User already exists.");
  } else {
    users[username] = {
      username: username,
      password: password
    };
    console.log("User registered successfully.");
  }
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}