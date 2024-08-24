function analyze() {
    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map[y][x].opened && map[y][x].value >= 0) {
                analysisMap[y][x].probability = 0;
            } else if (map[y][x].opened && map[y][x].value == -1) {
                analysisMap[y][x].probability = 1;
            } else {
                analysisMap[y][x].probability = null;
            }

            analysisMap[y][x].na = numAdjacent(x,y);
        }
    }

    let numMinesAccounted = 0;

    // EASY CASES


    // 100%
    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map[y][x].opened && map[y][x].value > 0) {
                if (analysisMap[y][x].na - adjacent0(x,y) == map[y][x].value) {
                    for (let i=-1;i<=1;i++) {
                        for (let j=-1;j<=1;j++) {
                            if (i == 0 && j == 0) continue;
                            let newX = x+i;
                            let newY = y+j;
                            if (newX >= 0 && newX < size_x && newY >= 0 && newY < size_y) {
                                if (analysisMap[newY][newX].probability != 0) {
                                    analysisMap[newY][newX].probability = 1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // 0%
    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map[y][x].opened && map[y][x].value > 0) {
                if (adjacent100(x,y) == map[y][x].value) {
                    for (let i=-1;i<=1;i++) {
                        for (let j=-1;j<=1;j++) {
                            if (i == 0 && j == 0) continue;
                            let newX = x+i;
                            let newY = y+j;
                            if (newX >= 0 && newX < size_x && newY >= 0 && newY < size_y) {
                                if (analysisMap[newY][newX].probability != 1) {
                                    analysisMap[newY][newX].probability = 0;
                                }
                            }
                        }
                    }
                }
            }

            if (analysisMap[y][x].probability == 1) numMinesAccounted += 1;
        }
    }


    let unknownSquares = 0;

    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (!map[y][x].opened) {
                let found = false;
                for (let i=-1;i<=1;i++) {
                    for (let j=-1;j<=1;j++) {
                        if (i == 0 && j == 0) continue;
                        let newX = x+i;
                        let newY = y+j;
                        if (newX >= 0 && newX < size_x && newY >= 0 && newY < size_y) {
                            if (map[newY][newX].opened && map[newY][newX].value > 0) {
                                analysisMap[y][x].border = true;

                                found = true;
                            }
                        }
                    }
                }
                if (!found) {
                    unknownSquares += 1;
                }
            }
        }
    }



    let r = regions();



   

    let numMinesNotAccounted = numMines - numMinesAccounted;
    
    let ALL_BORDERS = [];
    let ALL_CONFIGS = [];

    
    console.log("REGIONS", r);
    
    
    for (let n=0;n<r.length;n++) {
        console.time(n)

        let border = [];
        let border_knowns = new Map();
        for (let q=0;q<r[n].length;q++) {
            let y = r[n][q].y;
            let x = r[n][q].x;

            if (analysisMap[y][x].probability != 0 && analysisMap[y][x].probability != 1) {
                for (let i=-1;i<=1;i++) {
                    for (let j=-1;j<=1;j++) {
                        if (i == 0 && j == 0) continue;
                        let newX = x+i;
                        let newY = y+j;
                        if (newX >= 0 && newX < size_x && newY >= 0 && newY < size_y) {
                            if (map[newY][newX].opened && map[newY][newX].value > 0 ) {
                                if (!border_knowns.has(newY * size_x + newX)) border_knowns.set(newY * size_x + newX, {
                                    z: adjacent0(newX,newY),
                                    h: adjacent100(newX,newY),
                                    a:[{x:x,y:y}]
                                });
                                else border_knowns.get(newY * size_x + newX).a.push({x:x,y:y});

                                let n = findCoord(border, x, y);
                                if (n == -1) border.push({
                                    x:x,
                                    y:y,
                                    a:[{x:newX,y:newY}]
                                });
                                else border[n].a.push({x:newX,y:newY});
                            }
                        }
                    }
                }
            }
        }


        //console.log(unknownSquares, numMinesNotAccounted)
        // let config = [];
        // for (let i = 0; i < size_y; i++) {
        //     config[i] = [];
        //     for (let j = 0; j < size_x; j++) {
        //         config[i][j] = {probability: numMines / (size_x * size_y)};
        //     }
        // }

        let configs = [[]];
        let length = 0 ;

        if (border.length != 0) {
            while (length < border.length) {
                new_configs = [];
                
                for (let i=0;i<configs.length;i++) {
                    let c1 = [...configs[i], false];
                    let c2 = [...configs[i], true];


                    if (configPossible(c1, border, border_knowns)) {
                        new_configs.push(c1);
                    }
                    if (configPossible(c2, border, border_knowns)) {
                        new_configs.push(c2);
                    }
                }
                configs = new_configs;
                if (configs.length == 0) break;
                length += 1;
            }

            ALL_BORDERS.push(border);
            ALL_CONFIGS.push(configs);
        }
        console.timeEnd(n)
    }


    let ALL_BORDERS_COMBINED = ALL_BORDERS.flatMap(border => border);

    let calculationsDone = {};
    let weights = [];
    if (ALL_BORDERS.length != 0) {
        console.time("calculation")
        console.time("calculation1")
        let config_lengths = ALL_CONFIGS.map(config => config.length);
        let current_index = new Array(ALL_CONFIGS.length).fill(0);
        let total = config_lengths.reduce((acc, cur) => acc * cur, 1);
        
        for (let i=0;i<total;i++) {
            current_index[0] += 1;

            for (let j = 0; j < current_index.length; j++) {
                if (current_index[j] >= config_lengths[j]) {
                    current_index[j] = 0;
                    if (j + 1 < current_index.length) {
                        current_index[j + 1] += 1;
                    }
                } else {
                    break;
                }
            }

            let c = current_index.flatMap((index, j) => ALL_CONFIGS[j][index]);

            let m = count(c, true);

            if (numMinesNotAccounted - m >= 0) {// if config uses too many mines
                //ALL_CONFIGS_COMBINED.push(c); 

                let left = numMinesNotAccounted - m;

                if (!weights.includes(left)) {
                    weights.push(left);
                }
                
                if (calculationsDone[left] == null) {
                    calculationsDone[left] = {n: 1, v: C(unknownSquares, left)};
                } else {
                    calculationsDone[left].n += 1;
                }

                for (let j=0;j<c.length;j++) {
                    if (c[j]) {
                        if (ALL_BORDERS_COMBINED[j].w == null) {
                            ALL_BORDERS_COMBINED[j].w = {}
                        }
                        if (ALL_BORDERS_COMBINED[j].w[left] == null) {
                            ALL_BORDERS_COMBINED[j].w[left] = 0;
                        }
                        ALL_BORDERS_COMBINED[j].w[left] += 1;
                    }
                    
                }
            }
        }

        console.timeEnd("calculation1")




        let t = 0;            
        for (let w=0;w<weights.length;w++) {
            t += calculationsDone[weights[w]].n * calculationsDone[weights[w]].v;
        }

        //console.log(t, calculationsDone, weights);

        for (let i=0;i<ALL_BORDERS_COMBINED.length;i++) {
            if (ALL_BORDERS_COMBINED[i].w != null) {
                let allcorrect = true;
                for (let w=0;w<weights.length;w++) {
                    if (ALL_BORDERS_COMBINED[i].w[weights[w]] != calculationsDone[weights[w]].n) {
                        allcorrect = false;
                    }

                    if (ALL_BORDERS_COMBINED[i].w[weights[w]] != null) {
                        if (ALL_BORDERS_COMBINED[i].nw == null) { ALL_BORDERS_COMBINED[i].nw = 0; }
                        ALL_BORDERS_COMBINED[i].nw += calculationsDone[weights[w]].v * ALL_BORDERS_COMBINED[i].w[weights[w]];
                    }
                }
                
                if (allcorrect) {
                    analysisMap[ALL_BORDERS_COMBINED[i].y][ALL_BORDERS_COMBINED[i].x].probability = 1;
                } else {
                    analysisMap[ALL_BORDERS_COMBINED[i].y][ALL_BORDERS_COMBINED[i].x].probability = ALL_BORDERS_COMBINED[i].nw/t;
                }
            } else {
                analysisMap[ALL_BORDERS_COMBINED[i].y][ALL_BORDERS_COMBINED[i].x].probability = 0;
            }
        }
        console.timeEnd("calculation")
    }

    //for (let i=0;i<border_squares.length;i++) {

    //console.log(border_squares, knowns);
}


