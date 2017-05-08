let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var NearbyCellInfo = sequelize.define('nearbyCellinfo',{
    IMEI:{type:Sequelize.STRING, primaryKey: true},
    network_type: Sequelize.STRING,
    signal_strength: Sequelize.STRING,
    lastupdateTime: Sequelize.TIME,
    LAC: Sequelize.STRING,
    Cell_id: Sequelize.STRING,
    eNB_id:Sequelize.STRING,
    ECI: Sequelize.STRING,   
},{ timestamps: false,
    tableName:'nearbyCellinfo',
    // freezeTableName:false
});

module.exports = NearbyCellInfo;