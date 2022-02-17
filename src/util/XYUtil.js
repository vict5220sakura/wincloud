export default class XYUtil{
    static checkPointIn(x, y, checkX, checkY, width, height){
        if(x > checkX && x < checkX + width && y > checkY && y < checkY + height){
            return true;
        }else{
            return false;
        }
    }
}