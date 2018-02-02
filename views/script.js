
window.onload = function() {
    //Setup Ace editor
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/dracula");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setOptions({useSoftTabs: true});
    editor.getSession().setUseWorker(false);
    editor.setShowPrintMargin(false);
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
    //Just for testing
    setInterval(function() { gauge.refresh(getRandomInt(0,256))}, 2000);

    const LexerModule = require('../dist/Lexer.js');
    window.compileCode = function() {
        $("#log-text").html("Starting Lexer...\n");
        //Safe way to track time, supported on newer browsers
        let start =  window.performance.now();

        const lexer = new LexerModule.Lexer();
        //result :: {t:Token[], e:{lvl:string, msg:string} | null} | null
        const result = lexer.lex(editor.getValue());


        let time = window.performance.now()-start;

        const tokens = result.t;

        //Append messages for whatever tokens are available
        for(var i = 0; i < tokens.length; i++) {
            $("#log-text").append("[LEXER] => "+tokens[i].kind+" on line: "+tokens[i].lineNum+"\n");
        }
        //If there was an error report it and color it based on level
        if (result.e) {
            let errorMsg = $("<span></span>").append("[LEXER] => "+result.e.lvl+": "+result.e.msg+"\n")
                .addClass('compile-'+result.e.lvl);
            
            $("#log-text").append(errorMsg);
        } 
        $("#log-text").append("[LEXER] => Completed in: "+time.toFixed(2)+" ms");
    }
}


////D3 for AST, Might not be worth the extra work
//var svg = d3.select("#ast-graph")
//    .append("svg")
//    .attr("width", "100%")
//    .attr("height", "100%")
//    .call(d3.zoom().on("zoom", function() {
//        svg.attr("transform",d3.event.transform) 
//    }))
//    .append("g");
//
//    svg.append("circle")
//        .attr("cx", 100)
//        .attr("cy", $("#ast-graph").height())
//        .attr("r", 20)
//        .style("fill", "#b9d334");
//console.log($("#ast-graph").width());
