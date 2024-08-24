function solve(_map) {
    while (true) {
        let a = analyze(_map, true);
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

        map =_map;

        draw(true);
    }
}