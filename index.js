const VERSION = "1.11.4";
document.getElementById("logoVersion").innerText = "v" + VERSION;
document.getElementById("versionFooter").innerText = "v" + VERSION;


fetch("https://api.github.com/repos/nicholachen/minesweeper/releases/tags/"+"v"+VERSION).then((response) => response.json()).then((json) => {
    if (json.html_url == null) {
        return;
    }
    document.getElementById("logoVersion").href = json.html_url;
    document.getElementById("versionFooter").href = json.html_url;
});

var lastDaily = localStorage.getItem("daily");
var dailyTries = isNaN(Number(localStorage.getItem("dailyTries"))) || Number(localStorage.getItem("dailyTries")) < 0 ? 0 : Number(localStorage.getItem("dailyTries"));

var todayPlayed = false;

var dailyCodes;
fetch("./daily.json").then((response) => response.json()).then((json) => {
    dailyCodes = json;
});


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const margin = 0.03; // percentage of each grid square

const canvasMargin = 16; // pixels
var scale = 1;
var cam_x = 0;
var cam_y = 0;

var settings = false;
var stats = false;

var panning = false;

var difficulty = localStorage.getItem("difficulty") ?? "Beginner";

var size_x = isNaN(Number(localStorage.getItem("mapX"))) || Number(localStorage.getItem("mapX")) < 5 ? 10 : Number(localStorage.getItem("mapX"));
var size_y = isNaN(Number(localStorage.getItem("mapY"))) || Number(localStorage.getItem("mapY")) < 5 ? 10 : Number(localStorage.getItem("mapY"));

var numMines = isNaN(Number(localStorage.getItem("mines"))) || Number(localStorage.getItem("mines")) <= 0 || Number(localStorage.getItem("mines")) > 1000 || Number(localStorage.getItem("mines")) > Math.floor(size_x * size_y / 2) ?  15 : Number(localStorage.getItem("mines"));

var new_x;
var new_y;

var newNumMines;

var mapCustomMade = false;

if (difficulty == "Beginner") {
    size_x = 9;
    size_y = 9;
    
    numMines = 10;
} else if (difficulty == "Intermediate") {
    size_x = 16;
    size_y = 16;
    
    numMines = 40;
} else if (difficulty == "Expert") {
    size_x = 30;
    size_y = 16;
    
    numMines = 99;
} else {
    difficulty = "Custom";
}

var oldSizeX = size_x;
var oldSizeY = size_y;
var oldNumMines = numMines;
var oldDifficulty = difficulty;


var infiniteLives = localStorage.getItem("infiniteLives") == "true";
var randomMines = localStorage.getItem("random") ?? "Normal";

var onMouseDown = localStorage.getItem("onMouseDown") != "false";
var chording = localStorage.getItem("chording") != "false";

var pauseShortcut = localStorage.getItem("pauseShortcut") ?? "SPACE";
var restartShortcut = localStorage.getItem("restartShortcut") ?? "ESCAPE";
var panZoomShortcut = localStorage.getItem("panZoomShortcut") ?? "Z";
var statsShortcut = localStorage.getItem("statsShortcut") ?? "A";
var settingsShortcut = localStorage.getItem("settingsShortcut") ?? "S";

var flagHold = isNaN(Number(localStorage.getItem("flagHold"))) || Number(localStorage.getItem("flagHold")) < 50 ?  250 : Number(localStorage.getItem("flagHold"));
var easyPanZoom = localStorage.getItem("easyPanZoom") == "true";


var showTimer = localStorage.getItem("showTimer") != "false";
var showFlags = localStorage.getItem("showFlags") != "false";
var showPause = localStorage.getItem("showPause") != "false";
var showRestart = localStorage.getItem("showRestart") != "false";

var show3BVSec = localStorage.getItem("show3BVSec") == "true";
var showCPS = localStorage.getItem("showCPS") == "true";
var showMines = localStorage.getItem("showMines") == "true";

var mapCreator = localStorage.getItem("mapCreator") == "true";

var analysis = localStorage.getItem("analysis") ?? "Off";


if (mapCreator) {
    document.getElementById("mapCreatorTop").style.display = "block";
} else {
    document.getElementById("mapCreatorTop").style.display = "none";
}


// stats

var wins = isNaN(Number(localStorage.getItem("wins"))) || Number(localStorage.getItem("wins")) < 0 ? 0 : Number(localStorage.getItem("wins"));

var bestWinStreak = isNaN(Number(localStorage.getItem("bestWinStreak"))) || Number(localStorage.getItem("bestWinStreak")) < 0 ? 0 : Number(localStorage.getItem("bestWinStreak"));
var currentWinStreak = isNaN(Number(localStorage.getItem("currentWinStreak"))) || Number(localStorage.getItem("currentWinStreak")) < 0 ? 0 : Number(localStorage.getItem("currentWinStreak"));

var hours = isNaN(Number(localStorage.getItem("hours"))) || Number(localStorage.getItem("hours")) < 0 ? 0 : Number(localStorage.getItem("hours")); // in ms
var gamesPlayed = isNaN(Number(localStorage.getItem("gamesPlayed"))) || Number(localStorage.getItem("gamesPlayed")) < 0 ? 0 : Number(localStorage.getItem("gamesPlayed"));

var winPercentage;
if (gamesPlayed == 0) winPercentage = 0;
else winPercentage = wins/gamesPlayed;

var beginnerWins = isNaN(Number(localStorage.getItem("beginnerWins"))) || Number(localStorage.getItem("beginnerWins")) < 0 ? 0 : Number(localStorage.getItem("beginnerWins"));
var beginnerGamesPlayed = isNaN(Number(localStorage.getItem("beginnerGamesPlayed"))) || Number(localStorage.getItem("beginnerGamesPlayed")) < 0 ? 0 : Number(localStorage.getItem("beginnerGamesPlayed"));

var beginnerWinPercentage;
if (beginnerGamesPlayed == 0) beginnerWinPercentage = 0;
else beginnerWinPercentage = beginnerWins / beginnerGamesPlayed;

var beginnerAverageTime = isNaN(Number(localStorage.getItem("beginnerAverageTime"))) || Number(localStorage.getItem("beginnerAverageTime")) < 0 ? 0 : Number(localStorage.getItem("beginnerAverageTime")); // in ms


var intermediateWins = isNaN(Number(localStorage.getItem("intermediateWins"))) || Number(localStorage.getItem("intermediateWins")) < 0 ? 0 : Number(localStorage.getItem("intermediateWins"));
var intermediateGamesPlayed = isNaN(Number(localStorage.getItem("intermediateGamesPlayed"))) || Number(localStorage.getItem("intermediateGamesPlayed")) < 0 ? 0 : Number(localStorage.getItem("intermediateGamesPlayed"));

var intermediateWinPercentage;
if (intermediateGamesPlayed == 0) intermediateWinPercentage = 0;
else intermediateWinPercentage = intermediateWins / intermediateGamesPlayed;

var intermediateAverageTime = isNaN(Number(localStorage.getItem("intermediateAverageTime"))) || Number(localStorage.getItem("intermediateAverageTime")) < 0 ? 0 : Number(localStorage.getItem("intermediateAverageTime"));



var expertWins = isNaN(Number(localStorage.getItem("expertWins"))) || Number(localStorage.getItem("expertWins")) < 0 ? 0 : Number(localStorage.getItem("expertWins"));
var expertGamesPlayed = isNaN(Number(localStorage.getItem("expertGamesPlayed"))) || Number(localStorage.getItem("expertGamesPlayed")) < 0 ? 0 : Number(localStorage.getItem("expertGamesPlayed"));

var expertWinPercentage;
if (expertGamesPlayed == 0) expertWinPercentage = 0;
else expertWinPercentage = expertWins / expertGamesPlayed;

var expertAverageTime = isNaN(Number(localStorage.getItem("expertAverageTime"))) || Number(localStorage.getItem("expertAverageTime")) < 0 ? 0 : Number(localStorage.getItem("expertAverageTime"));



var dailyWins = isNaN(Number(localStorage.getItem("dailyWins"))) || Number(localStorage.getItem("dailyWins")) < 0 ? 0 : Number(localStorage.getItem("dailyWins"));
var dailyBestWinStreak = isNaN(Number(localStorage.getItem("dailyBestWinStreak"))) || Number(localStorage.getItem("dailyBestWinStreak")) < 0 ? 0 : Number(localStorage.getItem("dailyBestWinStreak"));
var dailyCurrentWinStreak = isNaN(Number(localStorage.getItem("dailyCurrentWinStreak"))) || Number(localStorage.getItem("dailyCurrentWinStreak")) < 0 ? 0 : Number(localStorage.getItem("dailyCurrentWinStreak"));





var map = []; // -1 represents a mine

var analysisMap = [];


var daily = false;

const params = new URLSearchParams(document.location.search);

