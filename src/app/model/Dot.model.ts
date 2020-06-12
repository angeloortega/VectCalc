import { Operator } from './operator.model';

export class Dot extends Operator{
    precedence: number = 2;
    character: string = "•";
    constructor(){
        super();
    }
    apply(): number {
        if(this.inputs.length !== 2)
            throw new Error("Cantidad incorrecta de operadores");
        let v1 = this.inputs[0];
        let v2 = this.inputs[1]; 
        if(typeof v1 === "number" && typeof v2 === "number"){
            throw new Error("Producto solo es aplicable a vectores o a escalar con vector");
        } 
        if(typeof v1 === "number" || typeof v2 === "number"){
            if (typeof v2 === "number") {
                let vtemp = v1;
                v1 = v2;
                v2 = vtemp;
            }
            for(let i = 0; i < v2.length; i++)
                v2[i] = v1*v2[i];
            return v2;
        } 
        if(v1.length !==  v2.length)
            throw new Error("Producto punto solo es aplicable a vectores del mismo tamaño");
        else{
            let reduction = 0;
            for(let i = 0; i < v1.length; i++)
                reduction += v1[i]*v2[i];
            return reduction;
        }
    }
}