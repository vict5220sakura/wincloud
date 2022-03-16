import BlockType from "./BlockType";
import Block from "./Block.js"

/**桌面返回blcok*/
export default class TableBackBlock extends Block{
    name = "返回"
    constructor(vm){
        super(vm);
        this.blockType = BlockType.type_tableBlock_back;
    }
    getText(){
        return this.name;
    }
    /** @abstract 图标双击事件*/
    getMouseDoubleupFunc(){
        return async ()=>{
            if(this.vm.tableService.nowTable && this.vm.tableService.nowTable.parentsKey){
                await this.vm.openTableKey(this.vm.tableService.nowTable.parentsKey)
            }
        }
    }
    /** @abstract 默认图标地址 */
    getDefaultBackgroundImg(){
        return "/img/back1.png";
    }
    static async newInstance(vm){
        let block = new this(vm);
        await block.init();
        return block;
    }
    static async newInstanceJson(vm, json){
        return await TableBackBlock.newInstance(vm);
    }

}