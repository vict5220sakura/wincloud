import LinkBlock from "./bean/block/LinkBlock";
import RightMenu from "./bean/RightMenu/RightMenu";
import RightMenuItem from "./bean/RightMenu/RightMenuItem";

export default{
    /** 左键事件注册 */
    async leftClickRegist(){
        this.canvas.on('mouse:down', async (options)=> {
            let x = options.pointer.x
            let y = options.pointer.y
            this.rightMenuService.closeAll()
        });
    },
}