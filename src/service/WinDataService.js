import Api from '@/util/Api.js'
import {saveKey} from "../common/M.js"
import TableData from "../bean/TableData.js"

/**窗口数据服务 */
export default class WinDataService{
    /**
     * 保存数据
     */
    static async saveWinData(username, password, winDataStr){
        let res = await Api.post("saveWinData", {username, password, winDataStr})
        return res;
    }

    /**
     * 保存数据
     * @returns {Promise<void>}
     */
    static async saveTable(username, password, tableData/**@type TableData*/){
        if(!username){
            // 本地存储
            localStorage.setItem(saveKey, jsonarrStr)
        }else{
            // 远程存储
        }
    }
    
}