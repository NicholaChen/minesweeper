const solveCalculationLimit = 1e10;

function solve(_map) {
    let a = [];
    for (let i = 0; i < size_y; i++) {
        a[i] = [];
        for (let j = 0; j < size_x; j++) {
            a[i][j] = {probability: null};
        }
    }

    while (true) {
        a = analyze(_map, a, true, solveCalculationLimit);

        if (a == null) {
            return false;
        }
        let found = false;
        let opened = true;
    
        for (let y=0;y<size_y;y++) {
            for (let x=0;x<size_x;x++) {
                if (a[y][x].probability == 0 && !_map[y][x].opened) {
                    found = true;
                    exposeTile(_map, x, y);
                }
            }
        }

        for (let y=0;y<size_y;y++) {
            for (let x=0;x<size_x;x++) {
                if (!_map[y][x].opened && _map[y][x].value != -1) {
                    opened = false;
                }
            }
        }

        if (!found) {
            return false;
        }

        if (opened) {
            return true;
        }
    }
}