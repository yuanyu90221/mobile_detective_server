let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var GPS = sequelize.define('gps',{
    IMEI:{type:Sequelize.STRING, primaryKey: true},
    latitude: Sequelize.STRING,
    longitude: Sequelize.STRING,
    Time: Sequelize.STRING,   
},{ timestamps: false,
    tableName:'gps',
    // freezeTableName:false
});

module.exports = GPS;