function solve(m,d) {
    console.time('solve')
    let s = 1;

    let mFreq = new Map();
    let dFreq = new Map();

    m.forEach(num => mFreq.set(num, (mFreq.get(num) ?? 0) + 1));
    d.forEach(num => dFreq.set(num, (dFreq.get(num) ?? 0) + 1));

    for (let [k, v] of dFreq) {
        if (mFreq.has(k)) {
            let cancelCount = Math.min(mFreq.get(k), v);
            mFreq.set(k, mFreq.get(k) - cancelCount);
            dFreq.set(k, v - cancelCount);
            if (mFreq.get(k) === 0) mFreq.delete(k);
            if (dFreq.get(k) === 0) dFreq.delete(k);
        }
    }

    for (let [k, v] of mFreq) {
        s *= Math.pow(k, v);
    }

    for (let [k, v] of dFreq) {
        s /= Math.pow(k, v);
    }
    console.timeEnd('solve')
    return s;
}

function C(n, k) {
    console.time('C')

    let multiply = [];
    let division = [];

    for (let i=1;i<=n;i++) {
        multiply.push(i);
    }
    for (let i=1;i<=k;i++) {
        division.push(i);
    }
    for (let i=1;i<=n-k;i++) {
        division.push(i);
    }
    //console.log(n,"C",k,"=",multiply,"/",division);
    console.timeEnd('C')
    return solve(multiply, division);
}

