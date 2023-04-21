const configForm = document.getElementById('configForm');
const startGameButton = document.getElementById("startGameButton");
const scoresButton = document.getElementById("scoresButton");
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
    // setupGame();
    // setTimeout(() => {newGame();}, 2000);
    resetGame();
    giveFocusToDiv(gameDiv);

    // newGame();
});

scoresButton.addEventListener("click", function() {giveFocusToDiv(endGameDiv)})
