const configForm = document.getElementById('configForm');
var fireButtonInput;
const gameDiv = document.getElementById("gameDiv");
var timeLimit;
var fireButton;


// start a new game when user clicks Start Game button
configForm.addEventListener("submit", function(event) {
    event.preventDefault();
    fireButtonInput = document.getElementById("fireButtonInput");
    timeLimit = document.getElementById("timeLimit");
    fireButton = fireButtonInput.value;
    gameTimeLimit = timeLimit.value * 60 * 1000; // Minutes to miliseconds
    if (player !== undefined) // If player was  assigned the game started before and should restart
        restartGame();
    else { // Game never started before so do first time setup. 
        setupGame();
        setTimeout(() => {newGame();}, 1000);
    }
    giveFocusToDiv(gameDiv);

    // newGame();
});

function restartSettings(){
    var fireButtonLabel = document.getElementById('fireButtonInput');
    var timeLimitLabel = document.getElementById('timeLimit');
    var playerLabel = document.getElementById('selectText');
    var playerLabel_level = document.getElementById('selectText_level');

    fireButtonLabel.value = "s";
    timeLimitLabel.value = "5";
    playerLabel.innerText = "Select Your Player";
    playerLabel_level.innerText = "Game Level";
}