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

require('./001.await.js');  // await is only valid in async function
//require('./002.eval.js'); // f is not defined
//require('./003.js');      // Maximum call stack size exceeded
//require('./004.js');      // Cannot set property 'value' of undefined
//require('./005.js');      // foo is not defined
//require('./006.js');      // Unexpected identifier
//require('./007.js');      // Unexpected token '{'
//require('./008.js');      // Unexpected token '}'
//require('./009.js');      // Unexpected end of input
//require('./010.js');      // Unexpected token ')'
//require('./011.js');      // Invalid or unexpected token
//require('./012.js');      // Promise resolver undefined is not a function
//require('./013.js');      // Sample

//--------------------------------------------------------------------------------------------------