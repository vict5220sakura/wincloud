import TableBlock from "./block/TableBlock.js";
import {login_mode, saveKey} from "../../../common/M";
import Api from "../../../util/Api";
import LoginService from "../../../service/LoginService";
import Block from "./block/Block";
import TableSaveData from "../entity/TableSaveData";

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

    /**
     *
     * @returns {TableSaveData}
     */
    toTableSaveData(){
        let tableSaveData = new TableSaveData();
        tableSaveData.name = this.name;
        tableSaveData.key = this.key;
        tableSaveData.parentsKey = this.parentsKey;
        tableSaveData.type = this.type;
        tableSaveData.allBlock = []
        for(let block of this.allBlock){
            tableSaveData.allBlock.push(block.toJson())
        }
        return tableSaveData;
    }

    /**
     *
     * @param key
     * @param loginMode
     * @param username
     * @param password
     * @returns {NowTable}
     */
    static async loadInstance(vm, key, loginMode, username, password){
        let json;
        if(loginMode == login_mode.login_mode_local){
            json = NowTable.localStorageLoadInstance(key);
        }else if(loginMode == login_mode.login_mode_serve){
            json = await NowTable.serviceLoadInstance(username, password, key);
        }

        let tableSaveData = new TableSaveData(json);
        let nowTable = await tableSaveData.toNowTable(vm);
        return nowTable;
    }

    static async saveInstance(nowTable/**@type NowTable*/, loginMode, username, password){
        let tableSaveData = nowTable.toTableSaveData();
        if(loginMode == login_mode.login_mode_local){
            NowTable.localStorageSaveInstance(tableSaveData)
        }else if(loginMode == login_mode.login_mode_serve){
            await NowTable.serviceSaveInstance(username, password, tableSaveData)
        }
    }

    /**
     * @param key
     * @returns {TableSaveData}
     */
    static localStorageLoadInstance(key){
        if(key){
            // key有值
            let str = localStorage.getItem(key);
            let tableSaveData = (str && JSON.parse(str)) || new TableSaveData()
            return tableSaveData;
        }else{
            let str = localStorage.getItem(saveKey);
            let tableSaveData = (str && JSON.parse(str)) || new TableSaveData()
            return tableSaveData;
        }
    }
    static localStorageSaveInstance(tableSaveData /**@type TableSaveData*/){
        let jsonStr = JSON.stringify(tableSaveData)
        if(tableSaveData.key){
            // key有值
            localStorage.setItem(tableSaveData.key, jsonStr);
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
    static async serviceSaveInstance(username, password, tableSaveData /**@type TableSaveData*/){
        if(tableSaveData.type == NowTable.type_defaule){
            let winDataStr = JSON.stringify(tableSaveData.allBlock);
            let res = await Api.post("saveWinData", {username, password, winDataStr})
            if(!res || res.code != "00000"){
                throw "api未知异常"
            }
            return;
        }else if(tableSaveData.type == TableBlock.type_children){
            let tableDataStr = JSON.stringify(tableSaveData);
            let res = await Api.post("saveWinDataChildren",
                {username, password, key: tableSaveData.key, tableDataStr})
            if(!res || res.code != "00000"){
                throw "api未知异常"
            }
            return;
        }

    }

    /**
     * @param key
     * @returns {TableSaveData}
     */
    static async serviceLoadInstance(username, password, key){
        let tableSaveData; /**@type TableSaveData*/
        if(key){
            let res = await Api.post("getWinDataChildren", {username, password, key})
            if(!res || res.code != "00000"){
                throw "api未知异常"
            }
            tableSaveData = JSON.parse(res.data.tableDataStr);
        }else{
            let res = await LoginService.registLogin(username, password);
            if(res.code == '00000'){
                tableSaveData = new NowTable();
                tableSaveData.allBlock = (res.data.winData && JSON.parse(res.data.winData)) || []
            }
        }
        return tableSaveData;
    }
}