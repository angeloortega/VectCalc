import { Operator } from './operator.model';

export class Sub extends Operator {
    precedence: number = 3;
    character: string = "-";
    constructor() {
        super();
    }
    apply(): number[] {
        if (this.inputs.length !== 2)
            throw new Error("Cantidad incorrecta de operadores");
        let v1 = this.inputs[0];
        let v2 = this.inputs[1];
        if(typeof v1 === "number" || typeof v2 === "number"){
            throw new Error("Resta solo es aplicable a vectores");
        } 
        if (v1.length !== v2.length)
            throw new Error("Resta solo es aplicable a vectores del mismo tamaño");
        else {
            let vect = [];
            for (let i = 0; i < v1.length; i++)
                vect.push(v1[i] - v2[i]);
            return vect
        }
    }
}