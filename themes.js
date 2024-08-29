function customColor(s) {
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
        text: "#151515",
        flag: "#FF0808",
        flag_stem: "#db0909"
    },
    classic: {
        name: "Classic",
        key: "classic",
        background_color: "#C0C0C0",
        text_color: "#000000",
        top_color: "#C0C0C0",
        top_text_color: "#000000",
        accent_color: "#1E8462",
        accent_hover_color: "#237157",
        accent_text_color: "#E0E0E0",
        input_color: "#FFFFFF",
        input_hover_color: "#E4E4E4",
        input_text_color: "#000000",
        unselected_color: "#155540",
        unselected_text_color: "#B0B0B0",
        unopened: "#B5B5B5",
        opened: "#C9C9C9",
        text: "#151515",
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
        unopened: "#062E06",
        opened: "#191919",
        text: "#33FF33",
        flag: "#33FF33",
        flag_stem: "#33FF33"
    },
    solarized_dark: {
        name: "Solarized Dark",
        key: "solarized_dark",
        background_color: "#002B36",
        text_color: "#93A1A1",
        top_color: "#073642",
        top_text_color: "#93A1A1",
        accent_color: "#073642",
        accent_hover_color: "#073642",
        accent_text_color: "#268bd2",
        input_color: "#073642",
        input_hover_color: "#073642",
        input_text_color: "#859900",
        unselected_color: "#002B36",
        unselected_text_color: "#657B83",
        unopened: "#073642",
        opened: "#002B36",
        text: "#93A1A1",
        flag: "#DC322F",
        flag_stem: "#DC322F"
    },
    solarized_light: {
        name: "Solarized Light",
        key: "solarized_light",
        background_color: "#EEE8D5",
        text_color: "#93A1A1",
        top_color: "#FDF6E3",
        top_text_color: "#93A1A1",
        accent_color: "#FDF6E3",
        accent_hover_color: "#FDF6E3",
        accent_text_color: "#268BD2",
        input_color: "#FDF6E3",
        input_hover_color: "#FDF6E3",
        input_text_color: "#859900",
        unselected_color: "#EEE8D5",
        unselected_text_color: "#657B83",
        unopened: "#FDF6E3",
        opened: "#EEE8D5",
        text: "#93A1A1",
        flag: "#DC322F",
        flag_stem: "#DC322F"
    },
    github_dark: {
        name: "GitHub Dark",
        key: "github_dark",
        background_color: "#0D1117",
        text_color: "#E6EDF3",
        top_color: "#010409",
        top_text_color: "#E6EDF3",
        accent_color: "#238636",
        accent_hover_color: "#29903B",
        accent_text_color: "#FFFFFF",
        input_color: "#161B22",
        input_hover_color: "#161B22",
        input_text_color: "#E6EDF3",
        unselected_color: "#161B22",
        unselected_text_color: "#E6EDF3",
        unopened: "#121D2F",
        opened: "#010409",
        text: "#8D96A0",
        flag: "#F85149",
        flag_stem: "#B62324"
    },    
    github_light: {
        name: "GitHub Light",
        key: "github_light",
        background_color: "#FFFFFF",
        text_color: "#1F2328",
        top_color: "#F6F8FA",
        top_text_color: "#636C76",
        accent_color: "#1F883D",
        accent_hover_color: "#1C8139",
        accent_text_color: "#FFFFFF",
        input_color: "#F6F8FA",
        input_hover_color: "#F6F8FA",
        input_text_color: "#1F2328",
        unselected_color: "#F6F8FA",
        unselected_text_color: "#1F2328",
        unopened: "#DDF4FF",
        opened: "#F6F8FA",
        text: "#636C76",
        flag: "#D1242F",
        flag_stem: "#A40E26"
    }
}

var themeColors = { // name: name
    background_color: "backgroundColor",
    text_color: "textColor",
    top_color: "topColor",
    top_text_color: "topTextColor",
    accent_color: "accentColor",
    accent_hover_color: "accentHoverColor",
    accent_text_color: "accentTextColor",
    input_color: "inputColor",
    input_hover_color: "inputHoverColor",
    input_text_color: "inputTextColor",
    unselected_color: "unselectedColor",
    unselected_text_color: "unselectedTextColor",
    unopened: "unopened",
    opened: "opened",
    text: "text",
    flag: "flag",
    flag_stem: "flagStem"
}

var themeColorsSetting = { // name: setting name
    background_color: "Background",
    text_color: "Text",
    top_color: "Header",
    top_text_color: "Text on header",
    accent_color: "Accent",
    accent_hover_color: "Accent hover",
    accent_text_color: "Text on accent",
    input_color: "Input",
    input_hover_color: "Input hover",
    input_text_color: "Text on input",
    unselected_color: "Unselected",
    unselected_text_color: "Text on unselected",
    unopened: "Minesweeper unopened tile",
    opened: "Minesweeper opened tile",
    text: "Minesweeper number text",
    flag: "Minesweeper flag",
    flag_stem: "Minesweeper flag stem",
    
}
themes["custom"] = {
    name: "Custom",
    key: "custom",
    background_color: customColor("background_color").toUpperCase(),
    text_color: customColor("text_color").toUpperCase(),
    top_color: customColor("top_color").toUpperCase(),
    top_text_color: customColor("top_text_color").toUpperCase(),
    accent_color: customColor("accent_color").toUpperCase(),
    accent_hover_color: customColor("accent_hover_color").toUpperCase(),
    accent_text_color: customColor("accent_text_color").toUpperCase(),
    input_color: customColor("input_color").toUpperCase(),
    input_hover_color: customColor("input_hover_color").toUpperCase(),
    input_text_color: customColor("input_text_color").toUpperCase(),
    unselected_color: customColor("unselected_color").toUpperCase(),
    unselected_text_color: customColor("unselected_text_color").toUpperCase(),
    unopened: customColor("unopened").toUpperCase(),
    opened: customColor("opened").toUpperCase(),
    text: customColor("text").toUpperCase(),
    flag: customColor("flag").toUpperCase(),
    flag_stem: customColor("flag_stem").toUpperCase()
};

const root = document.documentElement;

var theme = themes[localStorage.getItem("theme")] ?? themes.default_dark;
function setTheme(t) {
    root.style.setProperty("--background-color", t.background_color ?? theme.default_dark.background_color);
    root.style.setProperty("--text-color", t.text_color ?? theme.default_dark.text_color);
    root.style.setProperty("--top-color", t.top_color ?? theme.default_dark.top_color);
    root.style.setProperty("--top-text-color", t.top_text_color ?? theme.default_dark.text_color);
    root.style.setProperty("--accent-color", t.accent_color ?? theme.default_dark.accent_color);
    root.style.setProperty("--accent-hover-color", t.accent_hover_color ?? theme.default_dark.accent_hover_color);
    root.style.setProperty("--accent-text-color",t.accent_text_color ?? theme.default_dark.accent_text_color);
    root.style.setProperty("--input-color", t.input_color ?? theme.default_dark.input_color);
    root.style.setProperty("--input-hover-color", t.input_hover_color ?? theme.default_dark.input_hover_color);
    root.style.setProperty("--input-text-color", t.input_text_color ?? theme.default_dark.input_text_color);
    root.style.setProperty("--unselected-color", t.unselected_color ?? theme.default_dark.unselected_color);
    root.style.setProperty("--unselected-text-color", t.unselected_text_color ?? theme.default_dark.unselected_text_color);
}


setTheme(theme);