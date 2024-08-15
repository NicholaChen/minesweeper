// SETTINGS

var gameplayTimeout;
var controlsTimeout;
var appearanceTimeout;



document.getElementById("width").value = size_x;
document.getElementById("height").value = size_y;

document.getElementById("numMines").value = numMines;
document.getElementById("flagHold").value = flagHold;

if (!showTimer) document.getElementById("h2Timer").style.display = "none";
if (!showFlags) document.getElementById("h2Flags").style.display = "none";
if (!showPause) document.getElementById("pauseButton").style.display = "none";
if (!showRestart) document.getElementById("restartButton").style.display = "none";


document.getElementById("saveMapSize").addEventListener("click", (e) => {
    let width_issue = "";
    let height_issue = "";


    if (isNaN(Number(document.getElementById("width").value))) {
        width_issue = "Invalid 'Width' " + "('" + document.getElementById("width").value + "').";
    } else if (Number(document.getElementById("width").value) < 5) {
        width_issue = "Invalid 'Width' " + "('" + document.getElementById("width").value + "'). Must be at least 5.";
    } else if (Number(document.getElementById("width").value) >= 100) {
        width_issue = "Invalid 'Width' " + "('" + document.getElementById("width").value + "'). Must be less than 100.";
    }

    if (isNaN(Number(document.getElementById("height").value))) {
        height_issue = "Invalid 'Heignt' " + "('" + document.getElementById("height").value + "').";
    } else if (Number(document.getElementById("height").value) < 5) {
        height_issue = "Invalid 'Height' " + "('" + document.getElementById("height").value + "'). Must be at least 5.";
    } else if (Number(document.getElementById("height").value) >= 100) {
        height_issue = "Invalid 'Height' " + "('" + document.getElementById("height").value + "'). Must be less than 100.";
    }

    if (width_issue != "" && height_issue != "") {
        height_issue = " " + height_issue;
    }

    if (width_issue != "" || height_issue != "") {
        document.getElementById("invalidGameplay").innerText = "Could not save 'Map size'. " + width_issue + height_issue;
        document.getElementById("invalidGameplay").style.display = "block";

        document.getElementById("width").value = size_x;
        document.getElementById("height").value = size_y;

        if (gameplayTimeout != null) clearTimeout(gameplayTimeout);
        
        gameplayTimeout = setTimeout(function() {
            document.getElementById("invalidGameplay").style.display = "none";
        }, settingsMessageDuration);
    } else {
        size_x = Number(document.getElementById("width").value)
        size_y = Number(document.getElementById("height").value)
        
        if (numMines > Math.floor(size_x * size_y / 2)) {
            numMines = Math.floor(size_x * size_y / 2);
            
            document.getElementById("invalidGameplay").innerText = "Successfully saved 'Map size'. Too many mines for map. 'Number of mines' set to '" + numMines + "'.";
            
            localStorage.setItem("mines", numMines);
            
            document.getElementById("numMines").value = numMines;
        } else {
            document.getElementById("invalidGameplay").innerText = "Successfully saved 'Map size'.";
        }
        
        document.getElementById("invalidGameplay").style.display = "block";
        
        localStorage.setItem("mapX", size_x);
        localStorage.setItem("mapY", size_y);
        
        document.getElementById("width").value = size_x;
        document.getElementById("height").value = size_y;
        
        if (gameplayTimeout != null) clearTimeout(gameplayTimeout);
        
        gameplayTimeout = setTimeout(function() {
            document.getElementById("invalidGameplay").style.display = "none";
        }, settingsMessageDuration);
    }
})

