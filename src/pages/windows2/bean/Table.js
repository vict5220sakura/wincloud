import Point from './Point.js'
import TablePoint from './TablePoint.js'

export default class Table{
    width = 1024; // 宽
    height = 768; // 高
    blockWidth = 70; // 图标宽
    blockHeight = 70; // 图标高
    marginLeft = 10; // 左边距
    marginTop = 20; // 上边距
    marginRight = 10; // 左边距
    marginBottom = 20; // 上边距
    allTablePoint = []; // 全部图标点
    allTablePointXYArr = {};
    activeAllTablePoint = [];
    xArr = [];
    yArr = [];

    widthNum; // 横向数量
    heightNum; // 纵向数量

    /** 初始化全部坐标点 */
    initAllPoint(){
        // 计算横向纵向数量
        this.widthNum = Math.floor((this.width) / (this.blockWidth + this.marginLeft + this.marginRight)) 
        this.heightNum = Math.floor((this.height) / (this.blockWidth + this.marginTop + this.marginBottom))

        // 初始化全部点
        for(let yIndex = 0; yIndex < this.heightNum; yIndex++){
            let y = yIndex * (this.blockHeight + this.marginTop + this. marginBottom)
            this.yArr.push(y)
            for(let xIndex = 0; xIndex < this.widthNum; xIndex++){
                let x = xIndex * (this.blockWidth + this.marginLeft + this. marginRight)
                this.xArr.push(x)
                let tablePoint = new TablePoint(new Point(x, y))
                this.allTablePoint.push(tablePoint)
                this.initXYArr(x, y)
                this.allTablePointXYArr[x][y] = tablePoint
            }
        }
    }
    /** allPointXYArr 初始化一个点 */
    initXYArr(x, y){
        if(!this.allTablePointXYArr[x]){
            this.allTablePointXYArr[x] = {}
            
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

        return this.allTablePointXYArr[finalx][finaly]
    }

    getLength(x1, y1, x2, y2){
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    /** 下一个point */
    nextTablePoint(thisTablePoint){
        return this.allTablePoint[this.allTablePoint.indexOf(thisTablePoint) + 1]
    }

    addBlock(block){
        let y = block.top
        let x = block.left
        let nearTablepoint = this.getNearTablepoint(x, y);
        this.addBlockMain(block, nearTablepoint)
    }

    addBlockMain(block, tablepoint){
        if(!tablepoint.block){
            tablepoint.block = block
            this.activeAllTablePoint.push(tablepoint)
            return true;
        }else{
            return this.addBlockMain(block, this.nextTablePoint(tablepoint))
        }
    }

    activeBlock(){
        for(let tablePoint of this.activeAllTablePoint){
            tablePoint.block.top = tablePoint.point.y
            tablePoint.block.left = tablePoint.point.x

            tablePoint.block.set("left", tablePoint.point.x || 0)
            tablePoint.block.set("top", tablePoint.point.y || 0)
            tablePoint.block.addWithUpdate()
        }
    }
}