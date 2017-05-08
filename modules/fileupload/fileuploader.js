let multer = require('multer');
let config = require('./upload-config');
let log4js = require('../logger/log4js');
let {logger} = log4js;
let consoleLog = logger('console');
let info = logger('info');
let warn = logger('warn');
let storage = multer.diskStorage({
    destination: function(req, file, callback){
        consoleLog.info(file);
        callback(null,'./files/');
    },
    filename: function (req, file, callback){
         consoleLog.info(file);
        // let fileExt = (file.originalname).split(".");
        callback(null,file.originalname);
    }
});
let upload = multer({
    storage:storage    
});
module.exports = upload;