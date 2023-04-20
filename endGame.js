// Score table intiallization
var scoreTable = document.createElement("table");
var headerRow = scoreTable.insertRow();
var headerCell1 = headerRow.insertCell();
var headerCell2 = headerRow.insertCell();
var headerCell3 = headerRow.insertCell();
headerCell1.innerHTML = "Score";
headerCell2.innerHTML = "Time Left";
headerCell3.innerHTML = "Enemies Left";