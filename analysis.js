function analyze() {
    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map[y][x].opened && map[y][x].value >= 0) {
                analysisMap[y][x].probability = 0;
            }
        }
    }

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








    

    let border_squares = [];
    let knowns = [];
    
    for (let x=0;x<size_x;x++) {
        for (let y=0;y<size_y;y++) {
            if (map[y][x].opened && map[y][x].value > 0) {
                for (let i=-1;i<=1;i++) {
                    for (let j=-1;j<=1;j++) {
                        if (i != 0 || j != 0) {
                            if (x+i >= 0 && x+i < size_x && y+j >= 0 && y+j < size_y) {
                                if (!map[y+j][x+i].opened) {
                                    border_squares.push({x:x+i,y:y+j});

                                    knowns.push({x:x,y:y});
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    console.log(border_squares, knowns);
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