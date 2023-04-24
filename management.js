//Main page 
const logoDiv = document.getElementById("game_logo");
const homeButton = document.getElementById("homeButton");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const configDiv = document.getElementById("configDiv");
const welcome_login_button = document.getElementById("welcome_login_button");
const welcome_register_button = document.getElementById("welcome_register_button");
const footer = document.getElementById("footer");

homeButton.addEventListener("click", function() {
  restartSettings()
  if (isGameOn()){
    pauseGame(); 
    last_div_clicked = logoDiv; 
    giveFocusToDiv(end_game_pop_up)
  }else{
    loginUsername.value = ""
    loginPassword.value = ""
    loginButton.textContent = "Login";
    last_div_clicked = logoDiv;
    giveFocusToDiv(logoDiv)}
  }, false);

loginButton.addEventListener("click", function() {
  loginUsername.value = ""
  loginPassword.value = ""
  restartSettings()

  if (isGameOn()){
    pauseGame(); 
    last_div_clicked = loginDiv; 
    giveFocusToDiv(end_game_pop_up)
  }else{
    loginButton.textContent = "Login";
    last_div_clicked = loginDiv;
    giveFocusToDiv(loginDiv)
  }
}, false);

welcome_login_button.addEventListener("click", function() {
  loginUsername.value = ""
  loginPassword.value = ""
  loginButton.textContent = "Login";
  last_div_clicked = loginDiv;
  giveFocusToDiv(loginDiv)
}, false);

registerButton.addEventListener("click", function() {
  restartSettings()
  if (isGameOn()){
    pauseGame(); 
    last_div_clicked = registerDiv; 
    giveFocusToDiv(end_game_pop_up)
  }else{
    loginUsername.value = "";
    loginPassword.value = "";
    loginButton.textContent = "Login";
    last_div_clicked = registerDiv;
    giveFocusToDiv(registerDiv)
  } 
}, false);

welcome_register_button.addEventListener("click", function() {last_div_clicked = registerDiv;; giveFocusToDiv(registerDiv)}, false);


//Login page 
const loginDiv = document.getElementById("loginDiv");
const login_form = document.getElementById("login_form");
var loginUsername = document.getElementById("loginUsername");
var loginPassword = document.getElementById("loginPassword");
const login_pop_up = document.getElementById("login_pop_up");
const login_pop_up_continue_button = document.getElementById("login_pop_up_continue_button");

login_form.addEventListener("submit", function() {loginUser(loginUsername.value, loginPassword.value)})
login_pop_up_continue_button.addEventListener("click", function() {giveFocusToDiv(configDiv)})

function loginUser(username, password) {
  if (users[username] && users[username] === password) {
    console.log("Login successful.");
    var config_h1 = document.querySelector('#configDiv h1'); // Select the h1 element
    config_h1.innerHTML = 'Welcome ' + username + "! <br>Setup the game and start playing.";
    loginButton.textContent = "Log out";
    giveFocusToDiv(login_pop_up);
  } else {
    console.log("Invalid username or password.");
    alert("Invalid username or password. Please try again.");
    loginUsername.value = "";
    loginPassword.value = "";
  }
}


//Register page
const registerDiv = document.getElementById("registerDiv");
const register_form = document.getElementById("register_form");
var registerUsername = document.getElementById("registerUsername");
var registerPassword = document.getElementById("registerPassword");
var registerRepeatPassword = document.getElementById("repeat-password");
const register_pop_up = document.getElementById("register_pop_up");
const register_pop_up_continue_button = document.getElementById("register_pop_up_continue_button");

register_form.addEventListener("submit", function() {registerUser(registerUsername.value, registerPassword.value, registerRepeatPassword.value)})
register_pop_up_continue_button.addEventListener("click", function() {giveFocusToDiv(loginDiv)})

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
    var pop_up_h1 = document.querySelector('#register_pop_up h1'); // Select the h1 element
    pop_up_h1.textContent = 'Hello ' + username + "! Welcome to Guardians of the Galaxy game!";
    giveFocusToDiv(register_pop_up)
  }
}


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
  last_div_clicked = aboutButton;
  about_us_popup.style.display="block"
  // giveFocusToDiv(about_us_popup)
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

//End Game
const end_game_pop_up = document.getElementById('end_game_pop_up');
const end_game_pop_up_continue_button = document.getElementById('end_game_pop_up_continue_button');
const end_game_pop_up_cancel_button = document.getElementById('end_game_pop_up_cancel_button');

const restart_game_button = document.getElementById('restart_game_button');

restart_game_button.addEventListener("click", function() {restartGame(); giveFocusToDiv(gameDiv)}, false);

const endGameDiv = document.getElementById("endGameDiv")
const restartBtn = document.getElementById("restartBtn")
const changeConfigBtn = document.getElementById("changeConfigBtn")
const exitBtn = document.getElementById("exitBtn")

restartBtn.addEventListener("click", function() {restartGame(); giveFocusToDiv(gameDiv)}, false);
changeConfigBtn.addEventListener("click", function() {pauseGame(); giveFocusToDiv(configDiv)}, false);
exitBtn.addEventListener("click", function() {
  pauseGame(); 
  loginUsername.value = ""
  loginPassword.value = ""
  loginButton.textContent = "Login";
  restartSettings()
  giveFocusToDiv(logoDiv)
}, false);

var last_div_clicked;

end_game_pop_up_continue_button.addEventListener('click', function() {
  if (last_div_clicked === about_us_popup){
    pauseGame()
    last_div_clicked = about_us_popup;
    giveFocusToDiv(about_us_popup)
  }
  else{
    loginUsername.value = ""
    loginPassword.value = ""
    loginButton.textContent = "Login";
    
  }
  giveFocusToDiv(last_div_clicked)
  
})

end_game_pop_up_cancel_button.addEventListener('click', function() {giveFocusToDiv(gameDiv); continueGame()})

//Audio
var game_audio = document.getElementById("game_audio")

function playEnemyDeadSound(){
  var enemy_dead_audio = document.getElementById("enemy_dead_audio")
  enemy_dead_audio.pause(); // Stop the audio
  enemy_dead_audio.loop = false; // Disable looping
  enemy_dead_audio.currentTime = 0; // Reset the audio to the beginning
  enemy_dead_audio.play(); // Play the audio
}

function playPlayerDeadSound(){
  var player_dead_audio = document.getElementById("player_dead_audio")
  player_dead_audio.pause(); // Stop the audio
  player_dead_audio.loop = false; // Disable looping
  player_dead_audio.currentTime = 0; // Reset the audio to the beginning
  player_dead_audio.play(); // Play the audio
}

function playAudio(volume) {
  game_audio.play(); // Play the audio
  game_audio.volume = volume;
}

function pauseAudio() {
  game_audio.pause(); // Pause the audio
}

function stopAudio() {
  game_audio.pause(); // Pause the audio
  game_audio.currentTime = 0; // Reset the audio to the beginning
}


//Divs
var appDivs = [logoDiv, loginDiv, registerDiv, configDiv, gameDiv, welcome_login_button, about_us_popup,
  welcome_register_button, footer, endGameDiv, login_pop_up, register_pop_up, end_game_pop_up] //ADD MORE DIVS WHEN THEY ARE ADDED TO THE APP!!

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
  // if (divToFocus === about_us_popup){
  //   last_div_clicked.style.display="block"
  // }
  
  divToFocus.style.display="block"
}

function isGameOn(){
  return gameDiv.style.display === 'block'
}

//Users dictionary
var users = {"s" : "s"};


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