function readTheme() {
    if (params.get("t")) {
        try {
            let t = JSON.parse(atob(params.get("t")));
            if (t != null) {
                theme = t;
                
                if (theme.key == "custom") {
                    themes.custom = theme;
                }

                setTheme(theme);

                document.getElementById("saveImportedSettings").style.display = "inline";
                document.getElementById("cancelImportedSettings").style.display = "inline";
            }
        } catch (e) {
        }
    }
}

readTheme();

var mapRead = false;

function readMap() {
    if (params.get("m")) {
        let m = getMap(params.get("m"));

        if (m) {
            document.getElementById("mapCreatorTop").style.display = "none";

            size_x = m.x;
            size_y = m.y;

            numMines = m.n;

            map = m.m;

            mapCustomMade = true;
            mapRead = true;

            refreshMap(true);
            
            map3BV = threeBV();
        }
    }
}

readMap();



var settingsMessageDuration = 5000;

var inGame = mapCreator;
var paused = false;


var flags = 0;

var startTime;
var pausedTime = 0;

var interval;
var first = true;

var map3BV;
var clicks;

function resize(entries) {
    let displayWidth, displayHeight;
    for (const entry of entries) {
        let width;
        let height;
        let dpr = window.devicePixelRatio;
        if (entry.devicePixelContentBoxSize) {
            width = entry.devicePixelContentBoxSize[0].inlineSize;
            height = entry.devicePixelContentBoxSize[0].blockSize;
            dpr = 1;
        } else if (entry.contentBoxSize) {
            if (entry.contentBoxSize[0]) {
                width = entry.contentBoxSize[0].inlineSize;
                height = entry.contentBoxSize[0].blockSize;
            } else {
                width = entry.contentBoxSize.inlineSize;
                height = entry.contentBoxSize.blockSize;
            }
        } else {
            width = entry.contentRect.width;
            height = entry.contentRect.height;
        }
        displayWidth = Math.round(width * dpr);
        displayHeight = Math.round(height * dpr);
    }
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    if (difficulty != "Custom") {
        let large = Math.max(size_x, size_y);
        let small = Math.min(size_x, size_y);

        let rotate = false
        if (canvas.width > canvas.height) {
            if (size_x != large) {
                rotate = true;
            }
        } else {
            if (size_x != small) {
                rotate = true;
            }
        }

        if (rotate) {
            let m = [];
            let am = [];
            for (let i = 0; i < size_x; i++) {
                m[i] = [];
                am[i] = [];
                for (let j = 0; j < size_y; j++) {
                    m[i][j] = map[j][i];
                    am[i][j] = analysisMap[j][i];
                }
            }
    
            map = m;
            analysisMap = am;

            let old_x = size_x
            let old_y = size_y

            size_x = old_y;
            size_y = old_x;
        }
    }

    draw();
}


const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(canvas, { box: 'content-box' });





function timeToText(t) {
    if (t < 60) {
        return t.toFixed(1) + "s"
    } else {
        return Math.floor(t / 60).toString() + ":" + Math.floor(t % 60).toString().padStart(2, "0")
    }
}

function refreshMap(playCustomAgain=false) {
    if (!playCustomAgain && !mapRead) {
        if (newNumMines) {
            numMines = newNumMines;
            newNumMines = null;
        }
        if (new_x) {
            size_x = new_x;
            new_x = null;
        }
        if (new_y) {
            size_y = new_y;
            new_y = null;
        }

        if (!mapRead) {
            map = [];
            for (let i = 0; i < size_y; i++) {
                map[i] = [];
                for (let j = 0; j < size_x; j++) {
                    map[i][j] = {value: 0, opened: false, flagged: false};
                }
            }
        }
    }

    clicks = {
        chord: 0,
        left: 0,
        right: 0,
        w_chord: 0,
        w_left: 0,
        w_right: 0
    };

    document.getElementById("gameEnd").style.display = "none";

    paused = false;
    lastPause = false;

    document.getElementById("pause").classList.remove("fa-circle-play");
    document.getElementById("pause").classList.add("fa-circle-pause");

    canvas.style.display = "block";
    document.getElementById("pausedScreen").style.display = "none";


    document.getElementById("flags").innerText = "0/" + numMines.toString();
    document.getElementById("timer").innerText = "0.0s";

    if (!mapCreator || mapRead) {
        document.getElementById("clickAnywhere").style.display = "flex";
    } else {
        document.getElementById("clickAnywhere").style.display = "none";
    }

    if (daily) {
        document.getElementById("clickAnywhereText").innerText = "Click the green square to begin";
    } else {
        document.getElementById("clickAnywhereText").innerText = "Click any square to begin";
    }
    document.getElementById("notCounted").style.display = "none";
    
    if (difficulty != "Custom" && !mapRead) {
        let large = Math.max(size_x, size_y);
        let small = Math.min(size_x, size_y);

        if (canvas.width > canvas.height) {
            size_x = large;
            size_y = small;
        } else {
            size_x = small;
            size_y = large;
        }
    } 
    if (daily) {
        let large = Math.max(size_x, size_y);
        let small = Math.min(size_x, size_y);

        let rotate = false
        if (canvas.width > canvas.height) {
            if (size_x != large) {
                rotate = true;
            }
        } else {
            if (size_x != small) {
                rotate = true;
            }
        }

        if (rotate) {
            let m = [];
            for (let i = 0; i < size_x; i++) {
                m[i] = [];
                for (let j = 0; j < size_y; j++) {
                    m[i][j] = map[j][i];
                }
            }
    
            map = m;

            let old_x = size_x
            let old_y = size_y

            size_x = old_y;
            size_y = old_x;
        };
    }
    
    first = true;
    mapCustomMade = mapCreator || playCustomAgain;

    flags = 0;
    if (!mapCreator || mapRead) {
        if (!playCustomAgain) {
            map = [];
            for (let i = 0; i < size_y; i++) {
                map[i] = [];
                for (let j = 0; j < size_x; j++) {
                    map[i][j] = {value: NaN, opened: false, flagged: false};
                }
            }
        } else {
            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[i].length; j++) {
                    map[i][j].opened = false;
                    map[i][j].flagged = false;
                    if (map[i][j].value != -1) {
                        map[i][j].value = adjacentMines(map,j,i);
                    }
                }
            }
        }
    } else {
        if (map.length == 0) {
            map = [];
            for (let i = 0; i < size_y; i++) {
                map[i] = [];
                for (let j = 0; j < size_x; j++) {
                    map[i][j] = {value: 0, opened: false, flagged: false};
                }
            }
        }

        flags = map.flat().filter(s => s.flagged).length;
        numMines = map.flat().filter(s => s.value == -1).length;

        document.getElementById("flags").innerText = flags.toString() +  "/" + numMines.toString();
    }

    analysisMap = [];
    for (let i = 0; i < map.length; i++) {
        analysisMap[i] = [];
        for (let j = 0; j < map[i].length; j++) {
            analysisMap[i][j] = {probability: null};
        }
    }

    update();

    draw(true);
}

if (!mapCustomMade && !mapRead) {
    refreshMap();
}


function update() {
    if (analysis == "Simple" && !mapRead) analysisMap = analyze(map, analysisMap, true);
    else if (analysis == "Advanced" && !mapRead) analysisMap = analyze(map, analysisMap, false);
}

function generate(mines, firstx, firsty) {
    let mineSquares = [];

    if (mines + 8 < size_x * size_y && randomMines != "Normal" ) {
        for (let x=0;x<size_x;x++) { // force first tile to not have a number on it or have a bomb on it
            for (let y=0;y<size_y;y++) {
                if (Math.abs(firstx - x) > 1 || Math.abs(firsty - y) > 1) {
                    mineSquares.push([x,y]);
                }
            }
        }
    } else {
        for (let x=0;x<size_x;x++) {
            for (let y=0;y<size_y;y++) {
                if (x != firstx || y != firsty) {
                    mineSquares.push([x,y]);
                }
            }
        }
    }

    if (randomMines != "No guess") {
        for (let i=0;i<mines;i++) {
            let b= Math.floor(Math.random() * mineSquares.length);

            map[mineSquares[b][1]][mineSquares[b][0]].value = -1;
            mineSquares.splice(b,1);
        }



        for (let x=0;x<size_x;x++) {
            for (let y=0;y<size_y;y++) {
                if (map[y][x].value != -1) {
                    map[y][x].value = adjacentMines(map,x,y);
                }
            }
        }

        exposeTile(map, firstx,firsty);
    } else {
        while (true) {
            let m = [];
            for (let i = 0; i < size_y; i++) {
                m[i] = [];
                for (let j = 0; j < size_x; j++) {
                    m[i][j] = {value: NaN, opened: false, flagged: false};
                }
            }
            

            let newMineSquares = [...mineSquares];

            for (let i=0;i<mines;i++) {
                let b = Math.floor(Math.random() * newMineSquares.length);

                m[newMineSquares[b][1]][newMineSquares[b][0]].value = -1;
                newMineSquares.splice(b,1);
            }



            for (let x=0;x<size_x;x++) {
                for (let y=0;y<size_y;y++) {
                    if (m[y][x].value != -1) {
                        m[y][x].value = adjacentMines(m,x,y);
                    }
                }
            }

            exposeTile(m, firstx,firsty);

            if (solve(m)) {
                map = m;
                for (let x=0;x<size_x;x++) {
                    for (let y=0;y<size_y;y++) {
                        map[y][x].opened = false;
                    }
                }
                exposeTile(map, firstx,firsty);
                break;
            }
        }
    }
    
    map3BV = threeBV();
}

