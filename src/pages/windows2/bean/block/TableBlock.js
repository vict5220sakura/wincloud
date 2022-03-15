import BlockType from "./BlockType";
import Block from "./Block.js"

/**桌面blcok*/
export default class TableBlock extends Block{
    key = null; // 存储key
    name = null; // 桌面名称
    parentsKey = null;//
    constructor(vm){
        super(vm);
        this.blockType = BlockType.type_tableBlock;
    }
    /** @abstract 文本*/
    getText(){
        return this.name;
    }
    /** @abstract 默认图标地址 */
    getDefaultBackgroundImg(){
        return "/img/table.png";
    }
    /** @abstract 菜单列表
     * @return RightMenuItem[]
     * */
    getRightMenuItemList(){
        return undefined;
    }
    /** @abstract 图标双击事件*/
    getMouseDoubleupFunc(){
        return async()=>{
            await this.openTableKey(this.key)
        }
    }
}