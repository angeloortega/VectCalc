import { Operator } from './operator.model';
import { OperatorFactory } from './OperatorFactory.model';

class Stack {
    private val = [];
    public peek() {
        return this.val[this.val.length - 1]
    }
    public push(obj) {
        this.val.push(obj);
    }
    public pop() {
        return this.val.splice(this.val.length - 1, 1)[0];
    }
    public length(){
        return this.val.length;
    }
}

export class InputStack {
    public levels: Stack;
    public closedContext;
    public partialResult;
    public operatorFact = new OperatorFactory();
    constructor() { 
        this.reset();
    }

    public reset() {
        this.levels = new Stack();
        this.levels.push(new Stack());
        this.closedContext = null;
    }

    public wrapLastOperation(op: Operator) {
        let stack = this.levels.peek();
        stack.push(op.addInput(stack.pop().apply()));
        this.collapse(op.precedence);
    }

    public collapse(precedence: number) {
        let stack = this.levels.peek();
        let currentOperation: Operator = stack.pop();
        let previousOperation = stack.peek();
        if (!currentOperation) return;
        if (!currentOperation.isReady()) {
            stack.push(currentOperation);
            return;
        }
        this.partialResult  = currentOperation.apply(); //TODO parse vector
        if (previousOperation && previousOperation.precedence <= precedence) {
            previousOperation.addInput(currentOperation.apply());
            this.collapse(precedence);
        }
        else {
            stack.push(currentOperation);
        }
    }

    public push(number, operation){
        var stack = this.levels.peek();
        var lastOperation = stack.peek();
        var input = this.closedContext || number;
        this.closedContext = null;
        this.partialResult = input;//TODO parse vector
        if (!lastOperation || operation.precedence < lastOperation.precedence) {
            stack.push(operation.addInput(input));
            this.collapse(operation.precedence);
        }
        else {
            lastOperation.addInput(input);
            this.collapse(operation.precedence);
            this.wrapLastOperation(operation);
        }
        return this;
    }

    public openContext() {
        var lastOperation : Operator = this.levels.peek().peek();
        if (this.closedContext || lastOperation && lastOperation.isReady()) return;
        this.levels.push(new Stack);
        return this;
    }

    public closeContext(num) {
        if (this.levels.length() <= 1) return;
        var input = this.closedContext || num;
        var stack = this.levels.peek();
        var lastOperation = stack.peek();
        if(lastOperation){
            lastOperation.addInput(input);
            this.collapse(6);
            input = stack.pop();
        }
        this.closedContext = this.operatorFact.createOperation('()').addInput(input).apply()
        this.closedContext = this.closedContext.apply();
        this.partialResult = this.closeContext;
        this.levels.pop();
        return this;
    }

    public evaluate(number) {
        var input = this.closedContext || number;
        this.partialResult = input; //TODO parse vector
        while(this.levels.length() > 1) {
            this.closeContext(input);
        }
        var lastOperation = this.levels.peek().peek();
        lastOperation && lastOperation.addInput(input);
        this.collapse(6);
        this.reset();
        return this.partialResult;
    }
    public getPartialResult(){
        var _partialResult = this.partialResult;
        this.partialResult = 0;
        return _partialResult;
    }
}