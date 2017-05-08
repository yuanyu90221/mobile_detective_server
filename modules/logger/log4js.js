// Set Logger
let log4js = require('log4js');
let moment = require('moment');
let outputTimeFormat = moment().format("YYYY-MM-DD-HH-mm-ss");
// log4js Appender的設定
log4js.configure({
    appenders:[
        {
            type: 'console',    //輸出為console
            category: 'console' //別名為console
        }, // console show
        {
            type: 'file',                                    //輸出為file
            filename: `logs/${outputTimeFormat}-access.log`, //輸出檔案名
            maxLogSize:  1024,                               //每1024 MB為一個檔案
            backups: 10,                                     //每10最多存最新10個檔案 
            category: 'info'                                 //別名為console
        },
        {
            type: 'file',
            filename: `logs/${outputTimeFormat}-error.log`,
            maxLogSize:  1024, // 
            backups: 10,
            category: 'error'
        },
        {
            type: 'file',
            filename: `logs/${outputTimeFormat}-output.log`,
            maxLogSize:  1024, // 
            backups: 10,
            category: 'warn'
        }
    ],
    replaceConsole: true
})

let logger = log4js.getLogger('info');
logger.setLevel('INFO');

let log = log4js.connectLogger(logger, {level: 'auto', format:':method :url'});
module.exports = {
    log: log,
    logger: (name)=>{
        let logger = log4js.getLogger(name);
        let logLevel = 'INFO';
        switch(name){
            case 'info':
                logLevel = 'INFO';
                break;
            case 'error':
                logLevel = 'ERROR';
                break;
            case 'warn':
                logLevel = 'WARNING';
                break;
        }
        logger.setLevel(logLevel);
        return logger;
    }
}