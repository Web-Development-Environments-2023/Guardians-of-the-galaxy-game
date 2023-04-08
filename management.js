const managementDiv = document.getElementById("managementDiv");

const loginButton = document.getElementById("loginButton");
const loginDiv = document.getElementById("loginDiv");

const registerButton = document.getElementById("registerButton");
const registerDiv = document.getElementById("registerDiv");

function giveFocusToDiv(divToFocus) {
  appDivs = ["loginDiv", "registerDiv", "managementDiv"] //ADD MORE DIVS WHEN THEY ARE ADDED TO THE APP!!
  for(let i=0; i<appDivs.length; i++) {
      document.getElementById(appDivs[i]).style.display = "none"
  }
  divToFocus.style.display = "block"
}

loginButton.addEventListener("click", function() {giveFocusToDiv(loginDiv)}, false);

registerButton.addEventListener("click", function() {giveFocusToDiv(registerDiv)}, false);

// window.addEventListener("load", setupGame, false);

// // called when the app first launches
// function setupGame()
// {
//   // Get the canvas
//   canvas = document.getElementById("gameCanvas");
//   ctx = canvas.getContext("2d");

//   //sound
//   //obj = document.getElementById( "targetSound" );
//   // Background image
//   //bgImage = new Image();
//   //bgImage.src = "images/background.png";
//   // Hero image
//   //heroImage = new Image();
//   //heroImage.src = "images/hero.png";
//   // Monster image
//   //monsterImage = new Image();
//   //monsterImage.src = "images/monster.png";
//   // Game objects


//   //hero = {speed: 256 }; // movement in pixels per second

//   // Handle keyboard controls
//   keysDown = {};
// }

  // Check for keys pressed where key represents the keycode



// var canvas;
// const loginButton = document.getElementById("loginButton");
// const loginDiv = document.getElementById("loginDiv");


// window.addEventListener("load", setupGame, false);

// // called when the app first launches
// function setupGame()
// {
	
// 	// Get the canvas
// 	canvas = document.getElementById("theCanvas");
// 	ctx = canvas.getContext("2d");
// 	 // start a new game when user clicks Start Game button
// 	 loginButton.addEventListener("click", function() {
// 		loginDiv.style.display = "block";
// 	  });

//   	//sound
// 	//obj = document.getElementById( "targetSound" );
// 	// Background image
// 	//bgImage = new Image();
// 	//bgImage.src = "images/background.png";
// 	// Hero image
// 	//heroImage = new Image();
// 	//heroImage.src = "images/hero.png";
// 	// Monster image
// 	//monsterImage = new Image();
// 	//monsterImage.src = "images/monster.png";
// 	// Game objects


// 	//hero = {speed: 256 }; // movement in pixels per second

// 	// Handle keyboard controls
// 	keysDown = {};

// 	// Check for keys pressed where key represents the keycode captured
// 	addEventListener("keydown", function (e) {keysDown[e.keyCode] = true;}, false);
// 	addEventListener("keyup", function (e) {delete keysDown[e.keyCode];}, false);

// }