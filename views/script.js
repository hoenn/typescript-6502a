var editor = ace.edit("editor");
editor.setTheme("ace/theme/dracula");
editor.getSession().setMode("ace/mode/javascript");
editor.getSession().setUseWorker(false);
editor.setShowPrintMargin(false);


editorMode = "default";
window.toggleEditorMode = function (btn) {
    if (editorMode === "default") {
        editor.setKeyboardHandler("ace/keyboard/vim");
        editorMode = "vim";
        document.getElementById("modeToggleButton").textContent="Editor Mode: Vim";
    } else {
        editor.setKeyboardHandler("");
        editorMode = "default";
        document.getElementById("modeToggleButton").textContent="Editor Mode: Default";
    }
}

var testBrowserify = require("../dist/greet");
console.log(testBrowserify.greeter("Evan!"));