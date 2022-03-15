import BlockPoint from "../bean/coordinate/BlockPoint.js";
import Point from "../bean/coordinate/Point.js";

export default class CoordinateService{
    vm;
    width = 1024; // 宽
    height = 768; // 高

    static blockWidth = 70; // 图标宽
    static blockHeight = 70; // 图标高
    static marginLeft = 10; // 左边距
    static marginTop = 20; // 上边距
    static marginRight = 10; // 左边距
    static marginBottom = 20; // 上边距

    /**@type BlockPoint[]*/
    allBlockPoint = []; // 全部图标点
    /**@type BlockPoint{x:{y: BlockPoint}}*/
    allBlockPointXYArr = {}; // 坐标点对应BlockPoint
    /**@type Block[]*/
    activeallBlockPoint = []; // 全部激活BlockPoint

    xArr = [];
    yArr = [];

    widthNum; // 横向数量
    heightNum; // 纵向数量

    constructor(vm) {
        this.vm = vm
        this.width = this.vm.windowWidth;
        this.height = this.vm.windowHeight;
        this.initAllPoint();
    }

    /** 初始化全部坐标点 */
    initAllPoint(){
        // 计算横向纵向数量
        this.widthNum = Math.floor((this.width) / (CoordinateService.blockWidth + CoordinateService.marginLeft + CoordinateService.marginRight))
        this.heightNum = Math.floor((this.height) / (CoordinateService.blockWidth + CoordinateService.marginTop + CoordinateService.marginBottom))

        // 初始化全部点
        for(let yIndex = 0; yIndex < this.heightNum; yIndex++){
            let y = yIndex * (CoordinateService.blockHeight + CoordinateService.marginTop + CoordinateService.marginBottom)
            this.yArr.push(y)
            for(let xIndex = 0; xIndex < this.widthNum; xIndex++){
                let x = xIndex * (CoordinateService.blockWidth + CoordinateService.marginLeft + CoordinateService.marginRight)
                this.xArr.push(x)
                let blockPoint = new BlockPoint(new Point(x, y))
                this.allBlockPoint.push(blockPoint)
                this.initXYArr(x, y)
                this.allBlockPointXYArr[x][y] = blockPoint
            }
        }
    }
    /** allPointXYArr 初始化一个点 */
    initXYArr(x, y){
        if(!this.allBlockPointXYArr[x]){
            this.allBlockPointXYArr[x] = {}
        }
    }

    /** 获取一个最近的 tablePoint*/
    getNearTablepoint(xIn, yIn){
        let firstPointXIndex = 0;
        let secondPointXIndex = 1;
        for(let xIndex in this.xArr){
            let x = this.xArr[xIndex]
            if(xIn >= x){
                firstPointXIndex = xIndex
            }
        }
        secondPointXIndex = Number(firstPointXIndex) + 1

        let firstPointX = this.xArr[firstPointXIndex];
        let secondPointX = this.xArr[secondPointXIndex] || firstPointX;


        let firstPointYIndex = 0;
        let secondPointYIndex = 1;
        for(let yIndex in this.yArr){
            let y = this.yArr[yIndex]
            if(yIn >= y){
                firstPointYIndex = yIndex
            }
        }
        secondPointYIndex = Number(firstPointYIndex) + 1

        let firstPointY = this.yArr[firstPointYIndex];
        let secondPointY = this.yArr[secondPointYIndex] || firstPointY;

        let l1 = this.getLength(firstPointX, firstPointY, xIn, yIn)
        let l2 = this.getLength(firstPointX, secondPointY, xIn, yIn)
        let l3 = this.getLength(secondPointX, firstPointY, xIn, yIn)
        let l4 = this.getLength(secondPointX, secondPointY, xIn, yIn)

        let finalx;
        let finaly;
        if (Math.min(l1, l2, l3, l4) == l1){
            finalx = firstPointX;
            finaly = firstPointY
        }else if(Math.min(l1, l2, l3, l4) == l2){
            finalx = firstPointX;
            finaly = secondPointY
        }else if(Math.min(l1, l2, l3, l4) == l3){
            finalx = secondPointX;
            finaly = firstPointY
        }else if(Math.min(l1, l2, l3, l4) == l4){
            finalx = secondPointX;
            finaly = secondPointY
        }

        return this.allBlockPointXYArr[finalx][finaly]
    }

    getLength(x1, y1, x2, y2){
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    /** 下一个point */
    nextTablePoint(thisBlockPoint){
        return this.allBlockPoint[this.allBlockPoint.indexOf(thisBlockPoint) + 1]
    }

    addBlock(block){
        let y = block.top
        let x = block.left
        let nearBlockpoint = this.getNearTablepoint(x, y);
        this.addBlockMain(block, nearBlockpoint)
    }
    removeBlock(block){
        let index = this.activeallBlockPoint.indexOf(block);
        if(index > -1){
            this.activeallBlockPoint.splice(index, 1)
            let blockPoint = block.blockPoint;
            block.blockPoint = null;
            blockPoint.block = null;
        }
    }

    addBlockMain(block, blockpoint){
        if(!blockpoint.block){
            blockpoint.block = block
            block.blockPoint = blockpoint
            this.activeallBlockPoint.push(blockpoint)
            return true;
        }else{
            return this.addBlockMain(block, this.nextTablePoint(blockpoint))
        }
    }

    activeBlock(){
        for(let blockPoint of this.activeallBlockPoint){
            blockPoint.block.top = blockPoint.point.y
            blockPoint.block.left = blockPoint.point.x

            blockPoint.block.setLeft(blockPoint.point.x || 0)
            blockPoint.block.setTop(blockPoint.point.y || 0)
            blockPoint.block.addWithUpdate()
        }
        this.vm.myCanvasService.renderAll();
    }
}