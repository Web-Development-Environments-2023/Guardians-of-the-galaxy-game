
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
    
    update() {
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
var lastShot = Date.now();
var gameStartTime;

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
var bulletSpeed = 5;

window.addEventListener("load", setupGame, false);

function main() {
	var now = Date.now();
	var delta = now - then;
    gameTimeLimit -= delta;
    gameTick(delta / 1000);

    if (gameTimeLimit <= 0) {
        endGame();
    }
	
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
        canvas.width / 2 - 50, // starting x
        canvas.height - 50, // starting y
        20, // object's width
        20, // object's height
        playerColor, // color
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

	// Check for keys pressed where key represents the keycode captured
	addEventListener("keydown", function (e) {keysDown[e.key] = true;}, false);

	addEventListener("keyup", function (e) {delete keysDown[e.key];}, false);

}

function newGame()
{
    console.log("newGame Started.");
    playerScore = 0;
	then = Date.now();
    gameStartTime = Date.now();
    // 1 ms execution time to make the canvas render fastest and cleanest
	intervalTimer = setInterval(main, 1); 
}

function gameTick(modifier) {
    //check if player holds down movment keys
	if (("ArrowUp" in keysDown) ) { 
		if(player.y>=canvas.height*0.6)
            player.update(0, -5)
	}
	if (('ArrowDown' in keysDown) ) { 
		if(player.y<=canvas.height - 50)
            player.update(0, 5)
	}
	if ('ArrowLeft' in keysDown) {
		if(player.x>=20)
            player.update(-5, 0)
	}
	if ('ArrowRight' in keysDown) { 
		if(player.x<=canvas.width - 50)
            player.update(5, 0)
	}
    
    if (enemyDirection == 1 && enemies.length > 0)
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

    shootingDelta = Date.now() - lastShot
    if (fireButton in keysDown && shootingDelta > 350) { // Player holding shoot
		player.shoot(0, -5)
        lastShot = Date.now()
	}

    // draw canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //draw player
    player.draw(ctx)
    // Draw enemies
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw(ctx);
        enemies[i].update(enemyDirection, 0);
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
function endGame()
{
   window.clearInterval( intervalTimer ); //???
}











