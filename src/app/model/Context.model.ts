import { Operator } from './operator.model';

export class Context extends Operator{
    precedence: number = 0;
    character: string = "()";
    constructor(){
        super();
    }
    apply(): number[] {
        if(this.inputs.length < 1){
            throw Error("Wrong context");
        }
        return this.inputs[0];
    }
}