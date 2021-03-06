//--------------------------------------------------------------------------------------------------

const fs = require('fs');
const colors = require('colors/safe');
const stackTrace = require('stack-trace');
const columns = require('app.columns');

/*--------------------------------------------------------------------------------------------------
|
| -> Сообщение об ошибке
|
|-------------------------------------------------------------------------------------------------*/

const error_msg = (message, fileName, error) => {
// Сообщение не задано
    if (message == '') {
        return columns([
            ['Путь:', '"'+fileName+'"']
        ], {
            color: ['red', 'black'],
            align: ['right', 'left']
        });
    }
    
// Модуль не найден
    if (message.substring(0, 17) == 'Модуль не найден:'
    ||  message.substring(0, 18) == 'Cannot find module') {
        //let msg = message.split("'");
        let stack = (error ? error.message.split('\n') : []);
        let p = [
            //['Ошибка:', msg[0].substring(0, msg[0].length - 1)+':'],
            ['Ошибка:', 'Модуль не найден:'],
            [     '\n', "\n'"+message.split("'")[1]+"'"]
        ];
        
        if (stack.length > 3) {
            p.push(['\n', '\n']);
            //p.push(['\n', '\nRequire stack:']);
            p.push(['\n', '\nЦепочка вызовов:']);
            
            for (let i = 2; i < stack.length; i++) {
                p.push(['\n', "\n'"+stack[i].split('- ')[1]+"'"]);
            }
        }
        
        p.push(['Путь:', '"'+fileName+'"']);
        
        return columns(p, {
            color: ['red', 'black'],
            align: ['right', 'left']
        });
    }
    
// Файл или каталог не найден
    if (message.substring(0, 33) == 'ENOENT: no such file or directory') {
        //let msg = message.split("'");
        return columns([
            //['Ошибка:', msg[0].substring(0, msg[0].length - 1)+':'],
            ['Ошибка:', 'Файл или каталог не найден:'],
            [     '\n', "\n'"+message.split("'")[1]+"'"],
            [  'Путь:', '"'+fileName+'"']
        ], {
            color: ['red', 'black'],
            align: ['right', 'left']
        });
    }
    
// Стандартное сообщение
    return columns([
        ['Ошибка:', '"'+message+'"'],
        [  'Путь:', '"'+fileName+'"']
    ], {
        color: ['red', 'black'],
        align: ['right', 'left']
    });
};

/*--------------------------------------------------------------------------------------------------
|
| -> Выделение ошибки в файле
|
|-------------------------------------------------------------------------------------------------*/

const highlight = (fileName, lineNumber, columnStart, columnEnd) => {
// Содержимое файла с ошибкой
    let script_content = fs.readFileSync(fileName).toString().split('\n');
    
// Строка #1
    let line1 = script_content[lineNumber - 3]||'';
    
// Строка #2
    let line2 = script_content[lineNumber - 2]||'';
    
// Строка #3 (строка с ошибкой)
    let line3 = script_content[lineNumber - 1]||'';
    
// Строка #4
    let line4 = script_content[lineNumber + 0]||'';
    
// Строка #5
    let line5 = script_content[lineNumber + 1]||'';
    
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
            colors.bgGreen(lineNumber5+'. ') +
            colors.bgYellow(line5);
    }
    
// Строка #4
    if (script_content.length >= lineNumber4) {
    // Строка #5 (есть)
        if ((lineNumber4+'').length < (lineNumber5+'').length && print5 != '') {
            spaceNumber = ' ';
        }
        print4 =
            colors.bgGreen(lineNumber4+'. '+spaceNumber) +
            colors.bgYellow(line4);
    }
    
// Строка #4 (есть)
    if ((lineNumber3+'').length < (lineNumber4+'').length && print4 != '') {
        spaceNumber = ' ';
    }
    
// Если у выделяемой строки начальная позиция больше длины строки
    if (columnStart >= line3.length) {
        columnStart = 0;
    }
    
// Строка #3 (строка с ошибкой)
    print3 =
        colors.bgMagenta(lineNumber3+'. '+spaceNumber) +
        colors.bgYellow(line3.substring(0, columnStart)) +
        colors.bgRed(line3.substring(columnStart, columnEnd||undefined));
        
