const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const margin = 0.03; // percentage of each grid square

const canvasMargin = 16; // pixels

var size_x =  isNaN(Number(localStorage.getItem("mapX"))) || Number(localStorage.getItem("mapX")) < 5 ?  10 : Number(localStorage.getItem("mapX"));
var size_y = isNaN(Number(localStorage.getItem("mapY"))) || Number(localStorage.getItem("mapY")) < 5 ?  10 : Number(localStorage.getItem("mapY"));
var numMines = isNaN(Number(localStorage.getItem("mines"))) || Number(localStorage.getItem("mines")) <= 0 || Number(localStorage.getItem("mines")) > Math.floor(size_x * size_y / 2) ?  15 : Number(localStorage.getItem("mines"));


var flagHold = isNaN(Number(localStorage.getItem("flagHold"))) || Number(localStorage.getItem("flagHold")) <= 100 ?  500 : Number(localStorage.getItem("flagHold"));
var settingsMessageDuration = 5000;

var inGame = false;
var paused = false;

var map = []; // -1 represents a mine

var flags = 0;

var startTime;
var pausedTime = 0;

var interval;
var first = true;

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
    document.getElementById("pause").classList.remove("fa-circle-play");
    document.getElementById("pause").classList.add("fa-circle-pause");

    canvas.style.display = "block";
    document.getElementById("pausedScreen").style.display = "none";


    document.getElementById("flags").innerText = "0/" + numMines.toString();
    document.getElementById("timer").innerText = "0.0s";
    document.getElementById("clickAnywhere").style.display = "flex";

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

function adjacentFlags(x,y) {
    let f = 0;
    for (let i=-1;i<=1;i++) {
        for (let j=-1;j<=1;j++) {
            if (i != 0 || j != 0) {
                if (x+i >= 0 && x+i < size_x && y+j >= 0 && y+j < size_y) {
                    if (map[y+j][x+i].flagged) {
                        f += 1;
                    }
                }
            }
        }
    }

    return f;
}


function idToTile(n) {
    return {x: n%size_x, y: Math.floor(n/size_x)}
}

function exposeTile(x,y) {

    if (!inGame || paused || x < 0 || x >= size_x || y < 0 || y >= size_y) {
        return
    }
    if (map[y][x].value == 0) {
        let n = [y*size_x + x];
        let done = [y*size_x + x];

        while (true) {
            let n_ = [];
            for (let a=0;a<n.length;a++) {
                map[idToTile(n[a]).y][idToTile(n[a]).x].opened = true;
                map[idToTile(n[a]).y][idToTile(n[a]).x].flagged = false;
                if (map[idToTile(n[a]).y][idToTile(n[a]).x].value == 0) {
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


    } else if (map[y][x].value == -1) {
        map[y][x].opened = true; // LOSE

        inGame = false;

        clearInterval(interval);
        let elapsedTime = Date.now() - startTime;
        document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);

        for (let x=0;x<size_x;x++) {
            for (let y=0;y<size_y;y++) {
                if (map[y][x].value == -1) {
                    map[y][x].opened = true;
                }
            }
        }
        document.getElementById("time").style.display = "none";
        document.getElementById("bestTime").style.display = "none";
        document.getElementById("gameEndText").innerText = "Game Over!";
        document.getElementById("gameEnd").style.display = "flex";
        
    } else {
        map[y][x].opened = true;
    }


    let f = 0;

    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map[y][x].flagged) {
                f++;
            }
        }
    }

    flags = f;
    document.getElementById("flags").innerText = flags + "/" + numMines.toString();

    let opened = true;

    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
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

        document.getElementById("time").style.display = "block";
        document.getElementById("bestTime").style.display = "none";
        if ((elapsedTime - pausedTime) / 1000 < 60) {
            document.getElementById("time").innerText = "Time: " + timeToText((elapsedTime - pausedTime) / 1000);
        } else {
            document.getElementById("time").innerText = "Time: " + ((elapsedTime - pausedTime) / 1000).toFixed(1) + "s" + " (" + timeToText((elapsedTime - pausedTime) / 1000) + ")";
        }
        
        document.getElementById("gameEndText").innerText = "You Win!";
        document.getElementById("gameEnd").style.display = "flex";
    }

    return
}

