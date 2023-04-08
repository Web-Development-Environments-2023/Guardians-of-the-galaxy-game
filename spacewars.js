

function main() {
	var now = Date.now();
	var delta = now - then;
	
	updatePositions(delta / 1000);
	draw();	
	
	then = now;
};

function setupGame()
{
	
	// Get the canvas
	canvas = document.getElementById("theCanvas");
	ctx = canvas.getContext("2d");

	
	 // start a new game when user clicks Start Game button
	document.getElementById("startButton").addEventListener("click", newGame, false );

  	//sound
	obj = document.getElementById( "targetSound" );
	// Background image

	bgImage = new Image();
	bgImage.src = "images/background.png";
	
	
	// Hero image
	
	heroImage = new Image();
	heroImage.src = "images/hero.png";

	// Monster image

	monsterImage = new Image();
	monsterImage.src = "images/monster.png";



	// Game objects
	hero = {speed: 256 }; // movement in pixels per second
	monster = {};
	monstersCaught = 0;

	// Handle keyboard controls
	keysDown = {};

	// Check for keys pressed where key represents the keycode captured
	addEventListener("keydown", function (e) {keysDown[e.keyCode] = true;}, false);

	addEventListener("keyup", function (e) {delete keysDown[e.keyCode];}, false);

 for (var i = 0; i < howManyCircles; i++) 
  circles.push([Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 100, Math.random() / 2]);

}

function newGame()
{
	reset();
	then = Date.now();
	intervalTimer = setInterval(main, 1); // Execute as fast as possible
}

// Reset the player and monster positions when player catches a monster
function reset() {
	// Reset player's position to centre of canvas
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

function updatePositions(modifier) {
	if ((38 in keysDown) ) { // Player holding up
		if(hero.y>=20)
		hero.y -= hero.speed * modifier;
	}
	if ((40 in keysDown) ) { // Player holding down
		if(hero.y<=440)
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		if(hero.x>=20)
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		if(hero.x<=492)
		hero.x += hero.speed * modifier;	
	}


  // Check if player and monster collider
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		obj.play();//play music
		reset();
	}

	--timeLeft;
	 // if the timer reached zero
   if (timeLeft <= 0)
   {
      stopTimer();
      //TODO things that happen when time is up
   } 
};

function stopTimer()
{
   window.clearInterval( intervalTimer ); //???
} 











