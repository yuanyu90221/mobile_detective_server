# mobile_detective_server
mobile_detective_server
## MOBLIE DETECTION SERVER
#   1.檔案結構
+   config/
+       config.js: DB設定
+       logs
+       *.log: log檔案
+       modules
+   db/
+       sequelize.js: dao 用來建立DB connection的物件
+   models/
+       basicinfo.js: 對應 basicinfo Table的物件
+       monitorControl.js: 對應 monitorControl Table的物件
+       target.js: 對應 target Table的物件
+       targetCommand.js: 對應 targetCommand Table的物件
+   logger/
+       log4js.js: log4js設定
+   router/
+       router.js: router功能
+   package.json: 紀錄project相關設定檔(1.lib dependency,2. npm script, 3. project的git ref)
+   README.md: 註解檔案
+   server.js: server主要邏輯
#   2.使用方式
+   安裝lib指令:`npm install`
+   執行server指令:`npm run start`
#   3.執行測試 
+   `npm run test`
