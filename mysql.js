
var SQL = require('mysql')

global.DB = SQL.createPool({
    host: 'localhost',
    user: 'root',
    database: 'chatgpt',
    password: ''
});

( async () =>{
    await new Promise(function(resolve,reject) {
        DB.getConnection(function(e) {
            if(e) return reject (console.log(`Ошибка подключения - ${e}`));
            resolve(console.log('Вы успешно подключились к Базе Данных!'));
        })
    })
}) ();
