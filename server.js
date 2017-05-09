// main server logic
'use strict'
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let path = require('path');
let log4js = require('./modules/logger/log4js');
let {logger} = log4js;
let error = logger('error');
let consoleLog = logger('console');
let info = logger('info');
let router = require('./modules/router/router');
// 加入能夠接受json input
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//do router;
router(app);
app.use(log4js.log);
app.listen(process.env.PORT || 8080);

app.on('error',(e)=>{
  error.error(e);
  consoleLog.error(e);
});
// 防止立即 停止
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup){
        // app about to close
        info.warn('server close');
        consoleLog.info('server about to close');
    }
    if (err) {
        // error happen to close the app
        error.error(err.stack);
        // info.warn('server close');
        consoleLog.info(err.stack);
    }
    if (options.exit){
        // error.error('server close');
        info.warn('server close');
        consoleLog.info('server close');
        // close the app
        process.exit();
    }

}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

