import Api from "../../../util/Api";
import Sha1 from "../../../util/Sha1"
import LocalDbService from "./LocalDbService"
import { get } from 'lodash'
import ServerService from "./ServerService"

/**
 * 数据服务
 */
export default class DataService{
    vm;
    db;
    /** @type LocalDbService */
    localDbService;
    /** @type ServerService */
    serverService;

    constructor(vm) {
        this.vm = vm;
        this.db = this.vm.$db;

        let time1 = setInterval(()=>{
            if(this.vm.localDbService != null && this.vm.localDbService != undefined){
                clearInterval(time1);
                this.localDbService = this.vm.localDbService;
                console.log("this.vm.localDbService", this.vm.localDbService)
            }
        }, 200);
        let time2 = setInterval(()=>{
            if(this.vm.serverService != null && this.vm.serverService != undefined){
                clearInterval(time2);
                this.serverService = this.vm.serverService;
                console.log("this.vm.serverService", this.vm.serverService)
            }
        }, 200);
    }

    /** 初始化全部本地db数据 */
    async loadAllLoaclData(username, password){
        // 获取全部桌面数据
        let {b, msg, list /** @type NowTable[] */} = await this.serverService.getTableList(username, password);

        let allPromise = [];
        for(let nowTable of list){
            this.localDbService.insertTableDb(nowTable.key, nowTable.parentsKey, nowTable.type, nowTable.name)
            let promiseItem = new Promise(async(r)=>{
                /** {b: true, msg:"", data:{name, key, type, allBlock}}]} */
                let {b, msg, data} = await this.serverService.getTableData(username,password,nowTable.key);
                for(let blockItem of data.allBlock){
                    this.localDbService.insertBlockDb(nowTable.key, blockItem)
                }
                r();
            })
            allPromise.push(promiseItem)
        }
        await new Promise((r)=>{
            Promise.all(allPromise).then(() => {
                r()
            })
        })
    }

    /**
     * 登录注册
     * @return {b: true, msg:"", registLoginMode: "regist"|"login"}
     */
    async registLogin(username, password){
        return await this.serverService.registLogin(username, password)
    }

    /**
     * 获取桌面列表
     * @return {b: true, msg:"", list:[{key, type, parentsKey, name}]}
     */
    async getTableList(username, password){
        return this.localDbService.getTableList()
        // return await this.serverService.getTableList(username, password)
    }

    /**
     * 获取桌面数据
     * @return {b: true, msg:"", data:{name, key, type, allBlock}}]}
     */
    async getTableData(username, password, key){
        return this.localDbService.getTableData(key)
        // return await this.serverService.getTableData(username, password, key)
    }

    /**
     * 保存桌面数据
     * @return {b: true, msg:"", list:[{key, type, parentsKey}]}
     */
    async saveTableData(username, password, key, type, allBlock, name, parentsKey){
        let data = this.localDbService.saveTableData(key, type, allBlock, name, parentsKey)
        setTimeout(async()=>{
            await this.serverService.saveTableData(username, password, key, type, allBlock, name, parentsKey)
        },0)
        return data;
    }

    /**
     * 移动图标
     * @return {b: true, msg:""}
     */
    async moveBlock(username, password, fromTableKey, blockKey, toTableKey){
        let data =  this.localDbService.moveBlock(fromTableKey, blockKey, toTableKey)
        setTimeout(async()=>{
            await this.serverService.moveBlock(username, password, fromTableKey, blockKey, toTableKey)
        },0)
        return data;
    }

    /**
     * 删除桌面
     * @return {b: true, msg:""}
     */
    async removeTable(username, password, tableKey){
        let data = this.localDbService.removeTable(tableKey)
        setTimeout(async()=>{
            await this.serverService.removeTable(username, password, tableKey)
        },0)
        return data;
    }
}