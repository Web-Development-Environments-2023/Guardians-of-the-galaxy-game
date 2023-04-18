
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
    fire(dx,dy) {
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
                bulletColor, canvasHeight) {
        super(x, y, width, height, color, speed, bulletColor, canvasHeight);
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
var gameTimeLimit;
var playerStartingX;
var playerStartingY;
var lastEnemyBulletFired;
var speedIncreases = 4;
var timerForSpeedIncreases = 0;
var speedIncreased = false;
const MIN_CANVAS_WIDTH = 1366;
const MIN_CANVAS_HEIGHT = 768;

// Default Values - can be made modifiable in config. 
var numOfEnemyLines = 4;
var numOfEnemiesPerLine = 5;
var spaceBetweenEnemies = 50;
var enemyColor = '#00FF00';
var playerColor = '#0099CC';
var playerBulletColor = '#FF0000';
var enemyBulletColor = '#FF0000';
var playerSpeed = 4;
var enemySpeed = 1;
var playerBulletSpeed = [0,-4];
var enemyBulletSpeed = [0.5,2];
var playerLives = 3;

window.addEventListener("load", setupGame, false);

// Main game loop - called every x ms - defined by the intervalTimer.
function main() {
	var currentTickTime = Date.now();
	var timeDelta = currentTickTime - lastTickTime;
    gameRemainingTime -= timeDelta;
    gameTick(currentTickTime, lastTickTime);
    if (gameRemainingTime <= 0) {
        endGame();
    }
        
	lastTickTime = currentTickTime;
}

// Setup function before the game starts.
function setupGame() {
	// Get the canvas
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
    $("#startGameButton").on("click", newGame);
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
                        canvas.height
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
    playerScore = 0;
    currentTickTime = Date.now();
    lastTickTime = currentTickTime;
    gameStartTime = currentTickTime;
    lastShotTime = currentTickTime - 500;
    gameRemainingTime = gameTimeLimit
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    // 1 ms execution time to make the canvas render fastest and cleanest
	intervalTimer = setInterval(main, 1); 
}

function gameTick(currentTickTime, lastTickTime) {
    canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
    currentTickTime = Date.now();
    // Check if player holds down movement keys and adjust position
	if (("ArrowUp" in keysDown) ) { 
		if(player.y >= canvas.height*0.6)
            player.update(0, -playerSpeed)
	}
	if (('ArrowDown' in keysDown) ) { 
		if(player.y <= canvas.height - 50)
            player.update(0, playerSpeed)
	}
	if ('ArrowLeft' in keysDown) {
		if(player.x >= 20)
            player.update(-playerSpeed, 0)
	}
	if ('ArrowRight' in keysDown) { 
		if(player.x <= canvas.width - 50)
            player.update(playerSpeed, 0)
	}
    
    if (enemyDirection == 1 && enemies.length > 0)
    {
        // Find enemy spaceship farthest to the right of the screen.
        var closestToRightSideEnemy = enemies[0];
        $.each(enemies, function(i, enemy) {
            if (enemy.x > closestToRightSideEnemy.x) {
                closestToRightSideEnemy = enemy;
            }
        });

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
        $.each(enemies, function(i, enemy) {
            if (enemy.x < closestToLeftSideEnemy.x) {
                closestToLeftSideEnemy = enemy;
            }
        });

        // check if found ship is out of canvas bounds.
        if (closestToLeftSideEnemy.x < 0) 
            enemyDirection = 1;
    }
    // Check if player bullet collides with enemy
    player.bullets.forEach(function(bullet, i) {
        $(enemies).each(function(j, enemy) {
            if (enemy.collidesWith(bullet)) {
                playerHitEnemy(j, i);
                return false; 
            }
        });
    });
    // Check if enemy bullet collides with the player
    $.each(enemies, function(j, enemy) {
        $.each(enemy.bullets, function(i, bullet) {
            if (player.collidesWith(bullet)) {
                enemyHitPlayer(j, i);
                return false; // equivalent to break
            }
        });
    });

    shootingTimeDelta = currentTickTime - lastShotTime
    if (fireButton in keysDown && shootingTimeDelta > 350) { // Player holding the fire button
		player.fire(playerBulletSpeed[0], playerBulletSpeed[1]);
        lastShotTime = currentTickTime;

	}
    if (typeof lastEnemyBulletFired !== 'undefined') {
        if (lastEnemyBulletFired.y >= canvas.height*0.6){
            enemyFire();
        }
    }
    else
        enemyFire();


    timerForSpeedIncreases += (currentTickTime - lastTickTime);
    if (speedIncreases > 0 && timerForSpeedIncreases >= 5000) { // 5 seconds
        speedIncreased = true;
        timerForSpeedIncreases = 0;
        speedIncreases--;
        increaseEnemySpeed();
    }
    // Draw elements
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx)

    $.each(enemies, function(i, enemy) {
        enemy.update(enemyDirection * enemySpeed, 0);
        enemy.draw(ctx);
    });
}
function playerHitEnemy(enemyIndex, bulletIndex) {
    destroyedEnemy = enemies[enemyIndex];
    enemyLineInFormation = (destroyedEnemy.y / spaceBetweenEnemies) + 2; // From the bottom.
    scoreToAdd = enemyLineInFormation * 5;
    playerScore += scoreToAdd;

    // Remove hit enemy and the bullet.
    enemies.splice(enemyIndex, 1);
    player.bullets.splice(bulletIndex, 1);
    if (enemies.length == 0)
        endGame();
    else { // Move shot bullets from the destroyed enemy to another enemy's bullet array
           // so it stays in the game and get rendered.
        while (destroyedEnemy.bullets.length > 0) {
            enemies[0].bullets.push(destroyedEnemy.bullets[0]);
            destroyedEnemy.bullets.splice(0, 1);
        }
    }
}
function enemyHitPlayer(enemyIndex,bulletIndex) {
    enemy = enemies[enemyIndex];
    enemy.bullets.splice(bulletIndex, 1);
    resetPlayerPosition();

    playerLives--;
    if (playerLives == 0) {
        endGame();
    }
}
function enemyFire() {
    // Generate a random index number of enemy ship
    const rndShipIndex = Math.floor(Math.random() * enemies.length);
    const rndShip = enemies[rndShipIndex];
    // rndShip.fire(enemyBulletSpeed[0], enemyBulletSpeed[1]);
    rndShip.fire(randomXatPlayerDirection(rndShip.x), enemyBulletSpeed[1]);
    lastEnemyBulletFired = rndShip.bullets[rndShip.bullets.length - 1];
}
function resetPlayerPosition() {
    player.x = playerStartingX;
    player.y = playerStartingY;
}
function endGame()
{
    window.clearInterval(intervalTimer); 
}
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    // Calculate the canvas size based on the window size
    const canvasWidth = Math.max(windowWidth - (0.1 * windowWidth), MIN_CANVAS_WIDTH);
    const canvasHeight = Math.max(windowHeight- (0.1 * windowHeight), MIN_CANVAS_HEIGHT);
  
    // Set the canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Update canvas size for objects
    playerStartingY = canvas.height - 50;
    playerStartingX = canvas.width / 2 - 50;

    enemies.forEach(function (enemy, i) {
        enemy.canvasHeight = canvasHeight;
    });
    player.canvasHeight = canvasHeight;
    if (player.y > canvasHeight)
        player.y = playerStartingY;
}
function increaseEnemySpeed() {
    enemySpeed += 0.5;
    enemyBulletSpeed[0] += 0.5 // dx increase
    enemyBulletSpeed[1] += 0.5 // dy increase
}
function randomXatPlayerDirection(enemyX) {
    if (player.x >= enemyX)
        return enemyBulletSpeed[0] + Math.random();
    return ((enemyBulletSpeed[0] + Math.random()) * -1);
}