import BlockType from "./BlockType";
import Block from "./Block.js"

/**桌面返回blcok*/
export default class TableBackBlock extends Block{
    name = "返回"
    constructor(){
        super();
        this.blockType = BlockType.type_tableBlock_back;
    }
}