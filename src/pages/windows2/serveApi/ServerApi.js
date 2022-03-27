import Api from "../../../util/Api";

/**
 * 服务类
 */
export default class ServerApi{
    /**
     * 登录注册
     * @return {b: true, msg:"", registLoginMode: "regist"|"login"}
     */
    static async registLogin(username, password){
        let res =  await Api.post("registLogin", {username, password})
        if(res.code == '00000'){
            return {b: true, msg:"", registLoginMode: res.registLoginMode}
        }else{
            return {b: false, msg:"用户名或密码错误"}
        }
    }
    /**
     * 获取桌面列表
     * @return {b: true, msg:"", list:[{key, type, parentsKey}]}
     */
    static async getTableList(username, password){
        let res =  await Api.post("getTableList", {username, password})
        if(res.code == '00000'){
            return {b: true, msg:"", list: res.data.list}
        }else{
            return {b: false, msg:""}
        }
    }
    /**
     * 获取桌面数据
     * @return {b: true, msg:"", data:{name, key, type, allBlock}}]}
     */
    static async getTableData(username, password, key){
        let res =  await Api.post("getTableData", {username, password, key})
        if(res.code == '00000'){
            return {b: true, msg:"", data: res.data}
        }else{
            return {b: false, msg:""}
        }
    }
    /**
     * 保存桌面数据
     * @return {b: true, msg:"", list:[{key, type, parentsKey}]}
     */
    static async saveTableData(username, password, key, type, allBlock, name, parentsKey){
        let res =  await Api.post("saveTableData", {username, password, key, type, allBlock, name, parentsKey})
        if(res.code == '00000'){
            return {b: true, msg:""}
        }else{
            return {b: false, msg:""}
        }
    }
}