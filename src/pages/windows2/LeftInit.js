import LinkBlock from "./bean/block/LinkBlock";
import RightMenu from "./bean/RightMenu/RightMenu";
import RightMenuItem from "./bean/RightMenu/RightMenuItem";
import TableBackBlock from "./bean/block/TableBackBlock";
import {fabric} from "fabric";
import XYUtil from "../../util/XYUtil.js"
export default{
    checkLongPress(num, x, y){
        setTimeout(()=>{
            let length = XYUtil.computeLength(x, y, this.mouseX, this.mouseY);
            if(length < 50 && this.mousedownNum == num){
                this.actionEvent(x, y, true)
            }
        }, 500)
        // for(let i = 0 ; i < 5 ; i++){
        //     setTimeout(()=>{
        //         let length = XYUtil.computeLength(x, y, this.mouseX, this.mouseY);
        //         if(length > 50){
        //             this.mousedownNum++;
        //         }
        //     }, 50 + (i * 100))
        // }
    },
    /** 左键事件注册 */
    async leftClickRegist(){
        this.myCanvasService.canvas.on('mouse:move', async (options)=> {
            this.mouseX = options.pointer.x;
            this.mouseY = options.pointer.y;
        })
        this.myCanvasService.canvas.on('mouse:down', async (options)=> {
            let x = options.pointer.x
            let y = options.pointer.y
            let rightMenuItem = this.myCanvasService.chooseOneRightMenuItem(x, y);
            if(rightMenuItem && rightMenuItem.text == "发送到"){

            }else{
                this.rightMenuService.closeAll()
                // this.mousedown = true;
                // let block = this.myCanvasService.chooseOneBlock(x, y)
                // if(block){
                //     block.borderFabricObj.set("fill", "rgba(1,1,1,0.1)")
                // }
                this.checkLongPress(this.mousedownNum, x, y)
            }
        });

        this.myCanvasService.canvas.on('mouse:up', async (options)=> {
            // this.mousedown = false;
            // this.timeFrame.longPressAction = false
            this.mousedownNum++;
        });

        // this.myCanvasService.canvas.on('object:moving', async (options)=> {
        //     console.log("object:moving")
        // });
        this.myCanvasService.canvas.on('selection:created', async (options)=> {
            // console.log("selection:created", options)
            // options.target.set({hasRotatingPoint: false})
            // options.target.set("hasRotatingPoint", false)
            if(options.target && options.target.block){
                options.target.block.showBackground();
            }
        });
        this.myCanvasService.canvas.on('selection:updated', function (options) {
            // options.target.set({hasRotatingPoint: false})
            // options.target.set("hasRotatingPoint", false)
            // console.log("selection:updated", options)
            if(options.deselected && options.deselected.length > 0){
                for(let itemObj of options.deselected){
                    if(itemObj && itemObj.block){
                        itemObj.block.closeBackground();
                    }
                }
            }
            if(options.selected && options.selected.length > 0){
                for(let itemObj of options.selected){
                    if(itemObj && itemObj.block){
                        itemObj.block.showBackground();
                    }
                }
            }

        })
        this.myCanvasService.canvas.on('selection:cleared', async (options)=> {
            // console.log("selection:cleared", options)
            if(options.deselected && options.deselected.length > 0){
                for(let itemObj of options.deselected){
                    if(itemObj && itemObj.block){
                        itemObj.block.closeBackground();
                    }
                }
            }
        });
        // this.myCanvasService.canvas.on('mouse:up', async (options)=> {
        //     // if(this.manyChoose == true){
        //     //     // this.coordinateService.reset()
        //     //     console.log("this.manyChoose == true mouse:up")
        //     // }
        //     console.log(this.myCanvasService.canvas.globalCompositeOperation)
        // });
        // this.myCanvasService.canvas.on('event:dragleave', async (options)=> {
        //     console.log("event:dragleave")
        // });

    },
}