function adjacentMines(m,x,y) {
    let t = 0;
    for (let i=-1;i<=1;i++) {
        for (let j=-1;j<=1;j++) {
            if (i != 0 || j != 0) {
                if (x+i >= 0 && x+i < m[0].length && y+j >= 0 && y+j < m.length) {
                    if (m[y+j][x+i].value == -1) {
                        t += 1;
                    }
                }
            }
        }
    }

    return t;
}

function adjacentFlags(x,y) { // flags + opened mines on infinite lives
    let f = 0;
    for (let i=-1;i<=1;i++) {
        for (let j=-1;j<=1;j++) {
            if (i != 0 || j != 0) {
                if (x+i >= 0 && x+i < size_x && y+j >= 0 && y+j < size_y) {
                    if (map[y+j][x+i].flagged || (map[y+j][x+i].opened && map[y+j][x+i].value == -1)) {
                        f += 1;
                    }
                }
            }
        }
    }

    return f;
}

function threeBV() {
    let m = [];
    for (let i = 0; i < size_y; i++) {
        m[i] = [];
        for (let j = 0; j < size_x; j++) {
            m[i][j] = Object.assign({}, map[i][j]);
        }
    }
    
    let i=0;
    for (let y = 0; y < size_y; y++) {
        for (let x = 0; x < size_x; x++) {
            if (!m[y][x].opened) {
                if (m[y][x].value == 0) {
                    _exposeTile(m,x,y);
                    
                    i++;
                } else if (map[y][x].value > 0) {
                    m[y][x].opened = true;
                    
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if (i != 0 || j != 0) {
                                if (x + i >= 0 && x + i < size_x && y + j >= 0 && y + j < size_y) {
                                    _exposeTile(m,x+i,y+j);
                                }
                            }
                        }
                    }
                    
                    i++;
                }
            }
        }
    }
    
    return i
}

function idToTile(n) {
    return {x: n%size_x, y: Math.floor(n/size_x)}
}
function _idToTile(n,_size_x) {
    return {x: n%_size_x, y: Math.floor(n/_size_x)}
}
function exposeTile(m,x,y) {
    if ( x < 0 || x >= size_x || y < 0 || y >= size_y) return;

    if (m[y][x].opened) return;
    
    if (m[y][x].value == 0) {
        _exposeTile(m,x,y);
    } else if (m[y][x].value == -1) {
        m[y][x].opened = true; // LOSE
        
        if (!inGame || paused) {
            return;
        }

        if (!infiniteLives) {
            getStats();

            inGame = false;

            clearInterval(interval);
            let elapsedTime = Date.now() - startTime;
            document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);

            if (!mapCustomMade && analysis == "Off" && !infiniteLives && !showMines) {
                currentWinStreak = 0;
                hours += elapsedTime - pausedTime;
                gamesPlayed += 1;
                
                updateStatsAllGames();

                if (difficulty == "Beginner") {
                    beginnerGamesPlayed += 1;

                    updateStatsBeginner();
                } else if (difficulty == "Intermediate") {
                    intermediateGamesPlayed += 1;

                    updateStatsIntermediate();
                } else if (difficulty == "Expert") {
                    expertGamesPlayed += 1;

                    updateStatsExpert();
                }
            }
            
            if (!mapCustomMade) {
                document.getElementById("playAgainButton").innerText = "Play again";
                document.getElementById("playCustomAgainButton").style.display = "none";
            } else {
                document.getElementById("playAgainButton").innerText = "Exit custom map";
                document.getElementById("playCustomAgainButton").style.display = "inline";
            }

            if (daily) {
                document.getElementById("playAgainButton").innerText = "Exit daily map";
                document.getElementById("playCustomAgainButton").style.display = "inline";

                dailyTries += 1;

                localStorage.setItem("dailyTries", dailyTries);
            }
        
            if (!mapRead) {
                for (let x = 0; x < size_x; x++) {
                    for (let y = 0; y < size_y; y++) {
                        if (m[y][x].value == -1) {
                            m[y][x].opened = true;
                        }
                    }
                }
            }
            document.getElementById("time").style.display = "none";
            document.getElementById("winStreak").style.display = "none";
            document.getElementById("3BVSec").style.display = "none";
            document.getElementById("CPS").style.display = "none";
            document.getElementById("gameEndText").innerText = "Game Over!";
            document.getElementById("gameEnd").style.display = "flex";
        }
    } else {
        m[y][x].opened = true;
    }
    
    
    let f = 0;
    
    for (let x = 0; x < size_x; x++) {
        for (let y = 0; y < size_y; y++) {
            if (m[y][x].flagged) {
                f++;
            }
        }
    }
    
    flags = f;
    document.getElementById("flags").innerText = flags + "/" + numMines.toString();
    
    let opened = true;
    
    for (let x = 0; x < size_x; x++) {
        for (let y = 0; y < size_y; y++) {
            if (!m[y][x].opened && m[y][x].value != -1) {
                opened = false;
                break;
            }
        }
    }

    if (!inGame || paused) {
        return
    }
    
    if (opened) { // WIN (all squares opened)
        inGame = false;
        clearInterval(interval);
        let elapsedTime = Date.now() - startTime;
        document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);
        getStats();
        if (!mapCustomMade && analysis == "Off" && !infiniteLives && !showMines) {
            hours += elapsedTime - pausedTime;
            wins += 1;
            currentWinStreak += 1;
            gamesPlayed += 1;
            
            updateStatsAllGames();
            
            if (difficulty == "Beginner") {
                beginnerAverageTime = (beginnerAverageTime*beginnerWins + (elapsedTime-pausedTime))/(beginnerWins+1);
                
                beginnerWins += 1;
                beginnerGamesPlayed += 1;
                
                updateStatsBeginner();
            } else if (difficulty == "Intermediate") {
                intermediateAverageTime = (intermediateAverageTime * intermediateWins + (elapsedTime - pausedTime)) / (intermediateWins + 1);

                intermediateWins += 1;
                intermediateGamesPlayed += 1;

                updateStatsIntermediate();
            } else if (difficulty == "Advanced") {
                expertAverageTime = (expertAverageTime * expertWins + (elapsedTime - pausedTime)) / (expertWins + 1);

                expertWins += 1;
                expertGamesPlayed += 1;

                updateStatsExpert();
            }
            document.getElementById("notCounted").style.display = "none";
            document.getElementById("winStreak").style.display = "block";
        } else {
            document.getElementById("notCounted").style.display = "block";
            document.getElementById("winStreak").style.display = "none";
        }
        document.getElementById("notCounted").innerText = "Not counted towards stats";
        document.getElementById("winStreak").innerText = "Win streak: " + currentWinStreak;

        if (!mapCustomMade) {
            document.getElementById("playAgainButton").innerText = "Play again";
            document.getElementById("playCustomAgainButton").style.display = "none";
        } else {
            document.getElementById("playAgainButton").innerText = "Exit custom map";
            document.getElementById("playCustomAgainButton").style.display = "inline";
        }


        if (daily) {
            document.getElementById("notCounted").style.display = "none";

            hours += elapsedTime - pausedTime;
            wins += 1;
            currentWinStreak += 1;
            gamesPlayed += 1;
            
            updateStatsAllGames();

            document.getElementById("playAgainButton").innerText = "Exit daily map";
            document.getElementById("playCustomAgainButton").style.display = "inline";
            
            if (!todayPlayed) {
                localStorage.setItem("daily", new Date().toISOString().split('T')[0]);
                dailyWins += 1;
                dailyCurrentWinStreak += 1;

                todayPlayed = true;

                updateStatsDaily();
            } else {
                document.getElementById("notCounted").innerText = "Daily map already played";
                document.getElementById("notCounted").style.display = "block";
            }
            document.getElementById("winStreak").style.display = "block";
            document.getElementById("winStreak").innerText = "Daily map win streak: " + dailyCurrentWinStreak;
        }
    
        document.getElementById("time").style.display = "block";

        let totalClicks = 0;
        totalClicks += clicks.chord;
        totalClicks += clicks.left;
        totalClicks += clicks.right;
        totalClicks += clicks.w_chord;
        totalClicks += clicks.w_left;
        totalClicks += clicks.w_right;

        document.getElementById("3BVSec").style.display = show3BVSec ? "block" : "none";
        document.getElementById("3BVSec").innerText = "3BV/sec: " + (map3BV / ((elapsedTime - pausedTime) / 1000)).toFixed(2);
        
        document.getElementById("CPS").style.display = showCPS ? "block" : "none";
        document.getElementById("CPS").innerText = "CPS: " + (totalClicks / ((elapsedTime - pausedTime) / 1000)).toFixed(2);

        if ((elapsedTime - pausedTime) / 1000 < 60) {
            document.getElementById("time").innerText = "Time: " + timeToText((elapsedTime - pausedTime) / 1000);
        } else {
            document.getElementById("time").innerText = "Time: " + ((elapsedTime - pausedTime) / 1000).toFixed(1) + "s" + " (" + timeToText((elapsedTime - pausedTime) / 1000) + ")";
        }
    
        document.getElementById("gameEndText").innerText = "You Win!";
        document.getElementById("gameEnd").style.display = "flex";
    }
}
function _exposeTile(m,x,y) {

    if (x < 0 || x >= size_x || y < 0 || y >= size_y) {
        return
    }
    if (m[y][x].value == 0) {
        let n = [y*size_x + x];
        let done = [y*size_x + x];

        while (true) {
            let n_ = [];
            for (let a=0;a<n.length;a++) {
                m[idToTile(n[a]).y][idToTile(n[a]).x].opened = true;
                m[idToTile(n[a]).y][idToTile(n[a]).x].flagged = false;
                if (m[idToTile(n[a]).y][idToTile(n[a]).x].value == 0) {
                    for (let i=-1;i<=1;i++) {
                        for (let j=-1;j<=1;j++) {
                            if (idToTile(n[a]).x+i>=0 && idToTile(n[a]).x+i<size_x && idToTile(n[a]).y+j>=0 && idToTile(n[a]).y+j<size_y && !done.includes((idToTile(n[a]).y+j)*size_x + idToTile(n[a]).x+i)) {
                                n_.push((idToTile(n[a]).y+j)*size_x + idToTile(n[a]).x+i);
                                done.push((idToTile(n[a]).y+j)*size_x + idToTile(n[a]).x+i);
                            }
                        }
                    }
                }
            }
            if (n_.length == 0) {
                break
            }

            n = n_;
        }
    }
}

