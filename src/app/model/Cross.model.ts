import { Operator } from './operator.model';

export class Cross extends Operator {
    precedence: number = 1;
    character: string = "x";
    constructor() {
        super();
    }
    apply(): number[] {
        if (this.inputs.length !== 2)
            throw new Error("Cantidad incorrecta de operadores");
        let v1 = this.inputs[0];
        let v2 = this.inputs[1];
        if (v1.length !== 3 || v2.length !== 3)
            throw new Error("Producto cruz solo es aplicable a vectores 3D");
        else
            return [
                v1[1] * v2[2] - v1[2] * v2[1],
                v1[2] * v2[0] - v1[0] * v2[2],
                v1[0] * v2[1] - v1[1] * v2[0],
            ]
    }
}