
function getStats() {
	wins = isNaN(Number(localStorage.getItem("wins"))) || Number(localStorage.getItem("wins")) < 0 ? 0 : Number(localStorage.getItem("wins"));

	bestWinStreak = isNaN(Number(localStorage.getItem("bestWinStreak"))) || Number(localStorage.getItem("bestWinStreak")) < 0 ? 0 : Number(localStorage.getItem("bestWinStreak"));
	currentWinStreak = isNaN(Number(localStorage.getItem("currentWinStreak"))) || Number(localStorage.getItem("currentWinStreak")) < 0 ? 0 : Number(localStorage.getItem("currentWinStreak"));

	hours = isNaN(Number(localStorage.getItem("hours"))) || Number(localStorage.getItem("hours")) < 0 ? 0 : Number(localStorage.getItem("hours")); // in ms
	gamesPlayed = isNaN(Number(localStorage.getItem("gamesPlayed"))) || Number(localStorage.getItem("gamesPlayed")) < 0 ? 0 : Number(localStorage.getItem("gamesPlayed"));

	if (gamesPlayed == 0) winPercentage = 0;
	else winPercentage = wins/gamesPlayed;

	beginnerWins = isNaN(Number(localStorage.getItem("beginnerWins"))) || Number(localStorage.getItem("beginnerWins")) < 0 ? 0 : Number(localStorage.getItem("beginnerWins"));
	beginnerGamesPlayed = isNaN(Number(localStorage.getItem("beginnerGamesPlayed"))) || Number(localStorage.getItem("beginnerGamesPlayed")) < 0 ? 0 : Number(localStorage.getItem("beginnerGamesPlayed"));

	beginnerWinPercentage;
	if (beginnerGamesPlayed == 0) beginnerWinPercentage = 0;
	else beginnerWinPercentage = beginnerWins / beginnerGamesPlayed;

	beginnerAverageTime = isNaN(Number(localStorage.getItem("beginnerAverageTime"))) || Number(localStorage.getItem("beginnerAverageTime")) < 0 ? 0 : Number(localStorage.getItem("beginnerAverageTime")); // in ms


	intermediateWins = isNaN(Number(localStorage.getItem("intermediateWins"))) || Number(localStorage.getItem("intermediateWins")) < 0 ? 0 : Number(localStorage.getItem("intermediateWins"));
	intermediateGamesPlayed = isNaN(Number(localStorage.getItem("intermediateGamesPlayed"))) || Number(localStorage.getItem("intermediateGamesPlayed")) < 0 ? 0 : Number(localStorage.getItem("intermediateGamesPlayed"));

	intermediateWinPercentage;
	if (intermediateGamesPlayed == 0) intermediateWinPercentage = 0;
	else intermediateWinPercentage = intermediateWins / intermediateGamesPlayed;

	intermediateAverageTime = isNaN(Number(localStorage.getItem("intermediateAverageTime"))) || Number(localStorage.getItem("intermediateAverageTime")) < 0 ? 0 : Number(localStorage.getItem("intermediateAverageTime"));



	expertWins = isNaN(Number(localStorage.getItem("expertWins"))) || Number(localStorage.getItem("expertWins")) < 0 ? 0 : Number(localStorage.getItem("expertWins"));
	expertGamesPlayed = isNaN(Number(localStorage.getItem("expertGamesPlayed"))) || Number(localStorage.getItem("expertGamesPlayed")) < 0 ? 0 : Number(localStorage.getItem("expertGamesPlayed"));

	expertWinPercentage;
	if (expertGamesPlayed == 0) expertWinPercentage = 0;
	else expertWinPercentage = expertWins / expertGamesPlayed;

	expertAverageTime = isNaN(Number(localStorage.getItem("expertAverageTime"))) || Number(localStorage.getItem("expertAverageTime")) < 0 ? 0 : Number(localStorage.getItem("expertAverageTime"));



	dailyWins = isNaN(Number(localStorage.getItem("dailyWins"))) || Number(localStorage.getItem("dailyWins")) < 0 ? 0 : Number(localStorage.getItem("dailyWins"));
	dailyBestWinStreak = isNaN(Number(localStorage.getItem("dailyBestWinStreak"))) || Number(localStorage.getItem("dailyBestWinStreak")) < 0 ? 0 : Number(localStorage.getItem("dailyBestWinStreak"));
	dailyCurrentWinStreak = isNaN(Number(localStorage.getItem("dailyCurrentWinStreak"))) || Number(localStorage.getItem("dailyCurrentWinStreak")) < 0 ? 0 : Number(localStorage.getItem("dailyCurrentWinStreak"));
}

function updateStatsAllGames() {
    document.getElementById("wins").innerText = wins;
	document.getElementById("currentWinStreak").innerText = currentWinStreak;
	if (currentWinStreak > bestWinStreak) bestWinStreak = currentWinStreak;
	document.getElementById("bestWinStreak").innerText = bestWinStreak;
    document.getElementById("hoursPlayed").innerText = (hours / (1000 * 60 * 60)).toFixed(2);
    document.getElementById("gamesPlayed").innerText = gamesPlayed;
	
    
    winPercentage = wins/gamesPlayed;
    
    if (winPercentage == Infinity || isNaN(winPercentage)) winPercentage = 0;
    document.getElementById("winPercentage").innerText = (winPercentage * 100).toFixed(1) + "%";
    
    localStorage.setItem("wins", wins);
	localStorage.setItem("currentWinStreak", currentWinStreak);
	localStorage.setItem("bestWinStreak", bestWinStreak);
    localStorage.setItem("hours", hours);
    localStorage.setItem("gamesPlayed", gamesPlayed);
}

function updateStatsDaily() {
	document.getElementById("dailyWins").innerText = dailyWins;
	localStorage.setItem("dailyWins", dailyWins);

	document.getElementById("dailyCurrentWinStreak").innerText = dailyCurrentWinStreak;
	localStorage.setItem("dailyCurrentWinStreak", dailyCurrentWinStreak);

	if (dailyCurrentWinStreak > dailyBestWinStreak) dailyBestWinStreak = dailyCurrentWinStreak;

	document.getElementById("dailyBestWinStreak").innerText = dailyBestWinStreak;
	localStorage.setItem("dailyBestWinStreak", dailyBestWinStreak);
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
updateStatsDaily();

document.getElementById("resetStatsButton").addEventListener("click", (e) => {
    wins = 0;
    hours = 0;
    gamesPlayed = 0;
    
    beginnerWins = 0;
    beginnerGamesPlayed = 0;
    beginnerAverageTime = 0;

	intermediate = 0;
	intermediateGamesPlayed = 0;
	intermediateAverageTime = 0;

	expertWins = 0;
	expertGamesPlayed = 0;
	expertAverageTime = 0;

	dailyWins = 0;
	dailyCurrentWinStreak = 0;
	dailyBestWinStreak = 0;
    
    updateStatsAllGames();
    updateStatsBeginner();
	updateStatsIntermediate();
	updateStatsExpert();
	updateStatsDaily();
})