import XYUtil from "../../../util/XYUtil";
import Block from "../bean/Block.js"

/**
 * canvas服务类
 */
export default class MyCanvasService{
    canvas;

    /**@type Block *[] */
    blockList=[];

    constructor(vm) {
        this.canvas = vm.canvas
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
        this.addFabric(block.fabricObj);
        this.blockList.push(block);
        this.renderAll();
    }
    /**
     * 添加一个对象
     */
    addFabric(fabric){
        this.canvas.add(fabric);
    }
    /**
     * 移除一个对象
     */
    removeFabric(fabric){
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