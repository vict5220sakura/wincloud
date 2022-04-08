import {fabric} from "fabric";
import RightMenuItem from "./RightMenuItem";
import Menu from "./Menu";

/** 右键菜单 */
export default class RightMenu extends Menu{
    constructor(vm) {
        super(vm)
    }
    heightFill(){
        return -this.getHeight()
    }
}