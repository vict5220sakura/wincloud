import Block from "../bean/block/Block";
import NowTable from "../bean/NowTable";
import BlockType from "../bean/block/BlockType";
import LinkBlock from "../bean/block/LinkBlock";
import NodepadBlock from "../bean/block/NodepadBlock";
import TableBlock from "../bean/block/TableBlock";
import TableBackBlock from "../bean/block/TableBackBlock";
import WsChatBlock from "../bean/block/WsChatBlock";

export default class TableSaveData{
    name;
    key;
    parentsKey;
    type = NowTable.type_defaule;
    allBlock = [];
    constructor(json /**@type TableSaveData*/) {
        if(json){
            this.name = json.name;
            this.key = json.key;
            this.parentsKey = json.parentsKey;
            this.type = json.type;
            this.allBlock = json.allBlock;
        }
    }

    /**
     * @param vm
     * @returns NowTable
     */
    async toNowTable(vm){
        let nowTable = new NowTable();
        nowTable.name = this.name;
        nowTable.key = this.key;
        nowTable.parentsKey = this.parentsKey;
        nowTable.type = this.type;
        nowTable.allBlock = []
        for(let blockJson of this.allBlock){
            let block = await TableSaveData.parse(vm, blockJson);
            block.setLeft(blockJson.left || 0)
            block.setTop(blockJson.top || 0)
            nowTable.allBlock.push(block)
        }
        return nowTable;
    }

    /**
     * @return Block
     */
    static async parse(vm, json /**@type TableSaveData*/){
        if (json.blockType == BlockType.type_link) {
            return await LinkBlock.newInstanceJson(vm, json)
        }else if(json.blockType == BlockType.type_nodepad){
            return await NodepadBlock.newInstanceJson(vm, json)
        }else if(json.blockType == BlockType.type_tableBlock){
            return await TableBlock.newInstanceJson(vm, json)
        }else if(json.blockType == BlockType.type_tableBlock_back){
            return await TableBackBlock.newInstanceJson(vm, json)
        }else if(json.blockType == BlockType.type_wsChat){
            return await WsChatBlock.newInstanceJson(vm, json)
        }
    }
}