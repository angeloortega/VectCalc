import { Operator } from './operator.model';
import { Dot } from './Dot.model';
import { Sum } from './Sum.model';
import { Sub } from './Sub.model';
import { Cross } from './Cross.model';
import { Context } from './Context.model';

export class OperatorFactory{
   
    public createOperation(op : string) : Operator{
        switch(op){
            case("+"):
                return new Sum;
            case("-"):
                return new Sub;
            case("•"):
                return new Dot;
            case("x"):
                return new Cross;
            case("()"):
                return new Context;
            default:
                throw new Error("Operación inválida");
        }
    }
}