import LinkBlock from "./bean/block/LinkBlock";
import RightMenu from "./bean/RightMenu/RightMenu";
import RightMenuItem from "./bean/RightMenu/RightMenuItem";
import TableBackBlock from "./bean/block/TableBackBlock";
import {fabric} from "fabric";
export default{
    /** 左键事件注册 */
    async leftClickRegist(){
        this.myCanvasService.canvas.on('mouse:down', async (options)=> {
            let x = options.pointer.x
            let y = options.pointer.y
            this.rightMenuService.closeAll()
        });
    },
}