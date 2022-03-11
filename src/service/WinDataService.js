import Api from '../util/Api.js'
import {saveKey} from "../common/M.js"
import TableData from "../bean/TableData.js"
import LoginService from "../service/LoginService.js"

/**窗口数据服务 */
export default class WinDataService{

    /**
     *
     * @param username 用户名
     * @param password 密码
     * @param tableData
     * @returns {Promise<*>}
     */
    static async tableDataSave(username, password, tableData /**@type TableData*/){
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

    static async tableDataLoad(username, password, key){
        let tableData; /**@type TableData*/
        if(key){
            let res = await Api.post("getWinDataChildren", {username, password, key})
            console.log("加载tableData res", res)
            if(!res || res.code != "00000"){
                throw "api未知异常"
            }
            tableData = JSON.parse(res.data.tableDataStr);
            // console.log("加载tableData", tableData)
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