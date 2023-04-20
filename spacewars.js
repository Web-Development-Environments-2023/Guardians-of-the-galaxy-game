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
                bulletColor, canvasHeight, imageSource) {
        super(x, y, width, height, color, speed);
        this.canvasHeight = canvasHeight;
        this.bulletWidth = 4;
        this.bulletHeight = 8;
        this.color = color;
        this.bulletColor = bulletColor;
        this.bullets = [];

        const image = new Image();
        image.src = imageSource;
        image.onload = () => {
            this.image = image;
            this.height = image.height * 0.1;
            this.width = image.width * 0.1;
        }
        
    }
    draw(ctx) {
        //super.draw(ctx);
        if (this.image)
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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
                bulletColor, canvasHeight, imageSource) {
        super(x, y, width, height, color, speed, bulletColor, canvasHeight, imageSource);
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

const backgroundColor = '#000000'
const ENEMY_BASE_SPEED = 3;
const ENEMY_BULLET_BASE_SPEED = [0.5,2];
const BASE_SPEED_INCREASES = 4;
const MIN_CANVAS_WIDTH = 1366;
const MIN_CANVAS_HEIGHT = 768;
const livesElement = document.getElementById("LivesText");
const countdown = document.createElement('div');

var canvas;
var ctx;
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
var timerForSpeedIncreases = 0;
var speedIncreased = false;
var animationLoop;
var remainingPlayerLives;
var endgameMessage;
var timeLeftInSeconds;
var spaceBetweenEnemies;

// Default Values - can be made modifiable in config. 
var numOfEnemyLines = 4;
var numOfEnemiesPerLine = 5;
var enemyColor = '#00FF00';
var playerColor = '#0099CC';
var playerBulletColor = '#FF0000';
var enemyBulletColor = '#FF0000';
var playerSpeed = 5;
var enemySpeed = 3;
var playerBulletSpeed = [0,-6];
var enemyBulletSpeed = [0.5,2];
var playerLives = 3;
var speedIncreases = 4;

// Score table intiallization
var scoreTable = document.createElement("table");
var headerRow = scoreTable.insertRow();
var headerCell1 = headerRow.insertCell();
var headerCell2 = headerRow.insertCell();
var headerCell3 = headerRow.insertCell();
headerCell1.innerHTML = "Score";
headerCell2.innerHTML = "Time Left";
headerCell3.innerHTML = "Enemies Left";


window.addEventListener("load", setupGame, false);
addEventListener("keydown", function (e) {keysDown[e.key] = true;}, false);
addEventListener("keyup", function (e) {delete keysDown[e.key];}, false);
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

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const canvasWidth = windowWidth - (0.1 * windowWidth);
    const canvasHeight = windowHeight - (0.1 * windowHeight);
    canvas.width = windowWidth;
    canvas.height = windowHeight;
    
	// Game objects
    playerStartingX = ((canvas.width / 2) - (canvasWidth * 0.05));
    playerStartingY = (canvas.height - (canvasHeight * 0.05));
	player = new Player(
                        playerStartingX,
                        playerStartingY,
                        20, // object's width - placeholder
                        20, // object's height - placeholder
                        playerColor, 
                        playerSpeed,
                        playerBulletColor,
                        canvas.height,
                        './Images/gurdianPlayer.png'
    );
    
    spaceBetweenEnemies = canvasHeight * 0.06;
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
                                        canvas.height,
                                        './Images/enemy.png'));
        }
    }
    // Add hearts as lives indication at the top of the canvas
    for (let i = livesElement.childElementCount ; i < playerLives; i++) {
        const heartImg = document.createElement("img");
        heartImg.src = "./Images/heart.png"; // replace with the path to your heart image
        heartImg.alt = "Heart";
        heartImg.style.height = "2vh";
        heartImg.style.width = "2vh";
        livesElement.appendChild(heartImg);
    }

	// Reset keysDown
	keysDown = {};

}
// Called when the game starts.
function newGame()
{
    playerScore = 0;
    currentTickTime = Date.now();
    lastTickTime = currentTickTime;
    gameStartTime = currentTickTime;
    lastShotTime = currentTickTime - 500;
    gameRemainingTime = gameTimeLimit;
    remainingPlayerLives = playerLives;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const canvasWidth = windowWidth - (0.1 * windowWidth);
    const canvasHeight = windowHeight - (0.1 * windowHeight);
    canvas.width = windowWidth;
    canvas.height = windowHeight;
    
    playerStartingX = ((canvas.width / 2) - (canvasWidth * 0.05));
    playerStartingY = (canvas.height - (canvasHeight * 0.05));
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    resetPlayerPosition();
    CountdownToStart();
}
function gameTick() {
    animationLoop = requestAnimationFrame(gameTick);
    var currentTickTime = Date.now();
	var timeDelta = currentTickTime - lastTickTime;
    gameRemainingTime -= timeDelta;
    timeLeftInSeconds = Math.floor(gameRemainingTime / 1000);
    $("#TimeText").text(timeLeftInSeconds);

    canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
    
    updatePlayerPosition();
    adjustEnemiesHeading();
    checkBulletsCollisions();
    handleEnemyFire(currentTickTime);

    // Handle increasing enemy speed
    timerForSpeedIncreases += (currentTickTime - lastTickTime);
    if (speedIncreases > 0 && timerForSpeedIncreases >= 5000) { // 5 seconds
        speedIncreased = true;
        timerForSpeedIncreases = 0;
        speedIncreases--;
        increaseEnemySpeed();
    }
    
    drawAllElements()

    if (gameRemainingTime <= 0) 
        endGame();

    lastTickTime = currentTickTime;
}
function playerHitEnemy(enemyIndex, bulletIndex) {
    destroyedEnemy = enemies[enemyIndex];
    enemyLineInFormation = (destroyedEnemy.y / spaceBetweenEnemies) + 2; // From the bottom.
    scoreToAdd = enemyLineInFormation * 5;
    playerScore += scoreToAdd;
    $('#ScoreText').text(playerScore);

    // Remove hit enemy and the bullet.
    enemies.splice(enemyIndex, 1);
    player.bullets.splice(bulletIndex, 1);
    if (enemies.length == 0)
        endGame();
    else { // Move shot bullets from the destroyed enemy to another enemy's bullet array
           // so it stays in the game and gets rendered.
        while (destroyedEnemy.bullets.length > 0) {
            enemies[0].bullets.push(destroyedEnemy.bullets[0]);
            destroyedEnemy.bullets.splice(0, 1);
        }
    }
}
function enemyHitPlayer(enemyIndex, bulletIndex) {
    enemy = enemies[enemyIndex];
    enemy.bullets.splice(bulletIndex, 1);
    resetPlayerPosition();
    lastEnemyBulletFired = undefined;
    remainingPlayerLives--;
    livesElement.removeChild(livesElement.lastChild);
    if (remainingPlayerLives == 0) {
        endGame();
    }
}
function handleEnemyFire(currentTickTime) {
    shootingTimeDelta = currentTickTime - lastShotTime
    if (fireButton in keysDown && shootingTimeDelta > 350) { // Player holding the fire button
		player.fire(playerBulletSpeed[0], playerBulletSpeed[1]);
        lastShotTime = currentTickTime;

	}
    if (typeof lastEnemyBulletFired !== 'undefined') {
        if (lastEnemyBulletFired.y >= canvas.height*0.6)
            enemyFire();
    }
    else
        enemyFire();
}
function enemyFire() {
    // Generate a random index number of enemy ship
    const rndShipIndex = Math.floor(Math.random() * enemies.length);
    const rndShip = enemies[rndShipIndex];
    rndShip.fire(randomXatPlayerDirection(rndShip.x), enemyBulletSpeed[1]);
    lastEnemyBulletFired = rndShip.bullets[rndShip.bullets.length - 1];
}
function resetPlayerPosition() {
    player.x = playerStartingX;
    player.y = playerStartingY;
    player.draw(ctx);
}
function endGame()
{
    addGameToScoreTable(playerScore, timeLeftInSeconds, enemies.length);
    
    if (playerLives == 0)
        endgameMessage = "You lost";  
    else if (enemies.length == 0)
        endgameMessage = "Champion!";  
    else if (timeLeftInSeconds <= 0 && playerScore < 100)
        endgameMessage = "You can do better";
    else if (timeLeftInSeconds <= 0 && playerScore >= 100)
        endgameMessage = "Winner!";
    else
        endgameMessage = "endGame";
    //cancelAnimationFrame(animationLoop);
    //window.clearInterval(intervalTimer); 
    resetGame();
}
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    // Calculate the canvas size based on the window size


    const canvasWidth = windowWidth - (0.1 * windowWidth);
    const canvasHeight = windowHeight - (0.1 * windowHeight);
  
    // Set the canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Update canvas size for objects
    playerStartingX = ((canvas.width / 2) - (canvasWidth * 0.05));
    playerStartingY = (canvas.height - (canvasHeight * 0.05));

    enemies.forEach(function (enemy, i) {
        enemy.canvasHeight = canvasHeight;
        enemy.height = canvasHeight * 0.05;
        enemy.width = canvasHeight * 0.05;
    });

    player.canvasHeight = canvasHeight;
    player.height = canvasHeight * 0.05;
    player.width = canvasHeight * 0.05;
    if (player.y + player.height > canvasHeight) 
        player.y = playerStartingY;
    if (player.x + player.width > canvasWidth)
        player.x = canvasWidth - 50;
}
function increaseEnemySpeed() {
    enemySpeed += 0.4;
    enemyBulletSpeed[0] += 0.4 // dx increase
    enemyBulletSpeed[1] += 0.4 // dy increase
}
function randomXatPlayerDirection(enemyX) {
    if (player.x >= enemyX)
        return enemyBulletSpeed[0] + Math.random();
    return ((enemyBulletSpeed[0] + Math.random()) * -1);
}
function adjustEnemiesHeading() {
    // Enemies heading right
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
            enemyDirection = -1; // Switch to moving left
        }          
    }
    // Enemies heading left
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
            enemyDirection = 1; // Switch to moving right
    }
}
function checkBulletsCollisions() {
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
                return false;
            }
        });
    });

}
function updatePlayerPosition() {
    // Check if player holds down movement keys and adjust position
    if (("ArrowUp" in keysDown) ) { 
        if(player.y >= canvas.height*0.6)
            player.update(0, -playerSpeed)
    }
    if (('ArrowDown' in keysDown) ) { 
        if(player.y <= (canvas.height - player.height))
            player.update(0, playerSpeed)
    }
    if ('ArrowLeft' in keysDown) {
        if(player.x >= 20)
            player.update(-playerSpeed, 0)
    }
    if ('ArrowRight' in keysDown) { 
        if(player.x <= (canvas.width - player.width))
            player.update(playerSpeed, 0)
    }
}
function resetGame(){
    cancelAnimationFrame(animationLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enemies.length = 0; // Remove all enemies
    lastEnemyBulletFired = undefined;
    speedIncreases = BASE_SPEED_INCREASES;
    enemySpeed = ENEMY_BASE_SPEED;
    enemyBulletSpeed = ENEMY_BULLET_BASE_SPEED;
    playerScore = 0;
    $('#ScoreText').text(playerScore);
    setupGame();
    setTimeout(() => {newGame();}, 2000);
    
}
function pauseGame(){
    cancelAnimationFrame(animationLoop);
}
function continueGame() {
    // If equals undefined the game was never started or 
    // paused so cannot be continued.
    if (animationLoop !== 'undefined')                        
        gameTick();
}
function addGameToScoreTable(score, timeLeftInSeconds, enemiesLeft) {
    var newRow = scoreTable.insertRow();
    var cell1 = newRow.insertCell();
    var cell2 = newRow.insertCell();
    var cell3 = newRow.insertCell();

    cell1.innerHTML = score;
    cell2.innerHTML = timeLeftInSeconds;
    cell3.innerHTML = enemiesLeft;
    // document.body.appendChild(scoreTable);
}
function emptyScoreTable() {
    while (scoreTable.hasChildNodes()) 
        scoreTable.removeChild(scoreTable.firstChild);
}
function CountdownToStart() {
    let count = 5;
    countdown.setAttribute('id', 'countdown');
    countdown.style.position = 'absolute';
    countdown.style.top = canvas.offsetTop + canvas.height/2 - 50 + 'px';
    countdown.style.left = canvas.offsetLeft + canvas.width/2 - 50 + 'px';
    countdown.style.width = '100px';
    countdown.style.height = '100px';
    countdown.style.backgroundColor = 'black';
    countdown.style.color = 'white';
    countdown.style.display = 'flex';
    countdown.style.fontSize = '15vh';
    countdown.style.alignItems = 'center';
    countdown.style.justifyContent = 'center';
    document.body.appendChild(countdown);
    drawAllElements();
    const countdownInterval = setInterval(() => {
        countdown.innerText = count;
        count--;
        if (count < 0) {
            clearInterval(countdownInterval);
            countdown.remove();
            gameTick()
        }
    }, 1000);
}
function drawAllElements(){
    // Draw elements
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx)
    $.each(enemies, function(i, enemy) {
        enemy.update(enemyDirection * enemySpeed, 0);
        enemy.draw(ctx);
    });
}