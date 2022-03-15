import Block from "./Block.js"
import BlockType from "./BlockType.js"
import RightMenuItem from "../RightMenu/RightMenuItem";
import Table from "../Table";

export default class NodepadBlock extends Block{
    title;
    body;
    constructor(vm){
        super(vm);
        this.blockType = BlockType.type_nodepad;
    }
    getText(){
        return this.title;
    }
    getDefaultBackgroundImg(){
        return "/img/nodepad.png"
    }
    getRightMenuItemList(){
        let list = []
        list.push(RightMenuItem.newInstance(this.vm, "修改", (opts)=>{
            this.vm.nodepadService.showNodepad(this)
        }))
        list.push(RightMenuItem.newInstance(this.vm, "删除", (opts)=>{
            this.vm.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                this.vm.myCanvasService.removeBlock(this)
                // await this.save();
                // this.autoSaveNotify();
            }).catch((e) => {
                console.log(e)
            });
        }))
        return list;
    }

    static async newInstance(vm, title, body){
        let block = new this(vm);
        block.title = title
        block.body = body
        await block.init();
        return block;
    }
}