document.getElementById("saveNumMines").addEventListener("click", (e) => {
    let i = "";
    
    if (isNaN(Number(document.getElementById("numMines").value))) {
        i = "Invalid " + "('" + document.getElementById("numMines").value + "').";
    } else if (Number(document.getElementById("numMines").value) < 1) {
        i = "Invalid " + "('" + document.getElementById("numMines").value + "'). Must be at least 1.";
    } else if (Number(document.getElementById("numMines").value) > Math.floor(size_x * size_y / 2)) {
        i = "Invalid " + "('" + document.getElementById("numMines").value + "'). Must be less than "+Math.floor(size_x * size_y / 2)+" for map size.";
    }
    if (i != "") {
        document.getElementById("invalidGameplay").innerText = "Could not save 'Number of mines'. " + i;
        document.getElementById("invalidGameplay").style.display = "block";

        document.getElementById("numMines").value = numMines;
        
        if (gameplayTimeout != null) clearTimeout(gameplayTimeout);
        
        gameplayTimeout = setTimeout(function() {
            document.getElementById("invalidGameplay").style.display = "none";
        }, settingsMessageDuration);
    } else {
        document.getElementById("invalidGameplay").innerText = "Successfully saved 'Number of mines'.";
        
        document.getElementById("invalidGameplay").style.display = "block";
        
        numMines = Number(document.getElementById("numMines").value)
        
        localStorage.setItem("mines", numMines);
        
        document.getElementById("numMines").value = numMines;
        
        if (gameplayTimeout != null) clearTimeout(gameplayTimeout);
        
        gameplayTimeout = setTimeout(function() {
            document.getElementById("invalidGameplay").style.display = "none";
        }, settingsMessageDuration);
    }
});

if (onMouseDown) {
    document.getElementById("onMouseDownOff").classList.add("unselected");
} else {
    document.getElementById("onMouseDownOn").classList.add("unselected");
}

if (chording) {
    document.getElementById("chordingOff").classList.add("unselected");
} else {
    document.getElementById("chordingOn").classList.add("unselected");
}


document.getElementById("onMouseDownOff").addEventListener("click", (e) => {
    document.getElementById("onMouseDownOff").classList.remove("unselected");
    document.getElementById("onMouseDownOn").classList.add("unselected");

    onMouseDown = false;

    localStorage.setItem("onMouseDown", onMouseDown);
});

document.getElementById("onMouseDownOn").addEventListener("click", (e) => {
    document.getElementById("onMouseDownOn").classList.remove("unselected");
    document.getElementById("onMouseDownOff").classList.add("unselected");

    onMouseDown = true;

    localStorage.setItem("onMouseDown", showRestaonMouseDownrt);
});

document.getElementById("chordingOff").addEventListener("click", (e) => {
    document.getElementById("chordingOff").classList.remove("unselected");
    document.getElementById("chordingOn").classList.add("unselected");

    chording = false;

    localStorage.setItem("chording", chording);
});

document.getElementById("chordingOn").addEventListener("click", (e) => {
    document.getElementById("chordingOn").classList.remove("unselected");
    document.getElementById("chordingOff").classList.add("unselected");

    chording = true;

    localStorage.setItem("chording", chording);
});


document.getElementById("saveFlagHold").addEventListener("click", (e) => {
    let i = "";
    
    if (isNaN(Number(document.getElementById("flagHold").value))) {
        i = "Invalid " + "('" + document.getElementById("flagHold").value + "').";
    } else if (Number(document.getElementById("flagHold").value) < 100) {
        i = "Invalid " + "('" + document.getElementById("flagHold").value + "'). Must be at least 100.";
    }
    if (i != "") {
        document.getElementById("invalidControls").innerText = "Could not save 'Mobile hold duration to flag'. " + i;
        document.getElementById("invalidControls").style.display = "block";

        document.getElementById("flagHold").value = flagHold;
        
        if (controlsTimeout != null) clearTimeout(controlsTimeout);
        
        controlsTimeout = setTimeout(function() {
            document.getElementById("invalidControls").style.display = "none";
        }, settingsMessageDuration);
    } else {
        document.getElementById("invalidControls").innerText = "Successfully saved 'Mobile hold duration to flag'.";
        
        document.getElementById("invalidControls").style.display = "block";
        
        flagHold = Number(document.getElementById("flagHold").value)
        
        localStorage.setItem("flagHold", flagHold);
        
        document.getElementById("flagHold").value = flagHold;
        
        if (controlsTimeout != null) clearTimeout(controlsTimeout);
        
        controlsTimeout = setTimeout(function() {
            document.getElementById("invalidControls").style.display = "none";
        }, settingsMessageDuration);
    }
});







