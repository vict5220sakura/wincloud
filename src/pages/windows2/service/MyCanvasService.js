import {fabric} from "fabric";
import XYUtil from "../../../util/XYUtil";
import Block from "../bean/block/Block.js"

/**
 * canvas服务类
 */
export default class MyCanvasService{
    vm;
    canvas;
    isRenderLock = false;
    isRenderAll = false;

    constructor(vm) {
        this.vm = vm
        // 创建画布
        this.canvas = new fabric.Canvas("myCanvas")
        this.canvas.selection = false; // 是否允许画布滑动选中
        this.canvas.preserveObjectStacking = true; // 是否禁止选中对象到顶层
        this.canvas.selectionKey = ["ctrlKey", "shiftKey"]
        this.canvas.hoverCursor = 'default' // 鼠标样式
        this.canvas.moveCursor = 'default' // 鼠标样式

        this.initBackground();
    }
    // 设置背景图片
    initBackground(){
        fabric.Image.fromURL('/img/img0_3840x2160.jpg', (oImg)=>{
            oImg.set({
                scaleX: this.vm.windowWidth / oImg.width,
                scaleY: this.vm.windowHeight / oImg.height
            })
            this.canvas.setBackgroundImage(oImg);
            this.vm.renderAll()
        });
    }

    /** 探测一个对象 */
    /**@type Block*/
    chooseOneBlock(x, y) {
        let block;
        for (let fabricObj of this.canvas.getObjects()) {
            if (XYUtil.checkPointIn(x, y, fabricObj.left, fabricObj.top, fabricObj.width, fabricObj.height)) {
                if(fabricObj.block){
                    block = fabricObj.block
                    // block.fabricObj = fabricObj;
                    break;
                }
            }
        }
        return block;
    }

    /** 探测一个菜单 */
    /**@type RightMenuItem*/
    chooseOneRightMenuItem(x, y) {
        let rightMenuItem;
        for (let fabricObj of this.canvas.getObjects()) {
            if (XYUtil.checkPointIn(x, y, fabricObj.left, fabricObj.top, fabricObj.width, fabricObj.height)) {
                if(fabricObj.rightMenuItem){
                    rightMenuItem = fabricObj.rightMenuItem
                    // block.fabricObj = fabricObj;
                    break;
                }
            }
        }
        return rightMenuItem;
    }

    /**
     * 添加一个对象
     */
    addFabricObj(fabricObj){
        this.canvas.add(fabricObj);
    }
    /**
     * 移除一个对象
     */
    removeFabricObj(fabric){
        if(fabric){
            this.canvas.remove(fabric);
            this.canvas.remove(fabric);
            this.canvas.remove(fabric);
        }
    }
    /** 刷新全部对象*/
    renderAll(){
        this.isRenderAll = true
    }
    renderAllMain(){
        if(this.vm.myCanvasService.isRenderAll){
            console.log("刷新全部")
            this.vm.myCanvasService.isRenderAll = false
            // this.canvas.renderAll();
            this.canvas.requestRenderAll();

        }
    }
    /** 取消选择所有对象 */
    discardActiveObject(){
        this.canvas.discardActiveObject();
    }
    /** 主动选择对象 */
    activeObject(block /**@type Block*/){
        this.canvas.setActiveObject(block.fabricObj);
    }

    getActiveObjects(){
        return this.canvas.getActiveObjects();
    }

    clearCanvas(){
        this.canvas.clear();
    }
}