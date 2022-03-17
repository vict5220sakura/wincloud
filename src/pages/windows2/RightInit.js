import {fabric} from "fabric";

export default {
    /** 右键事件注册 */
    rightClickRegist(){
        document.getElementsByClassName("upper-canvas")[0].oncontextmenu = (e)=>{
            console.log("右键点击时间" + new Date().getTime())
            // 记录右键临时位置
            this.rightMouseXTemp = e.offsetX;
            this.rightMouseYTemp = e.offsetY;

            this.rightMenuService.closeAll();

            let block = this.myCanvasService.chooseOneBlock(this.rightMouseXTemp, this.rightMouseYTemp)

            // let chooseObj = this.fabricChooseObj(e.offsetX, e.offsetY);

            if(block && block.rightMenu){
                // 展示对象菜单
                block.rightMenu.show()
                // this.fabricShowBlockMenu(chooseObj, e.offsetX, e.offsetY);
            }else{
                // console.log("没有选中任何对象")
                // 展示桌面右键菜单
                this.tableRightMenu.show();
                console.log("菜单展示后时间" + new Date().getTime())
                // this.showTableRightMenu(e.offsetX, e.offsetY)
            }

            e.preventDefault(); // 取消右键事件
        };
    },

}