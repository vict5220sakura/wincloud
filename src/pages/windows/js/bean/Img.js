import Item from './Item.js'

/**
 * 图片组件
 */
export default class Img extends Item{
    src=null; // 路径
    img=null; // Image对象
    constructor(src){
        super();
        this.src = src;
    }

    async setSize(width, height){
        this.width = width;
        this.height = height;
        // this.x = x;
        // this.y = y;

        this.img = new Image(this.width, this.height);
        this.img.src = this.src;

        await new Promise((r)=>{
            this.img.onload=()=>{
                r();
            };
        }) 
        
    }
}