
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

updateStatsAllGames();
updateStatsBeginner();
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