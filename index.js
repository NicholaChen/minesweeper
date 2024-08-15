const VERSION = "1.6.1";
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

var size_x =  isNaN(Number(localStorage.getItem("mapX"))) || Number(localStorage.getItem("mapX")) < 5 ?  10 : Number(localStorage.getItem("mapX"));
var size_y = isNaN(Number(localStorage.getItem("mapY"))) || Number(localStorage.getItem("mapY")) < 5 ?  10 : Number(localStorage.getItem("mapY"));
var numMines = isNaN(Number(localStorage.getItem("mines"))) || Number(localStorage.getItem("mines")) <= 0 || Number(localStorage.getItem("mines")) > Math.floor(size_x * size_y / 2) ?  15 : Number(localStorage.getItem("mines"));

var onMouseDown = localStorage.getItem("onMouseDown") != "false";
var chording = localStorage.getItem("chording") != "false";
var flagHold = isNaN(Number(localStorage.getItem("flagHold"))) || Number(localStorage.getItem("flagHold")) <= 100 ?  500 : Number(localStorage.getItem("flagHold"));

var showTimer = localStorage.getItem("showTimer") != "false";
var showFlags = localStorage.getItem("showFlags") != "false";
var showPause = localStorage.getItem("showPause") != "false";
var showRestart = localStorage.getItem("showRestart") != "false";


// stats

var wins = isNaN(Number(localStorage.getItem("wins"))) || Number(localStorage.getItem("wins")) < 0 ? 0 : Number(localStorage.getItem("wins"));
var hours = isNaN(Number(localStorage.getItem("hours"))) || Number(localStorage.getItem("hours")) < 0 ? 0 : Number(localStorage.getItem("hours")); // in ms

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

        hours += elapsedTime - pausedTime;

        document.getElementById("hoursPlayed").innerText = (hours / (1000 * 60 * 60)).toFixed(2);

        localStorage.setItem("hours", hours);

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

        hours += elapsedTime - pausedTime;
        wins += 1;

        document.getElementById("wins").innerText = wins;
        document.getElementById("hoursPlayed").innerText = (hours / (1000 * 60 * 60)).toFixed(2);

        localStorage.setItem("wins", wins);
        localStorage.setItem("hours", hours);

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
            console.log("chord",square);

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
}
var mouseTimeout;
canvas.addEventListener("mousedown", (e) => {
    if (!onMouseDown) return;
    let canvasX = e.clientX - canvasMargin;
    let canvasY = e.clientY -  document.getElementById("top").clientHeight - canvasMargin;
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
    let canvasX = e.clientX - canvasMargin;
    let canvasY = e.clientY -  document.getElementById("top").clientHeight - canvasMargin;
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


document.addEventListener('keydown', function(event) {
    if(event.key == "Escape") {
        inGame = false;
    
        clearInterval(interval);
        
        refreshMap();
        draw(true);
    }
});