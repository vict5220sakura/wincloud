import {saveKey, login_mode} from '../../../../common/M.js'
import Api from "../../../../util/Api";
import LoginService from "../../../../service/LoginService";

/**
 * 桌面数据
 */
export default class TableData{
    key = null;
    type = TableData.type_defaule;
    static type_defaule = 1; // 默认桌面
    static type_children = 2; // 子桌面
    name = null; // 桌面名称
    allBlock = []; // 全部图标
    parentsKey = null;//父标签key

    static async loadInstance(key, loginMode, username, password){
        if(loginMode == login_mode.login_mode_local){
            return await TableData.localStorageLoadInstance(key)
        }else if(loginMode == login_mode.login_mode_serve){
            return await TableData.serviceLoadInstance(username, password, key);
        }
    }

    static saveInstance(tableData/**@type TableData*/, loginMode, username, password){
        if(loginMode == login_mode.login_mode_local){
            TableData.localStorageSaveInstance(tableData)
        }else if(loginMode == login_mode.login_mode_serve){
            TableData.serviceSaveInstance(username, password, tableData)
        }
    }

    static localStorageLoadInstance(key){
        if(key){
            // key有值
            let str = localStorage.getItem(key);
            let tableData = (str && JSON.parse(str)) || new TableData()
            return tableData;
        }else{
            let str = localStorage.getItem(saveKey);
            let tableData = (str && JSON.parse(str)) || new TableData()
            return tableData;
        }
    }
    static localStorageSaveInstance(tableData/**@type TableData*/){
        let jsonStr = JSON.stringify(tableData);
        if(tableData.key){
            // key有值
            localStorage.setItem(tableData.key, jsonStr);
        }else{
            localStorage.setItem(saveKey, jsonStr);
        }
    }

    /**
     *
     * @param username 用户名
     * @param password 密码
     * @param tableData
     * @returns {Promise<*>}
     */
    static async serviceSaveInstance(username, password, tableData /**@type TableData*/){
        if(tableData.type == TableData.type_defaule){
            let winDataStr = JSON.stringify(tableData.allBlock);
            let res = await Api.post("saveWinData", {username, password, winDataStr})
            if(!res || res.code != "00000"){
                throw "api未知异常"
            }
            return;
        }else if(tableData.type == TableData.type_children){
            let tableDataStr = JSON.stringify(tableData);
            let res = await Api.post("saveWinDataChildren",
                {username, password, key: tableData.key, tableDataStr})
            if(!res || res.code != "00000"){
                throw "api未知异常"
            }
            return;
        }

    }

    static async serviceLoadInstance(username, password, key){
        let tableData; /**@type TableData*/
        if(key){
            let res = await Api.post("getWinDataChildren", {username, password, key})
            console.log("加载tableData res", res)
            if(!res || res.code != "00000"){
                throw "api未知异常"
            }
            tableData = JSON.parse(res.data.tableDataStr);
        }else{
            let res = await LoginService.registLogin(username, password);
            if(res.code == '00000'){
                tableData = new TableData();
                tableData.allBlock = (res.data.winData && JSON.parse(res.data.winData)) || []
            }
        }
        return tableData;
    }
}