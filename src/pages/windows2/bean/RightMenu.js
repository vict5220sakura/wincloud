import {fabric} from "fabric";

/** 右键菜单 */
export default class RightMenu{
    vm;
    left;
    top;
    fabricObj;
    constructor(vm) {
        this.vm = vm
        this.fabricObj = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.fabricObj.hasControls = false;
        this.fabricObj.hasBorders = false;
        this.fabricObj.selectable = false;
    }
    /**@type RightMenuItem[]*/
    itemList=[]

    setHeight(height){
        this.fabricObj.set("height", height)
        this.fabricObj.addWithUpdate()
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
        this.vm.myCanvasService.discardActiveObject(); // 取消所有对象选中状态
        this.setLeft(x)
        this.setTop(y)
        this.setHeight(this.itemList.length * 25)
        // this.closeAllBlockMenu();

        this.vm.myCanvasService.addFabric(this.fabric);
        this.addWithUpdate()
        let topIndex = 0
        for (let menuItem of this.itemList) {
            menuItem.setLeft(x)
            menuItem.setTop(y + (menuItem.height * topIndex))
            this.vm.myCanvasService.addFabric(menuItem.fabric);
            menuItem.addWithUpdate()
            topIndex++;
        }
    }
    /** 关闭菜单 */
    close() {
        this.vm.myCanvasService.removeFabric(this.fabricObj);
        for (let menuItem of this.itemList) {
            this.vm.myCanvasService.removeFabric(menuItem.fabric);
        }
        // for(let item of this.tableBlockMenuItembackgroundList){
        //     item.set("fill", '#eeeeee')
        // }
        this.vm.myCanvasService.renderAll();
    }
}