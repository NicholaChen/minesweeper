function analyze() {
    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map[y][x].opened && map[y][x].value >= 0) {
                analysisMap[y][x].probability = 0;
            }
        }
    }

    let r = regions();

    // EASY CASES


    // 100%
    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map[y][x].opened && map[y][x].value > 0) {
                if (numAdjacent(x,y) - adjacent0(x,y) == map[y][x].value) {
                    for (let i=-1;i<=1;i++) {
                        for (let j=-1;j<=1;j++) {
                            if (i != 0 || j != 0) {
                                if (x+i >= 0 && x+i < size_x && y+j >= 0 && y+j < size_y) {
                                    if (analysisMap[y+j][x+i].probability != 0) {
                                        analysisMap[y+j][x+i].probability = 1;
                                    }
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
                            if (i != 0 || j != 0) {
                                if (x+i >= 0 && x+i < size_x && y+j >= 0 && y+j < size_y) {
                                    if (analysisMap[y+j][x+i].probability != 1) {
                                        analysisMap[y+j][x+i].probability = 0;
                                    }
                                }
                            }
                        }
                    }
                
                }
            }
        }
    }





    let ALL_BORDERS = [];
    let ALL_CONFIGS = [];

    for (let n=0;n<r.length;n++) {

        let border = [];
        let border_knowns = [];
        for (let q=0;q<r[n].length;q++) {
            let y = r[n][q].y;
            let x = r[n][q].x;
            if (map[y][x].opened && map[y][x].value != 0) {
                for (let i=-1;i<=1;i++) {
                    for (let j=-1;j<=1;j++) {
                        if (i != 0 || j != 0) {
                            if (x+i >= 0 && x+i < size_x && y+j >= 0 && y+j < size_y) {
                                if (!map[y+j][x+i].opened && analysisMap[y+j][x+i].probability != 0 && analysisMap[y+j][x+i].probability != 1) {
                                    if (findCoord(border_knowns, x, y) == -1) border_knowns.push({x:x,y:y,z: adjacent0(x,y), h: adjacent100(x,y), a:[{x:x+i,y:y+j}]});
                                    else border_knowns[findCoord(border_knowns, x, y)].a.push({x:x+i,y:y+j});

                                    if (findCoord(border,x+i,y+j) == -1) border.push({x:x+i,y:y+j});
                                }
                            }
                        }
                    }
                }
            }
        }

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
            while (true) {
                new_configs = [];
                for (let i=0;i<configs.length;i++) {
                    new_configs.push([...configs[i]]);
                    new_configs[new_configs.length-1].push(false);
                    new_configs.push([...configs[i]]);
                    new_configs[new_configs.length-1].push(true);
                }
                configs = [];
                for (let i=0;i<new_configs.length;i++) {
                    if (configPossible(new_configs[i], border, border_knowns)) {
                        configs.push(new_configs[i]);
                    }
                }
                length += 1;
                if (length == border.length) {
                    break;
                }
            }

            ALL_BORDERS.push(border);
            ALL_CONFIGS.push(configs);
        }
    }

    console.log(ALL_BORDERS, ALL_CONFIGS);
    //for (let i=0;i<border_squares.length;i++) {

    //console.log(border_squares, knowns);
}

function regions() {
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
            if (map[y][x].opened && !m[y][x].done) {
                r.push(flood(m,x,y));
            }
        }
    }

    return r;
}


function flood(m,x,y) { // same as _exposeTile but with all tiles within TWO SQUARES
    let n = [y*size_x + x];
    let done = [y*size_x + x];
    let squares = [];
    while (true) {
        let n_ = [];
        for (let a=0;a<n.length;a++) {
            if (map[idToTile(n[a]).y][idToTile(n[a]).x].opened) {
                m[idToTile(n[a]).y][idToTile(n[a]).x].done = true;
                squares.push({x: idToTile(n[a]).x, y: idToTile(n[a]).y});
                for (let i=-2;i<=2;i++) {
                    for (let j=-2;j<=2;j++) {
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

function findCoord(a, x, y) {
    for (let i=0;i<a.length;i++) {
        if (a[i].x == x && a[i].y == y) {
            return i;
        }
    }
    return -1;
}

function configPossible(config, border, border_squares) {
    let b = [];
    for (let i=0;i<border.length;i++) {
        b.push({x: border[i].x, y: border[i].y, mine: null});
        if (config[i] != null) {
            b[i].mine = config[i];
        } else {
            b[i].mine = null;
        }
    }

    for (let i=0;i<border_squares.length;i++) {
        let numMines = 0;
        let numNotMines = 0;
        for (let j=0;j<border_squares[i].a.length;j++) {
            if (b[findCoord(b, border_squares[i].a[j].x, border_squares[i].a[j].y)].mine == true) {
                numMines += 1;
            }
            if (b[findCoord(b, border_squares[i].a[j].x, border_squares[i].a[j].y)].mine == false) {
                numNotMines += 1;
            }

        }

        if (numMines + border_squares[i].h > map[border_squares[i].y][border_squares[i].x].value) {
            return false;
        }
        if (numNotMines + border_squares[i].z > numAdjacent(border_squares[i].x, border_squares[i].y) - map[border_squares[i].y][border_squares[i].x].value) {
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