import {fabric} from "fabric";

export default {
    /** 右键事件注册 */
    rightClickRegist(){
        document.getElementsByClassName("upper-canvas")[0].oncontextmenu = (e)=>{
            this.actionEvent(e.offsetX, e.offsetY)
            e.preventDefault(); // 取消右键事件
        };
    },

    actionEvent(x, y, isLongPress){
        // 记录右键临时位置
        this.rightMouseXTemp = x;
        this.rightMouseYTemp = y;

        this.rightMenuService.closeAll();

        let block /**@type Block*/ = this.myCanvasService.chooseOneBlock(this.rightMouseXTemp, this.rightMouseYTemp)
        this.rightCheckBlock = block
        if(block && block.rightMenu){
            // 展示对象菜单
            this.myCanvasService.discardActiveObject(); // 取消所有对象选中状态
            this.myCanvasService.activeObject(block)
            this.myCanvasService.renderAll()
            block.rightMenu.show(isLongPress)
        }else{
            // 展示桌面右键菜单
            this.tableRightMenu.show(isLongPress);
        }
    }

}