import TableBlock from "../bean/block/TableBlock.js";
import {saveKey} from "../../../common/M.js";
import TableBackBlock from "../bean/block/TableBackBlock.js";
import idUtil from "../../../util/IdUtil.js"
import BlockType from "../bean/block/BlockType.js";
import CoordinateService from "./CoordinateService.js";
import NowTable from '../bean/NowTable.js'

/**
 * 桌面图标服务类
 */
export default class TableService{
    vm;
    constructor(vm) {
        this.vm = vm
    }
    /**@type NowTable*/
    nowTable; // 当前窗口

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

        this.vm.myCanvasService.removeFabricObj(block.fabricObj);
        this.vm.coordinateService.removeBlock(block);
        this.vm.myCanvasService.renderAll();
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
            // 创建错面数据并保存
            await this.createNowTable(this.nowTable, name);

            // 创建桌面图标并保存
            await this.createTableBlock(name);

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

        await NowTable.saveInstance(nowTableNew, this.vm.loginMode, this.vm.username, this.vm.password)
    }

    async createTableBlock(name){
        let tableBlock = await TableBlock.newInstance(this.vm, name);
        tableBlock.setLeft(this.vm.rightMouseXTemp - (CoordinateService.blockWidth / 2 + CoordinateService.marginLeft))
        tableBlock.setTop(this.vm.rightMouseYTemp - (CoordinateService.blockHeight / 2 + CoordinateService.marginTop))
        // 当前位置创建一个图标
        this.addBlock(tableBlock)
    }
}