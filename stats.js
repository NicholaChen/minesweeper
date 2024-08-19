
function updateStatsAllGames() {
    document.getElementById("wins").innerText = wins;
    document.getElementById("hoursPlayed").innerText = (hours / (1000 * 60 * 60)).toFixed(2);
    document.getElementById("gamesPlayed").innerText = gamesPlayed;
    
    winPercentage = wins/gamesPlayed;
    
    if (winPercentage == Infinity || isNaN(winPercentage)) winPercentage = 0;
    document.getElementById("winPercentage").innerText = (winPercentage * 100).toFixed(1) + "%";
    
    localStorage.setItem("wins", wins);
    localStorage.setItem("hours", hours);
    localStorage.setItem("gamesPlayed", gamesPlayed);
}

function updateStatsBeginner() {
    document.getElementById("beginnerWins").innerText = beginnerWins;
    document.getElementById("beginnerGamesPlayed").innerText = beginnerGamesPlayed;
	
	beginnerWinPercentage = beginnerWins / beginnerGamesPlayed;

	if (beginnerWinPercentage == Infinity || isNaN(beginnerWinPercentage)) beginnerWinPercentage = 0;
	document.getElementById("beginnerWinPercentage").innerText = (beginnerWinPercentage * 100).toFixed(1) + "%";
	
	if (beginnerAverageTime / 1000 < 60) {
		document.getElementById("beginnerAverageTime").innerText = timeToText(beginnerAverageTime / 1000);
	} else {
		document.getElementById("beginnerAverageTime").innerText = (beginnerAverageTime / 1000).toFixed(1) + "s" + " (" + timeToText(beginnerAverageTime / 1000) + ")";
	}
	
	
    localStorage.setItem("beginnerWins", beginnerWins);
	localStorage.setItem("beginnerGamesPlayed", beginnerGamesPlayed);
	localStorage.setItem("beginnerAverageTime", beginnerAverageTime);
}

function updateStatsIntermediate() {
	document.getElementById("intermediateWins").innerText = intermediateWins;
	document.getElementById("intermediateGamesPlayed").innerText = intermediateGamesPlayed;

	intermediateWinPercentage = intermediateWins / intermediateGamesPlayed;

	if (intermediateWinPercentage == Infinity || isNaN(intermediateWinPercentage)) intermediateWinPercentage = 0;
	document.getElementById("intermediateWinPercentage").innerText = (intermediateWinPercentage * 100).toFixed(1) + "%";

	if (intermediateAverageTime / 1000 < 60) {
		document.getElementById("intermediateAverageTime").innerText = timeToText(intermediateAverageTime / 1000);
	} else {
		document.getElementById("intermediateAverageTime").innerText = (intermediateAverageTime / 1000).toFixed(1) + "s" + " (" + timeToText(intermediateAverageTime / 1000) + ")";
	}


	localStorage.setItem("intermediateWins", intermediateWins);
	localStorage.setItem("intermediateGamesPlayed", intermediateGamesPlayed);
	localStorage.setItem("intermediateAverageTime", intermediateAverageTime);
}

function updateStatsExpert() {
	document.getElementById("expertWins").innerText = expertWins;
	document.getElementById("expertGamesPlayed").innerText = expertGamesPlayed;

	expertWinPercentage = expertWins / expertGamesPlayed;

	if (expertWinPercentage == Infinity || isNaN(expertWinPercentage)) expertWinPercentage = 0;
	document.getElementById("expertWinPercentage").innerText = (expertWinPercentage * 100).toFixed(1) + "%";

	if (expertAverageTime / 1000 < 60) {
		document.getElementById("expertAverageTime").innerText = timeToText(expertAverageTime / 1000);
	} else {
		document.getElementById("expertAverageTime").innerText = (expertAverageTime / 1000).toFixed(1) + "s" + " (" + timeToText(expertAverageTime / 1000) + ")";
	}


	localStorage.setItem("expertWins", expertWins);
	localStorage.setItem("expertGamesPlayed", expertGamesPlayed);
	localStorage.setItem("expertAverageTime", expertAverageTime);
}

updateStatsAllGames();
updateStatsBeginner();
updateStatsIntermediate();
updateStatsExpert();

document.getElementById("resetStatsButton").addEventListener("click", (e) => {
    wins = 0;
    hours = 0;
    gamesPlayed = 0;
    
    beginnerWins = 0;
    beginnerGamesPlayed = 0;
    beginnerAverageTime = 0;
    
    updateStatsAllGames();
    updateStatsBeginner();
})