function draw(clear=false) {
    if (clear) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    
    let squareSize = Math.min((canvas.width-2*canvasMargin)/map[0].length,(canvas.height-2*canvasMargin)/map.length) * scale;
    let startx = canvas.width/2 - squareSize * map[0].length / 2 - cam_x;
    let starty = canvas.height/2 - squareSize * map.length / 2 - cam_y;


    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (let x=0;x<map[0].length;x++) {
        for (let y=0;y<map.length;y++) {
            if (!paused) {
                if (!map[y][x].opened || (mapCreator && !mapRead)) {
                    ctx.fillStyle = theme.unopened;
                } else {
                    ctx.fillStyle = theme.opened;
                }

                
                ctx.fillRect(startx+x*squareSize + squareSize*margin,starty+y*squareSize + squareSize*margin,squareSize - squareSize*margin*2,squareSize - squareSize*margin*2);
                
                if (!map[y][x].opened) {
                    if (theme.key == "classic") {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.beginPath();
                        ctx.moveTo(startx+x*squareSize,starty+y*squareSize);
                        ctx.lineTo(startx+x*squareSize,starty+y*squareSize + squareSize);
                        ctx.lineTo(startx+x*squareSize + squareSize,starty+y*squareSize);
                        ctx.closePath();
                        ctx.fill();

                        ctx.fillStyle = "#767676";
                        ctx.beginPath();
                        ctx.moveTo(startx+x*squareSize + squareSize,starty+y*squareSize + squareSize);
                        ctx.lineTo(startx+x*squareSize,starty+y*squareSize + squareSize);
                        ctx.lineTo(startx+x*squareSize + squareSize,starty+y*squareSize);
                        ctx.closePath();
                        ctx.fill();

                        ctx.fillStyle = theme.unopened;
                        ctx.fillRect(startx+x*squareSize + squareSize*0.11,starty+y*squareSize + squareSize*0.11,squareSize - squareSize*0.11*2,squareSize - squareSize*0.11*2);
                    }
                }

                let u = false;
                if (!map[y][x].opened || (mapCreator && !mapRead)) {
                    if (((showMines || mapCreator) && !mapRead) && map[y][x].value == -1) {
                        ctx.fillStyle = "rgba(200,0,0,0.3)";
                        u = true;
                    } else if (map[y][x].first) {
                        ctx.fillStyle = "rgba(0,200,0,0.3)";
                        u = true;
                    }
                } else {
                    if (map[y][x].value == -1) {
                        ctx.fillStyle = "rgba(200,0,0,0.6)";

                        if (map[y][x].flagged) {
                            ctx.fillStyle = "rgba(200,0,0,0.3)";
                        }
                        u = true;
                    }
                }
                
                if (u) ctx.fillRect(startx+x*squareSize + squareSize*margin,starty+y*squareSize + squareSize*margin,squareSize - squareSize*margin*2,squareSize - squareSize*margin*2);
                

                if (map[y][x].opened || (mapCreator && !mapRead)) {
                    if (map[y][x].value > 0) {
                        ctx.font = "bold "+ (squareSize / 1.4).toString() + "px monospace, monospace";

                        if (map[y][x].value == 1) {
                            ctx.fillStyle = theme.one_color;
                        } else if (map[y][x].value == 2) {
                            ctx.fillStyle = theme.two_color;
                        } else if (map[y][x].value == 3) {
                            ctx.fillStyle = theme.three_color;
                        } else if (map[y][x].value == 4) {
                            ctx.fillStyle = theme.four_color;
                        } else if (map[y][x].value == 5) {
                            ctx.fillStyle = theme.five_color;
                        } else if (map[y][x].value == 6) {
                            ctx.fillStyle = theme.six_color;
                        } else if (map[y][x].value == 7) {
                            ctx.fillStyle = theme.seven_color;
                        } else if (map[y][x].value == 8) {
                            ctx.fillStyle = theme.eight_color;
                        }
                        
                        ctx.fillText(map[y][x].value.toString(), startx+x*squareSize + squareSize/2, starty+y*squareSize + squareSize/2);
                    }
                } else {
                    if (analysis != "Off" && !mapRead) {
                        if (analysisMap[y][x].probability != null) {
                            ctx.font = (squareSize / 4.4).toString() + "px monospace, monospace";
                            ctx.fillStyle = theme.probability_color;
                        
                            ctx.fillText((analysisMap[y][x].probability * 100).toFixed(1) + "%", startx+x*squareSize + squareSize/2, starty+y*squareSize + squareSize/2);
                            if (analysisMap[y][x].probability == 1) {
                                ctx.fillStyle = "rgba(200,0,0,0.9)";
                            }
                            if (analysisMap[y][x].probability == 0) {
                                ctx.fillStyle = "rgba(0,200,0,0.7)";
                            }
                            ctx.fillText((analysisMap[y][x].probability * 100).toFixed(1) + "%", startx+x*squareSize + squareSize/2, starty+y*squareSize + squareSize/2);

                        }
                    }
                }

                if (map[y][x].flagged) {
                    ctx.strokeStyle = theme.flag_stem;
                    ctx.fillStyle = theme.flag;
                    ctx.lineWidth = squareSize / 15;

                    ctx.beginPath();
                    ctx.moveTo(startx+x*squareSize + 0.3*squareSize, starty+y*squareSize + 0.8*squareSize);
                    ctx.lineTo(startx+x*squareSize + 0.3*squareSize, starty+y*squareSize + 0.2*squareSize);
                    ctx.stroke();

                    ctx.strokeStyle = theme.flag;
                    ctx.beginPath();
                    ctx.moveTo(startx+x*squareSize + 0.3*squareSize, starty+y*squareSize + 0.2*squareSize);
                    ctx.lineTo(startx+x*squareSize + 0.7*squareSize, starty+y*squareSize + 0.35*squareSize);
                    ctx.lineTo(startx+x*squareSize + 0.3*squareSize, starty+y*squareSize + 0.5*squareSize);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fill();
                }
            }
        }
    }
}



function overSquare(canvasX,canvasY) { // gets the square under the canvas at position (x,y)
    let squareSize = Math.min((canvas.width-2*canvasMargin)/size_x,(canvas.height-2*canvasMargin)/size_y) * scale;
    let startx = canvas.width/2 - squareSize * size_x / 2 - cam_x;
    let starty = canvas.height/2 - squareSize * size_y / 2 - cam_y;

    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (canvasX >= startx+x*squareSize && canvasX <= startx+x*squareSize + squareSize*margin + squareSize &&
                canvasY >= starty+y*squareSize && canvasY <= starty+y*squareSize + squareSize*margin + squareSize) {
                return {x: x, y: y}
            }
        }
    }

    return null
}

document.getElementById("gameEnd").addEventListener("click", (e) => {
    refreshMap();
    
    document.getElementById("gameEnd").style.display = "none";
})

