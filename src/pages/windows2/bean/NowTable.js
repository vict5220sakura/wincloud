import TableBlock from "./block/TableBlock.js";
import {login_mode, saveKey} from "../../../common/M";
import Api from "../../../util/Api";
import LoginService from "../../../service/LoginService";

export default class NowTable{
    name = null; // 桌面名称
    key = null; // 存储key
    parentsKey = null; //父标签key
    type = NowTable.type_defaule;
    static type_defaule = 1; // 默认桌面
    static type_children = 2; // 子桌面

    /**
     * @type {Block[]}
     */
    allBlock = []; // 全部图标

    static async loadInstance(key, loginMode, username, password){
        if(loginMode == login_mode.login_mode_local){
            return NowTable.localStorageLoadInstance(key)
        }else if(loginMode == login_mode.login_mode_serve){
            return await NowTable.serviceLoadInstance(username, password, key);
        }
    }

    static async saveInstance(nowTable/**@type NowTable*/, loginMode, username, password){
        if(loginMode == login_mode.login_mode_local){
            NowTable.localStorageSaveInstance(nowTable)
        }else if(loginMode == login_mode.login_mode_serve){
            await NowTable.serviceSaveInstance(username, password, nowTable)
        }
    }

    static localStorageLoadInstance(key){
        if(key){
            // key有值
            let str = localStorage.getItem(key);
            let nowTable = (str && JSON.parse(str)) || new NowTable()
            return nowTable;
        }else{
            let str = localStorage.getItem(saveKey);
            let nowTable = (str && JSON.parse(str)) || new NowTable()
            return nowTable;
        }
    }
    static localStorageSaveInstance(nowTable /**@type NowTable*/){
        let jsonStr = JSON.stringify(nowTable);
        if(nowTable.key){
            // key有值
            localStorage.setItem(nowTable.key, jsonStr);
        }else{
            localStorage.setItem(saveKey, jsonStr);
        }
    }

    /**
     *
     * @param username 用户名
     * @param password 密码
     * @param tableData
     */
    static async serviceSaveInstance(username, password, nowTable /**@type NowTable*/){
        if(nowTable.type == NowTable.type_defaule){
            let winDataStr = JSON.stringify(nowTable.allBlock);
            let res = await Api.post("saveWinData", {username, password, winDataStr})
            if(!res || res.code != "00000"){
                throw "api未知异常"
            }
            return;
        }else if(nowTable.type == TableBlock.type_children){
            let tableDataStr = JSON.stringify(nowTable);
            let res = await Api.post("saveWinDataChildren",
                {username, password, key: nowTable.key, tableDataStr})
            if(!res || res.code != "00000"){
                throw "api未知异常"
            }
            return;
        }

    }

    static async serviceLoadInstance(username, password, key){
        let nowTable; /**@type NowTable*/
        if(key){
            let res = await Api.post("getWinDataChildren", {username, password, key})
            if(!res || res.code != "00000"){
                throw "api未知异常"
            }
            nowTable = JSON.parse(res.data.tableDataStr);
        }else{
            let res = await LoginService.registLogin(username, password);
            if(res.code == '00000'){
                nowTable = new NowTable();
                nowTable.allBlock = (res.data.winData && JSON.parse(res.data.winData)) || []
            }
        }
        return nowTable;
    }
}