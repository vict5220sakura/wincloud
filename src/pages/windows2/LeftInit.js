import LinkBlock from "./bean/LinkBlock";
import RightMenu from "./bean/RightMenu";
import RightMenuItem from "./bean/RightMenuItem";

export default{
    /** 左键事件注册 */
    leftClickRegist(){
        this.canvas.on('mouse:down', async (options)=> {
            let x = options.pointer.x
            let y = options.pointer.y
            // let rightMenu = new RightMenu(this);
            //
            // let rightMenuItem = new RightMenuItem(this);
            // rightMenuItem.text = "测试1"
            // rightMenuItem.init()
            //
            // rightMenu.addItem(rightMenuItem)
            //
            // let rightMenuItem2 = new RightMenuItem(this);
            // rightMenuItem2.text = "测试2"
            // rightMenuItem2.init()
            //
            // rightMenu.addItem(rightMenuItem2)
            //
            // rightMenu.show(x, y)
            // // this.closeAllBlockMenu();
            // setTimeout(()=>{
            //     rightMenu.close()
            // }, 2000)
        });
    },
}