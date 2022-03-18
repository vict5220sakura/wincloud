import SecondMenu from "./SecondMenu";
import RightMenuItem from "./RightMenuItem";

/**
 * 发送到其他窗口菜单
 */
export default class SendOtherTableMenu extends SecondMenu{
    constructor(vm) {
        super(vm)
    }

    show(){
        super.clearItem();
        super.addItem(RightMenuItem.newInstance(this.vm, "1", ()=>{
            this.vm.rightMenuService.closeAll()
        }))
        super.addItem(RightMenuItem.newInstance(this.vm, "2", ()=>{
            this.vm.rightMenuService.closeAll()
        }))
        super.show();
    }
    close(){
        super.close()
    }
}