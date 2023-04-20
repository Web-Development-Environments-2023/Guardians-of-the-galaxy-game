//Main page attributes
const logoDiv = document.getElementById("game_logo");
const homeButton = document.getElementById("homeButton");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const configDiv = document.getElementById("configDiv");
const welcome_login_button = document.getElementById("welcome_login_button");
const welcome_register_button = document.getElementById("welcome_register_button");
const footer = document.getElementById("footer");

//Login page attributes
const loginDiv = document.getElementById("loginDiv");
var loginUsername = document.getElementById("loginUsername");
var loginPassword = document.getElementById("loginPassword");
const loginSubmit = document.getElementById("loginSubmit");

//Register page attributes
const registerDiv = document.getElementById("registerDiv");
var registerUsername = document.getElementById("registerUsername");
var registerPassword = document.getElementById("registerPassword");
var registerRepeatPassword = document.getElementById("repeat-password");
const registerSubmit = document.getElementById("registerSubmit");

//About
const aboutButton = document.getElementById('aboutButton');
const about_us_popup = document.getElementById('aboutDiv');
const closeButton = document.getElementById('closeButton');

window.addEventListener("click", function(event) {
  // Close the pop-up dialog when clicking outside of it
  if (about_us_popup.style.display === 'block' && event.target !== aboutDiv && event.target !== aboutButton && !about_us_popup.contains(event.target)){
    about_us_popup.style.display = "none";  
  }
  });

// Show the popup when the "About us" button is clicked
aboutButton.addEventListener('click', function() {
  about_us_popup.style.display = 'block';
});

// Hide the popup when the close button is clicked
closeButton.addEventListener('click', function() {
  about_us_popup.style.display = 'none';
});



window.addEventListener("keydown", function(event) {
  // Close the pop-up dialog when pressing the Escape key
  if (event.key === "Escape") {
    about_us_popup.style.display = "none";
  }
});

//Divs
var appDivs = [logoDiv, loginDiv, registerDiv, configDiv, gameDiv, welcome_login_button, welcome_register_button, footer, endGameDiv] //ADD MORE DIVS WHEN THEY ARE ADDED TO THE APP!!

//Users dictionary
var users = {"s" : "s"};

function giveFocusToDiv(divToFocus) {
  for(let i=0; i<appDivs.length; i++) {
    appDivs[i].style.display = "none"
  }
  if (divToFocus === logoDiv){
    welcome_register_button.style.display="block"
    welcome_login_button.style.display="block"
  }
  if (divToFocus != gameDiv){
    footer.style.display="block"
  }
  
  divToFocus.style.display="block"
}

//Main page methods
homeButton.addEventListener("click", function() {giveFocusToDiv(logoDiv)}, false);
loginButton.addEventListener("click", function() {giveFocusToDiv(loginDiv)}, false);
welcome_login_button.addEventListener("click", function() {giveFocusToDiv(loginDiv)}, false);
registerButton.addEventListener("click", function() {giveFocusToDiv(registerDiv)}, false);
welcome_register_button.addEventListener("click", function() {giveFocusToDiv(registerDiv)}, false);

//Login page methods
loginSubmit.addEventListener("click", function() {loginUser(loginUsername.value, loginPassword.value)})

function loginUser(username, password) {
  if (users[username] && users[username] === password) {
    console.log("Login successful.");
    alert("Nice to see you " + username + "! Configure the game settings and start playing.");
    giveFocusToDiv(configDiv);
  } else {
    console.log("Invalid username or password.");
    alert("Invalid username or password. Please try again.");
    loginUsername.value = "";
    loginPassword.value = "";
  }
}

//Register page methods
registerSubmit.addEventListener("click", function() {registerUser(registerUsername.value, registerPassword.value, registerRepeatPassword.value)})

function registerUser(username, password, repeat) {
  console.log("hi hi")
  if (users[username]) {
    console.log("User already exists.");
    alert("User already exists. Please try again.");
    registerUsername.value = ""
    registerPassword.value = ""
    registerRepeatPassword.value = ""
  } else if (password != repeat){
    console.log("Password is incorrect.")
    alert("Password is incorrect. Please try again.");
    registerPassword.value = ""
    registerRepeatPassword.value = ""
  }
  else{
    users[username] = password
    console.log("User registered successfully.");
    alert("Hi " + username + "! Welcome to space invaders game. Please login to start playing.");
    for (const key of Object.keys(users)) {
      console.log(key + ":" + users[key])
    }
    giveFocusToDiv(loginDiv)
  }
}


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
