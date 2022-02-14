import Location from "./Location.js"

/**
 * 全部组件
 */
export default class AllItem{
    allItem = []; // 全部组件
    allItemMap = {}; // 全部组件
    allLocation = {}; // 全部坐标map

    idIndex = 0;

    constructor(){}

    /**
     * 创建一个id
     * @returns 创建一个id
     */
    newId(){
        this.idIndex++;
        return this.idIndex;
    }

    /** 添加一个item */
    add(item, x, y){
        // 重叠检测
        // if(this.checkIsOverlap(item, x, y)){
        //     return "重叠";
        // }

        item.id = this.newId(); // 新建一个id

        // 创建一个坐标
        let location = new Location();
        location.x = x;
        location.y = y;

        this.allItem.push(item);
        this.allItemMap[item.id] = item;
        this.allLocation[item.id] = location;
    }

    /** 重叠检测 */
    checkIsOverlap(item, x, y){
        for(let itemExist of this.allItem){
            let itemExistLocation = this.allLocation[itemExist.id]
            
            if(AllItem.checkIsOverLapOne(item, x, y, itemExist, itemExistLocation.x, itemExistLocation.y)){
                return true;
            }
        }
        return false;
    }

    /** 判断是否重叠 */
    static checkIsOverLapOne(itema, ax, ay, itemb, bx, by){
        if(((ax + itema.width) < bx || (bx + itemb.width) < ax) || ((ay + itema.height) < by || (by + itemb.height) < ay)){
            // 不重叠
            return false;
        }else{
            // 重叠
            return true;
        }
    }

    /** 根据坐标获取一个item */
    selectItemByXY(x, y){
        for(let i = this.allItem.length - 1; i >= 0; i--){
            let item = this.allItem[i]
            let location = this.allLocation[item.id]

            if(AllItem.checkIsXYInItem(item, location, x, y)){
                return {item, location};
            }
        }
        return {};
    }

    static checkIsXYInItem(item, location, x, y){
        if(location.x <= x && x <= location.x + item.width && location.y <= y && y <= location.y + item.height){
            return true;
        }else{
            return false;
        }
    }
}