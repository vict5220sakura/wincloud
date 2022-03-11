import {saveKey, login_mode} from '../common/M.js'
import WinDataService from "../service/WinDataService.js"

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
            return await WinDataService.tableDataLoad(username, password, key);
        }
    }

    static saveInstance(tableData/**@type TableData*/, loginMode, username, password){
        if(loginMode == login_mode.login_mode_local){
            TableData.localStorageSaveInstance(tableData)
        }else if(loginMode == login_mode.login_mode_serve){
            WinDataService.tableDataSave(username, password, tableData)
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
}