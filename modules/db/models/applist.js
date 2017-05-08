let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var AppList = sequelize.define('applist',{
    IMEI:{type:Sequelize.STRING, primaryKey: true},
    AppName: Sequelize.STRING,
    PackageName: Sequelize.STRING,
    Time: Sequelize.STRING,
    IsInstalled: Sequelize.BOOLEAN   
},{ timestamps: false,
    tableName:'applist',
    // freezeTableName:false
});

module.exports = AppList;