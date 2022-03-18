import {fabric} from "fabric";
import RightMenuItem from "./RightMenuItem";
import Menu from "./Menu";

/**
 * 二级菜单
 */
export default class SecondMenu extends Menu{
    /**@type RightMenuItem 父菜单项*/
    fatherRightMenuItem;
    constructor(vm) {
        super(vm)
    }
    getShowX() {
        return this.fatherRightMenuItem.getLeft() + this.fatherRightMenuItem.getWidth() - 1
    }
    getShowY() {
        return this.fatherRightMenuItem.getTop()
    }
}