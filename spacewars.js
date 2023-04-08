
class GameObject {
    constructor(x, y, height, width, color) {
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.color = color
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    collidesWith(obj) {
        return (this.x < obj.x + obj.width
                && this.x + this.width > obj.x
                && this.y < obj.y + obj.height 
                && this.y + this.height > obj.y);
    }
}
class Bullet extends GameObject {
    constructor(x, y, width, height, color, dx, dy) {
        super(x, y, width, height, color);

        this.dx = dx;
        this.dy = dy;
    }
}

class SpaceShip extends GameObject {
    constructor(x, y, width, height, color, canvasHeight) {
        super(x, y, width, height, color);
        // Set canvas height.
        this.canvasHeight = canvasHeight;
        // Set the spaceship's bullet size.
        this.bulletWidth = 4;
        this.bulletHeight = 8;
        // Set the spaceship's bullet color.
        this.bulletColor = "#FF0000";
        // Bullets fired by the spaceship
        this.bullets = [];
    }

    // Override the draw method to also draw the spaceship's bullets.
    draw(ctx) {
        super.draw(ctx);
        // Draw the spaceship's bullets.
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(ctx);
            this.bullets[i].update(0, 0);

            // Check if the bullet is out of bounds.
            if (this.bullets[i].y < 0 || this.bullets[i].y > this.canvasHeight) {
                // Remove the bullet from the array.
                this.bullets.splice(i, 1);
            }
        }
    }
    
    // A method used to fire bullets from a spaceship
    shoot(dx,dy) {
        this.bullets.push(new Bullet(
            this.x + this.width / 2 - this.bulletWidth / 2,
            this.y - this.bulletHeight,
            this.bulletWidth,
            this.bulletHeight,
            this.bulletColor,
            dx,
            dy
      ));
    }
}
class Player extends SpaceShip {
    constructor(x, y, width, height, color, canvasHeight, canvasWidth) {
        super(x, y, width, height, color, canvasHeight);
        this.canvasWidth = canvasWidth;
    }

    // Update the player's position
    update(dx, dy) {
        super.update(dx, dy);

        // Keep the player within the canvas TODO ADD MAX HEIGHT
        if (this.x < 0) {
            this.x = 0;
        } 
        else if (this.x + this.width > this.canvasWidth) {
            this.x = this.canvasWidth - this.width;
        }
        else if (this.y < 0)
            this.y = 0;
        else if (this.y > this.canvasHeight) { //TODO MAX HEIGHT FOR THE PLAYER
            this.y = this.canvasHeight;
        }
    }
}

var canvas;
var ctx;
const spaceBetweenEnemies = 30;
const backgroundColor = '#000000'
var enemies = [];
var player;
var keysDown = {};
var intervalTimer;
var timeLeft;	
var enemyDirection = 1;
var enemyStep = 5;
window.addEventListener("load", setupGame, false);


function main() {
	var now = Date.now();
	var delta = now - then;
	
	update(delta / 1000);
	draw();	
	
	then = now;
}

function setupGame()
{
	console.log("setupGame strated.");
	// Get the canvas
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
    document.getElementById("startGameButton").addEventListener("click", newGame, false );

	// Game objects
	player = new Player(
        canvas.width / 2 - 50,
        canvas.height - 50,
        20,
        20,
        '#0099CC',
        canvas.height,
        canvas.width
    )
    
    for (var i = 0; i < 4; i++) { //num of lines of enemies
            for (var j = 0; j < 5; j++) { //num of enemies per line
                enemies.push(new SpaceShip(
                    spaceBetweenEnemies + j * spaceBetweenEnemies,
                    spaceBetweenEnemies + i * spaceBetweenEnemies,
                    20,
                    20,
                    '#00FF00'
            ));
            }
    }
	// Handle keyboard controls
	keysDown = {};

	// Check for keys pressed where key represents the keycode captured
	addEventListener("keydown", function (e) {keysDown[e.keyCode] = true;}, false);

	addEventListener("keyup", function (e) {delete keysDown[e.keyCode];}, false);

}

function newGame()
{
    console.log("newGame Started.");
	then = Date.now();
	intervalTimer = setInterval(main, 1); // Execute as fast as possible
}


function update(modifier) {
    //check if player moves
	if ((38 in keysDown) ) { // Player holding up
		if(player.y>=20)
            player.update(0, -5)
		    //player.y -= player.speed * modifier;
	}
	if ((40 in keysDown) ) { // Player holding down
		if(player.y<=440)
            player.update(0, 5)
		    //player.y += player.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		if(player.x>=20)
            player.update(-5, 0)
		    //player.x -= player.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		if(player.x<=492)
            player.update(5, 0)
		    //player.x += player.speed * modifier;	
	}

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw player
    player.draw(ctx)
    
    // Draw enemies
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw(ctx);
        enemies[i].update(enemyDirection, 0);
    }
    if (enemyDirection == 1)
        {
          // Find the enemy closest to the right side of the screen
          var closestToRightSideEnemy = enemies[0];
          for (var i = 1; i < enemies.length; i++) {
            if (enemies[i].x > closestToRightSideEnemy.x) {
              closestToRightSideEnemy = enemies[i];
            }
          }

          // Check if the enemy closest to the right side of 
          // the screen has reached the right side of the screen.
          if (closestToRightSideEnemy.x + 
              closestToRightSideEnemy.width > canvas.width) {
            // Reverse the direction of the enemies.
            enemyDirection = -1;            
            // Move the enemies down.
            for (var i = 0; i < enemies.length; i++) {
              enemies[i].update(0, enemyStep);
            }
          }          
        }
        else if (enemyDirection == -1)
        {
          // Find the enemy closest to the left side of the screen
          var closestToLeftSideEnemy = enemies[0];
          for (var i = 1; i < enemies.length; i++) {
            if (enemies[i].x < closestToLeftSideEnemy.x) {
              closestToLeftSideEnemy = enemies[i];
            }
          }

          // Check if the enemy closest to the left side of 
          // the screen has reached the left side of the screen.
          if (closestToLeftSideEnemy.x < 0) {
            // Reverse the direction of the enemies.
            enemyDirection = 1;
            // Move the enemies down.
            for (var i = 0; i < enemies.length; i++) {
              enemies[i].update(0, enemyStep);
            }
          }
        }

	

	--timeLeft;
	 // if the timer reached zero
    if (timeLeft <= 0)
    {
        stopTimer();
        //TODO things that happen when time is up
    } 
}

function stopTimer()
{
   window.clearInterval( intervalTimer ); //???
}











