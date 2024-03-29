import {Node} from "./SyntaxTree";
import {SymbolTree, ScopeNode} from "./SymbolTree";
export class StaticDataTable{
    currentAddress : number; 
    variables: {[name:string]: {scope:number, addr: number, type?: string}};
    st: SymbolTree;
    constructor(st: SymbolTree) {
        //Current address starts at 3 since there are two temporary variables
        this.currentAddress = 3;
        this.variables = {};
        this.st = st;
    }
    add(n: Node, scope: number, type?: string): number {
        let key = this.getVarKey(n.name, scope);
        this.variables[key] = {scope: 0, addr: 0};
        this.variables[key].scope = scope;
        let addr = this.currentAddress;
        this.variables[key].addr = this.currentAddress;
        this.currentAddress++;
        (type? this.variables[key].type = type : undefined);
        return addr;
    }
    findAddr(id: string, scope: number): number{
        return this.variables[this.getVarKey(id, scope)].addr;
    }
    getVarKey(id: string, currentScope: number): string {
        let scope = this.st.findLatestDeclarationScopeId(id, currentScope); 
        return id+":"+scope;
    }
    getVar(id: string, scope: number): {scope:number, addr: number, type?: string} {
        return this.variables[this.getVarKey(id, scope)];
    }


}