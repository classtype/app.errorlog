//--------------------------------------------------------------------------------------------------

const ErrorLog = require('../src/app.errorlog');

/*--------------------------------------------------------------------------------------------------
|
| -> Обработчики ошибок
|
|-------------------------------------------------------------------------------------------------*/

// Добавляем обработчик на обработку исключений
process.on('uncaughtException', (error) => {
// Выводим ошибку в консоль
    ErrorLog(error);
});

// Добавляем обработчик на обработку исключений для Promise
process.on('unhandledRejection', (error) => {
// Выводим ошибку в консоль
    ErrorLog(error);
});

//--------------------------------------------------------------------------------------------------

// require('module_no_found'); // Cannot find module
// require('./001.js');        // Cannot find module
// require('./002.js');        // ENOENT: no such file or directory, scandir
// require('./003.js');        // ENOENT: no such file or directory, open
// require('./004.js');        // ENOENT: no such file or directory, readlink
// require('./005.js');        // Error list
// require('./006.await.js');  // await is only valid in async function
// require('./007.eval.js');   // f is not defined
// require('./008.js');        // Maximum call stack size exceeded
// require('./009.js');        // Cannot set property 'value' of undefined
// require('./010.js');        // foo is not defined
// require('./011.js');        // Unexpected identifier
// require('./012.js');        // Unexpected token '{'
// require('./013.js');        // Unexpected token '}'
// require('./014.js');        // Unexpected end of input
// require('./015.js');        // Unexpected token ')'
// require('./016.js');        // Invalid or unexpected token
// require('./017.js');        // Promise resolver undefined is not a function
// require('./018.js');        // SyntaxError
// require('./019.js');        // Unexpected token }
require('./020.js');           // method_error

//--------------------------------------------------------------------------------------------------