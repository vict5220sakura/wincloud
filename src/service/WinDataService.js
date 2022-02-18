import Api from '@/util/Api.js'

/**窗口数据服务 */
export default class WinDataService{
    /**
     * 保存数据
     */
    static async saveWinData(username, password, winDataStr){
        let res = await Api.post("saveWinData", {username, password, winDataStr})
        return res;
    }
    
}