import BlockType from "./BlockType";
import Block from "./Block.js"

/**桌面blcok*/
export default class TableBlock extends Block{
    key = null; // 存储key
    name = null; // 桌面名称
    parentsKey = null;//
    constructor(){
        super();
        this.blockType = BlockType.type_tableBlock;
    }
}