let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
var _FS = sequelize.define('FS',{
    filename:{type:Sequelize.STRING, primaryKey: true},
    phoneNumber:Sequelize.STRING,
    imei:Sequelize.STRING,
    sim:Sequelize.STRING,
    carrier_code: Sequelize.STRING,
    build:Sequelize.STRING,
    addtime: Sequelize.TIME,
    isprocess: Sequelize.STRING,
    group_num: Sequelize.STRING   
},{ timestamps: false,
    tableName:'FS',
    // freezeTableName:false
});

module.exports = _FS;