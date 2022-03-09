import {fabric} from "fabric";

export default {
    /** 右键事件注册 */
    rightClickRegist(){
        document.getElementsByClassName("upper-canvas")[0].oncontextmenu = (e)=>{
            console.log("鼠标右键e=", e)

            let chooseObj = this.fabricChooseObj(e.offsetX, e.offsetY);

            if(chooseObj){
                console.log("选中对象", chooseObj)
                // 移除菜单
                this.closeAllBlockMenu();
                // 展示对象菜单
                this.fabricShowBlockMenu(chooseObj, e.offsetX, e.offsetY);
            }else{
                console.log("没有选中任何对象")
                // 展示桌面右键菜单
                this.showTableRightMenu(e.offsetX, e.offsetY)
            }

            e.preventDefault(); // 取消右键事件
        };
    },

}