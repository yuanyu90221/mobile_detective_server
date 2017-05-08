let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var ConnectedCellInfo = sequelize.define('conntedCellinfo',{
    IMEI:{type:Sequelize.STRING, primaryKey: true},
    network_type: Sequelize.STRING,
    signal_strength: Sequelize.STRING,
    lastupdateTime: Sequelize.TIME,
    LAC: Sequelize.STRING,
    Cell_id: Sequelize.STRING,
    eNB_id:Sequelize.STRING,
    ECI: Sequelize.STRING,   
},{ timestamps: false,
    tableName:'conntedCellinfo',
    // freezeTableName:false
});

module.exports = ConnectedCellInfo;