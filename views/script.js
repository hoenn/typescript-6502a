var example  = require('./examples');
const programs = example.programs;

var editor;
window.onload = function() {
    //Setup Ace editor
    editor = ace.edit("editor");
    editor.setFontSize(16);
    editor.setTheme("ace/theme/dracula");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setOptions({useSoftTabs: true});
    editor.getSession().setUseWorker(false);
    editor.setShowPrintMargin(false);
    editor.$blockScrolling = Infinity;
    //Vim Mode toggling
    editorMode = "default";
    window.toggleEditorMode = function (btn) {
        if (editorMode === "default") {
            editor.setKeyboardHandler("ace/keyboard/vim");
            editorMode = "vim";
            $("#mode-toggle-button").text("Editor Mode: Vim");
        } else {
            editor.setKeyboardHandler("");
            editorMode = "default";
            $("#mode-toggle-button").text("Editor Mode: Default");
        }
        editor.focus();
    }
    //Setup Memory gauge for machine code
    var gauge = new JustGage({
        id: "memory-gauge",
        value: getRandomInt(0, 256), //test
        min: 0,
        max: 256, //Replace with real max byte
        height:160,
        width:180,
        gaugeColor: "#44475a",
        levelColors: ["#bd93f9", "#ff5555"],
        title:"Bytes used",
        titleFontColor: "#f8f8f2",
        titleFontFamily: 'monospace',
        valueFontColor: "#f8f8f2",
        valueFontFamily: 'monospace'
    });
    //Just for testing gauge
    setInterval(function() { gauge.refresh(getRandomInt(0,256))}, 2000);

    //Setup clickable Example Program List
    programs.forEach(element => {
        let item = $("<span class='dropdown-item'></span")
            .html(element.name)
            .css("cursor", "pointer")
            .on('click', function() {editor.setValue(""+element.source, 1)});
        if(element.type != null) {
            item.addClass(statusColor(element.type))
        }
        $(".dropdown-menu").append(item);
    });

    //Compile Code
    const LexerModule = require('../dist/Lexer.js');
    window.compileCode = function() {
        //Don't run if editor is empty
        if(editor.getValue().trim() == ""){
            return;
        } 
        clearTabsAndErrors();
        $("#log-text").html("Starting Lexer...\n");
        //Safe way to track time, supported on newer browsers
        let start =  window.performance.now();

        const lexer = new LexerModule.Lexer();
        //result :: {t:Token[], e:{lvl:string, msg:string} | null} | null
        const result = lexer.lex(editor.getValue());


        let time = window.performance.now()-start;

        //Clear Lex tab

        const tokens = result.t;
        //Append messages for whatever tokens are available
        for(var i = 0; i < tokens.length; i++) {
            let text = "[LEXER] => "+tokens[i].kind+" on line: "+tokens[i].lineNum+"\n"
            tabOutput("lexer",text);
        }
        //If there was an error report it and color it based on level
        if (result.e) {
            let errorMsg = $("<span></span>").append("[LEXER] => "+result.e.lvl+": "+result.e.msg+"\n")
                .addClass(statusColor(result.e.lvl));
            applyFilter($("#compile-img"), result.e.lvl);
            
            logError("lexer", errorMsg);
            $("#tab-head-two").addClass(statusColor(result.e.lvl));
        } else {
            applyFilter($("#compile-img"), 'default');
        }
        logOutput("lexer", "[LEXER] => Completed in: "+time.toFixed(2)+" ms");

        //Go back to editor when complete
        editor.focus();
    }
}
/*
Working program, blue or green?
const greenFilter = "hue-rotate(220deg)";
const blueFilter = "hue-rotate(310deg)";
*/
const filters = {
    "warning": "hue-rotate(110deg)",
    "error": "hue-rotate(78deg)",
    "default": "hue-rotate(0deg)"
}
applyFilter = function(element, color) {
    element.css("filter", filters['default']).delay(1000)
    .queue(function (next) {
        $(this).css("filter", filters[color]);
        next();
    });
}

tabOutput = function (target, text) {
    let element = "#"+target+"-text";
    $(element).append(text);
}
logOutput = function (target, text) {
    let element = "#"+target+"-text";
    $(element).append(text);
    $("#log-text").append(text);
}
logError = function (target, obj) {
    let element = "#"+target+"-text";
    $(element).append(obj);
    $("#log-text").append(obj.clone());
}
statusColor = function (type) {
    return 'compile-'+type;
}
clearTabsAndErrors = function(){
    //Lexer
    $("#lexer-text").html("");
    $("#tab-head-two").removeClass( function(index, className) {
        return (className.match(/(compile-error|compile-warning)/g)||[]).join(' ');
    });
}

loadProgram = function(index) {
    editor.setValue(""+programs[index].source,1);
}

