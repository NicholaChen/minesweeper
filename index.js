const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const margin = 0.03; // percentage of each grid square

const canvasMargin = 16; // pixels

const size = 10.; // number on side

var map = []; // -1 represents a bomb

var first = true;

for (let i = 0; i < size; i++) {
    map[i] = [];
    for (let j = 0; j < size; j++) {
        map[i][j] = {value: NaN, opened: false, flagged: false};
    }
}

function generate(bombs, firstx, firsty) {
    for (let i=0;i<bombs;i++) {
        let x= Math.floor(Math.random() * size);

        if (x == firstx) { // stops immediately hitting a bomb
            let y= Math.floor(Math.random() * (size - 1));

            let a = []
            for (let j=0;j<size;j++) {
                if (j != firsty) {
                    a.push(j);
                }
            }

            console.log(x, a[y]);

            map[a[y]][x].value = -1;
        }
        else {
            let y = Math.floor(Math.random() * size);

            console.log(x,y);

            map[y][x].value = -1;
        }
    }

    for (let x=0;x<size;x++) {
        for (let y=0;y<size;y++) {
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
                if (x+i >= 0 && x+i < size && y+j >= 0 && y+j < size) {
                    if (map[y+j][x+i].value == -1) {
                        b += 1;
                    }
                }
            }
        }
    }

    return b;
}


function draw(clear=false) {
    if (clear) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    ctx.fillStyle = "rgba(120,120,120,0.5)";
    let w=canvas.width;
    let h=canvas.height;
    
    let squareSize = Math.min(w,h) / size;
    let startx = w/2 - squareSize * size / 2;
    let starty = h/2 - squareSize * size / 2;


    ctx.font = (squareSize / 1.7).toString() + "px monospace, monospace";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (let x=0;x<size;x++) {
        for (let y=0;y<size;y++) {
            if (!map[y][x].opened) {
                ctx.fillStyle = "rgba(50,50,50,0.5)";
            } else {
                if (map[y][x].value == -1) {
                    ctx.fillStyle = "rgba(120,0,0,0.5)";
                } else if (map[y][x].value != 0) {
                    ctx.fillStyle = "rgba(255,255,255,1)";
                    
                    ctx.fillText(map[y][x].value.toString(), startx+x*squareSize + squareSize/2, starty+y*squareSize + squareSize/2);
                    ctx.fillStyle = "rgba(120,120,120,0.5)";
                }  else {
                    ctx.fillStyle = "rgba(120,120,120,0.5)";
                }
            }

            ctx.fillRect(startx+x*squareSize + squareSize*margin,starty+y*squareSize + squareSize*margin,squareSize - squareSize*margin,squareSize - squareSize*margin);
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
    let squareSize = Math.min(canvas.width,canvas.height) / size;
    let startx = canvas.width/2 - squareSize * size / 2;
    let starty = canvas.height/2 - squareSize * size / 2;

    for (let x=0;x<size;x++) {
        for (let y=0;y<size;y++) {
            if (!map[y][x].opened) {
                ctx.fillStyle = "rgba(50,50,50,0.5)";
            }

            if (canvasX >= startx+x*squareSize + squareSize*margin && canvasX <= startx+x*squareSize + squareSize*margin + squareSize - squareSize*margin &&
                canvasY >= starty+y*squareSize + squareSize*margin && canvasY <= starty+y*squareSize + squareSize*margin + squareSize - squareSize*margin) {
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
            if (!map[square.y][square.x].opened) {
                if (first) {
                    generate(18,square.x, square.y);

                    first = false;
                }
                map[square.y][square.x].opened = true;
                draw(true);
            }
        }
    }
    if (e.button === 2) {

    }
});