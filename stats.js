
function updateStatsAllGames() {
    document.getElementById("wins").innerText = wins;
    document.getElementById("hoursPlayed").innerText = (hours / (1000 * 60 * 60)).toFixed(2);
    document.getElementById("gamesPlayed").innerText = gamesPlayed;
    
    winPercentage = wins/gamesPlayed;
    
    if (winPercentage == Infinity) winPercentage = 0;
    document.getElementById("winPercentage").innerText = (winPercentage * 100).toFixed(1) + "%";
    
    localStorage.setItem("wins", wins);
    localStorage.setItem("hours", hours);
    localStorage.setItem("gamesPlayed", gamesPlayed);
}

updateStatsAllGames();