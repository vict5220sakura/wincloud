import Item from './Item.js'

/**
 * 文本组件
 */
 export default class Text extends Item{
    text = null; // 文本
    font = '14px sans-serif' // 字体
    constructor(text){
        super();
        this.text = text;
    }

    async setSize(width, height){
        this.width = width;
        this.height = height;
    }
}