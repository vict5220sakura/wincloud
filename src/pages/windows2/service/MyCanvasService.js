import XYUtil from "../../../util/XYUtil";
import Block from "../bean/block/Block.js"

/**
 * canvas服务类
 */
export default class MyCanvasService{
    vm;
    canvas;

    /**@type Block *[] */
    blockList=[];

    constructor(vm) {
        this.canvas = vm.canvas
        this.vm = vm
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
        this.blockList.push(block);
        this.renderAll();
        this.vm.coordinateService.addBlock(block);
    }
    removeBlock(block){
        this.removeFabricObj(block.fabricObj);
        let index = this.blockList.indexOf(block);
        if(index > -1){
            this.blockList.splice(index, 1)
        }
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