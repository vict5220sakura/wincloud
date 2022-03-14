import {fabric} from "fabric";
import BlockType from "./BlockType";

/** 右键菜单项 */
export default class RightMenuItem{
    left;
    top;
    vm;
    height=25;
    fabricObj;
    text="-";
    textFabric;
    backgroundFabric;
    mouseoverFunc; // 鼠标移动方法
    mouseoutFunc; // 鼠标移出方法
    mousedownFunc; // 鼠标点击方法

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
        this.fabricObj.on('mouseover', (opts) => {
            if(this.mouseoverFunc){
                this.mouseoverFunc(opts);
            }else{
                this.backgroundFabric.set("fill", '#ffffff')
                this.vm.myCanvasService.renderAll();
            }
        });
        this.fabricObj.on('mouseout', (opts) => {
            if(this.mouseoutFunc){
                this.mouseoutFunc(opts);
            }else{
                this.backgroundFabric.set("fill", '#eeeeee')
                this.vm.myCanvasService.renderAll();
            }
        });
        this.fabricObj.on('mousedown', (opts) => {
            if(this.mousedownFunc){
                this.mousedownFunc(opts)
            }
        });
    }
}