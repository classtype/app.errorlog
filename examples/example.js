const ErrorLog = require('../src/app.errorlog');

process.on('uncaughtException', (error) => {
    ErrorLog(error);
});

let obj = {};
obj.noInitMethod();

obj.noInitMethod = function() {
};