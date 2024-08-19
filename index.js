const VERSION = "1.8.0";
document.getElementById("logoVersion").innerText = "v" + VERSION;
document.getElementById("versionFooter").innerText = "v" + VERSION;


fetch("https://api.github.com/repos/nicholachen/minesweeper/releases/tags/"+"v"+VERSION).then((response) => response.json()).then((json) => {
    if (json.html_url == null) {
        return;
    }
    document.getElementById("logoVersion").href = json.html_url;
    document.getElementById("versionFooter").href = json.html_url;
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const margin = 0.03; // percentage of each grid square

const canvasMargin = 16; // pixels

var settings = false;
var stats = false;

var difficulty = localStorage.getItem("difficulty") ?? "Beginner";

var size_x = isNaN(Number(localStorage.getItem("mapX"))) || Number(localStorage.getItem("mapX")) < 5 ? 10 : Number(localStorage.getItem("mapX"));
var size_y = isNaN(Number(localStorage.getItem("mapY"))) || Number(localStorage.getItem("mapY")) < 5 ? 10 : Number(localStorage.getItem("mapY"));

var numMines = isNaN(Number(localStorage.getItem("mines"))) || Number(localStorage.getItem("mines")) <= 0 || Number(localStorage.getItem("mines")) > Math.floor(size_x * size_y / 2) ?  15 : Number(localStorage.getItem("mines"));

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


var infiniteLives = localStorage.getItem("infiniteLives") == "true";

var onMouseDown = localStorage.getItem("onMouseDown") != "false";
var chording = localStorage.getItem("chording") != "false";

var pauseShortcut = localStorage.getItem("pauseShortcut") ?? "SPACE";
var restartShortcut = localStorage.getItem("restartShortcut") ?? "ESCAPE";
var settingsShortcut = localStorage.getItem("settingsShortcut") ?? "S";

var flagHold = isNaN(Number(localStorage.getItem("flagHold"))) || Number(localStorage.getItem("flagHold")) < 50 ?  250 : Number(localStorage.getItem("flagHold"));

var showTimer = localStorage.getItem("showTimer") != "false";
var showFlags = localStorage.getItem("showFlags") != "false";
var showPause = localStorage.getItem("showPause") != "false";
var showRestart = localStorage.getItem("showRestart") != "false";

var show3BV = localStorage.getItem("show3BV") == "true";

// stats

var wins = isNaN(Number(localStorage.getItem("wins"))) || Number(localStorage.getItem("wins")) < 0 ? 0 : Number(localStorage.getItem("wins"));
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

var intermediateAverageTime = isNaN(Number(localStorage.getItem("intermediateAverageTime"))) || Number(localStorage.getItem("intermediateAverageTime")) < 0 ? 0 : Number(localStorage.getItem("intermediateAverageTime")); // in ms

const params = new URLSearchParams(document.location.search);

function readSetting() {
    if (params.get("s")) {
        try {
            let s = params.get("s");
        
            let t = JSON.parse(atob(s));

            if (t.t == null) return;

            theme = t.t;
            
            if (theme.key == "custom") {
                themes.custom = theme;
            }

            setTheme(theme);

            document.getElementById("saveImportedSettings").innerText = "Save imported theme";
            document.getElementById("cancelImportedSettings").innerText = "Cancel imported theme";

            document.getElementById("saveImportedSettings").style.display = "inline";
            document.getElementById("cancelImportedSettings").style.display = "inline";

            if (typeof(t.w) != "number" || t.w < 5 || t.w >= 100) return
            if (typeof(t.h) != "number" || t.h < 5 || t.h >= 100) return
            if (typeof(t.n) != "number" || t.n <= 0 || t.h > Math.floor(t.w * t.h / 2)) return
            
            if (typeof(t.il) != "boolean") return;
            
            
            if (typeof(t.md) != "boolean") return;
            if (typeof(t.c) != "boolean") return;
            if (typeof(t.ps) != "string") return;
            if (typeof(t.rs) != "string") return;
            if (typeof(t.ss) != "string") return;
            if (typeof(t.fh) != "number" || t.fh < 100) return;

            if (typeof(t.st) != "boolean") return;
            if (typeof(t.sf) != "boolean") return;
            if (typeof(t.sp) != "boolean") return;
            if (typeof(t.sr) != "boolean") return;


            size_x = t.w;
            size_y = t.h;

            numMines = t.n;
            infiniteLives = t.il;

            onMouseDown = t.md;
            chording = t.c;

            pauseShortcut = t.ps;
            restartShortcut = t.rs;
            settingsShortcut = t.ss;

            flagHold = t.fh;

            showTimer = t.st;
            showFlags = t.sf;
            showPause = t.sp;
            showRestart = t.sr;
            
            show3BV = t.tb == true;

            document.getElementById("saveImportedSettings").innerText = "Save imported settings";
            document.getElementById("cancelImportedSettings").innerText = "Cancel imported settings";

            document.getElementById("saveImportedSettings").style.display = "inline";
            document.getElementById("cancelImportedSettings").style.display = "inline";
        } catch (e) {
        }
    }
}

readSetting();



var settingsMessageDuration = 5000;

var inGame = false;
var paused = false;

var map = []; // -1 represents a mine

var flags = 0;

var startTime;
var pausedTime = 0;

var interval;
var first = true;

var map3BV;


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
    if (!inGame && first) refreshMap();
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

function refreshMap() {
    document.getElementById("gameEnd").style.display = "none";

    paused = false;
    lastPause = false;

    document.getElementById("pause").classList.remove("fa-circle-play");
    document.getElementById("pause").classList.add("fa-circle-pause");

    canvas.style.display = "block";
    document.getElementById("pausedScreen").style.display = "none";


    document.getElementById("flags").innerText = "0/" + numMines.toString();
    document.getElementById("timer").innerText = "0.0s";
    document.getElementById("clickAnywhere").style.display = "flex";

    if (difficulty != "Custom") {
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
    
    first = true;
    flags = 0;
    map = [];
    for (let i = 0; i < size_y; i++) {
        map[i] = [];
        for (let j = 0; j < size_x; j++) {
            map[i][j] = {value: NaN, opened: false, flagged: false};
        }
    }

    draw(true);
}
refreshMap();

function generate(mines, firstx, firsty) {
    let mineTiles = [];

    for (let x=0;x<size_x;x++) { // force first tile to not have a number on it
        for (let y=0;y<size_y;y++) {
            if (Math.abs(firstx - x) > 1 || Math.abs(firsty - y) > 1) {
                mineTiles.push([x,y]);
            }
        }
    }

    for (let i=0;i<mines;i++) {
        let b= Math.floor(Math.random() * mineTiles.length);

        map[mineTiles[b][1]][mineTiles[b][0]].value = -1;
        mineTiles.splice(b,1);
    }



    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map[y][x].value != -1) {
                map[y][x].value = adjacentMines(x,y);
            }
        }
    }
    
    
    map3BV = threeBV();
}

