import {fabric} from "fabric";
import RightMenuItem from "./RightMenuItem";

/** 右键菜单 */
export default class RightMenu{
    vm;
    left;
    top;
    fabricObj;

    /**@type RightMenuItem[]*/
    itemList=[]

    constructor(vm) {
        this.vm = vm
        this.fabricObj = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.fabricObj.hasControls = false;
        this.fabricObj.hasBorders = false;
        this.fabricObj.selectable = false;
        this.regist()
    }

    /** 注册组件*/
    regist(){
        this.vm.rightMenuService.add(this)
    }
    /** 销毁组件*/
    destroy(){
        this.vm.rightMenuService.remove(this)
    }

    setHeight(height){
        this.fabricObj.set("height", height)
        this.fabricObj.addWithUpdate()
    }
    addRightMenuItem(text, mousedownFunc){
        let rightMenuItem = new RightMenuItem(this.vm);
        rightMenuItem.text = text
        rightMenuItem.mousedownFunc = mousedownFunc
        rightMenuItem.init();
        this.addItem(rightMenuItem);
    }
    addItem(rightMenuItem /**@type RightMenuItem*/){
        this.itemList.push(rightMenuItem)
    }
    setHeight(height){
        this.fabricObj.set("height", height || 0)
    }
    setTop(top){
        this.top = top
        this.fabricObj.set("top", top || 0)
    }

    setLeft(left){
        this.left = left
        this.fabricObj.set("left", left || 0)
    }
    addWithUpdate(){
        try{
            this.fabricObj.addWithUpdate()
        }catch(err){}
    }

    /**
     * 显示菜单
     * @param x 坐标
     * @param y 坐标
     */
    show(x, y) {
        if(!x){
            x = this.vm.rightMouseXTemp
        }
        if(!y){
            y = this.vm.rightMouseYTemp
        }
        this.vm.myCanvasService.discardActiveObject(); // 取消所有对象选中状态
        this.setLeft(x)
        this.setTop(y)
        this.setHeight(this.itemList.length * 25)
        // this.closeAllBlockMenu();

        this.vm.myCanvasService.addFabricObj(this.fabricObj);
        this.addWithUpdate()
        let topIndex = 0
        for (let menuItem of this.itemList) {
            menuItem.setLeft(x)
            menuItem.setTop(y + (menuItem.height * topIndex))
            this.vm.myCanvasService.addFabricObj(menuItem.fabricObj);
            menuItem.addWithUpdate()
            topIndex++;
        }
    }
    /** 关闭菜单 */
    close() {
        this.vm.myCanvasService.removeFabricObj(this.fabricObj);
        for (let menuItem of this.itemList) {
            menuItem.mouseout()
            this.vm.myCanvasService.removeFabricObj(menuItem.fabricObj);
        }
        this.vm.myCanvasService.renderAll();
    }
}