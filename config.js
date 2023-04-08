const startGameButton = document.getElementById("startGameButton")
const fireButtonInput = document.getElementById("fireButtonInput")
const timeLimit = document.getElementById("timeLimit")
var fireButton
var gameTimeLimit


// start a new game when user clicks Start Game button
startGameButton.addEventListener("click", function() {
    fireButton = fireButtonInput.value;
    gameTimeLimit = timeLimit
});
