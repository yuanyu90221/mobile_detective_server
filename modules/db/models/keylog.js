let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var KeyLog = sequelize.define('keylog',{
    imei:{type:Sequelize.STRING, primaryKey: true},
    keylog: Sequelize.STRING,
    timestamp: Sequelize.BIGINT,   
},{ timestamps: false,
    tableName:'keylog',
    // freezeTableName:false
});

module.exports = KeyLog;