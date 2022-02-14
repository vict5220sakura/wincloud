import AllItem from "./AllItem.js"

export default class CanvasWork{
    id=null; // canvas dom id
    canvasDom=null // canvas dom
    canvasContext=null; // 2d canvasContext
    
    width=null;
    height=null;
    
    constructor(id, width, height){
        this.id = id;
        this.width = width;
        this.height = height;
        this.canvasDom=document.getElementById(this.id);
        this.canvasContext=this.canvasDom.getContext("2d");
    }

    allItem = new AllItem();

    /** 刷新 */
    flush(){
        this.removeAll()
        this.drawAll()
    }

    /** 添加一个元素 */
    addImg(imgItem, x, y){
        this.allItem.add(imgItem, x, y);
        this.flush();
    }

    /** 画一张图片 */
    drawImg(imgItem, location){
        this.canvasContext.drawImage(imgItem.img, location.x, location.y);   //在画布X轴 50  Y轴坐标50 处添加一张图片
    }

    drawAll(){
        for(let item of this.allItem.allItem){
            let location = this.allItem.allLocation[item.id];
            
            this.drawImg(item, location)
        }
    }

    removeAll(){
        this.canvasContext.clearRect(0, 0, this.width, this.height);
    }

    // removeImg(imgItem){
    //     this.canvasContext.clearRect(imgItem.x, imgItem.y, imgItem.width, imgItem.height);
    // }

    /**
     * 选中当前坐标Item
     */
    chooseItem(x, y){
        
    }

    /**
     * 边框检测 
     * @returns boolean
     */
    checkBorder(){

    }
}