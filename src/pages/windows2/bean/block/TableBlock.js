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
            await this.openTableKey(this.key)
        }
    }
    setName(name){
        this.name = name
        this.textFabricObj.text = name
        console.log("this.textFabricObj", this.textFabricObj)
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
                this.setName(newname);
            })
        }))
        list.push(RightMenuItem.newInstance(this.vm, "删除", (opts)=>{
            this.vm.$confirm('此操作将删除桌面('+this.name+')全部数据', '删除桌面('+this.name+')', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                this.vm.myCanvasService.removeBlock(this)
            }).catch((e) => {
                console.log(e)
            });
        }))
        return list;
    }


    static async newInstance(vm, name){
        let block = new this(vm);
        block.name = name;
        await block.init();
        return block;
    }
    toJson(){
        let json = super.toJson();
        return json;
    }
}