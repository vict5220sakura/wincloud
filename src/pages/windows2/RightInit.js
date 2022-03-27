import {fabric} from "fabric";

export default {
    /** 右键事件注册 */
    rightClickRegist(){
        document.getElementsByClassName("upper-canvas")[0].oncontextmenu = (e)=>{
            // 记录右键临时位置
            this.rightMouseXTemp = e.offsetX;
            this.rightMouseYTemp = e.offsetY;

            this.rightMenuService.closeAll();

            let block /**@type Block*/ = this.myCanvasService.chooseOneBlock(this.rightMouseXTemp, this.rightMouseYTemp)
            this.rightCheckBlock = block
            if(block && block.rightMenu){
                // 展示对象菜单
                block.rightMenu.show()
            }else{
                // 展示桌面右键菜单
                this.tableRightMenu.show();
            }

            e.preventDefault(); // 取消右键事件
        };
    },

}