function regions() {
    console.time('regions')
    let m = [];
    for (let i = 0; i < size_y; i++) {
        m[i] = [];
        for (let j = 0; j < size_x; j++) {
            m[i][j] = {done: false}
        }
    }
    let r = [];
    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (analysisMap[y][x].border && !m[y][x].done) {
                r.push(flood(m,x,y));
            }
        }
    }
    console.timeEnd('regions')
    return r;
}


function flood(m,x,y) { // same as _exposeTile but with all tiles within TWO SQUARES
    let n = [y*size_x + x];
    let done = [y*size_x + x];
    let squares = [];
    while (true) {
        let n_ = [];
        for (let a=0;a<n.length;a++) {
            if (analysisMap[idToTile(n[a]).y][idToTile(n[a]).x].border || (map[idToTile(n[a]).y][idToTile(n[a]).x].opened && map[idToTile(n[a]).y][idToTile(n[a]).x].value > 0)) {
                m[idToTile(n[a]).y][idToTile(n[a]).x].done = true;
                if (analysisMap[idToTile(n[a]).y][idToTile(n[a]).x].border) squares.push({x: idToTile(n[a]).x, y: idToTile(n[a]).y});
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

    return squares;
}


function count(a, b) {
    let t = 0;
    for (let i=0;i<a.length;i++) {
        if (a[i] == b) {
            t += 1;
        }
    }
    return t;
}

function find(a,b) {
    for (let i=0;i<a.length;i++) {
        if (a[i] == b) {
            return i;
        }
    }
    return -1;
}

function findCoord(a, x, y) {
    for (let i=0;i<a.length;i++) {
        if (a[i].x == x && a[i].y == y) {
            return i;
        }
    }
    return -1;
}

function configPossible(config, border, border_squares) {
    let b = new Map();


    for (let [key, value] of border_squares) {
        b.set(key, {z: value.z, h: value.h});
    }
    
    for (let i=0;i<border.length;i++) {
        if (config[i] != null) {
            if (config[i]) {
                for (let j=0;j<border[i].a.length;j++) {
                    b.get(border[i].a[j].y*size_x+border[i].a[j].x).h += 1;
               }
            } else {
                for (let j=0;j<border[i].a.length;j++) {
                    b.get(border[i].a[j].y*size_x+border[i].a[j].x).z += 1;
                }
            }
        }
    }

    for (let [key, value] of b) {
        if (value.h > map[idToTile(key).y][idToTile(key).x].value) {
            return false;
        }
        if (value.z > analysisMap[idToTile(key).y][idToTile(key).x].na - map[idToTile(key).y][idToTile(key).x].value) {
            return false;
        }
    }
    return true;
}

function numAdjacent(x,y) {
    let t = 0;
    for (let i=-1;i<=1;i++) {
        for (let j=-1;j<=1;j++) {
            if (i != 0 || j != 0) {
                if (x+i >= 0 && x+i < size_x && y+j >= 0 && y+j < size_y) {
                    t += 1;
                }
            }
        }
    }

    return t;
}

function adjacent0(x,y) {
    let t = 0;
    for (let i=-1;i<=1;i++) {
        for (let j=-1;j<=1;j++) {
            if (i != 0 || j != 0) {
                if (x+i >= 0 && x+i < size_x && y+j >= 0 && y+j < size_y) {
                    if (analysisMap[y+j][x+i].probability == 0) {
                        t += 1;
                    }
                }
            }
        }
    }

    return t;
}

function adjacent100(x,y) {
    let t = 0;
    for (let i=-1;i<=1;i++) {
        for (let j=-1;j<=1;j++) {
            if (i != 0 || j != 0) {
                if (x+i >= 0 && x+i < size_x && y+j >= 0 && y+j < size_y) {
                    if (analysisMap[y+j][x+i].probability == 1) {
                        t += 1;
                    }
                }
            }
        }
    }

    return t;
}