document.getElementById("playAgainButton").addEventListener("click", (e) => {
    if (mapCustomMade | mapRead) {
        numMines = oldNumMines;
        size_x = oldSizeX;
        size_y = oldSizeY;
        difficulty = oldDifficulty;
    }
    refreshMap();
    if (mapRead) {
        daily = false;

        for (let i = 0; i < size_y; i++) {
            for (let j = 0; j < size_x; j++) {
                if (isNaN(map[i][j].value)) map[i][j].value = 0;
                if (map[i][j].flagged) map[i][j].flagged = false;
                if (map[i][j].opened) map[i][j].opened = false;
            }
        }

        if (mapCreator) {
            document.getElementById("mapCreatorTop").style.display = "block";
        }
        inGame = false;
        mapCustomMade = true;

        mapRead = false;

        clearInterval(interval);
        refreshMap();
    }


    document.getElementById("gameEnd").style.display = "none";
});

document.getElementById("playCustomAgainButton").addEventListener("click", (e) => {
    refreshMap(true);

    document.getElementById("gameEnd").style.display = "none";
});

var cursor;
document.addEventListener("mousemove", (e) => {
    let canvasX = e.clientX * window.devicePixelRatio;
    let canvasY = e.clientY * window.devicePixelRatio -  document.getElementById("top").clientHeight * window.devicePixelRatio;


    if (first && !inGame || inGame) {
        if (overSquare(canvasX,canvasY) && !map[overSquare(canvasX,canvasY).y][overSquare(canvasX,canvasY).x].opened) {
            if (!panning) canvas.style.cursor = "pointer";
            cursor = "pointer";
        } else {
            if (!panning) canvas.style.cursor = "default";
            cursor = "default";
        }
    }
    sessionStorage.setItem("pointer", overSquare(canvasX,canvasY) != null);
});


function viewChanged() {
    if (cam_x == 0 & cam_y == 0 && scale == 1) {
        document.getElementById("recenter").style.display = "none";
    } else {
        document.getElementById("recenter").style.display = "block";
    }
}

document.getElementById("recenter").addEventListener("click", (e) => {
    cam_x = 0;
    cam_y = 0;
    scale = 1;

    draw(true);

    document.getElementById("recenter").style.display = "none";
});


var touch = false;

var leftButtonDown = false;
var middleButtonDown = false;
var rightButtonDown = false;

document.addEventListener("mousedown", function (e) {
    if (e.button == 0) {
        leftButtonDown = true;
    } else if (e.button == 2) {
        rightButtonDown = true;
    } else if (e.button == 1) {
        middleButtonDown = true;
    }
});

document.addEventListener("mouseup", function (e) {
    if (e.button == 0) {
        leftButtonDown = false;
    } else if (e.button == 2) {
        rightButtonDown = false;
    } else if (e.button == 1) {
        middleButtonDown = false;
    }
    lastMouse = null;
});

var double = false


function open(square) {
    if ((mapCustomMade || mapRead) && first && square) {
        inGame = true;

        document.getElementById("clickAnywhere").style.display = "none";
        pausedTime = 0;
        first = false;
        
        startTime = Date.now();
        clearInterval(interval);
        interval = setInterval(function() {
            if (!paused) {
                let elapsedTime = Date.now() - startTime;
                document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);
            }
        }, 10);
    }
    if ((!inGame && !first) || paused) return;
    
    if (square) {
        if (!map[square.y][square.x].opened && !map[square.y][square.x].flagged) {
            console.log("open",square);
            if (first) {
                document.getElementById("clickAnywhere").style.display = "none";
                pausedTime = 0;
                generate(numMines, square.x, square.y);

                first = false;
                inGame = true;

                startTime = Date.now();
                interval = setInterval(function() {
                    if (!paused) {
                        let elapsedTime = Date.now() - startTime;
                        document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);
                    }
                }, 10);
            } else {
                exposeTile(map, square.x, square.y);
            }
            update();
            draw(true);
            return true;
        }
    }
}

function flag(square) {
    if ((!inGame && !first) || paused) return;

    if (square) {
        if (!map[square.y][square.x].opened) {
            console.log("flag",square);
            map[square.y][square.x].flagged = !map[square.y][square.x].flagged;

            let nw = !map[square.y][square.x].flagged_changed;

            map[square.y][square.x].flagged_changed = true;
            draw(true);
  
            let f = 0;
  
            for (let x = 0; x < size_x; x++) {
                for (let y = 0; y < size_y; y++) {
                    if (map[y][x].flagged) {
                        f++;
                    }
                }
            }
  
            flags = f;
            document.getElementById("flags").innerText = flags + "/" + numMines.toString();

            if (map[square.y][square.x].value != -1) {
                return false;
            }
            return nw;
        }
    }
}

function chord(square) {
    if ((!inGame && !first) || paused) return;

    if (square) {
        if (map[square.y][square.x].opened && map[square.y][square.x].value != 0) {

            let f = adjacentFlags(square.x, square.y);

            if (f == map[square.y][square.x].value) {
                console.log("chord",square);
                let f=false;
                for (let i=-1;i<=1;i++) {
                    for (let j=-1;j<=1;j++) {
                        if (i != 0 || j != 0) {
                            if (square.x+i >= 0 && square.x+i < size_x && square.y+j >= 0 && square.y+j < size_y && !map[square.y+j][square.x+i].flagged && !map[square.y+j][square.x+i].opened) {
                                exposeTile(map, square.x+i, square.y+j);
                                f=true;
                            }
                        }
                    }
                }
                update();
                draw(true);
                return f;
            }
        }
        return false;
    }
}
var mouseTimeout;
var lastMouse;
var camStart;
canvas.addEventListener("mousedown", (e) => {
    if (panning) {
        let canvasX = e.clientX * window.devicePixelRatio;
        let canvasY = e.clientY * window.devicePixelRatio -  document.getElementById("top").clientHeight * window.devicePixelRatio;

        lastMouse = {x: canvasX, y: canvasY};
        camStart = {x: cam_x, y: cam_y};
    } else {
        if (!onMouseDown) return;
        let canvasX = e.clientX * window.devicePixelRatio;
        let canvasY = e.clientY * window.devicePixelRatio -  document.getElementById("top").clientHeight * window.devicePixelRatio;
        let square = overSquare(canvasX, canvasY);
        if (square == null) return;
        if (mouseTimeout) clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(function() {
            if (leftButtonDown && !rightButtonDown) {
                if (!mapCreator || mapRead) {
                    if (open(square)) clicks.left += 1;
                }
                else {
                    if (square) {
                        if (map[square.y][square.x].value != -1) {
                            if (numMines < 500) {
                                map[square.y][square.x].value = -1;
                                numMines += 1;
                            } else {
                                document.getElementById("topText").innerText = "Maximum number of mines reached (500).";
                                document.getElementById("topText").style.display = "initial";
                                if (topTextInterval != null) clearTimeout(topTextInterval);

                                topTextInterval = setTimeout(function() {
                                    document.getElementById("topText").style.display = "none";
                                }, settingsMessageDuration);
                            }
                        } else {
                            map[square.y][square.x].value = adjacentMines(map,square.x,square.y);
                            numMines -= 1;
                        }

                        document.getElementById("flags").innerText = flags.toString() +  "/" + numMines.toString();
    
                        for (let i=-1;i<=1;i++) {
                            for (let j=-1;j<=1;j++) {
                                if (i != 0 || j != 0) {
                                    if (square.x+i >= 0 && square.x+i < size_x && square.y+j >= 0 && square.y+j < size_y) {
                                        if (map[square.y+j][square.x+i].value != -1) {
                                            map[square.y+j][square.x+i].value = adjacentMines(map,square.x+i,square.y+j);
                                        }
                                    }
                                }
                            }
                        }
    
                        draw(true);
                    }
                }
            } else if (rightButtonDown && !leftButtonDown && inGame) {
                if (!mapCreator || mapRead) {
                    let f = flag(square);
                    if (f) clicks.right += 1;
                    else if (f == false) clicks.w_right += 1;
                }
            } else if (leftButtonDown && rightButtonDown) {
                if (!chording) return;
    
                let c = chord(square);
                if (c) clicks.chord += 1;
                else if (c==false) clicks.w_chord += 1;
            }
    
            // update cursor
            if (overSquare(canvasX,canvasY) && !map[overSquare(canvasX,canvasY).y][overSquare(canvasX,canvasY).x].opened) {
                canvas.style.cursor = "pointer";
            } else {
                canvas.style.cursor = "default";
            }
        }, 1);
    }
})
canvas.addEventListener("mouseup", (e) => {
    if (panning) {
        let canvasX = e.clientX * window.devicePixelRatio;
        let canvasY = e.clientY * window.devicePixelRatio -  document.getElementById("top").clientHeight * window.devicePixelRatio;

        cam_x -= (canvasX-lastMouse.x);
        cam_y -= (canvasY-lastMouse.y);

        viewChanged();

        draw(true);
    } else {
        if (onMouseDown) return;
        if (double) {
            double = false;
            return
        };
        let canvasX = e.clientX * window.devicePixelRatio;
        let canvasY = e.clientY * window.devicePixelRatio -  document.getElementById("top").clientHeight * window.devicePixelRatio;
        let square = overSquare(canvasX, canvasY);

        if (square == null) return;

        if (!(leftButtonDown && rightButtonDown)) {
            if (leftButtonDown && !rightButtonDown) {
                if (!mapCreator || mapRead) {
                    if (open(square)) clicks.left += 1;
                }
                else {
                    if (square) {
                        if (map[square.y][square.x].value != -1) {
                            if (numMines < 500) {
                                map[square.y][square.x].value = -1;
                                numMines += 1;
                            } else {
                                document.getElementById("topText").innerText = "Maximum number of mines reached (500).";
                                document.getElementById("topText").style.display = "initial";
                                if (topTextInterval != null) clearTimeout(topTextInterval);

                                topTextInterval = setTimeout(function() {
                                    document.getElementById("topText").style.display = "none";
                                }, settingsMessageDuration);
                            }
                        } else {
                            map[square.y][square.x].value = adjacentMines(map,square.x,square.y);
                            numMines -= 1;
                        }

                        document.getElementById("flags").innerText = flags.toString() +  "/" + numMines.toString();
    
                        for (let i=-1;i<=1;i++) {
                            for (let j=-1;j<=1;j++) {
                                if (i != 0 || j != 0) {
                                    if (square.x+i >= 0 && square.x+i < size_x && square.y+j >= 0 && square.y+j < size_y) {
                                        if (map[square.y+j][square.x+i].value != -1) {
                                            map[square.y+j][square.x+i].value = adjacentMines(map,square.x+i,square.y+j);
                                        }
                                    }
                                }
                            }
                        }
    
                        draw(true);
                    }
                }
            } else if (rightButtonDown && !leftButtonDown && inGame) {
                if (!mapCreator || mapRead) {
                    let f = flag(square);
                    if (f) clicks.right += 1;
                    else if (f == false) clicks.w_right += 1;
                };
            }

            // update cursor
            if (overSquare(canvasX,canvasY) && !map[overSquare(canvasX,canvasY).y][overSquare(canvasX,canvasY).x].opened) {
                canvas.style.cursor = "pointer";
            } else {
                canvas.style.cursor = "default";
            }
        } else {
            // chording
            
            
            double = true; // fixes a bug where right + left together does two events

            if (!chording) return;

            let c = chord(square);
            if (c) clicks.chord += 1;
            else if (c==false) clicks.w_chord += 1;

            if (overSquare(canvasX,canvasY) && !map[overSquare(canvasX,canvasY).y][overSquare(canvasX,canvasY).x].opened) {
                canvas.style.cursor = "pointer";
            } else {
                canvas.style.cursor = "default";
            }
        }
    }
});


