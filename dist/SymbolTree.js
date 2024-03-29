"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SymbolTree = /** @class */ (function () {
    function SymbolTree(n) {
        this.root = n;
        this.current = this.root;
        //Reset global node count on construction
        count = 0;
    }
    SymbolTree.prototype.addBranchNode = function (n) {
        //Maybe refactor to construct a node here
        //Set the parent of new Node
        n.parent = this.current;
        //Add new node to current child list
        this.current.addChild(n);
        //Update current to new node
        this.current = n;
    };
    SymbolTree.prototype.addLeafNode = function (n) {
        n.parent = this.current;
        this.current.addChild(n);
    };
    SymbolTree.prototype.moveCurrentUp = function () {
        //If it has a parent move it up
        if (this.current.parent) {
            this.current = this.current.parent;
        }
    };
    SymbolTree.prototype.toString = function () {
        var result = "";
        function expand(node, depth) {
            for (var i = 0; i < depth; i++) {
                result += " ";
            }
            result += "+\n";
            for (var id in node.stash) {
                //Indent in
                for (var i = 0; i < depth; i++) {
                    result += " ";
                }
                result += "| ";
                var v = node.stash[id];
                result += id + " type: " + v.type + " line: " + v.line + " init: " + v.init + " used: " + v.used + " scopeId: " + v.scopeId + "\n";
            }
            if (node.children.length !== 0) {
                for (var i = 0; i < node.children.length; i++) {
                    expand(node.children[i], depth + 1);
                }
            }
        }
        expand(this.root, 0);
        return result;
    };
    SymbolTree.prototype.clean = function () {
        this.root = this.root.children[0];
    };
    SymbolTree.prototype.findLatestDeclarationScopeId = function (id, scopeId) {
        function find(searchScope) {
            if (searchScope.stash[id]) {
                return searchScope.scopeId;
            }
            else {
                if (searchScope.parent)
                    return find(searchScope.parent);
                else
                    return -1;
            }
        }
        var currentScopeNode = this.getScopeByScopeId(scopeId);
        if (currentScopeNode) {
            return find(currentScopeNode);
        }
        else {
            return -1;
        }
    };
    SymbolTree.prototype.getScopeByScopeId = function (scopeId) {
        var found = undefined;
        function find(node, searchScopeId) {
            if (node.scopeId == searchScopeId) {
                found = node;
            }
            else {
                for (var i = 0; i < node.children.length; i++) {
                    find(node.children[i], searchScopeId);
                }
            }
        }
        find(this.root, scopeId);
        return found;
    };
    return SymbolTree;
}());
exports.SymbolTree = SymbolTree;
var count = 0;
var ScopeNode = /** @class */ (function () {
    function ScopeNode() {
        this.stash = {};
        this.children = [];
        this.parent = null;
        this.scopeId = count++;
    }
    ScopeNode.prototype.addChild = function (n) {
        this.children.push(n);
    };
    ScopeNode.prototype.addStash = function (id, t, l) {
        if (this.stash[id]) {
            //Collision
            return false;
        }
        else {
            this.stash[id] = { "type": t, "line": l, "init": false, "used": false, "scopeId": this.scopeId };
            return true;
        }
    };
    ScopeNode.prototype.stashEntryToString = function (id) {
        var entry = this.stash[id];
        if (!entry)
            return "";
        return entry.type + " " + id + " on line: " + entry.line;
    };
    ScopeNode.prototype.initStashed = function (id) {
        var entry = this.stash[id];
        if (!entry)
            return false;
        entry.init = true;
        return true;
    };
    ScopeNode.prototype.usedStashed = function (id) {
        var entry = this.stash[id];
        if (!entry)
            return false;
        entry.used = true;
        return true;
    };
    return ScopeNode;
}());
exports.ScopeNode = ScopeNode;