// Если у выделяемой строки есть конечная позиция
    if (columnEnd) {
        print3 += colors.bgYellow(line3.substring(columnEnd))
    }
    
// Строка #3 (есть)
    if ((lineNumber2+'').length < (lineNumber3+'').length && print3 != '') {
        spaceNumber = ' ';
    }
    
// Строка #2
    if (lineNumber2 >= 1) {
        print2 =
            colors.bgGreen(lineNumber2+'. '+spaceNumber) +
            colors.bgYellow(line2);
    }
    
// Строка #2 (есть)
    if ((lineNumber1+'').length < (lineNumber2+'').length && print2 != '') {
        spaceNumber = ' ';
    }
    
// Строка #1
    if (lineNumber1 >= 1) {
        print1 =
            colors.bgGreen(lineNumber1+'. '+spaceNumber) +
            colors.bgYellow(line1);
    }
    
// Лог
    let log = '';
    
// Строка #1
    if (print1 != '') {
        log += print1 + '\n';
    }
    
// Строка #2
    if (print2 != '') {
        log += print2 + '\n';
    }
    
// Строка #3 (строка с ошибкой)
    if (print3 != '') {
        log += print3 + '\n';
    }
    
// Строка #4
    if (print4 != '') {
        log += print4 + '\n';
    }
    
// Строка #5
    if (print5 != '') {
        log += print5;
    }
    
    return log;
};

/*--------------------------------------------------------------------------------------------------
|
| -> Выводит ошибку в консоль
|
|-------------------------------------------------------------------------------------------------*/

const errorlog = (error, message, fileName, lineNumber, columnNumber) => {
// Приводим к числу
    lineNumber -= 0;
    columnNumber -= 0;
    
// Лог
    let log = '';
    
// Сообщение об ошибке
    log += error_msg(message, fileName, error);
    
// Выделение ошибки в файле
    log += highlight(fileName, lineNumber, columnNumber);
    
// Выводим в консоль
    console.log(log + '\n');
};

/*--------------------------------------------------------------------------------------------------
|
| -> ErrorLog
|
|-------------------------------------------------------------------------------------------------*/

module.exports = function(error, noViewFile) {
// Неизвестная ошибка
    if (typeof error.message == 'undefined') {
        let err = columns.col(['Неизвестная ошибка!']).join('');
        console.log(err.substring(0, err.length-1));
        console.log(error);
        return;
    }
    
// Ошибка
    let err = {
        message: error.message.split('\n')[0]
    };
    
// Стек ошибки
    let stack = stackTrace.parse(error);
    
// Синтаксическая ошибка
    if (fs.existsSync(error.stack.split('\n')[0].split(':')[0])) {
        err = {
            message: error.toString().split(':')[1].substring(1),
            fileName: error.stack.split('\n')[0].split(':')[0],
            line: error.stack.split('\n')[0].split(':')[1],
            column: error.stack.toString().split('\n')[2].split('^')[0].length
        };
        errorlog(error, err.message, err.fileName, err.line, err.column);
        err.message = '';
    }
    
// Остальные ошибки
    else {
        let files = {};
        
        for (let i = 0; i < stack.length; i++) {
            if (stack[i].fileName != noViewFile) {
            // Фильтруем одинаковые строки в одном файле
                if (!files[
                    stack[i].fileName +''+
                    stack[i].lineNumber +''+
                    stack[i].columnNumber
                ]) {
                    if (fs.existsSync(stack[i].fileName)) {
                        files[
                            stack[i].fileName +''+
                            stack[i].lineNumber +''+
                            stack[i].columnNumber
                        ] = true;
                        err.fileName = stack[i].fileName;
                        err.line = stack[i].lineNumber;
                        err.column = stack[i].columnNumber - 1;
                        errorlog(
                            error,
                            err.message,
                            err.fileName,
                            err.line,
                            err.column
                        );
                        err.message = '';
                    }
                }
            }
        }
    }
};

// Сообщение об ошибке
module.exports.msg = error_msg;

// Выделение ошибки в файле
module.exports.highlight = highlight;

//--------------------------------------------------------------------------------------------------