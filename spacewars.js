var canvas;
const loginDiv = document.getElementById("loginDiv");


window.addEventListener("load", setupGame, false);

// called when the app first launches
function setupGame()
{
	
	// Get the canvas
	canvas = document.getElementById("theCanvas");
	ctx = canvas.getContext("2d");
	 // start a new game when user clicks Start Game button
	document.getElementById("loginButton").addEventListener("click", function() {
        if (loginDiv.style.display === "none") {
            loginDiv.style.display = "block";
          } 
        else {
            loginDiv.style.display = "none";
          }

    });

  	//sound
	//obj = document.getElementById( "targetSound" );
	// Background image
	//bgImage = new Image();
	//bgImage.src = "images/background.png";
	// Hero image
	//heroImage = new Image();
	//heroImage.src = "images/hero.png";
	// Monster image
	//monsterImage = new Image();
	//monsterImage.src = "images/monster.png";
	// Game objects


	//hero = {speed: 256 }; // movement in pixels per second

	// Handle keyboard controls
	keysDown = {};

	// Check for keys pressed where key represents the keycode captured
	addEventListener("keydown", function (e) {keysDown[e.keyCode] = true;}, false);
	addEventListener("keyup", function (e) {delete keysDown[e.keyCode];}, false);

}