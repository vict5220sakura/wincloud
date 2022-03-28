import {fabric} from "fabric";
import RightMenuItem from "./RightMenuItem";

export default class Menu{

    status=0;
    static status_open = 1;
    static status_close = 2;

    vm;

    left;
    top;
    fabricObj;

    /**@type RightMenuItem[]*/
    itemList=[]

    constructor(vm) {
        this.vm = vm
        this.fabricObj = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        // this.fabricObj = new fabric.Rect({ width: 100, height: 25, fill: '#111111' });
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
        rightMenuItem.fatherMenu = this
        this.itemList.push(rightMenuItem)
    }
    removeItem(rightMenuItem /**@type RightMenuItem*/){
        delete rightMenuItem.fatherMenu
        let index = this.itemList.indexOf(rightMenuItem);
        if(index > -1){
            this.itemList.splice(index, 1)
        }
        this.vm.myCanvasService.removeFabricObj(rightMenuItem.fabricObj);
    }
    clearItem(){
        if(this.itemList && this.itemList.length > 0){
            for(let item of this.itemList){
                this.vm.myCanvasService.removeFabricObj(item.fabricObj);
            }
        }

        this.itemList = []
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

    getShowX(){
        return this.vm.rightMouseXTemp
    }

    getShowY(){
        return this.vm.rightMouseYTemp
    }

    /**
     * 显示菜单
     * @param x 坐标
     * @param y 坐标
     */
    show() {
        this.status = Menu.status_open
        let x = this.getShowX();
        let y = this.getShowY();

        this.setLeft(x)
        this.setTop(y)
        this.setHeight(this.itemList.length * 25)

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
        this.vm.myCanvasService.renderAll()
    }
    /** 关闭菜单 */
    close() {
        this.status = Menu.status_close

        this.vm.myCanvasService.removeFabricObj(this.fabricObj);
        for (let menuItem of this.itemList) {
            menuItem.close()
            this.vm.myCanvasService.removeFabricObj(menuItem.fabricObj);
        }
        this.vm.myCanvasService.renderAll();
    }
    isOpen(){
        if(this.status == Menu.status_open){
            return true;
        }else{
            return false;
        }
    }
}