function draw(clear=false) {
    if (clear) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    ctx.fillStyle = "rgba(120,120,120,0.5)";
    let squareSize = Math.min(canvas.width/size_x,canvas.height/size_y);
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

    draw();
}


const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(canvas, {box: 'content-box'});


function overSquare(canvasX,canvasY) { // gets the square under the canvas at position (x,y)
    let squareSize = Math.min(canvas.width/size_x,canvas.height/size_y);
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

document.getElementById("playAgainButton").addEventListener("click", (e) => {
    refreshMap();

    document.getElementById("gameEnd").style.display = "none";
});

document.addEventListener("mousemove", (e) => {
    if (!inGame) return;

    let canvasX = e.clientX - canvasMargin;
    let canvasY = e.clientY -  document.getElementById("top").clientHeight - canvasMargin;
    
    if (overSquare(canvasX,canvasY) && !map[overSquare(canvasX,canvasY).y][overSquare(canvasX,canvasY).x].opened) {
        canvas.style.cursor = "pointer";
    } else {
        canvas.style.cursor = "default";
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
        console.log("open",square);
        if (!map[square.y][square.x].opened && !map[square.y][square.x].flagged) {
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
        console.log("flag",square);
        if (!map[square.y][square.x].opened) {
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
canvas.addEventListener("mouseup", (e) => {
    if (double) {
        double = false;
        return
    };
    let canvasX = e.clientX - canvasMargin;
    let canvasY = e.clientY -  document.getElementById("top").clientHeight - canvasMargin;
    let square = overSquare(canvasX, canvasY);


    if (!(leftButtonDown && rightButtonDown)) {
        if (e.button === 0) {
            open(square);
        }
        if (e.button === 2 && inGame) {
            flag(square);
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

        if (map[square.y][square.x].opened && map[square.y][square.x].value != 0) {
            let f = adjacentFlags(square.x, square.y);

            if (f == map[square.y][square.x].value) {
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
                let canvasX = (touchPos.x - canvasMargin) * window.devicePixelRatio;
                
                let canvasY = (touchPos.y -  document.getElementById("top").clientHeight - canvasMargin) * window.devicePixelRatio;
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
        let canvasX = (touchPos.x - canvasMargin) * window.devicePixelRatio;
          
        let canvasY = (touchPos.y -  document.getElementById("top").clientHeight - canvasMargin) * window.devicePixelRatio;
        let square = overSquare(canvasX, canvasY);
        
        touchHold = false;
        clearTimeout(touchTimeout);
        
        if (!touchHeld) {
            open(square);
        }
    }
})

var pauseStart;

document.getElementById("pauseButton").addEventListener("click", (e) => {
    if (inGame) {
        paused = !paused;
        
        if (paused) {
            pauseStart = Date.now();
            
            document.getElementById("pause").classList.remove("fa-circle-pause");
            document.getElementById("pause").classList.add("fa-circle-play");
            
            canvas.style.display = "none"
            document.getElementById("pausedScreen").style.display = "flex";
        } else {
            
            pausedTime += Date.now() - pauseStart;
            document.getElementById("pause").classList.remove("fa-circle-play");
            document.getElementById("pause").classList.add("fa-circle-pause");
            
            canvas.style.display = "block";
            document.getElementById("pausedScreen").style.display = "none";
        }
        
        let elapsedTime = Date.now() - startTime;
        document.getElementById("timer").innerText = timeToText((elapsedTime - pausedTime) / 1000);

        
        draw(true);
    }
});

document.getElementById("restartButton").addEventListener("click", (e) => {
    inGame = false;
    
    clearInterval(interval);
    
    refreshMap();
    draw(true);
});

document.getElementById("settingsButton").addEventListener("click", (e) => {
    if (document.getElementById("game").style.display == "none") {
        document.getElementById("game").style.display = "block";
        document.getElementById("settings").style.display = "none";

        refreshMap();
        draw(true);
    } else {
        document.getElementById("game").style.display = "none";
        document.getElementById("settings").style.display = "block";

        inGame = false;

        clearInterval(interval);

        refreshMap();
    }
});

if (sessionStorage.getItem("pointer") == "true") {
    canvas.style.cursor = "pointer"; 
}




// SETTINGS

var gameplayTimeout;
var controlsTimeout;



document.getElementById("width").value = size_x;
document.getElementById("height").value = size_y;

document.getElementById("numMines").value = numMines;
document.getElementById("flagHold").value = flagHold;

document.getElementById("saveMapSize").addEventListener("click", (e) => {
    let width_issue = "";
    let height_issue = "";


    if (isNaN(Number(document.getElementById("width").value))) {
        width_issue = "Invalid 'Width' " + "('" + document.getElementById("width").value + "').";
    } else if (Number(document.getElementById("width").value) < 5) {
        width_issue = "Invalid 'Width' " + "('" + document.getElementById("width").value + "'). Must be at least 5.";
    } else if (Number(document.getElementById("width").value) >= 100) {
        width_issue = "Invalid 'Width' " + "('" + document.getElementById("width").value + "'). Must be less than 100.";
    }

    if (isNaN(Number(document.getElementById("height").value))) {
        height_issue = "Invalid 'Heignt' " + "('" + document.getElementById("height").value + "').";
    } else if (Number(document.getElementById("height").value) < 5) {
        height_issue = "Invalid 'Height' " + "('" + document.getElementById("height").value + "'). Must be at least 5.";
    } else if (Number(document.getElementById("height").value) >= 100) {
        height_issue = "Invalid 'Height' " + "('" + document.getElementById("height").value + "'). Must be less than 100.";
    }

    if (width_issue != "" && height_issue != "") {
        height_issue = " " + height_issue;
    }

    if (width_issue != "" || height_issue != "") {
        document.getElementById("invalidGameplay").innerText = "Could not save 'Map size'. " + width_issue + height_issue;
        document.getElementById("invalidGameplay").style.display = "block";

        document.getElementById("width").value = size_x;
        document.getElementById("height").value = size_y;

        if (gameplayTimeout != null) clearTimeout(gameplayTimeout);
        
        gameplayTimeout = setTimeout(function() {
            document.getElementById("invalidGameplay").style.display = "none";
        }, settingsMessageDuration);
    } else {
        size_x = Number(document.getElementById("width").value)
        size_y = Number(document.getElementById("height").value)
        
        if (numMines > Math.floor(size_x * size_y / 2)) {
            numMines = Math.floor(size_x * size_y / 2);
            
            document.getElementById("invalidGameplay").innerText = "Successfully saved 'Map size'. Too many mines for map. 'Number of mines' set to '" + numMines + "'.";
            
            localStorage.setItem("mines", numMines);
            
            document.getElementById("numMines").value = numMines;
        } else {
            document.getElementById("invalidGameplay").innerText = "Successfully saved 'Map size'.";
        }
        
        document.getElementById("invalidGameplay").style.display = "block";
        
        localStorage.setItem("mapX", size_x);
        localStorage.setItem("mapY", size_y);
        
        document.getElementById("width").value = size_x;
        document.getElementById("height").value = size_y;
        
        if (gameplayTimeout != null) clearTimeout(gameplayTimeout);
        
        gameplayTimeout = setTimeout(function() {
            document.getElementById("invalidGameplay").style.display = "none";
        }, settingsMessageDuration);
    }
})

document.getElementById("saveNumMines").addEventListener("click", (e) => {
    let i = "";
    
    if (isNaN(Number(document.getElementById("numMines").value))) {
        i = "Invalid " + "('" + document.getElementById("numMines").value + "').";
    } else if (Number(document.getElementById("numMines").value) < 1) {
        i = "Invalid " + "('" + document.getElementById("numMines").value + "'). Must be at least 1.";
    } else if (Number(document.getElementById("numMines").value) > Math.floor(size_x * size_y / 2)) {
        i = "Invalid " + "('" + document.getElementById("numMines").value + "'). Must be less than "+Math.floor(size_x * size_y / 2)+" for map size.";
    }
    if (i != "") {
        document.getElementById("invalidGameplay").innerText = "Could not save 'Number of mines'. " + i;
        document.getElementById("invalidGameplay").style.display = "block";

        document.getElementById("numMines").value = numMines;
        
        if (gameplayTimeout != null) clearTimeout(gameplayTimeout);
        
        gameplayTimeout = setTimeout(function() {
            document.getElementById("invalidGameplay").style.display = "none";
        }, settingsMessageDuration);
    } else {
        document.getElementById("invalidGameplay").innerText = "Successfully saved 'Number of mines'.";
        
        document.getElementById("invalidGameplay").style.display = "block";
        
        numMines = Number(document.getElementById("numMines").value)
        
        localStorage.setItem("mines", numMines);
        
        document.getElementById("numMines").value = numMines;
        
        if (gameplayTimeout != null) clearTimeout(gameplayTimeout);
        
        gameplayTimeout = setTimeout(function() {
            document.getElementById("invalidGameplay").style.display = "none";
        }, settingsMessageDuration);
    }
});

document.getElementById("saveFlagHold").addEventListener("click", (e) => {
    let i = "";
    
    if (isNaN(Number(document.getElementById("flagHold").value))) {
        i = "Invalid " + "('" + document.getElementById("flagHold").value + "').";
    } else if (Number(document.getElementById("flagHold").value) < 100) {
        i = "Invalid " + "('" + document.getElementById("flagHold").value + "'). Must be at least 100.";
    }
    if (i != "") {
        document.getElementById("invalidControls").innerText = "Could not save 'Mobile hold duration to flag'. " + i;
        document.getElementById("invalidControls").style.display = "block";

        document.getElementById("flagHold").value = flagHold;
        
        if (controlsTimeout != null) clearTimeout(controlsTimeout);
        
        controlsTimeout = setTimeout(function() {
            document.getElementById("invalidControls").style.display = "none";
        }, settingsMessageDuration);
    } else {
        document.getElementById("invalidControls").innerText = "Successfully saved 'Mobile hold duration to flag'.";
        
        document.getElementById("invalidControls").style.display = "block";
        
        flagHold = Number(document.getElementById("flagHold").value)
        
        localStorage.setItem("flagHold", flagHold);
        
        document.getElementById("flagHold").value = flagHold;
        
        if (controlsTimeout != null) clearTimeout(controlsTimeout);
        
        controlsTimeout = setTimeout(function() {
            document.getElementById("invalidControls").style.display = "none";
        }, settingsMessageDuration);
    }
});

for (const [key, value] of Object.entries(themes)) {
    console.log(key, value);
    let b = document.createElement("button");
    let i = document.createElement("i");
    i.classList.add("fa-solid");
    i.classList.add("fa-circle");
    i.style.color = value.accent_color;
    b.id = key;
    b.innerText = value.name+" ";
    b.appendChild(i);
    b.classList.add("outline");
    if (value.name != theme.name) {
        b.classList.add("unselected");
    }
    b.style.backgroundColor = value.background_color;
    b.style.color = value.text_color;
    b.addEventListener("click", (e) => {
        if (b.classList.contains("unselected")) {
            b.classList.remove("unselected");
            document.getElementById(theme.key).classList.add("unselected");
            theme = themes[key];
            setTheme(theme);
            localStorage.setItem("theme", key);
            draw(true);
        }
    })
    
    document.getElementById("themes-list").appendChild(b);
}


function resetGameplay() {
    size_x = 10;
    size_y = 10;

    numMines = 15;

    document.getElementById("width").value = size_x;
    document.getElementById("height").value = size_y;

    document.getElementById("numMines").value = numMines;

    localStorage.setItem("mapX", size_x);
    localStorage.setItem("mapY", size_y);
    localStorage.setItem("mines", numMines);
}



function resetControls() {
    flagHold = 500;

    document.getElementById("flagHold").value = flagHold;

    localStorage.setItem("flagHold", flagHold);
}

function resetAppearance() {
    document.getElementById(theme.key).classList.add("unselected");
    document.getElementById("default_dark").classList.remove("unselected");
    theme = themes.default_dark;
    
    setTheme(theme);

    localStorage.setItem("theme", theme.key);
}


document.getElementById("resetGameplaySettings").addEventListener("click", resetGameplay);
document.getElementById("resetControlsSettings").addEventListener("click", resetControls);
document.getElementById("resetAppearanceSettings").addEventListener("click", resetAppearance);

document.getElementById("resetSettingsButton").addEventListener("click", (e) => {
    resetGameplay();
    resetControls();
    resetAppearance();
});