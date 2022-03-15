import LinkBlock from "./bean/block/LinkBlock";
import RightMenu from "./bean/RightMenu/RightMenu";
import RightMenuItem from "./bean/RightMenu/RightMenuItem";
import TableBackBlock from "./bean/block/TableBackBlock";

export default{
    /** 左键事件注册 */
    async leftClickRegist(){
        this.canvas.on('mouse:down', async (options)=> {
            let x = options.pointer.x
            let y = options.pointer.y
            this.rightMenuService.closeAll()

            this.myCanvasService.addBlock(await TableBackBlock.newInstance(this))
        });
    },
}