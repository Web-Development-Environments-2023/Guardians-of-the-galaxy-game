
class GameObject {
    constructor(x, y, height, width, color, speed) {
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.color = color
        this.speed = speed
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

class SpaceShip extends GameObject {
    constructor(x, y, width, height, color, speed,
                bulletColor, canvasHeight) {
        super(x, y, width, height, color, speed);
        this.canvasHeight = canvasHeight;
        this.bulletWidth = 4;
        this.bulletHeight = 8;
        this.color = color;
        this.bulletColor = bulletColor;
        this.bullets = [];
    }

    draw(ctx) {
        super.draw(ctx);
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(ctx);
            this.bullets[i].update();

            if (this.bullets[i].y < 0 || 
                            this.bullets[i].y > this.canvasHeight) {
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
            enemySpeed,
            dx,
            dy
      ));
    }
}
class Player extends SpaceShip {
    constructor(x, y, width, height, color, speed,
                bulletColor, canvasHeight, canvasWidth) {
        super(x, y, width, height, color, speed, bulletColor, canvasHeight);
        this.canvasWidth = canvasWidth;
    }
}
class Bullet extends GameObject {
    constructor(x, y, width, height, color, speed, dx, dy) {
      super(x, y, width, height, color, speed);
      // Set the bullet's x and y directions.
      this.dx = dx;
      this.dy = dy;
    }
    
