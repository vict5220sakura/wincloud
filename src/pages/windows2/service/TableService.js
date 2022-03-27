import TableBlock from "../bean/block/TableBlock.js";
import {saveKey} from "../../../common/M.js";
import TableBackBlock from "../bean/block/TableBackBlock.js";
import idUtil from "../../../util/IdUtil.js"
import BlockType from "../bean/block/BlockType.js";
import CoordinateService from "./CoordinateService.js";
import NowTable from '../bean/NowTable.js'
import TableSaveDao from "../dao/TableSaveDao";
import ServeApi from "../serveApi/ServerApi.js"

/**
 * 桌面图标服务类
 */
export default class TableService{
    vm;
    constructor(vm) {
        this.vm = vm
    }
    /**@type NowTable[] 全部桌面*/
    tableList = [];

    /**@type NowTable 默认桌面*/
    defaultTable;

    /**@type NowTable*/
    nowTable; // 当前窗口

    /**
     * 初始化
     */
    async init(username, password){
        // 获取全部桌面列表
        let {b, msg, list} = await ServeApi.getTableList(username, password)
        for(let item of list){
            let obj = new NowTable();
            obj.key = item.key
            obj.name = item.name
            obj.parentsKey = item.parentsKey
            obj.type = item.type
            this.tableList.push(obj)

            if(item.type == NowTable.type_defaule){
                this.defaultTable = obj
            }
        }

        this.vm.openTableKey(this.defaultTable.key)
    }

    /** 添加一个图标 */
    addBlock(block /**@type Block*/){
        this.nowTable.allBlock.push(block)

        this.vm.myCanvasService.addFabricObj(block.fabricObj);
        this.vm.coordinateService.addBlock(block);
        this.vm.coordinateService.reset();
        this.vm.myCanvasService.renderAll();
    }
    removeBlock(block /**@type Block*/){
        let index = this.nowTable.allBlock.indexOf(block);
        if(index > -1){
            this.nowTable.allBlock.splice(index, 1)
        }

        this.vm.myCanvasService.removeFabricObj(block.textFabricObj)
        this.vm.myCanvasService.removeFabricObj(block.backgroundFabricObj)
        this.vm.myCanvasService.removeFabricObj(block.fabricObj);

        this.vm.coordinateService.removeBlock(block);
        this.vm.myCanvasService.renderAll();

        delete block.vm
        delete block.blockPoint;
        delete block.fabricObj; // fabric原生obj
        delete block.textFabricObj; // fabric原生obj
        delete block.backgroundFabricObj; // fabric原生obj
    }

    removeAllBlock(isDelBackBlock){
        if(!this.nowTable){
            return
        }
        let arr = []
        // let leave = []
        for(let block of this.nowTable.allBlock){
            arr.push(block);
        }
        for(let block of arr){
            if(!isDelBackBlock){
                if(block.blockType == BlockType.type_tableBlock_back){
                    // leave.push(block)
                    continue
                }
            }
            this.removeBlock(block)
        }
        // this.vm.myCanvasService.discardActiveObject();
        // this.vm.myCanvasService.clearCanvas();
        // this.vm.myCanvasService.initBackground();
        // for(let block of leave){
        //     this.addBlock(block)
        // }
        // this.vm.myCanvasService.renderAll()
    }

    /** 加载 */
    async load(nowTable/**NowTable*/) {
        this.nowTable = new NowTable()
        this.nowTable.name = nowTable.name
        this.nowTable.key = nowTable.key
        this.nowTable.parentsKey = nowTable.parentsKey
        this.nowTable.type = nowTable.type
        for(let block of nowTable.allBlock){
            this.addBlock(block)
        }
    }

    /**新建桌面*/
    menuAddTableMouseDown(){
        this.vm.$prompt('请输入桌面名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(async (data) => {
            let name = data.value;
            if(!name || name.trim() == ''){
                name = "桌面"
            }
            // 创建桌面数据并保存
            let nowTableNew = await this.createNowTable(this.nowTable, name);

            // 创建桌面图标并保存
            await this.createTableBlock(nowTableNew);

            // 保存
            await this.vm.save();
            this.vm.autoSaveNotify();

        }).catch((e) => {throw e});
    }


    /**
     * 创建一个当前桌面数据
     */
    async createNowTable(nowTable/**@type NowTable*/, name){
        let nowTableNew = new NowTable();
        nowTableNew.name = name
        nowTableNew.key = saveKey + "_" + idUtil();
        nowTableNew.parentsKey = nowTable.key
        nowTableNew.type = NowTable.type_children

        // 新桌面添加一个返回图标
        let tableBackBlock = await TableBackBlock.newInstance(this.vm);
        nowTableNew.allBlock.push(tableBackBlock)

        await TableSaveDao.saveInstance(nowTableNew, this.vm.loginMode, this.vm.username, this.vm.password)
        return nowTableNew;
    }

    async createTableBlock(nowTableNew /**@type NowTable*/){
        let tableBlock = await TableBlock.newInstance(this.vm, nowTableNew.name, nowTableNew.key);
        tableBlock.setLeft(this.vm.rightMouseXTemp - (CoordinateService.blockWidth / 2 + CoordinateService.marginLeft))
        tableBlock.setTop(this.vm.rightMouseYTemp - (CoordinateService.blockHeight / 2 + CoordinateService.marginTop))
        // 当前位置创建一个图标
        this.addBlock(tableBlock)
    }

}