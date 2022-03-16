import {fabric} from "fabric";
import XYUtil from "../../../util/XYUtil";
import Block from "../bean/block/Block.js"

/**
 * canvas服务类
 */
export default class MyCanvasService{
    vm;
    canvas;

    constructor(vm) {
        this.vm = vm
        // 创建画布
        this.canvas = new fabric.Canvas("myCanvas")
        this.canvas.selection = false; // 禁止画布滑动选中
        this.canvas.hoverCursor = 'default' // 鼠标样式
        this.canvas.moveCursor = 'default' // 鼠标样式

        // 设置背景图片
        fabric.Image.fromURL('/img/img0_3840x2160.jpg', (oImg)=>{
            oImg.set({
                scaleX: this.vm.windowWidth / oImg.width,
                scaleY: this.vm.windowHeight / oImg.height
            })
            this.canvas.setBackgroundImage(oImg);
            this.canvas.renderAll();
        });
    }

    /** 选取一个对象 */
    /**@type Block*/
    chooseOneBlock(x, y) {
        let block;
        for (let fabricObj of this.canvas.getObjects()) {
            if (XYUtil.checkPointIn(x, y, fabricObj.left, fabricObj.top, fabricObj.width, fabricObj.height)) {
                if(fabricObj.block){
                    block = fabricObj.block
                    block.fabricObj = fabricObj;
                    break;
                }
            }
        }
        return block;
    }
    /** 添加一个图标 */
    addBlock(block /**@type Block*/){
        this.addFabricObj(block.fabricObj);
        this.vm.tableBlockService.addBlock(block)
        this.vm.coordinateService.addBlock(block);
        this.vm.coordinateService.reset();
        this.renderAll();
    }
    removeBlock(block /**@type Block*/){
        this.removeFabricObj(block.fabricObj);
        this.vm.tableBlockService.removeBlock(block)
        this.vm.coordinateService.removeBlock(block);
        this.renderAll();
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
        this.canvas.remove(fabric);
    }
    /** 刷新全部对象*/
    renderAll(){
        this.canvas.renderAll();
    }
    /** 取消选择所有对象 */
    discardActiveObject(){
        this.canvas.discardActiveObject();
    }
}