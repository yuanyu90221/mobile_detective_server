let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var Contacts = sequelize.define('contacts',{
    IMEI:{type:Sequelize.STRING, primaryKey: true},
    Name: Sequelize.STRING,
    Phone_No: Sequelize.STRING,
    exist: Sequelize.CHAR(1),
    Time: Sequelize.STRING,   
},{ timestamps: false,
    tableName:'contacts',
    // freezeTableName:false
});

module.exports = Contacts;