canvas.addEventListener("mousemove", (e) => {
    if (panning && lastMouse) {
        let canvasX = e.clientX * window.devicePixelRatio;
        let canvasY = e.clientY * window.devicePixelRatio -  document.getElementById("top").clientHeight * window.devicePixelRatio;

        cam_x -= (canvasX-lastMouse.x);
        cam_y -= (canvasY-lastMouse.y);

        viewChanged();

        lastMouse = {x: canvasX, y: canvasY};

        draw(true);
    }
});

document.addEventListener("wheel", (e) => {
    if(e.ctrlKey) {
      e.preventDefault();
  
      return false;
    }
});

canvas.addEventListener("wheel", (e) => {
    if (panning) {
        let direction = e.deltaY > 0 ? 1 : -1;
        let canvasX = e.clientX * window.devicePixelRatio;
        let canvasY = (e.clientY * window.devicePixelRatio -  document.getElementById("top").clientHeight * window.devicePixelRatio);

        let c0 = PosFromCanvasPos(canvasX, canvasY);

        scale -= 0.08 * direction * scale;

        
        let c1 = PosFromCanvasPos(canvasX, canvasY);

        cam_x -= (c1.x - c0.x) * scale;
        cam_y -= (c1.y - c0.y) * scale;

        viewChanged();
        draw(true);
    }
}, {passive:true});

function PosFromCanvasPos(x,y) {
    return {x: (x + cam_x - canvas.width / 2) / scale, y: (y + cam_y - canvas.height / 2) / scale}
}

var touchHold;
var touchPos;
var touchHeld = false;

var touchTimeout;

var notOneTouch = false;

var lastTouch0;
var lastTouch1;

var moved = false;
var moveStart;

var lastTouch;

document.addEventListener("touchstart", (e) => {
    if (e.touches.length == 1) {
        if (panning) {
        } else {
            touchPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            }
            touchHeld = false;
            
            touchHold = true;
            
            touchTimeout = setTimeout(function() {
                if (touchHold && !moved) {
                    touchHeld = true;
                    let canvasX = touchPos.x * window.devicePixelRatio;
                    
                    let canvasY = (touchPos.y -  document.getElementById("top").clientHeight) * window.devicePixelRatio;
                    let square = overSquare(canvasX, canvasY);
                    
                    if (inGame && (!mapCreator || mapRead)) {
                        let f = flag(square);
                        if (f) clicks.right += 1;
                        else if (f == false) clicks.w_right += 1;
                    }
                }
            }, flagHold);
        }

        let canvasX = e.touches[0].clientX * window.devicePixelRatio;
        let canvasY = (e.touches[0].clientY -  document.getElementById("top").clientHeight) * window.devicePixelRatio;
        
        moveStart = {x: canvasX, y: canvasY};
    } else {
    	touchHold = false;
    	
    	notOneTouch = true;
    }
});

canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length == 1) {
        if (panning || easyPanZoom) {
            let canvasX = e.touches[0].clientX * window.devicePixelRatio;
            let canvasY = (e.touches[0].clientY -  document.getElementById("top").clientHeight) * window.devicePixelRatio;

            lastTouch = {x: canvasX, y: canvasY};
            camStart = {x: cam_x, y: cam_y};
        }
    } else if (e.touches.length == 2) {
        if (panning || easyPanZoom) {
            let canvasX0 = e.touches[0].clientX * window.devicePixelRatio;
            let canvasY0 = (e.touches[0].clientY -  document.getElementById("top").clientHeight) * window.devicePixelRatio;

            let canvasX1 = e.touches[1].clientX * window.devicePixelRatio;
            let canvasY1 = (e.touches[1].clientY -  document.getElementById("top").clientHeight) * window.devicePixelRatio;

            lastTouch0 = {x: canvasX0, y: canvasY0};
            lastTouch1 = {x: canvasX1, y: canvasY1};
        }
    }
}, {passive:true});

document.addEventListener("touchmove", (e) => {
    touchPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
    }
});

canvas.addEventListener("touchmove", (e) => {
    if (e.touches.length == 1) {
        if (panning || moved) {
            let canvasX = e.touches[0].clientX * window.devicePixelRatio;
            let canvasY = (e.touches[0].clientY -  document.getElementById("top").clientHeight) * window.devicePixelRatio;

            cam_x -= (canvasX-lastTouch.x);
            cam_y -= (canvasY-lastTouch.y);

            viewChanged();

            draw(true);

            lastTouch = {x: canvasX, y: canvasY};
        } else if (easyPanZoom) {
            let canvasX = e.touches[0].clientX * window.devicePixelRatio;
            let canvasY = (e.touches[0].clientY -  document.getElementById("top").clientHeight) * window.devicePixelRatio;

            if (Math.sqrt(Math.pow(moveStart.x-canvasX, 2) + Math.pow(moveStart.y-canvasY, 2)) > 3 * window.devicePixelRatio && !moved) {
                moved = true;

                cam_x = camStart.x - (canvasX-moveStart.x);
                cam_y = camStart.y - (canvasY-moveStart.y);

                viewChanged();

                draw(true);
    
            }
            lastTouch = {x: canvasX, y: canvasY};
        }
    } else if (e.touches.length == 2) {
        if (panning || easyPanZoom) {
            moved = true;
            let canvasX0 = e.touches[0].clientX * window.devicePixelRatio;
            let canvasY0 = (e.touches[0].clientY -  document.getElementById("top").clientHeight) * window.devicePixelRatio;

            let canvasX1 = e.touches[1].clientX * window.devicePixelRatio;
            let canvasY1 = (e.touches[1].clientY -  document.getElementById("top").clientHeight) * window.devicePixelRatio;
            
            
            let canvasX = (canvasX0 + canvasX1) / 2;
            let canvasY = (canvasY0 + canvasY1) / 2;

            let c0 = PosFromCanvasPos(canvasX, canvasY);

            scale *= Math.sqrt(Math.pow(canvasX0-canvasX1, 2) + Math.pow(canvasY0-canvasY1, 2)) / Math.sqrt(Math.pow(lastTouch0.x-lastTouch1.x, 2) + Math.pow(lastTouch0.y-lastTouch1.y,2));

            let c1 = PosFromCanvasPos(canvasX, canvasY);

            cam_x -= (c1.x - c0.x) * scale;
            cam_y -= (c1.y - c0.y) * scale;

            lastTouch0 = {x: canvasX0, y: canvasY0};
            lastTouch1 = {x: canvasX1, y: canvasY1};

            viewChanged();
            draw(true);
        }
    }
}, {passive:true})

canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    if (panning || easyPanZoom) {
        if (e.touches.length == 0) {
            notOneTouch = false;
        } else if (e.touches.length == 1) {
            let canvasX = e.touches[0].clientX * window.devicePixelRatio;
            let canvasY = (e.touches[0].clientY -  document.getElementById("top").clientHeight) * window.devicePixelRatio;

            lastTouch = {x: canvasX, y: canvasY};
        }
    }
    if (!panning) {
        if (e.touches.length == 0) {
            if (!notOneTouch && !moved) {
                let canvasX = touchPos.x * window.devicePixelRatio;
                
                let canvasY = (touchPos.y -  document.getElementById("top").clientHeight) * window.devicePixelRatio;
                let square = overSquare(canvasX, canvasY);
                
                touchHold = false;
                clearTimeout(touchTimeout);
                
                if (!touchHeld) {
                    if (square) {
                        if (!mapCreator || mapRead) {
                            if (!map[square.y][square.x].opened) {
                                if (open(square)) clicks.left += 1;
                            } else {
                                let c = chord(square);
                                if (c) clicks.chord += 1;
                                else if (c==false) clicks.w_chord += 1;
                            }
                        } else {
                            if (square) {
                                if (map[square.y][square.x].value != -1) {
                                    if (numMines < 500) {
                                        map[square.y][square.x].value = -1;
                                        numMines += 1;
                                    } else {
                                        document.getElementById("topText").innerText = "Maximum number of mines reached (500).";
                                        document.getElementById("topText").style.display = "initial";
                                        if (topTextInterval != null) clearTimeout(topTextInterval);
    
                                        topTextInterval = setTimeout(function() {
                                            document.getElementById("topText").style.display = "none";
                                        }, settingsMessageDuration);
                                    }
                                } else {
                                    map[square.y][square.x].value = adjacentMines(map,square.x,square.y);
                                    numMines -= 1;
                                }
    
                                document.getElementById("flags").innerText = flags.toString() +  "/" + numMines.toString();
            
                                for (let i=-1;i<=1;i++) {
                                    for (let j=-1;j<=1;j++) {
                                        if (i != 0 || j != 0) {
                                            if (square.x+i >= 0 && square.x+i < size_x && square.y+j >= 0 && square.y+j < size_y) {
                                                if (map[square.y+j][square.x+i].value != -1) {
                                                    map[square.y+j][square.x+i].value = adjacentMines(map,square.x+i,square.y+j);
                                                }
                                            }
                                        }
                                    }
                                }
            
                                draw(true);
                            }
                        }
                    }        
                }
            }
            notOneTouch = false;
        }
    }
    if (e.touches.length == 0) {
        moved = false;
    }
});

var pauseStart;
function unpause() {
    if (paused) {
        paused = false;
        
        pausedTime += Date.now() - pauseStart;
        document.getElementById("pause").classList.remove("fa-circle-play");
        document.getElementById("pause").classList.add("fa-circle-pause");
        
        canvas.style.display = "block";
        document.getElementById("pausedScreen").style.display = "none";

        if ((!mapCreator && !mapRead) && startTime != null) {
            let elapsedTime = Date.now() - startTime;
            document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);
        }
        
        draw(true);
    }
}

function pause() {
    if (!paused) {
        paused = true;

        pauseStart = Date.now();
            
        document.getElementById("pause").classList.remove("fa-circle-pause");
        document.getElementById("pause").classList.add("fa-circle-play");
        
        canvas.style.display = "none"
        document.getElementById("pausedScreen").style.display = "flex";

        if (!mapCreator && !mapRead) {
            let elapsedTime = Date.now() - startTime;
            document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);
        }

        draw(true);
    }
}


var lastPause = paused;

function pauseUnpause() {
    if (settings || stats || !inGame || (mapCreator && !mapRead) || document.getElementById("clickAnywhere").style.display != "none") return;

    if (lastPause) {
        unpause();
    } else {
        pause();
    }

    lastPause = paused;
}

document.getElementById("pauseButton").addEventListener("click", pauseUnpause);

document.getElementById("restartButton").addEventListener("click", (e) => {
    inGame = false;
    
    clearInterval(interval);
    
    refreshMap(mapCustomMade);
    draw(true);

    if (sessionStorage.getItem("pointer") == "true") {
        canvas.style.cursor = "pointer";
        cursor = "pointer";
    }
});

document.getElementById("moveButton").addEventListener("click", (e) => {
    if (panning) {
        document.getElementById("moveIcon").classList.remove("fa-arrow-pointer");
        document.getElementById("moveIcon").classList.add("fa-up-down-left-right"); 
    
        lastMouse = null;

        canvas.style.cursor = cursor;
    } else {
        document.getElementById("moveIcon").classList.remove("fa-up-down-left-right");
        document.getElementById("moveIcon").classList.add("fa-arrow-pointer"); 
    
        canvas.style.cursor = "move";
    }

    panning = !panning;
});


document.getElementById("statsButton").addEventListener("click", (e) => {
    if (stats) {
        stats = false;
        document.getElementById("game").style.display = "block";
        document.getElementById("stats").style.display = "none";

        document.getElementById("keybindsScreen").style.display = "none";

        if (inGame && !lastPause) unpause();
    } else {
        settings = false;
        stats = true;

        getStats();
        updateStatsAllGames();
        updateStatsBeginner();
        updateStatsIntermediate();
        updateStatsExpert();
        updateStatsDaily();
        
        document.getElementById("game").style.display = "none";
        document.getElementById("settings").style.display = "none";
        document.getElementById("stats").style.display = "block";
        
        document.getElementById("keybindsScreen").style.display = "none";
        
        if (inGame) pause();
    }
});

document.getElementById("settingsButton").addEventListener("click", (e) => {
    if (settings) {
        settings = false;
        document.getElementById("game").style.display = "block";
        document.getElementById("settings").style.display = "none";

        document.getElementById("keybindsScreen").style.display = "none";

        update();
        draw(true);

        if (inGame && !lastPause) unpause();

        if (!inGame && first && (!mapCreator || mapRead)) {
            if (newNumMines) {
                numMines = newNumMines;
                newNumMines = null;
            }
            if (new_x) {
                size_x = new_x;
                new_x = null;
            }
            if (new_y) {
                size_y = new_y;
                new_y = null;
            }

            refreshMap(mapRead || mapCustomMade);
        }
    } else {
        stats = false;
        settings = true;
        document.getElementById("game").style.display = "none";
        document.getElementById("stats").style.display = "none";
        document.getElementById("settings").style.display = "block";

        document.getElementById("keybindsScreen").style.display = "none";

        if (inGame) pause();
    }
});

if (params.get("t")) {
    document.getElementById("game").style.display = "none";
    document.getElementById("settings").style.display = "block";

    document.getElementById("keybindsScreen").style.display = "none";

    inGame = false;

    clearInterval(interval);

    refreshMap();
}

if (sessionStorage.getItem("pointer") == "true") {
    canvas.style.cursor = "pointer"; 

    cursor = "pointer";
}

document.addEventListener('keydown', function(e) {
    if (document.getElementById("keybindsScreen").style.display == "flex" && shortcutID != "") return
    let heldKeys = [];
    if (e.ctrlKey) {
        heldKeys.push("CONTROL");
    }

    if (e.altKey) {
        heldKeys.push("ALT");
    }

    if (e.shiftKey) {
        heldKeys.push("SHIFT");
    }

    if (!heldKeys.includes(e.key.toUpperCase())) {
        heldKeys.push(e.key.toUpperCase().replace(" ", "SPACE"));
    }

    if (heldKeys == "ARROWUP") {
        cam_y += 15;
        draw(true);
    } else if (heldKeys == "ARROWDOWN") {
        cam_y -= 15;
        draw(true);
    } else if (heldKeys == "ARROWLEFT") {
        cam_x += 15;
        draw(true);
    } else if (heldKeys == "ARROWRIGHT") {
        cam_x -= 15;
        draw(true);
    }

    if (heldKeys.join("+") == pauseShortcut) {
        e.preventDefault();
        pauseUnpause();
    } else if (heldKeys.join("+") == restartShortcut) {
        e.preventDefault();
        inGame = false;
    
        clearInterval(interval);
        
        refreshMap(mapCustomMade);
        draw(true);
        
        if (sessionStorage.getItem("pointer") == "true") {
            canvas.style.cursor = "pointer"; 

            cursor = "pointer";
        }
    } else if (heldKeys.join("+") == panZoomShortcut) {
        if (panning) {
            document.getElementById("moveIcon").classList.remove("fa-arrow-pointer");
            document.getElementById("moveIcon").classList.add("fa-up-down-left-right"); 
        
            lastMouse = null;

            canvas.style.cursor = cursor;
        } else {
            document.getElementById("moveIcon").classList.remove("fa-up-down-left-right");
            document.getElementById("moveIcon").classList.add("fa-arrow-pointer"); 
        
            canvas.style.cursor = "move";
        }

        panning = !panning;
    } else if (heldKeys.join("+") == statsShortcut) {
        if (stats) {
            stats = false;
            document.getElementById("game").style.display = "block";
            document.getElementById("stats").style.display = "none";
    
            document.getElementById("keybindsScreen").style.display = "none";
    
            if (inGame && !lastPause) unpause();
        } else {
            settings = false;
            stats = true;

            getStats();
            updateStatsAllGames();
            updateStatsBeginner();
            updateStatsIntermediate();
            updateStatsExpert();
            updateStatsDaily();
            
            document.getElementById("game").style.display = "none";
            document.getElementById("settings").style.display = "none";
            document.getElementById("stats").style.display = "block";
            
            document.getElementById("keybindsScreen").style.display = "none";
            
            if (inGame) pause();
        }
    } else if (heldKeys.join("+") == settingsShortcut) {
        e.preventDefault();
        if (settings) {
            settings = false;
            document.getElementById("game").style.display = "block";
            document.getElementById("settings").style.display = "none";

            document.getElementById("keybindsScreen").style.display = "none";
            
            update();
            draw(true);

            if (inGame && !lastPause) unpause();

            if (!inGame && first && (!mapCreator || mapRead)) {
                if (newNumMines) {
                    numMines = newNumMines;
                    newNumMines = null;
                }
                if (new_x) {
                    size_x = new_x;
                    new_x = null;
                }
                if (new_y) {
                    size_y = new_y;
                    new_y = null;
                }
    
            refreshMap(mapRead || mapCustomMade);
            }
        } else {
            stats = false;
            settings = true;
            document.getElementById("game").style.display = "none";
            document.getElementById("stats").style.display = "none";
            document.getElementById("settings").style.display = "block";

            document.getElementById("keybindsScreen").style.display = "none";
    
            if (inGame) pause();
        }
    }
});


