import Img from './js/bean/Img.js'
import CanvasWork from './js/bean/CanvasWork.js';

export default {
    data(){
      return {
        windowWidth: 1024,
        windowHeight: 768   
      } 
    },
    methods:{
        
    },
    async mounted(){

        console.log(document.getElementById("myCanvas"))

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        console.log(this.windowWidth, this.windowHeight)

        let img = new Img("/img/green5050.png");
        await img.setSize(50, 50);

        let img2 = new Img("/img/red5050.png");
        await img2.setSize(50, 50);

        let canvasWork = new CanvasWork("myCanvas", this.windowWidth, this.windowHeight);

        canvasWork.addImg(img, 0, 0)
        canvasWork.addImg(img2, 25, 0)

        // // 去掉鼠标右键事件
        canvasWork.canvasDom.oncontextmenu = function(e){
            e.preventDefault();
        };

        let x; // 左键单击坐标
        let y; // 左键单击坐标
        let newx; // 移动的新坐标
        let newy; // 移动的新坐标
        let offsetx; // 点击偏移量
        let offsety; // 点击偏移量
        canvasWork.canvasDom.onmousedown=function (e1) {
            x = e1.clientX;
            y = e1.clientY;
            let {item, location} = canvasWork.allItem.selectItemByXY(x, y);
            

            if(item){ // 选中了item
                offsetx = x - location.x
                offsety = y - location.y
                canvasWork.canvasDom.onmousemove = function(e2){
                    newx = e2.clientX;
                    newy = e2.clientY;

                    // console.log("x=" + x, "newx=" + newx, "location.x=" + location.x)
                    
                    location.x = newx - offsetx//(location.x + newx - x)
                    
                    // console.log("移动后location.x=" + location.x)

                    location.y = newy - offsety//(location.y + newy - y)
                    //限制移动不能超出画布
                    canvasWork.flush();

                    //先清除之前的然后重新绘制
                    // cansText.clearRect(0,0,canva.width,canva.height);
            
                    // cansText.drawImage(img,x-75,y-50,150,100);
                }

                //鼠标抬起清除绑定事件
                canvasWork.canvasDom.onmouseup = function(){
                    canvasWork.canvasDom.onmousemove = null;
                    canvasWork.canvasDom.onmouseup = null;
                };
            }
        }
    }
}