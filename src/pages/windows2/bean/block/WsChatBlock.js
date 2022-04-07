import BlockType from "./BlockType";
import Block from "./Block.js"
import {saveKey, login_mode} from '../../../../common/M.js'
import Api from "../../../../util/Api";
import RightMenuItem from "../RightMenu/RightMenuItem";
import ServerApi from "../../serveApi/ServerApi";


/**桌面blcok*/
export default class TableBlock extends Block{
    code = null; // 聊天室code

    constructor(vm, blockKey){
        super(vm, blockKey);
        this.blockType = BlockType.type_wsChat;
    }
    /** @abstract 文本*/
    getText(){
        return this.code;
    }
    /** @abstract 默认图标地址 */
    getDefaultBackgroundImg(){
        return "/img/chat.png";
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
            this.vm.wsChatDialogFlag = true;
            this.vm.wsChatCode = this.code;
        }
    }

    getRightMenuItemList(){
        let list = []
        list.push(RightMenuItem.newInstance(this.vm, "打开", async (opts)=>{
            this.vm.wsChatDialogFlag = true;
            this.vm.wsChatCode = this.code;
        }))
        // list.push(RightMenuItem.newInstance(this.vm, "修改", (opts)=>{
        //     this.vm.$prompt('请输入桌面名称', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         inputValue: this.name
        //     }).then(async(input) => {
        //         let newname = input.value;
        //         let top = this.getTop();
        //         let left = this.getLeft();
        //         this.vm.tableService.removeBlock(this)
        //         let newTableBlock = await TableBlock.newInstance(this.vm, newname, this.key, this.blockKey);
        //         newTableBlock.setLeft(left)
        //         newTableBlock.setTop(top)
        //         this.vm.tableService.addBlock(newTableBlock)
        //         this.vm.save()
        //         this.vm.autoSaveNotify();
        //     })
        // }))
        list.push(RightMenuItem.newInstance(this.vm, "删除", (opts)=>{

            this.vm.$confirm('此操作将删除桌面('+this.name+')全部数据', '删除桌面('+this.name+')', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                this.vm.tableService.removeBlock(this)

                // 刷新当前桌面列表
                setTimeout(async ()=>{
                    // 删除当前桌面
                    await ServerApi.removeTable(this.vm.username, this.vm.password, this.key)
                    this.vm.save()
                    this.vm.autoSaveNotify();
                    await this.vm.tableService.initTableList(this.vm.username, this.vm.password)
                },0)
            }).catch((e) => {
                throw e;
            });
        }))
        list.push(RightMenuItem.newSendOtherTableMenuItem(this.vm));
        return list;
    }

    static async newInstance(vm, code, blockKey){
        let block = new this(vm, blockKey);
        block.code = code;
        await block.init();
        return block;
    }

    static async newInstanceJson(vm, json){
        return await TableBlock.newInstance(vm, json["code"], json["blockKey"]);
    }
}