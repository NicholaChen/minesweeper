const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const margin = 0.03;

const size = 10.; // number on side

var map = []; // -1 represents a bomb


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
            if (i != 0 && j != 0) {
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
generate(18,0,0);
console.log(map);

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


    for (let x=0;x<size;x++) {
        for (let y=0;y<size;y++) {
            if (map[y][x].value == -1) {
                ctx.fillStyle = "rgba(120,0,0,0.5)";
            } else if (map[y][x].value == 1) {
                ctx.fillStyle = "rgba(120,120,0,0.5)";
            }  else {
                ctx.fillStyle = "rgba(120,120,120,0.5)";
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

    console.log("a")
}


const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(canvas, {box: 'content-box'});