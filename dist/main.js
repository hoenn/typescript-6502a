"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Lexer_1 = require("./Lexer");
var Parser_1 = require("./Parser");
var SemanticAnalyzer_1 = require("./SemanticAnalyzer");
var fs = require("fs");
function main(sourceArg, filePath) {
    var sourceProgram;
    //If the sourceArg is a filepath, parse it into a string
    if (filePath) {
        sourceProgram = fs.readFileSync(sourceArg, 'utf8');
    }
    else {
        sourceProgram = sourceArg;
    }
    var l = new Lexer_1.Lexer();
    var tokens = l.lex(sourceProgram);
    //HCF is there was a lex error
    if (tokens.e) {
        if (tokens.e.lvl == 'error') {
            return;
        }
    }
    console.log(tokens.t);
    if (tokens.t) {
        var p = new Parser_1.Parser(tokens.t);
        var tree = p.parse();
        if (tree.cst) {
            console.log(tree.cst.toString());
        }
        if (tree.st) {
            console.log(tree.st);
        }
        if (tree.e) {
            console.log(tree.e);
        }
        if (tree.ast) {
            console.log(tree.ast.toString());
            var s = new SemanticAnalyzer_1.SemanticAnalyzer(tree.ast);
            var analysis = s.analyze();
            console.log(analysis.log);
            console.log(analysis.st.toString());
        }
    }
    return sourceProgram;
}
exports.main = main;
if (process.argv[3] && process.argv[3] == 'r' || process.argv[3] == 'raw') {
    main(process.argv[2], false);
}
else {
    main(process.argv[2], true);
}
