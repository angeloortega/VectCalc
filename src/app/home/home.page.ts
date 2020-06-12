import { Component } from '@angular/core';
import { InputStack } from '../model/InputStack.model';
import { OperatorFactory } from '../model/OperatorFactory.model';
import { ERROR_COMPONENT_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public display = "";
  private precedence = ['()', 'x', '•', '+', '-'];
  private inputStack: InputStack;
  private operatorFactory: OperatorFactory;
  constructor() {
    this.inputStack = new InputStack();
    this.operatorFactory = new OperatorFactory();
  }

  checkParenthesis() {
    let opposites = {
      "]": "[",
      ")": "("
    }
    let stack = [];
    for (let i = 0; i < this.display.length; i++) {
      let char = this.display[i];
      if (["[", "("].includes(char)) {
        stack.push(char);
      }
      else if (typeof opposites[char] !== "undefined" && stack.length > 0 && opposites[char] === stack[stack.length - 1]) {
        stack.splice(stack.length - 1, 1);
      }
      else if (typeof opposites[char] !== "undefined") {
        return false;
      }
    };
    return stack.length === 0;
  }

  calculate() {
    if (this.checkParenthesis()) {
      try {
        let openBracket = false
        let contextInput = [];
        let currentContext = 0;
        let i = 0;
        while (i < this.display.length) {
          let character = this.display[i];
          switch (this.display[i]) {
            case ('['):
              if (openBracket) throw new Error("Solo se aceptan vectores o escalares");
              openBracket = true;
              break;
            case (']'):
              openBracket = false;
              break;
            case ('('):
              if (openBracket) throw new Error("No se puede agrupar con parentesis dentro de vector");
              this.inputStack.openContext();
              break;
            case (')'):
              this.inputStack.closeContext(contextInput[currentContext]);
              contextInput.splice(currentContext, 1);
              break;

            case ('+'):
            case ('x'):
            case ('•'):
              this.inputStack.push(contextInput[currentContext], this.operatorFactory.createOperation(character));
              contextInput.splice(currentContext, 1);
              break;
            case ('-'):
              if (this.display[i + 1] && this.display[i + 1].match(/[0-9]/)) {
                //go to default because it's a negative number coming
              } else {
                this.inputStack.push(contextInput[currentContext], this.operatorFactory.createOperation(character));
                contextInput.splice(currentContext, 1);
                break;
              }
            default:
              //we have stumbled upon a number or a vector, let's parse it
              let vect = []
              let currentNum = character;
              while (this.display[i + 1] && this.display[i + 1].match(/[0-9]|;|\.|\-/)) {
                let tmpChar = this.display[++i];
                if (tmpChar === ";") {
                  vect.push(Number(currentNum));
                  currentNum = '';
                } else currentNum += this.display[i];
              }
              if (currentNum != '') vect.push(Number(currentNum));
              if (contextInput[currentContext]) throw new Error("Solo puede haber un valor por vector");
              contextInput[currentContext] = openBracket ? vect : vect[0]; //If no bracket is open, it must be a scalar
          };
          i++;
        }
        let tmpResult = this.inputStack.evaluate(contextInput[currentContext]);
        let isNumber = typeof tmpResult === "number";
        this.display = tmpResult.toString().replace(/,/g, ';');
        if (!isNumber) this.display = "[" + this.display + "]"
      } catch (error) {
        //throw error;
        this.display = "ERROR MAT.";
      }

    }
    else this.display = "ERROR SINTAXIS";
  }
  public click(key) {
    if (this.display.includes("ERROR"))
      this.display = "";
    switch (key) {
      case "=":
        this.calculate();
        break;
      case "🡄":
        this.display = this.display.slice(0, -1);
        break;
      case "ac":
        this.display = "";
        break;
      default:
        this.display += key;
        break;
    }
  }

}
