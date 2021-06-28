//--------------------------------------------------------------------------------------------------

const fs = require('fs');
const colors = require('colors/safe');
const stackTrace = require('stack-trace');

/*--------------------------------------------------------------------------------------------------
|
| -> Выводит ошибку в консоль
|
|-------------------------------------------------------------------------------------------------*/

const errorlog = (message, fileName, lineNumber, columnNumber) => {
// Приводим к числу
    lineNumber -= 0;
    columnNumber -= 0;
    
    let str1 = '';
    let str2 = '';
    let str3 = '';
    
    if (message.length >= fileName.length) {
        str1 = new Array((message.length - fileName.length) + fileName.length + 5).join(' ');
        str3 = new Array(message.length - fileName.length + 1).join(' ');
    }
    
    else {
        str1 = new Array(fileName.length + 5).join(' ');
        str2 = new Array(fileName.length - message.length + 1).join(' ');
    }
    
// Содержимое ошибки
    console.log(
        colors.bgRed('         ') + colors.bgBlack(str1 + '\n') +
        colors.bgRed(' Ошибка: ') +
        colors.bgBlack(' "'+message+'" ' + str2 + '\n') + 
        colors.bgRed('         ') + colors.bgBlack(str1)
    );
    
// Имя файла с ошибкой
    console.log(
        colors.bgRed('   Путь: ') +
        colors.bgBlack(' "'+fileName+'" ' + str3 + '\n') +
        colors.bgRed('         ') + colors.bgBlack(str1)
    );
    
// Содержимое файла с ошибкой
    let script_content = fs.readFileSync(fileName).toString().split('\n');
    
// Строка #1
    let line1 = script_content[lineNumber - 3];
    
// Строка #2
    let line2 = script_content[lineNumber - 2];
    
// Строка #3 (строка с ошибкой)
    let line3 = script_content[lineNumber - 1];
    
// Строка #4
    let line4 = script_content[lineNumber + 0];
    
// Строка #5
    let line5 = script_content[lineNumber + 1];
    
// Номера строки
    let lineNumber1 = lineNumber - 2;
    let lineNumber2 = lineNumber - 1;
    let lineNumber3 = lineNumber - 0;
    let lineNumber4 = lineNumber + 1;
    let lineNumber5 = lineNumber + 2;
    
// Пробел после точки
    let spaceNumber = '';
    
// Строки для вывода в консоль
    let print1 = '';
    let print2 = '';
    let print3 = '';
    let print4 = '';
    let print5 = '';
    
// Строка #5
    if (script_content.length >= lineNumber5) {
        print5 =
            colors.bgGreen(lineNumber5 + '. ') +
            colors.bgYellow(line5);
    }
    
// Строка #4
    if (script_content.length >= lineNumber4) {
    // Строка #5 (есть)
        if ((lineNumber4+'').length < (lineNumber5+'').length && print5 != '') {
            spaceNumber = ' ';
        }
        print4 =
            colors.bgGreen(lineNumber4 + '. ' + spaceNumber) +
            colors.bgYellow(line4);
    }
    
// Строка #4 (есть)
    if ((lineNumber3+'').length < (lineNumber4+'').length && print4 != '') {
        spaceNumber = ' ';
    }
    
// Строка #3 (строка с ошибкой)
    print3 =
        colors.bgMagenta(lineNumber3 + '. ' + spaceNumber) +
        colors.bgYellow(line3.substring(0, columnNumber)) +
        colors.bgRed(line3.substring(columnNumber));
        
// Строка #3 (есть)
    if ((lineNumber2+'').length < (lineNumber3+'').length && print3 != '') {
        spaceNumber = ' ';
    }
        
// Строка #2
    if (lineNumber2 >= 1) {
        print2 =
            colors.bgGreen(lineNumber2 + '. ' + spaceNumber) +
            colors.bgYellow(line2);
    }
    
// Строка #2 (есть)
    if ((lineNumber1+'').length < (lineNumber2+'').length && print2 != '') {
        spaceNumber = ' ';
    }
    
// Строка #1
    if (lineNumber1 >= 1) {
        print1 =
            colors.bgGreen(lineNumber1 + '. ' + spaceNumber) +
            colors.bgYellow(line1);
    }
    
// Строка #1
    if (print1 != '') {
        console.log(print1);
    }
    
// Строка #2
    if (print2 != '') {
        console.log(print2);
    }
    
// Строка #3 (строка с ошибкой)
    if (print3 != '') {
        console.log(print3);
    }
    
// Строка #4
    if (print4 != '') {
        console.log(print4);
    }
    
// Строка #5
    if (print5 != '') {
        console.log(print5);
    }
};

/*--------------------------------------------------------------------------------------------------
|
| -> Экспорт
|
|-------------------------------------------------------------------------------------------------*/

module.exports = function(error) {
// Ошибка
    let err = {
        message: error.message
    };
    
// Стек ошибки
    let stack = stackTrace.parse(error);
    
// Файл не указан (скорей всего это ошибка в промисах)
    if (!stack[0].fileName) {
        err.fileName = stack[1].fileName;
        err.line = stack[1].lineNumber;
        err.column = stack[1].columnNumber - 1;
        errorlog(err.message, err.fileName, err.line, err.column);
        return;
    }
    
// Файл указан, но его нет в текущей директории
    if (fs.existsSync(stack[0].fileName)) {
        err.fileName = stack[0].fileName;
        err.line = stack[0].lineNumber;
        err.column = stack[0].columnNumber - 1;
        errorlog(err.message, err.fileName, err.line, err.column);
        return;
    }
    
// Синтаксическая ошибка
    err = {
        message: error.toString().split(':')[1].substring(1),
        fileName: error.stack.split('\n')[0].split(':')[0],
        line: error.stack.split('\n')[0].split(':')[1],
        column: error.stack.toString().split('\n')[2].split('^')[0].length
    };
    errorlog(err.message, err.fileName, err.line, err.column);
};

//--------------------------------------------------------------------------------------------------