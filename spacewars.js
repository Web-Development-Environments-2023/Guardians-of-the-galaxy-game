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
                bulletColor, bulletRadius, canvasHeight, imageSource) {
        super(x, y, height, width, color, speed);
        this.canvasHeight = canvasHeight;
        this.bulletWidth = '8';
        this.bulletHeight = '20';
        this.color = color;
        this.bulletColor = bulletColor;
        this.bulletRadius = bulletRadius;

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
            enemySpeed, // BUGGGGGGGGGGGG````````````````````````````````````````````````````````````````````````````````````````
            dx,
            dy,
            this.bulletRadius,
            1
      ));
    }
}
class Player extends SpaceShip {
    constructor(x, y, width, height, color, speed,
                bulletColor, bulletRadius, canvasHeight, imageSource) {
        super(x, y, width, height, color, speed, bulletColor, bulletRadius, canvasHeight, imageSource);
    }
    fire(dx,dy) {
        this.bullets.push(new RoundBullet(
            this.x + this.width / 2 - this.bulletWidth / 2,
            this.y - this.bulletHeight,
            this.bulletColor,
            enemySpeed, // BUGGGGGGGGGGGG````````````````````````````````````````````````````````````````````````````````````````
            dx,
            dy,
            this.bulletRadius,
            1
      ));
    }
}
class Bullet extends GameObject {
    constructor(x, y, width, height, color, speed, dx, dy, radius, opacity) {
        super(x, y, height, width, color, speed);
        // Set the bullet's x and y directions.
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.opacity = opacity;
    }
    
