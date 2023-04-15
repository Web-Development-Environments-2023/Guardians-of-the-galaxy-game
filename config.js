const startGameButton = document.getElementById("startGameButton");
const fireButtonInput = document.getElementById("fireButtonInput");
const gameDiv = document.getElementById("gameDiv");
const timeLimit = document.getElementById("timeLimit");
var fireButton;


// start a new game when user clicks Start Game button
startGameButton.addEventListener("click", function() {
    fireButton = fireButtonInput.value;
    gameTimeLimit = timeLimit.value * 60 * 1000; // Minutes to miliseconds
    giveFocusToDiv(gameDiv);
});
