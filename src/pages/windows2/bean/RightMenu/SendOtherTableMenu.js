import SecondMenu from "./SecondMenu";
import RightMenuItem from "./RightMenuItem";
import BlockType from "../block/BlockType";

/**
 * 发送到其他窗口菜单
 */
export default class SendOtherTableMenu extends SecondMenu{
    constructor(vm) {
        super(vm)
    }

    show(){
        super.clearItem();

        for(let table /**@type NowTable*/ of this.vm.tableService.tableList){
            if(table.key == this.vm.tableService.nowTable.key){
                continue
            }
            if(this.vm.rightCheckBlock.blockType == BlockType.type_tableBlock
                && this.vm.rightCheckBlock.key == table.key){
                continue
            }
            super.addItem(RightMenuItem.newInstance(this.vm, table.name, ()=>{
                this.vm.rightMenuService.closeAll()
                this.vm.tableService.moveBlock(this.vm.rightCheckBlock, table.key)
            }))
        }
        super.show();
    }
    close(){
        super.close()
    }
}