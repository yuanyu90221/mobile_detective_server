let Sequelize = require('sequelize');
let dbConfig = require('../../config/config');
let log4js = require('../logger/log4js');
let {logger} = log4js;
// let consoleLog = logger('console');
let fileLog = logger('info');
// consoleLog.info(dbConfig);
fileLog.info(dbConfig);
module.exports = new Sequelize(dbConfig.dbName,dbConfig.dbUser, dbConfig.dbPwd, {
    host:dbConfig.dbHost,
    dialect:dbConfig.dbType,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }

});