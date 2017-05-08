let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var Target = sequelize.define('target',{
    phone:{type:Sequelize.STRING, primaryKey: true},
    created_time:Sequelize.TIME,
    ismonitor:Sequelize.CHAR(1),   
},{ timestamps: false,
    tableName:'target',
    // freezeTableName:false
});

module.exports = Target;