    update(dx, dy) {
        this.x += this.dx;
        this.y += this.dy; 
    }
  }

var canvas;
var ctx;
const backgroundColor = '#000000'
var enemies = [];
var player;
var keysDown = {};
var intervalTimer;
var playerScore;
var enemyDirection = 1;
var lastShotTime;
var gameStartTime;
var gameRemainingTime;
var currentTickTime;
var lastTickTime;
var gameTimeLimit
var playerStartingX;
var playerStartingY;
var lastEnemyBulletFired;
var nextBulletSpeedIncrease;

// Defult Values - can be made modifiable in config. 
var numOfEnemyLines = 4;
var numOfEnemiesPerLine = 5;
var spaceBetweenEnemies = 50;
var enemyColor = '#00FF00';
var playerColor = '#0099CC';
var playerBulletColor = '#FF0000';
var enemyBulletColor = '#FF0000';
var playerSpeed = 5;
var enemySpeed = 5;
var playerBulletSpeed = [0,-5];
var enemyBulletSpeed = [0,2];
var playerLives = 3;

window.addEventListener("load", setupGame, false);

// Main game loop - called every x ms - defined by the intervalTimer.
function main() {
	var currentTickTime = Date.now();
	var timeDelta = currentTickTime - lastTickTime;
    gameRemainingTime -= timeDelta;
    gameTick();
    if (gameRemainingTime <= 0) {
        endGame();
    }
        
	lastTickTime = currentTickTime;
}

// Setup function before the game starts.
function setupGame()
{
	console.log("setupGame started.");
	// Get the canvas
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
    document.getElementById("startGameButton").addEventListener("click", newGame, false );
	// Game objects
    playerStartingX = canvas.width / 2 - 50;
    playerStartingY = canvas.height - 50;
	player = new Player(
        playerStartingX,
        playerStartingY,
        20, // object's width
        20, // object's height
        playerColor, 
        playerSpeed,
        playerBulletColor,
        canvas.height,
        canvas.width
    )
    
    // Create enemy objects with spacing between them.
    for (var i = 0; i < numOfEnemyLines; i++) { 
            for (var j = 0; j < numOfEnemiesPerLine; j++) { 
                enemies.push(new SpaceShip(
                    spaceBetweenEnemies + j * spaceBetweenEnemies,
                    spaceBetweenEnemies + i * spaceBetweenEnemies,
                    20,
                    20,
                    enemyColor,
                    enemySpeed,
                    enemyBulletColor,
                    canvas.height
            ));
            }
    }

	// Handle keyboard controls
	keysDown = {};
	addEventListener("keydown", function (e) {keysDown[e.key] = true;}, false);
	addEventListener("keyup", function (e) {delete keysDown[e.key];}, false);

}

// Called when the game starts.
function newGame()
{
    console.log("newGame started.");
    playerScore = 0;
    currentTickTime = Date.now();
    lastTickTime = currentTickTime;
    gameStartTime = currentTickTime;
    lastShotTime = currentTickTime - 500;
    gameRemainingTime = gameTimeLimit
    // 1 ms execution time to make the canvas render fastest and cleanest
	intervalTimer = setInterval(main, 1); 
}

function gameTick() {
    currentTickTime = Date.now();
    // Check if player holds down movement keys and adjust position
	if (("ArrowUp" in keysDown) ) { 
		if(player.y >= canvas.height*0.6)
            player.update(0, -5)
	}
	if (('ArrowDown' in keysDown) ) { 
		if(player.y <= canvas.height - 50)
            player.update(0, 5)
	}
	if ('ArrowLeft' in keysDown) {
		if(player.x >= 20)
            player.update(-5, 0)
	}
	if ('ArrowRight' in keysDown) { 
		if(player.x <= canvas.width - 50)
            player.update(5, 0)
	}
    
    if (enemyDirection == 1 && enemies.length > 0)
    {
        // Find enemy spaceship farthest to the right of the screen.
        var closestToRightSideEnemy = enemies[0];
        for (var i = 1; i < enemies.length; i++) {
            if (enemies[i].x > closestToRightSideEnemy.x) {
                closestToRightSideEnemy = enemies[i];
            }
        }

        // check if found ship is out of canvas bounds.
        if (closestToRightSideEnemy.x + 
                            closestToRightSideEnemy.width > canvas.width) {
            enemyDirection = -1;            
        }          
    }
    else if (enemyDirection == -1 && enemies.length > 0)
    {
        // Find enemy spaceship farthest to the left of the screen.
        var closestToLeftSideEnemy = enemies[0];
        for (var i = 1; i < enemies.length; i++) {
            if (enemies[i].x < closestToLeftSideEnemy.x) {
                closestToLeftSideEnemy = enemies[i];
            }
        }

        // check if found ship is out of canvas bounds.
        if (closestToLeftSideEnemy.x < 0) 
            enemyDirection = 1;
    }
    // Check if player bullet collides with enemy
    for (var i = 0; i < player.bullets.length; i++) {
        for (var j = 0; j < enemies.length; j++) {
            if (enemies[j].collidesWith(player.bullets[i])) {
                playerHitEnemy(j,i);
                break;
            }
        }
    }
    // Check if enemy bullet collides with the player
    for (var j = 0; j < enemies.length; j++) {
        for (var i = 0; i < enemies[j].bullets.length; i++) {
            if (player.collidesWith(enemies[j].bullets[i])) {
                enemyHitPlayer(j,i);
                break;
            }
        }
    }

    shootingTimeDelta = currentTickTime - lastShotTime
    if (fireButton in keysDown && shootingTimeDelta > 350) { // Player holding shoot
		player.shoot(playerBulletSpeed[0], playerBulletSpeed[1]);
        lastShotTime = currentTickTime;

	}
    if (typeof lastEnemyBulletFired !== 'undefined') {
        if (lastEnemyBulletFired.y >= canvas.height*0.6){
            enemyFire();
        }
    }
    else
        enemyFire();

    // Draw elements
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx)
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update(enemyDirection, 0);
        enemies[i].draw(ctx);
    }
}
function playerHitEnemy(enemyIndex,bulletIndex) {
    enemy = enemies[enemyIndex];
    enemyLineInFormation = (enemy.y / spaceBetweenEnemies) + 2; // From the bottom.
    scoreToAdd = enemyLineInFormation * 5;
    playerScore += scoreToAdd;

    // Remove hit enemy and the bullet.
    enemies.splice(enemyIndex, 1);
    player.bullets.splice(bulletIndex, 1);
    if (enemies.length == 0)
        endGame();
}
function enemyHitPlayer(enemyIndex,bulletIndex) {
    enemy = enemies[enemyIndex];
    enemy.bullets.splice(bulletIndex, 1);
    resetPlayerPosition();

    playerLives--;
    if (playerLives == 0) {
        console.log("player lost");
        endGame();
    }
}

function enemyFire() {
    // Generate a random index number of enemy ship
    rndShip = Math.floor(Math.random() * enemies.length);
    enemies[rndShip].shoot(enemyBulletSpeed[0],enemyBulletSpeed[1]);
    lastEnemyBulletFired = enemies[rndShip].bullets[enemies[rndShip].bullets.length - 1];
}
function resetPlayerPosition() {
    player.x = playerStartingX;
    player.y = playerStartingY;
}

function endGame()
{
    console.log("endgane triggered.");
    window.clearInterval( intervalTimer ); 
}











