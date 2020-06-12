export abstract class Operator{
    abstract apply(): Operator | number[] | number;            //function that applies the operator;
    abstract precedence: number; //precedence number, lower is better
    abstract character: string;  //Character that identifies the operator
    inputs: any = [];
    public constructor(){}
    public addInput(vect): Operator{
        if(this.inputs.length === 2){
            throw Error("No se puede agregar más de dos operadores!");
        }
        //if(typeof vect === "number") vect = [vect];
        this.inputs.push(vect);
        return this;
    }
    public isReady(): boolean{
        return this.inputs.length === 2;
    }
}