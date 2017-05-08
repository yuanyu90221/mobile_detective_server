let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var WiFiState = sequelize.define('wifistate',{
    IMEI:{type:Sequelize.STRING, primaryKey: true},
    SSID: Sequelize.STRING,
    LinkSpeed: Sequelize.STRING,
    MAC_Address: Sequelize.STRING,
    IP_Address: Sequelize.STRING,
    Time: Sequelize.STRING,   
},{ timestamps: false,
    tableName:'wifistate',
    // freezeTableName:false
});

module.exports = WiFiState;