    update(dx, dy) {
        this.x += this.dx;
        this.y += this.dy; 
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
class RoundBullet extends GameObject {
    constructor(x, y, color, speed, dx, dy, radius, opacity) {
        super(x, y, radius, radius, color, speed);
        // Set the bullet's x and y directions.
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.opacity = opacity;
    }
    
    update(dx, dy) {
        this.x += this.dx;
        this.y += this.dy; 
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath;
        ctx.restore();
    }
}

const backgroundColor = '#000000'
const ENEMY_BASE_SPEED = 3;
const ENEMY_BULLET_BASE_SPEED = [0.5,2];
const BASE_SPEED_INCREASES = 4;
const MIN_CANVAS_WIDTH = 1366;
const MIN_CANVAS_HEIGHT = 768;
const PLAYER_FIRE_DELAY = 350;
const livesElement = document.getElementById("LivesText");
const countdown = document.createElement('div');

var canvas;
var ctx;
var enemies = [];
var backgroundStars = [];
var player;
var keysDown = {};
var intervalTimer;
var playerScore;
var enemyDirection = 1;
var lastShotTime;
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
var spaceBetweenEnemies_x;
var spaceBetweenEnemies_y;


// Default Values - can be made modifiable in config. 
var numOfEnemyLines = 4;
var numOfEnemiesPerLine = 5;
var enemyColor = '#00FF00';
var playerColor = '#0099CC';
var playerBulletColor = '#00FF00';
var enemyBulletColor = '#FF0000';
var playerSpeed = 5;
var playerBulletSpeed = [0,-6];
var playerLives = 3;
var speedIncreases = 4;
var bulletRadius = 5;
var enemySpeed;
var enemyBulletSpeed;

const game_level_dict = {"Easy" : setEasyValues(),
                        "Normal" : setNormalValues(),
                        "Hard" : setHardValues()};

                                        
function setEasyValues(){
    enemySpeed = 2;
    enemyBulletSpeed = [0.3,1.2];
}
function setNormalValues(){
    enemySpeed = 5;
    enemyBulletSpeed = [0.6,2];
}
function setHardValues(){
    enemySpeed = 7;
    enemyBulletSpeed = [0.9,3];
}



// Score table intiallization
var scores = document.getElementById("scores")
var scoreTable = document.createElement("table");
var headerRow = scoreTable.insertRow();
var headerCell1 = headerRow.insertCell();
var headerCell2 = headerRow.insertCell();
var headerCell3 = headerRow.insertCell();
var headerCell4 = headerRow.insertCell();
headerCell1.innerHTML = "Date";
headerCell2.innerHTML = "Score";
headerCell3.innerHTML = "Time Elapsed";
headerCell4.innerHTML = "Enemies Left";
styleTable(scoreTable);

//const backgroundImage = new Image();
//backgroundImage.src = 'https://images.pling.com/img/00/00/63/00/40/1662284/747f5fe2a9f88f827009192082476067f10bfe1cf8dc59f69896fdde527647228d94.jpg';

enemyImagesDict = {0:"./Images/enemy4.png",1:"./Images/enemy3.png",
                   2:"./Images/enemy2.png",3:"./Images/enemy1.png" };

playerImagesDict = {"Star Lord":"Images/player1.png",
                    "Rocket Raccoon":"Images/player2.png",
                    "Groot":"Images/player3.png"}

// window.addEventListener("load", setupGame, false);
addEventListener("keydown", function (e) {keysDown[e.key] = true;}, false);
addEventListener("keyup", function (e) {delete keysDown[e.key];}, false);

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

    console.log(selectText.textContent.trim());
    console.log(playerImagesDict[selectText.textContent.trim()]);

	player = new Player(
                        playerStartingX,
                        playerStartingY,
                        20, // object's width - placeholder
                        20, // object's height - placeholder
                        playerColor, 
                        playerSpeed,
                        playerBulletColor,
                        bulletRadius,
                        canvas.height,
                        playerImagesDict[selectText.textContent.trim()]
    );
    
    spaceBetweenEnemies_y = canvasHeight * 0.1;
    spaceBetweenEnemies_x = canvasHeight * 0.3;
    // Create enemy objects with spacing between them.
    for (var i = 0; i < numOfEnemyLines; i++) { 
        for (var j = 0; j < numOfEnemiesPerLine; j++) { 
            enemies.push(new SpaceShip(
                                        spaceBetweenEnemies_x + j * spaceBetweenEnemies_x,
                                        spaceBetweenEnemies_y + i * spaceBetweenEnemies_y,
                                        20,
                                        20,
                                        enemyColor,
                                        enemySpeed,
                                        enemyBulletColor,
                                        bulletRadius,
                                        canvas.height,
                                        enemyImagesDict[i]));
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


    for(let i = 0; i < 200; i++) {
        backgroundStars.push(new RoundBullet(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            '#ffffff',
            enemySpeed,
            0,
            Math.random() * 2,
            Math.random() * 4,
            0.5
      ));
    }

	// Reset keysDown
	keysDown = {};

}
// Called when the game starts.
function newGame()
{
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
    gameRemainingTime = gameTimeLimit;
    timeLeftInSeconds = Math.floor(gameTimeLimit / 1000);
    $("#TimeText").text(timeLeftInSeconds);
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
    handleShipsShooting(currentTickTime);

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
    console.log("enemy dead sound")
    playEnemyDeadSound()
    destroyedEnemy = enemies[enemyIndex];
    enemyLineInFormation = (destroyedEnemy.y / spaceBetweenEnemies_y) + 2; // From the bottom.
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
    console.log("player dead sound")
    playPlayerDeadSound()
    enemy = enemies[enemyIndex];
    enemy.bullets.splice(bulletIndex, 1);
    stopAudio(player_dead_audio)
    resetPlayerPosition();

    // update the lastEnemyBulletFired incase there is more than one enemy bullet in game.
    var farthestBullet = undefined;
    $.each(enemies, function(j, enemy) {
        $.each(enemy.bullets, function(i, bullet) {
            if (farthestBullet === undefined) 
                farthestBullet = bullet;
            else if (farthestBullet.y < bullet.y)
                farthestBullet = bullet;
        });
    });

    lastEnemyBulletFired = farthestBullet;
    remainingPlayerLives--;
    livesElement.removeChild(livesElement.lastChild);
    if (remainingPlayerLives == 0) {
        endGame();
    }
}
function handleShipsShooting(currentTickTime) {
    shootingTimeDelta = currentTickTime - lastShotTime
    if (fireButton in keysDown && shootingTimeDelta > PLAYER_FIRE_DELAY) { // Player holding the fire button
		player.fire(playerBulletSpeed[0], playerBulletSpeed[1]);
        lastShotTime = currentTickTime;

	}
    if (typeof lastEnemyBulletFired !== 'undefined') {
        if (lastEnemyBulletFired.y >= canvas.height*0.6) {
            enemyFire();
        }    
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
    pauseGame();
    stopAudio(game_audio)
    timeElapsed = gameTimeLimit - gameRemainingTime;
    addGameToScoreTable(playerScore, Math.floor(timeElapsed / 1000), enemies.length);
    
    if (playerLives == 0)
        endgameMessage = "You lost";  
    else if (enemies.length == 0)
        endgameMessage = "Champion!";  
    else if (timeLeftInSeconds <= 0 && playerScore < 100)
        endgameMessage = "You can do better";
    else if (timeLeftInSeconds <= 0 && playerScore >= 100)
        endgameMessage = "Winner!";
    else
        endgameMessage = "End Game";

    var h1_div_message = document.querySelector('#endGameDiv h1');
    h1_div_message.textContent = endgameMessage;

    giveFocusToDiv(endGameDiv)
}
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    // Calculate the canvas size based on the window size
    const canvasWidth = windowWidth - (0.1 * windowWidth);
    const canvasHeight = windowHeight - (0.1 * windowHeight);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Adjust player's starting position for the new canvas size
    playerStartingX = ((canvas.width / 2) - (canvasWidth * 0.05));
    playerStartingY = (canvas.height - (canvasHeight * 0.05));

    // Adjust enemy size
    enemies.forEach(function (enemy, i) {
        enemy.canvasHeight = canvasHeight;
        enemy.height = canvasHeight * 0.05;
        enemy.width = canvasHeight * 0.05;
    });

    // Adjust player size
    player.canvasHeight = canvasHeight;
    player.height = canvasHeight * 0.05;
    player.width = canvasHeight * 0.05;
    
    // Check if player is now out of canvas
    if (player.y + player.height > canvasHeight) 
        player.y = playerStartingY;
    if (player.x + player.width > canvasWidth)
        player.x = canvasWidth - 50;
    
    drawAllElements();
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
function restartGame(){
    pauseGame();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enemies.length = 0; // Remove all enemies
    lastEnemyBulletFired = undefined;
    speedIncreases = BASE_SPEED_INCREASES;
    timerForSpeedIncreases = 0;
    // enemySpeed = ENEMY_BASE_SPEED;
    // enemyBulletSpeed = [ENEMY_BULLET_BASE_SPEED[0],ENEMY_BULLET_BASE_SPEED[1]]; 
    playerScore = 0;
    $('#ScoreText').text(playerScore);
    setupGame();
    setTimeout(() => {newGame();}, 1000); // Gives the game a second to load all assets   
}
function pauseGame(){
    cancelAnimationFrame(animationLoop);
    pauseAudio(game_audio)
}
function continueGame() {
    // If equals undefined the game was never started or 
    // paused so cannot be continued.
    if (animationLoop !== 'undefined')                        
        CountdownForContinueGame();
}
function addGameToScoreTable(score, timeElapsed, enemiesLeft) {
    var newRow = scoreTable.insertRow();
    var cell1 = newRow.insertCell();
    var cell2 = newRow.insertCell();
    var cell3 = newRow.insertCell();
    var cell4 = newRow.insertCell();

        // Get the current date
    var currentDate = new Date();

    // Extract various components of the date
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Month starts from 0, so add 1 to get the actual month
    var day = currentDate.getDate();

    cell1.innerHTML = day + "-" + month + "-" + year;
    cell2.innerHTML = score;
    cell3.innerHTML = timeElapsed;
    cell4.innerHTML = enemiesLeft;

    scores.appendChild(scoreTable);
}
function emptyScoreTable() {
    while (scoreTable.hasChildNodes()) 
        scoreTable.removeChild(scoreTable.firstChild);
}
function CountdownToStart() {
    stopAudio()
    playAudio(0.3)
    let count = 5;
    countdown.setAttribute('id', 'countdown');
    countdown.style.position = 'absolute';
    countdown.style.top = canvas.offsetTop + canvas.height/2 - 50 + 'px';
    countdown.style.left = canvas.offsetLeft + canvas.width/2 - 50 + 'px';
    countdown.style.width = '100px';
    countdown.style.height = '100px';
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
            countdown.innerText = "5"
            clearInterval(countdownInterval);
            countdown.remove();
            playerScore = 0;
            currentTickTime = Date.now();
            lastTickTime = currentTickTime;
            lastShotTime = currentTickTime - 500;
            remainingPlayerLives = playerLives;
            gameTick();
        }
    }, 1000);
}
function CountdownForContinueGame(){
    playAudio(0.3)
    let count = 5;
    countdown.setAttribute('id', 'countdown');
    countdown.style.position = 'absolute';
    countdown.style.top = canvas.offsetTop + canvas.height/2 - 50 + 'px';
    countdown.style.left = canvas.offsetLeft + canvas.width/2 - 50 + 'px';
    countdown.style.width = '100px';
    countdown.style.height = '100px';
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
            countdown.innerText = "5"
            clearInterval(countdownInterval);
            countdown.remove();
            currentTickTime = Date.now();
            lastShotTime = currentTickTime - (PLAYER_FIRE_DELAY / 2); // Player can fire again in half fire cycle time
            lastTickTime = currentTickTime;
            gameTick();
        }
    }, 1000);
}
function drawAllElements(){
    //const pattern = ctx.createPattern(backgroundImage, 'repeat');
    //ctx.fillStyle = pattern;
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    $.each(backgroundStars, function(i, star) {
        star.draw(ctx);
        star.update();
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }    
    });
    
    player.draw(ctx)

    $.each(enemies, function(i, enemy) {
        enemy.update(enemyDirection * enemySpeed, 0);
        enemy.draw(ctx);
    });
    
}
function styleTable(table){
    table.style.fontSize = "2vh";
    table.style.fontWeight = "bold";
    table.style.color = "white";
    table.style.alignItems = "center";
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

  // Add additional styles to table cells (header and body)
  var cells = table.getElementsByTagName("td");
  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i];
    cell.style.padding = "2vh"; // Add padding for spacing
    cell.style.border = "0.3vh solid white"; // Add border for lines between columns
    cell.style.textAlign = "center"; // Center align text in cells
    cell.style.verticalAlign = "middle"
    cell.style.alignItems = "center";
    cell.style.borderCollapse = "collapse";
  }

  // Add additional styles to table headers
  var headers = table.getElementsByTagName("th");
  for (var i = 0; i < headers.length; i++) {
    var header = headers[i];
    header.style.padding = "2vh"; // Add padding for spacing
    header.style.border = "0.3vh solid white"; // Add border for lines between columns
    header.style.textAlign = "center"; // Center align text in headers
    header.style.verticalAlign = "middle";
    header.style.backgroundColor = "black"; // Add background color for headers
  }
}