if (showTimer) {
    document.getElementById("showTimerOff").classList.add("unselected");
} else {
    document.getElementById("showTimerOn").classList.add("unselected");
}
if (showFlags) {
    document.getElementById("showFlagsOff").classList.add("unselected");
} else {
    document.getElementById("showFlagsOn").classList.add("unselected");
}
if (showPause) {
    document.getElementById("showPauseOff").classList.add("unselected");
} else {
    document.getElementById("showPauseOn").classList.add("unselected");
}
if (showRestart) {
    document.getElementById("showRestartOff").classList.add("unselected");
} else {
    document.getElementById("showRestartOn").classList.add("unselected");
}


document.getElementById("showTimerOff").addEventListener("click", (e) => {
    document.getElementById("showTimerOff").classList.remove("unselected");
    document.getElementById("showTimerOn").classList.add("unselected");

    showTimer = false;

    document.getElementById("h2Timer").style.display = "none";

    localStorage.setItem("showTimer", showTimer);
});

document.getElementById("showTimerOn").addEventListener("click", (e) => {
    document.getElementById("showTimerOn").classList.remove("unselected");
    document.getElementById("showTimerOff").classList.add("unselected");

    showTimer = true;

    document.getElementById("h2Timer").style.display = "inline";

    localStorage.setItem("showTimer", showTimer);
});


document.getElementById("showFlagsOff").addEventListener("click", (e) => {
    document.getElementById("showFlagsOff").classList.remove("unselected");
    document.getElementById("showFlagsOn").classList.add("unselected");

    showFlags = false;

    document.getElementById("h2Flags").style.display = "none";

    localStorage.setItem("showFlags", showFlags);
});

document.getElementById("showFlagsOn").addEventListener("click", (e) => {
    document.getElementById("showFlagsOn").classList.remove("unselected");
    document.getElementById("showFlagsOff").classList.add("unselected");

    showFlags = true;

    document.getElementById("h2Flags").style.display = "inline";

    localStorage.setItem("showFlags", showFlags);
});

document.getElementById("showPauseOff").addEventListener("click", (e) => {
    document.getElementById("showPauseOff").classList.remove("unselected");
    document.getElementById("showPauseOn").classList.add("unselected");

    showPause = false;

    document.getElementById("pauseButton").style.display = "none";

    localStorage.setItem("showPause", showPause);
});

document.getElementById("showPauseOn").addEventListener("click", (e) => {
    document.getElementById("showPauseOn").classList.remove("unselected");
    document.getElementById("showPauseOff").classList.add("unselected");

    showPause = true;

    document.getElementById("pauseButton").style.display = "initial";

    localStorage.setItem("showPause", showPause);
});

document.getElementById("showRestartOff").addEventListener("click", (e) => {
    document.getElementById("showRestartOff").classList.remove("unselected");
    document.getElementById("showRestartOn").classList.add("unselected");

    showRestart = false;

    document.getElementById("restartButton").style.display = "none";

    localStorage.setItem("showRestart", showRestart);
});

document.getElementById("showRestartOn").addEventListener("click", (e) => {
    document.getElementById("showRestartOn").classList.remove("unselected");
    document.getElementById("showRestartOff").classList.add("unselected");

    showRestart = true;

    document.getElementById("restartButton").style.display = "initial";

    localStorage.setItem("showRestart", showRestart);
});

if (theme.key == "custom") {
    document.getElementById("presetThemeButton").classList.add("unselected");
    document.getElementById("customTheme").style.display = "block";
} else {
    document.getElementById("customThemeButton").classList.add("unselected");
    document.getElementById("themes-list").style.display = "block";
}

document.getElementById("presetThemeButton").addEventListener("click", (e) => {
    document.getElementById("presetThemeButton").classList.remove("unselected");
    document.getElementById("customThemeButton").classList.add("unselected");

    document.getElementById("customTheme").style.display = "none";
    document.getElementById("themes-list").style.display = "block";

    for (let i = 0; i < document.getElementById("themes-list").children.length; i++) {
        document.getElementById("themes-list").children[i].classList.remove("unselected");
        document.getElementById("themes-list").children[i].classList.add("unselected");
    }

    document.getElementById("default_dark").classList.remove("unselected");

    theme = themes.default_dark;
    localStorage.setItem("theme", theme.key);
    setTheme(theme);
});

