let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var MonitorControl = sequelize.define('monitorControl',{
    IMEI:{type:Sequelize.STRING, primaryKey: true},
    applist:Sequelize.CHAR(1),
    connectedCell:Sequelize.CHAR(1),
    nearbyCell:Sequelize.CHAR(1),
    contacts:Sequelize.CHAR(1),
    gps:Sequelize.CHAR(1),
    wifistate:Sequelize.CHAR(1),
    catchimage:Sequelize.CHAR(1),
    callrecord:Sequelize.CHAR(1),
    exectime:Sequelize.STRING   
},{ timestamps: false,
    tableName:'monitorControl',
    // freezeTableName:false
});

module.exports = MonitorControl;