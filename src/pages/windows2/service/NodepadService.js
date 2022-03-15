import NodepadBlock from "../bean/block/NodepadBlock";
import Table from "../bean/Table";

/**
 * 记事本服务类
 */
export default class NodepadService{
    vm;
    /**@type NodepadBlock*/
    nodepadBlock;

    constructor(vm) {
        this.vm = vm
    }
    /** 取消点击*/
    nodepadCancelClick(){
        this.nodepadBlock = null;
        this.vm.nodepadFlag = false
        this.vm.nodepadTitle = null;
        this.vm.nodepadBody = null;
    }
    /** 展示*/
    showNodepad(nodepadBlock){
        this.nodepadBlock = nodepadBlock
        this.vm.nodepadFlag = true
        if(this.nodepadBlock){
            this.vm.nodepadTitle = this.nodepadBlock.title;
            this.vm.nodepadBody = this.nodepadBlock.body;
        }else{
            this.vm.nodepadTitle = null;
            this.vm.nodepadBody = null;
        }
    }
    /** 保存点击 */
    async nodepadSaveClick(){
        let top;
        let left;
        let title = this.vm.nodepadTitle;
        let body = this.vm.nodepadBody;

        if(!title || title.trim() == ""){
            title = "记事本";
        }

        if(this.nodepadBlock){ // 如果是更新 先删除原先的
            top = this.nodepadBlock.getTop()
            left = this.nodepadBlock.getLeft()
            this.vm.myCanvasService.removeBlock(this.nodepadBlock)
        }else{
            top = this.vm.rightMouseYTemp - (Table.blockHeight / 2 + Table.marginTop)
            left = this.vm.rightMouseXTemp - (Table.blockWidth / 2 + Table.marginLeft)
        }
        this.nodepadBlock = await NodepadBlock.newInstance(this.vm, title, body);
        this.nodepadBlock.setTop(top)
        this.nodepadBlock.setLeft(left)
        this.vm.myCanvasService.addBlock(this.nodepadBlock)

        // 保存
        // this.blockAutoArrange();
        // await this.save();
        // this.autoSaveNotify();

        // 关闭
        this.vm.nodepadFlag = false
        this.vm.nodepadTitle = null;
        this.vm.nodepadBody = null;
    }
}