document.getElementById("customThemeButton").addEventListener("click", (e) => {
    document.getElementById("customThemeButton").classList.remove("unselected");
    document.getElementById("presetThemeButton").classList.add("unselected");

    document.getElementById("themes-list").style.display = "none";
    document.getElementById("customTheme").style.display = "block";

    theme = themes.custom;
    localStorage.setItem("theme", theme.key);
    setTheme(theme);
});

for (const [key, value] of Object.entries(themes)) {
    if (key == "custom") continue;
    let b = document.createElement("button");
    let i = document.createElement("i");
    i.classList.add("fa-solid");
    i.classList.add("fa-circle");
    i.style.color = value.accent_color;
    b.id = key;
    b.innerText = value.name+" ";
    b.appendChild(i);
    b.classList.add("outline");
    if (value.name != theme.name) {
        b.classList.add("unselected");
    }
    b.style.backgroundColor = value.background_color;
    b.style.color = value.text_color;
    b.addEventListener("click", (e) => {
        if (b.classList.contains("unselected")) {
            b.classList.remove("unselected");
            document.getElementById(theme.key).classList.add("unselected");
            theme = themes[key];
            setTheme(theme);
            localStorage.setItem("theme", key);
        }
    })
    
    document.getElementById("themes-list").appendChild(b);
}


for (const [key, value] of Object.entries(themeColors)) {
    let settingsDiv = document.createElement("div");
    settingsDiv.classList.add("settingsDiv");

    let h3 = document.createElement("h3");
    h3.innerText = themeColorsSetting[key];

    settingsDiv.appendChild(h3);
    
    let div = document.createElement("div");

    let t_i = document.createElement("input");
    t_i.type = "text";
    t_i.id = value + "Text";

    let t_c = document.createElement("input");
    t_c.type = "color";
    t_c.style.margin = "0 0 0 8px";
    t_c.id = value;

    let b = document.createElement("button");
    b.classList.add("saveSettings")

    let i = document.createElement("i");
    i.classList.add("fa-solid");
    i.classList.add("fa-floppy-disk");

    b.appendChild(i);


    t_i.value = themes.custom[key];
    t_c.value = themes.custom[key];


    t_c.addEventListener("input", (e) => {
        t_i.value = t_c.value.toString().toUpperCase();
    
        themes.custom[key] =  t_c.value.toString().toUpperCase();
        theme = themes.custom;
        setTheme(theme);
    });
    
    
    t_i.addEventListener("input", (e) => {
        t_i.value = t_i.value.toUpperCase();
        t_c.value = t_i.value;
    
        if (/^#[0-9A-F]{6}$/i.test(t_i.value)) {
            themes.custom[key] =  t_i.value;
            theme = themes.custom;
            setTheme(theme);
        }
    });


    
    b.addEventListener("click", (e) => {
        let i = "";
        
        if (!/^#[0-9A-F]{6}$/i.test(t_i.value)) {
            i = "Invalid " + "('" + t_i.value + "').";
        }
        if (i != "") {
            document.getElementById("invalidAppearance").innerText = "Could not save '" + themeColorsSetting[key] + "'. " + i;
            document.getElementById("invalidAppearance").style.display = "block";

            t_i.value = themes.custom[key];
            
            if (appearanceTimeout != null) clearTimeout(appearanceTimeout);
            
            appearanceTimeout = setTimeout(function() {
                document.getElementById("invalidAppearance").style.display = "none";
            }, settingsMessageDuration);
        } else {
            document.getElementById("invalidAppearance").innerText = "Successfully saved '" + themeColorsSetting[key] + "'.";
            document.getElementById("invalidAppearance").style.display = "block";
            
            themes.custom[key] = t_i.value;
            theme = themes.custom;
            setTheme(theme);
            
            localStorage.setItem(key, themes.custom[key]);
            
            if (appearanceTimeout != null) clearTimeout(appearanceTimeout);
            
            appearanceTimeout = setTimeout(function() {
                document.getElementById("invalidAppearance").style.display = "none";
            }, settingsMessageDuration);
        }
    });



    div.appendChild(t_i);
    div.appendChild(t_c);
    div.appendChild(b);

    settingsDiv.appendChild(div);

    document.getElementById("customTheme").appendChild(settingsDiv);
}





