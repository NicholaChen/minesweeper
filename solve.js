function solve(_map) {
    let a = analyze(_map);

    for (let y=0;y<size_y;y++) {
        for (let x=0;x<size_x;x++) {
            if (a[y][x] == 0) {
                _map[y][x] = 9;
            }
        }
    }
}