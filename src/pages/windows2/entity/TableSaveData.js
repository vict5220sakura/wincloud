import Block from "../bean/block/Block";
import NowTable from "../bean/NowTable";

export default class TableSaveData{
    name;
    key;
    parentsKey;
    type;
    allBlock = [];
    constructor(json) {
        this.name = json.name;
        this.key = json.key;
        this.parentsKey = json.parentsKey;
        this.type = json.type;
        this.allBlock = json.allBlock;
    }
    async toNowTable(vm){
        let nowTable = new NowTable();
        nowTable.name = this.name;
        nowTable.key = this.key;
        nowTable.parentsKey = this.parentsKey;
        nowTable.type = this.type;
        nowTable.allBlock = []
        for(let blockJson of this.allBlock){
            nowTable.allBlock.push(await Block.parse(vm, blockJson))
        }
        return nowTable;
    }
}