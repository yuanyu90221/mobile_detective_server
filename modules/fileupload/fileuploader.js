let multer = require('multer');
let config = require('./upload-config');
let log4js = require('../logger/log4js');
let {logger} = log4js;
// let consoleLog = logger('console');
let warn = logger('warn');
// multer 設定
let storage = multer.diskStorage({
    // upload folder
    destination: function(req, file, callback){
        // consoleLog.info(`${file.originalname} is uploading to ${config.upload.path}`);
        warn.warn(`${file.originalname} is uploading to ${config.upload.path}`);
        callback(null,config.upload.path);
    },
    // upload filename
    filename: function (req, file, callback){
        // consoleLog.info(`${file.originalname} is uploading`);
        warn.warn(`${file.originalname} is uploading`);
        callback(null,file.originalname);
    }
});
let upload = multer({
    storage:storage    
});
module.exports = upload;