const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const margin = 0.03; // percentage of each grid square

const canvasMargin = 10; // pixels

const size_x = 30;
const size_y = 20;
const numBombs = 80;


var map = []; // -1 represents a bomb

var first = true;

for (let i = 0; i < size_y; i++) {
    map[i] = [];
    for (let j = 0; j < size_x; j++) {
        map[i][j] = {value: NaN, opened: false, flagged: false};
    }
}

function generate(bombs, firstx, firsty) {
    let bombTiles = [];

    for (let x=0;x<size_x;x++) { // force first tile to not have a number on it
        for (let y=0;y<size_y;y++) {
            if (Math.abs(firstx -x ) > 1 || Math.abs(firsty - y) > 1) {
                bombTiles.push([x,y]);
            }
        }
    }

    for (let i=0;i<bombs;i++) {
        let b= Math.floor(Math.random() * bombTiles.length);

        map[bombTiles[b][1]][bombTiles[b][0]].value = -1;
        bombTiles.splice(b,1);
    }



    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map[y][x].value != -1) {
                map[y][x].value = adjacentBombs(x,y);
            }
        }
    }
}

function adjacentBombs(x,y) {
    let b = 0;
    for (let i=-1;i<=1;i++) {
        for (let j=-1;j<=1;j++) {
            if (i != 0 || j != 0) {
                if (x+i >= 0 && x+i < size_x && y+j >= 0 && y+j < size_y) {
                    if (map[y+j][x+i].value == -1) {
                        b += 1;
                    }
                }
            }
        }
    }

    return b;
}

function idToTile(n) {
    return {x: n%size_x, y: Math.floor(n/size_x)}
}

function exposeTile(x,y) {

    if (x < 0 || x >= size_x || y < 0 || y >= size_y) {
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
    } else {
        map[y][x].opened = true;
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
            if (!map[y][x].opened) {
                ctx.fillStyle = "#222";
            } else {
                if (map[y][x].value == -1) {
                    ctx.fillStyle = "rgba(200,0,0,0.6)";
                } else {
                    ctx.fillStyle = "#3F3F3F";
                }
            }

            ctx.fillRect(startx+x*squareSize + squareSize*margin,starty+y*squareSize + squareSize*margin,squareSize - squareSize*margin,squareSize - squareSize*margin);
        
            if (!map[y][x].opened) {
                if (map[y][x].flagged) {
                    ctx.strokeStyle = "rgba(200,0,0,1)";
                    ctx.fillStyle = "rgba(200,0,0,1)";
                    ctx.lineWidth = squareSize / 15;

                    ctx.beginPath();
                    ctx.moveTo(startx+x*squareSize + 0.3*squareSize, starty+y*squareSize + 0.8*squareSize);
                    ctx.lineTo(startx+x*squareSize + 0.3*squareSize, starty+y*squareSize + 0.2*squareSize);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(startx+x*squareSize + 0.3*squareSize, starty+y*squareSize + 0.2*squareSize);
                    ctx.lineTo(startx+x*squareSize + 0.7*squareSize, starty+y*squareSize + 0.35*squareSize);
                    ctx.lineTo(startx+x*squareSize + 0.3*squareSize, starty+y*squareSize + 0.5*squareSize);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fill();
                }
            } else {
                if (map[y][x].value == -1) {
                    ctx.fillStyle = "#111";
                    ctx.strokeStyle = "#111";
                    ctx.lineWidth = squareSize / 15;
                    ctx.beginPath();
                    ctx.arc(startx+x*squareSize + 0.5*squareSize, starty+y*squareSize + 0.5*squareSize, squareSize/4.5, 0, 2 * Math.PI);
                    ctx.fill();

                    for (let i=0;i<6;i++) {
                        ctx.beginPath();
                        ctx.moveTo(startx+x*squareSize + 0.5*squareSize, starty+y*squareSize + 0.5*squareSize)
                        ctx.lineTo(startx+x*squareSize + 0.5*squareSize + Math.cos(Math.PI * 2 / 6 * i) * squareSize/3, starty+y*squareSize + 0.5*squareSize + Math.sin(Math.PI * 2 / 6 * i) * squareSize/3);
                        ctx.stroke();
                    }


                } else if (map[y][x].value != 0) {
                    ctx.fillStyle = "rgba(190,190,190,1)";
                    
                    ctx.fillText(map[y][x].value.toString(), startx+x*squareSize + squareSize/2, starty+y*squareSize + squareSize/2);
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


document.addEventListener("mousemove", (e) => {
    let canvasX = e.clientX - canvasMargin;
    let canvasY = e.clientY -  document.getElementById("top").clientHeight - canvasMargin;
    
    if (overSquare(canvasX,canvasY)) {
        canvas.style.cursor = "pointer";
    } else {
        canvas.style.cursor = "default";
    }

});


document.addEventListener("mouseup", (e) => {
    let canvasX = e.clientX - canvasMargin;
    let canvasY = e.clientY -  document.getElementById("top").clientHeight - canvasMargin;
    let square = overSquare(canvasX, canvasY);
    if (e.button === 0) {
        if (square) {
            if (!map[square.y][square.x].opened && !map[square.y][square.x].flagged) {
                if (first) {
                    generate(numBombs,square.x, square.y);

                    first = false;
                }
                exposeTile(square.x, square.y);
                draw(true);
            }
        }
    }
    if (e.button === 2) {
        if (square) {
            if (!map[square.y][square.x].opened) {
                map[square.y][square.x].flagged = !map[square.y][square.x].flagged;
                draw(true);
            }
        }
    }
});

if (sessionStorage.getItem("pointer") == "true") {
    canvas.style.cursor = "pointer"; 
}

window.onunload = function () {
    sessionStorage.setItem("pointer", canvas.style.cursor == "pointer");
}
