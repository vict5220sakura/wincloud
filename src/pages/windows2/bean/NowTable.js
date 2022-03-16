import Block from "./block/Block";
import TableSaveData from "../entity/TableSaveData";

/**
 * 当前桌面对象
 */
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
}