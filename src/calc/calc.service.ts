import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const expression = calcBody.expression;
    //Validate the request
    if (
      !this.isDigit(expression[0]) ||
      !this.isDigit(expression[expression.length - 1])
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const tokens = expression.match(/(\d+|\+|\-|\*|\/)/g);
    if (!tokens) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let result = 0;
    let stack = [];
    const arr = expression.split('');
    for (let index = 0; index < arr.length - 1; index++) {
      //In case of digit push in stack
      if (this.isDigit(arr[index])) {
        stack.push(Number(arr[index]));
      } else if (['+', '-', '*', '/'].includes(arr[index])) {
        // In case of Arithmatic operation
        switch (arr[index]) {
          //As per athe operation calculate value
          case '+':
            result = Number(stack[0]) + Number(arr[index + 1]);
            stack = [];
            stack.push(result);
            break;
          case '-':
            result = Number(stack[0]) - Number(arr[index + 1]);
            stack = [];
            stack.push(result);
            break;
          case '*':
            result = Number(stack[0]) * Number(arr[index + 1]);
            stack = [];
            stack.push(result);
            break;
          case '/':
            //Handles the divide by zero case
            if (arr[index + 1] === '0') {
              break;
            }
            result = Number(stack[0]) / Number(arr[index + 1]);
            stack = [];
            stack.push(result);
            break;

          default:
            break;
        }
      }
    }
    return result;
  }
  isDigit = (char: string): boolean => {
    const num = parseInt(char, 10);
    return !isNaN(num) && num >= 0 && num <= 9;
  };
}
