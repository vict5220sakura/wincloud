import { get } from 'lodash'
import Api from "../../../util/Api";
/**
 * 远程服务
 */
export default class ServerService{
    /**
     * 登录注册
     * @return {b: true, msg:"", registLoginMode: "regist"|"login"}
     */
    async registLogin(username, password){
        let res =  await Api.post("registLogin", {username, password})
        if(res.code == '00000'){
            return {b: true, msg:"", registLoginMode: res.registLoginMode}
        }else{
            return {b: false, msg:"用户名或密码错误"}
        }
    }
    /**
     * 获取桌面列表
     * @return {b: true, msg:"", list:[{key, type, parentsKey, name}]}
     */
    async getTableList(username, password){
        let res =  await Api.post("getTableList", {username, password})
        if(res.code == '00000'){
            return {b: true, msg:"", list: get(res, 'data.list', null)}
        }else{
            return {b: false, msg:""}
        }
    }
    /**
     * 获取桌面数据
     * @return {b: true, msg:"", data:{name, key, type, allBlock}}]}
     */
    async getTableData(username, password, key){
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
    async saveTableData(username, password, key, type, allBlock, name, parentsKey){
        let res =  await Api.post("saveTableData", {username, password, key, type, allBlock, name, parentsKey})
        if(res.code == '00000'){
            return {b: true, msg:""}
        }else{
            return {b: false, msg:""}
        }
    }
    /**
     * 移动图标
     * @return {b: true, msg:""}
     */
    async moveBlock(username, password, fromTableKey, blockKey, toTableKey){
        let res =  await Api.post("moveBlock", {username, password, fromTableKey, blockKey, toTableKey})
        if(res.code == '00000'){
            return {b: true, msg:""}
        }else{
            return {b: false, msg:""}
        }
    }

    /**
     * 删除桌面
     * @return {b: true, msg:""}
     */
    async removeTable(username, password, tableKey){
        let res =  await Api.post("removeTable", {username, password, tableKey})
        if(res.code == '00000'){
            return {b: true, msg:""}
        }else{
            return {b: false, msg:""}
        }
    }
}