function resetGameplay() {
    size_x = 10;
    size_y = 10;

    numMines = 15;

    document.getElementById("width").value = size_x;
    document.getElementById("height").value = size_y;

    document.getElementById("numMines").value = numMines;

    localStorage.setItem("mapX", size_x);
    localStorage.setItem("mapY", size_y);
    localStorage.setItem("mines", numMines);

    document.getElementById("invalidGameplay").innerText = "Reset settings.";
        
    document.getElementById("invalidGameplay").style.display = "block";

    if (gameplayTimeout != null) clearTimeout(gameplayTimeout);
    
    gameplayTimeout = setTimeout(function() {
        document.getElementById("invalidGameplay").style.display = "none";
    }, settingsMessageDuration);
}



function resetControls() {
    onMouseDown = true;
    chording = true;
    flagHold = 500;

    localStorage.setItem("onMouseDown", onMouseDown);
    localStorage.setItem("chording", chording);

    document.getElementById("flagHold").value = flagHold;

    localStorage.setItem("flagHold", flagHold);

    document.getElementById("invalidControls").innerText = "Reset settings.";
        
    document.getElementById("invalidControls").style.display = "block";

    if (appearanceTimeout != null) clearTimeout(appearanceTimeout);
    
    appearanceTimeout = setTimeout(function() {
        document.getElementById("invalidControls").style.display = "none";
    }, settingsMessageDuration);
}

function resetAppearance() {
    document.getElementById("showTimerOn").classList.remove("unselected");
    document.getElementById("showTimerOff").classList.add("unselected");
    document.getElementById("h2Timer").style.display = "inline";
    
    document.getElementById("showFlagsOn").classList.remove("unselected");
    document.getElementById("showFlagsOff").classList.add("unselected");
    document.getElementById("h2Flags").style.display = "inline";

    document.getElementById("showPauseOn").classList.remove("unselected");
    document.getElementById("showPauseOff").classList.add("unselected");
    document.getElementById("pauseButton").style.display = "initial";

    document.getElementById("showRestartOn").classList.remove("unselected");
    document.getElementById("showRestartOff").classList.add("unselected");
    document.getElementById("restartButton").style.display = "initial";

    showTimer = true;
    showFlags = true;
    showPause = true;
    showRestart = true;

    localStorage.setItem("showTimer", showTimer);
    localStorage.setItem("showFlags", showFlags);
    localStorage.setItem("showPause", showPause);
    localStorage.setItem("showRestart", showRestart);

    document.getElementById("presetThemeButton").classList.remove("unselected");
    document.getElementById("customThemeButton").classList.add("unselected");

    document.getElementById("customTheme").style.display = "none";
    document.getElementById("themes-list").style.display = "block";

    for (let i = 0; i < document.getElementById("themes-list").children.length; i++) {
        document.getElementById("themes-list").children[i].classList.add("unselected");
    }

    document.getElementById("default_dark").classList.remove("unselected");
    theme = themes.default_dark;
    
    setTheme(theme);

    localStorage.setItem("theme", theme.key);

    for (const [key, value] of Object.entries(themeColors)) {
        document.getElementById(value).value = themes.default_dark[key];
        document.getElementById(value+"Text").value = themes.default_dark[key];
    
        themes.custom[key] = themes.default_dark[key];

        localStorage.setItem(key, themes.default_dark[key]);
    }


    document.getElementById("invalidAppearance").innerText = "Reset settings.";
        
    document.getElementById("invalidAppearance").style.display = "block";

    if (controlsTimeout != null) clearTimeout(controlsTimeout);
    
    controlsTimeout = setTimeout(function() {
        document.getElementById("invalidAppearance").style.display = "none";
    }, settingsMessageDuration);
}


document.getElementById("resetGameplaySettings").addEventListener("click", resetGameplay);
document.getElementById("resetControlsSettings").addEventListener("click", resetControls);
document.getElementById("resetAppearanceSettings").addEventListener("click", resetAppearance);

document.getElementById("resetSettingsButton").addEventListener("click", (e) => {
    resetGameplay();
    resetControls();
    resetAppearance();
});