function adjacentMines(x,y) {
    let m = 0;
    for (let i=-1;i<=1;i++) {
        for (let j=-1;j<=1;j++) {
            if (i != 0 || j != 0) {
                if (x+i >= 0 && x+i < size_x && y+j >= 0 && y+j < size_y) {
                    if (map[y+j][x+i].value == -1) {
                        m += 1;
                    }
                }
            }
        }
    }

    return m;
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
    
    console.log(i)
    
    return i
}

function idToTile(n) {
    return {x: n%size_x, y: Math.floor(n/size_x)}
}
function exposeTile(x,y) {
    if (!inGame || paused || x < 0 || x >= size_x || y < 0 || y >= size_y) {
        return
    }
    if (map[y][x].opened) return;
    
    if (map[y][x].value == 0) {
        _exposeTile(map,x,y);
    } else if (map[y][x].value == -1) {
        map[y][x].opened = true; // LOSE
    
        if (!infiniteLives) {
            inGame = false;

            clearInterval(interval);
            let elapsedTime = Date.now() - startTime;
            document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);
    
            hours += elapsedTime - pausedTime;
            gamesPlayed += 1;
            
            updateStatsAllGames();
            
            if (difficulty == "Beginner") {
				beginnerGamesPlayed += 1;

				updateStatsBeginner();
			}
    
            for (let x = 0; x < size_x; x++) {
                for (let y = 0; y < size_y; y++) {
                    if (map[y][x].value == -1) {
                        map[y][x].opened = true;
                    }
                }
            }
            document.getElementById("time").style.display = "none";
            document.getElementById("3BVSec").style.display = "none";
            document.getElementById("gameEndText").innerText = "Game Over!";
            document.getElementById("gameEnd").style.display = "flex";
        }
    } else {
        map[y][x].opened = true;
    }
    
    
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
    
    let opened = true;
    
    for (let x = 0; x < size_x; x++) {
        for (let y = 0; y < size_y; y++) {
            if (!map[y][x].opened && map[y][x].value != -1) {
                opened = false;
                break;
            }
        }
    }
    
    if (opened) { // WIN (all tiles opened)
        inGame = false;
        clearInterval(interval);
        let elapsedTime = Date.now() - startTime;
        document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);
    
        hours += elapsedTime - pausedTime;
        wins += 1;
        gamesPlayed += 1;
        
        updateStatsAllGames();
        
        if (difficulty == "Beginner") {
        	beginnerAverageTime = (beginnerAverageTime*beginnerWins + (elapsedTime-pausedTime))/(beginnerWins+1);
        	
        	beginnerWins += 1;
        	beginnerGamesPlayed += 1;
        	
        	updateStatsBeginner();
        }
    
        document.getElementById("time").style.display = "block";
        document.getElementById("3BVSec").style.display = show3BV ? "block" : "none";
        document.getElementById("3BVSec").innerText = "3BV/sec: " + (map3BV / ((elapsedTime - pausedTime) / 1000)).toFixed(1);
        
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
    
    let squareSize = Math.min((canvas.width-2*canvasMargin)/size_x,(canvas.height-2*canvasMargin)/size_y);
    let startx = canvas.width/2 - squareSize * size_x / 2;
    let starty = canvas.height/2 - squareSize * size_y / 2;


    ctx.font = (squareSize / 1.5).toString() + "px monospace, monospace";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (!paused) {
                if (!map[y][x].opened) {
                    ctx.fillStyle = theme.unopened;
                } else {
                    if (map[y][x].value == -1) {
                        ctx.fillStyle = "rgba(200,0,0,0.6)";

                        if (map[y][x].flagged) {
                            ctx.fillStyle = "rgba(200,0,0,0.3)";
                        }
                    } else {
                        ctx.fillStyle = theme.opened;
                    }
                }

                ctx.fillRect(startx+x*squareSize + squareSize*margin,starty+y*squareSize + squareSize*margin,squareSize - squareSize*margin,squareSize - squareSize*margin);
                
                if (!map[y][x].opened) {
                } else {
                    if (map[y][x].value > 0) {
                        ctx.fillStyle = theme.text;
                        
                        ctx.fillText(map[y][x].value.toString(), startx+x*squareSize + squareSize/2, starty+y*squareSize + squareSize/2);
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
    let squareSize = Math.min((canvas.width-2*canvasMargin)/size_x,(canvas.height-2*canvasMargin)/size_y);
    let startx = canvas.width/2 - squareSize * size_x / 2;
    let starty = canvas.height/2 - squareSize * size_y / 2;

    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (!map[y][x].opened) {
                ctx.fillStyle = "rgba(50,50,50,0.5)";
            }

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
    refreshMap();

    document.getElementById("gameEnd").style.display = "none";
});

document.addEventListener("mousemove", (e) => {
    let canvasX = e.clientX;
    let canvasY = e.clientY -  document.getElementById("top").clientHeight;
    
    if (first && !inGame || inGame) {
        if (overSquare(canvasX,canvasY) && !map[overSquare(canvasX,canvasY).y][overSquare(canvasX,canvasY).x].opened) {
            canvas.style.cursor = "pointer";
        } else {
            canvas.style.cursor = "default";
        }
    } 
    sessionStorage.setItem("pointer", overSquare(canvasX,canvasY) != null);
});

var touch = false;

var leftButtonDown = false;
var rightButtonDown = false;

document.addEventListener("mousedown", function (e) {
    if (e.button == 0) {
        leftButtonDown = true;
    } else if (e.button == 2) {
        rightButtonDown = true;
    }
});

document.addEventListener("mouseup", function (e) {
    if (e.button == 0) {
        leftButtonDown = false;
    } else if (e.button == 2) {
        rightButtonDown = false;
    }
});

var double = false


function open(square) {
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
                }, 1);
            }
            exposeTile(square.x, square.y);
            draw(true);
        }
    }
}

