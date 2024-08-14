function c(s) {
    let hex = localStorage.getItem(s);

    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        return hex;
    }

    return themes.default_dark[s];
}

var themes = {
    default_dark: {
        name: "Default Dark",
        key: "default_dark",
        background_color: "#121212",
        text_color: "#E0E0E0",
        top_color: "#136146",
        top_text_color: "#E0E0E0",
        accent_color: "#136147",
        accent_hover_color: "#237157",
        accent_text_color: "#E0E0E0",
        input_color: "#303030",
        input_hover_color: "#404040",
        input_text_color: "#E0E0E0",
        unselected_color: "#0F402F",
        unselected_text_color: "#B0B0B0",
        unopened: "#252525",
        opened: "#3F3F3F",
        text: "#CCCCCC",
        flag: "#C80000",
        flag_stem: "#AA0000"
    },
    default_light: {
        name: "Default Light",
        key: "default_light",
        background_color: "#E0E0E0",
        text_color: "#101010",
        top_color: "#1E8462",
        top_text_color: "#E0E0E0",
        accent_color: "#1E8462",
        accent_hover_color: "#237157",
        accent_text_color: "#E0E0E0",
        input_color: "#B0B0B0",
        input_hover_color: "#A5A5A5",
        input_text_color: "#101010",
        unselected_color: "#155540",
        unselected_text_color: "#B0B0B0",
        unopened: "#B5B5B5",
        opened: "#C9C9C9",
        text: "#404040",
        flag: "#FF0808",
        flag_stem: "#db0909"
    },
    _console: {
        name: "Console",
        key: "_console",
        background_color: "#090909",
        text_color: "#33FF33",
        top_color: "#090909",
        top_text_color: "#33FF33",
        accent_color: "#33FF33",
        accent_hover_color: "#81FF81",
        accent_text_color: "#090909",
        input_color: "#303030",
        input_hover_color: "#404040",
        input_text_color: "#55FF55",
        unselected_color: "#24B724",
        unselected_text_color: "#090909",
        unopened: "#14A714",
        opened: "#191919",
        text: "#33FF33",
        flag: "#090909",
        flag_stem: "#090909"
    }
}

themes["custom"] = {
    name: "Custom",
    key: "custom",
    background_color: c("background_color").toUpperCase(),
    text_color: c("text_color").toUpperCase(),
};

const root = document.documentElement;

var theme = themes[localStorage.getItem("theme")] ?? themes.default_dark;
function setTheme(t) {
    root.style.setProperty("--background-color", t.background_color);
    root.style.setProperty("--text-color", t.text_color);
    root.style.setProperty("--top-color", t.top_color);
    root.style.setProperty("--top-text-color", t.top_text_color);
    root.style.setProperty("--accent-color", t.accent_color);
    root.style.setProperty("--accent-hover-color", t.accent_hover_color);
    root.style.setProperty("--accent-text-color",t.accent_text_color);
    root.style.setProperty("--input-color", t.input_color);
    root.style.setProperty("--input-hover-color", t.input_hover_color);
    root.style.setProperty("--input-text-color", t.input_text_color);
    root.style.setProperty("--unselected-color", t.unselected_color);
    root.style.setProperty("--unselected-text-color", t.unselected_text_color);
}

if (localStorage.getItem("theme") == "custom") {
    
}

setTheme(theme);

