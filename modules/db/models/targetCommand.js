let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var TargetCommand = sequelize.define('targetCommand',{
    IMEI:{type:Sequelize.STRING, primaryKey: true},
    commandType: Sequelize.STRING,
    commandString: Sequelize.STRING
},{ timestamps: false,
    tableName:'targetCommand',
    // freezeTableName:false
});

module.exports = TargetCommand;