function flag(square) {
    if (square) {
        if (!map[square.y][square.x].opened) {
            console.log("flag",square);
            map[square.y][square.x].flagged = !map[square.y][square.x].flagged;
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
        }
    }
}

function chord(square) {
    if (square) {
        if (map[square.y][square.x].opened && map[square.y][square.x].value != 0) {

            let f = adjacentFlags(square.x, square.y);

            if (f == map[square.y][square.x].value) {
                console.log("chord",square);
                for (let i=-1;i<=1;i++) {
                    for (let j=-1;j<=1;j++) {
                        if (i != 0 || j != 0) {
                            if (square.x+i >= 0 && square.x+i < size_x && square.y+j >= 0 && square.y+j < size_y && !map[square.y+j][square.x+i].flagged) {
                                exposeTile(square.x+i, square.y+j);
                            }
                        }
                    }
                }
            }
            draw(true);
        }
    }
}
var mouseTimeout;
canvas.addEventListener("mousedown", (e) => {
    if (!onMouseDown) return;
    let canvasX = e.clientX;
    let canvasY = e.clientY -  document.getElementById("top").clientHeight;
    let square = overSquare(canvasX, canvasY);

    if (mouseTimeout) clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(function() {
        if (!(leftButtonDown && rightButtonDown)) {
            if (e.button == 0) {
                open(square);
            } else if (e.button == 2 && inGame) {
                flag(square);
            } else if (e.button == 1) {
                if (!chording) return;
    
                chord(square);
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
    
            chord(square);
        }
    }, 1)
    
})
canvas.addEventListener("mouseup", (e) => {
    if (onMouseDown) return;
    if (double) {
        double = false;
        return
    };
    let canvasX = e.clientX;
    let canvasY = e.clientY -  document.getElementById("top").clientHeight;
    let square = overSquare(canvasX, canvasY);


    if (!(leftButtonDown && rightButtonDown)) {
        if (e.button == 0) {
            open(square);
        } else if (e.button == 2 && inGame) {
            flag(square);
        } else if (e.button == 1) {
            if (!chording) return;

            chord(square);
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

        chord(square);
    }
});

var touchHold;
var touchPos;
var touchHeld = false;

var touchTimeout;
document.addEventListener("touchstart", (e) => {
    if (e.touches.length == 1) {
        touchPos = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        }
        touchHeld = false;
        
        touchHold = true;
         
        touchTimeout = setTimeout(function() {
            if (touchHold) {
                touchHeld = true;
                let canvasX = touchPos.x * window.devicePixelRatio;
                
                let canvasY = (touchPos.y -  document.getElementById("top").clientHeight) * window.devicePixelRatio;
                let square = overSquare(canvasX, canvasY);
                
                if (inGame) flag(square);
            }
        }, flagHold);
    } else {
    touchHold = false;
    }
});

document.addEventListener("touchmove", (e) => {
    touchPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
    }
})

canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    if (e.touches.length == 0) {
        let canvasX = touchPos.x * window.devicePixelRatio;
          
        let canvasY = (touchPos.y -  document.getElementById("top").clientHeight) * window.devicePixelRatio;
        let square = overSquare(canvasX, canvasY);
        
        touchHold = false;
        clearTimeout(touchTimeout);
        
        if (!touchHeld) {
            if (square) {
                if (!map[square.y][square.x].opened) {
                    open(square);
                } else {
                    chord(square);
                }
            }        
        }
    }
})

var pauseStart;
function unpause() {
    if (paused) {
        paused = false;
        
        pausedTime += Date.now() - pauseStart;
        document.getElementById("pause").classList.remove("fa-circle-play");
        document.getElementById("pause").classList.add("fa-circle-pause");
        
        canvas.style.display = "block";
        document.getElementById("pausedScreen").style.display = "none";

         
        let elapsedTime = Date.now() - startTime;
        document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);

        
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

        let elapsedTime = Date.now() - startTime;
        document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);

        draw(true);
    }
}


var lastPause = paused;

function pauseUnpause() {
    if (settings || stats || !inGame) return;

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
    
    refreshMap();
    draw(true);

    if (sessionStorage.getItem("pointer") == "true") {
        canvas.style.cursor = "pointer"; 
    }
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

        if (inGame && !lastPause) unpause();
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

if (params.get("s")) {
    document.getElementById("game").style.display = "none";
    document.getElementById("settings").style.display = "block";

    document.getElementById("keybindsScreen").style.display = "none";

    inGame = false;

    clearInterval(interval);

    refreshMap();
}

if (sessionStorage.getItem("pointer") == "true") {
    canvas.style.cursor = "pointer"; 
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

    if (heldKeys.join("+") == pauseShortcut) {
        e.preventDefault();
        pauseUnpause();
    } else if (heldKeys.join("+") == restartShortcut) {
        e.preventDefault();
        inGame = false;
    
        clearInterval(interval);
        
        refreshMap();
        draw(true);
        
        if (sessionStorage.getItem("pointer") == "true") {
            canvas.style.cursor = "pointer"; 
        }
    } else if (heldKeys.join("+") == settingsShortcut) {
        e.preventDefault();
        if (settings) {
            settings = false;
            document.getElementById("game").style.display = "block";
            document.getElementById("settings").style.display = "none";

            document.getElementById("keybindsScreen").style.display = "none";
    
            if (inGame && !lastPause) unpause();
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

/* TODO (not in order)
 X Pause/unpause shortcut
 ~ More themes
 - Share map+map id
 X Google SEO, meta, description, etc...
 X Import/export themes
 X Import/export settings
 X favicon
 X Infinite lives
 X settings page doesn't reset game
 ~ Stats page for each difficulty
 - Show only mobile settings
 - Zoom and pan for mobile
*/