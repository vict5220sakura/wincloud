import {fabric} from "fabric";
import BlockType from "../block/BlockType";
import SendOtherTableMenu from "./SendOtherTableMenu";

/** 右键菜单项 */
export default class RightMenuItem{
    left;
    top;
    vm;
    height=25;
    text="-";

    fabricObj;
    textFabric;
    backgroundFabric;

    mouseoverFunc; // 鼠标移动方法
    mouseoutFunc; // 鼠标移出方法
    mousedownFunc; // 鼠标点击方法

    /**@type Menu*/
    fatherMenu;

    /**@type SecondMenu*/
    secondMenu;

    constructor(vm) {
        this.vm = vm
    }

    init(){
        this.textFabric = new fabric.Text(this.text, {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
        })

        this.backgroundFabric = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.backgroundFabric.hasControls = false;
        this.backgroundFabric.hasBorders = false;
        this.backgroundFabric.selectable = false;

        this.fabricObj = new fabric.Group([this.backgroundFabric, this.textFabric], {})
        this.fabricObj.hasControls = false;
        this.fabricObj.hasBorders = false;
        this.fabricObj.selectable = false;
        this.fabricObj.set("rightMenuItem", this)
        this.fabricObj.on('mouseover', (opts) => {
            this.mouseover(opts);
        });
        this.fabricObj.on('mouseout', (opts) => {
            this.mouseout(opts);
        });
        this.fabricObj.on('mousedown', (opts) => {
            this.mousedown(opts);
        });

        return this;

    }

    static newInstance(vm, text, mousedownFunc, secondMenu /**@type SecondMenu*/){
        let rightMenuItem = new this(vm);
        rightMenuItem.text = text
        rightMenuItem.mousedownFunc = mousedownFunc
        if(secondMenu){
            rightMenuItem.secondMenu = secondMenu
            secondMenu.fatherRightMenuItem = rightMenuItem
        }

        rightMenuItem.init();

        return rightMenuItem;
    }

    /**
     * 发送到其他桌面菜单
     * @param vm
     * @returns {RightMenuItem}
     */
    static newSendOtherTableMenuItem(vm){
        let rightMenuItem = RightMenuItem.newInstance(vm, "发送到", ()=>{
            // vm.rightMenuService.closeAll()

            vm.myCanvasService.activeObject(vm.rightCheckBlock)
        }, new SendOtherTableMenu(vm));
        return rightMenuItem;
    }

    setTop(top){
        this.top = top
        this.fabricObj.set("top", top || 0)
    }

    setLeft(left){
        this.left = left
        this.fabricObj.set("left", left || 0)
    }
    getTop(){
        return this.fabricObj.top
    }
    getLeft(){
        return this.fabricObj.left
    }
    getWidth(){
        return this.fabricObj.width
    }

    addWithUpdate(){
        try{
           this.fabricObj.addWithUpdate()
        }catch(err){}
    }

    mouseover(opts){
        if(this.mouseoverFunc){
            this.mouseoverFunc(opts);
        }else{
            this.mouseoverDefault()
        }
    }
    mouseoverDefault(){
        // 关闭其他
        for(let menuItem /**@type RightMenuItem*/of this.fatherMenu.itemList){
            if(menuItem.secondMenu && menuItem.secondMenu.isOpen() && menuItem.secondMenu != this.secondMenu){
                menuItem.secondMenu.close();

            }
        }

        if(this.secondMenu){
            this.secondMenu.show()
        }
        this.backgroundFabric.set("fill", '#ffffff')
        this.vm.myCanvasService.renderAll();
    }
    mouseout(opts){
        if(this.mouseoutFunc){
            this.mouseoutFunc(opts);
        }else{
            this.mouseoutDefault()
        }
    }
    mouseoutDefault(){
        if(this.secondMenu){
            if(this.secondMenu.isOpen()){

            }else{
                this.secondMenu.close()
            }
        }
        this.backgroundFabric.set("fill", '#eeeeee')
        this.vm.myCanvasService.renderAll();
    }
    mousedown(opts){
        if(this.mousedownFunc){
            this.mousedownFunc(opts)
        }
    }
    close(){
        if(this.secondMenu){
            this.secondMenu.close()
        }
        this.backgroundFabric.set("fill", '#eeeeee')
        this.vm.myCanvasService.renderAll();
    }
}