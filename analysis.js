var analysisMap_;

var analysisDebug = false;
var analysisDebugVerbose = false;

function analyze(map_, a, simple=false, max) {
    if (analysisDebug) console.time('analyze');

    analysisMap_ = [];

    for (let y=0;y<map_.length;y++) {
        analysisMap_[y] = [];
        for (let x=0;x<map_[y].length;x++) {
            analysisMap_[y][x] = Object.assign({}, a[y][x]);
        }
    }


    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map_[y][x].opened && map_[y][x].value >= 0) {
                analysisMap_[y][x].probability = 0;
            } else if (map_[y][x].opened && map_[y][x].value == -1) {
                analysisMap_[y][x].probability = 1;
            }
            if (analysisMap_[y][x].probability != 0 && analysisMap_[y][x].probability != 1) {
                analysisMap_[y][x].probability = null;
            }
            if (analysisMap_[y][x].na == null) analysisMap_[y][x].na = numAdjacent(x,y);
        }
    }

    

    // EASY CASES


    // 100%
    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map_[y][x].opened && map_[y][x].value > 0) {
                if (analysisMap_[y][x].na - adjacent0(x,y) == map_[y][x].value) {
                    for (let i=-1;i<=1;i++) {
                        for (let j=-1;j<=1;j++) {
                            if (i == 0 && j == 0) continue;
                            let newX = x+i;
                            let newY = y+j;
                            if (newX >= 0 && newX < size_x && newY >= 0 && newY < size_y) {
                                if (analysisMap_[newY][newX].probability != 0) {
                                    analysisMap_[newY][newX].probability = 1;
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
            if (map_[y][x].opened && map_[y][x].value > 0) {
                if (adjacent100(x,y) == map_[y][x].value) {
                    for (let i=-1;i<=1;i++) {
                        for (let j=-1;j<=1;j++) {
                            if (i == 0 && j == 0) continue;
                            let newX = x+i;
                            let newY = y+j;
                            if (newX >= 0 && newX < size_x && newY >= 0 && newY < size_y) {
                                if (analysisMap_[newY][newX].probability != 1) {
                                    analysisMap_[newY][newX].probability = 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    let unknownSquares = 0;

    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (!map_[y][x].opened) {
                let found = false;
                for (let i=-1;i<=1;i++) {
                    for (let j=-1;j<=1;j++) {
                        if (i == 0 && j == 0) continue;
                        let newX = x+i;
                        let newY = y+j;
                        if (newX >= 0 && newX < size_x && newY >= 0 && newY < size_y) {
                            if (map_[newY][newX].opened && map_[newY][newX].value > 0) {
                                analysisMap_[y][x].border = true;

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

    let numMinesAccounted = analysisMap.flat().filter(s => s.probability == 1).length;


    let numMinesNotAccounted = numMines - numMinesAccounted;

    let r = regions(map_);

    if (max != null) {
        if (r.reduce((acc, cur) => acc + Math.pow(2, cur.length), 0) > max) {
            return null;
        }
    }

    let ALL_BORDERS = [];
    let ALL_CONFIGS = [];
    
    
    for (let n=0;n<r.length;n++) {
        if (analysisDebugVerbose && analysisDebug) console.time(n)

        let border = [];
        let border_knowns = new Map();
        for (let q=0;q<r[n].length;q++) {
            let y = r[n][q].y;
            let x = r[n][q].x;

            if (analysisMap_[y][x].probability != 0 && analysisMap_[y][x].probability != 1) {
                for (let i=-1;i<=1;i++) {
                    for (let j=-1;j<=1;j++) {
                        if (i == 0 && j == 0) continue;
                        let newX = x+i;
                        let newY = y+j;
                        if (newX >= 0 && newX < size_x && newY >= 0 && newY < size_y) {
                            if (map_[newY][newX].opened && map_[newY][newX].value > 0 ) {
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

        let configs = [[]];
        let zcounts = [[]];
        let hcounts = [[]];
        let ids = [];
        for (let [key, value] of border_knowns) {
            zcounts[0].push(value.z);
            hcounts[0].push(value.h);

            ids.push(key);
        }
        let length = 0 ;

        if (border.length != 0) {
            while (length < border.length) {
                let new_configs = [];
                let new_z = [];
                let new_h = [];
                for (let i=0;i<configs.length;i++) {
                    let c1 = [...configs[i], false];
                    let c2 = [...configs[i], true];

                    let z1 = [...zcounts[i]];
                    let h1 = [...hcounts[i]];

                    let z2 = [...zcounts[i]];
                    let h2 = [...hcounts[i]];
                    
                    let oneGood = true;
                    let twoGood = true;

                    for (let j=0;j<border[length].a.length;j++) {
                        let x = border[length].a[j].x;
                        let y = border[length].a[j].y;


                        let v = map_[y][x].value;


                        z1[find(ids, y*size_x + x)] += 1;

                        
                       
                        if (z1[find(ids, y*size_x + x)] > analysisMap_[y][x].na - v) {
                            oneGood = false;
                        }


                        h2[find(ids, y*size_x + x)] += 1;
                        
                        if (h2[find(ids, y*size_x + x)] > v) {
                            twoGood =  false;
                        }
                    }




                    if (oneGood) {
                        new_configs.push(c1);
                        new_z.push(z1);
                        new_h.push(h1);
                    }
                    if (twoGood) {
                        new_configs.push(c2);
                        new_z.push(z2);
                        new_h.push(h2);
                    }
                }
                configs = new_configs;
                zcounts = new_z;
                hcounts = new_h;
                if (configs.length == 0) break;
                length += 1;
            }
            
            for (let i=0;i<configs.length;i++) {
                for (let j=0;j<border.length;j++) {
                    if (configs[i][j] == false) {
                        border[j].one = false;
                    } else {
                        border[j].zero = false;
                    }
                }
            }
            let remove = [];
            for (let i=0;i<border.length;i++) {
                if (border[i].one == null) {
                    analysisMap_[border[i].y][border[i].x].probability = 1;
                    remove.push({x: border[i].x, y: border[i].y});
                }
                if (border[i].zero == null) {
                    analysisMap_[border[i].y][border[i].x].probability = 0;
                    remove.push({x: border[i].x, y: border[i].y});
                }
            }
            for (let i=0;i<remove.length;i++) { // removes ones that are guaranteed to be mines or not mines
                let n = findCoord(border, remove[i].x, remove[i].y);
                border.splice(n, 1);
                for (let j=0;j<configs.length;j++) {
                    configs[j].splice(n, 1);
                }
            }
            if (!simple) {
                ALL_BORDERS.push(border);
                ALL_CONFIGS.push(configs);
            }
        }
        if (analysisDebugVerbose && analysisDebug) console.timeEnd(n)
    }

    if (simple) {
        if (analysisDebug) console.timeEnd('analyze');
        return analysisMap_;
    }


    let ALL_BORDERS_COMBINED = ALL_BORDERS.flat();

    let calculationsDone = {};
    let weights = [];
    if (ALL_BORDERS.length != 0) {
        if (analysisDebugVerbose && analysisDebug) {
            console.time("calculation")
            console.time("calculation1")
        }
        let config_lengths = ALL_CONFIGS.map(config => config.length);
        let current_index = new Array(ALL_CONFIGS.length).fill(0);
        let total = config_lengths.reduce((acc, cur) => acc * cur, 1);
        //console.debug(total);
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
                        if (ALL_BORDERS_COMBINED[j] == null) {
                            console.log(j, c, ALL_BORDERS_COMBINED);
                        }
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

        if (analysisDebugVerbose && analysisDebug) console.timeEnd("calculation1");




        let t = 0;            
        for (let w=0;w<weights.length;w++) {
            t += calculationsDone[weights[w]].n * calculationsDone[weights[w]].v;
        }

        //console.log(t, calculationsDone, weights);

        for (let i=0;i<ALL_BORDERS_COMBINED.length;i++) {
            if (ALL_BORDERS_COMBINED[i].w != null) {
                for (let w=0;w<weights.length;w++) {


                    if (ALL_BORDERS_COMBINED[i].w[weights[w]] != null) {
                        if (ALL_BORDERS_COMBINED[i].nw == null) { ALL_BORDERS_COMBINED[i].nw = 0; }
                        ALL_BORDERS_COMBINED[i].nw += calculationsDone[weights[w]].v * ALL_BORDERS_COMBINED[i].w[weights[w]];
                    }
                }

                analysisMap_[ALL_BORDERS_COMBINED[i].y][ALL_BORDERS_COMBINED[i].x].probability = ALL_BORDERS_COMBINED[i].nw/t;
            } else {
                analysisMap_[ALL_BORDERS_COMBINED[i].y][ALL_BORDERS_COMBINED[i].x].probability = 0;
            }
        }

        if (analysisDebugVerbose && analysisDebug) console.timeEnd("calculation");
    }
    if (analysisDebug) console.timeEnd('analyze');
    return analysisMap_;
    //for (let i=0;i<border_squares.length;i++) {

    //console.log(border_squares, knowns);
}


function solveFunction(m,d) {
    if (analysisDebugVerbose && analysisDebug) console.time('solve');
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
    if (analysisDebugVerbose && analysisDebug) console.timeEnd('solve')
    return s;
}

function C(n, k) {
    if (analysisDebugVerbose && analysisDebug) console.time('C')

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
    if (analysisDebugVerbose && analysisDebug) console.timeEnd('C')
    return solveFunction(multiply, division);
}

function regions(map_) {
    if (analysisDebugVerbose && analysisDebug) console.time('regions')
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
            if (analysisMap_[y][x].border && analysisMap_[y][x].probability != 0 && analysisMap_[y][x].probability != 1 && !m[y][x].done) {
                let f = flood(map_,m,x,y);
                if (f.length > 0) r.push(f);
            }
        }
    }
    if (analysisDebugVerbose && analysisDebug) console.timeEnd('regions')
    return r;
}


function flood(map_,m,x,y) { // same as _exposeTile but different rules
    let n = [y*size_x + x];
    let done = [y*size_x + x];
    let squares = [];
    while (true) {
        let n_ = [];
        for (let a=0;a<n.length;a++) {
            m[idToTile(n[a]).y][idToTile(n[a]).x].done = true;
            if (analysisMap_[idToTile(n[a]).y][idToTile(n[a]).x].border && analysisMap_[idToTile(n[a]).y][idToTile(n[a]).x].probability != 0 && analysisMap_[idToTile(n[a]).y][idToTile(n[a]).x].probability != 1) {
                squares.push({x: idToTile(n[a]).x, y: idToTile(n[a]).y});

                for (let i=-1;i<=1;i++) {
                    for (let j=-1;j<=1;j++) {
                        if (idToTile(n[a]).x+i>=0 && idToTile(n[a]).x+i<size_x && idToTile(n[a]).y+j>=0 && idToTile(n[a]).y+j<size_y && !done.includes((idToTile(n[a]).y+j)*size_x + idToTile(n[a]).x+i) && map_[idToTile(n[a]).y+j][idToTile(n[a]).x+i].opened && map_[idToTile(n[a]).y+j][idToTile(n[a]).x+i].value > 0) {
                            n_.push((idToTile(n[a]).y+j)*size_x + idToTile(n[a]).x+i);
                            done.push((idToTile(n[a]).y+j)*size_x + idToTile(n[a]).x+i);
                        }
                    }
                }
            } else if (map_[idToTile(n[a]).y][idToTile(n[a]).x].opened && map_[idToTile(n[a]).y][idToTile(n[a]).x].value > 0) {
                for (let i=-1;i<=1;i++) {
                    for (let j=-1;j<=1;j++) {
                        if (idToTile(n[a]).x+i>=0 && idToTile(n[a]).x+i<size_x && idToTile(n[a]).y+j>=0 && idToTile(n[a]).y+j<size_y && !done.includes((idToTile(n[a]).y+j)*size_x + idToTile(n[a]).x+i) && 
                        analysisMap_[idToTile(n[a]).y+j][idToTile(n[a]).x+i].border && 
                        analysisMap_[idToTile(n[a]).y+j][idToTile(n[a]).x+i].probability != 0 &&
                        analysisMap_[idToTile(n[a]).y+j][idToTile(n[a]).x+i].probability != 1) {
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
                    if (analysisMap_[y+j][x+i].probability == 0) {
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
                    if (analysisMap_[y+j][x+i].probability == 1) {
                        t += 1;
                    }
                }
            }
        }
    }

    return t;
}