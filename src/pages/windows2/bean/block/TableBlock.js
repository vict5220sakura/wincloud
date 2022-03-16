import BlockType from "./BlockType";
import Block from "./Block.js"
import {saveKey, login_mode} from '../../../../common/M.js'
import Api from "../../../../util/Api";
import LoginService from "../../../../service/LoginService";
import RightMenuItem from "../RightMenu/RightMenuItem";


/**桌面blcok*/
export default class TableBlock extends Block{
    name = null; // 桌面名称
    key = null; // 存储key

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
            await this.vm.openTableKey(this.key)
        }
    }

    getRightMenuItemList(){
        let list = []
        list.push(RightMenuItem.newInstance(this.vm, "修改", (opts)=>{
            this.vm.$prompt('请输入桌面名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: this.name
            }).then(async(input) => {
                let newname = input.value;
                let top = this.getTop();
                let left = this.getLeft();
                this.vm.tableService.removeBlock(this)
                let newTableBlock = await TableBlock.newInstance(this.vm, newname, this.key);
                newTableBlock.setLeft(left)
                newTableBlock.setTop(top)
                this.vm.tableService.addBlock(newTableBlock)
            })
        }))
        list.push(RightMenuItem.newInstance(this.vm, "删除", (opts)=>{
            this.vm.$confirm('此操作将删除桌面('+this.name+')全部数据', '删除桌面('+this.name+')', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                this.vm.tableService.removeBlock(this)
            }).catch((e) => {
                throw e;
            });
        }))
        return list;
    }

    static async newInstance(vm, name, key){
        let block = new this(vm);
        block.name = name;
        block.key = key
        await block.init();
        return block;
    }

    static async newInstanceJson(vm, json){
        return await TableBlock.newInstance(vm, json["name"], json["key"]);
    }
}