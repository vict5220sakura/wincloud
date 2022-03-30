export default class XYUtil{
    static checkPointIn(x, y, checkX, checkY, width, height){
        if(x > checkX && x < checkX + width && y > checkY && y < checkY + height){
            return true;
        }else{
            return false;
        }
    }
    static computeLength(x, y, x1, y1){
        return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1))
    }
}