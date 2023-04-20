const configForm = document.getElementById('configForm');
const startGameButton = document.getElementById("startGameButton");
const fireButtonInput = document.getElementById("fireButtonInput");
const gameDiv = document.getElementById("gameDiv");
const timeLimit = document.getElementById("timeLimit");
var fireButton;


// start a new game when user clicks Start Game button
configForm.addEventListener("submit", function(event) {
    event.preventDefault();
    fireButton = fireButtonInput.value;
    gameTimeLimit = timeLimit.value * 60 * 1000; // Minutes to miliseconds
    giveFocusToDiv(gameDiv);
    newGame();
});
