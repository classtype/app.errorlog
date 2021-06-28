## Что это?

**App.errorlog** — это [npm-пакет](https://www.npmjs.com/package/app.errorlog)
с помощью которого вы можете красиво вывести стека ошибок в консоль.

## Пример

```js
const ErrorLog = require('app.errorlog');

process.on('uncaughtException', (error) => {
    ErrorLog(error);
});

let obj = {};
obj.noInitMethod();

obj.noInitMethod = function() {
};
```

Результат в консоли:

![](https://github.com/classtype/app.errorlog/raw/master/examples/sample.png)

## Установка

```
$ npm i app.errorlog
```
