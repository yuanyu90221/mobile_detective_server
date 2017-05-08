let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var BasicInfo = sequelize.define('basicinfo',{
    IMEI:Sequelize.STRING,
    Brand:{type:Sequelize.STRING,field:'Brand'},
    _Model:{type:Sequelize.STRING,allowNull:true,field:'Model'},
    Release: Sequelize.STRING,
    id:{type:Sequelize.BIGINT,primaryKey:true, autoIncrement: true},
    mccmnc: Sequelize.STRING
},{ timestamps: false,
    tableName:'basicinfo',
    // freezeTableName:false
});

module.exports = BasicInfo;