window.addEventListener('blur', function() {
    if (inGame && document.getElementById("clickAnywhere").style.display != "flex" && (!mapCreator || mapRead)) {
        //pause();
        //lastPause = true;
    }
});


var topTextInterval;

document.getElementById("shareMap").addEventListener("click", (e) => {
    let data = size_x.toString(36) + "," + size_y.toString(36) + ";";

    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map[y][x].value == -1) {
                data += (y * size_x + x).toString(36) + ",";
            }
        }
    }

    let b64 = btoa(data);

    navigator.clipboard.writeText("nicholachen.github.io/minesweeper?m=" + b64);
    document.getElementById("topText").innerText = "Share link copied.";
    document.getElementById("topText").style.display = "initial";
    if (topTextInterval != null) clearTimeout(topTextInterval);

    topTextInterval = setTimeout(function() {
        document.getElementById("topText").style.display = "none";
    }, settingsMessageDuration);
});

function getMap(s) {
    try {
        let data = atob(s).split(";");
        let x =  parseInt(data[0].split(",")[0], 36);
        let y = parseInt(data[0].split(",")[1], 36);
        let mines = data[1].split(",").filter(i => i != "").map(i => _idToTile(parseInt(i, 36),x));

        mines = mines.filter(i => i.x >= 0 || i.x < x || i.y >= 0 || i.y < y);

        let m = [];
        for (let i = 0; i < y; i++) {
            m[i] = [];
            for (let j = 0; j < x; j++) {
                m[i][j] = {value: NaN, opened: false, flagged: false};
            }
        }

        for (let i = 0; i < mines.length; i++) {
            m[mines[i].y][mines[i].x].value = -1;
        }
        for (let i = 0; i < y; i++) {
            for (let j = 0; j < x; j++) {
                if (m[i][j].value != -1) m[i][j].value = adjacentMines(m,j,i);
            }
        }

        return {m:m, x:x, y:y, n:mines.length};

    } catch {
        return null;
    }
}

document.getElementById("resetMap").addEventListener("click", (e) => {
    for (let i = 0; i < size_y; i++) {
        for (let j = 0; j < size_x; j++) {
            map[i][j] = {value: 0, opened: false, flagged: false};
        }
    }
    numMines = 0;

    document.getElementById("flags").innerText = "0/" + numMines.toString();
    
    update();
    draw(true);
});


function getMapDaily(s) {
    try {
        let data = atob(s).split(";");
        let x =  parseInt(data[0].split(",")[0], 36);
        let y = parseInt(data[0].split(",")[1], 36);
        let mines = data[1].split(",").filter(i => i != "").map(i => _idToTile(parseInt(i, 36),30));

        mines = mines.filter(i => i.x >= 0 || i.x < 30 || i.y >= 0 || i.y < 16);

        let m = [];
        for (let i = 0; i < 16; i++) {
            m[i] = [];
            for (let j = 0; j < 30; j++) {
                m[i][j] = {value: NaN, opened: false, flagged: false};
            }
        }
        
        m[y][x].first = true;

        for (let i = 0; i < mines.length; i++) {
            m[mines[i].y][mines[i].x].value = -1;
        }
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 30; j++) {
                if (m[i][j].value != -1) m[i][j].value = adjacentMines(m,j,i);
            }
        }

        return {m:m, x:x, y:y, n:mines.length};

    } catch {
        return null;
    }
}


document.getElementById("dailyIcon").addEventListener("click", (e) => {
    let d = new Date().toISOString().split('T')[0];

    console.log("LOADING " + d + ": " + dailyCodes[d]);

    lastDaily = localStorage.getItem("daily");
    
    let todayPlayed = lastDaily == d;

    if (!todayPlayed) {
        dailyTries = 0;
        localStorage.setItem("dailyTries", dailyTries);
    }

    let last = new Date();
    last.setDate(last.getDate() - 1);

    if (localStorage.getItem("daily") != last.toISOString().split('T')[0]) {
        dailyCurrentWinStreak = 0;
        localStorage.setItem("dailyCurrentWinStreak", dailyCurrentWinStreak);
    } else {
        dailyCurrentWinStreak = isNaN(Number(localStorage.getItem("dailyCurrentWinStreak"))) || Number(localStorage.getItem("dailyCurrentWinStreak")) < 0 ? 0 : Number(localStorage.getItem("dailyCurrentWinStreak"));
    }
    console.log("LAST: " + last.toISOString().split('T')[0]);
    console.log("lastDaily", lastDaily)
    console.log(dailyCurrentWinStreak);

    console.log(todayPlayed);

    let dailycode = dailyCodes[d];

    if (dailycode != null && !daily) {
        clearInterval(interval);

        oldSizeX = size_x;
        oldSizeY = size_y;
        oldNumMines = numMines;
        oldDifficulty = difficulty;


        document.getElementById("mapCreatorTop").style.display = "none";

        let m = getMapDaily(dailycode);

        size_x = 30;
        size_y = 16;

        difficulty = "Expert";

        numMines = m.n;

        daily = true;
        map = m.m;

        mapRead = true;
        mapCustomMade = true;


        map3BV = threeBV();



        refreshMap(true);
    } else if (daily) {

        numMines = oldNumMines;
        size_x = oldSizeX;
        size_y = oldSizeY;
        difficulty = oldDifficulty;


        daily = false;

        for (let i = 0; i < size_y; i++) {
            for (let j = 0; j < size_x; j++) {
                if (isNaN(map[i][j].value)) map[i][j].value = 0;
                if (map[i][j].flagged) map[i][j].flagged = false;
                if (map[i][j].opened) map[i][j].opened = false;
            }
        }

        if (mapCreator) {
            document.getElementById("mapCreatorTop").style.display = "block";
        }
        inGame = false;
        mapCustomMade = true;

        mapRead = false;

        clearInterval(interval);
        refreshMap();
        
    
        document.getElementById("gameEnd").style.display = "none";
    }
});

// for (let i=0;i<10000;i++) {
//     for (let i = 0; i < size_y; i++) {
//         for (let j = 0; j < size_x; j++) {
//             map[i][j] = {value: NaN, opened: false, flagged: false};
//         }
//     }

//     let firstx = Math.floor(Math.random() * size_x);
//     let firsty = Math.floor(Math.random() * size_y);

//     generate(numMines, firstx, firsty);

//     let data = firstx.toString(36) + "," + firsty.toString(36) + ";";

//     for (let x=0;x<size_x;x++) {
//         for (let y=0;y<size_y;y++) {
//             if (map[y][x].value == -1) {
//                 data += (y * size_x + x).toString(36) + ",";
//             }
//         }
//     }

//     let b64 = btoa(data);


//     console.log(b64);
// }


/* TODO (not in order)
 X Pause/unpause shortcut
 ~ More themes
 X Share map+map id
 X Google SEO, meta, description, etc...
 X Import/export themes
 X Import/export settings
 X favicon
 X Infinite lives
 X settings page doesn't reset game
 ~ Stats page for each difficulty
 - Show only mobile settings
 X Zoom and pan for mobile
 - Cool new gamemodes
 X Drop shadow for "floating" buttons
 - Daily puzzle
 - Login/account system
*/